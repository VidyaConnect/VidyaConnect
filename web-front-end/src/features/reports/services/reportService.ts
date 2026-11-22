import type {
  ReportFilters,
  SchoolAdminReport,
  SuperAdminReport,
} from '../types/report.types'
import { fetchWithAuth } from '@/services/fetchWithAuth'

/*
 * REPORT SERVICE
 * --------------
 * Pages only talk to the two exported functions at the bottom of this file.
 *
 * REAL data (from report-service):
 *   Super admin  -> schools, users by role, new schools per month
 *   School admin -> attendance KPI, trend, heatmap, class comparison, students below 80%
 * SAMPLE data (no backend source exists yet): everything else.
 *
 * To run the pages without the backend, set NEXT_PUBLIC_REPORTS_USE_MOCK=true
 * in web-front-end/.env.local and restart "npm run dev".
 */

const REPORT_API =
  process.env.NEXT_PUBLIC_REPORT_API_URL || 'http://localhost:3008'
const USE_MOCK = process.env.NEXT_PUBLIC_REPORTS_USE_MOCK === 'true'

async function request<T>(path: string): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetchWithAuth(`${REPORT_API}${path}`, {
    headers,
    cache: 'no-store',
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Could not load report [${res.status}]: ${errText || res.statusText}`)
  }
  return (await res.json()) as T
}

interface SystemSummaryResponse {
  totalSchools: number
  activeSchools: number
  newSchoolsThisMonth: number
  totalUsers: number
  usersByRole: { role: string; count: number }[]
  newSchoolsByMonth: { month: string; count: number }[]
}

interface SchoolAttendanceResponse {
  classes: { id: string; name: string }[]
  todayAttendance: number | null
  attendanceChange: number | null
  daily: { date: string; rate: number }[]
  classComparison: { classId: string; className: string; rate: number }[]
  studentsBelow80: { studentId: string; name: string; className: string; rate: number }[]
}

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

async function mockSuperAdminReport(): Promise<SuperAdminReport> {
  await delay()
  return {
    kpis: {
      totalSchools: 1204,
      newSchoolsThisMonth: 18,
      activeSchools: 1131,
      totalUsers: 262880,
      pushDeliveryRate: 96.4,
    },
    usersByRole: [
      { role: 'Parents', count: 230000 },
      { role: 'Teachers', count: 25000 },
      { role: 'School admins', count: 7880 },
    ],
    newSchoolsByMonth: [
      { month: 'Jun', count: 35 },
      { month: 'Jul', count: 44 },
      { month: 'Aug', count: 38 },
      { month: 'Sep', count: 41 },
      { month: 'Oct', count: 36 },
      { month: 'Nov', count: 18 },
    ],
    deliveryRate: [97, 96, 95, 96, 94, 96, 97, 98, 96, 95, 96, 97, 96, 96].map(
      (rate, i) => ({ day: `D${i + 1}`, rate })
    ),
    securityEvents: [
      { day: 'Mon', failedLogins: 42, forbidden: 3, exports: 12 },
      { day: 'Tue', failedLogins: 38, forbidden: 1, exports: 9 },
      { day: 'Wed', failedLogins: 55, forbidden: 4, exports: 15 },
      { day: 'Thu', failedLogins: 47, forbidden: 2, exports: 11 },
      { day: 'Fri', failedLogins: 60, forbidden: 6, exports: 14 },
      { day: 'Sat', failedLogins: 21, forbidden: 0, exports: 2 },
      { day: 'Sun', failedLogins: 18, forbidden: 1, exports: 1 },
    ],
    schoolAdoption: [
      { school: 'Royal College', created: 1900, activated: 1710, logins: 9800 },
      { school: 'Visakha Vidyalaya', created: 1650, activated: 1320, logins: 7400 },
      { school: "St. Thomas'", created: 1200, activated: 770, logins: 3900 },
    ],
  }
}

/** Builds school days (Mon-Fri) between two dates with a repeatable fake rate. */
function buildHeatmap(): { date: string; rate: number }[] {
  const rows: { date: string; rate: number }[] = []
  const day = new Date(Date.UTC(2026, 8, 14)) // 14 Sep 2026
  const end = Date.UTC(2026, 10, 12) // 12 Nov 2026
  let i = 0
  while (day.getTime() <= end) {
    const weekday = day.getUTCDay()
    if (weekday !== 0 && weekday !== 6) {
      rows.push({
        date: day.toISOString().slice(0, 10),
        rate: 76 + ((i * 7) % 22), // always between 76 and 97
      })
      i++
    }
    day.setUTCDate(day.getUTCDate() + 1)
  }
  return rows
}

async function mockSchoolAdminReport(): Promise<SchoolAdminReport> {
  await delay()
  return {
    classes: ['6A', '6B', '7A', '7B', '8A', '8B'].map((c) => ({ id: c, name: c })),
    kpis: {
      todayAttendance: 92.4,
      attendanceChange: 1.2,
      avgAnnouncementRead: 78,
      consentResponseRate: 81,
      openForms: 3,
      neverLoggedIn: 146,
      totalAccounts: 2400,
    },
    attendanceTrend: [
      93, 92, 94, 91, 90, 93, 95, 92, 89, 84, 91, 93, 94, 92, 93, 95, 92, 91,
      93, 92,
    ].map((rate, i) => ({ date: `D${i + 1}`, rate })),
    classComparison: [
      { className: '6A', rate: 95 },
      { className: '6B', rate: 91 },
      { className: '7A', rate: 88 },
      { className: '7B', rate: 93 },
      { className: '8A', rate: 79 },
      { className: '8B', rate: 90 },
    ],
    heatmap: buildHeatmap(),
    announcementReach: [
      { title: 'Timetable', read: 90, confirmed: 76 },
      { title: 'Sports', read: 84, confirmed: 60 },
      { title: 'Fee', read: 72, confirmed: 55 },
      { title: 'Holiday', read: 66, confirmed: 40 },
    ],
    consentResponses: [
      { form: 'Field trip', submitted: 310, pending: 60, overdue: 15 },
      { form: 'Photo', submitted: 340, pending: 40, overdue: 5 },
      { form: 'Fee ack.', submitted: 250, pending: 90, overdue: 60 },
    ],
    studentsBelow80: [
      { name: 'K. Perera', className: '8A', rate: 71 },
      { name: 'N. Silva', className: '8A', rate: 76 },
      { name: 'A. Fernando', className: '7B', rate: 78 },
    ],
    neverLoggedIn: [
      { name: 'S. Jayasuriya', role: 'Parent', className: '6B' },
      { name: 'T. Wickrama', role: 'Parent', className: '7A' },
      { name: 'M. Rajapaksa', role: 'Teacher', className: '8B' },
    ],
  }
}

/* ---------------- exported functions used by the pages ---------------- */

export async function getSuperAdminReport(
  filters: ReportFilters
): Promise<SuperAdminReport> {
  void filters // the date range is not used by the system summary yet
  const mock = await mockSuperAdminReport()
  if (USE_MOCK) return mock

  const real = await request<SystemSummaryResponse>('/reports/super-admin/summary')
  return {
    ...mock,
    kpis: {
      ...mock.kpis, // pushDeliveryRate stays sample
      totalSchools: real.totalSchools,
      activeSchools: real.activeSchools,
      newSchoolsThisMonth: real.newSchoolsThisMonth,
      totalUsers: real.totalUsers,
    },
    usersByRole: real.usersByRole,
    newSchoolsByMonth: real.newSchoolsByMonth,
  }
}

export async function getSchoolAdminReport(
  filters: ReportFilters
): Promise<SchoolAdminReport> {
  const mock = await mockSchoolAdminReport()
  if (USE_MOCK) return mock

  const days = { '7d': 7, '30d': 30, '90d': 90 }[filters.range]
  const params = new URLSearchParams({ days: String(days) })
  if (filters.classId !== 'all') params.set('classId', filters.classId)
  const real = await request<SchoolAttendanceResponse>(
    `/reports/school-admin/attendance?${params}`
  )

  return {
    ...mock, // announcements, consent forms and account tables stay sample
    classes: real.classes,
    kpis: {
      ...mock.kpis,
      todayAttendance: real.todayAttendance,
      attendanceChange: real.attendanceChange,
    },
    attendanceTrend: real.daily.map((d) => ({ date: d.date.slice(5), rate: d.rate })),
    heatmap: real.daily,
    classComparison: real.classComparison.map((c) => ({
      className: c.className,
      rate: c.rate,
    })),
    studentsBelow80: real.studentsBelow80.map((s) => ({
      name: s.name,
      className: s.className,
      rate: s.rate,
    })),
  }
}
