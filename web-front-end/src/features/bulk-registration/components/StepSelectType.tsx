import { ArrowRight, CheckCircle2, GraduationCap, KeyRound, School, ShieldCheck, Users } from 'lucide-react';
import type { ElementType } from 'react';
import type { RegType } from '../types';
import { REG_COPY } from '../utils/constants';

interface Look {
  icon: ElementType; tagIcon: ElementType; tag: string; lead: string; next: string[]; needs: string[];
  wrap: string; selected: string; tone: string; chip: string; button: string;
}

const LOOK: Record<RegType, Look> = {
  class: {
    icon: School, tagIcon: School, tag: 'Do this first',
    lead: REG_COPY.class.after,
    next: ['Classes are created for the selected academic year', 'Classes that already exist are skipped', 'Teachers and students can then be assigned to them'],
    needs: ['Grade (1–13)', 'Class (for example A)'],
    wrap: 'bg-amber-50 text-amber-700', selected: 'border-amber-600 bg-amber-50/40 ring-4 ring-amber-600/10',
    tone: 'text-amber-600', chip: 'bg-amber-50 text-amber-700', button: 'bg-amber-600 hover:bg-amber-700',
  },
  teacher: {
    icon: Users, tagIcon: KeyRound, tag: 'Creates login accounts',
    lead: REG_COPY.teacher.after,
    next: ['Teacher profile is created for your school', 'A login account with a temporary password is created', 'Class teachers can be assigned to their class'],
    needs: ['Teacher code (optional)', 'First and last name', 'Email', 'Class (class teachers only)'],
    wrap: 'bg-blue-50 text-[#073b78]', selected: 'border-[#073b78] bg-blue-50/40 ring-4 ring-[#073b78]/10',
    tone: 'text-[#073b78]', chip: 'bg-blue-50 text-[#073b78]', button: 'bg-[#073b78] hover:bg-[#0a56a8]',
  },
  student: {
    icon: GraduationCap, tagIcon: ShieldCheck, tag: 'Internal records, no login',
    lead: REG_COPY.student.after,
    next: ['Student profile is saved as a school record', 'Student is assigned to a grade and class', 'Parents are linked through the existing parent workflow'],
    needs: ['Admission number', 'First and last name', 'Grade and class', 'Academic year'],
    wrap: 'bg-[#e6f6f4] text-[#00a896]', selected: 'border-[#00a896] bg-[#e6f6f4]/40 ring-4 ring-[#00a896]/10',
    tone: 'text-[#00a896]', chip: 'bg-[#e6f6f4] text-[#00796b]', button: 'bg-[#00a896] hover:bg-[#008f80]',
  },
};

export function StepSelectType({ type, onChange, onNext }: { type: RegType; onChange: (t: RegType) => void; onNext: () => void }) {
  return (
    <>
      <h2 className="text-xl font-bold text-[#073b78]">What are you adding?</h2>
      <p className="mt-1 text-sm text-slate-600">Add classes first, then teachers and students. Pick the one that matches your file.</p>

      <div role="radiogroup" aria-label="Registration type" className="mt-6 grid gap-5 lg:grid-cols-3">
        {(['class', 'teacher', 'student'] as RegType[]).map((t) => {
          const l = LOOK[t]; const Icon = l.icon; const TagIcon = l.tagIcon; const on = type === t;
          return (
            <button key={t} role="radio" aria-checked={on} onClick={() => onChange(t)}
              className={`flex flex-col rounded-2xl border-2 p-6 text-left transition ${on ? l.selected : 'border-[#e2e6ee] bg-white hover:border-[#cfd4dd] hover:shadow-sm'}`}>
              <div className="flex items-start gap-4">
                <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${l.wrap}`}><Icon className="h-7 w-7" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-[#073b78]">{REG_COPY[t].label}</span>
                    {on ? <CheckCircle2 className={`h-6 w-6 ${l.tone}`} /> : <span className="h-6 w-6 rounded-full border-2 border-slate-300" />}
                  </div>
                  <span className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${l.chip}`}><TagIcon className="h-3.5 w-3.5" />{l.tag}</span>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-600">{l.lead}</p>

              <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">What happens next</p>
              <ul className="mt-2 space-y-2">
                {l.next.map((n) => (
                  <li key={n} className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${l.tone}`} />{n}</li>
                ))}
              </ul>

              <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">You will need</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {l.needs.map((n) => <span key={n} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{n}</span>)}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">Selected: <span className="font-semibold text-[#073b78]">{REG_COPY[type].label}</span></p>
        <button onClick={onNext} className={`inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#073b78] ${LOOK[type].button}`}>
          Continue<ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}