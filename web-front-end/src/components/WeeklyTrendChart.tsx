interface WeeklyTrendChartProps {
  data?: Array<{
    day: string
    present: number
    absent: number
  }>
}

export default function WeeklyTrendChart({ data }: WeeklyTrendChartProps) {
  const mockData = data || [
    { day: 'Mon', present: 32, absent: 2 },
    { day: 'Tue', present: 30, absent: 4 },
    { day: 'Wed', present: 31, absent: 3 },
    { day: 'Thu', present: 32, absent: 2 },
    { day: 'Fri', present: 28, absent: 6 },
  ]

  const maxValue = 35

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Attendance Trend</h3>

      <div className="mb-4 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-teal-600 rounded"></div>
          <span className="text-sm text-gray-700">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-700">Absent</span>
        </div>
      </div>

      <div className="space-y-4">
        {mockData.map((item) => (
          <div key={item.day}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{item.day}</span>
              <span className="text-sm text-gray-500">{item.present} students</span>
            </div>
            <div className="flex gap-1 h-8">
              <div
                className="bg-teal-600 rounded"
                style={{ width: `${(item.present / maxValue) * 100}%` }}
              ></div>
              <div
                className="bg-red-500 rounded"
                style={{ width: `${(item.absent / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
