import apiClient from "@/services/apiClient";
import type {
  LoginRequest,
  LoginResponseData,
  ApiSuccessResponse,
  User,
} from "../types/auth.types";
import type { OnboardingStatus } from "../utils/onboarding";

export interface MeResponseData {
  onboardingStatus: OnboardingStatus;
  user: User;
  school: {
    id: string;
    name: string;
    status: "UNDER_REVIEW" | "APPROVED" | "REJECTED";
    admissionId: string;
    estimatedWaitHours: string;
  } | null;
}

export async function loginUser(
  credentials: LoginRequest
): Promise<LoginResponseData> {
  const response = await apiClient.post<ApiSuccessResponse<LoginResponseData>>(
    "/auth/login",
    credentials
  );
  return response.data.data;
}

/** Gets the current onboarding status and school info from the server. */
export async function getMe(): Promise<MeResponseData> {
  const response = await apiClient.get<ApiSuccessResponse<MeResponseData>>("/auth/me");
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