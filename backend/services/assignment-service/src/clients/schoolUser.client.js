const BASE = process.env.SCHOOL_USER_SERVICE_URL || "http://school-user-service:3001";
const cache = new Map();

export async function getTeacherClasses(user, authHeader) {
  const cacheKey = `${user.userId}:classes`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const response = await fetch(`${BASE}/api/users/me/classes`, {
    headers: authHeader ? { Authorization: authHeader } : {},
  });
  if (response.status === 404) return [];
  if (!response.ok) {
    const error = new Error("Could not verify the teacher's assigned class");
    error.status = 502;
    throw error;
  }

  const payload = await response.json();
  const value = payload.data || payload;
  if (!Array.isArray(value)) {
    const error = new Error("Teacher class response is invalid");
    error.status = 502;
    throw error;
  }
  cache.set(cacheKey, { value, expiresAt: Date.now() + 60_000 });
  return value;
}
