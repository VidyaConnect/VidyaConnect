import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { ImportOutcome } from '../services/bulkRegistrationService';

export function ClassResult({ result, onAgain, onDone }: {
  result: ImportOutcome;
  onAgain: () => void;
  onDone: () => void;
}) {
  const created = result.class?.created ?? 0;
  const skipped = result.class?.skipped ?? 0;

  return (
    <>
      <div className="flex flex-col items-center py-4 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-[#e6f6f4] text-[#00a896]">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-[#073b78]">Classes imported</h2>
        <p className="mt-1 max-w-md text-sm text-slate-600">
          Your classes are ready. You can now add teachers and students to them.
        </p>
      </div>

      <div className="mx-auto mt-2 grid max-w-xl gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#e2e6ee] p-5 text-center">
          <p className="text-3xl font-bold text-[#00a896]">{created}</p>
          <p className="mt-1 text-sm font-medium text-slate-600">Classes created</p>
        </div>
        <div className="rounded-2xl border border-[#e2e6ee] p-5 text-center">
          <p className="text-3xl font-bold text-[#073b78]">{skipped}</p>
          <p className="mt-1 text-sm font-medium text-slate-600">Rows skipped</p>
        </div>
      </div>

      {result.failures.length > 0 && (
        <div className="mx-auto mt-6 max-w-xl">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <AlertCircle className="h-4 w-4 text-amber-500" />Skipped rows
          </p>
          <ul className="mt-2 max-h-48 divide-y divide-[#eef0f5] overflow-auto rounded-xl border border-[#e2e6ee] text-sm">
            {result.failures.map((f) => (
              <li key={f.row} className="flex justify-between gap-4 px-4 py-2.5">
                <span className="text-slate-700">Row {f.row}: {f.name}</span>
                <span className="text-right text-slate-500">{f.error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#eef0f5] pt-5 sm:flex-row sm:justify-end">
        <button
          onClick={onAgain}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          Import another file
        </button>
        <button
          onClick={onDone}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#073b78] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a56a8]"
        >
          Back to School Setup<ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}