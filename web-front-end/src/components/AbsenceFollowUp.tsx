'use client'

import { useState } from 'react'
import type { AbsenceFollowUp } from '@/features/attendance/types'
import { WarningIcon, AnnouncementsIcon } from '@/components/Icons'

interface AbsenceFollowUpProps {
  followUps: AbsenceFollowUp[]
  onAction: (studentId: string, action: string, reason?: string) => void
}

interface RowState {
  selected: 'Informed' | 'Uninformed' | null
  reason: string
  saved: boolean
}

export default function AbsenceFollowUp({ followUps, onAction }: AbsenceFollowUpProps) {
  const [rowStates, setRowStates] = useState<Record<string, RowState>>({})

  if (followUps.length === 0) {
    return null
  }

  const getRow = (studentId: string, followUp: AbsenceFollowUp): RowState => {
    if (rowStates[studentId]) return rowStates[studentId]
    // seed from existing API data
    return {
      selected: followUp.reason === 'Informed' ? 'Informed' : followUp.reason === 'Uninformed' ? 'Uninformed' : null,
      reason: followUp.reasonDetails || '',
      saved: false,
    }
  }

  const setSelection = (studentId: string, value: 'Informed' | 'Uninformed') => {
    setRowStates((prev) => ({
      ...prev,
      [studentId]: {
        ...getRow(studentId, followUps.find((f) => f.studentId === studentId)!),
        selected: value,
        saved: false,
      },
    }))
  }

  const setReason = (studentId: string, reason: string) => {
    setRowStates((prev) => ({
      ...prev,
      [studentId]: {
        ...getRow(studentId, followUps.find((f) => f.studentId === studentId)!),
        reason,
        saved: false,
      },
    }))
  }

  const handleSave = (studentId: string, row: RowState) => {
    onAction(studentId, row.selected === 'Informed' ? 'informed' : 'notify', row.reason)
    setRowStates((prev) => ({
      ...prev,
      [studentId]: { ...row, saved: true },
    }))
  }

  return (
    <section className="mt-6 overflow-hidden rounded-lg border border-[#cfd4dd] bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-[#cfd4dd] px-5 py-3.5">
        <WarningIcon size={20} className="text-[#c3161c]" />
        <h3 className="text-lg font-bold text-[#9f0f17]">Absence Follow-up Required</h3>
      </div>

      <div className="divide-y divide-[#e2e5eb]">
        {followUps.map((followUp) => {
          const row = getRow(followUp.studentId, followUp)

          return (
            <div key={followUp.studentId} className="px-5 py-4">
              {/* Top row: student, parent contact, action */}
              <div className="grid grid-cols-[1fr_auto_auto] items-start gap-6">
                <div>
                  <p className="text-base font-bold text-[#25272c]">{followUp.studentName}</p>
                  <p className="mt-0.5 text-sm font-medium text-[#353942]">{followUp.parentContact}</p>
                  <p className="text-sm text-[#5b606a]">{followUp.email}</p>
                </div>

                {/* Informed / Uninformed toggle */}
                <div className="flex flex-col items-end gap-2 pt-0.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#555962]">Reason Status</p>
                  <div className="flex overflow-hidden rounded-md border border-[#c9ced9]">
                    <button
                      onClick={() => setSelection(followUp.studentId, 'Informed')}
                      className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                        row.selected === 'Informed'
                          ? 'bg-[#007c6d] text-white'
                          : 'bg-white text-[#4d525b] hover:bg-[#f4f7fb]'
                      }`}
                    >
                      Informed
                    </button>
                    <button
                      onClick={() => setSelection(followUp.studentId, 'Uninformed')}
                      className={`border-l border-[#c9ced9] px-3 py-1.5 text-xs font-bold transition-colors ${
                        row.selected === 'Uninformed'
                          ? 'bg-[#c3161c] text-white'
                          : 'bg-white text-[#4d525b] hover:bg-[#f4f7fb]'
                      }`}
                    >
                      Uninformed
                    </button>
                  </div>
                </div>

                {/* Action column */}
                <div className="flex flex-col items-end gap-2 pt-0.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#555962]">Action</p>
                  {row.selected === 'Uninformed' && !row.saved && (
                    <button
                      onClick={() => handleSave(followUp.studentId, row)}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#007c6d] hover:text-[#005f54]"
                    >
                      <AnnouncementsIcon size={16} />
                      Notify Parent
                    </button>
                  )}
                  {row.selected === 'Informed' && !row.saved && (
                    <button
                      onClick={() => handleSave(followUp.studentId, row)}
                      disabled={!row.reason.trim()}
                      className="rounded-md bg-[#007c6d] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40 hover:bg-[#006b5f]"
                    >
                      Save
                    </button>
                  )}
                  {row.saved && (
                    <span className="text-xs font-bold text-[#007c6d]">✓ Saved</span>
                  )}
                </div>
              </div>

              {/* Reason input — only if Informed */}
              {row.selected === 'Informed' && (
                <div className="mt-3">
                  <label className="mb-1 block text-xs font-bold text-[#555962]">
                    Reason for Absence <span className="text-[#c3161c]">*</span>
                  </label>
                  <input
                    type="text"
                    value={row.reason}
                    onChange={(e) => setReason(followUp.studentId, e.target.value)}
                    placeholder="e.g. Fever, Family emergency, Doctor appointment…"
                    className="w-full rounded-md border border-[#c9ced9] bg-[#f9fafc] px-3 py-2 text-sm text-[#25272c] outline-none transition focus:border-[#007c6d] focus:bg-white focus:ring-1 focus:ring-[#007c6d]"
                  />
                </div>
              )}

              {/* Current status badge */}
              {row.selected === null && (
                <div className="mt-2">
                  <span className="rounded-full bg-[#fff7f6] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#c3161c]">
                    Uninformed — select status above
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
