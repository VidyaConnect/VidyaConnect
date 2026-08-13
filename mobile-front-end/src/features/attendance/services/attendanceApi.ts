import { apiClient } from "../../../services/api";
import {
  AdminAttendanceOverview,
  AttendanceSummary,
  ParentAbsenceAlert,
  StudentAttendance
} from "../types/attendance";
import {
  adminOverviewMock,
  adminRosterMock,
  parentAbsenceMock,
  teacherRosterMock
} from "../data/mockAttendance";

export async function fetchAttendanceSummary(): Promise<AttendanceSummary> {
  try {
    const response = await apiClient.get<AttendanceSummary>("/attendance/summary");
    return response.data;
  } catch {
    return {
      className: "Grade 8A",
      date: new Date().toLocaleDateString(),
      present: 35,
      absent: 2,
      late: 1,
      notMarked: 0,
      progress: 94
    };
  }
}

export async function fetchAttendanceRoster(): Promise<StudentAttendance[]> {
  try {
    const response = await apiClient.get<StudentAttendance[]>("/attendance/roster");
    return response.data;
  } catch {
    return teacherRosterMock;
  }
}

export async function fetchAdminAttendanceOverview(): Promise<AdminAttendanceOverview> {
  try {
    const response = await apiClient.get<AdminAttendanceOverview>("/attendance/admin/overview");
    return response.data;
  } catch {
    return adminOverviewMock;
  }
}

export async function fetchAdminClassRoster(classId: string): Promise<StudentAttendance[]> {
  try {
    const response = await apiClient.get<StudentAttendance[]>(`/attendance/admin/classes/${classId}/roster`);
    return response.data;
  } catch {
    return adminRosterMock;
  }
}

export async function fetchParentAbsenceAlert(): Promise<ParentAbsenceAlert> {
  try {
    const response = await apiClient.get<ParentAbsenceAlert>("/attendance/parent/alert");
    return response.data;
  } catch {
    return parentAbsenceMock;
  }
}

export async function submitAttendanceUpdate(studentId: string, status: string) {
  return apiClient.post(`/attendance/roster/${studentId}`, { status });
}

export async function submitAbsenceReason(payload: {
  reason: string;
  fileName?: string | null;
}) {
  return apiClient.post("/attendance/absence/reason", payload);
}
