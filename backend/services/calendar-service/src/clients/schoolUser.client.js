import { AppError } from "../utils/app-error.js";

const BASE =
  process.env.SCHOOL_USER_SERVICE_URL || "http://school-user-service:3001";
const cache = new Map();
const TTL_MS = 60_000;

async function cachedGet(key, path, user, { allow404 = false } = {}) {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;

  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: user.authHeader },
  });

  if (allow404 && res.status === 404) return null;
  if (!res.ok) {
    console.error(`school-user-service ${path} failed:`, res.status, await res.text());
    throw new AppError("Could not load your class information", 502);
  }

  const value = await res.json();
  cache.set(key, { value, expires: Date.now() + TTL_MS });
  return value;
}

export function getTeacherClass(user) {
  return cachedGet(`teacher:${user.userId}`, "/api/users/me/class", user, {
    allow404: true,
  });
}

// Parent: { schoolId, classIds, children }
export function getParentContext(user) {
  return cachedGet(
    `parent:${user.userId}`,
    "/api/users/me/children-classes",
    user
  );
}