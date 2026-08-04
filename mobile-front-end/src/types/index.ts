export type UserRole = "super-admin" | "school-admin" | "teacher" | "parent" | "student";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
}
