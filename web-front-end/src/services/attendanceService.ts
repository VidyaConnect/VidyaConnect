import type { StudentAttendance, AttendanceSummary } from '@/features/attendance/types'

const API_BASE = process.env.NEXT_PUBLIC_ATTENDANCE_API_URL || 'http://localhost:3003'
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN || ''

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (AUTH_TOKEN) {
    headers['Authorization'] = `Bearer ${AUTH_TOKEN}`
  }
  return headers
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Request failed [${res.status}]: ${errText || res.statusText}`)
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return (await res.json()) as T
  }
  return {} as T
}

const STATUS_TO_SHORT: Record<string, 'P' | 'A' | 'L' | 'E' | 'N'> = {
  present: 'P',
  absent: 'A',
  late: 'L',
  exempted: 'E',
  notMarked: 'N',
  PRESENT: 'P',
  ABSENT: 'A',
  LATE: 'L',
  EXEMPTED: 'E',
  NOT_MARKED: 'N',
}

const SHORT_TO_BACKEND: Record<'P' | 'A' | 'L' | 'E', string> = {
  P: 'PRESENT',
  A: 'ABSENT',
  L: 'LATE',
  E: 'EXEMPTED',
}

interface RosterStudentResponse {
  id: string
  name: string
  rollNumber: string
  status: string
  absenceReason: string | null
  fileId: string | null
  fileName: string | null
}

interface SummaryResponse {
  className: string
  date: string
  present: number
  absent: number
  late: number
  notMarked: number
  progress: number
}

interface AdminClassSummary {
  id: string
  className: string
  teacherName: string
  status: string
  progress: number
  students: RosterStudentResponse[]
}

interface AdminOverviewResponse {
  present: number
  absent: number
  late: number
  notMarked: number
  classes: AdminClassSummary[]
}

interface AbsenceApiResponse {
  studentId: string
  studentName: string
  parentContact: string
  email: string
  phone: string
  reason: string
  reasonDetails: string | null
}

export const attendanceService = {
  getStudentsByClass: async (classId?: string): Promise<StudentAttendance[]> => {
    const params = classId ? `?classId=${encodeURIComponent(classId)}` : ''
    const roster = await request<RosterStudentResponse[]>(`/attendance/roster${params}`)

    const today = new Date().toISOString().split('T')[0]

    return roster.map((s) => {
      const shortStatus = STATUS_TO_SHORT[s.status] || 'N'

      return {
        student: {
          id: s.id,
          name: s.name,
          rollNo: `#${s.rollNumber}`,
        },
        records: [
          {
            date: today,
            status: shortStatus === 'N' ? 'P' : (shortStatus as 'P' | 'A' | 'L' | 'E'),
          },
        ],
        presentCount: s.status === 'present' || s.status === 'PRESENT' ? 1 : 0,
        absentCount: s.status === 'absent' || s.status === 'ABSENT' ? 1 : 0,
        lateCount: s.status === 'late' || s.status === 'LATE' ? 1 : 0,
        exemptedCount: s.status === 'exempted' || s.status === 'EXEMPTED' ? 1 : 0,
      }
    })
  },

  updateAttendance: async (
    studentId: string,
    _date: string,
    status: 'P' | 'A' | 'L' | 'E'
  ): Promise<boolean> => {
    const body = { status: SHORT_TO_BACKEND[status] }
    await request<{ success: boolean; data: unknown }>(`/attendance/roster/${encodeURIComponent(studentId)}`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return true
  },

  getDailySummary: async (classId?: string): Promise<AttendanceSummary> => {
    const params = classId ? `?classId=${encodeURIComponent(classId)}` : ''
    const data = await request<SummaryResponse>(`/attendance/summary${params}`)

    const total = data.present + data.absent + data.late + data.notMarked

    return {
      presentToday: data.present,
      absentToday: data.absent,
      lateToday: data.late,
      notMarkedToday: data.notMarked,
      totalEnrollment: total,
      percentage: total === 0 ? 0 : Math.round(((data.present + data.late) / total) * 100),
    }
  },

  markAllPresent: async (classId?: string): Promise<boolean> => {
    const students = await attendanceService.getStudentsByClass(classId)
    const today = new Date().toISOString().split('T')[0]

    await Promise.all(
      students.map((s) => attendanceService.updateAttendance(s.student.id, today, 'P'))
    )
    return true
  },

  saveAttendance: async (
    classId: string | undefined,
    _date: string,
    records: Array<{ studentId: string; status: 'P' | 'A' | 'L' | 'E' }>
  ): Promise<boolean> => {
    await Promise.all(
      records.map((r) => attendanceService.updateAttendance(r.studentId, _date, r.status))
    )
    void classId
    return true
  },

  getAdminOverview: async (): Promise<AdminOverviewResponse> => {
    return request<AdminOverviewResponse>('/attendance/admin/overview')
  },

  getAbsences: async (): Promise<AbsenceApiResponse[]> => {
    return request<AbsenceApiResponse[]>('/attendance/absences')
  },

  updateAbsenceReason: async (
    studentId: string,
    status: 'Informed' | 'Uninformed',
    reason?: string
  ): Promise<boolean> => {
    await request<{ success: boolean }>('/attendance/absence-reason', {
      method: 'POST',
      body: JSON.stringify({ studentId, status, reason }),
    })
    return true
  },
}

