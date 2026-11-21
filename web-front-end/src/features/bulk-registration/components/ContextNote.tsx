import { Info } from 'lucide-react';
import type { RegType } from '../types';

/** Neutral note with a colored left edge: navy for teachers (accounts), teal for students (internal records). */
export function ContextNote({ type, children }: { type: RegType; children: string }) {
  return (
    <p className={`flex gap-3 rounded-lg border border-slate-300 border-l-4 bg-white p-4 text-sm text-slate-800 ${type === 'teacher' ? 'border-l-[#073b78]' : 'border-l-[#006A61]'}`}>
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" aria-hidden />
      <span>{children}</span>
    </p>
  );
}