// src/features/profile/services/profileService.ts
import apiClient from '@/services/apiClient'
import { fetchWithAuth } from '@/services/fetchWithAuth'
import type { UserProfile, ProfileRole } from '../types/profile.types'

// Which login role each profile page is meant for
const EXPECTED_ROLE: Record<ProfileRole, string> = {
  'super-admin': 'ADMIN',
  admin: 'SCHOOL_ADMIN',
  teacher: 'TEACHER',
}

const PAGE_NAME: Record<ProfileRole, string> = {
  'super-admin': 'Super Admin',
  admin: 'School Admin',
  teacher: 'Teacher',
}

// UX guard only. The server always returns the signed-in user's own profile.
function assertRole(role: ProfileRole) {
  if (typeof window === 'undefined') return
  try {
    const stored = JSON.parse(localStorage.getItem('user') || 'null')
    if (stored?.role && stored.role !== EXPECTED_ROLE[role]) {
      throw new Error(`This page is for ${PAGE_NAME[role]} accounts only.`)
    }
  } catch (e) {
    if (e instanceof Error && e.message.startsWith('This page')) throw e
  }
}

interface ApiBody<T> {
  success?: boolean
  message?: string
  data?: T
}

async function request<T>(path: string, init: RequestInit = {}): Promise<ApiBody<T>> {
  const base = apiClient.defaults.baseURL ?? 'http://localhost:3001/api'
  let res: Response
  try {
    res = await fetchWithAuth(`${base}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...((init.headers as Record<string, string>) || {}),
      },
    })
  } catch {
    throw new Error('Unable to reach the server. Please try again.')
  }

  let body: ApiBody<T> | null = null
  try {
    body = await res.json()
  } catch {
    /* response had no JSON body */
  }
  if (!res.ok) throw new Error(body?.message || `Request failed (${res.status})`)
  return body ?? {}
}

export async function getMyProfile(role: ProfileRole): Promise<UserProfile> {
  assertRole(role)
  const body = await request<UserProfile>('/profile/me')
  if (!body.data) throw new Error('Profile data was missing from the response.')
  return body.data
}

// The edit form sends values keyed by label. The backend expects fullName and phone.
export async function updateMyProfile(
  role: ProfileRole,
  updatedFields: Record<string, string>
): Promise<UserProfile> {
  assertRole(role)
  const payload: Record<string, string> = {}
  if (updatedFields['Full Name'] !== undefined) payload.fullName = updatedFields['Full Name']
  if (updatedFields['Phone Number'] !== undefined) payload.phone = updatedFields['Phone Number']

  const body = await request<UserProfile>('/profile/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  if (!body.data) throw new Error('Profile data was missing from the response.')
  return body.data
}

// Never throws: returns { success, message } so the page can show the server's message
export async function changeMyPassword(
  role: ProfileRole,
  payload: { currentPassword: string; newPassword: string }
): Promise<{ success: boolean; message: string }> {
  try {
    assertRole(role)
    const body = await request('/profile/change-password', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    return { success: true, message: body.message || 'Password changed successfully' }
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : 'Could not change password.' }
  }
}
