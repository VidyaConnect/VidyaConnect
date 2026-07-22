// src/features/auth/types/auth.types.ts

export type UserRole = "SuperAdmin" | "SchoolAdmin" | "Teacher";

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

// ASSUMPTION — CONFIRM WITH SEHAJINIE:
// Assumes JWT returned in JSON body, not an httpOnly cookie.
export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  schoolId?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
