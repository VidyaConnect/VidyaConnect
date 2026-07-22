// Attendance data types
export interface Student {
  id: string
  name: string
  rollNo: string
  avatar?: string
  gender?: string
  age?: number
}

export interface AttendanceRecord {
  studentId: string
  status: 'P' | 'A' | 'L' | 'E' // Present, Absent, Late, Exempted
  date: string
  remarks?: string
}

export interface AttendanceDay {
  date: string
  status: AttendanceRecord['status']
}

export interface StudentAttendance {
  student: Student
  records: AttendanceDay[]
  presentCount: number
  absentCount: number
  lateCount: number
  exemptedCount: number
}

export interface ClassInfo {
  id: string
  name: string
  grade: string
  section?: string
  totalStudents: number
}

export interface AbsenceFollowUp {
  studentId: string
  studentName: string
  date: string
  parentContact: string
  email?: string
  reason?: string
  reasonProvided: boolean
  action?: 'notify' | 'pending' | 'resolved'
}

export interface AttendanceSummary {
  presentToday: number
  absentToday: number
  lateToday: number
  notMarkedToday: number
  totalEnrollment: number
  percentage: number
}

export interface WeeklyTrendData {
  day: string
  present: number
  absent: number
}
