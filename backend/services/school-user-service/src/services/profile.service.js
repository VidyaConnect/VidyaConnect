import {
  findProfileUserByKeycloakId,
  countSchools,
  updateUserProfile,
} from "../repositories/profile.repository.js";
import { buildProfile, SUPPORTED_ROLES } from "../mappers/profile.mapper.js";
import { validateProfileUpdate } from "../validators/profile.validator.js";

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

async function profileFor(user) {
  const extras = user.role === "ADMIN" ? { schoolCount: await countSchools() } : {};
  return buildProfile(user, extras);
}

export async function getMyProfile(keycloakId) {
  return profileFor(await loadProfileUser(keycloakId));
}

export async function updateMyProfile(keycloakId, body) {
  await loadProfileUser(keycloakId);
  const { data, errors } = validateProfileUpdate(body);
  if (Object.keys(errors).length) {
    throw httpError(400, Object.values(errors).join(" "));
  }
  const updated = await updateUserProfile(keycloakId, data);
  return profileFor(updated);
}
