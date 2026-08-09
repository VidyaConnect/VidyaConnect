'use client';

import { useEffect, useState } from 'react';

interface BackendAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'SYSTEM' | 'SCHOOL';
  priority: 'NORMAL' | 'URGENT' | 'EMERGENCY';
  createdByUserId: string;
  publishedAt: string;
}

const TAG_STYLES: Record<string, { label: string; className: string; borderClass: string }> = {
  URGENT: { label: 'IMPORTANT', className: 'bg-red-100 text-red-700', borderClass: 'border-t-4 border-t-red-600' },
  EMERGENCY: { label: 'IMPORTANT', className: 'bg-red-100 text-red-700', borderClass: 'border-t-4 border-t-red-600' },
  NORMAL: { label: 'GENERAL', className: 'bg-green-100 text-green-700', borderClass: '' },
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

export default function StudentAnnouncementFeed() {
  const [announcements, setAnnouncements] = useState<BackendAnnouncement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('http://localhost:3002/api/announcements/student-feed');
        const json = await res.json();
        if (json.success) {
          setAnnouncements(json.data);
        } else {
          setError(json.message || 'Failed to load announcements.');
        }
      } catch {
        setError('Could not connect to the announcement service.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return <p className="text-gray-500 text-sm p-6">Loading announcements...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm p-6">{error}</p>;
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

      {announcements.length === 0 && (
        <p className="text-gray-400 text-sm">No announcements yet.</p>
      )}

      {announcements.map((a) => {
        const badge = TAG_STYLES[a.priority] || TAG_STYLES.NORMAL;
        return (
          <div
            key={a.id}
            className={`bg-white border border-gray-200 rounded-lg p-5 ${badge.borderClass}`}
          >
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${badge.className}`}>
              {badge.label}
            </span>
            <h2 className="text-lg font-bold text-gray-900 mt-2">{a.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{a.content}</p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-800">{a.createdByUserId}</p>
                <p className="text-xs text-gray-400 uppercase">
                  {a.type === 'SYSTEM' ? 'Super Admin' : 'School Admin'}
                </p>
              </div>
              <div className="text-right text-xs text-gray-400">
                <p>{timeAgo(a.publishedAt)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
