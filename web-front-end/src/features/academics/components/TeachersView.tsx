'use client';
import { useMemo, useState } from 'react';
import { BookOpen, Loader2, Search } from 'lucide-react';
import type { TeacherManagement } from '../hooks/useTeacherManagement';
import { TeacherPanel } from './TeacherPanel';
import { Avatar, Chip, inputCls } from './TeacherUiKit';

export type RoleFilter = 'all' | 'classTeacher' | 'noClass';
const ROLES: { key: RoleFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'classTeacher', label: 'Class teachers' },
  { key: 'noClass', label: 'No class' },
];

interface Props { m: TeacherManagement; role: RoleFilter; onRoleChange: (r: RoleFilter) => void }

/** Master–detail: pick a teacher on the left, edit them on the right. */
export function TeachersView({ m, role, onRoleChange }: Props) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return m.teachers.filter((t) => {
      if (role === 'classTeacher' && !t.classTeacherOf) return false;
      if (role === 'noClass' && t.classTeacherOf) return false;
      return !q || [t.fullName, t.email, t.teacherCode].some((v) => v?.toLowerCase().includes(q));
    });
  }, [m.teachers, query, role]);

  // On desktop the first teacher is open by default; on mobile the list shows until one is tapped.
  const active = m.teachers.find((t) => t.id === selectedId) ?? (selectedId === null ? shown[0] : undefined) ?? null;

  return (
    <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
      <div className={selectedId ? 'hidden lg:block' : 'block'}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email or code" aria-label="Search teachers" className={`${inputCls} pl-9`} />
        </div>
        <div role="tablist" aria-label="Teacher role" className="mt-3 flex gap-1.5">
          {ROLES.map((r) => (
            <button key={r.key} role="tab" aria-selected={role === r.key} onClick={() => onRoleChange(r.key)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${role === r.key ? 'bg-[#073b78] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {r.label}
            </button>
          ))}
        </div>

        {!m.loading && (
          <p className="mt-3 px-1 text-xs text-slate-500">
            {shown.length === m.teachers.length ? `${m.teachers.length} teachers` : `${shown.length} of ${m.teachers.length} teachers`}
          </p>
        )}

        {/* The list scrolls inside its own box, so the page and the right card stay in place. */}
        <ul className="mt-2 space-y-1.5 lg:max-h-[68vh] lg:overflow-y-auto lg:pr-1">
          {m.loading && <li className="py-10 text-center text-sm text-slate-500"><Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />Loading teachers…</li>}
          {!m.loading && shown.length === 0 && <li className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No teachers match. Clear the search or pick “All”.</li>}
          {shown.map((t) => {
            const on = active?.id === t.id;
            const subjects = new Set(t.teaching.map((a) => a.subject)).size;
            const classCount = new Set(t.teaching.map((a) => a.classId)).size;
            return (
              <li key={t.id}>
                <button onClick={() => { m.clearError(); setSelectedId(t.id); }} aria-current={on}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${on ? 'border-[#073b78] bg-blue-50/60' : 'border-transparent hover:bg-slate-50'}`}>
                  <Avatar id={t.id} name={t.fullName} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800">{t.fullName}</span>
                    <span className="block text-xs text-slate-500">
                      {subjects === 0 ? 'No subjects yet' : `${subjects} subject${subjects > 1 ? 's' : ''}, ${classCount} class${classCount > 1 ? 'es' : ''}`}
                    </span>
                  </span>
                  {t.classTeacherOf && <Chip tone="green"><BookOpen className="h-3 w-3" />{t.classTeacherOf.className}</Chip>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Pinned beside the list on desktop. If the card is taller than the screen, it scrolls on its own. */}
      <div className={`${selectedId ? 'block' : 'hidden lg:block'} lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto lg:rounded-2xl`}>
        {active ? <TeacherPanel key={active.id} teacher={active} m={m} onBack={() => setSelectedId(null)} onDeleted={() => setSelectedId(null)} />
          : !m.loading && <p className="rounded-2xl border border-dashed border-[#cfd4dd] p-10 text-center text-sm text-slate-500">Select a teacher to see their classes and subjects.</p>}
      </div>
    </div>
  );
}