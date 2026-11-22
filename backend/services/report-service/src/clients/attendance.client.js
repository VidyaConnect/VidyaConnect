// backend/services/report-service/src/clients/attendance.client.js
import { getJson } from "./upstream.js";

const baseUrl = () => process.env.ATTENDANCE_SERVICE_URL || "http://attendance-service:3003";

export function fetchSchoolAttendanceSummary(authHeader, { days, classId }) {
  const params = new URLSearchParams({ days: String(days) });
  if (classId) params.set("classId", classId);
  return getJson(`${baseUrl()}/attendance/reports/school-summary?${params}`, authHeader);
}
