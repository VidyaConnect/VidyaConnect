// Who can receive/target an announcement
export type TargetAudience = 'all-schools' | 'school-wide' | 'class-level' | 'specific-entities';

// Announcement classification tags
export type AnnouncementTag = 'general' | 'important' | 'draft';

// Draft / Published / Archived — matches Compose/Sent/Archive tabs
export type AnnouncementStatus = 'draft' | 'published' | 'archived';

// A file attached to an announcement
export interface AnnouncementAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSizeKb: number;
}

// Tracks how many of each role group have viewed it
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
  tag: AnnouncementTag;
  targetAudience: TargetAudience;
  status: AnnouncementStatus;
  postedBy: {
    id: string;
    name: string;
    role: 'super-admin' | 'school-admin' | 'teacher';
    department?: string;
  };
  source?: string;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  attachments: AnnouncementAttachment[];
  reachAnalytics?: ReachAnalytics;
  requireReadConfirmation: boolean;
}

// Shape of the form data when creating/editing
export interface CreateAnnouncementInput {
  title: string;
  content: string;
  tag?: 'general' | 'important'; // required to Publish; not required to Save Draft
  targetAudience: TargetAudience;
  publishDate?: string;
  attachments?: File[];
  requireReadConfirmation: boolean;
  distributionTags?: string[];
}
