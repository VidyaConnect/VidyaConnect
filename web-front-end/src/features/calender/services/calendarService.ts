import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CalendarEvent, CalendarRole, EventInput, OverlapResponse } from '../types';

const BASE = process.env.NEXT_PUBLIC_CALENDAR_API_URL ?? 'http://localhost:3010';

// Thrown on HTTP 409 so the form modal can show "Publish anyway"
export class OverlapError extends Error {
  overlaps: CalendarEvent[];
  constructor(body: OverlapResponse) {
    super(body.message || 'This slot overlaps with existing events');
    this.name = 'OverlapError';
    this.overlaps = body.overlaps ?? [];
  }
}

// Works whether the API returns the data directly or wrapped as { data }
async function parse<T>(res: Response, fallback: string): Promise<T> {
  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (res.status === 409) throw new OverlapError(body as OverlapResponse);
  if (!res.ok) throw new Error(body?.message || fallback);

  return (body && 'data' in body ? body.data : body) as T;
}

const json = { 'Content-Type': 'application/json' };

// `_role` is kept so existing callers don't break; the backend reads the role from the token.
export async function fetchEvents(
  _role: CalendarRole,
  from: string,
  to: string
): Promise<CalendarEvent[]> {
  const res = await fetchWithAuth(
    `${BASE}/calendar/events?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  );
  return parse<CalendarEvent[]>(res, 'Failed to load events');
}

export async function createEvent(
  _role: CalendarRole,
  input: EventInput
): Promise<CalendarEvent> {
  const res = await fetchWithAuth(`${BASE}/calendar/events`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify(input),
  });
  return parse<CalendarEvent>(res, 'Failed to create event');
}

export async function updateEvent(
  _role: CalendarRole,
  id: string,
  input: EventInput
): Promise<CalendarEvent> {
  const res = await fetchWithAuth(`${BASE}/calendar/events/${id}`, {
    method: 'PUT',
    headers: json,
    body: JSON.stringify(input),
  });
  return parse<CalendarEvent>(res, 'Failed to update event');
}

export async function deleteEvent(_role: CalendarRole, id: string): Promise<void> {
  const res = await fetchWithAuth(`${BASE}/calendar/events/${id}`, { method: 'DELETE' });
  await parse<unknown>(res, 'Failed to delete event');
}

// Preview overlaps without saving (POST /calendar/events/conflicts)
export async function checkConflicts(input: EventInput): Promise<CalendarEvent[]> {
  const res = await fetchWithAuth(`${BASE}/calendar/events/conflicts`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify(input),
  });
  const data = await parse<any>(res, 'Failed to check conflicts');
  return Array.isArray(data) ? data : data?.overlaps ?? [];
}