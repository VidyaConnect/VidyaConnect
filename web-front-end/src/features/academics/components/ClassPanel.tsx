'use client';
import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, UserRound, Users, X } from 'lucide-react';
import { SUBJECTS, type SchoolClass } from '../services/teacherManagementService';
import type { TeacherManagement } from '../hooks/useTeacherManagement';
import { Avatar, ConfirmDialog, SectionTitle, inputCls } from './TeacherUiKit';

interface Props { cls: SchoolClass; m: TeacherManagement; onBack: () => void; onDeleted: () => void }

/** Right-hand panel: one class, who leads it, who teaches each subject, and deleting the class. */
export function ClassPanel({ cls, m, onBack, onDeleted }: Props) {
  const [subject, setSubject] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  const lead = m.teachers.find((t) => t.id === cls.classTeacherId) ?? null;
  const rows = m.teachers.flatMap((t) => t.teaching.filter((a) => a.classId === cls.id).map((a) => ({ ...a, teacher: t })))
    .sort((a, b) => a.subject.localeCompare(b.subject));
  const free = SUBJECTS.filter((s) => !rows.some((r) => r.subject === s));
  const covered = Math.round((rows.length / SUBJECTS.length) * 100);
  const hasStudents = cls.studentCount > 0;

  const add = async () => {
    if (await m.addTeaching(teacherId, cls.id, subject)) { setSubject(''); setTeacherId(''); }
  };
  const doDelete = async () => {
    if (await m.deleteClass(cls.id)) onDeleted();
  };

  return (
    <div className="rounded-2xl border border-[#e2e6ee] bg-white">
      <div className="flex items-start gap-3 border-b border-slate-100 p-5">
        <button onClick={onBack} aria-label="Back to classes" className="-ml-1 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"><ArrowLeft className="h-5 w-5" /></button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#073b78]">{cls.className}</h2>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-500"><Users className="h-4 w-4" />{cls.studentCount} students</p>
        </div>
        <button onClick={() => { m.clearError(); setShowDelete(true); }} disabled={hasStudents}
          title={hasStudents ? 'This class has students, so it can’t be deleted' : `Delete ${cls.className}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent">
          <Trash2 className="h-3.5 w-3.5" />Delete
        </button>
      </div>

      <div className="space-y-6 p-5">
        <section>
          <SectionTitle hint="The teacher who looks after this class.">Class teacher</SectionTitle>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            {lead ? <Avatar id={lead.id} name={lead.fullName} /> : <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-dashed border-slate-300 text-slate-400"><UserRound className="h-4 w-4" /></span>}
            <select aria-label="Class teacher" value={cls.classTeacherId ?? ''} disabled={m.busy}
              onChange={(e) => m.setClassTeacher(cls.id, e.target.value || null)} className={inputCls}>
              <option value="">{lead ? 'Remove class teacher' : 'Choose a class teacher'}</option>
              {m.teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.fullName}{t.classTeacherOf && t.id !== cls.classTeacherId ? ` (moves from ${t.classTeacherOf.className})` : ''}</option>
              ))}
            </select>
          </div>
        </section>

        <section>
          <SectionTitle hint={`${rows.length} of ${SUBJECTS.length} subjects have a teacher.`}>Subject teachers</SectionTitle>
          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden>
            <div className="h-full rounded-full bg-[#00a896] transition-all" style={{ width: `${covered}%` }} />
          </div>

          {rows.length === 0 ? <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">No subject teachers yet. Add the first one below.</p> : (
            <ul className="divide-y divide-slate-100 rounded-xl border border-[#e2e6ee]">
              {rows.map((r) => (
                <li key={r.id} className="flex items-center gap-3 px-3 py-2.5 text-sm">
                  <span className="w-24 shrink-0 font-semibold text-slate-800">{r.subject}</span>
                  <Avatar id={r.teacher.id} name={r.teacher.fullName} size="sm" />
                  <span className="min-w-0 flex-1 truncate text-slate-600">{r.teacher.fullName}</span>
                  <button disabled={m.busy} onClick={() => m.removeTeaching(r.id)} aria-label={`Remove ${r.subject} teacher`} className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"><X className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex flex-wrap gap-2 rounded-xl bg-slate-50 p-3">
            <select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Subject" className={`${inputCls} min-w-32 flex-1`}>
              <option value="">Subject</option>
              {free.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} aria-label="Teacher" className={`${inputCls} min-w-32 flex-1`}>
              <option value="">Teacher</option>
              {m.teachers.map((t) => <option key={t.id} value={t.id}>{t.fullName}</option>)}
            </select>
            <button onClick={add} disabled={m.busy || !subject || !teacherId}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#00a896] px-4 py-2 text-sm font-semibold text-white hover:bg-[#008f80] disabled:cursor-not-allowed disabled:opacity-50">
              <Plus className="h-4 w-4" />Add
            </button>
          </div>
        </section>
      </div>

      {showDelete && (
        <ConfirmDialog title={`Delete ${cls.className}?`} confirmLabel="Yes, delete" busy={m.busy} error={m.error}
          onCancel={() => { setShowDelete(false); m.clearError(); }} onConfirm={doDelete}>
          <p>
            This class has no students.{rows.length > 0 ? <> Its {rows.length} subject teacher assignment{rows.length > 1 ? 's' : ''} will be removed too.</> : ''}
            {lead ? ` ${lead.fullName} will no longer be its class teacher.` : ''}
          </p>
          <p className="mt-2 font-medium text-slate-800">This can’t be undone.</p>
        </ConfirmDialog>
      )}
    </div>
  );
}