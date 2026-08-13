'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Announcement } from '../types/announcement';
import { getAnnouncements } from '../services/announcementService';

type BadgeStyle = {
  label: string;
  className: string;
  dot: string;
  borderClass: string;
};

const BADGE_STYLES: Record<string, BadgeStyle> = {
  critical: {
    label: 'CRITICAL',
    className: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    dot: 'bg-red-500',
    borderClass: 'border-l-red-500'
  },
  emergency: {
    label: 'CRITICAL',
    className: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    dot: 'bg-red-500',
    borderClass: 'border-l-red-500'
  },
  info: {
    label: 'INFO',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
    dot: 'bg-blue-500',
    borderClass: 'border-l-blue-500'
  },
  update: {
    label: 'UPDATE',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    dot: 'bg-emerald-500',
    borderClass: 'border-l-emerald-500'
  },
  feature: {
    label: 'FEATURE',
    className: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20',
    dot: 'bg-indigo-500',
    borderClass: 'border-l-indigo-500'
  },
  normal: {
    label: 'INFO',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
    dot: 'bg-blue-500',
    borderClass: 'border-l-blue-500'
  }
};

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / (1000 * 60));

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} mins ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

type FilterTab = 'all' | 'critical' | 'info' | 'update' | 'feature';

const FILTER_TABS: FilterTab[] = ['all', 'critical', 'info', 'update', 'feature'];

export default function SuperAdminAnnouncementView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAnnouncements();
        const platformOnly = data.filter((a) => a.postedBy.role === 'super-admin');
        setAnnouncements(platformOnly);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load announcements');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const filtered = announcements.filter((a) => {
    if (filter === 'all') return true;
    return a.priority.toLowerCase() === filter;
  });

  // ── Loading state ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div className="animate-pulse overflow-hidden rounded-2xl bg-[#0F172A] p-6">
          <div className="h-5 w-40 rounded bg-white/10" />
          <div className="mt-4 h-8 w-64 rounded bg-white/10" />
        </div>
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
          <div className="h-4 w-20 rounded-full bg-slate-100" />
          <div className="mt-3 h-5 w-1/2 rounded bg-slate-100" />
          <div className="mt-2 h-4 w-full rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────
  if (errorMessage) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Couldn&apos;t load announcements</p>
            <p className="mt-1 text-sm text-slate-500">{errorMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#0F172A] via-[#111C33] to-[#1E3A8A] px-6 py-7 sm:px-8">
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#2563EB]/15 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-blue-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {announcements.length} Announcement{announcements.length !== 1 ? 's' : ''}
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Platform Announcements</h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Real-time platform communication across all schools.</p>
          </div>

          <Link
            href="/announcements/super-admin-compose"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-black/20 transition hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#0F172A] active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Announcement
          </Link>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="inline-flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`rounded-lg px-4 py-2 text-xs font-medium capitalize transition ${
              filter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Announcements */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
            <p className="text-sm text-slate-400">No announcements found.</p>
          </div>
        )}

        {filtered.map((a) => {
          const badge = BADGE_STYLES[a.priority] || BADGE_STYLES.info;

          return (
            <div
              key={a.id}
              className={`overflow-hidden rounded-2xl border border-l-4 border-slate-200 bg-white p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${badge.borderClass}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                  {badge.label}
                </span>
                <span className="shrink-0 text-xs text-slate-400">{timeAgo(a.publishDate)}</span>
              </div>

              <h2 className="mt-3 text-lg font-semibold text-slate-900">{a.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{a.content}</p>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-400">{a.source || 'Platform'} Broadcast</span>
                <span className="text-xs font-medium text-slate-500">Super Admin</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}