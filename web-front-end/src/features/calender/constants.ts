import { CalendarRole, EventType } from './types';

export const EVENT_TYPES: {
  value: EventType;
  label: string;
  chip: string;
  dot: string;
  bar: string;
}[] = [
  { value: 'holiday', label: 'Holiday', chip: 'bg-red-50 text-red-700', dot: 'bg-red-500', bar: 'border-red-500' },
  { value: 'exam', label: 'Exam', chip: 'bg-amber-50 text-amber-800', dot: 'bg-amber-500', bar: 'border-amber-500' },
  { value: 'meeting', label: 'Meeting', chip: 'bg-indigo-50 text-indigo-700', dot: 'bg-indigo-500', bar: 'border-indigo-500' },
  { value: 'event', label: 'Event', chip: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500', bar: 'border-emerald-500' },
  { value: 'deadline', label: 'Deadline', chip: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500', bar: 'border-rose-500' },
  { value: 'trip', label: 'Trip', chip: 'bg-sky-50 text-sky-700', dot: 'bg-sky-500', bar: 'border-sky-500' },
  { value: 'maintenance', label: 'Maintenance', chip: 'bg-orange-50 text-orange-700', dot: 'bg-orange-500', bar: 'border-orange-500' },
  { value: 'update', label: 'System Update', chip: 'bg-violet-50 text-violet-700', dot: 'bg-violet-500', bar: 'border-violet-500' },
  { value: 'training', label: 'Training', chip: 'bg-teal-50 text-teal-700', dot: 'bg-teal-500', bar: 'border-teal-500' },
];

const SCHOOL_TYPES: EventType[] = ['holiday', 'exam', 'meeting', 'event', 'deadline', 'trip'];
const PLATFORM_TYPES: EventType[] = ['holiday', 'maintenance', 'update', 'training', 'deadline', 'event'];

// Types a role may pick in the form
export const typesForRole = (role: CalendarRole) =>
  EVENT_TYPES.filter((t) =>
    (role === 'ADMIN' ? PLATFORM_TYPES : SCHOOL_TYPES).includes(t.value)
  );

export const getTypeMeta = (type: EventType) =>
  EVENT_TYPES.find((t) => t.value === type) ?? EVENT_TYPES[3];

// Chips shown in the filter bar
export const filterTypesForRole = (role: CalendarRole) =>
  role === 'ADMIN' ? typesForRole(role) : EVENT_TYPES;