'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Announcement } from '../types/announcement';
import { getAnnouncements } from '../services/announcementService';

type IconName = 'bullhorn' | 'eye' | 'warning' | 'bell' | 'info' | 'user' | 'users' | 'calendar' | 'file' | 'check' | 'align' | 'plus' | 'list';

function Icon({ name, size = 18, className = '' }: { name: IconName; size?: number; className?: string }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className
  };

  switch (name) {
    case 'bullhorn':
      return (
        <svg {...common}>
          <path d="M3 11v2" />
          <path d="M5 10h3l9-5v14l-9-5H5a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2Z" />
          <path d="M8 14l1.5 5h2L10 14" />
          <path d="M21 9a4 4 0 0 1 0 6" />
        </svg>
      );
    case 'eye':
      return (
        <svg {...common}>
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case 'warning':
      return (
        <svg {...common}>
          <path d="M10.3 3.7 2.4 17.2A2 2 0 0 0 4.1 20h15.8a2 2 0 0 0 1.7-2.8L13.7 3.7a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4" />
          <path d="M12 16h.01" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );
    case 'info':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 8h.01" />
        </svg>
      );
    case 'user':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c.7-3.2 3.1-5 7-5s6.3 1.8 7 5" />
        </svg>
      );
    case 'users':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 20c.5-3.1 2.4-5 5.5-5s5 1.9 5.5 5" />
          <path d="M16 5.5a3 3 0 0 1 0 5.8" />
          <path d="M17 15c2.2.2 3.6 1.8 4 4" />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...common}>
          <rect x="3" y="4.5" width="18" height="16" rx="2" />
          <path d="M8 2.5v4" />
          <path d="M16 2.5v4" />
          <path d="M3 9h18" />
        </svg>
      );
    case 'file':
      return (
        <svg {...common}>
          <path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          <path d="M14 3v5h5" />
          <path d="M8 12h8" />
          <path d="M8 16h6" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      );
    case 'align':
      return (
        <svg {...common}>
          <path d="M5 6h14" />
          <path d="M5 10h10" />
          <path d="M5 14h14" />
          <path d="M5 18h10" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );
    case 'list':
      return (
        <svg {...common}>
          <path d="M8 6h13" />
          <path d="M8 12h13" />
          <path d="M8 18h13" />
          <path d="M3 6h.01" />
          <path d="M3 12h.01" />
          <path d="M3 18h.01" />
        </svg>
      );
    default:
      return null;
  }
}

type PriorityStyle = {
  badge: string;
  dot: string;
  border: string;
  icon: IconName;
};

