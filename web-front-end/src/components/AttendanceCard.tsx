interface AttendanceCardProps {
  icon: React.ReactNode
  label: string
  count: number
  percentage?: number
  bgColor?: string
}

export default function AttendanceCard({
  icon,
  label,
  count,
  percentage,
  bgColor = 'bg-white',
}: AttendanceCardProps) {
  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6 border border-gray-100`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{count}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
      {percentage !== undefined && (
        <p className="text-xs text-gray-500 mt-2">{percentage}% increase</p>
      )}
    </div>
  )
}
