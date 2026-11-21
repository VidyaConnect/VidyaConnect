import { AlertTriangle, CheckCircle2, ListChecks, XCircle } from 'lucide-react';
import type { ElementType } from 'react';
import type { PreviewRow, RowStatus } from '../types';
import { countByStatus } from '../utils/records';

type Filter = 'all' | RowStatus;

export function ValidationSummary({ rows, active, onSelect }: { rows: PreviewRow[]; active: Filter; onSelect: (f: Filter) => void }) {
  const total = rows.length;
  const valid = countByStatus(rows, 'valid');
  const warnings = countByStatus(rows, 'warning');
  const errors = countByStatus(rows, 'error');
  const ready = valid + warnings;
  const pct = (n: number) => (total ? (n / total) * 100 : 0);

  const tiles: { key: Filter; label: string; n: number; icon: ElementType; tone: string; ring: string }[] = [
    { key: 'all', label: 'All records', n: total, icon: ListChecks, tone: 'bg-blue-50 text-[#073b78]', ring: 'ring-[#073b78]' },
    { key: 'valid', label: 'Valid', n: valid, icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-600', ring: 'ring-emerald-500' },
    { key: 'warning', label: 'Warnings', n: warnings, icon: AlertTriangle, tone: 'bg-amber-50 text-amber-600', ring: 'ring-amber-500' },
    { key: 'error', label: 'Errors', n: errors, icon: XCircle, tone: 'bg-red-50 text-red-600', ring: 'ring-red-500' },
  ];

  return (
    <div className="rounded-2xl border border-[#e2e6ee] bg-gradient-to-br from-white to-slate-50 p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xl font-bold text-[#073b78]">{errors === 0 ? 'All records look good' : `${ready} of ${total} records are ready`}</p>
          <p className="mt-0.5 text-sm text-slate-600">
            {errors === 0
              ? 'Nothing blocks the import. Warnings are worth a look but will not stop registration.'
              : `${errors} ${errors === 1 ? 'record needs' : 'records need'} fixing. They will be skipped unless you correct your file.`}
          </p>
        </div>
        <p className="text-sm font-semibold text-slate-500">{Math.round(pct(ready))}% ready</p>
      </div>

      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-200" role="img" aria-label={`${valid} valid, ${warnings} warnings, ${errors} errors`}>
        <div className="bg-emerald-500 transition-all" style={{ width: `${pct(valid)}%` }} />
        <div className="bg-amber-400 transition-all" style={{ width: `${pct(warnings)}%` }} />
        <div className="bg-red-500 transition-all" style={{ width: `${pct(errors)}%` }} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => onSelect(t.key)} aria-pressed={active === t.key}
              className={`flex items-center gap-3 rounded-xl border bg-white p-3 text-left transition hover:shadow-sm ${active === t.key ? `border-transparent ring-2 ${t.ring}` : 'border-[#e2e6ee]'}`}>
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${t.tone}`}><Icon className="h-5 w-5" /></span>
              <span>
                <span className="block text-2xl font-bold leading-none text-slate-900">{t.n}</span>
                <span className="text-xs text-slate-500">{t.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}