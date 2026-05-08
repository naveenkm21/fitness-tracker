"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { eq, desc, sql, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { users, workouts, achievements } from "@/lib/db/schema"
import { ACHIEVEMENTS, type AchievementContext } from "@/lib/achievements"

const XP_PER_LEVEL = (level: number) => Math.round(100 * level * 1.5)

export async function ensureUser() {
  const { userId } = await auth()
  if (!userId) return null

  const existing = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  if (existing.length > 0) return existing[0]

  const cu = await currentUser()
  const email = cu?.emailAddresses[0]?.emailAddress ?? ""
  const username =
    cu?.username ?? cu?.firstName ?? email.split("@")[0] ?? "athlete"

  const [created] = await db
    .insert(users)
    .values({ id: userId, email, username })
    .returning()
  return created
}

async function computeStreak(userId: string): Promise<number> {
  // Pull distinct workout-day timestamps in user's local time.
  // Use UTC date here for simplicity; close enough for a streak counter.
  const rows = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${workouts.createdAt}), 'YYYY-MM-DD')`,
    })
    .from(workouts)
    .where(eq(workouts.userId, userId))
    .groupBy(sql`date_trunc('day', ${workouts.createdAt})`)
    .orderBy(sql`date_trunc('day', ${workouts.createdAt}) desc`)
    .limit(60)

  if (rows.length === 0) return 0

  const days = new Set(rows.map((r) => r.day))
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)
  const yesterday = new Date(today)
  yesterday.setUTCDate(today.getUTCDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  // Streak active if today or yesterday has a workout
  let cursor: Date
  if (days.has(todayStr)) cursor = today
  else if (days.has(yesterdayStr)) cursor = yesterday
  else return 0

  let streak = 0
  while (true) {
    const key = cursor.toISOString().slice(0, 10)
    if (!days.has(key)) break
    streak += 1
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }
  return streak
}

export async function getMyStats() {
  const me = await ensureUser()
  if (!me) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [todayRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(workouts)
    .where(sql`${workouts.userId} = ${me.id} and ${workouts.createdAt} >= ${today}`)

  const [totalsRow] = await db
    .select({
      total: sql<number>`count(*)::int`,
      reps: sql<number>`coalesce(sum(${workouts.reps}), 0)::int`,
      uniqueExercises: sql<number>`count(distinct ${workouts.exercise})::int`,
    })
    .from(workouts)
    .where(eq(workouts.userId, me.id))

  const streak = await computeStreak(me.id)

  return {
    id: me.id,
    username: me.username,
    email: me.email,
    level: me.level,
    xp: me.xp,
    xpForNextLevel: XP_PER_LEVEL(me.level),
    exercisesToday: Number(todayRow.count),
    totalWorkouts: Number(totalsRow.total),
    totalReps: Number(totalsRow.reps),
    uniqueExercises: Number(totalsRow.uniqueExercises),
    streak,
  }
}

export async function getRecentWorkouts(limit = 10) {
  const me = await ensureUser()
  if (!me) return []
  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, me.id))
    .orderBy(desc(workouts.createdAt))
    .limit(limit)
}

export async function getPersonalRecords() {
  const me = await ensureUser()
  if (!me) return []
  return db
    .select({
      exercise: workouts.exercise,
      bestReps: sql<number>`max(${workouts.reps})::int`,
      attempts: sql<number>`count(*)::int`,
      lastAt: sql<Date>`max(${workouts.createdAt})`,
    })
    .from(workouts)
    .where(eq(workouts.userId, me.id))
    .groupBy(workouts.exercise)
    .orderBy(desc(sql`max(${workouts.reps})`))
}

export async function getHeatmap(days = 90) {
  const me = await ensureUser()
  if (!me) return []
  const since = new Date()
  since.setUTCHours(0, 0, 0, 0)
  since.setUTCDate(since.getUTCDate() - (days - 1))

  const rows = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${workouts.createdAt}), 'YYYY-MM-DD')`,
      reps: sql<number>`coalesce(sum(${workouts.reps}), 0)::int`,
    })
    .from(workouts)
    .where(sql`${workouts.userId} = ${me.id} and ${workouts.createdAt} >= ${since}`)
    .groupBy(sql`date_trunc('day', ${workouts.createdAt})`)

  return rows
}

