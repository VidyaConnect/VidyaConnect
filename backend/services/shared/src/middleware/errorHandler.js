import logger from "../utils/logger.js";

export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  logger.error("Unhandled error", {
    method: req.method,
    path: req.path,
    status,
    message,
  });

  return res.status(status).json({
    success: false,
    message,
  });
}
