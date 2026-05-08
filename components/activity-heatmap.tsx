import { cn } from "@/lib/utils"

type Cell = { day: string; reps: number }

export default function ActivityHeatmap({
  data,
  weeks = 13,
}: {
  data: Cell[]
  weeks?: number
}) {
  const map = new Map(data.map((d) => [d.day, d.reps]))
  const totalDays = weeks * 7

  // Build days from oldest to newest, ending today.
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const start = new Date(today)
  start.setUTCDate(today.getUTCDate() - (totalDays - 1))

  // Pad start to align with Sunday so columns are weeks
  const startDow = start.getUTCDay() // 0 = Sun
  const padded = startDow

  const cells: { date: Date | null; reps: number }[] = []
  for (let i = 0; i < padded; i++) cells.push({ date: null, reps: 0 })
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start)
    d.setUTCDate(start.getUTCDate() + i)
    const key = d.toISOString().slice(0, 10)
    cells.push({ date: d, reps: map.get(key) ?? 0 })
  }

  // Group into weeks (columns)
  const cols: typeof cells[] = []
  for (let i = 0; i < cells.length; i += 7) {
    cols.push(cells.slice(i, i + 7))
  }

  const maxReps = Math.max(1, ...data.map((d) => d.reps))
  const intensity = (reps: number) => {
    if (reps === 0) return 0
    const r = reps / maxReps
    if (r < 0.25) return 1
    if (r < 0.5) return 2
    if (r < 0.75) return 3
    return 4
  }

  const COLOR = [
    "bg-secondary/40",
    "bg-emerald-500/25",
    "bg-emerald-500/45",
    "bg-emerald-500/70",
    "bg-emerald-500",
  ]

  return (
    <div className="space-y-2">
      <div className="flex gap-1 overflow-x-auto pb-1">
        {cols.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-1">
            {col.map((cell, ri) => (
              <div
                key={ri}
                title={
                  cell.date
                    ? `${cell.date.toISOString().slice(0, 10)} · ${cell.reps} reps`
                    : ""
                }
                className={cn(
                  "h-3 w-3 rounded-sm",
                  cell.date ? COLOR[intensity(cell.reps)] : "bg-transparent",
                )}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{weeks} weeks</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {COLOR.map((c, i) => (
            <div key={i} className={cn("h-2.5 w-2.5 rounded-sm", c)} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
