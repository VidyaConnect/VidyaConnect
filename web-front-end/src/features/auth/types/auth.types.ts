// src/features/auth/types/auth.types.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string; // "ADMIN" | "SCHOOL_ADMIN" | "TEACHER" | "PARENT" | "STUDENT"
}

export interface School {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
  school: School | null;
  onboardingStatus: "NO_SCHOOL" | "PENDING_APPROVAL" | "REJECTED" | "ACTIVE";
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}