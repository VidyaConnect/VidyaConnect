import { CalendarEvent } from '../types';
import { eventsOnDay, getWeekDays, isSameDay } from '../utils/dateHelpers';
import { EventChip } from './EventChip';

interface WeekGridProps {
  cursor: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDayClick?: (day: Date) => void;
}

export function WeekGrid({ cursor, events, onEventClick, onDayClick }: WeekGridProps) {
  const days = getWeekDays(cursor);
  const today = new Date();

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="grid min-w-[800px] grid-cols-7 border-l border-t border-slate-200">
        {days.map((day) => {
          const isToday = isSameDay(day, today);
          const dayEvents = eventsOnDay(events, day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDayClick?.(day)}
              className={`min-h-[360px] border-b border-r border-slate-200 ${
                onDayClick ? 'cursor-pointer hover:bg-slate-50' : ''
              }`}
            >
              <div
                className={`border-b border-slate-200 px-2 py-2 text-center ${
                  isToday ? 'bg-[#0b3d91] text-white' : 'bg-slate-50 text-slate-600'
                }`}
              >
                <div className="text-[11px] font-semibold uppercase tracking-wide">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-lg font-bold">{day.getDate()}</div>
              </div>

              <div className="space-y-1 p-1.5">
                {dayEvents.length === 0 ? (
                  <div className="pt-4 text-center text-[11px] text-slate-300">—</div>
                ) : (
                  dayEvents.map((ev) => (
                    <EventChip key={ev.id} event={ev} onClick={onEventClick} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}