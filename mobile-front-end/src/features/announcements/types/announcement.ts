import { UserRole } from '../../../types';

export type AnnouncementTag = 'general' | 'important' | 'draft';

export type TargetAudience = 'all-schools' | 'school-wide' | 'class-level' | 'specific-entities';

export interface AnnouncementAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSizeKb: number;
}

export type AnnouncementStatus = 'draft' | 'published';

export interface AnnouncementViewRecord {
  userId: string;
  role: UserRole;
  viewedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  tag: AnnouncementTag;
  targetAudience: TargetAudience;
  postedBy: {
    id: string;
    name: string;
    role: UserRole;
    department?: string;
  };
  source?: string;
  selectedClass?: string;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  attachments: AnnouncementAttachment[];
  totalViews: number;
  requireParentConfirmation: boolean;
  status: AnnouncementStatus;
  viewRecords: AnnouncementViewRecord[];
}

// Shape of the form when composing (Post Announcement screen)
export interface CreateAnnouncementInput {
  title: string;
  content: string;
  targetAudience: TargetAudience;
  requireParentConfirmation: boolean;
  schedulePublication?: string;
  selectedClass?: string;
  tag?: 'general' | 'important'; // required to Publish; ignored/overridden when saved as Draft
}

// Only these 2 roles are allowed to compose announcements
export const CAN_POST_ANNOUNCEMENTS: UserRole[] = ['super-admin', 'school-admin'];
