// Who can receive/target an announcement
export type TargetAudience = 'all-schools' | 'school-wide' | 'class-level' | 'specific-entities';

// Priority/urgency shown as colored badges in your Figma designs
export type AnnouncementPriority = 'info' | 'normal' | 'update' | 'urgent' | 'warning' | 'critical' | 'emergency' | 'feature';

// Draft / Published / Archived — matches Compose/Sent/Archive tabs in image 2
export type AnnouncementStatus = 'draft' | 'published' | 'archived';

// A file attached to an announcement (e.g. gala_itinerary_v2.pdf from image 3)
export interface AnnouncementAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSizeKb: number;
}

// Tracks how many of each role group have viewed it (image 3's "Reach Analytics")
export interface ReachAnalytics {
  parentsPercent?: number;
  facultyPercent?: number;
  alumniPercent?: number;
  totalViews: number;
}

// The core Announcement object
export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  targetAudience: TargetAudience;
  status: AnnouncementStatus;
  postedBy: {
    id: string;
    name: string;
    role: 'super-admin' | 'school-admin' | 'teacher';
    department?: string; // e.g. "INFRASTRUCTURE DEPT." from image 5
  };
  source?: string;           // e.g. "Regional Cluster A", "System Core" — image 1's platform alerts
  publishDate: string;   // ISO date string, e.g. "2026-07-23T09:00:00Z"
  createdAt: string;
  updatedAt: string;
  attachments: AnnouncementAttachment[];
  reachAnalytics?: ReachAnalytics;
  requireReadConfirmation: boolean; // toggle seen in image 4
}

// Shape of the form data when creating/editing (image 2 and image 4 forms)
export interface CreateAnnouncementInput {
  title: string;
  content: string;
  priority: AnnouncementPriority;
  targetAudience: TargetAudience;
  publishDate?: string;
  attachments?: File[];
  requireReadConfirmation: boolean;
  distributionTags?: string[];    //"Global Network" for Super Admin broadcasts
}