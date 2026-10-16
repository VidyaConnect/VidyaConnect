'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Announcement } from '../types/announcement';
import { getAnnouncements } from '../services/announcementService';

/* ------------------------------------------------------------------ */
/*  Priority styling                                                   */
/* ------------------------------------------------------------------ */

type Level = 'critical' | 'important' | 'general';
type Filter = 'all' | Level;
type Sort = 'newest' | 'views';

type Look = { level: Level; label: string; chip: string; rail: string; dot: string };

const CRITICAL: Look = {
  level: 'critical',
  label: 'Critical alert',
  chip: 'bg-red-50 text-red-700 ring-red-600/20',
  rail: 'bg-red-600',
  dot: 'bg-red-500',
};
const IMPORTANT: Look = {
  level: 'important',
  label: 'Important',
  chip: 'bg-amber-50 text-amber-800 ring-amber-600/25',
  rail: 'bg-amber-500',
  dot: 'bg-amber-500',
};
const UPDATE: Look = {
  level: 'general',
  label: 'New feature',
  chip: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  rail: 'bg-[#007c6d]',
  dot: 'bg-emerald-500',
};
const INFO: Look = {
  level: 'general',
  label: 'Information',
  chip: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  rail: 'bg-[#073b78]',
  dot: 'bg-blue-500',
};

const LOOKS: Record<string, Look> = {
  critical: CRITICAL,
  emergency: CRITICAL,
  urgent: IMPORTANT,
  warning: IMPORTANT,
  update: UPDATE,
  info: INFO,
  normal: INFO,
};

const lookOf = (priority: string): Look => LOOKS[priority] ?? INFO;

const FILTERS: { id: Filter; label: string; dot?: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'critical', label: 'Critical alerts', dot: 'bg-red-500' },
  { id: 'important', label: 'Important', dot: 'bg-amber-500' },
  { id: 'general', label: 'General updates', dot: 'bg-blue-500' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const viewsOf = (a: Announcement) => a.reachAnalytics?.totalViews ?? 0;

const byNewest = (a: Announcement, b: Announcement) =>
  new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const dayKey = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (sameDay(d, today)) return 'Today';
  if (sameDay(d, yesterday)) return 'Yesterday';
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: d.getFullYear() === today.getFullYear() ? undefined : 'numeric',
  });
}

const timeOfDay = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

const fullDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
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

const sentenceCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const posterOf = (a: Announcement) =>
  sentenceCase(a.postedBy.department || a.postedBy.role.replace(/-/g, ' '));

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007c6d]';

type Group = { key: string; label: string; items: Announcement[] };

/* ------------------------------------------------------------------ */
/*  Small icons                                                        */
/* ------------------------------------------------------------------ */

