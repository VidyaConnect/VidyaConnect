import { CalendarViewMode } from '../types';

interface CalendarToolbarProps {
  label: string;
  mode: CalendarViewMode;
  canCreate: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onModeChange: (mode: CalendarViewMode) => void;
  onAdd: () => void;
}

export function CalendarToolbar({
  label,
  mode,
  canCreate,
  onPrev,
  onNext,
  onToday,
  onModeChange,
  onAdd,
}: CalendarToolbarProps) {
  const navBtn = 'px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50';

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <h2 className="min-w-[200px] text-2xl font-bold text-[#073b78]">{label}</h2>
        <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <button onClick={onPrev} className={navBtn} aria-label="Previous">
            ‹
          </button>
          <button onClick={onToday} className={`${navBtn} border-x border-slate-200`}>
            Today
          </button>
          <button onClick={onNext} className={navBtn} aria-label="Next">
            ›
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex rounded-lg bg-slate-100 p-1">
          {(['month', 'week'] as CalendarViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`rounded-md px-4 py-1.5 text-sm font-semibold capitalize transition ${
                mode === m
                  ? 'bg-white text-[#073b78] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {canCreate && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 rounded-lg bg-[#007c6d] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#006a5d]"
          >
            <span className="text-lg leading-none">+</span> Add Event
          </button>
        )}
      </div>
    </div>
  );
}