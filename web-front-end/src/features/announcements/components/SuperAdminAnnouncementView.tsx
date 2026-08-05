'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Announcement, AnnouncementTag } from '../types/announcement';
import { getAnnouncements } from '../services/announcementService';

const TAG_STYLES: Record<string, { label: string; className: string; borderClass: string }> = {
  important: { label: 'IMPORTANT', className: 'bg-red-100 text-red-700', borderClass: 'border-l-4 border-l-red-600' },
  general: { label: 'GENERAL', className: 'bg-green-100 text-green-700', borderClass: 'border-l-4 border-l-green-600' },
  draft: { label: 'DRAFT', className: 'bg-yellow-100 text-yellow-700', borderClass: 'border-l-4 border-l-yellow-500' },
};

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

type FilterTab = 'all' | 'general' | 'important' | 'draft';

export default function SuperAdminAnnouncementView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getAnnouncements();
      const platformOnly = data.filter((a) => a.postedBy.role === 'super-admin');
      setAnnouncements(platformOnly);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filtered = announcements.filter((a) => {
    if (filter === 'all') return true;
    return a.tag === (filter as AnnouncementTag);
  });

  const importantCount = announcements.filter((a) => a.tag === 'important').length;

  if (isLoading) {
    return <p className="text-gray-500 text-sm p-6">Loading platform announcements...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Announcements</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> {importantCount} Important
            </span>
            <span>Real-time infrastructure health monitor</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-50">
            ↓ Export Report
          </button>
          <Link
            href="/announcements/super-admin-compose"
            className="bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-800"
          >
            + New Announcement
          </Link>
        </div>
      </div>

      <div className="bg-blue-950 text-white rounded-lg p-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-blue-200 uppercase tracking-wide">Uptime Integrity</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-4xl font-bold">99.82%</span>
            <span className="bg-green-500/20 text-green-300 text-xs font-medium px-2 py-1 rounded">
              +0.04% vs yesterday
            </span>
          </div>
          <div className="w-80 max-w-full bg-white/10 rounded-full h-1.5 mt-3">
            <div className="bg-green-400 h-1.5 rounded-full" style={{ width: '99.82%' }} />
          </div>
          <p className="text-xs text-blue-200 mt-2">✓ Healthy across 1,204 schools globally</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'general', 'important', 'draft'] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
              filter === tab ? 'bg-blue-950 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-10">No alerts match this filter.</p>
        )}
        {filtered.map((a) => {
          const badge = TAG_STYLES[a.tag] || TAG_STYLES.general;
          return (
            <div key={a.id} className={`bg-white border border-gray-200 rounded-lg p-5 ${badge.borderClass}`}>
              <div className="flex items-start justify-between">
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${badge.className}`}>
                  {badge.label}
                </span>
                <span className="text-xs text-gray-400">{timeAgo(a.publishDate)}</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mt-2">{a.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{a.content}</p>
              <div className="flex items-center justify-between mt-3">
                {a.source && <span className="text-xs text-gray-400">📍 {a.source}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-2">
        <button className="border border-gray-300 text-gray-700 text-sm font-medium px-5 py-2 rounded-md hover:bg-gray-50">
          Load Archive Alerts
        </button>
      </div>
    </div>
  );
}