const EyeIcon = ({ className = 'h-3.5 w-3.5' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d={dir === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Feed card (opens the pop-up)                                       */
/* ------------------------------------------------------------------ */

function AnnouncementCard({
  a,
  when,
  maxViews,
  featured = false,
  onOpen,
}: {
  a: Announcement;
  when: string;
  maxViews: number;
  featured?: boolean;
  onOpen: (id: Announcement['id']) => void;
}) {
  const look = lookOf(a.priority);
  const views = viewsOf(a);
  const pct = maxViews > 0 ? Math.round((views / maxViews) * 100) : 0;

  return (
    <button
      type="button"
      onClick={() => onOpen(a.id)}
      aria-haspopup="dialog"
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-xl border text-left transition-colors ${FOCUS} ${
        featured
          ? 'border-red-200 bg-red-50/60 hover:border-red-300'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
      }`}
    >
      <span aria-hidden className={`absolute inset-y-0 left-0 w-1.5 ${look.rail}`} />

      <div className="flex flex-1 flex-col py-4 pl-6 pr-5">
        <div className="flex items-center justify-between gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${look.chip}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${look.dot}`} />
            {look.label}
          </span>
          <span className="text-xs text-slate-500">{when}</span>
        </div>

        <h3 className={`mt-2.5 font-semibold text-slate-900 ${featured ? 'text-lg' : 'text-base'}`}>{a.title}</h3>
        <p className={`mt-1 max-w-prose text-sm leading-relaxed text-slate-600 ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
          {a.content}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="flex min-w-0 items-center gap-2">
            <span aria-hidden className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#073b78] text-[10px] font-semibold text-white">
              {initials(a.postedBy.name)}
            </span>
            <span className="truncate text-xs font-medium text-slate-700">{a.postedBy.name}</span>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-xs text-slate-500" title="Share of the most-viewed announcement">
            <span aria-hidden className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
              <span className="block h-full rounded-full bg-[#007c6d]" style={{ width: `${pct}%` }} />
            </span>
            <EyeIcon />
            {views.toLocaleString()}
          </div>
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail pop-up                                                      */
/* ------------------------------------------------------------------ */

function DetailDialog({
  a,
  all,
  ordered,
  avgViews,
  maxViews,
  onClose,
  onNavigate,
  onSwitch,
}: {
  a: Announcement;
  all: Announcement[];
  ordered: Announcement[];
  avgViews: number;
  maxViews: number;
  onClose: () => void;
  onNavigate: (delta: number) => void;
  onSwitch: (id: Announcement['id']) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const look = lookOf(a.priority);
  const index = ordered.findIndex((x) => x.id === a.id);
  const hasPrev = index > 0;
  const hasNext = index >= 0 && index < ordered.length - 1;
  const views = viewsOf(a);
  const ratio = avgViews > 0 ? views / avgViews : 0;
  const pct = maxViews > 0 ? Math.round((views / maxViews) * 100) : 0;
  const moreFromSender = all
    .filter((x) => x.id !== a.id && x.postedBy.name === a.postedBy.name)
    .sort(byNewest)
    .slice(0, 3);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNavigate(1);
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        onNavigate(-1);
      } else if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNavigate, hasNext, hasPrev]);

  return (
    <div
      className="af-fade fixed inset-0 z-50 flex items-end justify-center bg-slate-900/55 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        @keyframes af-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes af-pop { from { opacity: 0; transform: translateY(14px) scale(.985) } to { opacity: 1; transform: none } }
        .af-fade { animation: af-fade .15s ease-out }
        .af-pop { animation: af-pop .2s ease-out }
        @media (prefers-reduced-motion: reduce) { .af-fade, .af-pop { animation: none } }
      `}</style>

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcement-title"
        className="af-pop flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        <div aria-hidden className={`h-1.5 w-full ${look.rail}`} />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-5">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${look.chip}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${look.dot}`} />
            {look.label}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close announcement"
            className={`-mr-2 -mt-1 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 ${FOCUS}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body; keyed so it resets to the top when you move between announcements */}
        <div key={String(a.id)} className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
          <h2 id="announcement-title" className="text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">
            {a.title}
          </h2>

          <div className="mt-3 flex items-center gap-3">
            <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#073b78] text-sm font-semibold text-white">
              {initials(a.postedBy.name)}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-900">{a.postedBy.name}</p>
              <p className="text-xs text-slate-500">
                {posterOf(a)}, {fullDate(a.publishDate)}
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-prose whitespace-pre-line text-[15px] leading-7 text-slate-700">{a.content}</p>

          {/* Insights */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3.5 sm:col-span-2">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <EyeIcon /> Reach
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{views.toLocaleString()} views</p>
              <div aria-hidden className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-[#007c6d]" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {avgViews > 0
                  ? ratio >= 1
                    ? `${ratio.toFixed(1)} times the average for this feed`
                    : `${Math.round(ratio * 100)}% of the average for this feed`
                  : 'No view data for the feed yet'}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3.5">
              <p className="text-xs font-semibold text-slate-600">Posted</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{timeAgo(a.publishDate)}</p>
              <p className="mt-2 text-xs text-slate-500">{look.label}</p>
            </div>
          </div>

          {moreFromSender.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-900">More from {a.postedBy.name}</h3>
              <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200">
                {moreFromSender.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => onSwitch(m.id)}
                      className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left hover:bg-slate-50 ${FOCUS}`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${lookOf(m.priority).dot}`} />
                        <span className="truncate text-sm text-slate-800">{m.title}</span>
                      </span>
                      <span className="shrink-0 text-xs text-slate-500">{timeAgo(m.publishDate)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer: move through the list */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-3">
          <button
            type="button"
            onClick={() => onNavigate(-1)}
            disabled={!hasPrev}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS}`}
          >
            <Chevron dir="left" /> Previous
          </button>
          <span className="text-xs text-slate-500">
            {index >= 0 ? `${index + 1} of ${ordered.length}` : ''}
          </span>
          <button
            type="button"
            onClick={() => onNavigate(1)}
            disabled={!hasNext}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS}`}
          >
            Next <Chevron dir="right" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page frame                                                         */
/* ------------------------------------------------------------------ */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-2xl font-bold leading-tight text-[#003b78]">Announcements</h1>
        <p className="mt-1.5 max-w-xl text-sm text-[#555962]">
          Official updates from school administration. This feed is read-only.
        </p>
      </header>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feed                                                               */
/* ------------------------------------------------------------------ */

export default function TeacherAnnouncementFeed() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('newest');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<Announcement['id'] | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Data loading is unchanged: same service call, same error handling.
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load announcements.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ---- insights, all computed from the loaded announcements ---- */

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: announcements.length, critical: 0, important: 0, general: 0 };
    for (const a of announcements) c[lookOf(a.priority).level] += 1;
    return c;
  }, [announcements]);

  const insights = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return { date: d, label: d.toLocaleDateString(undefined, { weekday: 'short' }), count: 0, isToday: i === 6 };
    });
    let weekCount = 0;
    for (const a of announcements) {
      const posted = new Date(a.publishDate);
      const day = days.find((x) => sameDay(x.date, posted));
      if (day) {
        day.count += 1;
        weekCount += 1;
      }
    }
    const totalViews = announcements.reduce((sum, a) => sum + viewsOf(a), 0);
    return {
      days,
      weekCount,
      maxDay: Math.max(1, ...days.map((d) => d.count)),
      totalViews,
      maxViews: Math.max(0, ...announcements.map(viewsOf)),
      avgViews: announcements.length ? totalViews / announcements.length : 0,
      topViewed: [...announcements]
        .filter((a) => viewsOf(a) > 0)
        .sort((a, b) => viewsOf(b) - viewsOf(a))
        .slice(0, 3),
    };
  }, [announcements]);

  /* ---- what the feed shows ---- */

  const { critical, groups, ordered } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const visible = announcements.filter(
      (a) =>
        (filter === 'all' || lookOf(a.priority).level === filter) &&
        (!q || `${a.title} ${a.content} ${a.postedBy.name}`.toLowerCase().includes(q)),
    );
    const sorted = [...visible].sort(sort === 'views' ? (a, b) => viewsOf(b) - viewsOf(a) || byNewest(a, b) : byNewest);

    const critical = sorted.filter((a) => lookOf(a.priority).level === 'critical');
    const rest = sorted.filter((a) => lookOf(a.priority).level !== 'critical');

    let groups: Group[] = [];
    if (sort === 'views') {
      if (rest.length) groups = [{ key: 'views', label: 'Most viewed first', items: rest }];
    } else {
      const map = new Map<string, Group>();
      for (const a of rest) {
        const key = dayKey(a.publishDate);
        const group = map.get(key) ?? { key, label: dayLabel(a.publishDate), items: [] };
        group.items.push(a);
        map.set(key, group);
      }
      groups = Array.from(map.values());
    }
    return { critical, groups, ordered: [...critical, ...groups.flatMap((g) => g.items)] };
  }, [announcements, filter, sort, query]);

  /* ---- pop-up controls ---- */

  const openAnnouncement = useCallback((id: Announcement['id']) => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setSelectedId(id);
  }, []);

  const closeAnnouncement = useCallback(() => {
    setSelectedId(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const navigate = useCallback(
    (delta: number) => {
      const i = ordered.findIndex((x) => x.id === selectedId);
      const next = ordered[i + delta];
      if (i >= 0 && next) setSelectedId(next.id);
    },
    [ordered, selectedId],
  );

  const selected = selectedId === null ? null : announcements.find((x) => x.id === selectedId) ?? null;

  /* ----------------------------- states ----------------------------- */

  if (isLoading) {
    return (
      <Shell>
        <div className="space-y-3" aria-busy="true" aria-live="polite">
          <div className="h-44 rounded-2xl bg-slate-200/70 motion-safe:animate-pulse" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 motion-safe:animate-pulse">
              <div className="h-5 w-28 rounded-full bg-slate-100" />
              <div className="mt-3 h-5 w-2/3 rounded bg-slate-100" />
              <div className="mt-2 h-4 w-full rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </Shell>
    );
  }

  if (errorMessage) {
    return (
      <Shell>
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-800">Announcements didn&apos;t load</p>
            <p className="mt-0.5 text-sm text-red-700">{errorMessage}</p>
            <button type="button" onClick={loadData} className={`mt-3 rounded-lg bg-red-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-800 ${FOCUS}`}>
              Try again
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  if (announcements.length === 0) {
    return (
      <Shell>
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <p className="text-sm font-semibold text-slate-900">No announcements yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">When school administration posts an update, it will appear here.</p>
        </div>
      </Shell>
    );
  }

  /* ------------------------------ page ------------------------------ */

  const total = counts.all || 1;
  const pCritical = (counts.critical / total) * 100;
  const pImportant = pCritical + (counts.important / total) * 100;
  const ringStyle = {
    background: `conic-gradient(#ef4444 0 ${pCritical}%, #f59e0b ${pCritical}% ${pImportant}%, #3b82f6 ${pImportant}% 100%)`,
  };
  const filtersActive = filter !== 'all' || query.trim() !== '';

  return (
    <Shell>
      {/* Insights band: navy panel with three pale-blue cards */}
      <section aria-label="Announcement insights" className="overflow-hidden rounded-2xl bg-[#073b78] p-5 text-white sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">
            {insights.weekCount} {insights.weekCount === 1 ? 'announcement' : 'announcements'} posted this week
          </h2>
          <p className="mt-0.5 text-sm text-white/70">
            {counts.critical > 0
              ? `${counts.critical} critical ${counts.critical === 1 ? 'alert is' : 'alerts are'} in the feed. Read ${counts.critical === 1 ? 'it' : 'them'} first.`
              : 'No critical alerts right now.'}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Activity */}
          <div className="rounded-lg border border-[#c5d6ea] bg-[#e8f0f9] p-4">
            <h3 className="text-sm font-bold text-[#073b78]">Posted per day</h3>
            <p className="text-xs text-[#4b6584]">Last 7 days</p>
            <div className="mt-3 flex h-28 items-end gap-2">
              {insights.days.map((d) => (
                <div key={d.label + d.date.getDate()} className="flex flex-1 flex-col items-center justify-end gap-1">
                  <span className="text-xs font-semibold text-[#0f172a]">{d.count > 0 ? d.count : ''}</span>
                  <div
                    aria-hidden
                    className={`w-full rounded-t-md ${d.isToday ? 'bg-[#007c6d]' : 'bg-[#a9c1de]'}`}
                    style={{ height: d.count === 0 ? 4 : 14 + (d.count / insights.maxDay) * 58 }}
                  />
                  <span className={`text-[11px] ${d.isToday ? 'font-semibold text-[#007c6d]' : 'text-[#4b6584]'}`}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority mix */}
          <div className="rounded-lg border border-[#c5d6ea] bg-[#e8f0f9] p-4">
            <h3 className="text-sm font-bold text-[#073b78]">Mix by priority</h3>
            <p className="text-xs text-[#4b6584]">All announcements in the feed</p>
            <div className="mt-3 flex items-center gap-5">
              <div className="relative h-24 w-24 shrink-0 rounded-full" style={ringStyle} role="img" aria-label={`${counts.critical} critical, ${counts.important} important, ${counts.general} general`}>
                <div className="absolute inset-[14px] flex flex-col items-center justify-center rounded-full bg-[#e8f0f9]">
                  <span className="text-xl font-bold leading-none text-[#0f172a]">{counts.all}</span>
                  <span className="mt-0.5 text-[10px] text-[#4b6584]">in feed</span>
                </div>
              </div>
              <ul className="space-y-1.5 text-sm text-[#1e3a5f]">
                <li className="flex items-center gap-2"><span aria-hidden className="h-2.5 w-2.5 rounded-full bg-red-500" />Critical, {counts.critical}</li>
                <li className="flex items-center gap-2"><span aria-hidden className="h-2.5 w-2.5 rounded-full bg-amber-500" />Important, {counts.important}</li>
                <li className="flex items-center gap-2"><span aria-hidden className="h-2.5 w-2.5 rounded-full bg-blue-500" />General, {counts.general}</li>
              </ul>
            </div>
          </div>

          {/* Most viewed */}
          <div className="rounded-lg border border-[#c5d6ea] bg-[#e8f0f9] p-4">
            <h3 className="text-sm font-bold text-[#073b78]">Most viewed</h3>
            <p className="text-xs text-[#4b6584]">Click one to read it</p>
            {insights.topViewed.length === 0 ? (
              <p className="mt-4 text-sm text-[#4b6584]">View counts will show here once announcements have been opened.</p>
            ) : (
              <ul className="mt-2 space-y-0.5">
                {insights.topViewed.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => openAnnouncement(a.id)}
                      aria-haspopup="dialog"
                      className={`w-full rounded-lg p-2 text-left hover:bg-white/60 ${FOCUS}`}
                    >
                      <span className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate font-medium text-[#0f172a]">{a.title}</span>
                        <span className="shrink-0 text-xs text-[#4b6584]">{viewsOf(a).toLocaleString()}</span>
                      </span>
                      <span aria-hidden className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-[#cfdcee]">
                        <span className="block h-full rounded-full bg-[#007c6d]" style={{ width: `${(viewsOf(a) / insights.maxViews) * 100}%` }} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filter announcements" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${FOCUS} ${
                  active ? 'border-[#073b78] bg-[#073b78] text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {f.dot && <span aria-hidden className={`h-2 w-2 rounded-full ${f.dot}`} />}
                {f.label}
                <span className={`rounded-full px-1.5 text-xs font-semibold ${active ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>{counts[f.id]}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, content or sender"
            aria-label="Search announcements"
            className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 lg:w-64 ${FOCUS}`}
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort announcements"
            className={`h-10 shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 ${FOCUS}`}
          >
            <option value="newest">Newest first</option>
            <option value="views">Most viewed first</option>
          </select>
        </div>
      </div>

      {/* Feed */}
      <div className="mt-6 space-y-8">
        {ordered.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <p className="text-sm font-semibold text-slate-900">No announcements match</p>
            {filtersActive && (
              <button
                type="button"
                onClick={() => {
                  setFilter('all');
                  setQuery('');
                }}
                className={`mt-2 rounded text-sm font-semibold text-[#007c6d] hover:text-[#005f54] ${FOCUS}`}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {critical.length > 0 && (
          <section aria-labelledby="needs-attention">
            <h2 id="needs-attention" className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-700">
              <span aria-hidden className="h-2 w-2 rounded-full bg-red-500" />
              Needs your attention
              <span className="font-normal text-red-600/80">({critical.length})</span>
            </h2>
            <div className={`grid gap-3 ${critical.length > 1 ? 'md:grid-cols-2' : ''}`}>
              {critical.map((a) => (
                <AnnouncementCard key={a.id} a={a} featured when={timeAgo(a.publishDate)} maxViews={insights.maxViews} onOpen={openAnnouncement} />
              ))}
            </div>
          </section>
        )}

        {groups.map((g) => (
          <section key={g.key} aria-label={g.label}>
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-sm font-semibold text-slate-700">{g.label}</h2>
              <span aria-hidden className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {g.items.map((a) => (
                <AnnouncementCard
                  key={a.id}
                  a={a}
                  when={sort === 'views' ? timeAgo(a.publishDate) : timeOfDay(a.publishDate)}
                  maxViews={insights.maxViews}
                  onOpen={openAnnouncement}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {selected && (
        <DetailDialog
          a={selected}
          all={announcements}
          ordered={ordered}
          avgViews={insights.avgViews}
          maxViews={insights.maxViews}
          onClose={closeAnnouncement}
          onNavigate={navigate}
          onSwitch={setSelectedId}
        />
      )}
    </Shell>
  );
}