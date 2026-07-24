'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Topbar from '@/components/Topbar'
import SearchBar from '@/components/SearchBar'
import ClassSelector from '@/components/ClassSelector'
import AttendanceCard from '@/components/AttendanceCard'
import StudentRoster from '@/components/StudentRoster'
import AbsenceFollowUp from '@/components/AbsenceFollowUp'
import WeeklyTrendChart from '@/components/WeeklyTrendChart'
import { useAttendance, useAbsenceFollowUp } from '@/features/attendance/hooks'

export default function AttendanceManagementPage() {
  const [currentPage, setCurrentPage] = useState('attendance')
  const { students, selectedClass, updateAttendanceStatus, getSummary } = useAttendance()
  const { followUps, updateFollowUp } = useAbsenceFollowUp()
  const summary = getSummary()
  const currentDate = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="admin" currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="ml-64">
        <Topbar
          title="Attendance Management"
          subtitle={`${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
          userRole="admin"
        />

        <main className="p-8">
          {/* Filters */}
          <div className="mb-8 flex gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CLASS RANGE
              </label>
              <ClassSelector
                selectedClass="all"
                onChange={(value) => console.log('Class changed:', value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEARCH
              </label>
              <SearchBar
                placeholder="Search student or class..."
                onSearch={(term) => console.log('Search:', term)}
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium h-10 mt-6 flex items-center gap-2">
              ⬇ Export Report
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <AttendanceCard
              icon="✓"
              label="PRESENT TODAY"
              count={summary.presentToday}
              percentage={parseInt(((summary.presentToday / summary.totalEnrollment) * 100).toString())}
              bgColor="bg-white"
            />
            <AttendanceCard
              icon="✕"
              label="ABSENT TODAY"
              count={summary.absentToday}
              percentage={parseInt(((summary.absentToday / summary.totalEnrollment) * 100).toString())}
              bgColor="bg-white"
            />
            <AttendanceCard
              icon="⏱"
              label="LATE TODAY"
              count={summary.lateToday}
              percentage={parseInt(((summary.lateToday / summary.totalEnrollment) * 100).toString())}
              bgColor="bg-white"
            />
            <AttendanceCard
              icon="⏳"
              label="NOT YET MARKED"
              count={summary.notMarkedToday}
              percentage={0}
              bgColor="bg-white"
            />
          </div>

          {/* Weekly Trend */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2">
              <WeeklyTrendChart />
            </div>
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Overall Attendance Rate</p>
                  <p className="text-2xl font-bold text-teal-600">{summary.percentage}%</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Enrollment</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalEnrollment}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Student Roster */}
          <StudentRoster
            students={students}
            onStatusChange={updateAttendanceStatus}
            currentDate={currentDate}
          />

          {/* Absence Follow-up */}
          <AbsenceFollowUp followUps={followUps} onAction={updateFollowUp} />

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium">
              Cancel Changes
            </button>
            <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium">
              ✓ Save & Close
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
