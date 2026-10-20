import { findProfileUserByKeycloakId, countSchools } from "../repositories/profile.repository.js";
import { buildProfile, SUPPORTED_ROLES } from "../mappers/profile.mapper.js";

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export async function loadProfileUser(keycloakId) {
  const user = await findProfileUserByKeycloakId(keycloakId);
  if (!user) throw httpError(404, "User profile not found");
  if (!user.isActive) throw httpError(403, "This account has been deactivated");
  if (!SUPPORTED_ROLES.includes(user.role)) {
    throw httpError(403, "The profile page is not available for this role");
  }
  return user;
}

export async function getMyProfile(keycloakId) {
  const user = await loadProfileUser(keycloakId);
  const extras = user.role === "ADMIN" ? { schoolCount: await countSchools() } : {};
  return buildProfile(user, extras);
}
