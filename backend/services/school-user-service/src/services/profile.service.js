import {
  findProfileUserByKeycloakId,
  countSchools,
  updateUserProfile,
} from "../repositories/profile.repository.js";
import { buildProfile, SUPPORTED_ROLES } from "../mappers/profile.mapper.js";
import { validateProfileUpdate, validatePasswordChange } from "../validators/profile.validator.js";
import { requestTokenWithPassword } from "./keycloakClient.service.js";
import { resetUserPassword, updateKeycloakUser } from "./keycloakAdmin.service.js";
import { findUserByEmail } from "../repositories/profile.repository.js";

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
  const user = await loadProfileUser(keycloakId);

  const { data, errors, currentPassword } = validateProfileUpdate(body);
  if (Object.keys(errors).length) throw httpError(400, Object.values(errors).join(" "));

  if (data.email === user.email) delete data.email;
  if (data.fullName === user.fullName) delete data.fullName;
  if (Object.keys(data).length === 0) return profileFor(user); // nothing really changed

  const emailChanging = data.email !== undefined;
  const nameChanging = data.fullName !== undefined;

  if (emailChanging) {
    if (!currentPassword) throw httpError(400, "Current password is required to change your email.");
    try {
      await requestTokenWithPassword(user.email, currentPassword);
    } catch (err) {
      if (err.status === 401) throw httpError(400, "Current password is incorrect.");
      throw err;
    }
    if (await findUserByEmail(data.email)) throw httpError(409, "That email is already in use.");
  }

  // Keycloak first, so a failure there saves nothing
  if (emailChanging || nameChanging) {
    await updateKeycloakUser(keycloakId, {
      fullName: nameChanging ? data.fullName : undefined,
      email: emailChanging ? data.email : undefined,
    });
  }

  try {
    return profileFor(await updateUserProfile(keycloakId, data));
  } catch (err) {
    if (emailChanging || nameChanging) {
      try {
        await updateKeycloakUser(keycloakId, {
          fullName: nameChanging ? user.fullName : undefined,
          email: emailChanging ? user.email : undefined,
        });
      } catch {
        console.error("Rollback of the Keycloak update failed for", keycloakId);
      }
    }
    if (err.code === "P2002") throw httpError(409, "That email is already in use.");
    throw err;
  }
}

export async function changeMyPassword(keycloakId, body) {
  const user = await loadProfileUser(keycloakId);

  const { errors } = validatePasswordChange(body);
  if (Object.keys(errors).length) {
    throw httpError(400, Object.values(errors).join(" "));
  }

  // Step 1: prove the user knows the current password (Keycloak login attempt)
  try {
    await requestTokenWithPassword(user.email, body.currentPassword);
  } catch (err) {
    if (err.status === 401) throw httpError(400, "Current password is incorrect.");
    throw err;
  }

  // Step 2: set the new password in Keycloak
  await resetUserPassword(keycloakId, body.newPassword);
}