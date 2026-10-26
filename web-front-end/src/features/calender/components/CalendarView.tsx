'use client';

import { useMemo, useState } from 'react';
import {
  CalendarEvent,
  CalendarRole,
  CalendarViewMode,
  EventInput,
  EventType,
} from '../types';
import { EVENT_TYPES } from '../constants';
import { PERMISSIONS } from '../permissions';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import {
  createEvent,
  deleteEvent,
  updateEvent,
  OverlapError,
} from '../services/calendarService';
import { addDays, getVisibleRange, getWeekDays } from '../utils/dateHelpers';
import { CalendarToolbar } from './CalendarToolBar';
import { CalendarFilters } from './CalendarFilters';
import { MonthGrid } from './MonthGrid';
import { WeekGrid } from './WeekGrid';
import { EventDetailsModal } from './EventDetailsModal';
import { EventFormModal } from './EventFormModal';
import { UpcomingEvents } from './UpcomingEvents';
import { CalendarStats } from './CalendarStats';

interface FormState {
  open: boolean;
  event?: CalendarEvent;
  date?: Date;
}

export function CalendarView({ role }: { role: CalendarRole }) {
  const perms = PERMISSIONS[role];

  const [cursor, setCursor] = useState(new Date());
  const [mode, setMode] = useState<CalendarViewMode>('month');
  const [activeTypes, setActiveTypes] = useState<EventType[]>(
    EVENT_TYPES.map((t) => t.value)
  );
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const [form, setForm] = useState<FormState>({ open: false });
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const [overlaps, setOverlaps] = useState<CalendarEvent[]>([]);

  const { from, to } = useMemo(() => getVisibleRange(cursor, mode), [cursor, mode]);
  const { events, loading, error, refetch } = useCalendarEvents(role, from, to);

  const visibleEvents = events.filter((e) => activeTypes.includes(e.type));

  /* ---------- navigation ---------- */
  const goPrev = () =>
    setCursor((c) =>
      mode === 'month' ? new Date(c.getFullYear(), c.getMonth() - 1, 1) : addDays(c, -7)
    );
  const goNext = () =>
    setCursor((c) =>
      mode === 'month' ? new Date(c.getFullYear(), c.getMonth() + 1, 1) : addDays(c, 7)
    );

  const label = useMemo(() => {
    if (mode === 'month') {
      return cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    const days = getWeekDays(cursor);
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(days[0])} – ${fmt(days[6])}, ${days[6].getFullYear()}`;
  }, [cursor, mode]);

  /* ---------- filters ---------- */
  const toggleType = (type: EventType) =>
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  /* ---------- create / edit / delete ---------- */
  const closeForm = () => {
    setForm({ open: false });
    setOverlaps([]);
    setActionError('');
  };

  const handleSave = async (input: EventInput, id?: string) => {
    setSaving(true);
    setActionError('');
    setOverlaps([]);
    try {
      if (id) await updateEvent(role, id, input);
      else await createEvent(role, input);
      closeForm();
      setSelected(null);
      refetch();
    } catch (e) {
      if (e instanceof OverlapError) {
        // 409: keep the form open and show the clashing events
        setOverlaps(e.overlaps);
      } else {
        setActionError(e instanceof Error ? e.message : 'Something went wrong');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (event: CalendarEvent) => {
    if (!window.confirm(`Delete "${event.title}"?`)) return;
    setActionError('');
    try {
      await deleteEvent(role, event.id);
      setSelected(null);
      refetch();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Something went wrong');
    }
  };

  const onDayClick = perms.canCreate
    ? (day: Date) => setForm({ open: true, date: day })
    : undefined;

  return (
    <div className="space-y-5">
      <CalendarStats events={visibleEvents} />

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <CalendarToolbar
            label={label}
            mode={mode}
            canCreate={perms.canCreate}
            onPrev={goPrev}
            onNext={goNext}
            onToday={() => setCursor(new Date())}
            onModeChange={setMode}
            onAdd={() => setForm({ open: true })}
          />

          <CalendarFilters role={role} active={activeTypes} onToggle={toggleType} />

          {(error || (actionError && !form.open)) && (
            <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error || actionError}
            </div>
          )}

          <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            {mode === 'month' ? (
              <MonthGrid
                cursor={cursor}
                events={visibleEvents}
                onEventClick={setSelected}
                onDayClick={onDayClick}
                onMoreClick={(day) => {
                  setCursor(day);
                  setMode('week');
                }}
              />
            ) : (
              <WeekGrid
                cursor={cursor}
                events={visibleEvents}
                onEventClick={setSelected}
                onDayClick={onDayClick}
              />
            )}
          </div>
        </div>

        <UpcomingEvents events={visibleEvents} onEventClick={setSelected} />
      </div>

      {selected && !form.open && (
        <EventDetailsModal
          event={selected}
          permissions={perms}
          onClose={() => setSelected(null)}
          onEdit={(ev) => setForm({ open: true, event: ev })}
          onDelete={handleDelete}
        />
      )}

      {form.open && (
        <EventFormModal
          event={form.event}
          defaultDate={form.date}
          saving={saving}
          role={role}
          overlaps={overlaps}
          serverError={actionError}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
}