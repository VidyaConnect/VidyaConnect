import { getAccessToken } from "../../auth/services/tokenStorage";

const BASE =
  process.env.EXPO_PUBLIC_CALENDAR_API_URL ?? "http://localhost:3010";

export type EventType =
  | "holiday"
  | "exam"
  | "meeting"
  | "event"
  | "deadline"
  | "trip"
  | "maintenance"
  | "update"
  | "training";

export interface ApiEvent {
  id: string;
  title: string;
  description: string | null;
  type: EventType;
  scope: "PLATFORM" | "SCHOOL" | "CLASS";
  start: string; // ISO
  end: string; // ISO
  allDay: boolean;
  location: string | null;
}

// Read-only: parents can only view events
export async function fetchEvents(from: Date, to: Date): Promise<ApiEvent[]> {
  const token = await getAccessToken();

  const res = await fetch(
    `${BASE}/calendar/events?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );

  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.message || "Failed to load events");
  return body as ApiEvent[];
}