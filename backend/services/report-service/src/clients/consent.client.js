import { getJson } from "./upstream.js";

const baseUrl = () => process.env.CONSENT_SERVICE_URL || "http://consent-form-service:3005";

export function fetchConsentSummary(authHeader) {
  return getJson(`${baseUrl()}/api/consent-forms/reports/school-summary`, authHeader);
}
