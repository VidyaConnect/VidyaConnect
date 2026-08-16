// src/features/profile/types/profile.types.ts

export type ProfileRole = 'super-admin' | 'admin' | 'teacher'

export interface ProfileStat {
  label: string
  value: string
  isStatus?: boolean
}

export interface ProfileInfoField {
  label: string
  value: string
}

export type ProfileSectionIcon =
  | 'personal'
  | 'account'
  | 'school'
  | 'access'
  | 'professional'
  | 'class'

export interface ProfileSection {
  title: string
  icon: ProfileSectionIcon
  fields: ProfileInfoField[]
}

export interface ProfileSecurity {
  passwordMasked: string
  twoFactorEnabled: boolean
}

export interface UserProfile {
  id: string
  fullName: string
  roleTitle: string
  roleBadge: string
  summaryLine: string
  avatarInitial: string
  quickStats: ProfileStat[]
  sections: ProfileSection[]
  security: ProfileSecurity
  lastUpdated: string
}