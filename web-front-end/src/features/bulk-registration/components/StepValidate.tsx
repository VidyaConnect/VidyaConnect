'use client';
import { ArrowLeft, ArrowRight, Download, FileWarning, Search, TriangleAlert } from 'lucide-react';
import { useRecordFilters } from '../hooks/useRecordFilters';
import type { PreviewRow, RegType } from '../types';
import { PREVIEW_COLUMNS } from '../utils/constants';
import { countByStatus, importableCount } from '../utils/records';
import { ValidationSummary } from './ValidationSummary';
import { ValidationTable } from './ValidationTable';

export function StepValidate({ type, rows, onBack, onNext }: { type: RegType; rows: PreviewRow[]; onBack: () => void; onNext: () => void }) {
  const f = useRecordFilters(rows);
  const importable = importableCount(rows);
  const errors = countByStatus(rows, 'error');

  if (rows.length > 0 && importable === 0)
    return (
      <div className="mx-auto max-w-md py-10 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-500"><FileWarning className="h-8 w-8" /></span>
        <h2 className="mt-4 text-lg font-bold text-red-700">Every record has an error</h2>
        <p className="mt-1 text-sm text-slate-600">Nothing can be imported from this file. Fix the errors in Excel, then upload it again.</p>
        <div className="mt-5 flex justify-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Download className="h-4 w-4" />Error report</button>
          <button onClick={onBack} className="rounded-lg bg-[#00a896] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#008f80]">Replace file</button>
        </div>
      </div>
    );

  const labelOf = (key: string) => PREVIEW_COLUMNS[type].find((c) => c.key === key)?.label ?? key;
  const issueCounts = rows
    .filter((r) => r.status !== 'valid' && r.errorField)
    .reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.errorField as string]: (acc[r.errorField as string] ?? 0) + 1 }), {});

  return (
    <>
      <h2 className="text-xl font-bold text-[#073b78]">Review your records</h2>
      <p className="mb-5 mt-1 text-sm text-slate-600">Check every row before anything is saved. Nothing is registered until you confirm on the next step.</p>

      <ValidationSummary rows={rows} active={f.filter} onSelect={f.setFilter} />

      {errors > 0 && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-3">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Fix in Excel and re-upload, or continue and skip the {errors} with errors</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.entries(issueCounts).map(([k, n]) => (
                  <span key={k} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">{labelOf(k)} · {n}</span>
                ))}
              </div>
            </div>
          </div>
          <button className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100">
            <Download className="h-4 w-4" />Download error report
          </button>
        </div>
      )}

      <div className="relative my-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input value={f.query} onChange={(e) => f.setQuery(e.target.value)} placeholder="Search by name, ID, email or issue..."
          className="w-full rounded-lg border border-[#cfd4dd] bg-[#f7f9fa] py-2.5 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-[#073b78] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#073b78]/15" />
      </div>

      <ValidationTable type={type} rows={f.shown} />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <button onClick={onBack} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <ArrowLeft className="h-4 w-4" />Replace file
        </button>
        <button onClick={onNext} className="inline-flex items-center gap-2 rounded-lg bg-[#00a896] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#008f80]">
          Continue with {importable} {importable === 1 ? 'record' : 'records'}<ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}