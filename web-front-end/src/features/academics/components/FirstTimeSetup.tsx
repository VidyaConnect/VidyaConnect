'use client';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { GRADES, SECTION_LETTERS, classNameOf } from '../services/teacherManagementService';
import type { TeacherManagement } from '../hooks/useTeacherManagement';

const MAX_PER_GRADE = 8;

/** Shown when the school has no classes yet: say how many classes each grade has and we create them all. */
export function FirstTimeSetup({ m }: { m: TeacherManagement }) {
  const [counts, setCounts] = useState<Record<number, number>>({});
  const setCount = (g: number, n: number) => setCounts((p) => ({ ...p, [g]: Math.max(0, Math.min(MAX_PER_GRADE, n)) }));

  const total = GRADES.reduce((s, g) => s + (counts[g] ?? 0), 0);
  const gradesUsed = GRADES.filter((g) => (counts[g] ?? 0) > 0).length;
  const preview = (g: number, n: number) =>
    n === 0 ? 'Not in this school' : n === 1 ? `Grade ${g}` : Array.from({ length: n }, (_, i) => classNameOf(g, SECTION_LETTERS[i]).replace('Grade ', '')).join(', ');

  return (
    <div>
      <h2 className="text-lg font-bold text-[#073b78]">Set up your school’s classes</h2>
      <p className="mt-1 max-w-2xl text-sm text-slate-600">
        Before you register students, tell us which grades your school has and how many classes each grade has.
        A grade with one class is just “Grade 1”. A grade with several gets sections: 6A, 6B, 6C.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {GRADES.map((g) => {
          const n = counts[g] ?? 0;
          return (
            <div key={g} className={`flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 transition ${n > 0 ? 'border-[#073b78] bg-blue-50/40' : 'border-[#e2e6ee]'}`}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">Grade {g}</p>
                <p className={`truncate text-xs ${n > 0 ? 'text-[#073b78]' : 'text-slate-400'}`}>{preview(g, n)}</p>
              </div>
              <div className="flex items-center gap-2" role="group" aria-label={`Classes in Grade ${g}`}>
                <button onClick={() => setCount(g, n - 1)} disabled={n === 0} aria-label={`Fewer classes in Grade ${g}`} className="grid h-8 w-8 place-items-center rounded-lg border border-[#cfd4dd] bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"><Minus className="h-4 w-4" /></button>
                <span className="w-5 text-center text-sm font-bold text-slate-800">{n}</span>
                <button onClick={() => setCount(g, n + 1)} disabled={n >= MAX_PER_GRADE} aria-label={`More classes in Grade ${g}`} className="grid h-8 w-8 place-items-center rounded-lg border border-[#cfd4dd] bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"><Plus className="h-4 w-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
        <p className="text-sm text-slate-600">
          {total === 0 ? 'Add at least one class to continue.' : <><b className="text-slate-900">{total} class{total > 1 ? 'es' : ''}</b> in {gradesUsed} grade{gradesUsed > 1 ? 's' : ''}. You can add more later.</>}
        </p>
        <button disabled={m.busy || total === 0}
          onClick={() => m.createClasses(GRADES.filter((g) => (counts[g] ?? 0) > 0).map((g) => ({ gradeLevel: g, count: counts[g] })))}
          className="rounded-lg bg-[#073b78] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#052d5c] disabled:cursor-not-allowed disabled:opacity-50">
          {m.busy ? 'Creating…' : total === 0 ? 'Create classes' : `Create ${total} class${total === 1 ? '' : 'es'}`}
        </button>
      </div>
    </div>
  );
}