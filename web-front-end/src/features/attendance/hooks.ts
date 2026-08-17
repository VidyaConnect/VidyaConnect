import { useState, useCallback, useEffect } from 'react'
import type { StudentAttendance, AbsenceFollowUp, ClassInfo } from './types'

const API_BASE_URL = 'http://localhost:3003'

const mapApiStatus = (status?: string): 'P' | 'A' | 'L' | 'E' => {
  switch (status) {
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

const normalizeRoster = (records: Array<{ id?: string; name?: string; studentName?: string; rollNumber?: string; rollNo?: string; studentId?: string; status?: string }> = []) => {
  const today = new Date().toISOString().slice(0, 10)

  return records.map((item) => ({
    student: {
      id: item.studentId ?? item.id ?? 'unknown',
      name: item.name ?? item.studentName ?? 'Student',
      rollNo: item.rollNumber ?? item.rollNo ?? '#000',
      gender: 'Student',
      age: undefined,
    },
    records: [{ date: today, status: mapApiStatus(item.status) }],
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    exemptedCount: 0,
  }))
}

// Custom hook for managing attendance state
export const useAttendance = () => {
  const [students, setStudents] = useState<StudentAttendance[]>([])
  const [selectedClass, setSelectedClass] = useState<ClassInfo>({
    id: 'class-8a',
    name: 'Grade 8A',
    grade: '8',
    section: 'A',
    totalStudents: 0,
  })

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/attendance/roster?classId=${selectedClass.id}`)

        if (!response.ok) {
          throw new Error(`Roster request failed: ${response.status}`)
        }

        const payload = await response.json()
        const roster = Array.isArray(payload) ? payload : payload.records ?? []
        setStudents(normalizeRoster(roster))
      } catch (error) {
        console.error('Failed to load attendance roster:', error)
        setStudents([])
      }
    }

    loadStudents()
  }, [selectedClass.id])

  const updateAttendanceStatus = useCallback(
    async (studentId: string, date: string, status: 'P' | 'A' | 'L' | 'E') => {
      try {
        const response = await fetch(`${API_BASE_URL}/attendance/roster/${studentId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })

        if (!response.ok) {
          throw new Error(`Attendance update failed: ${response.status}`)
        }

        const result = await response.json()
        const updatedStatus = mapApiStatus(result?.data?.status ?? status)

        setStudents((prev) =>
          prev.map((student) =>
            student.student.id === studentId
              ? {
                  ...student,
                  records: [{ ...student.records[0], date, status: updatedStatus }],
                }
              : student
          )
        )
      } catch (error) {
        console.error('Failed to update attendance:', error)
      }
    },
    []
  )

  const getSummary = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const presentCount = students.filter(
      (s) => s.records.find((r) => r.date === today)?.status === 'P'
    ).length
    const absentCount = students.filter(
      (s) => s.records.find((r) => r.date === today)?.status === 'A'
    ).length
    const lateCount = students.filter(
      (s) => s.records.find((r) => r.date === today)?.status === 'L'
    ).length
    const notMarkedCount = students.filter(
      (s) => !s.records.find((r) => r.date === today)
    ).length

    return {
      presentToday: presentCount,
      absentToday: absentCount,
      lateToday: lateCount,
      notMarkedToday: notMarkedCount,
      totalEnrollment: selectedClass.totalStudents || students.length,
      percentage: Math.round(
        ((presentCount + lateCount) / Math.max(selectedClass.totalStudents || students.length, 1)) * 100
      ),
    }
  }, [students, selectedClass])

  return {
    students,
    selectedClass,
    setSelectedClass,
    updateAttendanceStatus,
    getSummary,
  }
}

// Hook for absence follow-up
export const useAbsenceFollowUp = () => {
  const [followUps, setFollowUps] = useState<AbsenceFollowUp[]>([])

  const updateFollowUp = useCallback((studentId: string, action: string) => {
    setFollowUps((prev) =>
      prev.map((followUp) =>
        followUp.studentId === studentId
          ? { ...followUp, action: action as any }
          : followUp
      )
    )
  }, [])

  return { followUps, updateFollowUp }
}
