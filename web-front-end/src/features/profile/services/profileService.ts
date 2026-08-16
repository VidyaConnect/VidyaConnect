// src/features/profile/services/profileService.ts

import apiClient from '@/services/apiClient'
import type { UserProfile, ProfileRole } from '../types/profile.types'

const mockProfiles: Record<ProfileRole, UserProfile> = {
  'super-admin': {
    id: 'SA-0001',
    fullName: 'Super Admin',
    roleTitle: 'Super Administrator',
    roleBadge: 'Super Admin',
    summaryLine: 'Full system access • All schools • All modules',
    avatarInitial: 'S',
    quickStats: [
      { label: 'User ID', value: 'SA-0001' },
      { label: 'Email', value: 'superadmin@vdyaconnect.lk' },
      { label: 'Phone', value: '+94 77 123 4567' },
      { label: 'Status', value: 'Active', isStatus: true },
    ],
    sections: [
      {
        title: 'Personal Information',
        icon: 'personal',
        fields: [
          { label: 'Full Name', value: 'Super Admin' },
          { label: 'Role', value: 'Super Administrator' },
          { label: 'Email Address', value: 'superadmin@vdyaconnect.lk' },
          { label: 'Department', value: 'System Administration' },
          { label: 'Phone Number', value: '+94 77 123 4567' },
          { label: 'Joined Date', value: 'January 1, 2024 • 1:00 PM' },
        ],
      },
      {
        title: 'Account Information',
        icon: 'account',
        fields: [
          { label: 'User ID', value: 'SA-0001' },
          { label: 'Last Login', value: 'July 22, 2026 • 10:30 AM' },
          { label: 'Account Type', value: 'Super Admin' },
          { label: 'Account Status', value: 'Active' },
        ],
      },
      {
        title: 'System Access & Permissions',
        icon: 'access',
        fields: [
          { label: 'Access Level', value: 'Full System Access' },
          { label: 'Modules Access', value: 'All Modules' },
          { label: 'Schools Access', value: 'All 1,204 schools' },
          { label: 'Data Access', value: 'Complete System Data' },
        ],
      },
    ],
    security: {
      passwordMasked: '••••••••',
      twoFactorEnabled: true,
    },
    lastUpdated: 'July 21, 2026 • 2:15 PM',
  },

  // Placeholder — filled in when we build School Admin's page
  admin: {} as UserProfile,

  teacher: {
    id: 'TCH-2026-047',
    fullName: 'Mrs. Thompson',
    roleTitle: 'Mathematics Teacher',
    roleBadge: 'Teacher',
    summaryLine: 'Excellence International School',
    avatarInitial: 'M',
    quickStats: [
      { label: 'Teacher ID', value: 'TCH-2026-047' },
      { label: 'Email', value: 'm.thompson@excellence.edu.lk' },
      { label: 'Phone', value: '+94 76 345 6789' },
      { label: 'Status', value: 'Active', isStatus: true },
    ],
    sections: [
      {
        title: 'Personal Information',
        icon: 'personal',
        fields: [
          { label: 'Full Name', value: 'Mrs. Thompson' },
          { label: 'Role', value: 'Teacher' },
          { label: 'Email Address', value: 'm.thompson@excellence.edu.lk' },
          { label: 'Department', value: 'Mathematics' },
          { label: 'Phone Number', value: '+94 76 345 6789' },
          { label: 'Joined Date', value: 'February 1, 2026 • 8:30 AM' },
        ],
      },
      {
        title: 'Professional Information',
        icon: 'professional',
        fields: [
          { label: 'Teacher ID', value: 'TCH-2026-047' },
          { label: 'Qualification', value: 'MSc in Mathematics' },
          { label: 'Subjects', value: 'Mathematics' },
          { label: 'Experience', value: '8 years' },
        ],
      },
      {
        title: 'Class Information',
        icon: 'class',
        fields: [
          { label: 'Classes Teaching', value: 'Grade 9A, Grade 10B' },
          { label: 'Academic Year', value: '2026' },
          { label: 'Total Students', value: '45 Students' },
          { label: 'Classroom', value: 'Room 201' },
        ],
      },
      {
        title: 'Account Information',
        icon: 'account',
        fields: [
          { label: 'Account Type', value: 'Teacher' },
          { label: 'Last Login', value: 'July 22, 2026 • 8:15 AM' },
          { label: 'Account Status', value: 'Active' },
        ],
      },
    ],
    security: {
      passwordMasked: '••••••••',
      twoFactorEnabled: true,
    },
    lastUpdated: 'July 18, 2026 • 11:20 AM',
  },
}

export async function getMyProfile(role: ProfileRole): Promise<UserProfile> {
  try {
    const response = await apiClient.get<UserProfile>(`/api/profile/me?role=${role}`)
    return response.data
  } catch (error) {
    console.warn('Profile API not available, using mock data:', error)
    return mockProfiles[role]
  }
}