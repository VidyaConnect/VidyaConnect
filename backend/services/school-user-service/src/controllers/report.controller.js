// backend/services/school-user-service/src/controllers/report.controller.js
import { error, logger } from "@vidyaconnect/shared";
import * as reportService from "../services/report.service.js";

export const systemSummary = async (req, res) => {
  try {
    const summary = await reportService.getSystemSummary();
    return res.json(summary);
  } catch (err) {
    logger.error("Failed to build system summary", err);
    return error(res, "Could not load system report data", 500);
  }
};
