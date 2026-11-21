import type { PreviewRow, RowStatus } from '../types';

export const countByStatus = (rows: PreviewRow[], s: RowStatus) => rows.filter((r) => r.status === s).length;
export const importableCount = (rows: PreviewRow[]) => rows.filter((r) => r.status !== 'error').length;
