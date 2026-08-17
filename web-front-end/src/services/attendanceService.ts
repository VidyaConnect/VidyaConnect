import type { StudentAttendance, AttendanceSummary } from '@/features/attendance/types'

const API_BASE = process.env.NEXT_PUBLIC_ATTENDANCE_API_URL || 'http://localhost:3003'
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, cache: 'no-store' })
  if (!res.ok) throw new Error(`Attendance request failed (${res.status})`)
  return res.json() as Promise<T>
}
const backendStatus: Record<'P' | 'A' | 'L' | 'E', string> = { P: 'PRESENT', A: 'ABSENT', L: 'LATE', E: 'EXEMPTED' }
const shortStatus: Record<string, 'P' | 'A' | 'L' | 'E' | 'N'> = { PRESENT: 'P', ABSENT: 'A', LATE: 'L', EXEMPTED: 'E', NOT_MARKED: 'N' }
type RosterRecord = { studentId: string; studentName: string; rollNumber: string; status: string }
type SummaryResponse = { present: number; absent: number; late: number; notMarked: number }
function mapRoster(records: RosterRecord[]): StudentAttendance[] {
  const date = new Date().toISOString().slice(0, 10)
  return records.map((record) => {
    const status = shortStatus[record.status] || 'N'
    return { student: { id: record.studentId, name: record.studentName, rollNo: record.rollNumber }, records: [{ date, status: status === 'N' ? 'P' : status }], presentCount: status === 'P' ? 1 : 0, absentCount: status === 'A' ? 1 : 0, lateCount: status === 'L' ? 1 : 0, exemptedCount: status === 'E' ? 1 : 0 }
  })
}
export const attendanceService = {
  async getStudentsByClass(classId?: string): Promise<StudentAttendance[]> { const suffix = classId ? `?classId=${encodeURIComponent(classId)}` : ''; return mapRoster(await request<RosterRecord[]>(`/attendance/roster${suffix}`)) },
  async updateAttendance(studentId: string, _date: string, status: 'P' | 'A' | 'L' | 'E') { await request(`/attendance/roster/${encodeURIComponent(studentId)}`, { method: 'POST', body: JSON.stringify({ status: backendStatus[status] }) }) },
  async getDailySummary(classId?: string): Promise<AttendanceSummary> { const suffix = classId ? `?classId=${encodeURIComponent(classId)}` : ''; const data = await request<SummaryResponse>(`/attendance/summary${suffix}`); const total = data.present + data.absent + data.late + data.notMarked; return { presentToday: data.present, absentToday: data.absent, lateToday: data.late, notMarkedToday: data.notMarked, totalEnrollment: total, percentage: total ? Math.round(((data.present + data.late) / total) * 100) : 0 } },
  async markAllPresent(classId?: string) { const students = await this.getStudentsByClass(classId); await Promise.all(students.map((student) => this.updateAttendance(student.student.id, '', 'P'))) },
  async saveAttendance(_classId: string | undefined, date: string, records: Array<{ studentId: string; status: 'P' | 'A' | 'L' | 'E' }>) { await Promise.all(records.map((record) => this.updateAttendance(record.studentId, date, record.status))) },
  getAdminOverview: () => request<{ present: number; absent: number; late: number; notMarked: number; classes: Array<{ id: string; className: string; teacherName: string; status: string; progress: number; students: unknown[] }> }>('/attendance/admin/overview'),
  getAbsences: () => request<any[]>('/attendance/absences'),
  async updateAbsenceReason() { throw new Error('Absence reasons are submitted by the parent mobile application.') },
}
