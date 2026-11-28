import { getSchoolConsentSummary } from "../services/report.service.js";

export async function schoolConsentSummary(req, res) {
  try {
    return res.json(await getSchoolConsentSummary(req.user));
  } catch (error) {
    console.error("Consent report failed:", error);
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message || "Could not load consent report" });
  }
}
