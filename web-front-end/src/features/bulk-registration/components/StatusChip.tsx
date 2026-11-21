import type { ReactNode } from 'react';
import { chipTone } from '../utils/styles';

export function StatusChip({ tone, children }: { tone: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${chipTone[tone]}`}>
      {children}
    </span>
  );
}
