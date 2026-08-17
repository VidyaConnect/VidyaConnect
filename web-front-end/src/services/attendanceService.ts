// API service for attendance-related requests
import type { StudentAttendance, AttendanceSummary } from '@/features/attendance/types'

const API_BASE_URL = 'http://localhost:3003'

const mapStatus = (value?: string): 'P' | 'A' | 'L' | 'E' => {
  switch (value) {
    case 'present':
    case 'PRESENT':
      return 'P'
    case 'absent':
    case 'ABSENT':
      return 'A'
    case 'late':
    case 'LATE':
      return 'L'
    case 'exempted':
    case 'EXEMPTED':
      return 'E'
    default:
      return 'A'
  }
}

export const attendanceService = {
  getStudentsByClass: async (classId: string): Promise<StudentAttendance[]> => {
    const response = await fetch(`${API_BASE_URL}/attendance/roster?classId=${classId}`)

    if (!response.ok) {
      throw new Error(`Failed to load roster: ${response.status}`)
    }

    const roster = await response.json()
    return (Array.isArray(roster) ? roster : roster.records ?? []).map((student: any) => ({
      student: {
        id: student.studentId ?? student.id ?? 'unknown',
        name: student.name ?? student.studentName ?? 'Student',
        rollNo: student.rollNumber ?? student.rollNo ?? '#0',
        gender: 'Student',
        age: undefined,
      },
      records: [{ date: new Date().toISOString().slice(0, 10), status: mapStatus(student.status) }],
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      exemptedCount: 0,
    }))
  },

  updateAttendance: async (
    studentId: string,
    date: string,
    status: 'P' | 'A' | 'L' | 'E'
  ): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/attendance/roster/${studentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    return response.ok
  },

  getDailySummary: async (classId: string, date: string): Promise<AttendanceSummary> => {
    const response = await fetch(`${API_BASE_URL}/attendance/summary?classId=${classId}`)

    if (!response.ok) {
      throw new Error(`Failed to load summary: ${response.status}`)
    }

    const payload = await response.json()
    return {
      presentToday: payload.present ?? 0,
      absentToday: payload.absent ?? 0,
      lateToday: payload.late ?? 0,
      notMarkedToday: payload.notMarked ?? 0,
      totalEnrollment: payload.totalEnrollment ?? 0,
      percentage: payload.progress ?? 0,
    }
  },

  markAllPresent: async (classId: string, date: string): Promise<boolean> => {
    return true
  },

  saveAttendance: async (
    classId: string,
    date: string,
    records: Array<{ studentId: string; status: 'P' | 'A' | 'L' | 'E' }>
  ): Promise<boolean> => {
    for (const record of records) {
      const response = await fetch(`${API_BASE_URL}/attendance/roster/${record.studentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: record.status }),
      })

      if (!response.ok) {
        return false
      }
    }

    return true
  },
}
