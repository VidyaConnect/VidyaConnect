import { CalendarEvent } from '../types';
import { eventsOnDay, getMonthGridDays, isSameDay } from '../utils/dateHelpers';
import { EventChip } from './EventChip';

interface MonthGridProps {
  cursor: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDayClick?: (day: Date) => void;
  onMoreClick?: (day: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_VISIBLE = 3;

export function MonthGrid({
  cursor,
  events,
  onEventClick,
  onDayClick,
  onMoreClick,
}: MonthGridProps) {
  const days = getMonthGridDays(cursor);
  const today = new Date();

  return (
    <div className="mt-5 overflow-x-auto">
      <div className="min-w-[760px] overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const inMonth = day.getMonth() === cursor.getMonth();
            const isToday = isSameDay(day, today);
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            const dayEvents = eventsOnDay(events, day);

            return (
              <div
                key={day.toISOString()}
                onClick={() => onDayClick?.(day)}
                className={`group relative min-h-[130px] border-slate-200 p-2 ${
                  i % 7 !== 6 ? 'border-r' : ''
                } ${i < 35 ? 'border-b' : ''} ${
                  !inMonth ? 'bg-slate-50' : isWeekend ? 'bg-slate-50/50' : 'bg-white'
                } ${onDayClick ? 'cursor-pointer hover:bg-teal-50/50' : ''}`}
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                      isToday
                        ? 'bg-[#007c6d] font-bold text-white'
                        : inMonth
                        ? 'font-semibold text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  {onDayClick && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full text-base text-[#007c6d] opacity-0 transition group-hover:bg-teal-100 group-hover:opacity-100">
                      +
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, MAX_VISIBLE).map((ev) => (
                    <EventChip key={ev.id} event={ev} onClick={onEventClick} />
                  ))}
                  {dayEvents.length > MAX_VISIBLE && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoreClick?.(day);
                      }}
                      className="px-1 text-xs font-semibold text-[#007c6d] hover:underline"
                    >
                      +{dayEvents.length - MAX_VISIBLE} more
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}