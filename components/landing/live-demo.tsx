"use client"

import { useEffect, useState } from "react"
import { Activity, ScanLine, Sparkles } from "lucide-react"

const EXERCISES = [
  { emoji: "🦵", label: "Squats", target: 18, feedback: "Great depth!" },
  { emoji: "💪", label: "Push-ups", target: 14, feedback: "Strong core" },
  { emoji: "💥", label: "Bicep Curls", target: 22, feedback: "Squeeze!" },
  { emoji: "🏋️", label: "Shoulder Press", target: 10, feedback: "Locked out!" },
]

export default function LiveDemo() {
  const [exIdx, setExIdx] = useState(0)
  const [reps, setReps] = useState(0)
  const ex = EXERCISES[exIdx]

  useEffect(() => {
    setReps(0)
    let r = 0
    const tick = setInterval(() => {
      r += 1
      setReps(r)
      if (r >= ex.target) {
        clearInterval(tick)
        setTimeout(() => setExIdx((i) => (i + 1) % EXERCISES.length), 1400)
      }
    }, 280)
    return () => clearInterval(tick)
  }, [exIdx, ex.target])

  return (
    <div className="relative">
      {/* Glow rings */}
      <div
        className="absolute inset-0 -m-12 animate-spin-slow opacity-60 pointer-events-none rounded-full blur-3xl"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(16,185,129,0.25), rgba(168,85,247,0.25), rgba(16,185,129,0.25))",
        }}
      />

      {/* Mock UI card */}
      <div className="relative rounded-3xl border bg-card/80 backdrop-blur-xl p-3 md:p-4 animate-glow-pulse">
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider">
            <Activity className="h-3 w-3 text-emerald-500" />
            FitTrack · Live
          </div>
        </div>

        {/* Camera frame */}
        <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-violet-500/20 overflow-hidden">
          {/* Scanning beam */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shine" />

          {/* Pose silhouette suggestion */}
          <div className="absolute inset-0 grid place-items-center">
            <ScanLine className="h-32 w-32 text-foreground/15" strokeWidth={1} />
          </div>

          {/* Rep counter */}
          <div className="absolute top-3 left-3 rounded-xl bg-black/70 backdrop-blur px-3 py-2 text-white border border-white/10">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tabular-nums leading-none">{reps}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-70">reps</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider opacity-70 mt-0.5">
              {ex.emoji} {ex.label}
            </div>
          </div>

          {/* Angle */}
          <div className="absolute top-3 right-3 rounded-xl bg-black/70 backdrop-blur px-3 py-2 text-white text-xs border border-white/10 tabular-nums">
            {Math.round(160 - (reps / ex.target) * 70)}°
          </div>

          {/* Feedback */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 backdrop-blur px-4 py-1.5 text-white text-xs border border-white/10 whitespace-nowrap">
            {ex.feedback}
          </div>

          {/* Skeleton bones */}
          <svg
            className="absolute inset-0 w-full h-full opacity-60"
            viewBox="0 0 400 225"
            fill="none"
          >
            <g stroke="url(#poseGradient)" strokeWidth="2.5" strokeLinecap="round">
              {/* shoulders */}
              <line x1="170" y1="80" x2="230" y2="80" />
              {/* arms */}
              <line x1="170" y1="80" x2="155" y2="120" />
              <line x1="155" y1="120" x2="160" y2="160" />
              <line x1="230" y1="80" x2="245" y2="120" />
              <line x1="245" y1="120" x2="240" y2="160" />
              {/* spine */}
              <line x1="170" y1="80" x2="180" y2="140" />
              <line x1="230" y1="80" x2="220" y2="140" />
              {/* hips */}
              <line x1="180" y1="140" x2="220" y2="140" />
              {/* legs */}
              <line x1="180" y1="140" x2="170" y2="190" />
              <line x1="220" y1="140" x2="230" y2="190" />
            </g>
            <defs>
              <linearGradient id="poseGradient" x1="0" x2="1">
                <stop offset="0" stopColor="#10b981" />
                <stop offset="1" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            {/* Joint dots */}
            {[
              [170, 80], [230, 80], [155, 120], [245, 120], [160, 160], [240, 160],
              [180, 140], [220, 140], [170, 190], [230, 190],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3.5" fill="#a855f7" />
            ))}
          </svg>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="rounded-xl border bg-background/50 p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Streak</div>
            <div className="text-lg font-bold flex items-center gap-1">
              <span className="text-orange-500">🔥</span> 12
            </div>
          </div>
          <div className="rounded-xl border bg-background/50 p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">XP</div>
            <div className="text-lg font-bold tabular-nums">{(1240 + reps * 5).toLocaleString()}</div>
          </div>
          <div className="rounded-xl border bg-background/50 p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Level</div>
            <div className="text-lg font-bold flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" /> 7
            </div>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white px-3 py-1.5 text-xs font-semibold shadow-xl animate-float">
        +5 XP
      </div>
      <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 rounded-2xl border bg-card px-3 py-2 shadow-xl animate-float-slow">
        <div className="flex items-center gap-2">
          <div className="text-2xl">🏆</div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Achievement</div>
            <div className="text-xs font-semibold">Iron Will</div>
          </div>
        </div>
      </div>
    </div>
  )
}
