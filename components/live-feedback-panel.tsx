"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Gauge, Timer, Zap, ArrowDown, ArrowUp, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Telemetry } from "@/components/pose-detector"

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const ss = (s % 60).toString().padStart(2, "0")
  return `${m}:${ss}`
}

function normalize(t: Telemetry): number {
  if (t.angle == null) return 0
  if (t.direction === "flex") {
    return Math.max(
      0,
      Math.min(1, (t.restThreshold - t.angle) / (t.restThreshold - t.peakThreshold)),
    )
  }
  return Math.max(
    0,
    Math.min(1, (t.angle - t.restThreshold) / (t.peakThreshold - t.restThreshold)),
  )
}

export default function LiveFeedbackPanel({ telemetry }: { telemetry: Telemetry | null }) {
  const t = telemetry
  const isLive = t?.status === "running"
  const reps = t?.reps ?? 0
  const duration = t?.durationSec ?? 0
  const pace = duration > 0 ? Math.round((reps / duration) * 60) : 0
  const position = t ? normalize(t) : 0

  // Track angle history for sparkline
  const [history, setHistory] = useState<number[]>([])
  const lastSampleRef = useRef(0)
  useEffect(() => {
    if (!t || t.angle == null) return
    const now = Date.now()
    if (now - lastSampleRef.current < 100) return
    lastSampleRef.current = now
    setHistory((h) => [...h.slice(-49), t.angle ?? 0])
  }, [t?.angle, t])

  // Reset history when exercise changes / status leaves running
  useEffect(() => {
    setHistory([])
  }, [t?.exercise, isLive])

  return (
    <Card
      className={cn(
        "overflow-hidden transition border",
        isLive ? "border-emerald-500/40 card-glow" : "",
      )}
    >
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className={cn("h-4 w-4", isLive ? "text-emerald-500" : "text-muted-foreground")} />
          Live Coach
        </CardTitle>
        <Badge variant={isLive ? "default" : "secondary"} className={cn("gap-1.5", isLive && "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30")}>
          {isLive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          {isLive ? "Live" : t?.status === "loading" ? "Loading…" : "Idle"}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Top metrics */}
        <div className="grid grid-cols-3 gap-2">
          <Metric icon={Sparkles} label="Reps" value={reps} accent="emerald" />
          <Metric icon={Timer} label="Time" value={formatTime(duration)} accent="violet" />
          <Metric icon={Zap} label="Pace" value={`${pace}/m`} accent="amber" />
        </div>

        {/* Angle / phase visualization */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Gauge className="h-3 w-3" />
              Movement
            </div>
            <div className="tabular-nums font-medium">
              {t?.angle != null ? `${Math.round(t.angle)}°` : "—"}
            </div>
          </div>
          <div className="relative h-8 rounded-full bg-secondary/40 border overflow-hidden">
            {/* Heat gradient fill */}
            <div
              className={cn(
                "absolute inset-y-0 left-0 rounded-full transition-all duration-150",
                "bg-gradient-to-r from-emerald-500 via-yellow-500 to-rose-500",
              )}
              style={{ width: `${position * 100}%` }}
            />
            {/* Marker */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-150"
              style={{ left: `calc(${position * 100}% - 2px)` }}
            />
            {/* Threshold lines */}
            <div className="absolute top-1 bottom-1 left-[15%] w-px bg-foreground/15" />
            <div className="absolute top-1 bottom-1 left-[85%] w-px bg-foreground/15" />
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Rest</span>
            <span
              className={cn(
                "font-semibold transition",
                t?.atPeak ? "text-rose-500" : "text-emerald-500",
              )}
            >
              {t?.atPeak ? (
                <span className="inline-flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" /> Return
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <ArrowDown className="h-3 w-3" /> Descend
                </span>
              )}
            </span>
            <span>Peak</span>
          </div>
        </div>

        {/* Angle sparkline */}
        <div className="space-y-1.5">
          <div className="text-xs text-muted-foreground">Angle over time</div>
          <Sparkline values={history} t={t} />
        </div>

        {/* Feedback */}
        <div
          className={cn(
            "rounded-xl border p-3 text-sm transition",
            isLive
              ? "bg-gradient-to-r from-emerald-500/10 via-violet-500/5 to-transparent border-primary/30"
              : "bg-secondary/30 text-muted-foreground",
          )}
        >
          <div className="text-[10px] uppercase tracking-wider mb-0.5 text-muted-foreground">
            Coach says
          </div>
          <div className="font-medium">
            {isLive
              ? t?.feedback || "Get into position…"
              : "Hit Start above to begin live coaching."}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground pt-1 border-t -mx-6 px-6 -mb-2 pb-1">
          <span>{t?.exerciseLabel ?? "—"}</span>
          <span>{isLive ? `${t?.fps ?? 0} fps` : "MoveNet"}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any
  label: string
  value: string | number
  accent: "emerald" | "violet" | "amber"
}) {
  const grad =
    accent === "emerald"
      ? "from-emerald-500/20 to-teal-500/10"
      : accent === "violet"
        ? "from-violet-500/20 to-fuchsia-500/10"
        : "from-amber-500/20 to-yellow-500/10"
  const tint =
    accent === "emerald"
      ? "text-emerald-500"
      : accent === "violet"
        ? "text-violet-500"
        : "text-amber-500"
  return (
    <div className={cn("rounded-xl border p-3 bg-gradient-to-br", grad)}>
      <Icon className={cn("h-3.5 w-3.5 mb-1.5", tint)} />
      <div className="text-xl font-bold leading-none tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
        {label}
      </div>
    </div>
  )
}

function Sparkline({ values, t }: { values: number[]; t: Telemetry | null }) {
  const W = 280
  const H = 56
  if (!t || values.length < 2) {
    return (
      <div
        className="h-14 rounded-lg border bg-secondary/20 grid place-items-center text-[10px] text-muted-foreground"
        style={{ width: "100%" }}
      >
        Waiting for movement…
      </div>
    )
  }
  const minA = Math.min(t.restThreshold, t.peakThreshold) - 10
  const maxA = Math.max(t.restThreshold, t.peakThreshold) + 10
  const stepX = W / Math.max(1, values.length - 1)
  const toY = (a: number) => H - ((a - minA) / (maxA - minA)) * H
  const path = values
    .map((a, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${toY(Math.max(minA, Math.min(maxA, a)))}`)
    .join(" ")
  const restY = toY(t.restThreshold)
  const peakY = toY(t.peakThreshold)
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="w-full h-14 rounded-lg border bg-secondary/20"
    >
      <line x1="0" x2={W} y1={restY} y2={restY} stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-emerald-500/60" />
      <line x1="0" x2={W} y1={peakY} y2={peakY} stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-rose-500/60" />
      <path d={path} fill="none" stroke="url(#sparkGrad)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <defs>
        <linearGradient id="sparkGrad" x1="0" x2="1">
          <stop offset="0" stopColor="#10b981" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  )
}
