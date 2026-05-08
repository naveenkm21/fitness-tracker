import { auth } from "@clerk/nextjs/server"
import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { createGroq } from "@ai-sdk/groq"
import {
  getMyStats,
  getRecentWorkouts,
  getPersonalRecords,
  getMyAchievements,
} from "@/lib/actions"
import { ACHIEVEMENT_BY_CODE } from "@/lib/achievements"

export const runtime = "nodejs"
export const maxDuration = 30

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

function buildSystemPrompt(
  stats: any,
  recent: any[],
  prs: any[],
  unlocked: any[],
  pageContext?: string,
) {
  const summary =
    recent.length === 0
      ? "The user has no logged workouts yet."
      : `Recent workouts (most recent first):\n` +
        recent
          .slice(0, 8)
          .map(
            (w) =>
              `- ${new Date(w.createdAt).toISOString().slice(0, 10)} · ${w.exercise} · ${w.reps} reps · ${w.durationSec}s · +${w.xpEarned} XP`,
          )
          .join("\n")

  return `You are FitCoach, a friendly, expert personal trainer inside a fitness app called FitTrack AI.

Your style:
- Warm but direct, like a real gym coach who knows the user.
- Concise. Use short paragraphs and bullet lists. Avoid long lectures.
- Encouraging without being saccharine. Celebrate progress, but don't over-do it.
- Give specific, actionable advice grounded in the user's actual data below.
- When the user asks for a workout plan, give a clear list with sets × reps and rest times.
- When they ask about form, give 3-5 cue-style bullets, not a textbook.
- If they ask something dangerous (heavy loads with no warm-up, overtraining, ignoring pain), push back with care.
- Never claim to be a doctor; recommend professional advice for medical/pain issues.
- The app supports rep-counted exercises via webcam pose detection: squats, lunges, glute bridge, push-ups, bicep curls, shoulder press, lateral raises, tricep extension, sit-ups, crunches. You can suggest these by name.
- Reference the user's streak, PRs, and achievements when relevant — don't list them all, just call out what's notable. If they're on a hot streak, hype it. If they're a few reps from a PR, point that out and challenge them.
- Each rep earns 5 XP. Levels scale at 100 × level × 1.5 XP.

User profile:
- Username: ${stats?.username ?? "athlete"}
- Level: ${stats?.level ?? 1}
- XP: ${stats?.xp ?? 0} / ${stats?.xpForNextLevel ?? 150}
- Total workouts: ${stats?.totalWorkouts ?? 0}
- Total reps: ${stats?.totalReps ?? 0}
- Workouts today: ${stats?.exercisesToday ?? 0}
- Current streak: ${stats?.streak ?? 0} days
- Exercise variety: ${stats?.uniqueExercises ?? 0}/10

Personal records:
${prs.length === 0 ? "(none yet)" : prs.map((p) => `- ${p.exercise}: ${p.bestReps} reps best`).join("\n")}

Recent achievements unlocked:
${
  unlocked.length === 0
    ? "(none yet)"
    : unlocked
        .slice(0, 8)
        .map((u) => {
          const a = ACHIEVEMENT_BY_CODE[u.code]
          return a ? `- ${a.emoji} ${a.name} (${a.description})` : `- ${u.code}`
        })
        .join("\n")
}

${summary}

${pageContext ? `Current screen: The user is currently on ${pageContext}. Tailor your first response to that context if it makes sense (e.g., on the Workout page, lean into form cues and rep schemes; on the Dashboard, focus on planning and progress).` : ""}

Use this context to tailor advice. If the user is just starting, recommend foundational moves. If they're consistent, push intensity. If you see an imbalance (e.g. only upper body), suggest balancing it.`
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  if (!process.env.GROQ_API_KEY) {
    return new Response("GROQ_API_KEY is not configured", { status: 500 })
  }

  const { messages, pageContext }: { messages: UIMessage[]; pageContext?: string } =
    await req.json()

  const [stats, recent, prs, unlocked] = await Promise.all([
    getMyStats(),
    getRecentWorkouts(20),
    getPersonalRecords(),
    getMyAchievements(),
  ])

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: buildSystemPrompt(stats, recent, prs, unlocked, pageContext),
    messages: await convertToModelMessages(messages),
    temperature: 0.6,
  })

  return result.toUIMessageStreamResponse()
}