export async function getMyAchievements() {
  const me = await ensureUser()
  if (!me) return []
  return db
    .select()
    .from(achievements)
    .where(eq(achievements.userId, me.id))
    .orderBy(desc(achievements.unlockedAt))
}

async function evaluateAchievements(
  userId: string,
  ctx: AchievementContext,
): Promise<string[]> {
  const existing = await db
    .select({ code: achievements.code })
    .from(achievements)
    .where(eq(achievements.userId, userId))
  const owned = new Set(existing.map((r) => r.code))

  const newlyUnlocked = ACHIEVEMENTS.filter(
    (a) => !owned.has(a.code) && a.unlocked(ctx),
  )

  if (newlyUnlocked.length === 0) return []

  await db
    .insert(achievements)
    .values(newlyUnlocked.map((a) => ({ userId, code: a.code })))
    .onConflictDoNothing()

  return newlyUnlocked.map((a) => a.code)
}

export async function recordWorkout(input: {
  exercise: string
  reps: number
  durationSec?: number
}) {
  const me = await ensureUser()
  if (!me) throw new Error("Not authenticated")

  // Check current PR for this exercise
  const [prRow] = await db
    .select({ best: sql<number>`coalesce(max(${workouts.reps}), 0)::int` })
    .from(workouts)
    .where(and(eq(workouts.userId, me.id), eq(workouts.exercise, input.exercise)))

  const previousBest = Number(prRow?.best ?? 0)
  const isPR = input.reps > previousBest

  const xpEarned = Math.max(0, input.reps) * 5 + (isPR ? 25 : 0)

  await db.insert(workouts).values({
    userId: me.id,
    exercise: input.exercise,
    reps: input.reps,
    durationSec: input.durationSec ?? 0,
    xpEarned,
  })

  let xp = me.xp + xpEarned
  let level = me.level
  while (xp >= XP_PER_LEVEL(level)) {
    xp -= XP_PER_LEVEL(level)
    level += 1
  }

  await db
    .update(users)
    .set({ xp, level, updatedAt: new Date() })
    .where(eq(users.id, me.id))

  // Recompute aggregates for achievement evaluation
  const [totals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      reps: sql<number>`coalesce(sum(${workouts.reps}), 0)::int`,
      uniqueExercises: sql<number>`count(distinct ${workouts.exercise})::int`,
    })
    .from(workouts)
    .where(eq(workouts.userId, me.id))

  // Count distinct exercises where user has set a PR (i.e. exercises they've performed)
  // For simplicity: every distinct exercise's max-reps row counts as a PR moment.
  // Better approximation: number of distinct exercises ever logged is also "PR count".
  const prCount = Number(totals.uniqueExercises)
  const streak = await computeStreak(me.id)

  const newlyUnlocked = await evaluateAchievements(me.id, {
    totalWorkouts: Number(totals.total),
    totalReps: Number(totals.reps),
    uniqueExercises: Number(totals.uniqueExercises),
    level,
    streak,
    prCount,
  })

  revalidatePath("/dashboard")
  revalidatePath("/leaderboard")

  return {
    xpEarned,
    xp,
    level,
    isPR,
    previousBest,
    newReps: input.reps,
    newAchievements: newlyUnlocked,
  }
}

export async function getLeaderboard(limit = 100) {
  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      level: users.level,
      xp: users.xp,
      totalWorkouts: sql<number>`coalesce(count(${workouts.id}), 0)::int`,
      totalReps: sql<number>`coalesce(sum(${workouts.reps}), 0)::int`,
      lastWorkoutAt: sql<Date | null>`max(${workouts.createdAt})`,
    })
    .from(users)
    .leftJoin(workouts, eq(workouts.userId, users.id))
    .groupBy(users.id)
    .orderBy(desc(users.level), desc(users.xp))
    .limit(limit)
  return rows
}
