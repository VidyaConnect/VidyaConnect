'use client';

import { useEffect, useState } from 'react';
import { Announcement } from '../types/announcement';
import { getAnnouncements, markAsViewed } from '../services/announcementService';

const TAG_STYLES: Record<string, { label: string; className: string; borderClass: string }> = {
  important: { label: 'IMPORTANT', className: 'bg-red-100 text-red-700', borderClass: 'border-t-4 border-t-red-600' },
  general: { label: 'GENERAL', className: 'bg-green-100 text-green-700', borderClass: '' },
  draft: { label: 'DRAFT', className: 'bg-yellow-100 text-yellow-700', borderClass: '' },
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

export default function TeacherAnnouncementFeed() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getAnnouncements();
      const sorted = [...data].sort((a, b) => {
        const rank = (t: string) => (t === 'important' ? 0 : 1);
        return rank(a.tag) - rank(b.tag);
      });
      setAnnouncements(sorted);
      setIsLoading(false);
    }
    loadData();
  }, []);

  async function handleView(id: string) {
    await markAsViewed(id);
    const updated = await getAnnouncements();
    setAnnouncements(updated);
  }

  if (isLoading) {
    return <p className="text-gray-500 text-sm p-6">Loading announcements...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">School Announcements</h1>
        <p className="text-gray-500 text-sm mt-1">
          Stay informed with the latest updates from school administration and departments.
          This is a read-only feed for official communication.
        </p>
      </div>

      {announcements.map((a) => {
        const badge = TAG_STYLES[a.tag] || TAG_STYLES.general;
        return (
          <div
            key={a.id}
            onClick={() => handleView(a.id)}
            className={`bg-white border border-gray-200 rounded-lg p-5 cursor-pointer hover:shadow-sm transition-shadow ${badge.borderClass}`}
          >
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${badge.className}`}>
              {badge.label}
            </span>
            <h2 className="text-lg font-bold text-gray-900 mt-2">{a.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{a.content}</p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-800">{a.postedBy.name}</p>
                <p className="text-xs text-gray-400 uppercase">
                  {a.postedBy.department || a.postedBy.role.replace('-', ' ')}
                </p>
              </div>
              <div className="text-right text-xs text-gray-400">
                <p>{(a.reachAnalytics?.totalViews ?? 0).toLocaleString()} views</p>
                <p>{timeAgo(a.publishDate)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
