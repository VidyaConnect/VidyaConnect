'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { useAuth } from '@/features/auth/hooks/userAuth';
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
}

const fallback: NotificationContextValue = {
  announcements: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  markAsRead: () => {},
  isRead: () => false,
  markAllAsRead: () => {},
};

const NotificationContext = createContext<NotificationContextValue>(fallback);

const READ_KEY = 'vidyaconnect_read_notifications';
const POLL_MS = 60_000;

function loadReadIds(): string[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(READ_KEY) ?? '[]');
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === 'string')
      : [];
  } catch {
    return [];
  }
}

function saveReadIds(ids: string[]) {
  try {
    window.localStorage.setItem(READ_KEY, JSON.stringify(ids));
  } catch {
    /* ignore storage errors */
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isInitialized } = useAuth();
  const isLoggedIn = isInitialized && !!user;

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inFlight = useRef(false);
  const stopped = useRef(false);

  useEffect(() => {
    const t = window.setTimeout(() => setReadIds(loadReadIds()), 0);
    return () => window.clearTimeout(t);
  }, []);

  const refresh = useCallback(async () => {
    if (inFlight.current || stopped.current) return;
    inFlight.current = true;
    try {
      setError(null);
      const data = await getAnnouncements();
      setAnnouncements(
        data
          .filter((a) => a.status === 'published')
          .sort(
            (a, b) =>
              new Date(b.publishDate).getTime() -
              new Date(a.publishDate).getTime(),
          ),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to load notifications.';
      setError(message);
      // Permission or session problems will not fix themselves, so stop polling.
      if (/401|403|denied|forbidden|unauthori/i.test(message)) {
        stopped.current = true;
      }
    } finally {
      inFlight.current = false;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    stopped.current = false;

    const first = window.setTimeout(() => {
      setIsLoading(true);
      void refresh();
    }, 0);

    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh();
    }, POLL_MS);

    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [isLoggedIn, refresh]);

  const markAsRead = useCallback((id: string) => {
    setReadIds((cur) => {
      if (cur.includes(id)) return cur;
      const next = [...cur, id];
      saveReadIds(next);
      return next;
    });
  }, []);

  const isRead = useCallback((id: string) => readIds.includes(id), [readIds]);

  const markAllAsRead = useCallback(() => {
    setReadIds((cur) => {
      const next = Array.from(
        new Set([...cur, ...announcements.map((a) => a.id)]),
      );
      saveReadIds(next);
      return next;
    });
  }, [announcements]);

  const unreadCount = useMemo(
    () => announcements.filter((a) => !readIds.includes(a.id)).length,
    [announcements, readIds],
  );

  const value = useMemo<NotificationContextValue>(
    () => ({
      announcements,
      unreadCount,
      isLoading,
      error,
      markAsRead,
      isRead,
      markAllAsRead,
    }),
    [announcements, unreadCount, isLoading, error, markAsRead, isRead, markAllAsRead],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}