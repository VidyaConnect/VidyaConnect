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
  {
    id: '3',
    title: 'Database Sync Failure: Regional Cluster A',
    content: 'The synchronization process between the main server and the regional cluster in Southeast Asia has stalled. Data consistency is currently at risk for approximately 42 institutions.',
    priority: 'critical',
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
    priority: 'warning',
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
    priority: 'info',
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
    priority: 'critical',
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