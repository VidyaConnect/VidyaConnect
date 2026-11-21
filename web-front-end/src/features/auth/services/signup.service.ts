import axios from "axios";
import apiClient from "@/services/apiClient";
import type { SignUpPayload } from "../types/signup.types";

/**
 * Creates the School Admin account on the backend.
 * Logging in after this is done by the sign-up hook, through AuthProvider.
 */
export async function registerSchoolAdmin(payload: SignUpPayload): Promise<void> {
  try {
    await apiClient.post("/auth/register/school-admin", payload);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        // Backend errors, for example "An account with this email already exists"
        throw new Error(
          err.response.data?.message || "Something went wrong. Please try again."
        );
      }
      throw new Error("Unable to reach the server. Please check your connection.");
    }
    throw new Error("Something went wrong. Please try again.");
  }
}