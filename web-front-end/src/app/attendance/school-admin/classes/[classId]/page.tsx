'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import DashboardLayout from '@/features/attendance/components/DashboardLayout'
import { attendanceService } from '@/features/attendance/services/attendanceService'

type Student = { id: string; name: string; rollNumber?: string; status?: string | null }

const badge: Record<string, string> = {
  present: 'bg-[#cdeee9] text-[#0f7d73]',
  absent: 'bg-[#fde3e5] text-[#c3161c]',
  late: 'bg-[#fff0cf] text-[#a36a00]',
}

export default function ClassAttendancePage() {
  const { classId } = useParams<{ classId: string }>()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    attendanceService
      .getAdminClassRoster(classId)
      .then((d) => {
        const data = d as unknown as Student[] | { students?: Student[] }
        setStudents(Array.isArray(data) ? data : data.students ?? [])
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load class'))
      .finally(() => setLoading(false))
  }, [classId])

  // Backend sends "notMarked" / "NOT_MARKED"; normalise everything to "not marked"
  const status = (s: Student) => {
    const v = (s.status ?? '').toLowerCase().replace(/[_\s]/g, '')
    return v === '' || v === 'notmarked' ? 'not marked' : v
  }

  const shown = students.filter(
    (s) =>
      (filter === 'all' || status(s) === filter) &&
      `${s.name} ${s.rollNumber ?? ''}`.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <DashboardLayout userRole="admin" currentPage="attendance" onNavigate={() => {}} searchValue="" onSearch={() => {}}>
      <main className="mx-auto w-full max-w-7xl flex-1 px-8 pb-10 pt-6">
        <Link href="/attendance/school-admin" className="text-sm font-semibold text-[#007c6d] hover:underline">← All classes</Link>
        <h1 className="mb-5 mt-2 text-2xl font-bold text-[#003b78]">Class attendance</h1>
        {error && <div className="mb-5 rounded-md border border-[#f5c0bd] bg-[#fdecea] px-4 py-3 text-sm text-[#c3161c]">{error}</div>}

        <div className="rounded-xl border border-[#e4e5e7] bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-3 border-b border-[#e4e5e7] px-5 py-4">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or roll no…"
              className="h-9 w-64 rounded-md border border-[#d5d7db] px-3 text-sm outline-none focus:border-[#007c6d]" />
            {['all', 'present', 'absent', 'late', 'not marked'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${filter === f ? 'bg-[#073b78] text-white' : 'bg-[#eef0f2] text-[#555962]'}`}>
                {f}
              </button>
            ))}
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f7f8fa] text-xs uppercase tracking-wide text-[#777b84]">
              <tr><th className="px-5 py-3">Roll no.</th><th className="px-5 py-3">Student</th><th className="px-5 py-3">Today</th><th className="px-5 py-3" /></tr>
            </thead>
            <tbody className="divide-y divide-[#eef0f2]">
              {loading && <tr><td colSpan={4} className="px-5 py-10 text-center text-[#777b84]">Loading…</td></tr>}
              {shown.map((s) => (
                <tr key={s.id} className="hover:bg-[#f7f8fa]">
                  <td className="px-5 py-3 text-[#555962]">{s.rollNumber ?? '—'}</td>
                  <td className="px-5 py-3 font-semibold">{s.name}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${badge[status(s)] ?? 'bg-[#e4e5e7] text-[#555962]'}`}>{status(s)}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/attendance/school-admin/students/${s.id}`} className="font-semibold text-[#007c6d] hover:underline">History →</Link>
                  </td>
                </tr>
              ))}
              {!loading && shown.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-[#777b84]">No students match.</td></tr>}
            </tbody>
          </table>
        </div>
      </main>
    </DashboardLayout>
  )
}