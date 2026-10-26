import { CalendarEvent, EventType } from '../types';

export function CalendarStats({ events }: { events: CalendarEvent[] }) {
  const count = (t: EventType) => events.filter((e) => e.type === t).length;

  const cards = [
    { label: 'Events in view', value: events.length, color: 'text-[#073b78]', bar: 'bg-[#073b78]' },
    { label: 'Exams', value: count('exam'), color: 'text-amber-600', bar: 'bg-amber-500' },
    { label: 'Holidays', value: count('holiday'), color: 'text-red-600', bar: 'bg-red-500' },
    { label: 'Meetings', value: count('meeting'), color: 'text-indigo-600', bar: 'bg-indigo-500' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <span className={`absolute inset-y-0 left-0 w-1 ${c.bar}`} />
          <div className="pl-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {c.label}
            </div>
            <div className={`mt-1 text-3xl font-bold ${c.color}`}>{c.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}