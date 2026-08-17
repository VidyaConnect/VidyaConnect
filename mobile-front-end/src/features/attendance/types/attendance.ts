export type AttendanceStatus = "present" | "absent" | "late" | "notMarked";

export type ClassMarkStatus = "marked" | "pending";

export interface AttendanceSummary {
  className: string;
  date: string;
  present: number;
  absent: number;
  late: number;
  notMarked: number;
  progress: number;
}

export interface StudentAttendance {
  id: string;
  name: string;
  rollNumber: string;
  status: AttendanceStatus;
  avatarUrl?: string;
}

export interface AdminClassAttendance {
  id: string;
  className: string;
  teacherName: string;
  status: ClassMarkStatus;
  progress: number;
  students: StudentAttendance[];
}

export interface AdminAttendanceOverview {
  present: number;
  absent: number;
  late: number;
  notMarked: number;
  classes: AdminClassAttendance[];
}

export interface ParentAbsenceAlert {
  studentName: string;
  className: string;
  rollNumber: string;
  dateLabel: string;
  alertTime: string;
}
