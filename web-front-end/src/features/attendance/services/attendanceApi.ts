import apiClient from "@/services/apiClient";
import type {
  AttendanceClassResponse,
  AttendanceStudentResponse,
  AbsenceResponse,
  MarkAttendancePayload,
  SubmitAbsencePayload,
} from "../types/attendance.types";

const ATTENDANCE_API_BASE = process.env.NEXT_PUBLIC_ATTENDANCE_API_URL || "http://localhost:3003";

export async function markAttendance(payload: MarkAttendancePayload) {
  const response = await apiClient.post(`${ATTENDANCE_API_BASE}/attendance/`, payload);
  return response.data.data;
}

export async function getAttendanceByClass(
  classId: string,
  date: string
): Promise<AttendanceClassResponse> {
  const response = await apiClient.get(`${ATTENDANCE_API_BASE}/attendance/class/${classId}`, {
    params: { date },
  });
  return response.data.data;
}

export async function getStudentAttendance(
  studentId: string,
  params?: { startDate?: string; endDate?: string }
): Promise<AttendanceStudentResponse> {
  const response = await apiClient.get(`${ATTENDANCE_API_BASE}/attendance/student/${studentId}`, {
    params,
  });
  return response.data.data;
}

export async function submitAbsenceResponse(
  payload: SubmitAbsencePayload
): Promise<AbsenceResponse> {
  const response = await apiClient.post(`${ATTENDANCE_API_BASE}/attendance/absence-response`, payload);
  return response.data.data;
}

export async function getAbsenceResponses(studentId: string): Promise<AbsenceResponse[]> {
  const response = await apiClient.get(
    `${ATTENDANCE_API_BASE}/attendance/absence-response/${studentId}`
  );
  return response.data.data;
}
