import type {
  Announcement,
  AnnouncementPriority,
  TargetAudience,
} from '@/features/announcements/types/announcement';

export type AnnouncementRole = 'admin' | 'school-admin';

export type Template = {
  name: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
};

export type Audience = {
  value: TargetAudience;
  label: string;
  hint: string;
};

export type RoleConfig = {
  /** Where "New Announcement" goes */
  composeHref: string;
  /** Where "View announcements" / "Cancel" go */
  listHref: string;
  /** Header text on the list page */
  listSubtitle: (count: number) => string;
  listSubtitleEmpty: string;
  /** Empty state paragraph */
  emptyText: string;
  /** Subtitle on the create form */
  formSubtitle: string;
  audiences: Audience[];
  templates: Template[];
  /** Which announcements this role sees in its list */
  filterList: (a: Announcement) => boolean;
  /** Show the announcement source on each card */
  showSource: boolean;
  /** Show "All / From platform / My school" tabs and a Platform badge */
  showOriginTabs: boolean;
};

const plural = (n: number) => `${n} announcement${n > 1 ? 's' : ''}`;

export const ROLE_CONFIG: Record<AnnouncementRole, RoleConfig> = {
  admin: {
    composeHref: '/announcements/admin/create',
    listHref: '/announcements/admin',
    listSubtitle: (n) => `${plural(n)} shared across the platform`,
    listSubtitleEmpty: 'Share platform updates and urgent notices',
    emptyText:
      'Share platform updates or urgent notices with schools. Your first announcement will show up here.',
    formSubtitle: 'Draft and broadcast a message to schools on the platform.',
    audiences: [
      { value: 'all-schools', label: 'All Schools', hint: 'Every school on the platform' },
      { value: 'selected-schools', label: 'Selected Schools', hint: 'Chosen schools only' },
    ],
    templates: [
      {
        name: 'Maintenance notice',
        title: 'Scheduled platform maintenance',
        content:
          'The platform will be unavailable for a short period for maintenance. Please plan accordingly.',
        priority: 'normal',
      },
      {
        name: 'Feature update',
        title: 'New features are now available',
        content:
          'We have released new features. Check the latest updates in your portal.',
        priority: 'normal',
      },
      {
        name: 'Platform outage',
        title: 'Platform temporarily unavailable',
        content:
          'We are aware of an issue affecting the platform and are working to fix it. We will share updates here.',
        priority: 'emergency',
      },
    ],
    filterList: (a) => a.postedBy?.role === 'admin',
    showSource: true,
    showOriginTabs: false,
  },

  'school-admin': {
    composeHref: '/announcements/school-admin/create',
    listHref: '/announcements/school-admin',
    listSubtitle: (n) => `${plural(n)} from the platform and your school`,
    listSubtitleEmpty: 'Share school updates and urgent notices',
    emptyText:
      'Share news, updates or urgent notices with your school community. Your first announcement will show up here.',
    formSubtitle: 'Draft and broadcast a message to your school community.',
    audiences: [
      { value: 'school-wide', label: 'School-Wide', hint: 'Everyone in your school' },
      { value: 'class-level', label: 'Class-Level', hint: 'Selected classes only' },
      { value: 'specific-entities', label: 'Specific Entities', hint: 'Chosen people or groups' },
    ],
    templates: [
      {
        name: 'Holiday notice',
        title: 'School closed for the holiday',
        content:
          'Please note that the school will remain closed on the date mentioned. Classes will resume on the next working day.',
        priority: 'normal',
      },
      {
        name: 'Event reminder',
        title: 'Upcoming school event',
        content:
          'We are excited to invite everyone to our upcoming event. Please check the schedule and be on time.',
        priority: 'normal',
      },
      {
        name: 'Emergency closure',
        title: 'School closed tomorrow',
        content:
          'Due to unforeseen circumstances the school will be closed tomorrow. Please keep your children at home and watch for further updates.',
        priority: 'emergency',
      },
    ],
    filterList: () => true,
    showSource: false,
    showOriginTabs: true,
  },
};