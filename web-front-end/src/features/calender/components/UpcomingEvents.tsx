import { CalendarEvent } from '../types';
import { getTypeMeta } from '../constants';
import { formatTime } from '../utils/dateHelpers';

interface UpcomingEventsProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function UpcomingEvents({ events, onEventClick }: UpcomingEventsProps) {
  const now = Date.now();
  const upcoming = events
    .filter((e) => new Date(e.end).getTime() >= now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 6);

  return (
    <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#073b78]">Coming Up</h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
          {upcoming.length}
        </span>
      </div>

      {upcoming.length === 0 ? (
        <p className="mt-6 text-center text-sm text-slate-400">No upcoming events.</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {upcoming.map((ev) => {
            const meta = getTypeMeta(ev.type);
            const d = new Date(ev.start);
            return (
              <li key={ev.id}>
                <button
                  onClick={() => onEventClick(ev)}
                  className="flex w-full items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-left transition hover:border-slate-200 hover:bg-slate-100"
                >
                  <div className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg ${meta.chip}`}>
                    <span className="text-[10px] font-bold uppercase leading-none">
                      {d.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-lg font-bold leading-tight">{d.getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-800">
                      {ev.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {meta.label} · {ev.allDay ? 'All day' : formatTime(ev.start)}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}