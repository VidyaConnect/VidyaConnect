import { fetchWithAuth } from '@/services/fetchWithAuth'
import type { ConsentForm } from '../types/consent'

const API_URL = '/api/consent-forms'

type ApiEnvelope<T> = { success: boolean; data: T; message?: string }
export type ConsentResponse = {
  id: string
  formId: string
  studentId: string
  status: 'ACCEPTED' | 'DECLINED' | null
  remarks: string | null
  respondedAt: string | null
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetchWithAuth(url, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    })
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unable to reach consent service.')
  }

  const raw = await response.text()
  let payload: ApiEnvelope<T> | null = null
  try {
    payload = raw ? JSON.parse(raw) as ApiEnvelope<T> : null
  } catch {
    payload = null
  }
  if (!response.ok) throw new Error(payload?.message || raw || 'Consent request failed.')
  if (!payload?.success) throw new Error(payload?.message || 'Unexpected consent service response.')
  return payload.data
}

export function getConsentForms() {
  return request<ConsentForm[]>(API_URL)
}

export function getConsentForm(id: string) {
  return request<ConsentForm>(`${API_URL}/${id}`)
}

export function createConsentForm(input: {
  title: string
  description: string
  audience: string
  instructions?: string
  deadline: string
  scope: 'CLASS' | 'SCHOOL'
}) {
  return request<ConsentForm>(API_URL, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateConsentForm(id: string, input: Partial<{
  title: string
  description: string
  audience: string
  instructions: string
  deadline: string
}>) {
  return request<ConsentForm>(`${API_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export function publishConsentForm(id: string) {
  return request<ConsentForm>(`${API_URL}/${id}/publish`, { method: 'POST' })
}

export function closeConsentForm(id: string) {
  return request<ConsentForm>(`${API_URL}/${id}/close`, { method: 'POST' })
}

export function getConsentResponses(id: string) {
  return request<ConsentResponse[]>(`${API_URL}/${id}/responses`)
}
