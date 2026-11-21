'use client';
import { useEffect, useState } from 'react';
import { Settings2 } from 'lucide-react';
import type { RegType } from '../types';
import { fetchSetupStatus } from '../services/bulkRegistrationService';
import RegistrationWizard from './RegistrationWizard';
import { SetupOverview, type SetupStatus } from './SetupOverview';

const THIS_YEAR = new Date().getFullYear();
const YEARS = [THIS_YEAR - 1, THIS_YEAR, THIS_YEAR + 1];

// Loads the counts for the selected year. If the request fails the status stays
// "unknown" (null), and nothing gets locked.
function useSetupStatus(year: number, refreshKey: boolean): SetupStatus {
  const [status, setStatus] = useState<SetupStatus>({ classes: null, teachers: null, students: null });
  useEffect(() => {
    let cancelled = false;
    setStatus({ classes: null, teachers: null, students: null });
    fetchSetupStatus(String(year))
      .then((s) => { if (!cancelled) setStatus(s); })
      .catch(() => { /* keep unknown */ });
    return () => { cancelled = true; };
  }, [year, refreshKey]);
  return status;
}

function PageHeader({ year, onYearChange }: { year: number; onYearChange: (y: number) => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#073b78] to-[#0a56a8] p-6 text-white shadow-sm sm:p-7">
      <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-12 right-24 h-32 w-32 rounded-full bg-[#00a896]/30" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Settings2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">School Setup</h1>
            <p className="mt-0.5 text-sm text-white/75">Add classes first, then register teachers and students.</p>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold">
          Academic year
          <select
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="rounded-lg border border-white/30 bg-white/15 px-3 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {YEARS.map((y) => <option key={y} value={y} className="text-slate-900">{y}</option>)}
          </select>
        </label>
      </div>
    </div>
  );
}

export function BulkRegistrationDashboard() {
  const [type, setType] = useState<RegType>('class');
  const [inWizard, setInWizard] = useState(false);
  const [year, setYear] = useState(THIS_YEAR);
  const status = useSetupStatus(year, inWizard);

  // Landing view: banner + the three setup steps
  if (!inWizard) {
    return (
      <div className="space-y-6">
        <PageHeader year={year} onYearChange={setYear} />
        <div className="rounded-2xl border border-[#e2e6ee] bg-white p-6 shadow-sm">
          <SetupOverview status={status} academicYear={year} onStart={(t) => { setType(t); setInWizard(true); }} />
        </div>
      </div>
    );
  }

  // Wizard view: opens directly at the upload step, with the year already chosen
  return (
    <RegistrationWizard
      key={`${type}-${year}`}
      initialType={type}
      academicYear={String(year)}
      startAtUpload
      onExit={() => setInWizard(false)}
    />
  );
}