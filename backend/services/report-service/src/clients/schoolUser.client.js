// backend/services/report-service/src/clients/schoolUser.client.js
import { getJson } from "./upstream.js";

// Read at call time (not at import time) so values from .env are always picked up.
const baseUrl = () => process.env.SCHOOL_USER_SERVICE_URL || "http://school-user-service:3001";

export function fetchSystemSummary(authHeader) {
  return getJson(`${baseUrl()}/api/reports/system-summary`, authHeader);
}
