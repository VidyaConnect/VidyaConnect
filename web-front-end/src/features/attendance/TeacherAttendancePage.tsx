'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Topbar from '@/components/Topbar'
import SearchBar from '@/components/SearchBar'
import ClassSelector from '@/components/ClassSelector'
import AttendanceCard from '@/components/AttendanceCard'
import StudentRoster from '@/components/StudentRoster'
import AbsenceFollowUp from '@/components/AbsenceFollowUp'
import { useAttendance, useAbsenceFollowUp } from '@/features/attendance/hooks'

export default function TeacherAttendancePage() {
  const [currentPage, setCurrentPage] = useState('attendance')
  const { students, selectedClass, updateAttendanceStatus, getSummary } = useAttendance()
  const { followUps, updateFollowUp } = useAbsenceFollowUp()
  const summary = getSummary()
  const currentDate = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="teacher" currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="ml-64">
        <Topbar
          title="Mark Attendance"
          subtitle={`${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
          userRole="teacher"
        />

        <main className="p-8">
          {/* Filters */}
          <div className="mb-8 flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <ClassSelector
                selectedClass="8a"
                onChange={(value) => console.log('Class changed:', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                defaultValue={currentDate}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <AttendanceCard
              icon="✓"
              label="Present"
              count={summary.presentToday}
              bgColor="bg-white"
            />
            <AttendanceCard
              icon="✕"
              label="Absent"
              count={summary.absentToday}
              bgColor="bg-white"
            />
            <AttendanceCard
              icon="⏱"
              label="Late"
              count={summary.lateToday}
              bgColor="bg-white"
            />
            <AttendanceCard
              icon="❓"
              label="Unmarked"
              count={summary.notMarkedToday}
              bgColor="bg-white"
            />
          </div>

          {/* Student Roster with Status Toggle */}
          <StudentRoster
            students={students}
            onStatusChange={updateAttendanceStatus}
            currentDate={currentDate}
          />

          {/* Absence Follow-up */}
          <AbsenceFollowUp followUps={followUps} onAction={updateFollowUp} />

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium transition-colors">
              Cancel Changes
            </button>
            <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors">
              ✓ Save & Close
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">ℹ</span> {students.length - summary.notMarkedToday}{' '}
              students remaining to be marked.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
