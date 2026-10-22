const BASE = process.env.SCHOOL_USER_SERVICE_URL || "http://school-user-service:3001";
const cache = new Map();

export async function getTeacherClass(user, authHeader) {
  const cached = cache.get(user.userId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const response = await fetch(`${BASE}/api/users/me/class`, {
    headers: authHeader ? { Authorization: authHeader } : {},
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    const error = new Error("Could not verify the teacher's assigned class");
    error.status = 502;
    throw error;
  }

  const payload = await response.json();
  const value = payload.data || payload;
  cache.set(user.userId, { value, expiresAt: Date.now() + 60_000 });
  return value;
}
