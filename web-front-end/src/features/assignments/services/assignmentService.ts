import type { Assignment, AssignmentClass, ProgressStatus } from '../types/assignment'
export type { Assignment, AssignmentClass, ProgressStatus } from '../types/assignment'

const FILE_BASE = process.env.NEXT_PUBLIC_FILE_API_URL || 'http://localhost:3006'
const authHeaders = (): HeadersInit => {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' }
  const token = localStorage.getItem('accessToken')
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  // Assignment endpoints go through the same-origin Next.js rewrite so the
  // browser doesn't accidentally request /api/* from the service's port.
  const response = await fetch(path, { ...init, headers: { ...authHeaders(), ...init.headers }, cache: 'no-store' })
  if (!response.ok) {
    let message = response.statusText
    try { const body = await response.json(); message = body.error || body.message || message } catch { /* use status text */ }
    throw new Error(message || `Request failed (${response.status})`)
  }
  const body = await response.json()
  return body.data as T
}

export const assignmentService = {
  getClasses: () => request<AssignmentClass[]>('/api/assignment-classes'),
  list: () => request<Assignment[]>('/api/assignments'),
  create: (payload: { classId: string; title: string; subject: string; description: string; publishAt: string; dueAt: string; attachments: { fileId: string; fileName: string }[] }) => request<Assignment>('/api/assignments', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: string, payload: Partial<{ title: string; subject: string; description: string; publishAt: string; dueAt: string; attachments: { fileId: string; fileName: string }[] }>) => request<Assignment>(`/api/assignments/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  removeDraft: (id: string) => request<{ id: string; deleted: boolean }>(`/api/assignments/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  publish: (id: string) => request<Assignment>(`/api/assignments/${id}/publish`, { method: 'POST' }),
  updateStatus: (id: string, studentId: string, payload: { status: ProgressStatus; marks?: number | null; feedback?: string | null }) => request<Assignment>(`/api/assignments/${encodeURIComponent(id)}/students/${encodeURIComponent(studentId)}/status`, { method: 'PATCH', body: JSON.stringify(payload) }),
  listFiles: async () => {
    const response = await fetch(`${FILE_BASE}/files/`, { headers: authHeaders(), cache: 'no-store' })
    if (!response.ok) throw new Error('Could not load file storage')
    const body = await response.json()
    return body.data as { id: string; originalName: string; purpose?: string; createdAt: string }[]
  },
  getFileDownloadUrl: async (id: string) => {
    const response = await fetch(`${FILE_BASE}/files/${id}/download-url`, { headers: authHeaders(), cache: 'no-store' })
    if (!response.ok) throw new Error('Could not open file')
    const body = await response.json()
    return body.data.downloadUrl as string
  },
}
