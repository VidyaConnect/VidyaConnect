interface ClassTrendRow {
  className: string
  progress: number
}

interface WeeklyTrendChartProps {
  classes?: ClassTrendRow[]
  loading?: boolean
}

function getBarColor(value: number): string {
  if (value >= 90) return 'bg-[#007c6d]'
  if (value >= 80) return 'bg-[#2f8d83]'
  if (value >= 70) return 'bg-[#86a4df]'
  return 'bg-[#cd5a5d]'
}

export default function WeeklyTrendChart({ classes = [], loading = false }: WeeklyTrendChartProps) {
  const hasData = classes.length > 0

  return (
    <section className="max-w-[720px] rounded-lg border border-[#cfd4dd] bg-white px-5 py-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#003b78]">Weekly Attendance Trend</h2>
        <div className="flex items-center gap-5 text-sm text-[#5c6068]">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-[#007c6d]" />
            Present
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-[#c3161c]" />
            Absent
          </div>
        </div>
      </div>

      <div className="mb-5 space-y-5">
        <div className="h-px bg-[#cfd4dd]" />
        <div className="h-px bg-[#cfd4dd]" />
        <div className="h-px bg-[#cfd4dd]" />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="grid grid-cols-[110px_1fr] items-center gap-5">
              <div className="h-4 w-20 animate-pulse rounded bg-[#e6e8eb]" />
              <div className="h-6 animate-pulse rounded-full bg-[#e6e8eb]" />
            </div>
          ))}
        </div>
      ) : !hasData ? (
        <p className="py-6 text-center text-sm text-[#888]">No attendance data yet. Mark attendance to see trends here.</p>
      ) : (
        <div className="space-y-4">
          {classes.map((row) => {
            const color = getBarColor(row.progress)
            return (
              <div key={row.className} className="grid grid-cols-[110px_1fr] items-center gap-5">
                <p className="text-sm font-bold text-[#555962]">{row.className}</p>
                <div className="relative h-6 rounded-full bg-[#e6e8eb]">
                  <div
                    className={`flex h-6 items-center justify-end rounded-full pr-2.5 text-xs font-bold text-white transition-all duration-700 ${color}`}
                    style={{ width: `${Math.max(row.progress, 4)}%` }}
                  >
                    {row.progress}%
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
