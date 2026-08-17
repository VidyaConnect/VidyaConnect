import { useCallback, useEffect, useState } from 'react'
import type { AbsenceFollowUp, AttendanceSummary, ClassInfo, StudentAttendance } from './types'
import { attendanceService } from '@/services/attendanceService'
const emptySummary: AttendanceSummary = { presentToday: 0, absentToday: 0, lateToday: 0, notMarkedToday: 0, totalEnrollment: 0, percentage: 0 }
export const useAttendance = () => {
  const [students, setStudents] = useState<StudentAttendance[]>([])
  const [selectedClass, setSelectedClass] = useState<ClassInfo>({ id: 'class-8a', name: 'Grade 8A', grade: '8', section: 'A', totalStudents: 0 })
  const [summary, setSummary] = useState<AttendanceSummary>(emptySummary); const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null)
  const refreshRoster = useCallback(async (classId?: string) => { setLoading(true); setError(null); try { const [roster, next] = await Promise.all([attendanceService.getStudentsByClass(classId), attendanceService.getDailySummary(classId)]); setStudents(roster); setSummary(next); setSelectedClass((current) => ({ ...current, id: classId || current.id, totalStudents: next.totalEnrollment })) } catch (cause) { setError(cause instanceof Error ? cause.message : 'Failed to load attendance') } finally { setLoading(false) } }, [])
  useEffect(() => { void refreshRoster(selectedClass.id) }, [refreshRoster, selectedClass.id])
  const updateAttendanceStatus = useCallback(async (studentId: string, date: string, status: 'P' | 'A' | 'L' | 'E') => { await attendanceService.updateAttendance(studentId, date, status); setStudents((current) => current.map((student) => student.student.id === studentId ? { ...student, records: student.records.map((record) => record.date === date ? { ...record, status } : record) } : student)) }, [])
  const markAllPresent = useCallback(async () => { await attendanceService.markAllPresent(selectedClass.id); await refreshRoster(selectedClass.id) }, [refreshRoster, selectedClass.id])
  const saveAttendance = useCallback(async () => { const date = new Date().toISOString().slice(0, 10); const records = students.map((student) => ({ studentId: student.student.id, status: student.records.find((record) => record.date === date)?.status || 'P' })); await attendanceService.saveAttendance(selectedClass.id, date, records); await refreshRoster(selectedClass.id) }, [refreshRoster, selectedClass.id, students])
  return { students, selectedClass, setSelectedClass, summary, loading, error, refreshRoster, updateAttendanceStatus, markAllPresent, saveAttendance, getSummary: () => summary }
}
export const useAbsenceFollowUp = () => {
  const [followUps, setFollowUps] = useState<AbsenceFollowUp[]>([])
  const refreshFollowUps = useCallback(async () => { const rows = await attendanceService.getAbsences(); setFollowUps(rows.map((row) => ({ ...row, date: new Date().toISOString().slice(0, 10), reasonProvided: row.reason === 'Informed', action: row.reason === 'Informed' ? 'informed' : 'pending' }))) }, [])
  useEffect(() => { void refreshFollowUps() }, [refreshFollowUps])
  return { followUps, refreshFollowUps, updateFollowUp: async () => { throw new Error('Parents provide absence reasons in the mobile app.') } }
}
