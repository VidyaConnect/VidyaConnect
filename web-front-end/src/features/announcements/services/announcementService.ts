import { Announcement, CreateAnnouncementInput } from '../types/announcement';

// ---- MOCK DATA ----
let mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Annual Spring Gala 2026',
    content: 'We are thrilled to announce the details for our Annual Spring Gala...',
    tag: 'general',
    targetAudience: 'school-wide',
    status: 'published',
    postedBy: { id: 'u1', name: 'Mark Kessler', role: 'school-admin' },
    publishDate: '2026-07-20T09:00:00Z',
    createdAt: '2026-07-20T09:00:00Z',
    updatedAt: '2026-07-20T09:00:00Z',
    attachments: [],
    reachAnalytics: { parentsPercent: 92, facultyPercent: 85, alumniPercent: 45, totalViews: 422 },
    requireReadConfirmation: false,
  },
  {
    id: '2',
    title: 'Campus-wide Network Upgrade & Scheduled Downtime',
    content: 'Attention all staff. The IT department will be performing a major core switch replacement...',
    tag: 'important',
    targetAudience: 'all-schools',
    status: 'published',
    postedBy: { id: 'u2', name: 'Super Admin', role: 'super-admin', department: 'INFRASTRUCTURE DEPT.' },
    publishDate: '2026-07-22T18:00:00Z',
    createdAt: '2026-07-22T18:00:00Z',
    updatedAt: '2026-07-22T18:00:00Z',
    attachments: [],
    reachAnalytics: { totalViews: 1402 },
    requireReadConfirmation: false,
  },
  {
    id: '3',
    title: 'Database Sync Failure: Regional Cluster A',
    content: 'The synchronization process between the main server and the regional cluster in Southeast Asia has stalled. Data consistency is currently at risk for approximately 42 institutions.',
    tag: 'important',
    targetAudience: 'all-schools',
    status: 'published',
    postedBy: { id: 'u3', name: 'System Monitor', role: 'super-admin' },
    source: 'Regional Cluster A',
    publishDate: '2026-07-27T09:58:00Z',
    createdAt: '2026-07-27T09:58:00Z',
    updatedAt: '2026-07-27T09:58:00Z',
    attachments: [],
    reachAnalytics: { totalViews: 0 },
    requireReadConfirmation: false,
  },
  {
    id: '4',
    title: 'SSL Certificate Expiry',
    content: "Primary domain SSL certificate for St. Mary's Secondary will expire in 48 hours. Auto-renewal failed due to a CAA record mismatch.",
    tag: 'important',
    targetAudience: 'specific-entities',
    status: 'published',
    postedBy: { id: 'u3', name: 'System Monitor', role: 'super-admin' },
    source: "St. Mary's Secondary",
    publishDate: '2026-07-27T09:45:00Z',
    createdAt: '2026-07-27T09:45:00Z',
    updatedAt: '2026-07-27T09:45:00Z',
    attachments: [],
    reachAnalytics: { totalViews: 0 },
    requireReadConfirmation: false,
  },
  {
    id: '5',
    title: 'Routine Update Complete',
    content: 'Module 4.2 Security Patch deployed successfully across all production environments. Performance benchmarks show a 5% improvement in query resolution.',
    tag: 'general',
    targetAudience: 'all-schools',
    status: 'published',
    postedBy: { id: 'u3', name: 'System Monitor', role: 'super-admin' },
    source: 'System Core',
    publishDate: '2026-07-27T09:00:00Z',
    createdAt: '2026-07-27T09:00:00Z',
    updatedAt: '2026-07-27T09:00:00Z',
    attachments: [],
    reachAnalytics: { totalViews: 0 },
    requireReadConfirmation: false,
  },
  {
    id: '6',
    title: 'Unauthorized Access Attempt',
    content: 'Multiple failed login attempts from an unrecognized IP in Eastern Europe detected on Admin Console. IP has been temporarily blacklisted.',
    tag: 'important',
    targetAudience: 'all-schools',
    status: 'published',
    postedBy: { id: 'u3', name: 'System Monitor', role: 'super-admin' },
    source: 'Security Gateway',
    publishDate: '2026-07-27T08:00:00Z',
    createdAt: '2026-07-27T08:00:00Z',
    updatedAt: '2026-07-27T08:00:00Z',
    attachments: [],
    reachAnalytics: { totalViews: 0 },
    requireReadConfirmation: false,
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAnnouncements(): Promise<Announcement[]> {
  await delay(500);
  return mockAnnouncements.filter((a) => a.status !== 'draft');
}

export async function getAnnouncementById(id: string): Promise<Announcement | undefined> {
  await delay(300);
  return mockAnnouncements.find((a) => a.id === id);
}

export async function createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
  await delay(500);
  const newAnnouncement: Announcement = {
    id: String(mockAnnouncements.length + 1),
    title: input.title,
    content: input.content,
    tag: input.tag ?? 'general',
    targetAudience: input.targetAudience,
    status: 'published',
    postedBy: { id: 'current-user', name: 'Current User', role: 'school-admin' },
    publishDate: input.publishDate || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attachments: [],
    requireReadConfirmation: input.requireReadConfirmation,
  };
  mockAnnouncements = [newAnnouncement, ...mockAnnouncements];
  return newAnnouncement;
}

export async function saveDraftAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
  await delay(400);
  const draft: Announcement = {
    id: String(mockAnnouncements.length + 1),
    title: input.title,
    content: input.content,
    tag: 'draft',
    targetAudience: input.targetAudience,
    status: 'draft',
    postedBy: { id: 'current-user', name: 'Current User', role: 'school-admin' },
    publishDate: input.publishDate || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attachments: [],
    requireReadConfirmation: input.requireReadConfirmation,
  };
  mockAnnouncements = [draft, ...mockAnnouncements];
  return draft;
}

export async function markAsViewed(id: string): Promise<void> {
  await delay(200);
  const announcement = mockAnnouncements.find((a) => a.id === id);
  if (announcement && announcement.reachAnalytics) {
    announcement.reachAnalytics.totalViews += 1;
  }
}
