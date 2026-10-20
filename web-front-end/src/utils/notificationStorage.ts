/**
 * TEMPORARY frontend-only read-state storage.
 * Not permanent/server-side/per-user tracking — just a browser-local record
 * of which announcement IDs this browser has already seen. Safe to replace
 * later with real backend tracking; nothing else needs to change except
 * the calls made from NotificationBell.tsx.
 */

const STORAGE_KEY = 'vidyaconnect_read_announcements';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getReadAnnouncementIds(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
}

function saveReadAnnouncementIds(ids: string[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(new Set(ids))));
  } catch {
    // localStorage unavailable/full/blocked — fail silently.
  }
}

export function markAnnouncementAsRead(id: string): void {
  const current = getReadAnnouncementIds();
  if (current.includes(id)) return;
  saveReadAnnouncementIds([...current, id]);
}

export function markAllAsRead(ids: string[]): void {
  saveReadAnnouncementIds([...getReadAnnouncementIds(), ...ids]);
}