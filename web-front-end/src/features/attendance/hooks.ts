import { useState, useCallback, useEffect } from 'react'
import type { StudentAttendance, AttendanceRecord, AbsenceFollowUp, ClassInfo, AttendanceSummary } from './types'
import { attendanceService } from '@/services/attendanceService'

export const useAttendance = () => {
  const [students, setStudents] = useState<StudentAttendance[]>([])
  const [selectedClass, setSelectedClass] = useState<ClassInfo>({
    id: '8A',
    name: 'Grade 8A',
    grade: '8',
    section: 'A',
    totalStudents: 0,
  })
  const [summary, setSummary] = useState<AttendanceSummary>({
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    notMarkedToday: 0,
    totalEnrollment: 0,
    percentage: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshRoster = useCallback(async (classId?: string) => {
    setLoading(true)
    setError(null)
    try {
      const [studentsData, summaryData] = await Promise.all([
        attendanceService.getStudentsByClass(classId),
        attendanceService.getDailySummary(classId),
      ])
      setStudents(studentsData)
      setSummary(summaryData)
      setSelectedClass((prev) => ({
        ...prev,
        id: classId || prev.id,
        totalStudents: summaryData.totalEnrollment,
      }))
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to load attendance data'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshRoster(selectedClass.id)
  }, [refreshRoster, selectedClass.id])

  const updateAttendanceStatus = useCallback(
    async (studentId: string, date: string, status: 'P' | 'A' | 'L' | 'E') => {
      try {
        await attendanceService.updateAttendance(studentId, date, status)
        setStudents((prev) =>
          prev.map((student) =>
            student.student.id === studentId
              ? {
                  ...student,
                  records: student.records.map((record) =>
                    record.date === date ? { ...record, status } : record
                  ),
                }
              : student
          )
        )
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to update attendance'
        setError(message)
        throw e
      }
    },
    []
  )

  const markAllPresent = useCallback(async () => {
    setLoading(true)
    try {
      await attendanceService.markAllPresent(selectedClass.id)
      await refreshRoster(selectedClass.id)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to mark all present'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [refreshRoster, selectedClass.id])

  const saveAttendance = useCallback(async () => {
    setLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const records = students
        .map((s) => {
          const todayRec = s.records.find((r) => r.date === today)
          if (!todayRec) return null
          return { studentId: s.student.id, status: todayRec.status as 'P' | 'A' | 'L' | 'E' }
        })
        .filter(Boolean) as Array<{ studentId: string; status: 'P' | 'A' | 'L' | 'E' }>

      await attendanceService.saveAttendance(selectedClass.id, today, records)
      await refreshRoster(selectedClass.id)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to save attendance'
      setError(message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [refreshRoster, selectedClass.id, students])

  const getSummary = useCallback(() => summary, [summary])

  return {
    students,
    selectedClass,
    setSelectedClass,
    updateAttendanceStatus,
    getSummary,
    refreshRoster,
    markAllPresent,
    saveAttendance,
    loading,
    error,
    summary,
  }
}

export const useAbsenceFollowUp = () => {
  const [followUps, setFollowUps] = useState<AbsenceFollowUp[]>([])

  const fetchAbsences = useCallback(async () => {
    try {
      const data = await attendanceService.getAbsences()
      // Map raw API data into AbsenceFollowUp shape
      const today = new Date().toISOString().split('T')[0]
      setFollowUps(
        data.map((d) => ({
          studentId: d.studentId,
          studentName: d.studentName,
          date: today,
          parentContact: d.phone || d.parentContact,
          email: d.email,
          reason: d.reason,
          reasonDetails: d.reasonDetails,
          reasonProvided: d.reason === 'Informed',
          action: d.reason === 'Informed' ? 'informed' : 'pending',
        }))
      )
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    void fetchAbsences()
  }, [fetchAbsences])

  const updateFollowUp = useCallback(async (studentId: string, action: string, reason?: string) => {
    const status = action === 'informed' ? 'Informed' : 'Uninformed'
    try {
      await attendanceService.updateAbsenceReason(studentId, status, reason)
    } catch (err) {
      console.error('Failed to save reason:', err)
    }
    setFollowUps((prev) =>
      prev.map((followUp) =>
        followUp.studentId === studentId
          ? {
              ...followUp,
              action: action as AbsenceFollowUp['action'],
              reason: status,
              reasonDetails: reason || followUp.reasonDetails,
              reasonProvided: status === 'Informed',
            }
          : followUp
      )
    )
  }, [])

  return { followUps, updateFollowUp, refreshFollowUps: fetchAbsences }
}

