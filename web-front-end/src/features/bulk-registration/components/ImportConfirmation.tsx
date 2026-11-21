'use client';
import { useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, ChevronDown, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import type { PreviewRow, RegType } from '../types';
import { REG_COPY } from '../utils/constants';
import { ContextNote } from './ContextNote';

const WILL_HAPPEN: Record<RegType, string[]> = {
  class: [
    'Classes are created for the selected academic year',
    'Classes that already exist are skipped, never duplicated',
    'Teachers and students can then be assigned to them',
  ],
  teacher: [
    'Teacher profiles are created for your school',
    'A login account with a temporary password is created for each teacher',
    'Teachers listed with a class become the class teacher of that class',
  ],
  student: [
    'Internal student records are created',
    'Each student is assigned to their grade and class',
    'No login accounts are created. Parents link to their child from the mobile app.',
  ],
};

interface Props {
  type: RegType;
  rows: PreviewRow[];
  submitting: boolean;
  error: string | null;
  schoolName?: string;
  onBack: () => void;
  onConfirm: () => void;
}

export function ImportConfirmation({ type, rows, submitting, error, schoolName, onBack, onConfirm }: Props) {
  const [ok, setOk] = useState(false);
  const ready = rows.filter((r) => r.status !== 'error');
  const skipped = rows.filter((r) => r.status === 'error');
  const label = REG_COPY[type].label;
  // Classes have no first/last name, so show "Grade 5 A" instead.
  const name = (r: PreviewRow) =>
    type === 'class' ? `Grade ${r.grade ?? ''} ${r.className ?? ''}`.trim() : `${r.firstName} ${r.lastName}`;
  const shown = ready.slice(0, 10);
  const extra = ready.length - shown.length;

  const info: [string, string | number][] = [['Type', label]];
  if (schoolName) info.push(['School', schoolName]);
  info.push(['Total in file', rows.length], ['Excluded', skipped.length]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div>
          <h2 className="text-xl font-bold text-[#073b78]">Confirm registration</h2>
          <p className="mt-1 text-sm text-slate-600">This is the last step before anything is saved.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-50">Will be registered</p>
            <p className="mt-1 text-4xl font-bold">{ready.length}</p>
            <p className="text-sm text-emerald-50">{label.toLowerCase()}</p>
          </div>
          <div className={`rounded-2xl p-5 ${skipped.length ? 'bg-amber-50 text-amber-900 ring-1 ring-amber-200' : 'bg-slate-50 text-slate-500 ring-1 ring-slate-200'}`}>
            <p className="text-xs font-semibold uppercase tracking-wider">Will be skipped</p>
            <p className="mt-1 text-4xl font-bold">{skipped.length}</p>
            <p className="text-sm">{skipped.length ? 'because of errors' : 'nothing excluded'}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e2e6ee] p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">What will happen</p>
          <ul className="mt-3 space-y-3">
            {WILL_HAPPEN[type].map((t, i) => (
              <li key={t} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#073b78] text-xs font-bold text-white">{i + 1}</span>{t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#e2e6ee] p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ready to register</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {shown.map((r) => (
              <span key={r.row} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" />{name(r)}
              </span>
            ))}
            {extra > 0 && <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">+{extra} more</span>}
          </div>
        </div>

        {skipped.length > 0 && (
          <details className="group rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-amber-900">
              <span className="inline-flex items-center gap-2"><AlertTriangle className="h-4 w-4" />See the {skipped.length} skipped {skipped.length === 1 ? 'record' : 'records'}</span>
              <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
            </summary>
            <ul className="mt-3 divide-y divide-amber-100 text-sm">
              {skipped.map((r) => (
                <li key={r.row} className="flex flex-col gap-0.5 py-2 sm:flex-row sm:justify-between">
                  <span className="font-medium text-slate-800">{name(r)} <span className="text-xs text-slate-400">row {r.row}</span></span>
                  <span className="text-red-700">{r.message}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-slate-500">These rows are not saved. Fix them in your file and upload them again later.</p>
          </details>
        )}
      </div>

      <aside className="lg:sticky lg:top-6 lg:h-fit">
        <div className="overflow-hidden rounded-2xl border border-[#e2e6ee] bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#073b78] to-[#0a56a8] p-5 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide"><ShieldCheck className="h-3.5 w-3.5" />Final check</span>
            <h3 className="mt-3 text-lg font-bold">Register {ready.length} {label.toLowerCase()}</h3>
          </div>
          <div className="space-y-4 p-5">
            <dl className="divide-y divide-slate-100 text-sm">
              {info.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 py-2"><dt className="text-slate-500">{k}</dt><dd className="text-right font-semibold text-slate-800">{v}</dd></div>
              ))}
            </dl>
            <ContextNote type={type}>{REG_COPY[type].confirm}</ContextNote>
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} disabled={submitting} className="mt-0.5 h-4 w-4 accent-[#00a896]" />
              I have reviewed the records and want to register {ready.length} {label.toLowerCase()}.
            </label>
            {error && <p role="alert" className="flex gap-2 text-sm text-red-700"><XCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>}
            {submitting && <div className="h-2 animate-pulse rounded-full bg-[#00a896]" aria-hidden />}
            <button onClick={onConfirm} disabled={!ok || submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#00a896] px-5 py-3 text-sm font-semibold text-white hover:bg-[#008f80] disabled:cursor-not-allowed disabled:opacity-50">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Registering {label.toLowerCase()}…</> : 'Confirm & Register'}
            </button>
            <button onClick={onBack} disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50">
              <ArrowLeft className="h-4 w-4" />Back to review
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}