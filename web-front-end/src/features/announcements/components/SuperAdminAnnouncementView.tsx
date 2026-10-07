'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Announcement } from '../types/announcement';
import { getAnnouncements } from '../services/announcementService';

type BadgeStyle = {
  label: string;
  className: string;
  borderClass: string;
  dot: string;
  icon: string;
};

const BADGE_STYLES: Record<string, BadgeStyle> = {
  critical: {
    label: 'CRITICAL ALERT',
    className:
      'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    borderClass: 'border-l-red-500',
    dot: 'bg-red-500',
    icon: 'âš '
  },

  emergency: {
    label: 'CRITICAL ALERT',
    className:
      'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    borderClass: 'border-l-red-500',
    dot: 'bg-red-500',
    icon: 'âš '
  },

  urgent: {
    label: 'IMPORTANT',
    className:
      'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    borderClass: 'border-l-amber-500',
    dot: 'bg-amber-500',
    icon: '!'
  },

  warning: {
    label: 'IMPORTANT',
    className:
      'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    borderClass: 'border-l-amber-500',
    dot: 'bg-amber-500',
    icon: '!'
  },

  update: {
    label: 'NEW FEATURE',
    className:
      'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    borderClass: 'border-l-emerald-500',
    dot: 'bg-emerald-500',
    icon: 'âœ“'
  },

  info: {
    label: 'INFORMATION',
    className:
      'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
    borderClass: 'border-l-blue-500',
    dot: 'bg-blue-500',
    icon: 'i'
  },

  normal: {
    label: 'INFORMATION',
    className:
      'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
    borderClass: 'border-l-blue-500',
    dot: 'bg-blue-500',
    icon: 'i'
  }
};

type FilterTab =
  | 'all'
  | 'critical'
  | 'urgent'
  | 'info'
  | 'update'
  | 'normal';

const FILTER_TABS: Array<{
  value: FilterTab;
  label: string;
}> = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'Critical' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'info', label: 'Info' },
  { value: 'update', label: 'Updates' }
];

