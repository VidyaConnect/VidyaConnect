import { useCallback, useEffect, useState } from "react";
import { AttendanceStatus, AttendanceSummary, StudentAttendance } from "../types/attendance";
import { fetchAttendanceRoster, fetchAttendanceSummary, submitAttendanceUpdate } from "../services/attendanceApi";

interface UseAttendanceResult {
  summary: AttendanceSummary;
  roster: StudentAttendance[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setLocalStatus: (studentId: string, status: AttendanceStatus) => void;
  submitAll: () => Promise<boolean>;
}

const initialSummary: AttendanceSummary = {
  className: "Grade 8A",
  date: new Date().toLocaleDateString(),
  present: 0,
  absent: 0,
  late: 0,
  notMarked: 0,
  progress: 0
};

export function useAttendance(): UseAttendanceResult {
  const [summary, setSummary] = useState<AttendanceSummary>(initialSummary);
  const [roster, setRoster] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localChanges, setLocalChanges] = useState<Map<string, AttendanceStatus>>(new Map());

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryData, rosterData] = await Promise.all([
        fetchAttendanceSummary(),
        fetchAttendanceRoster()
      ]);
      setSummary(summaryData);
      setRoster(rosterData);
    } catch {
      setError("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setLocalStatus = useCallback((studentId: string, status: AttendanceStatus) => {
    setLocalChanges((prev) => {
      const next = new Map(prev);
      next.set(studentId, status);
      return next;
    });
  }, []);

  const displayRoster = roster.map((student) => {
    const local = localChanges.get(student.id);
    return local ? { ...student, status: local } : student;
  });

  const submitAll = useCallback(async (): Promise<boolean> => {
    if (localChanges.size === 0) return true;
    try {
      const entries = Array.from(localChanges.entries());
      await Promise.all(
        entries.map(([studentId, status]) =>
          submitAttendanceUpdate(studentId, status)
        )
      );
      setLocalChanges(new Map());
      await refresh();
      return true;
    } catch {
      setError("Failed to save attendance");
      return false;
    }
  }, [localChanges, refresh]);

  return {
    summary,
    roster: displayRoster,
    loading,
    error,
    refresh,
    setLocalStatus,
    submitAll
  };
}
