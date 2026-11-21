import { AlertTriangle, CheckCircle2, Clock, Download, KeyRound, XCircle } from 'lucide-react';
import type { ElementType } from 'react';
import { downloadCredentials, type ImportOutcome } from '../services/bulkRegistrationService';
import type { RegType } from '../types';
import { REG_COPY } from '../utils/constants';

type State = 'done' | 'warn' | 'info';
const STATE_LOOK: Record<State, { icon: ElementType; wrap: string }> = {
  done: { icon: CheckCircle2, wrap: 'bg-emerald-50 text-emerald-600' },
  warn: { icon: XCircle, wrap: 'bg-red-50 text-red-600' },
  info: { icon: Clock, wrap: 'bg-amber-50 text-amber-600' },
};

function downloadErrorReport(failures: ImportOutcome['failures'], type: RegType) {
  const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = ['row,name,reason', ...failures.map((f) => [f.row, f.name, f.error].map(cell).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${type}-error-report.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function RegistrationResult({ type, result: r, onAgain, onDone }: { type: RegType; result: ImportOutcome; onAgain: () => void; onDone: () => void }) {
  const total = r.processed + r.failed + r.skipped;
  const allGood = r.failed === 0 && r.skipped === 0;
  const nothing = r.processed === 0;
  const hero = allGood ? 'from-emerald-600 to-emerald-500' : nothing ? 'from-red-600 to-red-500' : 'from-amber-500 to-amber-400';
  const headline = allGood ? 'Registration complete' : nothing ? 'Nothing was registered' : 'Registration finished with some issues';
  const pct = (n: number) => (total ? (n / total) * 100 : 0);
  const label = REG_COPY[type].label.toLowerCase();

  const steps: { label: string; n: number; state: State }[] =
    type === 'teacher' && r.teacher
      ? [
          { label: 'Teacher accounts created', n: r.teacher.provisioned, state: 'done' },
          { label: 'Profiles linked to login accounts', n: r.teacher.linkedToKeycloak, state: 'done' },
          { label: 'Failed (upload these rows again)', n: r.teacher.provisioningFailures, state: r.teacher.provisioningFailures > 0 ? 'warn' : 'done' },
        ]
      : r.student
        ? [
            { label: 'Student profiles created', n: r.student.profilesCreated, state: 'done' },
            { label: 'Assigned to grade and class', n: r.student.classAssignments, state: 'done' },
            { label: 'Failed (upload these rows again)', n: r.failed, state: r.failed > 0 ? 'warn' : 'done' },
          ]
        : [];

  const next =
    type === 'teacher'
      ? 'Download the login credentials and give each teacher their email and temporary password. They must choose a new password the first time they sign in.'
      : 'Students are saved as internal records. Parents link to their child from the mobile app, and you approve those requests in Parent Requests.';

  return (
    <div className="space-y-6">
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${hero} p-6 text-white`}>
        <div className="pointer-events-none absolute -right-6 -top-10 h-36 w-36 rounded-full bg-white/15" />
        <div className="relative flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20">{allGood ? <CheckCircle2 className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}</span>
          <div>
            <h2 className="text-2xl font-bold">{headline}</h2>
            <p className="mt-0.5 text-sm text-white/85">{r.processed} of {total} {label} registered · {new Date(r.completedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {r.credentials.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-900"><span className="font-semibold">Temporary passwords are shown only once.</span> Download them now and share them with each person.</p>
          </div>
          <button onClick={() => downloadCredentials(r.credentials, type)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
            <Download className="h-4 w-4" />Download login credentials
          </button>
        </div>
      )}

      <div>
        <div className="flex h-3 overflow-hidden rounded-full bg-slate-200" role="img" aria-label={`${r.processed} processed, ${r.failed} failed, ${r.skipped} skipped`}>
          <div className="bg-emerald-500" style={{ width: `${pct(r.processed)}%` }} />
          <div className="bg-red-500" style={{ width: `${pct(r.failed)}%` }} />
          <div className="bg-slate-400" style={{ width: `${pct(r.skipped)}%` }} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {([['Processed', r.processed, 'text-emerald-700 bg-emerald-50'], ['Failed', r.failed, r.failed ? 'text-red-700 bg-red-50' : 'text-slate-500 bg-slate-50'], ['Skipped', r.skipped, 'text-slate-700 bg-slate-100']] as const).map(([k, v, c]) => (
            <div key={k} className={`rounded-xl p-4 ${c}`}><p className="text-3xl font-bold">{v}</p><p className="text-xs font-semibold uppercase tracking-wider opacity-80">{k}</p></div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-[#e2e6ee] p-5 lg:col-span-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">What happened</p>
          <ul className="mt-3 divide-y divide-slate-100">
            {steps.map((s) => {
              const look = STATE_LOOK[s.state]; const Icon = look.icon;
              return (
                <li key={s.label} className="flex items-center gap-3 py-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${look.wrap}`}><Icon className="h-5 w-5" /></span>
                  <span className="flex-1 text-sm text-slate-700">{s.label}</span>
                  <span className="text-lg font-bold text-slate-900">{s.n}</span>
                </li>
              );
            })}
          </ul>

          {r.failures.length > 0 && (
            <ul className="mt-4 space-y-1 rounded-xl bg-red-50 p-3 text-sm text-red-800">
              {r.failures.map((f) => (
                <li key={f.row}><span className="font-semibold">Row {f.row} · {f.name}:</span> {f.error}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl bg-blue-50 p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#073b78]/70">What's next</p>
            <p className="mt-2 text-sm leading-relaxed text-[#073b78]">{next}</p>
          </div>
          <div className="flex flex-col gap-2">
            {r.failures.length > 0 && (
              <button onClick={() => downloadErrorReport(r.failures, type)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#cfd4dd] bg-white px-4 py-2.5 text-sm font-semibold text-[#073b78] hover:bg-gray-50"><Download className="h-4 w-4" />Download error report</button>
            )}
            <button onClick={onAgain} className="rounded-lg border border-[#cfd4dd] bg-white px-4 py-2.5 text-sm font-semibold text-[#073b78] hover:bg-gray-50">Start another import</button>
            <button onClick={onDone} className="rounded-lg bg-[#00a896] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#008f80]">Done</button>
          </div>
        </div>
      </div>
    </div>
  );
}