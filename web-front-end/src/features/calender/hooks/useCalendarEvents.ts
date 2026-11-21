'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchEvents } from '../services/calendarService';
import { CalendarEvent, CalendarRole } from '../types';

export function useCalendarEvents(role: CalendarRole, from: Date, to: Date) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  const fromMs = from.getTime();
  const toMs = to.getTime();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchEvents(role, new Date(fromMs).toISOString(), new Date(toMs).toISOString())
      .then((data) => {
        if (!cancelled) setEvents(data);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [role, fromMs, toMs, version]);

  return { events, loading, error, refetch };
}