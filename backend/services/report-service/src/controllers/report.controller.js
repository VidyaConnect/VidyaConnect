// backend/services/report-service/src/controllers/report.controller.js
import { error } from "@vidyaconnect/shared";
import { fetchSystemSummary, fetchSchoolAccounts } from "../clients/schoolUser.client.js";
import { fetchSchoolAttendanceSummary } from "../clients/attendance.client.js";

const ALLOWED_DAYS = [7, 30, 90];

const fail = (res, err) => error(res, err.message || "Could not build report", err.status || 500);

export async function superAdminSummary(req, res) {
  try {
    const summary = await fetchSystemSummary(req.headers.authorization);
    return res.json(summary);
  } catch (err) {
    return fail(res, err);
  }
}

export async function schoolAdminAttendance(req, res) {
  const days = Number(req.query.days ?? 30);
  if (!ALLOWED_DAYS.includes(days)) {
    return error(res, "days must be 7, 30 or 90", 400);
  }

  const rawClassId = req.query.classId;
  const classId =
    typeof rawClassId === "string" && rawClassId !== "all" && rawClassId.length <= 64
      ? rawClassId
      : undefined;

  try {
    // No schoolId here on purpose: attendance-service reads it from the token.
    const summary = await fetchSchoolAttendanceSummary(req.headers.authorization, { days, classId });
    return res.json(summary);
  } catch (err) {
    return fail(res, err);
  }
}

export async function schoolAdminAccounts(req, res) {
  try {
    const data = await fetchSchoolAccounts(req.headers.authorization);
    return res.json(data);
  } catch (err) {
    return fail(res, err);
  }
}
