// backend/services/attendance-service/src/controllers/report.controller.js
import { error, logger } from "@vidyaconnect/shared";
import * as reportService from "../services/report.service.js";
import { getSchoolIdForUser } from "../clients/schoolContext.client.js";

const ALLOWED_DAYS = [7, 30, 90];

export const schoolSummary = async (req, res) => {
  // The school comes from the verified token, or from the user's database record.
  // It is never taken from the URL or the request body.
  let schoolId = req.user?.schoolId;
  if (!schoolId) {
    try {
      schoolId = await getSchoolIdForUser(req.user, req.headers.authorization);
    } catch (err) {
      logger.error("Could not look up school for user", err);
    }
  }
  if (!schoolId) {
    return error(res, "This account is not linked to a school", 403);
  }

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
    const summary = await reportService.getSchoolAttendanceSummary(schoolId, { days, classId });
    return res.json(summary);
  } catch (err) {
    logger.error("Failed to build school attendance summary", err);
    return error(res, "Could not load attendance report data", 500);
  }
};
