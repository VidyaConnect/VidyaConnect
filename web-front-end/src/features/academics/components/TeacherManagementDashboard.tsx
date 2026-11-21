'use client';
import { useEffect, useState } from 'react';
import { GraduationCap, Users } from 'lucide-react';
import { CURRENT_ACADEMIC_YEAR } from '../services/teacherManagementService';
import { useTeacherManagement } from '../hooks/useTeacherManagement';
import { TeachersView, type RoleFilter } from './TeachersView';
import { ClassesView } from './ClassesView';
import { ErrorBanner } from './TeacherUiKit';

const PAGE_NAME = 'Teacher Management'; // change the page title here

type View = 'teachers' | 'classes';

export function TeacherManagementDashboard() {
  const m = useTeacherManagement();
  const [view, setView] = useState<View>('teachers');
  const [role, setRole] = useState<RoleFilter>('all');
  const { stats } = m;

  // A school with no classes yet starts on the setup screen.
  useEffect(() => { if (!m.loading && m.classes.length === 0) setView('classes'); }, [m.loading, m.classes.length]);

  return (
    <div className="space-y-6">
      {/* Blue banner, same style as Bulk Registration */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#073b78] to-[#0a56a8] p-6 text-white shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-12 right-24 h-32 w-32 rounded-full bg-[#00a896]/30" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15"><Users className="h-6 w-6" /></div>
            <div>
              <h1 className="text-2xl font-bold">{PAGE_NAME}</h1>
              <p className="mt-0.5 text-sm text-white/75">
                {m.loading ? 'Loading…' : `${stats.teachers} teachers · ${stats.classTeachers} lead a class · academic year ${CURRENT_ACADEMIC_YEAR}`}
              </p>
            </div>
          </div>

          <div role="tablist" aria-label="View" className="inline-flex gap-1 rounded-xl bg-white/10 p-1">
            {([['teachers', 'Manage teachers', Users], ['classes', 'Manage classes', GraduationCap]] as const).map(([key, label, Icon]) => (
              <button key={key} role="tab" aria-selected={view === key} onClick={() => setView(key)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${view === key ? 'bg-[#00a896] text-white shadow-sm' : 'text-white/85 hover:bg-white/10'}`}>
                <Icon className="h-4 w-4" />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content in an outlined white card */}
      <div className="rounded-2xl border border-[#e2e6ee] bg-white p-5 shadow-sm sm:p-6">
        <ErrorBanner onDismiss={m.clearError}>{m.error}</ErrorBanner>
        <div className={m.error ? 'mt-4' : ''}>
          {view === 'teachers' ? <TeachersView m={m} role={role} onRoleChange={setRole} /> : <ClassesView m={m} />}
        </div>
      </div>
    </div>
  );
}