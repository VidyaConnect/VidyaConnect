const BASE =
  process.env.SCHOOL_USER_SERVICE_URL || "http://school-user-service:3001";
const cache = new Map();
const TTL_MS = 60_000;

export async function getTeacherClass(user, authHeader) {
  const hit = cache.get(user.userId);
  if (hit && hit.expires > Date.now()) return hit.value;

  const res = await fetch(`${BASE}/api/users/me/class`, {
    headers: { Authorization: authHeader },
  });

  if (res.status === 404) return null;
    if (!res.ok) {
      const body = await res.text();
      console.error("school-user-service /me/class failed:", res.status, body);
      const error = new Error("Could not load teacher's class");
      error.status = 502;
      throw error;
    }
  const value = await res.json();
  cache.set(user.userId, { value, expires: Date.now() + TTL_MS });
  return value;
}