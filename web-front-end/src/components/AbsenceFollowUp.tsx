import type { AbsenceFollowUp } from '@/features/attendance/types'
import { WarningIcon, AnnouncementsIcon } from '@/components/Icons'

interface AbsenceFollowUpProps {
  followUps: AbsenceFollowUp[]
  onAction: (studentId: string, action: string) => void
}

export default function AbsenceFollowUp({ followUps, onAction }: AbsenceFollowUpProps) {
  if (followUps.length === 0) {
    return null
  }

  return (
    <section className="mt-6 overflow-hidden rounded-lg border border-[#cfd4dd] bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-[#cfd4dd] px-5 py-3.5">
        <WarningIcon size={20} className="text-[#c3161c]" />
        <h3 className="text-lg font-bold text-[#9f0f17]">Absence Follow-up Required</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="bg-[#f1f1f2] text-left text-xs font-bold uppercase tracking-wider text-[#555962]">
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Parent Contact</th>
              <th className="px-5 py-3">Reason Provided</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {followUps.map((followUp) => (
              <tr key={followUp.studentId} className="border-t border-[#e2e5eb] bg-white">
                <td className="px-5 py-4 text-base font-bold text-[#25272c]">{followUp.studentName}</td>
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-[#353942]">{followUp.parentContact}</p>
                  <p className="text-sm font-semibold text-[#5b606a]">{followUp.email}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-[#fff7f6] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#c3161c]">
                    Uninformed
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => onAction(followUp.studentId, 'notify')}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#007c6d] hover:text-[#005f54]"
                  >
                    <AnnouncementsIcon size={16} />
                    Notify Parent
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
