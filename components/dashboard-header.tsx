"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { Dumbbell } from "lucide-react"
import { cn } from "@/lib/utils"
import CoachWidget from "@/components/coach-widget"

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workout", label: "Workout" },
  { href: "/coach", label: "Coach" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/leaderboard", label: "Leaderboard" },
]

export default function DashboardHeader() {
  const pathname = usePathname()
  return (
    <>
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <div className="grid place-items-center h-8 w-8 rounded-lg gradient-bg text-white">
              <Dumbbell className="h-4 w-4" />
            </div>
            <span className="gradient-text hidden sm:inline">FitTrack AI</span>
          </Link>
          <nav className="flex gap-1">
            {NAV.map((n) => {
              const active = pathname === n.href || pathname?.startsWith(n.href + "/")
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                  )}
                >
                  {n.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
    <CoachWidget />
    </>
  )
}
