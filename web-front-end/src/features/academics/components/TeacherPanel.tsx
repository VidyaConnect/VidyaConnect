'use client';
import { useState } from 'react';
import { ArrowLeft, BookOpen, Hash, Mail, Phone, Plus, Trash2, X } from 'lucide-react';
import { SUBJECTS, type Teacher } from '../services/teacherManagementService';
import type { TeacherManagement } from '../hooks/useTeacherManagement';
import { Avatar, Chip, ClassPicker, ConfirmDialog, SectionTitle, byClass, inputCls } from './TeacherUiKit';

interface Props { teacher: Teacher; m: TeacherManagement; onBack: () => void; onDeleted: () => void }

/** Right-hand panel: everything about one teacher. */
export function TeacherPanel({ teacher, m, onBack, onDeleted }: Props) {
  const [picking, setPicking] = useState(false);
  const [pick, setPick] = useState<string[]>([]);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [subject, setSubject] = useState('');
  const [addClasses, setAddClasses] = useState<string[]>([]);
  const [showDelete, setShowDelete] = useState(false);

  const cls = teacher.classTeacherOf;
  const classes = [...m.classes].sort(byClass);
  const order = new Map(classes.map((c, i) => [c.id, i]));
  const nameOf = (id: string | null) => m.teachers.find((t) => t.id === id)?.fullName;

  // Class-teacher picker: taking a class that has another class teacher is allowed, with a warning.
  const pickedClass = classes.find((c) => c.id === pick[0]);
  const takeover = pickedClass?.classTeacherId && pickedClass.classTeacherId !== teacher.id ? nameOf(pickedClass.classTeacherId) : null;

  // "Teaching" is grouped by subject: Mathematics → Grade 6A, 6B, 7A …
  const bySubject = new Map<string, Teacher['teaching']>();
  teacher.teaching.forEach((a) => bySubject.set(a.subject, [...(bySubject.get(a.subject) ?? []), a]));
  const groups = [...bySubject.entries()].sort(([a], [b]) => a.localeCompare(b))
    .map(([s, items]) => [s, [...items].sort((a, b) => (order.get(a.classId) ?? 0) - (order.get(b.classId) ?? 0))] as const);

  // Who already teaches the chosen subject in a class (so it can't be picked twice).
  const takenBy = (classId: string) =>
    subject ? m.teachers.find((t) => t.teaching.some((a) => a.classId === classId && a.subject === subject)) : undefined;
  const freeToAdd = addClasses.filter((id) => !takenBy(id));

  const saveClass = async () => {
    if (pick[0] && (await m.setClassTeacher(pick[0], teacher.id))) { setPicking(false); setPick([]); }
  };
  const removeClass = async () => {
    if (cls && (await m.setClassTeacher(cls.id, null))) setConfirmRemove(false);
  };
  const add = async () => {
    for (const id of freeToAdd) if (!(await m.addTeaching(teacher.id, id, subject))) return;
    setSubject(''); setAddClasses([]);
  };
  const doDelete = async () => {
    if (await m.deleteTeacher(teacher.id)) onDeleted();
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
        <button onClick={() => { m.clearError(); setShowDelete(true); }} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
          <Trash2 className="h-3.5 w-3.5" />Delete
        </button>
      </div>

      <div className="space-y-6 p-5">
        <section>
          <SectionTitle hint="The teacher who looks after one class. Each teacher can have one.">Class teacher</SectionTitle>
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
                    <button disabled={m.busy} onClick={() => { m.clearError(); setPick(cls ? [cls.id] : []); setPicking(true); }}
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
              <ClassPicker classes={classes} value={pick} onChange={setPick}
                hint={(c) => (c.classTeacherId === teacher.id ? 'Current class' : c.classTeacherId ? nameOf(c.classTeacherId) : 'Free')} />
              {takeover && <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">{takeover} will no longer be the class teacher of {pickedClass?.className}.</p>}
              <div className="mt-3 flex justify-end gap-2">
                <button onClick={() => { setPicking(false); setPick([]); }} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">Cancel</button>
                <button disabled={m.busy || !pick[0] || pick[0] === cls?.id} onClick={saveClass} className="rounded-lg bg-[#00a896] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#008f80] disabled:opacity-50">
                  {cls ? 'Save change' : 'Assign class'}
                </button>
              </div>
            </div>
          )}
        </section>

        <section>
          <SectionTitle hint="Each subject this teacher teaches, and the classes they teach it to.">Teaching</SectionTitle>
          {groups.length === 0 ? (
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">No subjects yet. Add the first one below.</p>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-xl border border-[#e2e6ee]">
              {groups.map(([name, items]) => (
                <li key={name} className="flex items-start gap-3 px-4 py-3">
                  <span className="w-28 shrink-0 pt-0.5 text-sm font-semibold text-slate-800">{name}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((a) => (
                      <span key={a.id} className="inline-flex items-center gap-1 rounded-full bg-blue-50 py-0.5 pl-2.5 pr-1 text-xs font-medium text-[#073b78]">
                        {a.className}
                        <button disabled={m.busy} onClick={() => m.removeTeaching(a.id)} aria-label={`Remove ${a.subject} in ${a.className}`} className="rounded-full p-0.5 hover:bg-blue-100 disabled:opacity-50"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 space-y-3 rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-600">Add a subject</p>
            <select value={subject} onChange={(e) => { setSubject(e.target.value); setAddClasses([]); }} aria-label="Subject" className={inputCls}>
              <option value="">1. Choose a subject</option>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {subject && (
              <ClassPicker key={subject} classes={classes} multi value={addClasses} onChange={setAddClasses}
                disabled={(c) => !!takenBy(c.id)}
                hint={(c) => { const t = takenBy(c.id); return t ? (t.id === teacher.id ? 'Already teaching' : t.fullName) : undefined; }} />
            )}
            <button onClick={add} disabled={m.busy || !subject || freeToAdd.length === 0}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#00a896] px-4 py-2 text-sm font-semibold text-white hover:bg-[#008f80] disabled:cursor-not-allowed disabled:opacity-50">
              <Plus className="h-4 w-4" />{freeToAdd.length > 1 ? `Add to ${freeToAdd.length} classes` : 'Add'}
            </button>
          </div>
        </section>
      </div>

      {showDelete && (
        <ConfirmDialog title={`Delete ${teacher.fullName}?`} confirmLabel="Yes, delete" busy={m.busy} error={m.error}
          onCancel={() => { setShowDelete(false); m.clearError(); }} onConfirm={doDelete}>
          <p>
            This removes them from your school{cls ? <>, and <b>{cls.className}</b> will have no class teacher</> : ''}
            {teacher.teaching.length > 0 ? <>. Their {teacher.teaching.length} subject assignment{teacher.teaching.length > 1 ? 's' : ''} will also be removed</> : ''}.
          </p>
          <p className="mt-2 font-medium text-slate-800">This can’t be undone.</p>
        </ConfirmDialog>
      )}
    </div>
  );
}