import { CalendarEvent, CalendarViewMode } from '../types';

export const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const endOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};

export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const startOfWeek = (d: Date) => addDays(startOfDay(d), -d.getDay());

export const isSameDay = (a: Date, b: Date) =>
  a.toDateString() === b.toDateString();

export function getMonthGridDays(cursor: Date): Date[] {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = startOfWeek(first);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

export function getWeekDays(cursor: Date): Date[] {
  const start = startOfWeek(cursor);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function getVisibleRange(cursor: Date, mode: CalendarViewMode) {
  const days = mode === 'month' ? getMonthGridDays(cursor) : getWeekDays(cursor);
  return { from: startOfDay(days[0]), to: endOfDay(days[days.length - 1]) };
}

export function eventsOnDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  const s = startOfDay(day).getTime();
  const e = endOfDay(day).getTime();
  return events
    .filter(
      (ev) =>
        new Date(ev.start).getTime() <= e && new Date(ev.end).getTime() >= s
    )
    .sort((a, b) => {
      if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });
}

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export function formatEventWhen(ev: CalendarEvent): string {
  const sameDay = isSameDay(new Date(ev.start), new Date(ev.end));
  if (ev.allDay) {
    return sameDay
      ? `${formatDate(ev.start)} · All day`
      : `${formatDate(ev.start)} → ${formatDate(ev.end)}`;
  }
  return sameDay
    ? `${formatDate(ev.start)} · ${formatTime(ev.start)} – ${formatTime(ev.end)}`
    : `${formatDate(ev.start)} ${formatTime(ev.start)} → ${formatDate(ev.end)} ${formatTime(ev.end)}`;
}

const pad = (n: number) => String(n).padStart(2, '0');

// ISO -> value for <input type="date"> or <input type="datetime-local">
export function toInputValue(iso: string, allDay: boolean): string {
  const d = new Date(iso);
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return allDay ? date : `${date}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// input value -> ISO
export function fromInputValue(
  value: string,
  allDay: boolean,
  edge: 'start' | 'end'
): string {
  if (allDay) {
    const t = edge === 'start' ? '00:00:00' : '23:59:00';
    return new Date(`${value}T${t}`).toISOString();
  }
  return new Date(value).toISOString();
}