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