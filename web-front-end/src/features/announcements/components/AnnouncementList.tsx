'use client';

import { useEffect, useState } from 'react';
import { Announcement } from '../types/announcement';
import { getAnnouncements, markAsViewed } from '../services/announcementService';

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  emergency: 'bg-red-100 text-red-700',
  urgent: 'bg-yellow-100 text-yellow-700',
  warning: 'bg-yellow-100 text-yellow-700',
  update: 'bg-green-100 text-green-700',
  info: 'bg-blue-100 text-blue-700',
  normal: 'bg-gray-100 text-gray-700',
};

export default function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getAnnouncements();
      setAnnouncements(data);
      if (data.length > 0) setSelectedId(data[0].id);
      setIsLoading(false);
    }
    loadData();
  }, []);

  async function handleSelect(id: string) {
    setSelectedId(id);
    await markAsViewed(id);
    const updated = await getAnnouncements();
    setAnnouncements(updated);
  }

  const selected = announcements.find((a) => a.id === selectedId);

  if (isLoading) {
    return <p className="text-gray-500 text-sm p-6">Loading announcements...</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT: List */}
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-500 text-sm">
              Manage global alerts, school updates, and internal communications.
            </p>
          </div>
          <a
            href="/announcements/create"
            className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
          >
            + Post New Announcement
          </a>
        </div>

        <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
          {announcements.map((a) => (
            <button
              key={a.id}
              onClick={() => handleSelect(a.id)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${
                selectedId === a.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{a.title}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    PRIORITY_STYLES[a.priority] || PRIORITY_STYLES.normal
                  }`}
                >
                  {a.priority}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate mt-1">{a.content}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                <span>{a.postedBy.name}</span>
                <span>·</span>
                <span>{new Date(a.publishDate).toLocaleDateString()}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: Detail panel */}
      <div className="border border-gray-200 rounded-lg p-5">
        {selected ? (
          <>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              ACTIVE DETAIL
            </span>
            <h2 className="text-xl font-bold text-gray-900 mt-3">{selected.title}</h2>
            <p className="text-xs text-gray-400 mt-1">
              Published {new Date(selected.publishDate).toLocaleDateString()} ·{' '}
              {selected.reachAnalytics?.totalViews ?? 0} Views
            </p>

            <div className="mt-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Content Preview
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">{selected.content}</p>
            </div>

            {selected.reachAnalytics && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase">
                    Reach Analytics
                  </h3>
                </div>
                {selected.reachAnalytics.parentsPercent !== undefined && (
                  <ReachBar label="Parents" percent={selected.reachAnalytics.parentsPercent} />
                )}
                {selected.reachAnalytics.facultyPercent !== undefined && (
                  <ReachBar label="Faculty" percent={selected.reachAnalytics.facultyPercent} />
                )}
                {selected.reachAnalytics.alumniPercent !== undefined && (
                  <ReachBar label="Alumni" percent={selected.reachAnalytics.alumniPercent} />
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-400 text-sm">Select an announcement to view details.</p>
        )}
      </div>
    </div>
  );
}

function ReachBar({ label, percent }: { label: string; percent: number }) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
        <span>{label}</span>
        <span className="font-medium">{percent}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="bg-green-600 h-1.5 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}