'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getAnnouncements } from '@/features/announcements/services/announcementService';
import type { Announcement } from '@/features/announcements/types/announcement';

interface NotificationContextValue {
  announcements: Announcement[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (id: string) => void;
  isRead: (id: string) => boolean;
  markAllAsRead: () => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext =
  createContext<NotificationContextValue | undefined>(undefined);

const READ_STORAGE_KEY = 'vidyaconnect_read_notifications';

function getReadIds(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(READ_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

function saveReadIds(ids: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    READ_STORAGE_KEY,
    JSON.stringify(ids),
  );
}

export function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setReadIds(getReadIds());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      setError(null);

      const data = await getAnnouncements();

      const publishedAnnouncements = data
        .filter(
          (announcement) =>
            announcement.status === 'published',
        )
        .sort(
          (a, b) =>
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime(),
        );

      setAnnouncements(publishedAnnouncements);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to load notifications.';

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void refreshNotifications();
    }, 0);

    const interval = window.setInterval(() => {
      refreshNotifications();
    }, 5000);

    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [refreshNotifications]);

  const markAsRead = useCallback((id: string) => {
    setReadIds((current) => {
      if (current.includes(id)) {
        return current;
      }

      const updated = [...current, id];

      saveReadIds(updated);

      return updated;
    });
  }, []);

  const isRead = useCallback((id: string) => readIds.includes(id), [readIds]);

  const markAllAsRead = useCallback(() => {
    setReadIds((current) => {
      const allIds = announcements.map(
        (announcement) => announcement.id,
      );

      const updated = Array.from(
        new Set([...current, ...allIds]),
      );

      saveReadIds(updated);

      return updated;
    });
  }, [announcements]);

  const unreadCount = useMemo(() => {
    return announcements.filter(
      (announcement) => !readIds.includes(announcement.id),
    ).length;
  }, [announcements, readIds]);

  const value = useMemo<NotificationContextValue>(
    () => ({
      announcements,
      unreadCount,
      isLoading,
      error,
      markAsRead,
      isRead,
      markAllAsRead,
      refreshNotifications,
    }),
    [
      announcements,
      unreadCount,
      isLoading,
      error,
      markAsRead,
      isRead,
      markAllAsRead,
      refreshNotifications,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotifications must be used inside NotificationProvider',
    );
  }

  return context;
}