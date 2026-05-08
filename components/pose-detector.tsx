"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Square, RotateCcw, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export type ExerciseType =
  | "squat"
  | "pushup"
  | "bicep"
  | "lunge"
  | "shoulderPress"
  | "lateralRaise"
  | "situp"
  | "crunch"
  | "gluteBridge"
  | "tricepExtension"

type Direction = "flex" | "extend"
// flex: peak position has SMALL angle (bend), rest has LARGE.   e.g. squat, bicep curl
// extend: peak position has LARGE angle, rest has SMALL.        e.g. shoulder press, lateral raise

const KP = {
  leftShoulder: 5, rightShoulder: 6,
  leftElbow: 7, rightElbow: 8,
  leftWrist: 9, rightWrist: 10,
  leftHip: 11, rightHip: 12,
  leftKnee: 13, rightKnee: 14,
  leftAnkle: 15, rightAnkle: 16,
}

const MIN_SCORE = 0.3

function angle(
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number },
) {
  const ab = { x: a.x - b.x, y: a.y - b.y }
  const cb = { x: c.x - b.x, y: c.y - b.y }
  const dot = ab.x * cb.x + ab.y * cb.y
  const magAB = Math.hypot(ab.x, ab.y)
  const magCB = Math.hypot(cb.x, cb.y)
  if (magAB === 0 || magCB === 0) return 180
  const cos = Math.max(-1, Math.min(1, dot / (magAB * magCB)))
  return (Math.acos(cos) * 180) / Math.PI
}

function pickSide(a: any, b: any) {
  if (!a && !b) return null
  if (!a) return b
  if (!b) return a
  return (a.score ?? 0) >= (b.score ?? 0) ? a : b
}

function tripleAngle(p1: any, p2: any, p3: any): number | null {
  if (!p1 || !p2 || !p3) return null
  if (p1.score < MIN_SCORE || p2.score < MIN_SCORE || p3.score < MIN_SCORE) return null
  return angle(p1, p2, p3)
}

type ExerciseConfig = {
  label: string
  emoji: string
  measure: (k: any[]) => number | null
  restThreshold: number
  peakThreshold: number
  direction: Direction
  feedback: (a: number, atPeak: boolean) => string
}