const PRIORITY_STYLES: Record<string, PriorityStyle> = {
  critical: { badge: 'bg-red-50 text-red-700 border border-red-200', dot: 'bg-red-500', border: 'border-l-red-500', icon: 'warning' },
  emergency: { badge: 'bg-red-50 text-red-700 border border-red-200', dot: 'bg-red-500', border: 'border-l-red-500', icon: 'warning' },
  urgent: { badge: 'bg-amber-50 text-amber-700 border border-amber-200', dot: 'bg-amber-500', border: 'border-l-amber-500', icon: 'bell' },
  warning: { badge: 'bg-amber-50 text-amber-700 border border-amber-200', dot: 'bg-amber-500', border: 'border-l-amber-500', icon: 'warning' },
  update: { badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500', border: 'border-l-emerald-500', icon: 'info' },
  info: { badge: 'bg-blue-50 text-blue-700 border border-blue-200', dot: 'bg-blue-500', border: 'border-l-blue-500', icon: 'info' },
  normal: { badge: 'bg-slate-50 text-slate-600 border border-slate-200', dot: 'bg-slate-400', border: 'border-l-slate-400', icon: 'bullhorn' }
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatPriority(priority: string) {
  if (!priority) return 'Normal';
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function getPriorityStyle(priority: string) {
  return PRIORITY_STYLES[priority?.toLowerCase()] || PRIORITY_STYLES.normal;
}

function getAudienceLabel(announcement: Announcement) {
  const possibleAudience = (announcement as Announcement & { audience?: string }).audience;
  return possibleAudience || 'Platform';
}

function getStatusLabel(announcement: Announcement) {
  const possibleStatus = (announcement as Announcement & { status?: string }).status;
  return possibleStatus || 'Published';
}

function getViews(announcement: Announcement) {
  return announcement.reachAnalytics?.totalViews ?? 0;
}

export default function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load announcements.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const selected = announcements.find((announcement) => announcement.id === selectedId) || announcements[0];

  if (isLoading) {
    return (
      <div className="min-h-125 w-full">
        <div className="animate-pulse space-y-6">
          <div className="h-28 rounded-2xl bg-slate-200" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(380px,0.9fr)]">
            <div className="h-96 rounded-2xl border border-slate-200 bg-white" />
            <div className="h-96 rounded-2xl border border-slate-200 bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-105 items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Icon name="warning" size={24} />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Unable to load announcements</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#0F172A] via-[#111C33] to-[#1E3A8A] px-6 py-7 sm:px-8">
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#2563EB]/15 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-blue-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Communication Center
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Announcements</h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Manage school updates, important alerts, and platform communications from one place.
            </p>
          </div>

          <Link
            href="/announcements/create"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-black/20 transition hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#0F172A] active:scale-[0.98]"
          >
            <Icon name="plus" size={15} />
            New Announcement
          </Link>
        </div>
      </div>

      {/* Main content */}
      {announcements.length === 0 ? (
        <div className="flex min-h-105 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
          <div className="max-w-sm px-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Icon name="bullhorn" size={24} />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-900">No announcements yet</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create the first announcement to share important information with your school community.
            </p>
            <Link
              href="/announcements/create"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1d4ed8]"
            >
              <Icon name="plus" size={14} />
              Create Announcement
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)]">
          {/* Announcement list */}
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Recent Announcements</h2>
                <p className="mt-0.5 text-xs text-slate-400">Select an announcement to view its details.</p>
              </div>
              <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 sm:flex">
                <Icon name="list" size={16} />
              </div>
            </div>

            <div className="space-y-3">
              {announcements.map((announcement) => {
                const style = getPriorityStyle(announcement.priority);
                const isSelected = selectedId === announcement.id;

                return (
                  <button
                    key={announcement.id}
                    type="button"
                    onClick={() => setSelectedId(announcement.id)}
                    className={`group relative w-full overflow-hidden rounded-2xl border border-l-4 bg-white p-4 text-left transition-all duration-150 ${style.border} ${
                      isSelected
                        ? 'border-slate-200 bg-blue-50/40 shadow-md ring-2 ring-[#2563EB]/20'
                        : 'border-slate-200 hover:-translate-y-0.5 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${style.badge}`}>
                        <Icon name={style.icon} size={10} />
                        {formatPriority(announcement.priority)}
                      </span>
                      <span className="shrink-0 text-[11px] font-medium text-slate-400">{formatDate(announcement.publishDate)}</span>
                    </div>

                    <h3 className="mt-3 line-clamp-1 text-sm font-semibold text-slate-900 transition group-hover:text-[#1E3A8A] sm:text-base">
                      {announcement.title}
                    </h3>

                    <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-sm">{announcement.content}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="user" size={11} />
                        {announcement.postedBy?.name || 'Unknown'}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="users" size={11} />
                        {getAudienceLabel(announcement)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="eye" size={11} />
                        {getViews(announcement).toLocaleString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div className="min-w-0">
            <div className="sticky top-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {selected ? (
                <>
                  <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Icon name="file" size={16} />
                        </span>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Announcement Details</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const style = getPriorityStyle(selected.priority);
                        return (
                          <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${style.badge}`}>
                            <Icon name={style.icon} size={10} />
                            {formatPriority(selected.priority)}
                          </span>
                        );
                      })()}
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                        <Icon name="check" size={10} />
                        {getStatusLabel(selected)}
                      </span>
                    </div>

                    <h2 className="mt-4 text-xl font-semibold leading-7 tracking-tight text-slate-900">{selected.title}</h2>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Icon name="user" size={13} />
                          <span className="text-[10px] font-semibold uppercase tracking-wide">Posted by</span>
                        </div>
                        <p className="mt-1.5 truncate text-xs font-semibold text-slate-700">{selected.postedBy?.name || 'Unknown'}</p>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Icon name="calendar" size={13} />
                          <span className="text-[10px] font-semibold uppercase tracking-wide">Published</span>
                        </div>
                        <p className="mt-1.5 text-xs font-semibold text-slate-700">{formatDate(selected.publishDate)}</p>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Icon name="users" size={13} />
                          <span className="text-[10px] font-semibold uppercase tracking-wide">Audience</span>
                        </div>
                        <p className="mt-1.5 truncate text-xs font-semibold text-slate-700">{getAudienceLabel(selected)}</p>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Icon name="eye" size={13} />
                          <span className="text-[10px] font-semibold uppercase tracking-wide">Views</span>
                        </div>
                        <p className="mt-1.5 text-xs font-semibold text-slate-700">{getViews(selected).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="mb-2.5 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Icon name="align" size={13} />
                        </span>
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Announcement Content</h3>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                        <p className="whitespace-pre-line text-sm leading-7 text-slate-600">{selected.content}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex min-h-105 items-center justify-center p-8 text-center">
                  <div>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Icon name="file" size={24} />
                    </div>
                    <h2 className="mt-5 text-base font-semibold text-slate-800">No announcement selected</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Select an announcement from the list to view its full details.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}