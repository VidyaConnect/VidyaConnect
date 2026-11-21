// Replace these with your shared design tokens / Tailwind theme colors if you have them.
export const NAVY = 'text-[#1B3A6B]';
export const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-[#006A61] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#005a52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A61] disabled:cursor-not-allowed disabled:opacity-50';
export const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B3A6B] disabled:opacity-50';
export const inputBase =
  'rounded-lg border border-slate-300 bg-white text-sm focus:border-[#006A61] focus:outline-none focus:ring-2 focus:ring-[#006A61]/20';
export const chipTone: Record<string, string> = {
  valid: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  Partial: 'bg-amber-50 text-amber-800 ring-amber-200',
  error: 'bg-red-50 text-red-700 ring-red-200',
  Failed: 'bg-red-50 text-red-700 ring-red-200',
  Processing: 'bg-slate-100 text-slate-700 ring-slate-200',
};
