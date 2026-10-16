import type { Student, AttendanceDay } from '@/features/attendance/types'

interface StudentRosterProps {
  students: Array<{
    student: Student
    records: AttendanceDay[]
  }>
  onStatusChange: (studentId: string, date: string, status: 'P' | 'A' | 'L' | 'E') => void
  currentDate: string
  showHeaderAction?: boolean
  onViewMore?: (studentId: string) => void
}

const StatusButton = ({
  status,
  isActive,
  onClick,
}: {
  status: 'P' | 'A'
  isActive: boolean
  onClick: () => void
}) => {
  const activeClass = status === 'P' ? 'bg-[#007c6d] text-white' : 'bg-[#c3161c] text-white'

  return (
    <button
      onClick={onClick}
      className={`h-9 w-9 rounded-md border text-sm font-bold transition-colors ${
        isActive
          ? `${activeClass} border-transparent shadow-sm`
          : 'border-[#c8ced9] bg-white text-[#4d525b] hover:bg-[#f4f7fb]'
      }`}
      title={status === 'P' ? 'Present' : 'Absent'}
    >
      {status}
    </button>
  )
}

export default function StudentRoster({
  students,
  onStatusChange,
  currentDate,
  showHeaderAction = true,
  onViewMore,
}: StudentRosterProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#cfd4dd] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#cfd4dd] px-5 py-3.5">
        <h2 className="text-xl font-bold text-[#003b78]">Student Roster</h2>
        {showHeaderAction && (
          <button className="rounded-md border border-[#b9dcd7] bg-[#e6f4f2] px-4 py-2 text-sm font-bold text-[#007c6d] transition-colors hover:bg-[#d8eeeb]">
            Mark All Present
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="bg-[#f1f1f2] text-left text-xs font-bold uppercase tracking-wider text-[#555962]">
              <th className="px-5 py-3">Student Name</th>
              <th className="px-5 py-3">Roll No.</th>
              <th className="px-5 py-3">Status Toggle</th>
              <th className="px-5 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {students.map((item) => {
              const currentRecord = item.records.find((r) => r.date === currentDate)

              return (
                <tr key={item.student.id} className="border-t border-[#cfd4dd] bg-white">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#dce7f3] text-sm font-bold text-[#003b78] shadow-sm">
                        {item.student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font-bold leading-tight text-[#26282c]">{item.student.name}</p>
                        <p className="mt-0.5 text-sm text-[#858892]">
                          {item.student.gender ?? 'Student'}{' '}
                          {item.student.age ? `| ${item.student.age} yrs` : ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-medium text-[#626773]">
                    {item.student.rollNo.replace('#B', '#8')}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <StatusButton
                        status="P"
                        isActive={currentRecord?.status === 'P'}
                        onClick={() => onStatusChange(item.student.id, currentDate, 'P')}
                      />
                      <StatusButton
                        status="A"
                        isActive={currentRecord?.status === 'A'}
                        onClick={() => onStatusChange(item.student.id, currentDate, 'A')}
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onViewMore?.(item.student.id)}
                      className="text-sm font-bold text-[#003b78] hover:text-[#00569b]"
                    >
                      View More
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
