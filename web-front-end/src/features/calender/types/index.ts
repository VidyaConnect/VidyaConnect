export type CalendarRole = 'ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'PARENT';

export type EventType =
  | 'holiday'
  | 'exam'
  | 'meeting'
  | 'event'
  | 'deadline'
  | 'trip'
  | 'maintenance'
  | 'update'
  | 'training';

export type EventScope = 'PLATFORM' | 'SCHOOL' | 'CLASS';

export interface CalendarEvent {
  id: string;
  schoolId?: string | null;
  title: string;
  description?: string | null;
  type: EventType;
  scope?: EventScope;
  classIds?: string[];
  start: string; // ISO string
  end: string; // ISO string
  allDay: boolean;
  location?: string | null;
  createdBy?: string;
  createdByRole?: CalendarRole;
}

export interface EventInput {
  title: string;
  description?: string;
  type: EventType;
  start: string;
  end: string;
  allDay: boolean;
  location?: string;
  classIds?: string[];
  confirmOverlap?: boolean;
}

// Body of the 409 response
export interface OverlapResponse {
  message: string;
  overlaps: CalendarEvent[];
}

export interface CalendarPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export type CalendarViewMode = 'month' | 'week';