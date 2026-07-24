import type { AbsenceFollowUp } from '@/features/attendance/types'

interface AbsenceFollowUpProps {
  followUps: AbsenceFollowUp[]
  onAction: (studentId: string, action: string) => void
}

export default function AbsenceFollowUp({ followUps, onAction }: AbsenceFollowUpProps) {
  if (followUps.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-red-200 p-6 mt-6">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">⚠️</span>
        <h3 className="text-lg font-semibold text-gray-900">Absence Follow-up Required</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Student</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Parent Contact</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">
                Reason Provided
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {followUps.map((followUp) => (
              <tr key={followUp.studentId} className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-900 font-medium">{followUp.studentName}</td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-gray-900">{followUp.parentContact}</p>
                    <p className="text-gray-500 text-xs">{followUp.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                    Uninformed
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onAction(followUp.studentId, 'notify')}
                    className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2"
                  >
                    ▶ Notify Parent
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
