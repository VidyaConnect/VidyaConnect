import type { Student, AttendanceDay } from '@/features/attendance/types'

interface StudentRosterProps {
  students: Array<{
    student: Student
    records: AttendanceDay[]
  }>
  onStatusChange: (studentId: string, date: string, status: 'P' | 'A' | 'L' | 'E') => void
  currentDate: string
}

const StatusButton = ({
  status,
  isActive,
  onClick,
  label,
  bgColor,
}: {
  status: string
  isActive: boolean
  onClick: () => void
  label: string
  bgColor: string
}) => (
  <button
    onClick={onClick}
    className={`w-10 h-10 rounded-md font-semibold text-sm transition-all ${
      isActive
        ? `${bgColor} text-white shadow-md`
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
    title={label}
  >
    {status}
  </button>
)

export default function StudentRoster({
  students,
  onStatusChange,
  currentDate,
}: StudentRosterProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                STUDENT NAME
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                ROLL NO.
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                STATUS TOGGLE
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                LAST 7 DAYS
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((item, index) => {
              const currentRecord = item.records.find((r) => r.date === currentDate)
              const last7Days = item.records.slice(-7)

              return (
                <tr
                  key={item.student.id}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-blue-50 transition-colors`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm">
                        {item.student.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{item.student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.student.rollNo}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <StatusButton
                        status="P"
                        label="Present"
                        isActive={currentRecord?.status === 'P'}
                        bgColor="bg-teal-500"
                        onClick={() => onStatusChange(item.student.id, currentDate, 'P')}
                      />
                      <StatusButton
                        status="A"
                        label="Absent"
                        isActive={currentRecord?.status === 'A'}
                        bgColor="bg-red-500"
                        onClick={() => onStatusChange(item.student.id, currentDate, 'A')}
                      />
                      <StatusButton
                        status="L"
                        label="Late"
                        isActive={currentRecord?.status === 'L'}
                        bgColor="bg-blue-600"
                        onClick={() => onStatusChange(item.student.id, currentDate, 'L')}
                      />
                      <StatusButton
                        status="E"
                        label="Exempted"
                        isActive={currentRecord?.status === 'E'}
                        bgColor="bg-gray-500"
                        onClick={() => onStatusChange(item.student.id, currentDate, 'E')}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {last7Days.map((record, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            record.status === 'P'
                              ? 'bg-teal-500'
                              : record.status === 'A'
                              ? 'bg-red-500'
                              : record.status === 'L'
                              ? 'bg-blue-600'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
