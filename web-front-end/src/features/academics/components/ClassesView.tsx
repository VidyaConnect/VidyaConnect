'use client';
import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { GRADES, SECTION_LETTERS, classNameOf } from '../services/teacherManagementService';
import type { TeacherManagement } from '../hooks/useTeacherManagement';
import { ClassPanel } from './ClassPanel';
import { FirstTimeSetup } from './FirstTimeSetup';
import { Avatar, byClass, inputCls } from './TeacherUiKit';

type Filter = 'all' | 'open';

/** Manage classes: same layout as "By teacher". Classes grouped by grade on the left, the chosen class on the right. */
export function ClassesView({ m }: { m: TeacherManagement }) {
  const classes = [...m.classes].sort(byClass);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [adding, setAdding] = useState(false);

  // A school with no classes yet: create them all in one go.
  if (!m.loading && classes.length === 0) return <FirstTimeSetup m={m} />;

  const openCount = classes.filter((c) => !c.classTeacherId).length;
  const shown = filter === 'open' ? classes.filter((c) => !c.classTeacherId) : classes;
  const groups = GRADES.map((g) => ({ g, list: shown.filter((c) => c.gradeLevel === g) })).filter((x) => x.list.length > 0);

  // On desktop the first class is open by default; on mobile the list shows until one is tapped.
  const active = classes.find((c) => c.id === selectedId) ?? (selectedId === null ? shown[0] : undefined) ?? null;

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: `All classes (${classes.length})` },
    { key: 'open', label: `No class teacher (${openCount})` },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <div className={selectedId ? 'hidden lg:block' : 'block'}>
        <div className="flex items-center justify-between gap-2">
          <div role="tablist" aria-label="Class filter" className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button key={f.key} role="tab" aria-selected={filter === f.key} onClick={() => setFilter(f.key)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${filter === f.key ? 'bg-[#073b78] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {f.label}
              </button>
            ))}
          </div>
          <button onClick={() => setAdding((v) => !v)} aria-expanded={adding}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#00a896] px-3 py-1 text-xs font-semibold text-white hover:bg-[#008f80]">
            <Plus className="h-3.5 w-3.5" />Add class
          </button>
        </div>

        {adding && <AddClassForm m={m} onClose={() => setAdding(false)} />}

        <div className="mt-2 space-y-1 lg:max-h-[68vh] lg:overflow-y-auto lg:pr-1">
          {m.loading && <p className="py-10 text-center text-sm text-slate-500">Loading classes…</p>}
          {!m.loading && groups.length === 0 && (
            <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">Every class has a class teacher.</p>
          )}

          {groups.map(({ g, list }) => (
            <section key={g}>
              <h3 className="px-3 pb-1 pt-4 text-xs font-bold text-slate-500">
                Grade {g}
                <span className="font-normal"> · {list.length} class{list.length > 1 ? 'es' : ''} · {list.reduce((n, c) => n + c.studentCount, 0)} students</span>
              </h3>
              <ul className="space-y-1">
                {list.map((c) => {
                  const on = active?.id === c.id;
                  const lead = m.teachers.find((t) => t.id === c.classTeacherId);
                  return (
                    <li key={c.id}>
                      <button onClick={() => { m.clearError(); setSelectedId(c.id); }} aria-current={on}
                        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${on ? 'border-[#073b78] bg-blue-50/60' : 'border-transparent hover:bg-slate-50'}`}>
                        {lead
                          ? <Avatar id={lead.id} name={lead.fullName} />
                          : <span className="h-10 w-10 shrink-0 rounded-full border border-dashed border-slate-300" />}
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-slate-800">{c.className}</span>
                          <span className={`block truncate text-xs ${lead ? 'text-slate-500' : 'text-slate-400'}`}>{lead ? lead.fullName : 'No class teacher'}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500"><Users className="h-3.5 w-3.5" />{c.studentCount}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <div className={`${selectedId ? 'block' : 'hidden lg:block'} lg:sticky lg:top-4 lg:self-start`}>
        {active ? <ClassPanel key={active.id} cls={active} m={m} onBack={() => setSelectedId(null)} onDeleted={() => setSelectedId(null)} />
          : !m.loading && <p className="rounded-2xl border border-dashed border-[#cfd4dd] p-10 text-center text-sm text-slate-500">Select a class to see its teachers.</p>}
      </div>
    </div>
  );
}

/** Add one class. Suggests the next free section letter. */
function AddClassForm({ m, onClose }: { m: TeacherManagement; onClose: () => void }) {
  const [grade, setGrade] = useState<number>(GRADES[0]);
  const [typed, setTyped] = useState<string | null>(null);

  const inGrade = m.classes.filter((c) => c.gradeLevel === grade);
  const used = new Set(inGrade.map((c) => c.section || 'A')); // a single "Grade 1" counts as section A
  const suggested = inGrade.length === 0 ? '' : (SECTION_LETTERS.split('').find((l) => !used.has(l)) ?? '');
  const section = typed ?? suggested;
  const renameNote = inGrade.length === 1 && !inGrade[0].section && section
    ? `${inGrade[0].className} will become ${classNameOf(grade, 'A')}.` : null;

  const add = async () => {
    if (await m.createClass(grade, section)) setTyped(null);
  };

  return (
    <div className="mt-3 rounded-xl bg-slate-50 p-3">
      <div className="flex flex-wrap items-end gap-2">
        <label className="block flex-1">
          <span className="mb-1 block text-xs font-semibold text-slate-600">Grade</span>
          <select value={grade} onChange={(e) => { setGrade(Number(e.target.value)); setTyped(null); }} className={inputCls}>
            {GRADES.map((g) => <option key={g} value={g}>Grade {g}</option>)}
          </select>
        </label>
        <label className="block w-24">
          <span className="mb-1 block text-xs font-semibold text-slate-600">Section</span>
          <input value={section} onChange={(e) => setTyped(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 2))}
            placeholder={inGrade.length === 0 ? 'None' : 'A, B…'} className={inputCls} />
        </label>
        <button onClick={add} disabled={m.busy || (inGrade.length > 0 && !section)}
          className="rounded-lg bg-[#00a896] px-4 py-2 text-sm font-semibold text-white hover:bg-[#008f80] disabled:cursor-not-allowed disabled:opacity-50">
          Add {classNameOf(grade, section)}
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {inGrade.length === 0 ? 'Leave the section empty if this grade will have only one class.' : `Grade ${grade} already has ${inGrade.length} class${inGrade.length > 1 ? 'es' : ''}.`}
        {renameNote && <b className="text-slate-700"> {renameNote}</b>}
      </p>
      <div className="mt-2 text-right">
        <button onClick={onClose} className="text-xs font-semibold text-[#073b78] hover:underline">Done</button>
      </div>
    </div>
  );
}