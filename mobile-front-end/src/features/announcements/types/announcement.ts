import { UserRole } from '../../../types';

export type AnnouncementPriority =
  | 'info'
  | 'normal'
  | 'update'
  | 'urgent'
  | 'warning'
  | 'critical'
  | 'emergency'
  | 'feature';

export type TargetAudience = 'all-schools' | 'school-wide' | 'class-level' | 'specific-entities';

export interface AnnouncementAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSizeKb: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  targetAudience: TargetAudience;
  postedBy: {
    id: string;
    name: string;
    role: UserRole;
    department?: string;
  };
  source?: string;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  attachments: AnnouncementAttachment[];
  totalViews: number;
  requireParentConfirmation: boolean;
}

// Shape of the form when composing (image 2)
export interface CreateAnnouncementInput {
  title: string;
  content: string;
  targetAudience: TargetAudience;
  requireParentConfirmation: boolean;
  schedulePublication?: string; // ISO date, optional
}

// Only these 2 roles are allowed to compose announcements
export const CAN_POST_ANNOUNCEMENTS: UserRole[] = ['super-admin', 'school-admin'];