export const EXERCISES: Record<ExerciseType, ExerciseConfig> = {
  squat: {
    label: "Squats",
    emoji: "🦵",
    direction: "flex",
    restThreshold: 160,
    peakThreshold: 100,
    measure: (k) =>
      tripleAngle(
        pickSide(k[KP.leftHip], k[KP.rightHip]),
        pickSide(k[KP.leftKnee], k[KP.rightKnee]),
        pickSide(k[KP.leftAnkle], k[KP.rightAnkle]),
      ),
    feedback: (a) =>
      a < 90 ? "Great depth!" : a < 110 ? "Good form" : a > 160 ? "Standing — squat down" : "Go a bit lower",
  },
  pushup: {
    label: "Push-ups",
    emoji: "💪",
    direction: "flex",
    restThreshold: 160,
    peakThreshold: 95,
    measure: (k) =>
      tripleAngle(
        pickSide(k[KP.leftShoulder], k[KP.rightShoulder]),
        pickSide(k[KP.leftElbow], k[KP.rightElbow]),
        pickSide(k[KP.leftWrist], k[KP.rightWrist]),
      ),
    feedback: (a) =>
      a < 80 ? "Deep — nice!" : a < 100 ? "Good form" : a > 160 ? "Top position" : "Keep core tight",
  },
  bicep: {
    label: "Bicep Curls",
    emoji: "💥",
    direction: "flex",
    restThreshold: 150,
    peakThreshold: 50,
    measure: (k) =>
      tripleAngle(
        pickSide(k[KP.rightShoulder], k[KP.leftShoulder]),
        pickSide(k[KP.rightElbow], k[KP.leftElbow]),
        pickSide(k[KP.rightWrist], k[KP.leftWrist]),
      ),
    feedback: (a) =>
      a < 50 ? "Squeeze!" : a < 90 ? "Curling…" : a > 150 ? "Arm extended" : "Keep elbow tucked",
  },
  lunge: {
    label: "Lunges",
    emoji: "🏃",
    direction: "flex",
    restThreshold: 155,
    peakThreshold: 105,
    measure: (k) => {
      // Use the knee that's most bent (front leg)
      const left = tripleAngle(k[KP.leftHip], k[KP.leftKnee], k[KP.leftAnkle])
      const right = tripleAngle(k[KP.rightHip], k[KP.rightKnee], k[KP.rightAnkle])
      if (left == null) return right
      if (right == null) return left
      return Math.min(left, right)
    },
    feedback: (a) =>
      a < 95 ? "Nice depth" : a < 115 ? "Good form" : a > 155 ? "Standing — step out" : "Lower the back knee",
  },
  shoulderPress: {
    label: "Shoulder Press",
    emoji: "🏋️",
    direction: "extend",
    restThreshold: 95,
    peakThreshold: 160,
    measure: (k) =>
      tripleAngle(
        pickSide(k[KP.leftShoulder], k[KP.rightShoulder]),
        pickSide(k[KP.leftElbow], k[KP.rightElbow]),
        pickSide(k[KP.leftWrist], k[KP.rightWrist]),
      ),
    feedback: (a) =>
      a > 160 ? "Locked out!" : a > 130 ? "Pressing up" : a < 95 ? "Start — bent at shoulder" : "Push higher",
  },
  lateralRaise: {
    label: "Lateral Raises",
    emoji: "🦅",
    direction: "extend",
    restThreshold: 25,
    peakThreshold: 80,
    measure: (k) =>
      // angle elbow-shoulder-hip on whichever side is more confident
      tripleAngle(
        pickSide(k[KP.leftElbow], k[KP.rightElbow]),
        pickSide(k[KP.leftShoulder], k[KP.rightShoulder]),
        pickSide(k[KP.leftHip], k[KP.rightHip]),
      ),
    feedback: (a) =>
      a > 80 ? "Top position" : a > 60 ? "Raising…" : a < 25 ? "Arm at side" : "Lift to shoulder height",
  },
  situp: {
    label: "Sit-ups",
    emoji: "🧘",
    direction: "flex",
    restThreshold: 150,
    peakThreshold: 80,
    measure: (k) =>
      tripleAngle(
        pickSide(k[KP.leftShoulder], k[KP.rightShoulder]),
        pickSide(k[KP.leftHip], k[KP.rightHip]),
        pickSide(k[KP.leftKnee], k[KP.rightKnee]),
      ),
    feedback: (a) =>
      a < 80 ? "All the way up!" : a < 110 ? "Crunching" : a > 150 ? "Lying flat" : "Sit higher",
  },
  crunch: {
    label: "Crunches",
    emoji: "💢",
    direction: "flex",
    restThreshold: 160,
    peakThreshold: 125,
    measure: (k) =>
      tripleAngle(
        pickSide(k[KP.leftShoulder], k[KP.rightShoulder]),
        pickSide(k[KP.leftHip], k[KP.rightHip]),
        pickSide(k[KP.leftKnee], k[KP.rightKnee]),
      ),
    feedback: (a) =>
      a < 125 ? "Nice contraction" : a > 160 ? "Lying flat" : "Lift shoulders off",
  },
  gluteBridge: {
    label: "Glute Bridge",
    emoji: "🌉",
    direction: "extend",
    restThreshold: 140,
    peakThreshold: 170,
    measure: (k) =>
      tripleAngle(
        pickSide(k[KP.leftShoulder], k[KP.rightShoulder]),
        pickSide(k[KP.leftHip], k[KP.rightHip]),
        pickSide(k[KP.leftKnee], k[KP.rightKnee]),
      ),
    feedback: (a) =>
      a > 170 ? "Squeeze glutes!" : a > 155 ? "Bridging up" : a < 140 ? "On the floor" : "Drive hips up",
  },
  tricepExtension: {
    label: "Tricep Extension",
    emoji: "🔥",
    direction: "extend",
    restThreshold: 80,
    peakThreshold: 160,
    measure: (k) =>
      tripleAngle(
        pickSide(k[KP.leftShoulder], k[KP.rightShoulder]),
        pickSide(k[KP.leftElbow], k[KP.rightElbow]),
        pickSide(k[KP.leftWrist], k[KP.rightWrist]),
      ),
    feedback: (a) =>
      a > 160 ? "Locked out!" : a > 130 ? "Extending" : a < 80 ? "Bent — start position" : "Straighten arm",
  },
}

