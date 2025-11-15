"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dumbbell, Trophy, Video, BarChart3 } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  // Calculate XP needed for next level
  const baseXp = 100
  const xpForNextLevel = baseXp * user.level * 1.5
  const xpProgress = (user.xp / xpForNextLevel) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Welcome back, {user.username}</CardTitle>
                  <CardDescription>Here's your fitness progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Level {user.level}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.xp} / {Math.round(xpForNextLevel)} XP
                        </div>
                      </div>
                      <Progress value={xpProgress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold">{user.level}</div>
                        <div className="text-xs text-muted-foreground">Level</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold">{user.xp}</div>
                        <div className="text-xs text-muted-foreground">Total XP</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-xs text-muted-foreground">Workouts</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                  <CardDescription>Start a workout or check your stats</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/workout">
                      <Button className="w-full" variant="outline">
                        <Dumbbell className="mr-2 h-4 w-4" />
                        Start Workout
                      </Button>
                    </Link>
                    <Link href="/leaderboard">
                      <Button className="w-full" variant="outline">
                        <Trophy className="mr-2 h-4 w-4" />
                        Leaderboard
                      </Button>
                    </Link>
                    <Link href="/tutorials">
                      <Button className="w-full" variant="outline">
                        <Video className="mr-2 h-4 w-4" />
                        Tutorials
                      </Button>
                    </Link>
                    <Link href="/stats">
                      <Button className="w-full" variant="outline">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Stats
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Tabs defaultValue="recent">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="recent">Recent Activity</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="friends">Friends</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="recent" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent workouts and achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6 text-muted-foreground">
                      No recent activity. Start a workout to track your progress!
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="achievements" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Unlock achievements by completing workouts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6 text-muted-foreground">
                      No achievements yet. Start working out to earn achievements!
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="friends" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Friends</CardTitle>
                    <CardDescription>Connect with friends and compete on the leaderboard</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6 text-muted-foreground">
                      No friends added yet. Invite friends to compete with you!
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

