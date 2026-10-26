import RolePortalChrome from '@/components/RolePortalChrome'
import { CalendarView } from '@/features/calender/components/CalendarView'

export default function AdminCalendarPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <RolePortalChrome userRole="admin" />
      <main className="mx-auto w-full max-w-[1480px] px-6 pb-8 pt-8">
        <h1 className="text-2xl font-bold text-[#073b78]">Calendar</h1>
        <p className="mb-5 text-sm text-slate-500">
          School events, exams, meetings and holidays.
        </p>
        <CalendarView role="ADMIN" />
      </main>
    </div>
  )
}