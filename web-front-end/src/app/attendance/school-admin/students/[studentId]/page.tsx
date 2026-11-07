'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import DashboardLayout from '@/features/attendance/components/DashboardLayout'
import { attendanceService } from '@/features/attendance/services/attendanceService'

/* ───────────────────────── types & helpers ───────────────────────── */

type Kind = 'present' | 'late' | 'absent' | 'excused'
type Rec = { date: string; kind: Kind; reason?: string }
type Info = { name?: string; rollNumber?: string; className?: string }

const META: Record<Kind, { label: string; color: string; pill: string; cell: string }> = {
  present: { label: 'Present', color: '#2bb3a3', pill: 'bg-[#d6f0ec] text-[#0f7d73]', cell: 'bg-[#2bb3a3] text-white' },
  late: { label: 'Late', color: '#e0a030', pill: 'bg-[#fbecd0] text-[#8f5f00]', cell: 'bg-[#e0a030] text-white' },
  absent: { label: 'Absent', color: '#d9534f', pill: 'bg-[#fadddc] text-[#b3262b]', cell: 'bg-[#d9534f] text-white' },
  excused: { label: 'Excused', color: '#7d9bd6', pill: 'bg-[#e3ecfb] text-[#2f5bb0]', cell: 'bg-[#7d9bd6] text-white' },
}
const KINDS: Kind[] = ['present', 'late', 'absent', 'excused']

function toKind(v: unknown): Kind | null {
  const s = String(v ?? '').toLowerCase().replace(/[_\s]/g, '')
  if (s === 'present' || s === 'p') return 'present'
  if (s === 'late' || s === 'l') return 'late'
  if (s === 'absent' || s === 'a') return 'absent'
  if (s === 'exempted' || s === 'excused' || s === 'e') return 'excused'
  return null // "not marked" is not a real attendance day
}

const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v : undefined)

// Accepts: an array, or { records | history | attendance | data | items: [...] }
function normalise(raw: unknown): { records: Rec[]; info: Info; received: number } {
  let list: unknown[] = []
  const info: Info = {}
  if (Array.isArray(raw)) {
    list = raw
  } else if (raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>
    const cand = o.records ?? o.history ?? o.attendance ?? o.data ?? o.items
    if (Array.isArray(cand)) list = cand
    info.name = str(o.studentName) ?? str(o.name)
    info.rollNumber = str(o.rollNumber)
    info.className = str(o.className)
  }
  const byDate = new Map<string, Rec>()
  for (const item of list) {
    const r = (item ?? {}) as Record<string, unknown>
    const kind = toKind(r.status)
    const date = String(r.date ?? r.day ?? r.markedAt ?? '').slice(0, 10)
    if (!kind || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue
    byDate.set(date, { date, kind, reason: str(r.absenceReason) ?? str(r.reason) })
  }
  const records = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))
  return { records, info, received: list.length }
}

