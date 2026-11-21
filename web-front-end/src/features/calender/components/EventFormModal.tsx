'use client';

import { FormEvent, useState } from 'react';
import { CalendarEvent, CalendarRole, EventInput, EventType } from '../types';
import { typesForRole } from '../constants';
import { fromInputValue, toInputValue } from '../utils/dateHelpers';
import { Modal } from './Modal';

interface EventFormModalProps {
  event?: CalendarEvent; // present = edit mode
  defaultDate?: Date; // used when creating from a day click
  saving: boolean;
  role: CalendarRole;
  overlaps?: CalendarEvent[]; // from the 409 response
  serverError?: string;
  onClose: () => void;
  onSave: (input: EventInput, id?: string) => void;
}

const fmtRange = (e: CalendarEvent) => {
  const s = new Date(e.start);
  const en = new Date(e.end);
  if (e.allDay) {
    return `${s.toLocaleDateString()} (all day)`;
  }
  return `${s.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} – ${en.toLocaleTimeString([], { timeStyle: 'short' })}`;
};

export function EventFormModal({
  event,
  defaultDate,
  saving,
  role,
  overlaps = [],
  serverError,
  onClose,
  onSave,
}: EventFormModalProps) {
  const base = defaultDate ?? new Date();
  const defaultStart = new Date(base);
  if (!defaultDate) defaultStart.setMinutes(0, 0, 0);
  else defaultStart.setHours(9, 0, 0, 0);
  const defaultEnd = new Date(defaultStart.getTime() + 60 * 60 * 1000);

  const [title, setTitle] = useState(event?.title ?? '');
  const [type, setType] = useState<EventType>(event?.type ?? 'event');
  const [allDay, setAllDay] = useState(event?.allDay ?? false);
  const [start, setStart] = useState(
    toInputValue(event?.start ?? defaultStart.toISOString(), event?.allDay ?? false)
  );
  const [end, setEnd] = useState(
    toInputValue(event?.end ?? defaultEnd.toISOString(), event?.allDay ?? false)
  );
  const [location, setLocation] = useState(event?.location ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [error, setError] = useState('');
  const [lastInput, setLastInput] = useState<EventInput | null>(null);
  const isDeadline = type === 'deadline';

  // Convert the input values when toggling all-day
  const toggleAllDay = (checked: boolean) => {
    const s = fromInputValue(start, allDay, 'start');
    const e = fromInputValue(end, allDay, 'end');
    setAllDay(checked);
    setStart(toInputValue(s, checked));
    setEnd(toInputValue(e, checked));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setError('Title is required.');
    if (!end || (!isDeadline && !start))
      return setError(isDeadline ? 'Due date is required.' : 'Start and end are required.');

    const endIso = fromInputValue(end, allDay, 'end');
    // A deadline has no start: use the due date for both
    const startIso = isDeadline ? endIso : fromInputValue(start, allDay, 'start');
    if (!isDeadline && new Date(endIso) < new Date(startIso))
      return setError('End must be after start.');

    setError('');
    const input: EventInput = {
      title: title.trim(),
      type,
      allDay,
      start: startIso,
      end: endIso,
      location: location.trim() || undefined,
      description: description.trim() || undefined,
    };
    setLastInput(input);
    onSave(input, event?.id);
  };

  // Resend the same data, telling the backend the overlap is OK
  const publishAnyway = () => {
    if (!lastInput) return;
    onSave({ ...lastInput, confirmOverlap: true }, event?.id);
  };

  const input =
    'w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0b3d91] focus:ring-1 focus:ring-[#0b3d91]';
  const label = 'mb-1 block text-xs font-semibold uppercase text-slate-500';

  return (
    <Modal title={event ? 'Edit Event' : 'Add Event'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className={label}>Title</label>
          <input
            className={input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sports Day"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Type</label>
            <select
              className={input}
              value={type}
              onChange={(e) => setType(e.target.value as EventType)}
            >
              {typesForRole(role).map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-end gap-2 pb-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => toggleAllDay(e.target.checked)}
              className="h-4 w-4"
            />
            All day
          </label>
        </div>

        <div className={isDeadline ? '' : 'grid grid-cols-2 gap-3'}>
          {!isDeadline && (
            <div>
              <label className={label}>Start</label>
              <input
                type={allDay ? 'date' : 'datetime-local'}
                className={input}
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className={label}>{isDeadline ? 'Due' : 'End'}</label>
            <input
              type={allDay ? 'date' : 'datetime-local'}
              className={input}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={label}>Location (optional)</label>
          <input
            className={input}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label className={label}>Description (optional)</label>
          <textarea
            className={input}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {overlaps.length > 0 && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3">
            <p className="text-sm font-semibold text-amber-800">
              This overlaps with {overlaps.length} existing{' '}
              {overlaps.length === 1 ? 'event' : 'events'}:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-amber-900">
              {overlaps.map((o) => (
                <li key={o.id}>
                  <span className="font-medium">{o.title}</span>
                  <span className="text-amber-700"> · {fmtRange(o)}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={publishAnyway}
              disabled={saving}
              className="mt-3 rounded-md bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {saving ? 'Publishing…' : 'Publish anyway'}
            </button>
          </div>
        )}

        {(error || serverError) && (
          <p className="text-sm text-red-600">{error || serverError}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-[#0b3d91] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}