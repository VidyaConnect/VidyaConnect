interface AttendanceCardProps {
  icon: React.ReactNode
  label: string
  count: number | string
  detail?: React.ReactNode
  valueClassName?: string
  iconBgClassName?: string
  borderClassName?: string
}

export default function AttendanceCard({
  icon,
  label,
  count,
  detail,
  valueClassName = 'text-[#003b78]',
  iconBgClassName = 'bg-[#e8f4f1] text-[#007c6d]',
  borderClassName = 'border-[#cfd4dd]',
}: AttendanceCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg border ${borderClassName} bg-white px-4 py-4 shadow-sm`}>
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 flex-none items-center justify-center rounded-full ${iconBgClassName}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold leading-none tracking-wide text-[#4e525a]">{label}</p>
          <p className={`mt-2 text-3xl font-bold leading-none ${valueClassName}`}>{count}</p>
          {detail && <div className="mt-1.5 text-xs text-[#5d626b]">{detail}</div>}
        </div>
      </div>
    </div>
  )
}
