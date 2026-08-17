'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
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

interface AttendanceHistoryItem {
  date: string
  status: string
  reason?: string | null
  fileId?: string | null
  fileName?: string | null
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const normalizeStatus = (status?: string) => String(status ?? '').toUpperCase()

const getQuarterRate = (history: AttendanceHistoryItem[], quarterIndex: number, year: number) => {
  const quarterStartMonth = quarterIndex * 3
  const rangeEntries = history.filter((entry) => {
    const date = new Date(`${entry.date}T00:00:00`)
    return date.getFullYear() === year && date.getMonth() >= quarterStartMonth && date.getMonth() < quarterStartMonth + 3
  })

  if (rangeEntries.length === 0) {
    return 0
  }

  const attendedCount = rangeEntries.filter((entry) => {
    const status = normalizeStatus(entry.status)
    return status === 'PRESENT' || status === 'LATE' || status === 'EXEMPTED'
  }).length

  return Math.round((attendedCount / rangeEntries.length) * 100)
}

const getStudentStatusLabel = (rate: number) => {
  if (rate >= 95) return 'Consistently Excellent'
  if (rate >= 90) return 'Good Standing'
  if (rate >= 80) return 'Needs Attention'
  return 'At Risk'
}

export default function StudentAttendanceDetail() {
  const params = useParams()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [student, setStudent] = useState<StudentDetailData>({
    name: 'Student',
    presentCount: 0,
    absentCount: 0,
    rate: '0%',
    status: 'Waiting for data',
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    absentDates: [],
  })

  const studentId = (params?.studentId as string) || 'student-001'

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch(`http://localhost:3003/attendance/history/${studentId}`)
        if (!response.ok) {
          throw new Error(`History request failed: ${response.status}`)
        }

        const history: AttendanceHistoryItem[] = await response.json()
        const year = new Date().getFullYear()
        const statusMap = new Map<string, string>()

        history.forEach((entry) => {
          const normalized = normalizeStatus(entry.status)
          if (!entry.date) return
          statusMap.set(entry.date, normalized)
        })

        const absentDates = history
          .filter((entry) => normalizeStatus(entry.status) === 'ABSENT')
          .map((entry) => entry.date)

        const presentCount = history.filter((entry) => {
          const status = normalizeStatus(entry.status)
          return status === 'PRESENT' || status === 'LATE' || status === 'EXEMPTED'
        }).length

        const absentCount = absentDates.length
        const allMarkedCount = Math.max(history.length, 1)
        const rateValue = Math.round(((presentCount / allMarkedCount) * 100) || 0)

        const q1 = getQuarterRate(history, 0, year)
        const q2 = getQuarterRate(history, 1, year)
        const q3 = getQuarterRate(history, 2, year)
        const q4 = getQuarterRate(history, 3, year)

        setStudent({
          name: `Student ${studentId}`,
          presentCount,
          absentCount,
          rate: `${rateValue}%`,
          status: getStudentStatusLabel(rateValue),
          q1,
          q2,
          q3,
          q4,
          absentDates,
        })
      } catch (error) {
        console.error('Failed to load student attendance history', error)
      }
    }

    loadHistory()
  }, [studentId])

  const handleNavigate = (page: string) => {
    if (page === 'attendance') {
      router.push('/attendance/teacher')
    } else {
      router.push(`/${page}`)
    }
  }

  const calendarMonths = useMemo(() => {
    const year = new Date().getFullYear()

    return MONTH_NAMES.map((monthName, monthIndex) => {
      const startDay = new Date(year, monthIndex, 1).getDay()
      const totalDays = new Date(year, monthIndex + 1, 0).getDate()
      const days: Array<{ dayNum: number | null; status: 'empty' | 'weekend' | 'absent' | 'holiday' | 'present' }> = []

      for (let i = 0; i < startDay; i += 1) {
        days.push({ dayNum: null, status: 'empty' })
      }

      for (let d = 1; d <= totalDays; d += 1) {
        const date = new Date(year, monthIndex, d)
        const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        const dayOfWeek = date.getDay()

        let status: 'weekend' | 'absent' | 'holiday' | 'present' = 'present'

        if (dayOfWeek === 0 || dayOfWeek === 6) {
          status = 'weekend'
        } else if (student.absentDates.includes(dateStr)) {
          status = 'absent'
        }

        days.push({ dayNum: d, status })
      }

      return { name: monthName, days }
    })
  }, [student.absentDates])

  return (
    <DashboardLayout
      userRole="teacher"
      currentPage="attendance"
      onNavigate={handleNavigate}
      searchValue={searchTerm}
      onSearch={setSearchTerm}
      searchPlaceholder="Search student..."
      searchClassName="max-w-[420px]"
    >
      <main className="flex-1 px-8 pb-20 pt-6">
        <button
          onClick={() => router.push('/attendance/teacher')}
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#003b78] hover:text-[#00569b] transition-colors"
        >
          <ArrowLeftIcon size={16} />
          Back to Attendance
        </button>

        <div className="mb-5 flex items-center justify-between border-b border-[#cfd4dd] pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#003b78] tracking-tight">{student.name}</h1>
            <p className="mt-0.5 text-sm text-[#6b7280] font-medium">{new Date().getFullYear()} Academic Year Attendance</p>
          </div>

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
              <span className="text-sm font-bold text-[#4a5568]">Weekend</span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-[#e2e8f0] pl-4">
              <span className="text-sm font-medium text-[#718096]">Overall Rate</span>
              <span className="text-lg font-black text-[#007c6d]">{student.rate}</span>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {calendarMonths.map((month) => (
            <div key={month.name} className="rounded-lg border border-[#cfd4dd] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-black text-[#003b78]">{month.name}</h3>
                <span className="text-xs text-[#a0aec0] font-bold">{new Date().getFullYear()}</span>
              </div>
              <div className="grid grid-cols-7 gap-y-2 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayHead, i) => (
                  <span key={i} className="text-sm font-extrabold uppercase text-[#718096]">
                    {dayHead}
                  </span>
                ))}

                {month.days.map((day, i) => {
                  if (day.status === 'empty' || day.dayNum === null) {
                    return <div key={i} className="h-8 w-8" />
                  }

                  let dayStyle = ''
                  if (day.status === 'weekend') {
                    dayStyle = 'bg-[#f1f2f4] text-[#8b91a0] font-medium'
                  } else if (day.status === 'absent') {
                    dayStyle = 'bg-[#fde9e8] text-[#c3161c] font-black'
                  } else {
                    dayStyle = 'bg-[#e2f1ee] text-[#007c6d] font-bold'
                  }

                  return (
                    <div key={i} className="flex justify-center">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-all ${dayStyle}`}>
                        {day.dayNum}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col justify-between rounded-lg bg-[#073b78] p-4 text-white shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
              <CalendarCardIcon size={20} className="text-white" />
            </div>
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">Attendance Status</p>
              <h4 className="mt-1 text-xl font-extrabold">{student.status}</h4>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-[#cfd4dd] bg-white p-4 shadow-sm">
            <div className="h-14 w-20 overflow-hidden rounded-md border border-[#e2e8f0]">
              <img src="/assets/images/school_prep.png" alt="School Building" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#718096]">Academic Institution</p>
              <h4 className="mt-1 text-base font-black text-[#2d3748]">VidyaConnect Preparatory</h4>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-[#cfd4dd] bg-white p-4 shadow-sm">
            <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-[#e2e8f0]">
              <img src="/assets/images/teacher_marcus.png" alt="Teacher" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#718096]">Homeroom Teacher</p>
              <h4 className="mt-1 text-base font-black text-[#2d3748]">Mr. Marcus Silva</h4>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#cfd4dd] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-[#cfd4dd] pb-3">
            <h3 className="text-lg font-extrabold text-[#003b78]">Quarterly Performance Analysis</h3>
            <span className="text-[#003b78]"><ChartIcon size={20} /></span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[{ label: 'Q1 (Jan-Mar)', value: student.q1 }, { label: 'Q2 (Apr-Jun)', value: student.q2 }, { label: 'Q3 (Jul-Sep)', value: student.q3 }, { label: 'Q4 (Oct-Dec)', value: student.q4 }].map((quarter) => (
              <div key={quarter.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm font-bold text-[#4a5568]">
                  <span>{quarter.label}</span>
                  <span className="text-base font-extrabold text-[#007c6d]">{quarter.value}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#edf2f7]">
                  <div className="h-full rounded-full bg-[#007c6d] transition-all duration-500" style={{ width: `${quarter.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-[#a0aec0] font-medium">
          System generated report. Confidential Academic Record. © {new Date().getFullYear()} VidyaConnect.
        </p>
      </main>
    </DashboardLayout>
  )
}
