"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import DashboardHeader from "@/components/dashboard-header"
import { Dumbbell, Play } from "lucide-react"

export default function WorkoutPage() {
  const { user, loading, updateUserStats } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [exerciseData, setExerciseData] = useState({
    reps: 0,
    xp: 0,
    formQuality: { good: 0, poor: 0 },
    formFeedback: "",
    exerciseType: "squat",
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    // Listen for messages from the exercise detector iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "exerciseData") {
        const data = event.data.data
        setExerciseData({
          reps: data.reps,
          xp: data.xp,
          formQuality: data.formQuality,
          formFeedback: data.formFeedback,
          exerciseType: data.exerciseType,
        })

        // Update user stats in the auth context
        if (user) {
          updateUserStats({
            xp: data.xp,
            level: data.level,
            exercisesToday: data.exercisesToday,
          })
        }
      }
    }

    window.addEventListener("message", handleMessage)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [user, updateUserStats])

  const handleStartCamera = () => {
    // Move the exercise-detector.html file to the public folder
    window.location.href = "/exercise-detector.html"
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Exercise Workout</CardTitle>
                  <CardDescription>Start your workout with AI-powered exercise detection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Exercise Type</label>
                    <Select
                      value={exerciseData.exerciseType}
                      onValueChange={(value) => setExerciseData((prev) => ({ ...prev, exerciseType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select exercise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="squat">Squats</SelectItem>
                        <SelectItem value="pushup">Push-ups</SelectItem>
                        <SelectItem value="bicep">Bicep Curls</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex justify-center">
                      <Button onClick={handleStartCamera} className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Start Camera & Exercise Detection
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Your Stats</CardTitle>
                  <CardDescription>Your current fitness progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="h-5 w-5" />
                      <span className="font-medium">Level</span>
                    </div>
                    <div className="text-2xl font-bold">{user?.level || 1}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total XP</span>
                      <span className="text-sm font-medium">{user?.xp || 0}</span>
                    </div>
                    <Progress value={(user?.xp || 0) % 100} className="h-2" />
                  </div>

                  <div className="rounded-lg bg-muted p-3">
                    <div className="font-medium">How it works</div>
                    <p className="text-sm text-muted-foreground">
                      Our AI-powered system will detect your exercises, count reps, and provide real-time feedback on
                      your form.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Exercise Guide</CardTitle>
                <CardDescription>Tips for getting the most out of your workout</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-bold mb-2">Squats</h3>
                    <ul className="text-sm space-y-1 list-disc pl-4">
                      <li>Keep your back straight</li>
                      <li>Knees should track over toes</li>
                      <li>Go as low as comfortable</li>
                      <li>Keep weight in your heels</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="font-bold mb-2">Push-ups</h3>
                    <ul className="text-sm space-y-1 list-disc pl-4">
                      <li>Keep your body in a straight line</li>
                      <li>Hands slightly wider than shoulders</li>
                      <li>Lower until elbows are at 90°</li>
                      <li>Keep core engaged</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="font-bold mb-2">Bicep Curls</h3>
                    <ul className="text-sm space-y-1 list-disc pl-4">
                      <li>Keep elbows close to your body</li>
                      <li>Curl up with controlled motion</li>
                      <li>Lower slowly to starting position</li>
                      <li>Avoid swinging your body</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  Check out our tutorials section for more detailed exercise guides
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

