export type AchievementContext = {
  totalWorkouts: number
  totalReps: number
  uniqueExercises: number
  level: number
  streak: number
  prCount: number
}

export type AchievementDef = {
  code: string
  name: string
  description: string
  emoji: string
  tier: "bronze" | "silver" | "gold" | "platinum"
  unlocked: (ctx: AchievementContext) => boolean
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // Workouts
  {
    code: "first_workout",
    name: "First Step",
    description: "Log your first workout",
    emoji: "🎬",
    tier: "bronze",
    unlocked: (c) => c.totalWorkouts >= 1,
  },
  {
    code: "workouts_10",
    name: "Getting Going",
    description: "Complete 10 workouts",
    emoji: "🏁",
    tier: "bronze",
    unlocked: (c) => c.totalWorkouts >= 10,
  },
  {
    code: "workouts_50",
    name: "Half Century",
    description: "Complete 50 workouts",
    emoji: "🎯",
    tier: "silver",
    unlocked: (c) => c.totalWorkouts >= 50,
  },
  {
    code: "workouts_100",
    name: "Centurion",
    description: "Complete 100 workouts",
    emoji: "💯",
    tier: "gold",
    unlocked: (c) => c.totalWorkouts >= 100,
  },

  // Reps
  {
    code: "reps_100",
    name: "Triple Digits",
    description: "Hit 100 total reps",
    emoji: "💪",
    tier: "bronze",
    unlocked: (c) => c.totalReps >= 100,
  },
  {
    code: "reps_500",
    name: "Five Hundred Club",
    description: "Hit 500 total reps",
    emoji: "🥈",
    tier: "silver",
    unlocked: (c) => c.totalReps >= 500,
  },
  {
    code: "reps_1000",
    name: "Iron Will",
    description: "Hit 1,000 total reps",
    emoji: "🥇",
    tier: "gold",
    unlocked: (c) => c.totalReps >= 1000,
  },
  {
    code: "reps_5000",
    name: "Machine",
    description: "Hit 5,000 total reps",
    emoji: "🤖",
    tier: "platinum",
    unlocked: (c) => c.totalReps >= 5000,
  },

  // Variety
  {
    code: "variety_3",
    name: "Sampler",
    description: "Try 3 different exercises",
    emoji: "🍱",
    tier: "bronze",
    unlocked: (c) => c.uniqueExercises >= 3,
  },
  {
    code: "variety_all",
    name: "Well-Rounded",
    description: "Try all 10 exercises",
    emoji: "🌟",
    tier: "gold",
    unlocked: (c) => c.uniqueExercises >= 10,
  },

  // Streaks
  {
    code: "streak_3",
    name: "Lit",
    description: "Workout 3 days in a row",
    emoji: "🔥",
    tier: "bronze",
    unlocked: (c) => c.streak >= 3,
  },
  {
    code: "streak_7",
    name: "Weeklong Warrior",
    description: "Workout 7 days in a row",
    emoji: "📅",
    tier: "silver",
    unlocked: (c) => c.streak >= 7,
  },
  {
    code: "streak_30",
    name: "Habit Locked",
    description: "Workout 30 days in a row",
    emoji: "🗓️",
    tier: "platinum",
    unlocked: (c) => c.streak >= 30,
  },

  // Levels
  {
    code: "level_5",
    name: "Leveling Up",
    description: "Reach Level 5",
    emoji: "⬆️",
    tier: "bronze",
    unlocked: (c) => c.level >= 5,
  },
  {
    code: "level_10",
    name: "Double Digits",
    description: "Reach Level 10",
    emoji: "🔟",
    tier: "silver",
    unlocked: (c) => c.level >= 10,
  },
  {
    code: "level_25",
    name: "Veteran",
    description: "Reach Level 25",
    emoji: "🎖️",
    tier: "gold",
    unlocked: (c) => c.level >= 25,
  },

  // PRs
  {
    code: "pr_first",
    name: "Personal Best",
    description: "Set your first PR",
    emoji: "🏅",
    tier: "bronze",
    unlocked: (c) => c.prCount >= 1,
  },
  {
    code: "pr_5",
    name: "Record Breaker",
    description: "Set 5 personal records",
    emoji: "🏆",
    tier: "silver",
    unlocked: (c) => c.prCount >= 5,
  },
]

export const ACHIEVEMENT_BY_CODE = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.code, a]),
)

export const TIER_COLORS: Record<AchievementDef["tier"], string> = {
  bronze: "from-amber-700 to-orange-600",
  silver: "from-zinc-300 to-zinc-500",
  gold: "from-yellow-400 to-amber-500",
  platinum: "from-violet-400 to-fuchsia-500",
}
