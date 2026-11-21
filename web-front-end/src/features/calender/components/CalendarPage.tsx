'use client';

import { useCurrentRole } from '../hooks/useCurrentRole';
import { CalendarView } from './CalendarView';

export function CalendarPage() {
  const { role, ready } = useCurrentRole();

  if (!ready) {
    return <div className="py-20 text-center text-sm text-slate-500">Loading…</div>;
  }

  if (!role) {
    return (
      <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
        Could not determine your role. Please log in again.
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1480px] px-6 pb-8 pt-8">
      <h1 className="text-2xl font-bold text-[#0b3d91]">Calendar</h1>
      <p className="mb-5 text-sm text-slate-500">
        School events, exams, meetings and holidays.
      </p>
      <CalendarView role={role} />
    </main>
  );
}