const parseDate = (d: string) => {
  const [y, m, day] = d.split('-').map(Number)
  return new Date(y, m - 1, day)
}
const fmtLong = (d: string) =>
  parseDate(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
const fmtShort = (d: string) => parseDate(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const monthKey = (d: string) => d.slice(0, 7)
const monthLabel = (key: string) =>
  new Date(Number(key.slice(0, 4)), Number(key.slice(5, 7)) - 1, 1).toLocaleDateString('en-US', { month: 'short' })
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const rateOf = (present: number, late: number, absent: number) => {
  const denom = present + late + absent
  return denom === 0 ? null : Math.round(((present + late) / denom) * 100)
}
const rateOnDark = (r: number | null) => (r === null ? '#8fa3c0' : r >= 90 ? '#3cc3b2' : r >= 75 ? '#e0a030' : '#e5645f')

type Tone = 'white' | 'tint' | 'teal' | 'navy'
const TONES: Record<Tone, string> = {
  white: 'bg-white border-[#cfdcec]',
  tint: 'bg-[#f3f7fc] border-[#cfdcec]',
  teal: 'bg-linear-to-br from-[#e3f4f1] to-[#f1f9f8] border-[#b9e0da]',
  navy: 'bg-linear-to-br from-[#073b78] to-[#0a4a8f] border-[#0a4a8f] text-white',
}
function Card({ children, className = '', tone = 'white' }: { children: React.ReactNode; className?: string; tone?: Tone }) {
  return <div className={`rounded-xl border shadow-sm ${TONES[tone]} ${className}`}>{children}</div>
}

// Thin segmented donut: one arc per status, flat caps, no gap when a single status fills the circle (100%).
function Donut({ counts, total, rate }: { counts: Record<Kind, number>; total: number; rate: number | null }) {
  const r = 54
  const c = 2 * Math.PI * r
  const segs = KINDS.filter((k) => counts[k] > 0)
  const gap = segs.length > 1 ? 2.5 : 0
  let offset = 0
  return (
    <div className="relative h-40 w-40 shrink-0">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="11" />
        {total > 0 &&
          segs.map((k) => {
            const len = (counts[k] / total) * c
            const dash = Math.max(len - gap, 0.01)
            const el = (
              <circle
                key={k}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={META[k].color}
                strokeWidth="11"
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset}
              />
            )
            offset += len
            return el
          })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-3xl font-semibold tabular-nums leading-none">{rate === null ? '—' : `${rate}%`}</span>
        <span className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/60">Attendance</span>
      </div>
    </div>
  )
}

/* ───────────────────────── page ───────────────────────── */

const PREVIEW = 12

export default function StudentHistoryPage() {
  const { studentId } = useParams<{ studentId: string }>()

  const [records, setRecords] = useState<Rec[]>([])
  const [info, setInfo] = useState<Info>({})
  const [received, setReceived] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filter, setFilter] = useState<'all' | Kind>('all')
  const [showAll, setShowAll] = useState(false)
  const [cal, setCal] = useState<{ y: number; m: number } | null>(null)

  useEffect(() => {
    let alive = true
    Promise.allSettled([attendanceService.getHistory(studentId), attendanceService.getAdminOverview()]).then(
      ([hist, over]) => {
        if (!alive) return
        let fromOverview: Info = {}
        if (over.status === 'fulfilled') {
          const data = over.value as unknown as {
            classes?: { className: string; students: { id: string; name: string; rollNumber?: string }[] }[]
          }
          for (const c of data.classes ?? []) {
            const s = c.students?.find((x) => x.id === studentId)
            if (s) {
              fromOverview = { name: s.name, rollNumber: s.rollNumber, className: c.className }
              break
            }
          }
        }
        if (hist.status === 'fulfilled') {
          const n = normalise(hist.value)
          setRecords(n.records)
          setReceived(n.received)
          setInfo({ ...fromOverview, ...Object.fromEntries(Object.entries(n.info).filter(([, v]) => v)) })
          const last = n.records[n.records.length - 1]
          const d = last ? parseDate(last.date) : new Date()
          setCal({ y: d.getFullYear(), m: d.getMonth() })
        } else {
          setInfo(fromOverview)
          setError(hist.reason instanceof Error ? hist.reason.message : 'Failed to load attendance history')
        }
        setLoading(false)
      }
    )
    return () => {
      alive = false
    }
  }, [studentId])

  /* totals */
  const counts = useMemo(() => {
    const c: Record<Kind, number> = { present: 0, late: 0, absent: 0, excused: 0 }
    for (const r of records) c[r.kind] += 1
    return c
  }, [records])
  const rate = rateOf(counts.present, counts.late, counts.absent)

  /* monthly trend (last 6 months with data) */
  const months = useMemo(() => {
    const m = new Map<string, { present: number; late: number; absent: number }>()
    for (const r of records) {
      const k = monthKey(r.date)
      const e = m.get(k) ?? { present: 0, late: 0, absent: 0 }
      if (r.kind === 'present' || r.kind === 'late' || r.kind === 'absent') e[r.kind] += 1
      m.set(k, e)
    }
    return [...m.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, v]) => ({ key, rate: rateOf(v.present, v.late, v.absent), days: v.present + v.late + v.absent }))
  }, [records])

  /* insights */
  const insights = useMemo(() => {
    const out: { tone: 'good' | 'warn' | 'bad' | 'info'; text: string }[] = []
    if (records.length === 0) return out

    // current streak: latest days in a row that were present/late
    let streak = 0
    for (let i = records.length - 1; i >= 0; i--) {
      const k = records[i].kind
      if (k === 'excused') continue
      if (k === 'present' || k === 'late') streak += 1
      else break
    }
    if (streak >= 3) out.push({ tone: 'good', text: `${streak} school days in a row attended.` })

    // weekday pattern
    const byDay = new Array(7).fill(0)
    for (const r of records) if (r.kind === 'absent') byDay[parseDate(r.date).getDay()] += 1
    const maxAbs = Math.max(...byDay)
    if (maxAbs >= 2) out.push({ tone: 'warn', text: `Most absences fall on ${WEEKDAYS[byDay.indexOf(maxAbs)]}s (${maxAbs} so far).` })

    // recent vs earlier
    const counted = records.filter((r) => r.kind !== 'excused')
    if (counted.length >= 10) {
      const recent = counted.slice(-5)
      const earlier = counted.slice(0, -5)
      const rr = rateOf(
        recent.filter((r) => r.kind === 'present').length,
        recent.filter((r) => r.kind === 'late').length,
        recent.filter((r) => r.kind === 'absent').length
      )
      const er = rateOf(
        earlier.filter((r) => r.kind === 'present').length,
        earlier.filter((r) => r.kind === 'late').length,
        earlier.filter((r) => r.kind === 'absent').length
      )
      if (rr !== null && er !== null && Math.abs(rr - er) >= 10)
        out.push(
          rr > er
            ? { tone: 'good', text: `Improving: last 5 days ${rr}% vs ${er}% before.` }
            : { tone: 'bad', text: `Slipping: last 5 days ${rr}% vs ${er}% before.` }
        )
    }

    if (counts.late >= 3) out.push({ tone: 'warn', text: `Arrived late ${counts.late} times.` })
    const noReason = records.filter((r) => r.kind === 'absent' && !r.reason).length
    if (noReason > 0) out.push({ tone: 'info', text: `${noReason} absence${noReason === 1 ? '' : 's'} without a recorded reason.` })

    if (rate !== null && rate < 75) out.push({ tone: 'bad', text: 'Attendance is below 75%. A parent follow-up is recommended.' })
    else if (out.length === 0 && rate !== null && rate >= 90) out.push({ tone: 'good', text: 'Excellent attendance. Nothing to flag.' })

    return out
  }, [records, counts.late, rate])

  /* calendar */
  const byDate = useMemo(() => new Map(records.map((r) => [r.date, r])), [records])
  const calCells = useMemo(() => {
    if (!cal) return []
    const first = new Date(cal.y, cal.m, 1).getDay()
    const days = new Date(cal.y, cal.m + 1, 0).getDate()
    const cells: ({ day: number; rec?: Rec; weekend: boolean } | null)[] = Array(first).fill(null)
    for (let d = 1; d <= days; d++) {
      const key = `${cal.y}-${String(cal.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const dow = new Date(cal.y, cal.m, d).getDay()
      cells.push({ day: d, rec: byDate.get(key), weekend: dow === 0 || dow === 6 })
    }
    return cells
  }, [cal, byDate])
  const shiftMonth = (delta: number) =>
    setCal((c) => {
      if (!c) return c
      const d = new Date(c.y, c.m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })

  /* table */
  const listed = useMemo(
    () => [...records].reverse().filter((r) => filter === 'all' || r.kind === filter),
    [records, filter]
  )
  const visible = showAll ? listed : listed.slice(0, PREVIEW)

  const name = info.name ?? studentId
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
  const hasData = !loading && records.length > 0

  return (
    <DashboardLayout userRole="admin" currentPage="attendance" onNavigate={() => {}} searchValue="" onSearch={() => {}}>
      <main className="w-full flex-1 bg-linear-to-b from-[#e3ecf7] via-[#ecf2f9] to-[#f3f7fb]">
        <div className="mx-auto w-full max-w-7xl px-6 pb-12 pt-6 lg:px-8">
          <Link href="/attendance/school-admin" className="text-sm font-semibold text-[#073b78] hover:underline">
            ← All classes
          </Link>

          {/* summary header */}
          <div className="mb-6 mt-3 overflow-hidden rounded-xl bg-linear-to-br from-[#062f5e] to-[#0b4a8c] p-6 text-white shadow-sm lg:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-lg font-semibold tracking-wide">
                  {loading ? '…' : initials || '?'}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">{loading ? 'Loading…' : name}</h1>
                  <p className="mt-0.5 text-sm text-white/70">
                    {[info.className, info.rollNumber && `Roll ${info.rollNumber}`].filter(Boolean).join(' · ') || 'Attendance history'}
                  </p>
                </div>
              </div>
              {hasData && (
                <p className="text-xs text-white/60">
                  {records.length} days recorded · {fmtShort(records[0].date)} – {fmtShort(records[records.length - 1].date)}
                </p>
              )}
            </div>

            {hasData && (
              <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-white/10 pt-6">
                <Donut counts={counts} total={records.length} rate={rate} />
                <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
                  {KINDS.map((k) => (
                    <div key={k} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-white/60">
                        <span className="h-2 w-2 rounded-sm" style={{ background: META[k].color }} />
                        {META[k].label}
                      </div>
                      <div className="mt-1.5 flex items-baseline gap-2">
                        <span className="text-2xl font-semibold tabular-nums">{counts[k]}</span>
                        <span className="text-xs tabular-nums text-white/50">{Math.round((counts[k] / records.length) * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-5 rounded-md border border-[#f5c0bd] bg-[#fdecea] px-4 py-3 text-sm text-[#c3161c]">{error}</div>
          )}

          {loading ? (
            <div className="space-y-4">
              <div className="h-72 animate-pulse rounded-xl bg-[#d5e1f0]" />
              <div className="h-56 animate-pulse rounded-xl bg-[#d5e1f0]" />
            </div>
          ) : records.length === 0 ? (
            <Card className="px-6 py-14 text-center">
              <h2 className="text-lg font-semibold text-[#073b78]">No attendance recorded yet</h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-[#5b6b82]">
                Days appear here once a teacher marks this student present, late or absent.
              </p>
              {received > 0 && (
                <p className="mx-auto mt-4 max-w-md rounded-md bg-[#fff8e6] px-3 py-2 text-xs text-[#7a5200]">
                  The server returned {received} entries, but none had a readable date and status. The response format may
                  differ from what this page expects.
                </p>
              )}
            </Card>
          ) : (
            <>
              {/* calendar + insights/trend */}
              <div className="mb-6 grid gap-4 lg:grid-cols-3">
                <Card tone="tint" className="p-6 lg:col-span-2">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-[#073b78]">Calendar</h2>
                    {cal && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => shiftMonth(-1)}
                          className="h-8 w-8 rounded-md border border-[#cfdcec] bg-white text-[#073b78] hover:bg-[#e3ecf7]"
                          aria-label="Previous month"
                        >
                          ‹
                        </button>
                        <span className="w-36 text-center text-sm font-semibold text-[#073b78]">
                          {new Date(cal.y, cal.m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                          onClick={() => shiftMonth(1)}
                          className="h-8 w-8 rounded-md border border-[#cfdcec] bg-white text-[#073b78] hover:bg-[#e3ecf7]"
                          aria-label="Next month"
                        >
                          ›
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold uppercase text-[#5b6b82]">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                      <div key={i}>{d}</div>
                    ))}
                  </div>
                  <div className="mt-1.5 grid grid-cols-7 gap-1.5">
                    {calCells.map((c, i) =>
                      c === null ? (
                        <div key={`b${i}`} />
                      ) : (
                        <div
                          key={c.day}
                          title={
                            c.rec
                              ? `${META[c.rec.kind].label}${c.rec.reason ? ` — ${c.rec.reason}` : ''}`
                              : c.weekend
                                ? 'Weekend'
                                : 'No record'
                          }
                          className={`flex aspect-square items-center justify-center rounded-md text-xs font-semibold ${
                            c.rec
                              ? META[c.rec.kind].cell
                              : c.weekend
                                ? 'bg-[#e8eef7] text-[#b4c0d2]'
                                : 'bg-[#dbe5f2] text-[#6f819b]'
                          }`}
                        >
                          {c.day}
                        </div>
                      )
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-[#cfdcec] pt-3">
                    {KINDS.map((k) => (
                      <span key={k} className="flex items-center gap-1.5 text-xs text-[#3c4a5f]">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: META[k].color }} />
                        {META[k].label}
                      </span>
                    ))}
                  </div>
                </Card>

                <div className="flex flex-col gap-4">
                  <Card tone="teal" className="p-6">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#0f7d73]">Insights</h2>
                    {insights.length === 0 ? (
                      <p className="text-sm text-[#4a6b68]">More days are needed before patterns appear.</p>
                    ) : (
                      <ul className="space-y-2.5">
                        {insights.map((n, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-[#2f4a47]">
                            <span
                              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                              style={{
                                background:
                                  n.tone === 'good' ? '#2bb3a3' : n.tone === 'warn' ? '#e0a030' : n.tone === 'bad' ? '#d9534f' : '#4f7ac7',
                              }}
                            />
                            {n.text}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>

                  <Card tone="navy" className="flex-1 p-6">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/90">Monthly trend</h2>
                    <div className="flex h-32 items-end gap-3">
                      {months.map((m) => (
                        <div key={m.key} className="flex flex-1 flex-col items-center gap-1" title={`${m.days} days`}>
                          <span className="text-[11px] font-semibold tabular-nums" style={{ color: rateOnDark(m.rate) }}>
                            {m.rate === null ? '—' : `${m.rate}%`}
                          </span>
                          <div className="flex h-20 w-full items-end rounded-sm bg-white/10">
                            <div
                              className="w-full rounded-sm transition-all duration-700"
                              style={{ height: `${m.rate ?? 0}%`, background: rateOnDark(m.rate) }}
                            />
                          </div>
                          <span className="text-[11px] text-white/60">{monthLabel(m.key)}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              {/* records */}
              <Card className="overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#cfdcec] bg-[#f3f7fc] px-6 py-4">
                  <h2 className="text-lg font-semibold text-[#073b78]">All records</h2>
                  <div className="flex flex-wrap gap-2">
                    {(['all', ...KINDS] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          setFilter(f)
                          setShowAll(false)
                        }}
                        className={`rounded-md px-3 py-1 text-xs font-semibold ${
                          filter === f ? 'bg-[#073b78] text-white' : 'bg-white text-[#3c4a5f] ring-1 ring-[#cfdcec] hover:bg-[#e3ecf7]'
                        }`}
                      >
                        {f === 'all' ? 'All' : META[f].label}
                      </button>
                    ))}
                  </div>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#073b78] text-xs uppercase tracking-wide text-white/90">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Date</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3ecf7]">
                    {visible.map((r) => (
                      <tr key={r.date} className="hover:bg-[#f1f6fc]">
                        <td className="px-6 py-3 font-medium text-[#1f2a3a]">{fmtLong(r.date)}</td>
                        <td className="px-6 py-3">
                          <span className={`rounded px-2.5 py-0.5 text-xs font-semibold ${META[r.kind].pill}`}>
                            {META[r.kind].label}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-[#3c4a5f]">{r.reason ?? (r.kind === 'absent' ? 'No reason recorded' : '—')}</td>
                      </tr>
                    ))}
                    {visible.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-10 text-center text-[#5b6b82]">
                          No records match.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {!showAll && listed.length > PREVIEW && (
                  <div className="border-t border-[#e3ecf7] bg-[#f3f7fc] px-6 py-3">
                    <button onClick={() => setShowAll(true)} className="text-sm font-semibold text-[#007c6d] hover:underline">
                      Show all {listed.length} records
                    </button>
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </main>
    </DashboardLayout>
  )
}