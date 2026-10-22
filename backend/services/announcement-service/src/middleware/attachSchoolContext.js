const SCHOOL_USER_SERVICE_URL =
  process.env.SCHOOL_USER_SERVICE_URL || "http://school-user-service:3001";

const cache = new Map();

async function lookupSchoolId(userId, authorization) {
  const cached = cache.get(userId);
  if (cached && cached.expiresAt > Date.now()) return cached.schoolId;

  const response = await fetch(`${SCHOOL_USER_SERVICE_URL}/api/users/me`, {
    headers: authorization ? { Authorization: authorization } : {},
  });
  if (!response.ok) return null;

  const payload = await response.json();
  const schoolId = payload?.data?.schoolId || payload?.data?.school?.id || null;
  cache.set(userId, { schoolId, expiresAt: Date.now() + 60_000 });
  return schoolId;
}

/** Fills req.user.schoolId from school-user-service when the JWT has no school claim. */
export default async function attachSchoolContext(req, res, next) {
  try {
    if (req.user?.schoolId) return next();
    if (!req.user?.userId) return next();

    const schoolId = await lookupSchoolId(req.user.userId, req.headers.authorization);
    if (schoolId) req.user.schoolId = schoolId;
  } catch {
    // Keep the original JWT context; route handlers still enforce school access.
  }
  return next();
}
