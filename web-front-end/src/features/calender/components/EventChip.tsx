import { CalendarEvent } from '../types';
import { getTypeMeta } from '../constants';
import { formatTime } from '../utils/dateHelpers';

interface EventChipProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
  showTime?: boolean;
}

export function EventChip({ event, onClick, showTime = true }: EventChipProps) {
  const meta = getTypeMeta(event.type);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
      title={event.title}
      className={`block w-full truncate rounded-md border-l-[3px] px-2 py-1 text-left text-xs font-medium transition hover:brightness-95 ${meta.chip} ${meta.bar}`}
    >
      {showTime && !event.allDay && (
        <span className="mr-1.5 font-semibold opacity-70">{formatTime(event.start)}</span>
      )}
      {event.title}
    </button>
  );
}