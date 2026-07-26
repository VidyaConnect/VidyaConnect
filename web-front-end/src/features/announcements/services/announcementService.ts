import { Announcement, CreateAnnouncementInput } from '../types/announcement';

// ---- MOCK DATA ----
// Remove this once the real backend endpoint is ready (Sehajinie's API)
let mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Annual Spring Prize Giving 2026',
    content: 'We are thrilled to announce the details for our Annual Spring Gala...',
    priority: 'info',
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
    title: 'School-wide Network Upgrade & Scheduled Downtime',
    content: 'Attention all staff. The IT department will be performing a major core switch replacement...',
    priority: 'critical',
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
];

// Simulates network delay so loading states behave realistically
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// GET all announcements (used by Teacher feed, School Admin list)
export async function getAnnouncements(): Promise<Announcement[]> {
  await delay(500);
  return mockAnnouncements;
}

// GET a single announcement by id (used by School Admin detail view)
export async function getAnnouncementById(id: string): Promise<Announcement | undefined> {
  await delay(300);
  return mockAnnouncements.find((a) => a.id === id);
}

// CREATE a new announcement (used by School Admin / Super Admin forms)
export async function createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
  await delay(500);
  const newAnnouncement: Announcement = {
    id: String(mockAnnouncements.length + 1),
    title: input.title,
    content: input.content,
    priority: input.priority,
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

// Marks an announcement as viewed (used by Teacher feed to bump view count)
export async function markAsViewed(id: string): Promise<void> {
  await delay(200);
  const announcement = mockAnnouncements.find((a) => a.id === id);
  if (announcement && announcement.reachAnalytics) {
    announcement.reachAnalytics.totalViews += 1;
  }
}