'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Announcement } from '../types/announcement';
import { getAnnouncements } from '../services/announcementService';

type FilterTab = 'all' | 'critical' | 'urgent' | 'info' | 'update';

type BadgeStyle = {
  label: string;
  className: string;
  dot: string;
  borderClass: string;
  icon: 'warning' | 'bell' | 'info' | 'refresh';
};

const BADGE_STYLES: Record<string, BadgeStyle> = {
  critical: {
    label: 'CRITICAL',
    className:
      'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    dot: 'bg-red-500',
    borderClass: 'border-l-red-500',
    icon: 'warning'
  },

  emergency: {
    label: 'CRITICAL',
    className:
      'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    dot: 'bg-red-500',
    borderClass: 'border-l-red-500',
    icon: 'warning'
  },

  urgent: {
    label: 'URGENT',
    className:
      'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    dot: 'bg-amber-500',
    borderClass: 'border-l-amber-500',
    icon: 'bell'
  },

  warning: {
    label: 'WARNING',
    className:
      'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    dot: 'bg-amber-500',
    borderClass: 'border-l-amber-500',
    icon: 'warning'
  },

  info: {
    label: 'INFO',
    className:
      'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
    dot: 'bg-blue-500',
    borderClass: 'border-l-blue-500',
    icon: 'info'
  },

  update: {
    label: 'UPDATE',
    className:
      'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    dot: 'bg-emerald-500',
    borderClass: 'border-l-emerald-500',
    icon: 'refresh'
  },

  normal: {
    label: 'INFO',
    className:
      'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/20',
    dot: 'bg-slate-400',
    borderClass: 'border-l-slate-400',
    icon: 'info'
  }
};

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  const difference = Date.now() - date.getTime();

  if (difference < 0) {
    return 'Scheduled';
  }

  const minutes = Math.floor(difference / (1000 * 60));

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  return formatDate(dateString);
}

function getBadgeStyle(priority?: string) {
  const normalizedPriority = priority?.toLowerCase() || 'normal';

  return BADGE_STYLES[normalizedPriority] || BADGE_STYLES.normal;
}

function getAudienceLabel(announcement: Announcement) {
  const item = announcement as Announcement & {
    audience?: string;
    targetAudience?: string;
  };

  if (item.audience) {
    return item.audience;
  }

  if (item.targetAudience) {
    return item.targetAudience;
  }

  return 'School';
}

function getStatusLabel(announcement: Announcement) {
  const item = announcement as Announcement & {
    status?: string;
  };

  if (!item.status) {
    return 'Published';
  }

  return (
    item.status.charAt(0).toUpperCase() +
    item.status.slice(1).toLowerCase()
  );
}

function getViews(announcement: Announcement) {
  return announcement.reachAnalytics?.totalViews ?? 0;
}

function Icon({
  name,
  className = 'h-5 w-5'
}: {
  name:
    | 'warning'
    | 'bell'
    | 'info'
    | 'refresh'
    | 'search'
    | 'megaphone'
    | 'eye'
    | 'calendar'
    | 'user'
    | 'users'
    | 'check'
    | 'arrow';
  className?: string;
}) {
  if (name === 'warning') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v4m0 4h.01M10.3 3.84 2.58 17a2 2 0 0 0 1.73 3h15.38a2 2 0 0 0 1.73-3L13.7 3.84a2 2 0 0 0-3.4 0Z"
        />
      </svg>
    );
  }

  if (name === 'bell') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 17H9m9-2V11a6 6 0 1 0-12 0v4l-2 2h16l-2-2Zm-4 5a2 2 0 0 1-4 0"
        />
      </svg>
    );
  }

  if (name === 'info') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="9" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 10v6m0-9h.01"
        />
      </svg>
    );
  }

  if (name === 'refresh') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4"
        />
      </svg>
    );
  }

  if (name === 'search') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m20 20-4-4"
        />
      </svg>
    );
  }

  if (name === 'megaphone') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m3 11 17-6v14L3 13v-2Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 14.5 7.5 20h3L9 15.5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 9a3 3 0 0 1 0 6"
        />
      </svg>
    );
  }

  if (name === 'eye') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }

  if (name === 'calendar') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path
          strokeLinecap="round"
          d="M16 3v4M8 3v4M3 10h18"
        />
      </svg>
    );
  }

  if (name === 'user') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="8" r="3.5" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 20a7 7 0 0 1 14 0"
        />
      </svg>
    );
  }

  if (name === 'users') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          d="M16 20a5 5 0 0 0-10 0"
        />
        <circle cx="11" cy="9" r="3" />
        <path
          strokeLinecap="round"
          d="M18 7a3 3 0 0 1 0 6M19 20a5 5 0 0 0-3-4.58"
        />
      </svg>
    );
  }

  if (name === 'check') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m5 12 4 4L19 6"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 12 14-7v14L5 12Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12H3"
      />
    </svg>
  );
}

