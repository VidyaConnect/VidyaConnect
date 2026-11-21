'use client';
import { useState } from 'react';
import { ArrowLeft, BookOpen, Hash, Mail, Phone, Plus, X } from 'lucide-react';
import { SUBJECTS, type Teacher } from '../services/teacherManagementService';
import type { TeacherManagement } from '../hooks/useTeacherManagement';
import { Avatar, Chip, SectionTitle, byClass, inputCls } from './TeacherUiKit';

interface Props { teacher: Teacher; m: TeacherManagement; onBack: () => void }

/** Right-hand panel: everything about one teacher, editable in place (no pop-ups). */
export function TeacherPanel({ teacher, m, onBack }: Props) {
  const [picking, setPicking] = useState(false);
  const [pick, setPick] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [subject, setSubject] = useState('');
  const [classId, setClassId] = useState('');

  const cls = teacher.classTeacherOf;
  const classes = [...m.classes].sort(byClass);
  const nameOf = (id: string | null) => m.teachers.find((t) => t.id === id)?.fullName;
  const pickedClass = classes.find((c) => c.id === pick);
  const takeover = pickedClass?.classTeacherId && pickedClass.classTeacherId !== teacher.id ? nameOf(pickedClass.classTeacherId) : null;

  // Group "subject · class" rows by class so the teacher's timetable reads class by class.
  const byClassName = new Map<string, Teacher['teaching']>();
  teacher.teaching.forEach((a) => byClassName.set(a.className, [...(byClassName.get(a.className) ?? []), a]));
  const groups = [...byClassName.entries()].sort(([a], [b]) => a.localeCompare(b));

  const saveClass = async () => {
    if (pick && (await m.setClassTeacher(pick, teacher.id))) { setPicking(false); setPick(null); }
  };
  const removeClass = async () => {
    if (cls && (await m.setClassTeacher(cls.id, null))) setConfirmRemove(false);
  };
  const add = async () => {
    if (await m.addTeaching(teacher.id, classId, subject)) { setSubject(''); setClassId(''); }
  };

  return (
    <div className="rounded-2xl border border-[#e2e6ee] bg-white">
      <div className="flex items-start gap-4 border-b border-slate-100 p-5">
        <button onClick={onBack} aria-label="Back to list" className="-ml-1 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"><ArrowLeft className="h-5 w-5" /></button>
        <Avatar id={teacher.id} name={teacher.fullName} size="lg" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-bold text-[#073b78]">{teacher.fullName}</h2>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{teacher.email}</span>
            <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{teacher.phone ?? 'No number'}</span>
            <span className="inline-flex items-center gap-1.5"><Hash className="h-3.5 w-3.5" />{teacher.teacherCode ?? 'No code'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5">
        <section>
          <SectionTitle hint="The teacher who looks after one homeroom class. Each teacher can have one.">Class teacher</SectionTitle>
          {!picking ? (
            <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
              {cls ? <Chip tone="green"><BookOpen className="h-3 w-3" />{cls.className}</Chip> : <span className="text-sm text-slate-500">Not a class teacher yet</span>}
              <div className="flex gap-2">
                {cls && confirmRemove ? (
                  <>
                    <span className="self-center text-xs text-slate-600">Remove from {cls.className}?</span>
                    <button disabled={m.busy} onClick={removeClass} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50">Yes, remove</button>
                    <button onClick={() => setConfirmRemove(false)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">Keep</button>
                  </>
                ) : (
                  <>
                    <button disabled={m.busy} onClick={() => { m.clearError(); setPick(cls?.id ?? null); setPicking(true); }}
                      className={cls ? 'rounded-lg border border-[#cfd4dd] bg-white px-3 py-1.5 text-xs font-semibold text-[#073b78] hover:bg-slate-50' : 'rounded-lg bg-[#00a896] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#008f80]'}>
                      {cls ? 'Change class' : 'Assign a class'}
                    </button>
                    {cls && <button disabled={m.busy} onClick={() => setConfirmRemove(true)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Remove</button>}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[#cfd4dd] p-3">
              <div role="radiogroup" aria-label="Class" className="flex flex-wrap gap-2">
                {classes.map((c) => {
                  const on = pick === c.id;
                  const other = c.classTeacherId && c.classTeacherId !== teacher.id ? nameOf(c.classTeacherId) : null;
                  return (
                    <button key={c.id} role="radio" aria-checked={on} onClick={() => setPick(c.id)}
                      className={`rounded-xl border-2 px-3 py-2 text-left text-sm transition ${on ? 'border-[#073b78] bg-blue-50' : 'border-[#e2e6ee] hover:border-[#cfd4dd]'}`}>
                      <span className="block font-semibold text-slate-800">{c.className}</span>
                      <span className="block text-xs text-slate-500">{other ?? (c.classTeacherId ? 'Current class' : 'Free')}</span>
                    </button>
                  );
                })}
              </div>
              {takeover && <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">{takeover} will no longer be the class teacher of {pickedClass?.className}.</p>}
              <div className="mt-3 flex justify-end gap-2">
                <button onClick={() => { setPicking(false); setPick(null); }} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">Cancel</button>
                <button disabled={m.busy || !pick || pick === cls?.id} onClick={saveClass} className="rounded-lg bg-[#00a896] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#008f80] disabled:opacity-50">
                  {cls ? 'Save change' : 'Assign class'}
                </button>
              </div>
            </div>
          )}
        </section>

        <section>
          <SectionTitle hint="Which subjects this teacher teaches, class by class.">Teaching</SectionTitle>
          {groups.length === 0 ? (
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">No subjects yet. Add the first one below.</p>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-xl border border-[#e2e6ee]">
              {groups.map(([name, items]) => (
                <li key={name} className="flex items-center gap-3 px-4 py-3">
                  <span className="w-20 shrink-0 text-sm font-semibold text-slate-800">{name}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((a) => (
                      <span key={a.id} className="inline-flex items-center gap-1 rounded-full bg-blue-50 py-0.5 pl-2.5 pr-1 text-xs font-medium text-[#073b78]">
                        {a.subject}
                        <button disabled={m.busy} onClick={() => m.removeTeaching(a.id)} aria-label={`Remove ${a.subject} in ${a.className}`} className="rounded-full p-0.5 hover:bg-blue-100 disabled:opacity-50"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-3">
            <select value={classId} onChange={(e) => setClassId(e.target.value)} aria-label="Class" className={`${inputCls} flex-1 min-w-[8rem]`}>
              <option value="">Class</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.className}</option>)}
            </select>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Subject" className={`${inputCls} flex-1 min-w-[8rem]`}>
              <option value="">Subject</option>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={add} disabled={m.busy || !subject || !classId}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#00a896] px-4 py-2 text-sm font-semibold text-white hover:bg-[#008f80] disabled:cursor-not-allowed disabled:opacity-50">
              <Plus className="h-4 w-4" />Add
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}