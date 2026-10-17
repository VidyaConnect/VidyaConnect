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
          { label: 'Full Name', value: 'Super Admin', editable: true },
          { label: 'Role', value: 'Super Administrator' },
          { label: 'Email Address', value: 'superadmin@vdyaconnect.lk', editable: true },
          { label: 'Department', value: 'System Administration' },
          { label: 'Phone Number', value: '+94 77 123 4567', editable: true },
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

  admin: {
    id: 'ADM-2026-001',
    fullName: 'Admin User',
    roleTitle: 'School Administrator',
    roleBadge: 'School Admin',
    summaryLine: 'Managing Excellence International School',
    avatarInitial: 'A',
    quickStats: [
      { label: 'Admin ID', value: 'ADM-2026-001' },
      { label: 'Email', value: 'admin@excellence.edu.lk' },
      { label: 'Phone', value: '+94 71 234 5678' },
      { label: 'Status', value: 'Active', isStatus: true },
    ],
    sections: [
      {
        title: 'Personal Information',
        icon: 'personal',
        fields: [
          { label: 'Full Name', value: 'Admin User', editable: true },
          { label: 'Role', value: 'School Administrator' },
          { label: 'Email Address', value: 'admin@excellence.edu.lk', editable: true },
          { label: 'Department', value: 'Administration' },
          { label: 'Phone Number', value: '+94 71 234 5678', editable: true },
          { label: 'Joined Date', value: 'January 15, 2026 • 9:00 AM' },
        ],
      },
      {
        title: 'School Information',
        icon: 'school',
        fields: [
          { label: 'School Name', value: 'Excellence International School' },
          { label: 'School Type', value: 'International School' },
          { label: 'School Code', value: 'EIS-2026-001' },
          { label: 'Address', value: 'Colombo 07, Sri Lanka' },
        ],
      },
      {
        title: 'Account Information',
        icon: 'account',
        fields: [
          { label: 'Admin ID', value: 'ADM-2026-001' },
          { label: 'Last Login', value: 'July 22, 2026 • 9:45 AM' },
          { label: 'Account Type', value: 'School Admin' },
          { label: 'Account Status', value: 'Active' },
        ],
      },
      {
        title: 'Permissions & Access',
        icon: 'access',
        fields: [
          { label: 'Access Level', value: 'School Level Access' },
          { label: 'Modules Access', value: 'School Modules' },
          { label: 'Students Access', value: 'All Students in School' },
          { label: 'Data Access', value: 'School Data Only' },
        ],
      },
    ],
    security: {
      passwordMasked: '••••••••',
      twoFactorEnabled: true,
    },
    lastUpdated: 'July 20, 2026 • 4:30 PM',
  },

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
          { label: 'Full Name', value: 'Mrs. Thompson', editable: true },
          { label: 'Role', value: 'Teacher' },
          { label: 'Email Address', value: 'm.thompson@excellence.edu.lk', editable: true },
          { label: 'Department', value: 'Mathematics' },
          { label: 'Phone Number', value: '+94 76 345 6789', editable: true },
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

export async function updateMyProfile(
  role: ProfileRole,
  updatedFields: Record<string, string>
): Promise<UserProfile> {
  try {
    const response = await apiClient.put<UserProfile>(`/api/profile/me?role=${role}`, updatedFields)
    return response.data
  } catch (error) {
    console.warn('Profile update API not available, updating mock data:', error)

    const profile = mockProfiles[role]

    // Update the matching fields inside Personal Information
    profile.sections = profile.sections.map((section) => {
      if (section.title !== 'Personal Information') return section
      return {
        ...section,
        fields: section.fields.map((field) =>
          updatedFields[field.label] !== undefined
            ? { ...field, value: updatedFields[field.label] }
            : field
        ),
      }
    })

    // Keep the Quick Stats row in sync with the new Email/Phone
    profile.quickStats = profile.quickStats.map((stat) => {
      if (stat.label === 'Email' && updatedFields['Email Address'] !== undefined) {
        return { ...stat, value: updatedFields['Email Address'] }
      }
      if (stat.label === 'Phone' && updatedFields['Phone Number'] !== undefined) {
        return { ...stat, value: updatedFields['Phone Number'] }
      }
      return stat
    })

    // Keep the header card name/avatar in sync with the new Full Name
    if (updatedFields['Full Name'] !== undefined) {
      profile.fullName = updatedFields['Full Name']
      profile.avatarInitial = updatedFields['Full Name'].charAt(0).toUpperCase()
    }

    return profile
  }
}

export async function changeMyPassword(
  role: ProfileRole,
  payload: { currentPassword: string; newPassword: string }
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiClient.put(`/api/profile/change-password?role=${role}`, payload)
    return response.data
  } catch (error) {
    console.warn('Change password API not available, simulating success:', error)
    return { success: true, message: 'Password changed successfully (mock)' }
  }
}
