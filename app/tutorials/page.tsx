"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import DashboardHeader from "@/components/dashboard-header"
import { Play, Clock, Dumbbell } from "lucide-react"

// Mock tutorial data with properly formatted YouTube embed URLs
const tutorials = [
  {
    id: 1,
    title: "Perfect Squat Form",
    description: "Learn the proper technique for squats to maximize results and prevent injury.",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "4:30",
    level: "Beginner",
    category: "squats",
    videoUrl: "https://www.youtube.com/embed/byxWus7BwfQ", // Changed to embed URL
  },
  {
    id: 2,
    title: "Advanced Squat Variations",
    description: "Take your squat routine to the next level with these challenging variations.",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "6:15",
    level: "Advanced",
    category: "squats",
    videoUrl: "https://www.youtube.com/embed/BUon1aVFC5Q", // Changed to embed URL
  },
  {
    id: 3,
    title: "Push-up Fundamentals",
    description: "Master the basics of the perfect push-up for chest and arm strength.",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "5:45",
    level: "Beginner",
    category: "pushups",
    videoUrl: "https://www.youtube.com/embed/OUOlDkBJ30E", // Changed to embed URL
  },
  {
    id: 4,
    title: "Push-up Variations for Strength",
    description: "Different push-up styles to target various muscle groups.",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "7:20",
    level: "Intermediate",
    category: "pushups",
    videoUrl: "https://www.youtube.com/embed/oqBiZ_YV1ps", // Changed to embed URL
  },
  {
    id: 5,
    title: "Bicep Curl Technique",
    description: "Proper form and technique for effective bicep curls.",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "3:50",
    level: "Beginner",
    category: "biceps",
    videoUrl: "https://www.youtube.com/embed/XE_pHwbst04", // Changed to embed URL
  },
  {
    id: 6,
    title: "Advanced Bicep Training",
    description: "Comprehensive bicep workout for maximum muscle growth.",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "8:10",
    level: "Advanced",
    category: "biceps",
    videoUrl: "https://www.youtube.com/embed/4FyTk4Jhkeg", // Changed to embed URL
  },
]

export default function TutorialsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

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
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Exercise Tutorials</h1>
            </div>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Tutorials</TabsTrigger>
                <TabsTrigger value="squats">Squats</TabsTrigger>
                <TabsTrigger value="pushups">Push-ups</TabsTrigger>
                <TabsTrigger value="biceps">Bicep Curls</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <TutorialGrid tutorials={tutorials} />
              </TabsContent>

              <TabsContent value="squats" className="mt-6">
                <TutorialGrid tutorials={tutorials.filter((t) => t.category === "squats")} />
              </TabsContent>

              <TabsContent value="pushups" className="mt-6">
                <TutorialGrid tutorials={tutorials.filter((t) => t.category === "pushups")} />
              </TabsContent>

              <TabsContent value="biceps" className="mt-6">
                <TutorialGrid tutorials={tutorials.filter((t) => t.category === "biceps")} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

function TutorialGrid({ tutorials }: { tutorials: any[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tutorials.map((tutorial) => (
        <TutorialCard key={tutorial.id} tutorial={tutorial} />
      ))}
    </div>
  )
}

function TutorialCard({ tutorial }: { tutorial: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <iframe
          width="100%"
          height="200"
          src={tutorial.videoUrl}
          title={tutorial.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {tutorial.duration}
        </div>
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{tutorial.title}</CardTitle>
          <Badge
            variant={
              tutorial.level === "Beginner" ? "outline" : tutorial.level === "Intermediate" ? "secondary" : "default"
            }
          >
            {tutorial.level}
          </Badge>
        </div>
        <CardDescription>{tutorial.description}</CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <Dumbbell className="h-4 w-4 mr-1" />
          {tutorial.category === "squats" ? "Squats" : tutorial.category === "pushups" ? "Push-ups" : "Bicep Curls"}
        </div>
        <Link href={`/tutorials/${tutorial.id}`} className="text-sm font-medium text-primary hover:underline">
          More Details
        </Link>
      </CardFooter>
    </Card>
  )
}