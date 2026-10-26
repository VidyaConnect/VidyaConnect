import { fetchWithAuth } from '@/services/fetchWithAuth'
import type { NotificationResponse } from '../types/notification'

const API_URL = '/api/notifications'

function getErrorMessage(payload: unknown, fallback: string) {
  if (
    payload &&
    typeof payload === 'object' &&
    'message' in payload &&
    typeof payload.message === 'string'
  ) {
    return payload.message
  }
  return fallback
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetchWithAuth(url, init)
  const text = await response.text()
  let payload: { success?: boolean; data?: T; message?: string } | null = null

  try {
    payload = text ? JSON.parse(text) : null
  } catch {
    throw new Error('Notification service returned an invalid response.')
  }

  if (!response.ok || !payload?.success) {
    throw new Error(getErrorMessage(payload, 'Unable to load notifications.'))
  }

  return payload.data as T
}

export function getNotifications() {
  return request<NotificationResponse>(API_URL)
}

export function markNotificationRead(id: string) {
  return request<Notification>(`${API_URL}/${id}/read`, { method: 'PATCH' })
}
