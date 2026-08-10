import { useEffect, useState } from "react";
import { AttendanceSummary, StudentAttendance } from "../types/attendance";
import { fetchAttendanceRoster, fetchAttendanceSummary } from "../services/attendanceApi";

interface UseAttendanceResult {
  summary: AttendanceSummary;
  roster: StudentAttendance[];
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

  useEffect(() => {
    async function load() {
      const [summaryData, rosterData] = await Promise.all([
        fetchAttendanceSummary(),
        fetchAttendanceRoster()
      ]);
      setSummary(summaryData);
      setRoster(rosterData);
    }

    load();
  }, []);

  return { summary, roster };
}
