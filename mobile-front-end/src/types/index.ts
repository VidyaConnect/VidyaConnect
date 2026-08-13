export type UserRole = "teacher" | "parent" | "school-admin";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
}
