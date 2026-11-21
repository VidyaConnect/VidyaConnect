import { filterTypesForRole } from '../constants';
import { CalendarRole, EventType } from '../types';

interface CalendarFiltersProps {
  role: CalendarRole;
  active: EventType[];
  onToggle: (type: EventType) => void;
}

export function CalendarFilters({ role, active, onToggle }: CalendarFiltersProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {filterTypesForRole(role).map((t) => {
        const on = active.includes(t.value);
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onToggle(t.value)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
              on
                ? 'border-slate-300 bg-white text-slate-700'
                : 'border-slate-200 bg-slate-100 text-slate-400'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${on ? t.dot : 'bg-slate-300'}`} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}