// backend/services/report-service/src/clients/upstream.js
// One helper for calling another VidyaConnect service.
import { logger } from "@vidyaconnect/shared";

const TIMEOUT_MS = 8000;

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export async function getJson(url, authHeader) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const headers = { Accept: "application/json" };
    // The user's own token is passed on, so the other service checks it again.
    if (authHeader) headers.Authorization = authHeader;

    const res = await fetch(url, { headers, signal: controller.signal });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      logger.error("Upstream request failed", { status: res.status, body: body.slice(0, 300) });
      const passThrough = res.status === 401 || res.status === 403;
      throw httpError(
        passThrough ? res.status : 502,
        passThrough ? "Not allowed to view this report" : "A report data service returned an error"
      );
    }

    return await res.json();
  } catch (err) {
    if (err.status) throw err;
    const timedOut = err.name === "AbortError";
    logger.error("Upstream request error", { message: err.message });
    throw httpError(
      timedOut ? 504 : 502,
      timedOut ? "A report data service took too long to respond" : "A report data service is not reachable"
    );
  } finally {
    clearTimeout(timer);
  }
}
