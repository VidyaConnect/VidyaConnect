'use client';

import { useEffect, useState } from 'react';
import { Announcement } from '../types/announcement';
import { getAnnouncements } from '../services/announcementService';

type BadgeStyle = {
  label: string;
  className: string;
  borderClass: string;
  dot: string;
};

const BADGE_STYLES: Record<string, BadgeStyle> = {
  critical: {
    label: 'CRITICAL ALERT',
    className: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    borderClass: 'border-l-4 border-l-red-600',
    dot: 'bg-red-500'
  },
  emergency: {
    label: 'CRITICAL ALERT',
    className: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    borderClass: 'border-l-4 border-l-red-600',
    dot: 'bg-red-500'
  },
  urgent: {
    label: 'IMPORTANT',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    borderClass: 'border-l-4 border-l-amber-500',
    dot: 'bg-amber-500'
  },
  warning: {
    label: 'IMPORTANT',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    borderClass: 'border-l-4 border-l-amber-500',
    dot: 'bg-amber-500'
  },
  update: {
    label: 'NEW FEATURE',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    borderClass: 'border-l-4 border-l-emerald-500',
    dot: 'bg-emerald-500'
  },
  info: {
    label: 'INFORMATION',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
    borderClass: 'border-l-4 border-l-blue-500',
    dot: 'bg-blue-500'
  },
  normal: {
    label: 'INFORMATION',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
    borderClass: 'border-l-4 border-l-blue-500',
    dot: 'bg-blue-500'
  }
};

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Posted yesterday';
  return new Date(dateString).toLocaleDateString();
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function TeacherAnnouncementFeed() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const data = await getAnnouncements();
        const sorted = [...data].sort((a, b) => {
          const rank = (p: string) => (p === 'critical' || p === 'emergency' ? 0 : 1);
          return rank(a.priority) - rank(b.priority);
        });
        setAnnouncements(sorted);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load announcements.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5">
            <div className="h-4 w-24 rounded-full bg-gray-100" />
            <div className="mt-3 h-5 w-2/3 rounded bg-gray-100" />
            <div className="mt-2 h-4 w-full rounded bg-gray-100" />
            <div className="mt-1 h-4 w-5/6 rounded bg-gray-100" />
            <div className="mt-4 h-8 rounded bg-gray-50" />
          </div>
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-800">Couldn&apos;t load announcements</p>
            <p className="mt-0.5 text-sm text-red-600">{errorMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a2.25 2.25 0 01-2.25-2.25v-9a2.25 2.25 0 012.25-2.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25c-.704 0-1.402.03-2.09.09m-4.5 0a48.474 48.474 0 007.5 0"
              />
            </svg>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-900">No announcements yet</p>
          <p className="mt-1 text-sm text-gray-500">Check back later for updates from school administration.</p>
        </div>
      </div>
    );
  }

  const urgentCount = announcements.filter((a) => a.priority === 'critical' || a.priority === 'emergency').length;

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a2.25 2.25 0 01-2.25-2.25v-9a2.25 2.25 0 012.25-2.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25c-.704 0-1.402.03-2.09.09m-4.5 0a48.474 48.474 0 007.5 0m-7.5 0v-.375c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v.375m-7.5 0v-.375c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v.375"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">School Announcements</h1>
            <p className="mt-0.5 max-w-md text-sm text-gray-500">
              Stay informed with the latest updates from school administration and departments. This is a read-only feed for official communication.
            </p>
          </div>
        </div>

        {urgentCount > 0 && (
          <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            {urgentCount} critical alert{urgentCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map((a) => {
          const badge = BADGE_STYLES[a.priority] || BADGE_STYLES.normal;
          const posterLabel = a.postedBy.department || a.postedBy.role.replace('-', ' ');

          return (
            <div
              key={a.id}
              className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${badge.borderClass}`}
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                  <span className="whitespace-nowrap text-xs text-gray-400">{timeAgo(a.publishDate)}</span>
                </div>

                <h2 className="mt-3 text-lg font-semibold text-gray-900">{a.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{a.content}</p>

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1B2559] text-xs font-semibold text-white">
                      {initials(a.postedBy.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{a.postedBy.name}</p>
                      <p className="text-xs uppercase tracking-wide text-gray-400">{posterLabel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {(a.reachAnalytics?.totalViews ?? 0).toLocaleString()} views
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}