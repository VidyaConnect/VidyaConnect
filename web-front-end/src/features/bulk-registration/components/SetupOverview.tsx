import { AlertCircle, ArrowRight, CheckCircle2, GraduationCap, Lock, School, Users } from 'lucide-react';
import type { ElementType } from 'react';
import type { RegType } from '../types';

export interface SetupStatus {
  classes: number | null;   // null = not loaded / unknown
  teachers: number | null;
  students: number | null;
}

interface Step {
  type: RegType; n: number; title: string; icon: ElementType; tag: string; lead: string;
  next: string[]; needs: string[]; cta: string;
  wrap: string; tone: string; chip: string; button: string;
}

const STEPS: Step[] = [
  {
    type: 'class', n: 1, title: 'Classes', icon: School, tag: 'Do this first',
    lead: 'Create every class in your school for the selected academic year. Everything else is assigned to these classes.',
    next: ['Classes are created for the selected academic year', 'Classes that already exist are skipped, never duplicated', 'Teachers and students can then be assigned to them'],
    needs: ['Grade (1–13)', 'Section (optional)'],
    cta: 'Import Classes',
    wrap: 'bg-[#F3EAFB] text-[#6F33CC]',tone: 'text-[#6F33CC]',chip: 'bg-[#F3EAFB] text-[#6F33CC]',button: 'bg-[#6F33CC] hover:bg-[#5928A6]',
  },
  {
    type: 'teacher', n: 2, title: 'Teachers', icon: Users, tag: 'Creates login accounts',
    lead: 'Teacher profiles are created for your school, and each teacher gets a login account with a temporary password.',
    next: ['Teacher profile is created for your school', 'A login account with a temporary password is created', 'Class teachers can be assigned to their class'],
    needs: ['Teacher code (optional)', 'First and last name', 'Email', 'Class (class teachers only)'],
    cta: 'Import Teachers',
    wrap: 'bg-blue-50 text-[#073b78]', tone: 'text-[#073b78]', chip: 'bg-blue-50 text-[#073b78]', button: 'bg-[#073b78] hover:bg-[#0a56a8]',
  },
  {
    type: 'student', n: 3, title: 'Students', icon: GraduationCap, tag: 'Internal records, no login',
    lead: 'Student profiles are saved as internal school records and assigned to their grade and class. No login accounts are created.',
    next: ['Student profile is saved as a school record', 'Student is assigned to a grade and class', 'Parents are linked through the existing parent workflow'],
    needs: ['Admission number', 'First and last name', 'Grade and class'],
    cta: 'Import Students',
    wrap: 'bg-[#e6f6f4] text-[#00a896]', tone: 'text-[#00a896]', chip: 'bg-[#e6f6f4] text-[#00796b]', button: 'bg-[#00a896] hover:bg-[#008f80]',
  },
];

const COUNT_KEY: Record<RegType, keyof SetupStatus> = { class: 'classes', teacher: 'teachers', student: 'students' };
const COUNT_LABEL: Record<RegType, string> = { class: 'classes', teacher: 'teachers', student: 'students' };

export function SetupOverview({ status, academicYear, onStart }: {
  status: SetupStatus; academicYear: number; onStart: (t: RegType) => void;
}) {
  const allDone = (status.classes ?? 0) > 0 && (status.teachers ?? 0) > 0 && (status.students ?? 0) > 0;

  return (
    <>
      <h2 className="text-xl font-bold text-[#073b78]">Set up your school in three steps</h2>
      <p className="mt-1 text-sm text-slate-600">
        Start with classes, then add teachers and students. Showing data for academic year <span className="font-semibold">{academicYear}</span>.
      </p>

      {allDone && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="h-5 w-5" />Setup complete for {academicYear}. You can still import more at any time.
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const count = status[COUNT_KEY[s.type]];
          const locked = s.type === 'student' && count !== null && status.classes === 0;
          const warn = s.type === 'teacher' && status.classes === 0;
          const done = (count ?? 0) > 0;

          return (
            <div key={s.type} className={`flex flex-col rounded-2xl border-2 p-6 ${locked ? 'border-[#e2e6ee] bg-slate-50 opacity-80' : 'border-[#e2e6ee] bg-white'}`}>
              <div className="flex items-start gap-4">
                <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${s.wrap}`}><Icon className="h-7 w-7" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-[#073b78]">{s.n}. {s.title}</span>
                    {done && <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
                    {locked && <Lock className="h-5 w-5 text-slate-400" />}
                  </div>
                  <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${s.chip}`}>
                    {done ? `${count} ${COUNT_LABEL[s.type]} added` : s.tag}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-600">{s.lead}</p>

              <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">What happens next</p>
              <ul className="mt-2 space-y-2">
                {s.next.map((n) => (
                  <li key={n} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${s.tone}`} />{n}
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">You will need</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {s.needs.map((n) => <span key={n} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{n}</span>)}
              </div>

              <div className="mt-auto pt-6">
                {locked && (
                  <p className="mb-3 flex items-start gap-2 text-xs text-slate-500">
                    <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />Add your classes first. Each student must be assigned to an existing class.
                  </p>
                )}
                {warn && (
                  <p className="mb-3 flex items-start gap-2 text-xs text-amber-700">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />No classes yet. Class teachers can only be assigned to existing classes.
                  </p>
                )}
                <button
                  onClick={() => onStart(s.type)}
                  disabled={locked}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#073b78] disabled:cursor-not-allowed disabled:bg-slate-300 ${s.button}`}
                >
                  {done ? 'Add more' : s.cta}<ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}