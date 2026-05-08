import {
  pgTable,
  text,
  integer,
  timestamp,
  serial,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  username: text("username").notNull(),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const workouts = pgTable(
  "workouts",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    exercise: text("exercise").notNull(),
    reps: integer("reps").notNull().default(0),
    durationSec: integer("duration_sec").notNull().default(0),
    xpEarned: integer("xp_earned").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("workouts_user_idx").on(t.userId),
    createdIdx: index("workouts_created_idx").on(t.createdAt),
  }),
)

export const achievements = pgTable(
  "achievements",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
  },
  (t) => ({
    userCodeUnq: uniqueIndex("achievements_user_code_unq").on(t.userId, t.code),
  }),
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Workout = typeof workouts.$inferSelect
export type NewWorkout = typeof workouts.$inferInsert
