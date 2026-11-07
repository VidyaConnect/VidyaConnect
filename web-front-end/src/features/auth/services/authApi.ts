// src/features/auth/services/authApi.ts
import apiClient from "@/services/apiClient";
import type {
  LoginRequest,
  LoginResponseData,
  ApiSuccessResponse,
} from "../types/auth.types";

export async function loginUser(
  credentials: LoginRequest
): Promise<LoginResponseData> {
  const response = await apiClient.post<ApiSuccessResponse<LoginResponseData>>(
    "/auth/login",
    credentials
  );
  return response.data.data;
}

export async function refreshSession(): Promise<string | null> {
  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  if (!refreshToken) return null;

  try {
    const response = await apiClient.post<ApiSuccessResponse<LoginResponseData>>(
      "/auth/refresh",
      { refreshToken }
    );
    const data = response.data.data;
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data.accessToken;
  } catch {
    return null; // refresh token expired or revoked
  }
}