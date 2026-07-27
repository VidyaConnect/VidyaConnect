'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import Topbar from '@/components/Topbar'
import {
  CheckCircleIcon as LegendCheckIcon,
  XCircleIcon as LegendXIcon,
  ClockIcon as LegendHolidayIcon,
  ArrowLeftIcon,
  ChartIcon,
  CalendarDayIcon as CalendarCardIcon,
} from '@/components/Icons'

interface StudentDetailData {
  name: string
  presentCount: number
  absentCount: number
  rate: string
  status: string
  q1: number
  q2: number
  q3: number
  q4: number
  absentDates: string[]
}

const studentsData: Record<string, StudentDetailData> = {
  '1': {
    name: 'Alex Rivera',
    presentCount: 174,
    absentCount: 6,
    rate: '96.7%',
    status: 'Consistently Excellent',
    q1: 98,
    q2: 95,
    q3: 100,
    q4: 94,
    absentDates: ['2023-03-13', '2023-04-03', '2023-06-14', '2023-08-10', '2023-08-15', '2023-11-09']
  },
  '2': {
    name: 'Elena Rodriguez',
    presentCount: 168,
    absentCount: 12,
    rate: '93.3%',
    status: 'Good Standing',
    q1: 94,
    q2: 92,
    q3: 95,
    q4: 93,
    absentDates: ['2023-01-18', '2023-02-14', '2023-03-08', '2023-04-20', '2023-05-15', '2023-06-14', '2023-08-10', '2023-09-12', '2023-10-25', '2023-11-09', '2023-11-20', '2023-12-05']
  },
  '3': {
    name: 'Marcus Chen',
    presentCount: 177,
    absentCount: 3,
    rate: '98.3%',
    status: 'Outstanding',
    q1: 99,
    q2: 97,
    q3: 100,
    q4: 97,
    absentDates: ['2023-02-14', '2023-05-15', '2023-10-25']
  }
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Helper to determine if a date is a holiday in 2023
const isHoliday = (date: Date) => {
  const m = date.getMonth();
  const d = date.getDate();
  
  // Summer Break: June 19 - Aug 25
  if ((m === 5 && d >= 19) || m === 6 || (m === 7 && d <= 25)) return true;
  // Winter Break: Dec 18 - Dec 31, Jan 1 - Jan 8
  if ((m === 11 && d >= 18) || (m === 0 && d <= 8)) return true;
  // Spring Break: Apr 10 - Apr 14
  if (m === 3 && d >= 10 && d <= 14) return true;
  // Thanksgiving: Nov 22 - Nov 24
  if (m === 10 && d >= 22 && d <= 24) return true;
  // MLK Day (Jan 16)
  if (m === 0 && d === 16) return true;
  // Presidents Day & Friday before (Feb 17, Feb 20)
  if (m === 1 && (d === 17 || d === 20)) return true;
  // Memorial Day & Friday before (May 26, May 29)
  if (m === 4 && (d === 26 || d === 29)) return true;
  // Labor Day (Sep 4)
  if (m === 8 && d === 4) return true;
  // Columbus Day (Oct 9)
  if (m === 9 && d === 9) return true;
  // Veteran's Day (Nov 10)
  if (m === 10 && d === 10) return true;
  // Good Friday (April 7)
  if (m === 3 && d === 7) return true;
  
  return false;
}

export default function StudentAttendanceDetail() {
  const params = useParams()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  const studentId = (params?.studentId as string) || '1'
  const student = studentsData[studentId] || studentsData['1']

  const absentDatesSet = useMemo(() => new Set(student.absentDates), [student.absentDates])

  const handleNavigate = (page: string) => {
    if (page === 'attendance') {
      router.push('/attendance/teacher')
    } else {
      router.push(`/${page}`)
    }
  }

  // Generate calendar days for each month
  const calendarMonths = useMemo(() => {
    return MONTH_NAMES.map((monthName, monthIndex) => {
      const startDay = new Date(2023, monthIndex, 1).getDay()
      const totalDays = new Date(2023, monthIndex + 1, 0).getDate()
      
      const days = []
      
      // Add padding days
      for (let i = 0; i < startDay; i++) {
        days.push({ dayNum: null, status: 'empty' })
      }
      
      // Add actual days
      for (let d = 1; d <= totalDays; d++) {
        const date = new Date(2023, monthIndex, d)
        const dateStr = `2023-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        const dayOfWeek = date.getDay()
        
        let status: 'weekend' | 'absent' | 'holiday' | 'present' = 'present'
        
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          status = 'weekend'
        } else if (absentDatesSet.has(dateStr)) {
          status = 'absent'
        } else if (isHoliday(date)) {
          status = 'holiday'
        }
        
        days.push({ dayNum: d, status })
      }
      
      return {
        name: monthName,
        days
      }
    })
  }, [absentDatesSet])

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-sans text-[#25272c]">
      <Navbar userRole="teacher" currentPage="attendance" onNavigate={handleNavigate} />
      <Topbar
        userRole="teacher"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        searchPlaceholder="Search student..."
        searchClassName="max-w-[420px]"
      />

      <main className="ml-56 px-6 pb-20 pt-5">
        {/* Back Button */}
        <button
          onClick={() => router.push('/attendance/teacher')}
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#003b78] hover:text-[#00569b] transition-colors"
        >
          <ArrowLeftIcon size={16} />
          Back to Attendance
        </button>

        {/* Dashboard Header Banner */}
        <div className="mb-5 flex items-center justify-between border-b border-[#cfd4dd] pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#003b78] tracking-tight">{student.name}</h1>
            <p className="mt-0.5 text-sm text-[#6b7280] font-medium">2023 Academic Year Attendance</p>
          </div>

          {/* Legend Banner */}
          <div className="flex items-center gap-4 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2 shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-[#007c6d]"><LegendCheckIcon size={20} /></span>
              <span className="text-sm font-bold text-[#4a5568]">Present ({student.presentCount})</span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-[#e2e8f0] pl-4">
              <span className="text-[#c3161c]"><LegendXIcon size={20} /></span>
              <span className="text-sm font-bold text-[#4a5568]">Absent ({student.absentCount})</span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-[#e2e8f0] pl-4">
              <span className="text-[#a0aec0]"><LegendHolidayIcon size={20} /></span>
              <span className="text-sm font-bold text-[#4a5568]">Weekend/Holiday</span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-[#e2e8f0] pl-4">
              <span className="text-sm font-medium text-[#718096]">Overall Rate</span>
              <span className="text-lg font-black text-[#007c6d]">{student.rate}</span>
            </div>
          </div>
        </div>

        {/* Calendars Grid */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {calendarMonths.map((month) => (
            <div key={month.name} className="rounded-lg border border-[#cfd4dd] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-black text-[#003b78]">{month.name}</h3>
                <span className="text-xs text-[#a0aec0] font-bold">2023</span>
              </div>
              <div className="grid grid-cols-7 gap-y-2 text-center">
                {/* Weekday Headers */}
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayHead, i) => (
                  <span key={i} className="text-sm font-extrabold uppercase text-[#718096]">
                    {dayHead}
                  </span>
                ))}

                {/* Days cells */}
                {month.days.map((day, i) => {
                  if (day.status === 'empty' || day.dayNum === null) {
                    return <div key={i} className="h-8 w-8" />
                  }

                  let dayStyle = ''
                  if (day.status === 'weekend' || day.status === 'holiday') {
                    dayStyle = 'bg-[#f1f2f4] text-[#8b91a0] font-medium'
                  } else if (day.status === 'absent') {
                    dayStyle = 'bg-[#fde9e8] text-[#c3161c] font-black'
                  } else {
                    dayStyle = 'bg-[#e2f1ee] text-[#007c6d] font-bold'
                  }

                  return (
                    <div key={i} className="flex justify-center">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-all ${dayStyle}`}
                      >
                        {day.dayNum}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Card 1: Attendance Status */}
          <div className="flex flex-col justify-between rounded-lg bg-[#073b78] p-4 text-white shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
              <CalendarCardIcon size={20} className="text-white" />
            </div>
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">Attendance Status</p>
              <h4 className="mt-1 text-xl font-extrabold">{student.status}</h4>
            </div>
          </div>

          {/* Card 2: Academic Institution */}
          <div className="flex items-center gap-3 rounded-lg border border-[#cfd4dd] bg-white p-4 shadow-sm">
            <div className="h-14 w-20 overflow-hidden rounded-md border border-[#e2e8f0]">
              <img
                src="/assets/images/school_prep.png"
                alt="School Building"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#718096]">Academic Institution</p>
              <h4 className="mt-1 text-base font-black text-[#2d3748]">VidyaConnect Preparatory</h4>
            </div>
          </div>

          {/* Card 3: Homeroom Teacher */}
          <div className="flex items-center gap-3 rounded-lg border border-[#cfd4dd] bg-white p-4 shadow-sm">
            <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-[#e2e8f0]">
              <img
                src="/assets/images/teacher_marcus.png"
                alt="Marcus Silva"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#718096]">Homeroom Teacher</p>
              <h4 className="mt-1 text-base font-black text-[#2d3748]">Mr. Marcus Silva</h4>
            </div>
          </div>
        </div>

        {/* Quarterly Performance Analysis */}
        <div className="rounded-lg border border-[#cfd4dd] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-[#cfd4dd] pb-3">
            <h3 className="text-lg font-extrabold text-[#003b78]">Quarterly Performance Analysis</h3>
            <span className="text-[#003b78]"><ChartIcon size={20} /></span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Q1 */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm font-bold text-[#4a5568]">
                <span>Q1 (Jan-Mar)</span>
                <span className="text-base font-extrabold text-[#007c6d]">{student.q1}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#edf2f7]">
                <div
                  className="h-full rounded-full bg-[#007c6d] transition-all duration-500"
                  style={{ width: `${student.q1}%` }}
                />
              </div>
            </div>

            {/* Q2 */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm font-bold text-[#4a5568]">
                <span>Q2 (Apr-Jun)</span>
                <span className="text-base font-extrabold text-[#007c6d]">{student.q2}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#edf2f7]">
                <div
                  className="h-full rounded-full bg-[#007c6d] transition-all duration-500"
                  style={{ width: `${student.q2}%` }}
                />
              </div>
            </div>

            {/* Q3 */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm font-bold text-[#4a5568]">
                <span>Q3 (Jul-Sep)</span>
                <span className="text-base font-extrabold text-[#007c6d]">{student.q3}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#edf2f7]">
                <div
                  className="h-full rounded-full bg-[#007c6d] transition-all duration-500"
                  style={{ width: `${student.q3}%` }}
                />
              </div>
            </div>

            {/* Q4 */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm font-bold text-[#4a5568]">
                <span>Q4 (Oct-Dec)</span>
                <span className="text-base font-extrabold text-[#007c6d]">{student.q4}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#edf2f7]">
                <div
                  className="h-full rounded-full bg-[#007c6d] transition-all duration-500"
                  style={{ width: `${student.q4}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-[#a0aec0] font-medium">
          System generated report. Confidential Academic Record. © 2023 VidyaConnect.
        </p>
      </main>
    </div>
  )
}
