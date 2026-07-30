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

export default function TeacherAttendancePage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState('attendance')
  const [searchTerm, setSearchTerm] = useState('')
  const { students, selectedClass, updateAttendanceStatus } = useAttendance()
  const { followUps, updateFollowUp } = useAbsenceFollowUp()
  const currentDate = '2024-10-25'
  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return students
    }

    return students.filter(({ student }) =>
      [student.name, student.rollNo, selectedClass.name]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch))
    )
  }, [searchTerm, selectedClass.name, students])

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
            3 students remaining to be marked.
          </div>
          <div className="flex items-center gap-5">
            <button className="text-sm font-bold text-[#003b78] hover:text-[#00569b]">
              Cancel Changes
            </button>
            <button className="inline-flex items-center gap-2 rounded-md bg-[#007c6d] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#006b5f]">
              <SaveIcon size={16} />
              Save & Close
            </button>
          </div>
        </footer>
      }
    >
      <main className="flex-1 px-8 pb-8 pt-6">
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
                selectedClass="8a"
                onChange={(value) => console.log('Class changed:', value)}
              />
            </div>
            <div className="w-44">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#555962]">
                Date
              </label>
              <div className="flex h-10 items-center gap-2.5 rounded-md border border-[#c9ced9] bg-white px-3 text-sm text-[#25272c]">
                <CalendarIcon size={16} className="text-[#4f5661]" />
                10/24/2023
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AttendanceCard
            icon={<CheckCircleIcon size={20} />}
            label="Present"
            count="24"
            valueClassName="text-[#007c6d]"
            iconBgClassName="bg-[#e2f1ee] text-[#007c6d]"
          />
          <AttendanceCard
            icon={<XCircleIcon size={20} />}
            label="Absent"
            count="02"
            valueClassName="text-[#c3161c]"
            iconBgClassName="bg-[#fde9e8] text-[#c3161c]"
          />
          <AttendanceCard
            icon={<ClockIcon size={20} />}
            label="Late"
            count="01"
            valueClassName="text-[#003b78]"
            iconBgClassName="bg-[#e8eef8] text-[#003b78]"
          />
          <AttendanceCard
            icon={<MoreIcon size={20} />}
            label="Unmarked"
            count="03"
            valueClassName="text-[#555962]"
            iconBgClassName="bg-[#e2e2e2] text-[#777b84]"
            borderClassName="border-dashed border-[#cfd4dd]"
          />
        </div>

        <StudentRoster
          students={filteredStudents}
          onStatusChange={updateAttendanceStatus}
          currentDate={currentDate}
          onViewMore={(studentId) => router.push(`/attendance/teacher/student/${studentId}`)}
        />
        <AbsenceFollowUp followUps={followUps} onAction={updateFollowUp} />
      </main>
    </DashboardLayout>
  )
}
