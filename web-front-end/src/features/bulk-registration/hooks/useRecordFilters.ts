'use client';
import { useMemo, useState } from 'react';
import type { PreviewRow, RowStatus } from '../types';

export function useRecordFilters(rows: PreviewRow[]) {
  const [filter, setFilter] = useState<'all' | RowStatus>('all');
  const [query, setQuery] = useState('');
  const shown = useMemo(
    () => rows.filter((r) => (filter === 'all' || r.status === filter) && JSON.stringify(r).toLowerCase().includes(query.toLowerCase())),
    [rows, filter, query],
  );
  return { filter, setFilter, query, setQuery, shown };
}
