'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Announcement } from '../types/announcement';
import { getAnnouncements } from '../services/announcementService';

/* ---------- Priority look (colors per level) ---------- */
type Tone = {
  label: string;
  bar: string;
  badge: string;
  headerBg: string;
  iconWrap: string;
};

const TONES: Record<string, Tone> = {
  emergency: {
    label: 'Emergency',
    bar: 'bg-red-600',
    badge: 'bg-red-100 text-red-700',
    headerBg: 'from-red-600 to-red-500',
    iconWrap: 'bg-red-50 text-red-600',
  },
  urgent: {
    label: 'Urgent',
    bar: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700',
    headerBg: 'from-amber-500 to-amber-400',
    iconWrap: 'bg-amber-50 text-amber-600',
  },
  update: {
    label: 'Update',
    bar: 'bg-purple-500',
    badge: 'bg-purple-100 text-purple-700',
    headerBg: 'from-purple-600 to-purple-500',
    iconWrap: 'bg-purple-50 text-purple-600',
  },
  feature: {
    label: 'Feature',
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
    headerBg: 'from-emerald-600 to-emerald-500',
    iconWrap: 'bg-emerald-50 text-emerald-600',
  },
  normal: {
    label: 'Normal',
    bar: 'bg-[#073b78]',
    badge: 'bg-blue-100 text-blue-700',
    headerBg: 'from-[#073b78] to-[#0a56a8]',
    iconWrap: 'bg-blue-50 text-[#073b78]',
  },
};

// Old priority names map onto the five looks above
const ALIASES: Record<string, string> = {
  critical: 'emergency',
  warning: 'urgent',
  info: 'normal',
};

function toneOf(priority: string): Tone {
  const key = String(priority || 'normal').toLowerCase();
  return TONES[ALIASES[key] ?? key] ?? TONES.normal;
}

function isUrgent(priority: string) {
  const key = String(priority || '').toLowerCase();
  return ['emergency', 'critical', 'urgent', 'warning'].includes(key);
}

type FilterKey = 'all' | 'emergency' | 'urgent' | 'general';

function groupOf(priority: string): FilterKey {
  const key = String(priority || '').toLowerCase();
  if (key === 'emergency' || key === 'critical') return 'emergency';
  if (key === 'urgent' || key === 'warning') return 'urgent';
  return 'general';
}

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(dateString).toLocaleDateString();
}

/* ---------- Small icons ---------- */
const iconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const MegaphoneIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} {...iconProps}>
    <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
  </svg>
);
const ClockIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
const EyeIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} {...iconProps}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const UserIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} {...iconProps}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);
const SearchIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} {...iconProps}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);
const AlertIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} {...iconProps}>
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
  </svg>
);

/* ---------- Header ---------- */
function PageHeader({ count }: { count: number }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#073b78] to-[#0a56a8] p-6 text-white shadow-sm sm:p-7">
      <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-12 right-24 h-32 w-32 rounded-full bg-[#00a896]/30" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
            <MegaphoneIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Announcements</h1>
            <p className="mt-0.5 text-sm text-white/75">
              {count > 0
                ? `${count} announcement${count > 1 ? 's' : ''} shared with your school`
                : 'Share school updates and urgent notices'}
            </p>
          </div>
        </div>

        <Link
          href="/announcements/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00a896] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008f80] active:scale-[0.98]"
        >
          <span className="text-lg leading-none">+</span>
          New Announcement
        </Link>
      </div>
    </div>
  );
}

/* ---------- Stats ---------- */
function StatCard({
  label,
  value,
  note,
  icon,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  note?: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#e2e6ee] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">{label}</p>
        <p className="truncate text-xl font-bold text-[#0f172a]">{value}</p>
        {note && <p className="truncate text-xs text-[#64748b]">{note}</p>}
      </div>
    </div>
  );
}

function StatsRow({ announcements }: { announcements: Announcement[] }) {
  const urgentCount = announcements.filter((a) => isUrgent(a.priority)).length;
  const totalViews = announcements.reduce(
    (sum, item) => sum + (item.reachAnalytics?.totalViews ?? 0),
    0
  );
  const latest = announcements[0];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total"
        value={announcements.length}
        note="Announcements"
        accent="bg-blue-50 text-[#073b78]"
        icon={<MegaphoneIcon />}
      />
      <StatCard
        label="Urgent"
        value={urgentCount}
        note={urgentCount > 0 ? 'Needs attention' : 'All clear'}
        accent={urgentCount > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}
        icon={<AlertIcon />}
      />
      <StatCard
        label="Total views"
        value={totalViews}
        note="Reach so far"
        accent="bg-[#e6f6f4] text-[#00a896]"
        icon={<EyeIcon className="h-5 w-5" />}
      />
      <StatCard
        label="Latest"
        value={latest ? latest.title : 'None yet'}
        note={latest ? timeAgo(latest.publishDate) : undefined}
        accent="bg-purple-50 text-purple-600"
        icon={<ClockIcon className="h-5 w-5" />}
      />
    </div>
  );
}

/* ---------- Loading skeleton ---------- */
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-2xl bg-gray-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
}

/* ---------- Empty state ---------- */
function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#cfd4dd] bg-white px-6 py-14 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e6f6f4] text-[#073b78]">
        <MegaphoneIcon className="h-9 w-9" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-[#003b78]">No announcements yet</h3>
      <p className="mt-1 max-w-sm text-sm text-[#555962]">
        Share news, updates or urgent notices with your school community. Your first
        announcement will show up here.
      </p>
      <Link
        href="/announcements/create"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#00a896] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008f80]"
      >
        <span className="text-lg leading-none">+</span>
        Create your first announcement
      </Link>
    </div>
  );
}

