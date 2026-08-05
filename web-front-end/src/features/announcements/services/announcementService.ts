import { Announcement, AnnouncementPriority, CreateAnnouncementInput } from '../types/announcement';

const API_URL = 'http://localhost:3002/api/announcements';

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type BackendAnnouncement = {
  id: string;
  title: string;
  content: string;
  type: 'SYSTEM' | 'SCHOOL';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  priority: 'NORMAL' | 'URGENT' | 'EMERGENCY';
  schoolId: string | null;
  createdByUserId: string;
  attachmentId: string | null;
  requiresConfirmation: boolean;
  isRetracted: boolean;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function mapPriorityToFrontend(priority: BackendAnnouncement['priority']): AnnouncementPriority {
  if (priority === 'EMERGENCY') return 'emergency';
  if (priority === 'URGENT') return 'urgent';
  return 'normal';
}

function mapPriorityToBackend(priority: AnnouncementPriority): 'NORMAL' | 'URGENT' | 'EMERGENCY' {
  if (priority === 'critical' || priority === 'emergency') return 'EMERGENCY';
  if (priority === 'warning' || priority === 'urgent') return 'URGENT';
  return 'NORMAL';
}

function mapToFrontend(item: BackendAnnouncement): Announcement {
  return {
    id: item.id,
    title: item.title,
    content: item.content,
    priority: mapPriorityToFrontend(item.priority),
    targetAudience: item.type === 'SYSTEM' ? 'all-schools' : 'school-wide',
    status: item.status.toLowerCase() as 'draft' | 'published' | 'archived',
    postedBy: {
      id: item.createdByUserId,
      name: item.createdByUserId,
      role: item.type === 'SYSTEM' ? 'super-admin' : 'school-admin'
    },
    source: item.type === 'SYSTEM' ? 'Platform Broadcast' : undefined,
    publishDate: item.publishedAt || item.createdAt,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    attachments: item.attachmentId
      ? [
          {
            id: item.attachmentId,
            fileName: 'Attachment',
            fileUrl: '#',
            fileSizeKb: 0
          }
        ]
      : [],
    reachAnalytics: {
      totalViews: 0
    },
    requireReadConfirmation: item.requiresConfirmation
  };
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, init);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network error';
    throw new Error('Network error: Could not reach announcement service. ' + message);
  }

  const rawText = await response.text();
  let payload: ApiEnvelope<T> | null = null;

  try {
    payload = rawText ? (JSON.parse(rawText) as ApiEnvelope<T>) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || rawText || 'Request failed';
    throw new Error(message);
  }

  if (!payload || payload.success !== true) {
    throw new Error(payload?.message || 'Unexpected API response');
  }

  return payload.data;
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const data = await request<BackendAnnouncement[]>(API_URL, { method: 'GET' });
  return data.map(mapToFrontend);
}

export async function getAnnouncementById(id: string): Promise<Announcement> {
  const data = await request<BackendAnnouncement>(`${API_URL}/${id}`, { method: 'GET' });
  return mapToFrontend(data);
}

export async function createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
  const payload = {
    title: input.title,
    content: input.content,
    type: input.targetAudience === 'all-schools' ? 'SYSTEM' : 'SCHOOL',
    status: 'PUBLISHED',
    priority: mapPriorityToBackend(input.priority),
    requiresConfirmation: input.requireReadConfirmation
  };

  const data = await request<BackendAnnouncement>(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return mapToFrontend(data);
}

export async function updateAnnouncement(
  id: string,
  input: Partial<CreateAnnouncementInput>
): Promise<Announcement> {
  const payload: Record<string, unknown> = {};

  if (input.title !== undefined) payload.title = input.title;
  if (input.content !== undefined) payload.content = input.content;
  if (input.priority !== undefined) payload.priority = mapPriorityToBackend(input.priority);
  if (input.targetAudience !== undefined) {
    payload.type = input.targetAudience === 'all-schools' ? 'SYSTEM' : 'SCHOOL';
  }
  if (input.requireReadConfirmation !== undefined) {
    payload.requiresConfirmation = input.requireReadConfirmation;
  }

  const data = await request<BackendAnnouncement>(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return mapToFrontend(data);
}

export async function deleteAnnouncement(id: string): Promise<Announcement> {
  const data = await request<BackendAnnouncement>(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  return mapToFrontend(data);
}