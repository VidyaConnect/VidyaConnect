'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import ClassSelector from '@/components/ClassSelector'
import AttendanceCard from '@/components/AttendanceCard'
import StudentRoster from '@/components/StudentRoster'
import AbsenceFollowUp from '@/components/AbsenceFollowUp'
import { useAttendance, useAbsenceFollowUp } from '@/features/attendance/hooks'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MoreIcon,
  SaveIcon,
  CalendarIcon,
  HelpIcon,
} from '@/components/Icons'

function formatDateInput(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${mm}/${dd}/${yyyy}`
}

function formatTodayIso(): string {
  return new Date().toISOString().split('T')[0]
}

export default function TeacherAttendancePage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState('attendance')
  const [searchTerm, setSearchTerm] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const {
    students,
    selectedClass,
    setSelectedClass,
    summary,
    updateAttendanceStatus,
    saveAttendance,
    markAllPresent,
    refreshRoster,
    loading,
    error,
  } = useAttendance()

  const { followUps, updateFollowUp } = useAbsenceFollowUp()
  const currentDate = formatTodayIso()
  const displayDate = formatDateInput(new Date())

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return students
    }

    return students.filter(({ student }) =>
      [student.name, student.rollNo, selectedClass.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch))
    )
  }, [searchTerm, selectedClass.name, students])

  const remainingToMark = summary.notMarkedToday

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveAttendance()
      setToast({ type: 'success', message: 'Attendance saved successfully' })
      setTimeout(() => setToast(null), 3500)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to save attendance'
      setToast({ type: 'error', message: msg })
      setTimeout(() => setToast(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    void refreshRoster(selectedClass.id)
  }

  const handleMarkAllPresent = async () => {
    setSaving(true)
    try {
      await markAllPresent()
      setToast({ type: 'success', message: 'All students marked as present' })
      setTimeout(() => setToast(null), 3500)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to mark all present'
      setToast({ type: 'error', message: msg })
      setTimeout(() => setToast(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout
      userRole="teacher"
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      searchValue={searchTerm}
      onSearch={setSearchTerm}
      searchPlaceholder="Search student..."
      searchClassName="max-w-[420px]"
      footer={
        <footer className="sticky bottom-0 z-20 flex h-16 shrink-0 items-center justify-between border-t border-[#cfd4dd] bg-white px-8 shadow-[0_-1px_4px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-2.5 text-sm font-bold text-[#25272c]">
            <HelpIcon size={16} className="text-[#555962]" />
            {loading
              ? 'Loading attendance...'
              : `${remainingToMark} students remaining to be marked.`}
          </div>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving || loading}
              className="text-sm font-bold text-[#003b78] hover:text-[#00569b] disabled:opacity-50"
            >
              Cancel Changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 rounded-md bg-[#007c6d] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#006b5f] disabled:opacity-60"
            >
              <SaveIcon size={16} />
              {saving ? 'Saving...' : 'Save & Close'}
            </button>
          </div>
        </footer>
      }
    >
      <main className="flex-1 px-8 pb-8 pt-6">
        {toast && (
          <div
            className={`mb-5 rounded-md border px-4 py-3 text-sm font-medium shadow-sm ${
              toast.type === 'success'
                ? 'border-[#b9dcd7] bg-[#e6f4f2] text-[#007c6d]'
                : 'border-[#f5c0bd] bg-[#fdecea] text-[#c3161c]'
            }`}
          >
            {toast.message}
          </div>
        )}

        {error && !toast && (
          <div className="mb-5 rounded-md border border-[#f5c0bd] bg-[#fdecea] px-4 py-3 text-sm font-medium text-[#c3161c] shadow-sm">
            {error}
          </div>
        )}

        <div className="mb-5 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold leading-tight text-[#003b78]">Mark Attendance</h1>
            <p className="mt-1 text-sm text-[#555962]">
              Manage daily attendance records for your assigned classes.
            </p>
          </div>

          <div className="flex items-end gap-4">
            <div className="w-32">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#555962]">
                Class
              </label>
              <ClassSelector
                selectedClass={selectedClass.id}
                onChange={(value) => {
                  setSelectedClass((prev) => ({ ...prev, id: value, name: `Grade ${value}` }))
                  void refreshRoster(value)
                }}
              />
            </div>
            <div className="w-44">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#555962]">
                Date
              </label>
              <div className="flex h-10 items-center gap-2.5 rounded-md border border-[#c9ced9] bg-white px-3 text-sm text-[#25272c]">
                <CalendarIcon size={16} className="text-[#4f5661]" />
                {displayDate}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AttendanceCard
            icon={<CheckCircleIcon size={20} />}
            label="Present"
            count={String(summary.presentToday).padStart(2, '0')}
            valueClassName="text-[#007c6d]"
            iconBgClassName="bg-[#e2f1ee] text-[#007c6d]"
          />
          <AttendanceCard
            icon={<XCircleIcon size={20} />}
            label="Absent"
            count={String(summary.absentToday).padStart(2, '0')}
            valueClassName="text-[#c3161c]"
            iconBgClassName="bg-[#fde9e8] text-[#c3161c]"
          />
          <AttendanceCard
            icon={<ClockIcon size={20} />}
            label="Late"
            count={String(summary.lateToday).padStart(2, '0')}
            valueClassName="text-[#003b78]"
            iconBgClassName="bg-[#e8eef8] text-[#003b78]"
          />
          <AttendanceCard
            icon={<MoreIcon size={20} />}
            label="Unmarked"
            count={String(summary.notMarkedToday).padStart(2, '0')}
            valueClassName="text-[#555962]"
            iconBgClassName="bg-[#e2e2e2] text-[#777b84]"
            borderClassName="border-dashed border-[#cfd4dd]"
          />
        </div>

        <StudentRoster
          students={filteredStudents}
          onStatusChange={updateAttendanceStatus}
          currentDate={currentDate}
          showHeaderAction={false}
          onViewMore={(studentId) => router.push(`/attendance/teacher/student/${studentId}`)}
        />

        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleMarkAllPresent}
            disabled={saving || loading}
            className="rounded-md border border-[#b9dcd7] bg-[#e6f4f2] px-4 py-2 text-sm font-bold text-[#007c6d] transition-colors hover:bg-[#d8eeeb] disabled:opacity-50"
          >
            Mark All Present
          </button>
        </div>
        <AbsenceFollowUp followUps={followUps} onAction={updateFollowUp} />
      </main>
    </DashboardLayout>
  )
}

