export default function WeeklyTrendChart() {
  const rows = [
    { grade: 'Grade 1A', value: 98, color: 'bg-[#007c6d]' },
    { grade: 'Grade 3B', value: 92, color: 'bg-[#2f8d83]' },
    { grade: 'Grade 5C', value: 85, color: 'bg-[#86a4df]' },
    { grade: 'Grade 8A', value: 68, color: 'bg-[#cd5a5d]' },
  ]

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

      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.grade} className="grid grid-cols-[110px_1fr] items-center gap-5">
            <p className="text-sm font-bold text-[#555962]">{row.grade}</p>
            <div className="h-6 rounded-full bg-[#e6e8eb]">
              <div
                className={`flex h-6 items-center justify-end rounded-full pr-2.5 text-xs font-bold text-[#073247] ${row.color}`}
                style={{ width: `${row.value}%` }}
              >
                {row.value}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
