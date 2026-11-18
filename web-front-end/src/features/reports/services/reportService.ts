import type {
  ReportFilters,
  SchoolAdminReport,
  SuperAdminReport,
} from '../types/report.types'

/*
 * MOCK SERVICE
 * ------------
 * Every page talks to the functions in this file only.
 * When the backend report endpoints are ready, replace the body of each
 * function with a real call (e.g. apiClient.get('/reports/...')) and keep
 * the same return type. No page or component needs to change.
 */

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getSuperAdminReport(
  filters: ReportFilters
): Promise<SuperAdminReport> {
  void filters // not used by the mock data yet
  await delay()
  return {
    kpis: {
      totalSchools: 1204,
      newSchoolsThisMonth: 18,
      activeSchools: 1131,
      totalUsers: 412880,
      pushDeliveryRate: 96.4,
    },
    usersByRole: [
      { role: 'Parents', count: 230000 },
      { role: 'Students', count: 150000 },
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

export async function getSchoolAdminReport(
  filters: ReportFilters
): Promise<SchoolAdminReport> {
  void filters // not used by the mock data yet
  await delay()
  return {
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
