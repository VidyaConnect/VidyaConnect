import { apiClient } from "../../../services/api";
import {
  AdminAttendanceOverview,
  AttendanceSummary,
  ParentAbsenceAlert,
  StudentAttendance
} from "../types/attendance";

export async function fetchAttendanceSummary(): Promise<AttendanceSummary> {
  const response = await apiClient.get<AttendanceSummary>("/attendance/summary");
  return response.data;
}

export async function fetchAttendanceRoster(): Promise<StudentAttendance[]> {
  const response = await apiClient.get<StudentAttendance[]>("/attendance/roster");
  return response.data;
}

export async function fetchAdminAttendanceOverview(): Promise<AdminAttendanceOverview> {
  const response = await apiClient.get<AdminAttendanceOverview>("/attendance/admin/overview");
  return response.data;
}

export async function fetchAdminClassRoster(classId: string): Promise<StudentAttendance[]> {
  const response = await apiClient.get<StudentAttendance[]>(`/attendance/admin/classes/${classId}/roster`);
  return response.data;
}

export async function fetchParentAbsenceAlert(): Promise<ParentAbsenceAlert> {
  const response = await apiClient.get<ParentAbsenceAlert>("/attendance/parent/alert");
  return response.data;
}

export async function submitAttendanceUpdate(studentId: string, status: string) {
  return apiClient.post(`/attendance/roster/${studentId}`, { status });
}

export async function submitAbsenceReason(payload: {
  reason: string;
  fileId?: string | null;
  fileName?: string | null;
}) {
  return apiClient.post("/attendance/absence/reason", payload);
}
