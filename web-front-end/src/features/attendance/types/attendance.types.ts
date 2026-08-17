export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXEMPTED" | "NOT_MARKED";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: AttendanceStatus;
  markedById: string | null;
  markedAt: string | null;
}

export interface AttendanceClassResponse {
  classId: string;
  date: string;
  records: AttendanceRecord[];
}

export interface AttendanceStudentRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
  classId: string;
}

export interface AttendanceStudentResponse {
  studentId: string;
  records: AttendanceStudentRecord[];
}

export interface AbsenceResponse {
  id: string;
  attendanceRecordId: string;
  reason: string;
  fileId: string | null;
  fileName: string | null;
  submittedAt: string;
  attendance: {
    date: string;
    status: AttendanceStatus;
    classId: string;
  };
}

export interface MarkAttendancePayload {
  classId: string;
  date: string;
  records: {
    studentId: string;
    studentName: string;
    rollNumber: string;
    status: AttendanceStatus;
  }[];
}

export interface SubmitAbsencePayload {
  attendanceRecordId: string;
  reason: string;
  fileId?: string;
  fileName?: string;
}
