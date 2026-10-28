const BASE =
  process.env.SCHOOL_USER_SERVICE_URL || "http://school-user-service:3001";
const cache = new Map();
const TTL_MS = 60_000;

export async function getTeacherClasses(user, authHeader) {
  const key = `${user.userId}:classes`;
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;

  const res = await fetch(`${BASE}/api/users/me/classes`, {
    headers: authHeader ? { Authorization: authHeader } : {},
  });
  if (!res.ok) {
    const error = new Error("Could not load teacher's classes");
    error.status = res.status === 404 ? 403 : 502;
    throw error;
  }
  const payload = await res.json();
  const classes = payload?.data;
  if (!Array.isArray(classes)) {
    const error = new Error("Teacher classes response is invalid");
    error.status = 502;
    throw error;
  }
  cache.set(key, { value: classes, expires: Date.now() + TTL_MS });
  return classes;
}

export async function getSchoolId(user, authHeader) {
  if (user.schoolId) return user.schoolId;

  const hit = cache.get(`school:${user.userId}`);
  if (hit && hit.expires > Date.now()) return hit.value;

  const res = await fetch(`${BASE}/api/users/me`, {
    headers: { Authorization: authHeader },
  });
  if (!res.ok) return null;

  const payload = await res.json();
  const schoolId = payload?.data?.schoolId || payload?.data?.school?.id || null;
  if (schoolId) cache.set(`school:${user.userId}`, { value: schoolId, expires: Date.now() + TTL_MS });
  return schoolId;
}

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
