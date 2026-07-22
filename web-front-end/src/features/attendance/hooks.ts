import { useState, useCallback } from 'react'
import type { StudentAttendance, AttendanceRecord, AbsenceFollowUp, ClassInfo } from './types'

// Mock data for demo
const mockStudents: StudentAttendance[] = [
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
  {
    student: {
      id: '2',
      name: 'Elena Rodriguez',
      rollNo: '#BA002',
      gender: 'Female',
      age: 13,
    },
    records: [
      { date: '2024-10-18', status: 'A' },
      { date: '2024-10-19', status: 'P' },
      { date: '2024-10-21', status: 'P' },
      { date: '2024-10-22', status: 'L' },
      { date: '2024-10-23', status: 'P' },
      { date: '2024-10-24', status: 'P' },
      { date: '2024-10-25', status: 'A' },
    ],
    presentCount: 20,
    absentCount: 2,
    lateCount: 1,
    exemptedCount: 0,
  },
  {
    student: {
      id: '3',
      name: 'Marcus Chen',
      rollNo: '#BA003',
      gender: 'Male',
      age: 14,
    },
    records: [
      { date: '2024-10-18', status: 'P' },
      { date: '2024-10-19', status: 'L' },
      { date: '2024-10-21', status: 'P' },
      { date: '2024-10-22', status: 'P' },
      { date: '2024-10-23', status: 'L' },
      { date: '2024-10-24', status: 'P' },
      { date: '2024-10-25', status: 'P' },
    ],
    presentCount: 22,
    absentCount: 0,
    lateCount: 2,
    exemptedCount: 0,
  },
]

// Custom hook for managing attendance state
export const useAttendance = () => {
  const [students, setStudents] = useState<StudentAttendance[]>(mockStudents)
  const [selectedClass, setSelectedClass] = useState<ClassInfo>({
    id: '1',
    name: 'Grade 8A',
    grade: '8',
    section: 'A',
    totalStudents: 34,
  })

  const updateAttendanceStatus = useCallback(
    (studentId: string, date: string, status: 'P' | 'A' | 'L' | 'E') => {
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
      totalEnrollment: selectedClass.totalStudents,
      percentage: Math.round(
        ((presentCount + lateCount) / selectedClass.totalStudents) * 100
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
  const [followUps, setFollowUps] = useState<AbsenceFollowUp[]>([
    {
      studentId: '2',
      studentName: 'Elena Rodriguez',
      date: '2024-10-24',
      parentContact: '+1 (555) 0123-456',
      email: 'm.rodriguez@email.com',
      reason: undefined,
      reasonProvided: false,
      action: 'pending',
    },
  ])

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