function timeAgo(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  const diffMs = Date.now() - date.getTime();

  if (diffMs < 0) {
    return 'Scheduled';
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes === 1 ? '' : 's'} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 1) {
    return 'Posted yesterday';
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getBadgeStyle(priority: string): BadgeStyle {
  return (
    BADGE_STYLES[priority?.toLowerCase()] ??
    BADGE_STYLES.normal
  );
}

function getViews(announcement: Announcement): number {
  return announcement.reachAnalytics?.totalViews ?? 0;
}

function getPosterName(announcement: Announcement): string {
  return announcement.postedBy?.name || 'Super Admin';
}

function getPosterRole(announcement: Announcement): string {
  const role = announcement.postedBy?.role || 'super-admin';

  return role
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();

  return initials || 'SA';
}

export default function SuperAdminAnnouncementView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const data = await getAnnouncements();

        if (!isMounted) {
          return;
        }

        const platformAnnouncements = data.filter(
          (announcement) =>
            announcement.postedBy?.role === 'super-admin'
        );

        const sorted = [...platformAnnouncements].sort(
          (a, b) => {
            const firstDate = new Date(a.publishDate).getTime();
            const secondDate = new Date(b.publishDate).getTime();

            return secondDate - firstDate;
          }
        );

        setAnnouncements(sorted);
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

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAnnouncements = useMemo(() => {
    if (filter === 'all') {
      return announcements;
    }

    return announcements.filter((announcement) => {
      const priority = announcement.priority?.toLowerCase();

      if (filter === 'critical') {
        return (
          priority === 'critical' ||
          priority === 'emergency'
        );
      }

      if (filter === 'urgent') {
        return (
          priority === 'urgent' ||
          priority === 'warning'
        );
      }

      if (filter === 'info') {
        return (
          priority === 'info' ||
          priority === 'normal'
        );
      }

      return priority === filter;
    });
  }, [announcements, filter]);

  const totalViews = useMemo(
    () =>
      announcements.reduce(
        (total, announcement) =>
          total + getViews(announcement),
        0
      ),
    [announcements]
  );

  const criticalCount = useMemo(
    () =>
      announcements.filter(
        (announcement) =>
          announcement.priority === 'critical' ||
          announcement.priority === 'emergency'
      ).length,
    [announcements]
  );

  const urgentCount = useMemo(
    () =>
      announcements.filter(
        (announcement) =>
          announcement.priority === 'urgent' ||
          announcement.priority === 'warning'
      ).length,
    [announcements]
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div className="animate-pulse overflow-hidden rounded-2xl bg-slate-900 p-6">
          <div className="h-5 w-40 rounded bg-white/10" />
          <div className="mt-4 h-8 w-72 rounded bg-white/10" />
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

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-lg font-bold text-red-600">
              !
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Couldn&apos;t load announcements
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-310 space-y-7">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[28px] bg-linear-to-br from-[#08152f] via-[#102d5b] to-[#19567f] px-6 py-8 shadow-[0_22px_45px_-28px_rgba(8,21,47,0.7)] sm:px-9 sm:py-10">
        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-28 border-cyan-300/10" />
        <div className="absolute bottom-0 left-12 h-1 w-32 bg-cyan-300/70" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-100/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-100">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_0_4px_rgba(103,232,249,0.12)]" />
              Communication Center
            </div>

            <h1 className="text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
              Platform Announcements
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100/75">
              Manage important platform announcements and
              communications shared across VidyaConnect schools.
            </p>
          </div>

          <Link
            href="/announcements/super-admin-compose"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-[#082044] shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200"
          >
            <span className="text-base font-bold">+</span>
            New Announcement
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.9)] transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {announcements.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
              â‰¡
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Platform announcements
          </p>
        </div>

        <div className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.9)] transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Views
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {totalViews.toLocaleString()}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg font-bold text-emerald-600">
              â—‰
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Recorded announcement views
          </p>
        </div>

        <div className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.9)] transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Critical
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {criticalCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-lg font-bold text-red-600">
              !
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Critical announcements
          </p>
        </div>

        <div className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.9)] transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Attention
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {urgentCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-lg font-bold text-amber-600">
              !
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Urgent or warning items
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-white/80 bg-white/90 p-3 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.9)] backdrop-blur">
        <div className="flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => {
            const isActive = filter === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#0d2045] text-white shadow-md shadow-blue-950/20'
                    : 'bg-[#edf3f8] text-slate-600 hover:bg-cyan-50 hover:text-cyan-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Announcements */}
      <section className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="flex min-h-50 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400">
                â€¢
              </div>

              <h2 className="mt-4 text-base font-bold text-slate-800">
                No announcements found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                There are no announcements matching the selected filter.
              </p>
            </div>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => {
            const badge = getBadgeStyle(announcement.priority);
            const posterName = getPosterName(announcement);
            const posterRole = getPosterRole(announcement);

            return (
              <article
                key={announcement.id}
                className={`overflow-hidden rounded-2xl border border-white border-l-4 bg-white shadow-[0_14px_32px_-25px_rgba(15,23,42,0.95)] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${badge.borderClass}`}
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wide ${badge.className}`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${badge.dot} text-white`}
                      >
                        {badge.icon}
                      </span>

                      {badge.label}
                    </span>

                    <span className="shrink-0 text-xs font-medium text-slate-400">
                      {timeAgo(announcement.publishDate)}
                    </span>
                  </div>

                  <h2 className="mt-5 text-xl font-bold leading-7 tracking-[-0.015em] text-slate-900 sm:text-2xl">
                    {announcement.title}
                  </h2>

                  <p className="mt-3 max-w-4xl whitespace-pre-line text-sm leading-7 text-slate-600">
                    {announcement.content}
                  </p>

                  <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
                        {getInitials(posterName)}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {posterName}
                        </p>

                        <p className="text-xs capitalize tracking-wide text-slate-400">
                          {posterRole}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="font-semibold">Views:</span>
                        {getViews(announcement).toLocaleString()}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <span className="font-semibold">Platform</span>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}