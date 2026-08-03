import { UserRole } from '../../../types';
import { Announcement, AnnouncementViewRecord, CreateAnnouncementInput } from '../types/announcement';

// ---- MOCK DATA ----
// Remove this once the real backend endpoint is ready
let mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Database Sync Failure: Regional Cluster A',
    content: 'The synchronization process between the main server and the regional cluster in Southeast Asia has stalled.',
    tag: 'important',
    targetAudience: 'all-schools',
    postedBy: { id: 'u1', name: 'System Admin', role: 'super-admin' },
    source: 'Regional Cluster A',
    publishDate: '2026-07-29T09:58:00Z',
    createdAt: '2026-07-29T09:58:00Z',
    updatedAt: '2026-07-29T09:58:00Z',
    attachments: [],
    totalViews: 12,
    requireParentConfirmation: false,
    status: 'published',
    viewRecords: [],
  },
  {
    id: '2',
    title: 'SSL Certificate Expiry',
    content: "Primary domain SSL certificate for St. Mary's Secondary will expire in 48 hours.",
    priority: 'warning',
    targetAudience: 'specific-entities',
    postedBy: { id: 'u1', name: 'System Admin', role: 'super-admin' },
    source: "St. Mary's Secondary",
    publishDate: '2026-07-29T09:45:00Z',
    createdAt: '2026-07-29T09:45:00Z',
    updatedAt: '2026-07-29T09:45:00Z',
    attachments: [],
    totalViews: 8,
    requireParentConfirmation: false,
    status: 'published',
    viewRecords: [],
  },
  {
    id: '3',
    title: 'Routine Update Complete',
    content: 'Module 4.2 Security Patch deployed successfully across all production environments.',
    tag: 'general',
    targetAudience: 'all-schools',
    postedBy: { id: 'u1', name: 'System Admin', role: 'super-admin' },
    source: 'System Core',
    publishDate: '2026-07-29T08:00:00Z',
    createdAt: '2026-07-29T08:00:00Z',
    updatedAt: '2026-07-29T08:00:00Z',
    attachments: [],
    totalViews: 20,
    requireParentConfirmation: false,
    status: 'published',
    viewRecords: [],
  },
  {
    id: '4',
    title: 'Unauthorized Access Attempt',
    content: 'Multiple failed login attempts from an unrecognized IP in Eastern Europe detected on Admin Console.',
    tag: 'important',
    targetAudience: 'all-schools',
    postedBy: { id: 'u1', name: 'System Admin', role: 'super-admin' },
    source: 'Security Gateway',
    publishDate: '2026-07-29T07:00:00Z',
    createdAt: '2026-07-29T07:00:00Z',
    updatedAt: '2026-07-29T07:00:00Z',
    attachments: [],
    totalViews: 5,
    requireParentConfirmation: false,
    status: 'published',
    viewRecords: [],
  },
  {
    id: '5',
    title: 'Annual Sports Day Update',
    content: 'This year\'s Sports Day will be held on August 15th. Please ensure all students have signed consent forms.',
    priority: 'normal',
    targetAudience: 'school-wide',
    postedBy: { id: 'u2', name: 'School Admin', role: 'school-admin' },
    publishDate: '2026-07-28T10:00:00Z',
    createdAt: '2026-07-28T10:00:00Z',
    updatedAt: '2026-07-28T10:00:00Z',
    attachments: [],
    totalViews: 45,
    requireParentConfirmation: true,
    status: 'published',
    viewRecords: [],
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isPublished(announcement: Announcement): boolean {
  return announcement.status === 'published';
}

function buildAnnouncement(
  input: CreateAnnouncementInput,
  postedBy: { id: string; name: string; role: UserRole },
  status: 'draft' | 'published'
): Announcement {
  const id = String(Date.now());
  const now = new Date().toISOString();
  return {
    id,
    title: input.title,
    content: input.content,
    tag: status === 'draft' ? 'draft' : (input.tag ?? 'general'),
    targetAudience: input.targetAudience,
    postedBy,
    source: input.selectedClass,
    selectedClass: input.selectedClass,
    publishDate: input.schedulePublication || now,
    createdAt: now,
    updatedAt: now,
    attachments: [],
    totalViews: 0,
    requireParentConfirmation: input.requireParentConfirmation,
    status,
    viewRecords: [],
  };
}

/**
 * Role-based visibility rules:
 * - Super Admin: sees only announcements THEY posted (including drafts)
 * - School Admin: sees announcements from Super Admin (incoming published only)
 * - Teacher / Parent / Student: sees published announcements from Super Admin AND School Admin
 */
export async function getAnnouncements(role: UserRole): Promise<Announcement[]> {
  await delay(400);

  if (role === 'super-admin') {
    return mockAnnouncements.filter((a) => a.postedBy.role === 'super-admin');
  }

  if (role === 'school-admin') {
    return mockAnnouncements.filter(
      (a) => a.postedBy.role === 'super-admin' && isPublished(a)
    );
  }

  // teacher, parent, student — published only
  return mockAnnouncements.filter(
    (a) =>
      isPublished(a) &&
      (a.postedBy.role === 'super-admin' || a.postedBy.role === 'school-admin')
  );
}

export async function getAnnouncementById(id: string): Promise<Announcement | undefined> {
  await delay(300);
  return mockAnnouncements.find((a) => a.id === id);
}

export async function createAnnouncement(
  input: CreateAnnouncementInput,
  postedBy: { id: string; name: string; role: UserRole }
): Promise<Announcement> {
  await delay(500);
  const newAnnouncement = buildAnnouncement(input, postedBy, 'published');
  mockAnnouncements = [newAnnouncement, ...mockAnnouncements];
  return newAnnouncement;
}

export async function saveDraftAnnouncement(
  input: CreateAnnouncementInput,
  postedBy: { id: string; name: string; role: UserRole }
): Promise<Announcement> {
  await delay(400);
  const draft = buildAnnouncement(input, postedBy, 'draft');
  mockAnnouncements = [draft, ...mockAnnouncements];
  return draft;
}

/** @deprecated Prefer markAsViewedByUser for per-viewer tracking */
export async function markAsViewed(id: string): Promise<void> {
  await delay(200);
  const announcement = mockAnnouncements.find((a) => a.id === id);
  if (announcement) {
    announcement.totalViews += 1;
  }
}

export async function markAsViewedByUser(
  announcementId: string,
  viewer: { id: string; role: UserRole }
): Promise<void> {
  await delay(200);
  const announcement = mockAnnouncements.find((a) => a.id === announcementId);
  if (!announcement) return;

  const alreadyViewed = announcement.viewRecords.some((r) => r.userId === viewer.id);
  if (!alreadyViewed) {
    const record: AnnouncementViewRecord = {
      userId: viewer.id,
      role: viewer.role,
      viewedAt: new Date().toISOString(),
    };
    announcement.viewRecords.push(record);
    announcement.totalViews += 1;
  }
}

export function hasUserViewed(announcement: Announcement, userId: string): boolean {
  return announcement.viewRecords.some((r) => r.userId === userId);
}
