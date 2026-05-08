"use client"

import dynamic from "next/dynamic"
import { useCallback, useState, useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import DashboardHeader from "@/components/dashboard-header"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { recordWorkout } from "@/lib/actions"
import { celebratePR, celebrateAchievement } from "@/lib/celebrate"
import { ACHIEVEMENT_BY_CODE } from "@/lib/achievements"
import LiveFeedbackPanel from "@/components/live-feedback-panel"
import type { ExerciseType, Telemetry } from "@/components/pose-detector"

const PoseDetector = dynamic(() => import("@/components/pose-detector"), {
  ssr: false,
  loading: () => (
    <Card>
      <CardContent className="aspect-video grid place-items-center text-muted-foreground">
        Loading detector…
      </CardContent>
    </Card>
  ),
})

type ExMeta = {
  id: ExerciseType
  name: string
  emoji: string
  category: "lower" | "upper" | "core"
  tips: string[]
}

const EXERCISES: ExMeta[] = [
  {
    id: "squat",
    name: "Squats",
    emoji: "🦵",
    category: "lower",
    tips: ["Back straight", "Knees over toes", "Weight in heels", "Go as low as comfortable"],
  },
  {
    id: "lunge",
    name: "Lunges",
    emoji: "🏃",
    category: "lower",
    tips: ["Step long", "Front knee over ankle", "Drop the back knee", "Keep torso upright"],
  },
  {
    id: "gluteBridge",
    name: "Glute Bridge",
    emoji: "🌉",
    category: "lower",
    tips: ["Lie on your back", "Knees bent, feet flat", "Drive heels into floor", "Squeeze glutes at the top"],
  },
  {
    id: "pushup",
    name: "Push-ups",
    emoji: "💪",
    category: "upper",
    tips: ["Body in a straight line", "Hands wider than shoulders", "Lower to 90° elbow", "Core engaged"],
  },
  {
    id: "bicep",
    name: "Bicep Curls",
    emoji: "💥",
    category: "upper",
    tips: ["Elbows tucked", "Controlled motion", "Lower slowly", "No swinging"],
  },
  {
    id: "shoulderPress",
    name: "Shoulder Press",
    emoji: "🏋️",
    category: "upper",
    tips: ["Start with arms at shoulders", "Press straight overhead", "Lock out at the top", "Don't arch back"],
  },
  {
    id: "lateralRaise",
    name: "Lateral Raises",
    emoji: "🦅",
    category: "upper",
    tips: ["Slight elbow bend", "Raise to shoulder height", "Lead with elbows", "Lower slowly"],
  },
  {
    id: "tricepExtension",
    name: "Tricep Extension",
    emoji: "🔥",
    category: "upper",
    tips: ["Hold weight overhead", "Elbows tight, point up", "Lower behind head", "Extend fully"],
  },
  {
    id: "situp",
    name: "Sit-ups",
    emoji: "🧘",
    category: "core",
    tips: ["Knees bent", "Hands behind head or chest", "Sit all the way up", "Lower with control"],
  },
  {
    id: "crunch",
    name: "Crunches",
    emoji: "💢",
    category: "core",
    tips: ["Lower back stays down", "Lift shoulders off floor", "Exhale at the top", "Don't pull on neck"],
  },
]

const CATEGORIES: { id: ExMeta["category"] | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "lower", label: "Lower body" },
  { id: "upper", label: "Upper body" },
  { id: "core", label: "Core" },
]

export default function WorkoutPage() {
  const { toast } = useToast()
  const [exercise, setExercise] = useState<ExerciseType>("squat")
  const [filter, setFilter] = useState<ExMeta["category"] | "all">("all")
  const [, startTransition] = useTransition()
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null)

  const handleTelemetry = useCallback((t: Telemetry) => setTelemetry(t), [])

  const celebrate = (res: Awaited<ReturnType<typeof recordWorkout>>, reps: number, label: string) => {
    if (res.isPR) {
      celebratePR()
      toast({
        title: `🏆 New PR: ${reps} ${label}!`,
        description: `Previous best: ${res.previousBest}. +25 XP bonus!`,
      })
    } else {
      toast({
        title: `Saved ${reps} ${label}`,
        description: `+${res.xpEarned} XP · Level ${res.level} · ${res.xp} XP`,
      })
    }
    if (res.newAchievements.length > 0) {
      // Stagger so PR toast lands first
      setTimeout(() => {
        celebrateAchievement()
        for (const code of res.newAchievements) {
          const ach = ACHIEVEMENT_BY_CODE[code]
          if (!ach) continue
          toast({
            title: `${ach.emoji} Achievement unlocked`,
            description: `${ach.name} — ${ach.description}`,
          })
        }
      }, 600)
    }
  }

  const handleStop = ({ reps, durationSec }: { reps: number; durationSec: number }) => {
    if (reps <= 0) {
      toast({ title: "No reps detected", description: "Workout discarded." })
      return
    }
    startTransition(async () => {
      try {
        const res = await recordWorkout({ exercise, reps, durationSec })
        celebrate(res, reps, current.name.toLowerCase())
      } catch {
        toast({ title: "Failed to save", variant: "destructive" })
      }
    })
  }

  const current = EXERCISES.find((e) => e.id === exercise)!
  const visible = filter === "all" ? EXERCISES : EXERCISES.filter((e) => e.category === filter)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto max-w-6xl space-y-6">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Start a workout</h1>
              <p className="text-muted-foreground">Pick an exercise, fire up the camera, and let the AI count.</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              5 XP per rep
            </div>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium border transition",
                  filter === c.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-secondary",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Exercise grid */}
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {visible.map((e) => (
              <button
                key={e.id}
                onClick={() => setExercise(e.id)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition group",
                  exercise === e.id
                    ? "border-primary bg-primary/5 card-glow"
                    : "hover:border-primary/40 hover:bg-secondary/30",
                )}
              >
                <div className="text-2xl mb-1.5">{e.emoji}</div>
                <div className="font-semibold text-sm">{e.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  {e.category}
                </div>
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <PoseDetector
              exercise={exercise}
              onStop={handleStop}
              onTelemetry={handleTelemetry}
            />

            <div className="space-y-6">
              <LiveFeedbackPanel telemetry={telemetry} />

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <span className="text-lg">{current.emoji}</span>
                    Form tips · {current.name}
                  </div>
                  <ul className="text-sm space-y-2">
                    {current.tips.map((t) => (
                      <li key={t} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
