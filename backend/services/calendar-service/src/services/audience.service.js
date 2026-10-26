import { getTeacherClass, getParentContext } from "../clients/schoolUser.client.js";

export async function getUserClassIds(user) {
  // Local testing without Keycloak: use the fake class from .env
  if (process.env.AUTH_DISABLED === "true") {
    return user.classId ? [user.classId] : [];
  }

  if (user.role === "TEACHER") {
    const cls = await getTeacherClass(user);
    return cls ? [cls.classId] : [];
  }

  if (user.role === "PARENT") {
    const ctx = await getParentContext(user);
    return ctx?.classIds ?? [];
  }

  return [];
}