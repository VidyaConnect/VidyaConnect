'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CURRENT_ACADEMIC_YEAR,
  addTeaching,
  createClass,
  createClasses,
  deleteClass,
  deleteTeacher,
  listClasses,
  listTeachers,
  removeTeaching,
  setClassTeacher,
  type SchoolClass,
  type Teacher,
} from '../services/teacherManagementService';

export function useTeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [t, c] = await Promise.all([listTeachers(), listClasses(CURRENT_ACADEMIC_YEAR)]);
    setTeachers(t);
    setClasses(c);
  }, []);

  useEffect(() => {
    refresh()
      .catch(() => setError('Could not load teachers. Please try again.'))
      .finally(() => setLoading(false));
  }, [refresh]);

  /** Runs one change, then reloads. Resolves true on success; on failure the message is in `error`. */
  const ok = async (action: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      await refresh();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      return false;
    } finally {
      setBusy(false);
    }
  };

  const stats = useMemo(() => ({
    teachers: teachers.length,
    classTeachers: teachers.filter((t) => t.classTeacherOf).length,
    withoutClass: teachers.filter((t) => !t.classTeacherOf).length,
    classesWithoutTeacher: classes.filter((c) => !c.classTeacherId).length,
  }), [teachers, classes]);

  return {
    teachers, classes, stats, loading, busy, error,
    clearError: () => setError(null),
    /** teacherId = null removes the class teacher. */
    setClassTeacher: (classId: string, teacherId: string | null) => ok(() => setClassTeacher(classId, teacherId)),
    addTeaching: (teacherId: string, classId: string, subject: string) => ok(() => addTeaching(teacherId, classId, subject)),
    removeTeaching: (assignmentId: string) => ok(() => removeTeaching(assignmentId)),
    deleteTeacher: (teacherId: string) => ok(() => deleteTeacher(teacherId)),
    createClass: (gradeLevel: number, section: string) => ok(() => createClass(gradeLevel, section)),
    createClasses: (plan: { gradeLevel: number; count: number }[]) => ok(() => createClasses(plan)),
    deleteClass: (classId: string) => ok(() => deleteClass(classId)),
  };
}

export type TeacherManagement = ReturnType<typeof useTeacherManagement>;