const SKELETON_PAIRS: [number, number][] = [
  [5, 7], [7, 9], [6, 8], [8, 10], [5, 6],
  [5, 11], [6, 12], [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
]

export type Telemetry = {
  status: "idle" | "loading" | "ready" | "running" | "error"
  reps: number
  angle: number | null
  atPeak: boolean
  feedback: string
  fps: number
  durationSec: number
  exercise: ExerciseType
  exerciseLabel: string
  direction: Direction
  restThreshold: number
  peakThreshold: number
}

export interface PoseDetectorProps {
  exercise: ExerciseType
  onRepsChange?: (reps: number) => void
  onStop?: (data: { reps: number; durationSec: number }) => void
  onTelemetry?: (t: Telemetry) => void
  className?: string
}

export default function PoseDetector({
  exercise,
  onRepsChange,
  onStop,
  onTelemetry,
  className,
}: PoseDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const detectorRef = useRef<any>(null)
  const rafRef = useRef<number | null>(null)
  const atPeakRef = useRef<boolean>(false)
  const exerciseRef = useRef<ExerciseType>(exercise)
  const startedAtRef = useRef<number | null>(null)
  const frameCountRef = useRef(0)
  const lastFpsTickRef = useRef(0)

  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "running" | "error">("idle")
  const [reps, setReps] = useState(0)
  const [currentAngle, setCurrentAngle] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [fps, setFps] = useState(0)
  const [duration, setDuration] = useState(0)
  const [atPeakState, setAtPeakState] = useState(false)

  useEffect(() => {
    exerciseRef.current = exercise
    setReps(0)
    atPeakRef.current = false
    setAtPeakState(false)
  }, [exercise])

  useEffect(() => {
    onRepsChange?.(reps)
  }, [reps, onRepsChange])

  // Tick session duration once per second
  useEffect(() => {
    if (status !== "running") return
    const id = setInterval(() => {
      if (startedAtRef.current) {
        setDuration(Math.round((Date.now() - startedAtRef.current) / 1000))
      }
    }, 500)
    return () => clearInterval(id)
  }, [status])

  // Emit telemetry whenever live state changes
  useEffect(() => {
    if (!onTelemetry) return
    const cfg = EXERCISES[exercise]
    onTelemetry({
      status,
      reps,
      angle: currentAngle,
      atPeak: atPeakState,
      feedback,
      fps,
      durationSec: duration,
      exercise,
      exerciseLabel: cfg.label,
      direction: cfg.direction,
      restThreshold: cfg.restThreshold,
      peakThreshold: cfg.peakThreshold,
    })
  }, [
    status,
    reps,
    currentAngle,
    feedback,
    fps,
    duration,
    atPeakState,
    exercise,
    onTelemetry,
  ])

  const start = async () => {
    try {
      setStatus("loading")
      setErrorMsg("")

      const tf = await import("@tensorflow/tfjs-core")
      await import("@tensorflow/tfjs-converter")
      await import("@tensorflow/tfjs-backend-webgl")
      const poseDetection = await import("@tensorflow-models/pose-detection")

      await tf.setBackend("webgl")
      await tf.ready()

      detectorRef.current = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true,
        },
      )

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      })

      const video = videoRef.current
      if (!video) throw new Error("Video element not ready")
      video.srcObject = stream
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play()
          resolve()
        }
      })

      setStatus("running")
      startedAtRef.current = Date.now()
      atPeakRef.current = false
      setAtPeakState(false)
      setDuration(0)
      lastFpsTickRef.current = performance.now()
      frameCountRef.current = 0
      loop()
    } catch (e: any) {
      console.error(e)
      setErrorMsg(e?.message ?? "Failed to start camera")
      setStatus("error")
    }
  }

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    const video = videoRef.current
    const stream = video?.srcObject as MediaStream | null
    stream?.getTracks().forEach((t) => t.stop())
    if (video) video.srcObject = null
    const elapsed = startedAtRef.current
      ? Math.round((Date.now() - startedAtRef.current) / 1000)
      : 0
    setStatus("idle")
    onStop?.({ reps, durationSec: elapsed })
  }

  const reset = () => {
    setReps(0)
    atPeakRef.current = false
    startedAtRef.current = Date.now()
  }

  const loop = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const detector = detectorRef.current
    if (!video || !canvas || !detector) return

    if (video.readyState >= 2) {
      const poses = await detector.estimatePoses(video, { flipHorizontal: false })
      const ctx = canvas.getContext("2d")
      if (ctx) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        if (poses[0]) {
          drawPose(ctx, poses[0].keypoints)
          updateRepState(poses[0].keypoints)
        }
      }

      // FPS counter
      frameCountRef.current += 1
      const now = performance.now()
      if (now - lastFpsTickRef.current >= 1000) {
        setFps(frameCountRef.current)
        frameCountRef.current = 0
        lastFpsTickRef.current = now
      }
    }

    rafRef.current = requestAnimationFrame(loop)
  }

  const drawPose = (ctx: CanvasRenderingContext2D, keypoints: any[]) => {
    ctx.lineWidth = 3
    ctx.strokeStyle = "#10b981"
    for (const [a, b] of SKELETON_PAIRS) {
      const p1 = keypoints[a]
      const p2 = keypoints[b]
      if (p1?.score > MIN_SCORE && p2?.score > MIN_SCORE) {
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
      }
    }
    ctx.fillStyle = "#a855f7"
    for (const kp of keypoints) {
      if (kp.score > MIN_SCORE) {
        ctx.beginPath()
        ctx.arc(kp.x, kp.y, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  const updateRepState = (keypoints: any[]) => {
    const cfg = EXERCISES[exerciseRef.current]
    const a = cfg.measure(keypoints)
    if (a == null) return
    setCurrentAngle(a)
    setFeedback(cfg.feedback(a, atPeakRef.current))

    if (cfg.direction === "flex") {
      // peak = small angle, rest = large
      if (!atPeakRef.current && a < cfg.peakThreshold) {
        atPeakRef.current = true
        setAtPeakState(true)
      } else if (atPeakRef.current && a > cfg.restThreshold) {
        atPeakRef.current = false
        setAtPeakState(false)
        setReps((r) => r + 1)
      }
    } else {
      // extend: peak = large angle, rest = small
      if (!atPeakRef.current && a > cfg.peakThreshold) {
        atPeakRef.current = true
        setAtPeakState(true)
      } else if (atPeakRef.current && a < cfg.restThreshold) {
        atPeakRef.current = false
        setAtPeakState(false)
        setReps((r) => r + 1)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      const stream = videoRef.current?.srcObject as MediaStream | null
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const cfg = EXERCISES[exercise]

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-500" />
          {cfg.label}
        </CardTitle>
        <Badge variant={status === "running" ? "default" : "secondary"}>
          {status === "loading" ? "Loading model…" : status === "running" ? "Live" : status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
          <video ref={videoRef} className="hidden" playsInline muted />
          <canvas ref={canvasRef} className="w-full h-full object-cover -scale-x-100" />
          {status !== "running" && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-500/20 to-emerald-500/20 backdrop-blur-sm">
              <div className="text-center text-white space-y-2">
                <Camera className="h-12 w-12 mx-auto opacity-60" />
                <div className="text-sm opacity-80">
                  {status === "loading"
                    ? "Loading MoveNet…"
                    : status === "error"
                      ? errorMsg
                      : "Camera off"}
                </div>
              </div>
            </div>
          )}
          {status === "running" && (
            <>
              <div className="absolute top-3 left-3 rounded-lg bg-black/60 backdrop-blur px-3 py-2 text-white">
                <div className="text-3xl font-bold leading-none">{reps}</div>
                <div className="text-[10px] uppercase tracking-wider opacity-70">reps</div>
              </div>
              {currentAngle !== null && (
                <div className="absolute top-3 right-3 rounded-lg bg-black/60 backdrop-blur px-3 py-2 text-white text-xs">
                  {Math.round(currentAngle)}°
                </div>
              )}
              {feedback && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 backdrop-blur px-4 py-1.5 text-white text-sm">
                  {feedback}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex gap-2">
          {status !== "running" ? (
            <Button onClick={start} disabled={status === "loading"} className="flex-1">
              <Camera className="mr-2 h-4 w-4" />
              {status === "loading" ? "Loading…" : "Start"}
            </Button>
          ) : (
            <>
              <Button onClick={stop} variant="destructive" className="flex-1">
                <Square className="mr-2 h-4 w-4" />
                Stop & Save
              </Button>
              <Button onClick={reset} variant="outline" size="icon">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
