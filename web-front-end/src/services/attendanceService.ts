// API service for attendance-related requests
import type { StudentAttendance, AttendanceSummary } from '@/features/attendance/types'

// Mock API responses - in production, replace with actual API calls
export const attendanceService = {
  // Get all students for a specific class
  getStudentsByClass: async (classId: string): Promise<StudentAttendance[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    // Return mock data
    return [
      {
        student: {
          id: '1',
          name: 'Alex Rivera',
          rollNo: '#BA001',
          gender: 'Male',
          age: 14,
        },
        records: [
          { date: '2024-10-18', status: 'P' },
          { date: '2024-10-19', status: 'P' },
          { date: '2024-10-21', status: 'P' },
          { date: '2024-10-22', status: 'P' },
          { date: '2024-10-23', status: 'P' },
          { date: '2024-10-24', status: 'P' },
          { date: '2024-10-25', status: 'P' },
        ],
        presentCount: 24,
        absentCount: 0,
        lateCount: 0,
        exemptedCount: 0,
      },
    ]
  },

  // Update attendance record for a student
  updateAttendance: async (
    studentId: string,
    date: string,
    status: 'P' | 'A' | 'L' | 'E'
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return true
  },

  // Get daily summary
  getDailySummary: async (classId: string, date: string): Promise<AttendanceSummary> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      presentToday: 24,
      absentToday: 2,
      lateToday: 1,
      notMarkedToday: 0,
      totalEnrollment: 27,
      percentage: 94,
    }
  },

  // Mark all students as present (bulk operation)
  markAllPresent: async (classId: string, date: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return true
  },

  // Save attendance for the day
  saveAttendance: async (
    classId: string,
    date: string,
    records: Array<{ studentId: string; status: 'P' | 'A' | 'L' | 'E' }>
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return true
  },
}
