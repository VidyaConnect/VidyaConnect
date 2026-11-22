export type DateRange = '7d' | '30d' | '90d'

export interface ReportFilters {
  range: DateRange
  classId: string // 'all' or a class name such as '8A'
}

/* ---------- Super Admin ---------- */

export interface SuperAdminReport {
  kpis: {
    totalSchools: number
    newSchoolsThisMonth: number
    activeSchools: number
    totalUsers: number
    pushDeliveryRate: number
  }
  usersByRole: { role: string; count: number }[]
  newSchoolsByMonth: { month: string; count: number }[]
  deliveryRate: { day: string; rate: number }[]
  securityEvents: {
    day: string
    failedLogins: number
    forbidden: number
    exports: number
  }[]
  schoolAdoption: {
    school: string
    created: number
    activated: number
    logins: number
  }[]
}

/* ---------- School Admin ---------- */

export interface SchoolAdminReport {
  classes: { id: string; name: string }[] // used to fill the class dropdown
  kpis: {
    todayAttendance: number | null // null = no attendance marked yet
    attendanceChange: number | null // vs same day last week, in percentage points
    avgAnnouncementRead: number
    consentResponseRate: number
    openForms: number
    neverLoggedIn: number
    totalAccounts: number
  }
  attendanceTrend: { date: string; rate: number }[]
  classComparison: { className: string; rate: number }[]
  heatmap: { date: string; rate: number }[] // date = YYYY-MM-DD
  announcementReach: { title: string; read: number; confirmed: number }[]
  consentResponses: {
    form: string
    submitted: number
    pending: number
    overdue: number
  }[]
  studentsBelow80: { name: string; className: string; rate: number }[]
  neverLoggedIn: { name: string; role: string; className: string }[]
}
