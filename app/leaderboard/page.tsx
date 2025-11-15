"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import DashboardHeader from "@/components/dashboard-header"
import { Trophy, Medal, Users } from "lucide-react"

// Mock leaderboard data
const mockLeaderboard = [
  { id: 1, username: "fitness_pro", xp: 12500, level: 25, avatar: "" },
  { id: 2, username: "workout_king", xp: 9800, level: 20, avatar: "" },
  { id: 3, username: "gym_enthusiast", xp: 7600, level: 16, avatar: "" },
  { id: 4, username: "exercise_queen", xp: 6200, level: 14, avatar: "" },
  { id: 5, username: "health_guru", xp: 5500, level: 12, avatar: "" },
  { id: 6, username: "muscle_master", xp: 4800, level: 11, avatar: "" },
  { id: 7, username: "cardio_king", xp: 4200, level: 10, avatar: "" },
  { id: 8, username: "fitness_fanatic", xp: 3600, level: 9, avatar: "" },
  { id: 9, username: "workout_warrior", xp: 3100, level: 8, avatar: "" },
  { id: 10, username: "active_achiever", xp: 2800, level: 7, avatar: "" },
]

type LeaderboardEntry = {
  id: number | string
  username: string
  xp: number
  level: number
  avatar: string
}

export default function LeaderboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(mockLeaderboard)
  const [userRank, setUserRank] = useState<number | null>(null)

  useEffect(() => {
    const handleLeaderboardUpdate = (event: MessageEvent) => {
      if (event.data && event.data.type === 'updateLeaderboard') {
        const updatedEntry: LeaderboardEntry = event.data.data;
  
        setLeaderboardData(prevLeaderboard => {
          let newLeaderboard = [...prevLeaderboard];
          const existingIndex = newLeaderboard.findIndex(entry => entry.username === updatedEntry.username);
  
          if (existingIndex !== -1) {
            newLeaderboard[existingIndex] = updatedEntry;
          } else {
            newLeaderboard.push(updatedEntry);
          }
  
          newLeaderboard.sort((a, b) => b.xp - a.xp);
          localStorage.setItem("leaderboardData", JSON.stringify(newLeaderboard));
  
          return newLeaderboard;
        });
      }
    };
  
    window.addEventListener("message", handleLeaderboardUpdate);
  
    return () => {
      window.removeEventListener("message", handleLeaderboardUpdate);
    };
  }, []);
  

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      // Check if there's any leaderboard data in localStorage
      const storedLeaderboardData = localStorage.getItem("leaderboardData")
      let baseLeaderboard = [...mockLeaderboard]

      if (storedLeaderboardData) {
        try {
          const parsedData = JSON.parse(storedLeaderboardData)
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            baseLeaderboard = parsedData
          }
        } catch (error) {
          console.error("Error parsing leaderboard data:", error)
        }
      }

      // Add current user if not already in the list
      const userExists = baseLeaderboard.some((entry) => entry.username === user.username)

      if (!userExists) {
        baseLeaderboard.push({
          id: user.id,
          username: user.username,
          xp: user.xp,
          level: user.level,
          avatar: "",
        })
      } else {
        // Update user's stats if they already exist in the leaderboard
        baseLeaderboard = baseLeaderboard.map((entry) =>
          entry.username === user.username ? { ...entry, xp: user.xp, level: user.level } : entry,
        )
      }

      // Sort by XP
      baseLeaderboard.sort((a, b) => b.xp - a.xp)

      // Find user's rank
      const rank = baseLeaderboard.findIndex((entry) => entry.username === user.username) + 1
      setUserRank(rank)

      setLeaderboardData(baseLeaderboard)

      // Save updated leaderboard to localStorage
      localStorage.setItem("leaderboardData", JSON.stringify(baseLeaderboard))
    }
  }, [user])

  if (loading || !user) {
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
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
              {userRank && (
                <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Your Rank: #{userRank}</span>
                </div>
              )}
            </div>

            <Tabs defaultValue="global">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="global">Global</TabsTrigger>
                <TabsTrigger value="friends">Friends</TabsTrigger>
              </TabsList>

              <TabsContent value="global" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Global Leaderboard</CardTitle>
                    <CardDescription>Top performers from around the world</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* Top 3 users */}
                      <div className="grid grid-cols-3 gap-4">
                        {leaderboardData.slice(0, 3).map((entry, index) => (
                          <div key={entry.id} className="flex flex-col items-center text-center">
                            <div className="relative mb-2">
                              <Avatar className="h-20 w-20 border-4 border-primary">
                                <AvatarFallback>{entry.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                <AvatarImage src={entry.avatar} />
                              </Avatar>
                              {index === 0 && (
                                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
                                  <Trophy className="h-4 w-4" />
                                </div>
                              )}
                              {index === 1 && (
                                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                                  <Medal className="h-4 w-4" />
                                </div>
                              )}
                              {index === 2 && (
                                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-700 text-white">
                                  <Medal className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                            <div className="font-bold">{entry.username}</div>
                            <div className="text-sm text-muted-foreground">Level {entry.level}</div>
                            <div className="mt-1 text-lg font-bold text-primary">{entry.xp.toLocaleString()} XP</div>
                          </div>
                        ))}
                      </div>

                      {/* Rest of the leaderboard */}
                      <div className="space-y-4">
                        {leaderboardData.slice(3).map((entry, index) => (
                          <div
                            key={entry.id}
                            className={`flex items-center justify-between rounded-lg border p-4 ${
                              entry.username === user.username ? "bg-muted" : ""
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-medium">
                                {index + 4}
                              </div>
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{entry.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                <AvatarImage src={entry.avatar} />
                              </Avatar>
                              <div>
                                <div className="font-medium">{entry.username}</div>
                                <div className="text-sm text-muted-foreground">Level {entry.level}</div>
                              </div>
                            </div>
                            <div className="font-bold">{entry.xp.toLocaleString()} XP</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="friends" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Friends Leaderboard</CardTitle>
                    <CardDescription>Compete with your friends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No friends added yet</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">
                        Add friends to see how you compare on the leaderboard
                      </p>
                      <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                        Add Friends
                      </button>
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

