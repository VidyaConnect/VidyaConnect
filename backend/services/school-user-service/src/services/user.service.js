import { findUserByKeycloakId } from "../repositories/user.repository.js";

export const getCurrentUserProfile = async (keycloakId) => {
  const user = await findUserByKeycloakId(keycloakId);

  if (!user) {
    throw new Error("User profile not found");
  }

  return user;
};