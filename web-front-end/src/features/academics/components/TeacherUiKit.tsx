'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { GRADES, type SchoolClass } from '../services/teacherManagementService';

/** Small shared pieces for the Teacher Management screens. */

export const inputCls =
  'w-full rounded-lg border border-[#cfd4dd] bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-[#073b78] focus:outline-none focus:ring-2 focus:ring-[#073b78]/15';

export const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join('');

export const byClass = <T extends { gradeLevel: number; className: string }>(a: T, b: T) =>
  a.gradeLevel - b.gradeLevel || a.className.localeCompare(b.className);

const TONES = [
  'bg-sky-100 text-sky-800', 'bg-emerald-100 text-emerald-800', 'bg-violet-100 text-violet-800',
  'bg-amber-100 text-amber-800', 'bg-rose-100 text-rose-800', 'bg-cyan-100 text-cyan-800',
];

/** Round initials badge; the colour is picked from the id so each teacher keeps the same one. */
export function Avatar({ id, name, size = 'md' }: { id: string; name: string; size?: 'sm' | 'md' | 'lg' }) {
  const tone = TONES[[...id].reduce((s, ch) => s + ch.charCodeAt(0), 0) % TONES.length];
  const dim = size === 'lg' ? 'h-14 w-14 text-lg' : size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-10 w-10 text-sm';
  return <span className={`grid shrink-0 place-items-center rounded-full font-bold ${dim} ${tone}`}>{initials(name)}</span>;
}

export function Chip({ tone = 'slate', children }: { tone?: 'slate' | 'green' | 'amber'; children: ReactNode }) {
  const cls = {
    slate: 'bg-slate-100 text-slate-700',
    green: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    amber: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200',
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{children}</span>;
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-2">
      <h3 className="text-sm font-semibold text-slate-800">{children}</h3>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function ErrorBanner({ children, onDismiss }: { children: string | null; onDismiss: () => void }) {
  if (!children) return null;
  return (
    <div role="alert" className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <span>{children}</span>
      <button onClick={onDismiss} className="shrink-0 font-semibold hover:underline">Dismiss</button>
    </div>
  );
}

/** "Are you sure?" pop-up. Used for deleting a teacher. */
export function ConfirmDialog({ title, children, confirmLabel, busy, error, onCancel, onConfirm }: {
  title: string; children: ReactNode; confirmLabel: string; busy: boolean; error: string | null;
  onCancel: () => void; onConfirm: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [busy, onCancel]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4" onClick={busy ? undefined : onCancel}>
      <div role="alertdialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <div className="mt-2 text-sm text-slate-600">{children}</div>
        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} disabled={busy} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}{confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

interface PickerProps {
  classes: SchoolClass[];
  value: string[];
  onChange: (ids: string[]) => void;
  /** false = pick one class, true = pick several. */
  multi?: boolean;
  /** Small second line under a class, e.g. who already leads it. */
  hint?: (c: SchoolClass) => string | undefined;
  /** Classes that cannot be chosen. */
  disabled?: (c: SchoolClass) => boolean;
}

/**
 * Two-step class picker that works for any school size: choose the grade (1 to 11), then the class in it.
 * A grade with one class needs no second choice; a grade with many classes (6A, 6B, 6C…) lists them all.
 */
export function ClassPicker({ classes, value, onChange, multi = false, hint, disabled }: PickerProps) {
  const sorted = [...classes].sort(byClass);
  const grades = GRADES.filter((g) => sorted.some((c) => c.gradeLevel === g));
  const [grade, setGrade] = useState<number>(() => sorted.find((c) => value.includes(c.id))?.gradeLevel ?? grades[0] ?? 1);

  const inGrade = sorted.filter((c) => c.gradeLevel === grade);
  const countIn = (g: number) => sorted.filter((c) => c.gradeLevel === g && value.includes(c.id)).length;
  const selectable = inGrade.filter((c) => !disabled?.(c));
  const allOn = selectable.length > 0 && selectable.every((c) => value.includes(c.id));

  const pickGrade = (g: number) => {
    setGrade(g);
    const list = sorted.filter((c) => c.gradeLevel === g);
    if (!multi && list.length === 1 && !disabled?.(list[0])) onChange([list[0].id]); // one class: nothing more to choose
  };
  const toggle = (c: SchoolClass) => {
    if (disabled?.(c)) return;
    if (!multi) return onChange([c.id]);
    onChange(value.includes(c.id) ? value.filter((x) => x !== c.id) : [...value, c.id]);
  };
  const toggleAll = () =>
    onChange(allOn
      ? value.filter((id) => !inGrade.some((c) => c.id === id))
      : Array.from(new Set([...value, ...selectable.map((c) => c.id)])));

  if (grades.length === 0) return <p className="text-sm text-slate-500">This school has no classes yet.</p>;

  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold text-slate-600">Grade</p>
      <div role="tablist" aria-label="Grade" className="flex flex-wrap gap-1.5">
        {grades.map((g) => {
          const n = countIn(g);
          return (
            <button key={g} role="tab" aria-selected={g === grade} onClick={() => pickGrade(g)}
              className={`relative h-9 min-w-9 rounded-lg px-2.5 text-sm font-semibold transition ${g === grade ? 'bg-[#073b78] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              {g}
              {n > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#00a896] px-1 text-[10px] font-bold text-white">{n}</span>}
            </button>
          );
        })}
      </div>

      <div className="mb-1.5 mt-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-600">{inGrade.length > 1 ? `Classes in Grade ${grade}` : `Grade ${grade}`}</p>
        {multi && inGrade.length > 1 && selectable.length > 0 && (
          <button onClick={toggleAll} className="text-xs font-semibold text-[#073b78] hover:underline">{allOn ? 'Clear all' : 'Select all'}</button>
        )}
      </div>
      <div role={multi ? 'group' : 'radiogroup'} aria-label="Class" className="flex flex-wrap gap-2">
        {inGrade.map((c) => {
          const on = value.includes(c.id);
          const off = !!disabled?.(c);
          const sub = hint?.(c);
          return (
            <button key={c.id} role={multi ? 'checkbox' : 'radio'} aria-checked={on} disabled={off} onClick={() => toggle(c)}
              className={`rounded-xl border-2 px-3 py-2 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${on ? 'border-[#073b78] bg-blue-50' : 'border-[#e2e6ee] hover:border-[#cfd4dd]'}`}>
              <span className="block font-semibold text-slate-800">{c.className}</span>
              {sub && <span className="block text-xs text-slate-500">{sub}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}