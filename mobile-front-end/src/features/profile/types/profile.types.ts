// src/features/profile/types/profile.types.ts
// Same shape as the web UserProfile, plus a "children" list for parents.

export interface ProfileStat {
  label: string;
  value: string;
  isStatus?: boolean;
}

export interface ProfileInfoField {
  label: string;
  value: string;
  editable?: boolean;
}

export interface ProfileSection {
  title: string;
  fields: ProfileInfoField[];
}

export interface ProfileChild {
  id: string;
  name: string;
  className: string; // e.g. "Grade 9 A"
  relationship: string; // e.g. "Mother"
}

export interface ProfileSecurity {
  passwordMasked: string;
  twoFactorEnabled: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  roleTitle: string;
  avatarInitial: string;
  quickStats: ProfileStat[];
  sections: ProfileSection[];
  children: ProfileChild[];
  security: ProfileSecurity;
  lastUpdated: string;
}

export interface UpdateProfilePayload {
  fullName: string;
  phone: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}