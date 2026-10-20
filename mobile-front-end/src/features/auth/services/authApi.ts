// src/features/auth/services/authApi.ts
import { apiClient } from "../../../services/api";
import type {
  LoginRequest,
  LoginResponseData,
  ApiSuccessResponse,
  RegisterParentRequest,
  User,
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

export async function registerParent(
  data: RegisterParentRequest
): Promise<User> {
  const response = await apiClient.post<ApiSuccessResponse<User>>(
    "/auth/register/parent",
    data
  );
  return response.data.data;
}