// New file. Looks up the user's school from school-user-service when the token has none.
const BASE =
  process.env.SCHOOL_USER_SERVICE_URL || "http://school-user-service:3001";
const cache = new Map();
const TTL_MS = 60_000;

export async function getSchoolIdForUser(user, authHeader) {
  const hit = cache.get(user.userId);
  if (hit && hit.expires > Date.now()) return hit.value;

  const res = await fetch(`${BASE}/api/users/me`, {
    headers: { Authorization: authHeader },
  });
  if (!res.ok) return null;

  const body = await res.json();
  const data = body.data ?? body;
  const value = data.schoolId ?? data.school?.id ?? null;

  if (value) cache.set(user.userId, { value, expires: Date.now() + TTL_MS });
  return value;
}
