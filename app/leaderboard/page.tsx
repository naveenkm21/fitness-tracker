import { auth } from "@clerk/nextjs/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import DashboardHeader from "@/components/dashboard-header"
import { Crown, Medal, Trophy, Flame, Activity, TrendingUp } from "lucide-react"
import { getLeaderboard, ensureUser } from "@/lib/actions"
import { cn } from "@/lib/utils"

type Row = Awaited<ReturnType<typeof getLeaderboard>>[number]

function tierFor(rank: number): { label: string; gradient: string; ring: string } {
  if (rank === 1) return { label: "Champion", gradient: "from-yellow-400 via-amber-500 to-orange-500", ring: "ring-yellow-400" }
  if (rank <= 3) return { label: "Elite", gradient: "from-violet-500 via-fuchsia-500 to-pink-500", ring: "ring-violet-400" }
  if (rank <= 10) return { label: "Diamond", gradient: "from-cyan-400 via-sky-500 to-blue-600", ring: "ring-cyan-400" }
  if (rank <= 25) return { label: "Gold", gradient: "from-amber-400 to-yellow-600", ring: "ring-amber-400" }
  if (rank <= 50) return { label: "Silver", gradient: "from-zinc-300 to-zinc-500", ring: "ring-zinc-300" }
  return { label: "Bronze", gradient: "from-amber-700 to-orange-800", ring: "ring-amber-700" }
}

function isActiveToday(d: Date | null): boolean {
  if (!d) return false
  const t = new Date()
  t.setHours(0, 0, 0, 0)
  return new Date(d).getTime() >= t.getTime()
}

