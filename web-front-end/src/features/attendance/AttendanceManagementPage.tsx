'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Topbar from '@/components/Topbar'
import ClassSelector from '@/components/ClassSelector'
import AttendanceCard from '@/components/AttendanceCard'
import WeeklyTrendChart from '@/components/WeeklyTrendChart'
import {
  UserCheckIcon,
  UserXmarkIcon,
  ClockIcon,
  MoreIcon,
  DownloadIcon,
  CalendarIcon,
} from '@/components/Icons'

export default function AttendanceManagementPage() {
  const [currentPage, setCurrentPage] = useState('attendance')
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-sans text-[#25272c]">
      <Navbar userRole="admin" currentPage={currentPage} onNavigate={setCurrentPage} />
      <Topbar
        userRole="admin"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        searchPlaceholder="Search student or class..."
        searchClassName="max-w-[320px]"
      />

      <main className="ml-56 px-6 pt-5">
        <div className="mb-5 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold leading-tight text-[#003b78]">Attendance Management</h1>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-[#555962]">
              <CalendarIcon size={16} />
              Thursday, October 24, 2024
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div className="w-52">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#555962]">
                Class Range
              </label>
              <ClassSelector
                selectedClass="all"
                onChange={(value) => console.log('Class changed:', value)}
              />
            </div>
            <button className="inline-flex h-10 items-center gap-2 rounded-md bg-[#002d62] px-5 text-sm font-bold text-white shadow-sm hover:bg-[#003b78]">
              <DownloadIcon size={16} />
              Export Report
            </button>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-4 gap-4">
          <AttendanceCard
            icon={<UserCheckIcon size={40} className="opacity-10" />}
            label="PRESENT TODAY"
            count="1,248"
            valueClassName="text-[#17a69a]"
            iconBgClassName="absolute right-4 top-3 text-[#17a69a]"
            detail={
              <>
                <span>94% of total enrollment </span>
                <span className="ml-2 rounded-full bg-[#cdeee9] px-2 py-0.5 text-[11px] font-bold text-[#17a69a]">
                  +2.4%
                </span>
              </>
            }
          />
          <AttendanceCard
            icon={<UserXmarkIcon size={40} className="opacity-10" />}
            label="ABSENT TODAY"
            count="42"
            valueClassName="text-[#c3161c]"
            iconBgClassName="absolute right-4 top-3 text-[#c3161c]"
            detail={
              <>
                <span>Confirmed absences: 38 </span>
                <span className="ml-2 rounded-full bg-[#fde3e5] px-2 py-0.5 text-[11px] font-bold text-[#c3161c]">
                  -0.8%
                </span>
              </>
            }
          />
          <AttendanceCard
            icon={<ClockIcon size={40} className="opacity-10" />}
            label="LATE TODAY"
            count="18"
            valueClassName="text-[#f59e0b]"
            iconBgClassName="absolute right-4 top-3 text-[#f59e0b]"
            detail={
              <>
                <span>Avg delay: 12 minutes </span>
                <span className="ml-2 rounded-full bg-[#fff0cf] px-2 py-0.5 text-[11px] font-bold text-[#f59e0b]">
                  +12%
                </span>
              </>
            }
          />
          <AttendanceCard
            icon={<MoreIcon size={40} className="opacity-10" />}
            label="NOT YET MARKED"
            count="04"
            valueClassName="text-[#777b84]"
            iconBgClassName="absolute right-4 top-3 text-[#777b84]"
            detail={
              <>
                <span>Across 2 subject teachers </span>
                <span className="ml-2 rounded-full bg-[#e4e5e7] px-2 py-0.5 text-[11px] font-bold text-[#555962]">
                  Pending
                </span>
              </>
            }
          />
        </div>

        <WeeklyTrendChart />
      </main>
    </div>
  )
}