/* ---------- Main component ---------- */
export default function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [newestFirst, setNewestFirst] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
        if (data.length > 0) setSelectedId(data[0].id);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to load announcements.'
        );
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = announcements.filter((a) => {
      const matchesFilter = filter === 'all' || groupOf(a.priority) === filter;
      const matchesSearch =
        !term ||
        a.title.toLowerCase().includes(term) ||
        a.content.toLowerCase().includes(term);
      return matchesFilter && matchesSearch;
    });
    return list.sort((x, y) => {
      const diff =
        new Date(y.publishDate).getTime() - new Date(x.publishDate).getTime();
      return newestFirst ? diff : -diff;
    });
  }, [announcements, search, filter, newestFirst]);

  const selected = visible.find((a) => a.id === selectedId) ?? visible[0];

  if (isLoading) return <LoadingSkeleton />;

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {errorMessage}
      </div>
    );
  }

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'emergency', label: 'Emergency' },
    { key: 'urgent', label: 'Urgent' },
    { key: 'general', label: 'General' },
  ];

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes ann-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ann-fade-up { animation: ann-fade-up 0.4s ease both; }
      `}</style>

      <PageHeader count={announcements.length} />
      <StatsRow announcements={announcements} />

      {announcements.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* TOOLBAR */}
          <div className="flex flex-col gap-3 rounded-2xl border border-[#e2e6ee] bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search announcements..."
                className="w-full rounded-lg border border-[#cfd4dd] bg-[#f7f9fa] py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#073b78] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#073b78]/15"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    filter === f.key
                      ? 'bg-[#073b78] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
              <button
                onClick={() => setNewestFirst((v) => !v)}
                className="rounded-full border border-[#cfd4dd] px-4 py-1.5 text-sm font-semibold text-[#073b78] transition hover:bg-gray-50"
              >
                {newestFirst ? 'Newest first' : 'Oldest first'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* LEFT: LIST */}
            <div className="space-y-4 lg:col-span-2">
              {visible.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#cfd4dd] bg-white px-6 py-12 text-center text-sm text-[#64748b]">
                  No announcements match your search or filter.
                </div>
              )}

              {visible.map((a, i) => {
                const tone = toneOf(a.priority);
                const isSelected = selected?.id === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setSelectedId(a.id)}
                    style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
                    className={`ann-fade-up group relative w-full overflow-hidden rounded-2xl border bg-white p-5 pl-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                      isSelected
                        ? 'border-[#073b78] ring-1 ring-[#073b78]'
                        : 'border-[#e2e6ee]'
                    }`}
                  >
                    <span className={`absolute inset-y-0 left-0 w-1.5 ${tone.bar}`} />

                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone.iconWrap}`}
                      >
                        {isUrgent(a.priority) ? <AlertIcon /> : <MegaphoneIcon />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h2 className="truncate text-base font-bold text-gray-900">
                            {a.title}
                          </h2>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${tone.badge}`}
                          >
                            {tone.label}
                          </span>
                        </div>

                        <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">
                          {a.content}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                          <span className="inline-flex items-center gap-1">
                            <UserIcon className="h-3.5 w-3.5" />
                            {a.postedBy?.name ?? 'Unknown'}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <ClockIcon className="h-3.5 w-3.5" />
                            {timeAgo(a.publishDate)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <EyeIcon className="h-3.5 w-3.5" />
                            {a.reachAnalytics?.totalViews ?? 0} views
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT: DETAIL */}
            <div className="lg:sticky lg:top-6 lg:h-fit">
              {selected ? (
                <div
                  key={selected.id}
                  className="ann-fade-up overflow-hidden rounded-2xl border border-[#e2e6ee] bg-white shadow-sm"
                >
                  <div
                    className={`bg-gradient-to-r ${toneOf(selected.priority).headerBg} p-5 text-white`}
                  >
                    <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide">
                      {toneOf(selected.priority).label}
                    </span>
                    <h2 className="mt-3 break-words text-xl font-bold leading-snug">
                      {selected.title}
                    </h2>
                  </div>

                  <div className="space-y-5 p-5">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-gray-50 p-3 text-center">
                        <UserIcon className="mx-auto h-4 w-4 text-[#073b78]" />
                        <p className="mt-1 truncate text-xs font-semibold text-gray-800">
                          {selected.postedBy?.name ?? 'Unknown'}
                        </p>
                        <p className="text-[10px] uppercase text-gray-400">Posted by</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3 text-center">
                        <ClockIcon className="mx-auto h-4 w-4 text-[#073b78]" />
                        <p className="mt-1 text-xs font-semibold text-gray-800">
                          {new Date(selected.publishDate).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] uppercase text-gray-400">Published</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3 text-center">
                        <EyeIcon className="mx-auto h-4 w-4 text-[#00a896]" />
                        <p className="mt-1 text-xs font-semibold text-gray-800">
                          {selected.reachAnalytics?.totalViews ?? 0}
                        </p>
                        <p className="text-[10px] uppercase text-gray-400">Views</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                        Message
                      </h3>
                      <p className="whitespace-pre-line break-words text-sm leading-relaxed text-gray-700">
                        {selected.content}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#cfd4dd] bg-white p-6 text-center text-sm text-gray-400">
                  Select an announcement to view details.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}