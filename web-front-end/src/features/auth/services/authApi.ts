import apiClient from "@/services/apiClient";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  // ASSUMPTION — CONFIRM EXACT ENDPOINT PATH WITH SEHAJINIE
  const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
  return response.data;
}