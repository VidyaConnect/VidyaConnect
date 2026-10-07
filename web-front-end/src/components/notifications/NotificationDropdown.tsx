'use client';

import Link from 'next/link';

import { useNotifications } from '@/context/NotificationContext';

function timeAgo(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const diff = Date.now() - date.getTime();

  const minutes = Math.floor(
    diff / (1000 * 60),
  );

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes} min${
      minutes === 1 ? '' : 's'
    } ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${
      hours === 1 ? '' : 's'
    } ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} day${
    days === 1 ? '' : 's'
  } ago`;
}

export default function NotificationDropdown({
  onClose,
}: {
  onClose: () => void;
}) {
  const {
    announcements,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const recentAnnouncements =
    announcements.slice(0, 5);

  return (
    <div className="absolute right-0 top-12 z-50 w-90 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Notifications
          </h3>

          <p className="text-xs text-slate-500">
            {unreadCount} unread
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
        )}
      </div>

      {isLoading && (
        <div className="p-6 text-center text-sm text-slate-500">
          Loading notifications...
        </div>
      )}

      {!isLoading && error && (
        <div className="p-5 text-center">
          <p className="text-sm font-medium text-red-600">
            Unable to load notifications
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {error}
          </p>
        </div>
      )}

      {!isLoading &&
        !error &&
        recentAnnouncements.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              No notifications
            </p>

            <p className="mt-1 text-xs text-slate-400">
              New announcements will appear here.
            </p>
          </div>
        )}

      {!isLoading &&
        !error &&
        recentAnnouncements.length > 0 && (
          <div className="max-h-105 overflow-y-auto">
            {recentAnnouncements.map(
              (announcement) => {
                const isUnread =
                  !false &&
                  unreadCount > 0;

                return (
                  <Link
                    key={announcement.id}
                    href="/announcements"
                    onClick={() => {
                      markAsRead(
                        announcement.id,
                      );

                      onClose();
                    }}
                    className={`block border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50 ${
                      isUnread
                        ? 'bg-blue-50/40'
                        : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                          isUnread
                            ? 'bg-blue-500'
                            : 'bg-slate-300'
                        }`}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-1 text-sm font-semibold text-slate-900">
                            {announcement.title}
                          </p>

                          <span className="shrink-0 text-[10px] text-slate-400">
                            {timeAgo(
                              announcement.publishDate,
                            )}
                          </span>
                        </div>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                          {announcement.content}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              },
            )}
          </div>
        )}

      <div className="border-t border-slate-100 px-4 py-3">
        <Link
          href="/announcements"
          onClick={onClose}
          className="block text-center text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          View all announcements
        </Link>
      </div>
    </div>
  );
}