export default function TeacherAnnouncementFeed() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAnnouncements() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await getAnnouncements();

        if (!isMounted) {
          return;
        }

        /*
         * The announcement service already returns announcements
         * according to the current backend/API implementation.
         *
         * Do not modify or create announcement records here.
         * This page is only responsible for displaying them.
         */
        setAnnouncements(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Failed to load announcements.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAnnouncements();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAnnouncements = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return announcements.filter((announcement) => {
      const matchesSearch =
        !query ||
        announcement.title?.toLowerCase().includes(query) ||
        announcement.content?.toLowerCase().includes(query) ||
        announcement.postedBy?.name?.toLowerCase().includes(query);

      if (!matchesSearch) {
        return false;
      }

      if (filter === 'all') {
        return true;
      }

      const priority = announcement.priority?.toLowerCase();

      if (filter === 'critical') {
        return priority === 'critical' || priority === 'emergency';
      }

      if (filter === 'urgent') {
        return priority === 'urgent' || priority === 'warning';
      }

      return priority === filter;
    });
  }, [announcements, filter, searchQuery]);

  const criticalCount = useMemo(
    () =>
      announcements.filter((announcement) => {
        const priority = announcement.priority?.toLowerCase();

        return priority === 'critical' || priority === 'emergency';
      }).length,
    [announcements]
  );

  const urgentCount = useMemo(
    () =>
      announcements.filter((announcement) => {
        const priority = announcement.priority?.toLowerCase();

        return priority === 'urgent' || priority === 'warning';
      }).length,
    [announcements]
  );

  const unreadLikeCount = useMemo(() => {
    /*
     * This is intentionally a frontend display count.
     *
     * Because the current Announcement type does not provide a
     * per-user read/unread field, we do not pretend this is a
     * backend read status.
     *
     * It represents the announcements currently available to
     * the teacher.
     */
    return announcements.length;
  }, [announcements]);

  const totalViews = useMemo(
    () =>
      announcements.reduce(
        (total, announcement) => total + getViews(announcement),
        0
      ),
    [announcements]
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-360 space-y-7">
        <div className="animate-pulse overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8">
          <div className="h-5 w-40 rounded bg-white/10" />
          <div className="mt-4 h-9 w-72 rounded bg-white/10" />
          <div className="mt-3 h-4 w-full max-w-xl rounded bg-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>

        <div className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-white" />

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Icon name="warning" />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900">
                Unable to load announcements
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Icon name="refresh" className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-360 space-y-7">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[28px] bg-linear-to-br from-[#08152f] via-[#0d2045] to-[#164d78] px-6 py-8 shadow-[0_22px_45px_-28px_rgba(8,21,47,0.7)] sm:px-9 sm:py-10">
        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-28 border-cyan-300/10" />
        <div className="absolute bottom-0 right-24 h-1 w-32 bg-cyan-300/70" />

        <div className="relative">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-100/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-100">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_0_4px_rgba(103,232,249,0.12)]" />
                Teacher Communication Center
              </div>

              <h1 className="text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
                Announcements
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100/75">
                Stay updated with important school announcements,
                notices, alerts, and platform communications.
              </p>
            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-cyan-200 shadow-inner shadow-white/10">
              <Icon name="megaphone" className="h-8 w-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="group rounded-2xl border border-white/70 bg-white p-5 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.9)] transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Available
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {announcements.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Announcements
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              <Icon name="megaphone" className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-white/70 bg-white p-5 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.9)] transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Important
              </p>

              <p className="mt-2 text-2xl font-bold text-red-600">
                {criticalCount}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Critical alerts
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
              <Icon name="warning" className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-white/70 bg-white p-5 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.9)] transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Attention
              </p>

              <p className="mt-2 text-2xl font-bold text-amber-600">
                {urgentCount}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Urgent items
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
              <Icon name="bell" className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-white/70 bg-white p-5 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.9)] transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Views
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {totalViews.toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Recorded views
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
              <Icon name="eye" className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Search and filters */}
      <section className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.9)] backdrop-blur sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" className="h-4 w-4" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search announcements..."
              className="w-full rounded-xl border border-slate-200 bg-[#f6f9fc] py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ['all', 'All'],
                ['critical', 'Critical'],
                ['urgent', 'Urgent'],
                ['info', 'Info'],
                ['update', 'Updates']
              ] as [FilterTab, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  filter === value
                    ? 'bg-[#0d2045] text-white shadow-md shadow-blue-950/20'
                    : 'bg-[#edf3f8] text-slate-600 hover:bg-cyan-50 hover:text-cyan-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400">
            Showing{' '}
            <span className="font-semibold text-slate-600">
              {filteredAnnouncements.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-600">
              {announcements.length}
            </span>{' '}
            announcements
          </p>

          {(searchQuery || filter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }}
              className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Information banner */}
      <section className="flex items-start gap-3 rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4 shadow-sm">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Icon name="info" className="h-4 w-4" />
        </div>

        <div>
          <p className="text-sm font-semibold text-blue-900">
            Stay informed
          </p>

          <p className="mt-1 text-xs leading-5 text-blue-700/80">
            New announcements published by school or platform
            administrators will appear here automatically when they are
            returned by the Announcement Service.
          </p>
        </div>
      </section>

      {/* Empty state */}
      {announcements.length === 0 ? (
        <section className="flex min-h-80 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Icon name="megaphone" className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              No announcements available
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              There are currently no announcements available for
              display.
            </p>
          </div>
        </section>
      ) : filteredAnnouncements.length === 0 ? (
        <section className="flex min-h-72 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Icon name="search" className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-base font-bold text-slate-800">
              No matching announcements
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or selected filter.
            </p>
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          {filteredAnnouncements.map((announcement) => {
            const badge = getBadgeStyle(announcement.priority);

            return (
              <article
                key={announcement.id}
                className={`group overflow-hidden rounded-2xl border border-white border-l-4 bg-white p-5 shadow-[0_14px_32px_-25px_rgba(15,23,42,0.95)] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-7 ${badge.borderClass}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${badge.className}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${badge.dot}`}
                      />

                      <Icon
                        name={badge.icon}
                        className="h-3 w-3"
                      />

                      {badge.label}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                      <Icon name="check" className="h-3 w-3" />
                      {getStatusLabel(announcement)}
                    </span>
                  </div>

                  <span className="shrink-0 text-xs font-medium text-slate-400">
                    {timeAgo(announcement.publishDate)}
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-bold leading-7 tracking-[-0.015em] text-slate-900 transition group-hover:text-cyan-800 sm:text-2xl">
                  {announcement.title}
                </h2>

                <p className="mt-3 max-w-4xl whitespace-pre-line text-sm leading-7 text-slate-600">
                  {announcement.content}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <Icon name="user" className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Posted by
                      </p>

                      <p className="truncate text-xs font-semibold text-slate-700">
                        {announcement.postedBy?.name || 'Administrator'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon name="users" className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Audience
                      </p>

                      <p className="truncate text-xs font-semibold text-slate-700">
                        {getAudienceLabel(announcement)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Icon name="calendar" className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Published
                      </p>

                      <p className="truncate text-xs font-semibold text-slate-700">
                        {formatDate(announcement.publishDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                      <Icon name="eye" className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Views
                      </p>

                      <p className="truncate text-xs font-semibold text-slate-700">
                        {getViews(announcement).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Bottom summary */}
      {announcements.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon name="bell" className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">
                Announcement updates
              </p>

              <p className="text-[11px] text-slate-400">
                {unreadLikeCount} announcement
                {unreadLikeCount === 1 ? '' : 's'} currently available
              </p>
            </div>
          </div>

          <Link
            href="/announcements"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            View all announcements
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}