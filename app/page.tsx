import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Dumbbell,
  Activity,
  Flame,
  ScanLine,
  ArrowRight,
  Sparkles,
  Brain,
  Camera,
  ChartBar,
  Award,
  Heart,
  Zap,
  Star,
} from "lucide-react"
import LiveDemo from "@/components/landing/live-demo"

const EXERCISES = [
  { emoji: "🦵", name: "Squats" },
  { emoji: "💪", name: "Push-ups" },
  { emoji: "💥", name: "Bicep Curls" },
  { emoji: "🏃", name: "Lunges" },
  { emoji: "🏋️", name: "Shoulder Press" },
  { emoji: "🦅", name: "Lateral Raises" },
  { emoji: "🔥", name: "Tricep Extension" },
  { emoji: "🧘", name: "Sit-ups" },
  { emoji: "💢", name: "Crunches" },
  { emoji: "🌉", name: "Glute Bridge" },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="grid place-items-center h-8 w-8 rounded-lg gradient-bg text-white">
              <Dumbbell className="h-4 w-4" />
            </div>
            <span className="gradient-text">FitTrack AI</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">Features</a>
            <a href="#exercises" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">Exercises</a>
            <a href="#how" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">How it works</a>
            <Link href="/leaderboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">Leaderboard</Link>
          </nav>
          <div className="flex gap-2">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="gradient-bg text-white hover:opacity-90">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative w-full pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
          {/* Backdrop layers */}
          <div className="absolute inset-0 bg-grid pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 h-[500px] w-[800px] rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          <div className="container relative px-4 md:px-6">
            <div className="grid gap-12 lg:gap-16 lg:grid-cols-[1.1fr_1fr] items-center">
              <div className="space-y-7">
                <Badge variant="secondary" className="px-3.5 py-1.5 gap-2 border bg-background/60 backdrop-blur-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs">AI-powered pose detection</span>
                  <span className="h-3 w-px bg-border" />
                  <span className="text-xs text-muted-foreground">Free · No equipment</span>
                </Badge>

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.04em] leading-[0.95]">
                  Your camera<br />
                  is now your{" "}
                  <span className="relative inline-block">
                    <span className="gradient-text">gym coach</span>
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      viewBox="0 0 200 12"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M2 8 Q 50 2, 100 6 T 198 5"
                        stroke="url(#underline)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="underline" x1="0" x2="1">
                          <stop offset="0" stopColor="#10b981" />
                          <stop offset="1" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                  Real-time rep counting, form feedback, and an AI coach that knows your history.
                  Every workout becomes a level up.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      className="gradient-bg text-white hover:opacity-90 group h-12 px-6 text-base shadow-lg shadow-primary/20"
                    >
                      Start training free
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="h-12 px-6 text-base">
                      See how it works
                    </Button>
                  </Link>
                </div>

                {/* Trust strip */}
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-emerald-500" />
                    Webcam-only · no wearables
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-violet-500" />
                    Personal AI coach
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Free forever
                  </div>
                </div>
              </div>

              <div className="relative">
                <LiveDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-y border-border/40 bg-secondary/20">
          <div className="container px-4 md:px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
              {[
                { value: "10", label: "Tracked exercises", icon: Dumbbell },
                { value: "30 fps", label: "Pose detection", icon: ScanLine },
                { value: "18", label: "Achievements", icon: Award },
                { value: "0$", label: "Forever free", icon: Heart },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <s.icon className="h-5 w-5 text-emerald-500 shrink-0" />
                  <div>
                    <div className="text-2xl md:text-3xl font-bold tabular-nums">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bento features */}
        <section id="features" className="relative w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-16 max-w-2xl mx-auto">
              <Badge variant="secondary">Built for the long game</Badge>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Everything you need.{" "}
                <span className="gradient-text">Nothing you don't.</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                A toolkit that turns your living room into a gym, and your phone into a trainer.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-6 md:auto-rows-[14rem]">
              {/* Pose detection */}
              <div className="group relative md:col-span-4 md:row-span-2 rounded-3xl border bg-card p-8 overflow-hidden hover:border-emerald-500/40 transition">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition" />
                <div className="relative h-full flex flex-col">
                  <div className="inline-grid place-items-center h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white mb-4">
                    <ScanLine className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Pose detection that just works</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    MoveNet runs locally in your browser. No app to install, no data to upload, no equipment needed.
                  </p>
                  <div className="mt-auto rounded-2xl border bg-background/40 backdrop-blur-sm p-4 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent shine" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Tracking 17 keypoints
                      </div>
                      <code className="text-xs text-muted-foreground">~30 fps</code>
                    </div>
                    <div className="mt-3 grid grid-cols-5 gap-1.5">
                      {[...Array(17)].map((_, i) => (
                        <div
                          key={i}
                          className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-violet-500"
                          style={{ opacity: 0.3 + (i % 5) * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI coach */}
              <div className="md:col-span-2 md:row-span-2 rounded-3xl border bg-card p-6 relative overflow-hidden group hover:border-violet-500/40 transition">
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl group-hover:bg-violet-500/30 transition" />
                <div className="relative">
                  <div className="inline-grid place-items-center h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white mb-3">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold mb-1.5">AI coach, always on</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Knows your stats. Plans your workouts. Calls out PRs.
                  </p>
                  <div className="rounded-xl border bg-background/40 p-3 text-xs space-y-1.5">
                    <div className="text-muted-foreground">You</div>
                    <div className="text-foreground">"Plan my next 7 days."</div>
                    <div className="text-muted-foreground mt-2">Coach</div>
                    <div className="text-foreground/80 italic">"You're 3 reps from your squat PR — let's open with that on day 1…"</div>
                  </div>
                </div>
              </div>

              {/* Streaks */}
              <div className="md:col-span-2 rounded-3xl border bg-gradient-to-br from-orange-500/10 to-rose-500/10 p-6 relative overflow-hidden">
                <Flame className="absolute -bottom-4 -right-4 h-32 w-32 text-orange-500/20" />
                <div className="relative">
                  <div className="text-5xl mb-3">🔥</div>
                  <h3 className="text-xl font-bold mb-1">Streaks that matter</h3>
                  <p className="text-sm text-muted-foreground">
                    A flame for every consecutive day. Don't let it burn out.
                  </p>
                </div>
              </div>

              {/* Achievements */}
              <div className="md:col-span-2 rounded-3xl border bg-card p-6 relative overflow-hidden">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {["🎬", "🏆", "🥇", "🌟", "🔥"].map((e, i) => (
                    <div
                      key={i}
                      className="grid place-items-center h-8 w-8 rounded-lg border bg-background text-base"
                    >
                      {e}
                    </div>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-1">18 achievements</h3>
                <p className="text-sm text-muted-foreground">Bronze to platinum. Each one earned, never gifted.</p>
              </div>

              {/* Leaderboard */}
              <div className="md:col-span-2 rounded-3xl border bg-card p-6 relative overflow-hidden group">
                <Trophy className="absolute -bottom-2 -right-2 h-24 w-24 text-yellow-500/20" />
                <div className="relative">
                  <div className="inline-grid place-items-center h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 text-white mb-3">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">Climb the ranks</h3>
                  <p className="text-sm text-muted-foreground">
                    Bronze → Silver → Gold → Diamond → Elite → Champion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Exercise marquee */}
        <section id="exercises" className="relative py-20 md:py-28 border-y border-border/40 bg-secondary/20">
          <div className="text-center space-y-3 mb-12">
            <Badge variant="secondary">10 exercises tracked</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              From <span className="gradient-text">squats to crunches</span>
            </h2>
            <p className="text-muted-foreground">All counted by AI. All earn XP.</p>
          </div>
          <div className="relative mask-fade-x">
            <div className="flex w-max animate-marquee gap-4">
              {[...EXERCISES, ...EXERCISES].map((e, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border bg-card px-5 py-3 shrink-0 hover:border-primary/40 transition"
                >
                  <span className="text-2xl">{e.emoji}</span>
                  <span className="font-semibold whitespace-nowrap">{e.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="relative py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-16 max-w-2xl mx-auto">
              <Badge variant="secondary">How it works</Badge>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Three steps to <span className="gradient-text">level up</span>
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3 relative">
              {[
                {
                  step: "01",
                  icon: Camera,
                  title: "Point your camera",
                  desc: "Pick an exercise. We turn on your webcam — nothing leaves your device.",
                  grad: "from-emerald-500 to-teal-500",
                },
                {
                  step: "02",
                  icon: Activity,
                  title: "Move. We count.",
                  desc: "MoveNet tracks your skeleton in real time and counts every clean rep.",
                  grad: "from-cyan-500 to-violet-500",
                },
                {
                  step: "03",
                  icon: ChartBar,
                  title: "Earn XP & rank up",
                  desc: "Each rep is XP. Each session sets PRs. Climb the leaderboard.",
                  grad: "from-violet-500 to-fuchsia-500",
                },
              ].map((s, i) => (
                <div key={s.step} className="relative">
                  <div className="rounded-3xl border bg-card p-7 h-full relative overflow-hidden group hover:border-primary/40 transition">
                    <div className="absolute -top-2 -right-2 text-7xl font-black text-foreground/[0.04] tabular-nums">
                      {s.step}
                    </div>
                    <div className={`relative inline-grid place-items-center h-12 w-12 rounded-xl bg-gradient-to-br ${s.grad} text-white mb-4`}>
                      <s.icon className="h-6 w-6" />
                    </div>
                    <h3 className="relative text-xl font-bold mb-2">{s.title}</h3>
                    <p className="relative text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                  {i < 2 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 h-6 w-6 text-muted-foreground/40 z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coach spotlight */}
        <section className="relative py-20 md:py-32 border-t border-border/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-5">
                <Badge variant="secondary">FitCoach AI</Badge>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  A <span className="gradient-text">real coach</span> in your pocket
                </h2>
                <p className="text-muted-foreground text-lg">
                  Powered by Llama 3.3 on Groq. Fast, free, and trained on your actual history —
                  it knows your streak, your PRs, and what you skipped last week.
                </p>
                <ul className="space-y-3 pt-2">
                  {[
                    "Plans personalized workouts in seconds",
                    "Form cues for every tracked exercise",
                    "Pushes back on unsafe loads, defers to pros for medical",
                    "Available on every page via floating widget",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 grid place-items-center h-5 w-5 rounded-full bg-emerald-500/20 shrink-0">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute inset-0 gradient-bg blur-3xl opacity-20" />
                <div className="relative rounded-3xl border bg-card p-6 space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="grid place-items-center h-10 w-10 rounded-xl gradient-bg text-white">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">FitCoach</div>
                      <div className="text-xs text-emerald-500 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 ml-auto max-w-[80%] text-sm">
                    Plan today's workout based on my history
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-3 max-w-[85%] text-sm space-y-2">
                    <p>Nice 12-day streak 🔥 Let's hit lower body today since you skipped legs.</p>
                    <p className="font-medium">Block A · 3 rounds</p>
                    <ul className="text-xs space-y-0.5 text-foreground/80">
                      <li>• 12 squats</li>
                      <li>• 10 lunges/side</li>
                      <li>• 15 glute bridges</li>
                    </ul>
                    <p className="text-xs text-muted-foreground pt-1">Aim for clean depth over speed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-20 md:py-28 px-4 md:px-6">
          <div className="container">
            <div className="relative rounded-[2rem] overflow-hidden p-10 md:p-20 text-center">
              <div className="absolute inset-0 gradient-bg" />
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="absolute top-0 left-0 h-40 w-40 rounded-full bg-yellow-400/30 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-fuchsia-500/30 blur-3xl" />

              <div className="relative space-y-6 text-white">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs">
                  <Star className="h-3.5 w-3.5" /> No credit card · No app · No equipment
                </div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Ready to make your<br />reps count?
                </h2>
                <p className="text-lg md:text-xl opacity-90 max-w-xl mx-auto">
                  Free forever. Just your camera and a bit of floor space.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
                  <Link href="/sign-up">
                    <Button size="lg" variant="secondary" className="h-12 px-8 text-base group">
                      Start training free
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/leaderboard">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 px-8 text-base bg-white/10 border-white/30 text-white hover:bg-white/20"
                    >
                      See the leaderboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 font-bold">
              <div className="grid place-items-center h-7 w-7 rounded-md gradient-bg text-white">
                <Dumbbell className="h-3.5 w-3.5" />
              </div>
              <span className="gradient-text">FitTrack AI</span>
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} FitTrack AI · Built for athletes, not couch potatoes.</p>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition">Features</a>
              <Link href="/leaderboard" className="hover:text-foreground transition">Leaderboard</Link>
              <Link href="/tutorials" className="hover:text-foreground transition">Tutorials</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
