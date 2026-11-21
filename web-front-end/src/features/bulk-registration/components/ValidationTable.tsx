'use client';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import type { PreviewRow, RegType } from '../types';
import { PREVIEW_COLUMNS } from '../utils/constants';
import { StatusChip } from './StatusChip';

const TIPS: Partial<Record<keyof PreviewRow, string>> = {
  email: 'Use a valid, unique address such as name@school.lk.',
  id: 'Each ID must be unique and not already registered.',
  contact: 'Add a contact number so the school can reach this person.',
  grade: 'Use a grade that exists in your school, for example Grade 6.',
  className: 'Use a class that exists in that grade, for example 6-A.',
  guardian: 'Add guardian name and number, or link a parent later.',
};

const rowTone = { valid: 'border-l-transparent', warning: 'border-l-amber-400 bg-amber-50/40', error: 'border-l-red-500 bg-red-50/40' } as const;

export function ValidationTable({ type, rows }: { type: RegType; rows: PreviewRow[] }) {
  const cols = PREVIEW_COLUMNS[type];
  const span = cols.length + 3;
  return (
    <div className="max-h-[540px] overflow-auto rounded-xl border border-[#e2e6ee]">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="sticky top-0 z-10 border-b bg-slate-50 text-xs text-slate-500">
          <tr>
            <th className="px-3 py-3 font-medium">Row</th>
            {cols.map((c) => <th key={c.key} className="px-3 py-3 font-medium">{c.label}</th>)}
            <th className="px-3 py-3 font-medium">Status</th>
            <th className="px-3 py-3 font-medium">What to do</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r.row} className={`border-l-4 align-top ${rowTone[r.status]}`}>
              <td className="px-3 py-3 text-slate-400">{r.row}</td>
              {cols.map((c) => {
                const flagged = r.errorField === c.key && r.status !== 'valid';
                const value = r[c.key] as string | undefined;
                return (
                  <td key={c.key} className="px-3 py-3">
                    {value ? (
                      <span className={flagged ? `rounded px-1.5 py-0.5 font-semibold ${r.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}` : 'text-slate-800'}>{value}</span>
                    ) : (
                      <span className={flagged ? 'rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-800' : 'text-slate-400'}>Missing</span>
                    )}
                  </td>
                );
              })}
              <td className="px-3 py-3">
                <StatusChip tone={r.status}>
                  {r.status === 'valid' ? <CheckCircle2 className="h-3 w-3" /> : r.status === 'error' ? <XCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                  {r.status === 'valid' ? 'Valid' : r.status === 'error' ? 'Error' : 'Warning'}
                </StatusChip>
              </td>
              <td className="px-3 py-3">
                {r.message ? (
                  <div className="max-w-xs">
                    <p className={`font-medium ${r.status === 'error' ? 'text-red-700' : 'text-amber-800'}`}>{r.message}</p>
                    {r.errorField && TIPS[r.errorField] && <p className="mt-0.5 text-xs text-slate-500">{TIPS[r.errorField]}</p>}
                  </div>
                ) : <span className="text-slate-400">Ready to import</span>}
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={span} className="px-4 py-10 text-center text-slate-500">No records match. Change the filter or search.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}