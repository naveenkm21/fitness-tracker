import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dumbbell,
  Trophy,
  Video,
  Flame,
  Activity,
  TrendingUp,
  Zap,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import ActivityHeatmap from "@/components/activity-heatmap"
import {
  getMyStats,
  getRecentWorkouts,
  getPersonalRecords,
  getMyAchievements,
  getHeatmap,
} from "@/lib/actions"
import { ACHIEVEMENTS, ACHIEVEMENT_BY_CODE, TIER_COLORS } from "@/lib/achievements"
import { cn } from "@/lib/utils"

const EXERCISE_LABELS: Record<string, { name: string; emoji: string }> = {
  squat: { name: "Squats", emoji: "🦵" },
  pushup: { name: "Push-ups", emoji: "💪" },
  bicep: { name: "Bicep Curls", emoji: "💥" },
  lunge: { name: "Lunges", emoji: "🏃" },
  shoulderPress: { name: "Shoulder Press", emoji: "🏋️" },
  lateralRaise: { name: "Lateral Raises", emoji: "🦅" },
  situp: { name: "Sit-ups", emoji: "🧘" },
  crunch: { name: "Crunches", emoji: "💢" },
  gluteBridge: { name: "Glute Bridge", emoji: "🌉" },
  tricepExtension: { name: "Tricep Extension", emoji: "🔥" },
}

export default async function DashboardPage() {
  const [stats, recent, prs, unlocked, heatmap] = await Promise.all([
    getMyStats(),
    getRecentWorkouts(10),
    getPersonalRecords(),
    getMyAchievements(),
    getHeatmap(91),
  ])
  if (!stats) return <div className="flex min-h-screen items-center justify-center">Loading…</div>

  const xpProgress = (stats.xp / stats.xpForNextLevel) * 100
  const unlockedCodes = new Set(unlocked.map((u) => u.code))

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto max-w-7xl space-y-8">
          {/* Hero */}
          <div className="relative rounded-3xl border overflow-hidden p-6 md:p-8 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-violet-500/10">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] items-center">
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">Welcome back</div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {stats.username} <span className="gradient-text">· Level {stats.level}</span>
                </h1>
                <div className="space-y-1.5 max-w-md">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">XP to level {stats.level + 1}</span>
                    <span className="font-medium">{stats.xp} / {stats.xpForNextLevel}</span>
                  </div>
                  <Progress value={xpProgress} className="h-2" />
                </div>
              </div>
              <Link href="/workout">
                <Button size="lg" className="gradient-bg text-white hover:opacity-90 group">
                  <Zap className="mr-2 h-4 w-4" />
                  Start workout
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
            <StreakCard streak={stats.streak} />
            <StatCard icon={Activity} label="Workouts" value={stats.totalWorkouts} grad="from-emerald-500/20 to-teal-500/20" />
            <StatCard icon={TrendingUp} label="Total reps" value={stats.totalReps} grad="from-cyan-500/20 to-blue-500/20" />
            <StatCard icon={Trophy} label="Achievements" value={`${unlocked.length}/${ACHIEVEMENTS.length}`} grad="from-yellow-500/20 to-amber-500/20" />
            <StatCard icon={Sparkles} label="Variety" value={`${stats.uniqueExercises}/10`} grad="from-violet-500/20 to-fuchsia-500/20" />
          </div>

          {/* Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Your last 13 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityHeatmap data={heatmap} weeks={13} />
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Achievements
              </CardTitle>
              <CardDescription>{unlocked.length} of {ACHIEVEMENTS.length} unlocked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                {ACHIEVEMENTS.map((a) => {
                  const isUnlocked = unlockedCodes.has(a.code)
                  return (
                    <div
                      key={a.code}
                      title={`${a.name} — ${a.description}`}
                      className={cn(
                        "rounded-2xl border p-4 text-center transition",
                        isUnlocked
                          ? `bg-gradient-to-br ${TIER_COLORS[a.tier]} text-white border-transparent`
                          : "bg-secondary/30 opacity-60",
                      )}
                    >
                      <div className="text-3xl mb-1.5 relative">
                        {isUnlocked ? a.emoji : <Lock className="h-6 w-6 mx-auto" />}
                      </div>
                      <div className="text-xs font-semibold leading-tight">{a.name}</div>
                      <div className={cn("text-[10px] mt-1 leading-tight", isUnlocked ? "text-white/80" : "text-muted-foreground")}>
                        {a.description}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* PRs + Recent activity */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Personal Records
                </CardTitle>
                <CardDescription>Your best single session per exercise</CardDescription>
              </CardHeader>
              <CardContent>
                {prs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No PRs yet — log a workout to set your first.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {prs.map((p) => {
                      const meta = EXERCISE_LABELS[p.exercise] ?? { name: p.exercise, emoji: "•" }
                      return (
                        <li
                          key={p.exercise}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{meta.emoji}</span>
                            <div>
                              <div className="font-medium">{meta.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {p.attempts} session{p.attempts === 1 ? "" : "s"}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-yellow-500">{p.bestReps}</div>
                            <div className="text-xs text-muted-foreground">best reps</div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
                <CardDescription>Your last 10 sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {recent.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Dumbbell className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    No workouts yet — start one to fill this up.
                  </div>
                ) : (
                  <ul className="divide-y divide-border/60">
                    {recent.map((w) => {
                      const meta = EXERCISE_LABELS[w.exercise] ?? { name: w.exercise, emoji: "•" }
                      return (
                        <li key={w.id} className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{meta.emoji}</span>
                            <div>
                              <div className="font-medium">{meta.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(w.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{w.reps} reps</div>
                            <div className="text-xs text-emerald-500">+{w.xpEarned} XP</div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, grad }: any) {
  return (
    <div className={`rounded-2xl border p-5 bg-gradient-to-br ${grad}`}>
      <Icon className="h-5 w-5 mb-3" />
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  )
}

function StreakCard({ streak }: { streak: number }) {
  const active = streak > 0
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 relative overflow-hidden",
        active
          ? "bg-gradient-to-br from-orange-500/30 to-rose-500/20 border-orange-500/30"
          : "bg-gradient-to-br from-orange-500/10 to-rose-500/10",
      )}
    >
      <Flame
        className={cn(
          "h-5 w-5 mb-3",
          active ? "text-orange-500" : "text-muted-foreground",
        )}
      />
      <div className="text-3xl font-bold">
        {streak} <span className="text-base font-normal text-muted-foreground">day{streak === 1 ? "" : "s"}</span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        {active ? "Streak — keep it going!" : "Start a streak today"}
      </div>
    </div>
  )
}