export default async function LeaderboardPage() {
  await ensureUser()
  const { userId } = await auth()
  const data = await getLeaderboard(100)
  const myIndex = data.findIndex((e) => e.id === userId)
  const myRank = myIndex >= 0 ? myIndex + 1 : null
  const me = myIndex >= 0 ? data[myIndex] : null

  // Aggregate stats banner
  const totalAthletes = data.length
  const topXp = data[0]?.xp ?? 0
  const topLevel = data[0]?.level ?? 1

  const podium = data.slice(0, 3)
  const rest = data.slice(3)

  // 5-row neighborhood around the user
  const neighborhood = me
    ? data.slice(Math.max(0, myIndex - 2), Math.min(data.length, myIndex + 3))
    : []

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto max-w-5xl space-y-8">
          {/* Hero banner */}
          <div className="relative rounded-3xl border overflow-hidden p-6 md:p-10">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-rose-500/10" />
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="relative grid gap-6 md:grid-cols-[1fr_auto] items-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="gap-1.5">
                  <Trophy className="h-3 w-3 text-yellow-500" />
                  Global Rankings
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  <span className="gradient-text">Hall of Gains</span>
                </h1>
                <p className="text-muted-foreground max-w-md">
                  Earn XP, climb the tiers, claim the throne.
                </p>
                <div className="flex flex-wrap gap-6 pt-3 text-sm">
                  <Stat icon={Activity} label="Athletes" value={totalAthletes} />
                  <Stat icon={Trophy} label="Top XP" value={topXp.toLocaleString()} />
                  <Stat icon={TrendingUp} label="Top Level" value={topLevel} />
                </div>
              </div>
              {myRank && me && (
                <div className="rounded-2xl border bg-card/80 backdrop-blur p-5 min-w-[200px]">
                  <div className="text-xs text-muted-foreground">Your rank</div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-4xl font-bold">#{myRank}</span>
                    <Badge
                      className={cn(
                        "bg-gradient-to-r text-white border-transparent",
                        tierFor(myRank).gradient,
                      )}
                    >
                      {tierFor(myRank).label}
                    </Badge>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    Lv {me.level} · {me.xp.toLocaleString()} XP
                  </div>
                </div>
              )}
            </div>
          </div>

          {data.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16 text-muted-foreground">
                No entries yet. Be the first to log a workout!
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Podium */}
              {podium.length > 0 && <Podium podium={podium} userId={userId} />}

              {/* Your standing */}
              {me && myRank && myRank > 3 && (
                <Card className="border-primary/30 card-glow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      Your standing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 pb-2">
                    <ul>
                      {neighborhood.map((entry, i) => {
                        const realIdx = Math.max(0, myIndex - 2) + i
                        return (
                          <Row
                            key={entry.id}
                            entry={entry}
                            rank={realIdx + 1}
                            isMe={entry.id === userId}
                          />
                        )
                      })}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Full ranking */}
              {rest.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Full ranking</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 pb-2">
                    <ul>
                      {rest.map((entry, i) => (
                        <Row
                          key={entry.id}
                          entry={entry}
                          rank={i + 4}
                          isMe={entry.id === userId}
                        />
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function Stat({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <div className="font-bold">{value}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}

function Podium({ podium, userId }: { podium: Row[]; userId: string | null }) {
  // Order for display: 2 (left), 1 (center), 3 (right)
  const layout = [
    { entry: podium[1], rank: 2, height: "h-36 md:h-44", icon: Medal, color: "from-zinc-300 via-zinc-400 to-zinc-600", glow: "shadow-zinc-400/30" },
    { entry: podium[0], rank: 1, height: "h-44 md:h-56", icon: Crown, color: "from-yellow-300 via-amber-400 to-orange-500", glow: "shadow-amber-400/40" },
    { entry: podium[2], rank: 3, height: "h-28 md:h-36", icon: Medal, color: "from-orange-700 via-amber-700 to-yellow-900", glow: "shadow-amber-700/30" },
  ]
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-6 items-end">
      {layout.map((slot, idx) => {
        const e = slot.entry
        if (!e) return <div key={idx} />
        const Icon = slot.icon
        const isMe = e.id === userId
        const live = isActiveToday(e.lastWorkoutAt)
        return (
          <div key={e.id} className="flex flex-col items-center">
            {/* Avatar + crown */}
            <div className="relative mb-3">
              {slot.rank === 1 && (
                <Crown className="h-7 w-7 md:h-9 md:w-9 text-yellow-400 absolute -top-7 md:-top-10 left-1/2 -translate-x-1/2 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
              )}
              <Avatar
                className={cn(
                  "h-16 w-16 md:h-24 md:w-24 ring-4 ring-offset-4 ring-offset-background shadow-xl",
                  slot.rank === 1 ? "ring-yellow-400" : slot.rank === 2 ? "ring-zinc-300" : "ring-amber-700",
                )}
              >
                <AvatarFallback className="text-xl md:text-2xl font-bold bg-secondary">
                  {e.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {live && (
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
              )}
            </div>
            {/* Name */}
            <div className="text-center mb-3 min-h-[44px]">
              <div className="font-bold truncate max-w-[12ch]">
                {e.username}
                {isMe && <span className="text-[10px] text-muted-foreground"> (you)</span>}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Lv {e.level}
              </div>
            </div>
            {/* Pillar */}
            <div
              className={cn(
                "w-full rounded-t-2xl bg-gradient-to-t flex flex-col items-center justify-end pb-4 px-2 text-white shadow-lg relative overflow-hidden",
                slot.color,
                slot.height,
                slot.glow,
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20 pointer-events-none" />
              <Icon className="h-6 w-6 md:h-8 md:w-8 mb-2 drop-shadow" />
              <div className="font-bold text-base md:text-lg">{e.xp.toLocaleString()}</div>
              <div className="text-[10px] md:text-xs opacity-90 uppercase tracking-wider">XP</div>
              <div className="mt-2 text-2xl md:text-3xl font-black opacity-30">#{slot.rank}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Row({ entry, rank, isMe }: { entry: Row; rank: number; isMe: boolean }) {
  const tier = tierFor(rank)
  const live = isActiveToday(entry.lastWorkoutAt)
  return (
    <li
      className={cn(
        "flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 border-b last:border-b-0 transition",
        isMe && "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent",
      )}
    >
      {/* Rank */}
      <div
        className={cn(
          "grid place-items-center h-9 w-9 rounded-lg font-bold text-sm shrink-0",
          rank <= 10
            ? `bg-gradient-to-br ${tier.gradient} text-white`
            : "bg-secondary text-foreground",
        )}
      >
        {rank}
      </div>
      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{entry.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        {live && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
        )}
      </div>
      {/* Name + tier */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{entry.username}</span>
          {isMe && <Badge variant="secondary" className="text-[10px] shrink-0">You</Badge>}
          {rank <= 50 && (
            <Badge
              variant="outline"
              className={cn(
                "text-[9px] uppercase tracking-wider px-1.5 py-0 hidden sm:inline-flex shrink-0",
                rank <= 10 && "border-transparent bg-gradient-to-r text-white " + tier.gradient,
              )}
            >
              {tier.label}
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-3">
          <span>Lv {entry.level}</span>
          <span className="hidden md:inline">·</span>
          <span className="hidden md:inline">{entry.totalWorkouts} workouts</span>
          <span className="hidden md:inline">·</span>
          <span className="hidden md:inline">{entry.totalReps.toLocaleString()} reps</span>
        </div>
      </div>
      {/* XP */}
      <div className="text-right shrink-0">
        <div className="font-bold tabular-nums">{entry.xp.toLocaleString()}</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">XP</div>
      </div>
    </li>
  )
}
