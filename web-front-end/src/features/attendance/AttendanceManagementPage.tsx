'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/features/attendance/components/DashboardLayout'
import { attendanceService } from '@/features/attendance/services/attendanceService'

/* ───────────────────────── types & helpers ───────────────────────── */

type Student = { id: string; name: string; rollNumber?: string; status?: string | null }
type ClassRow = { id: string; className: string; teacherName?: string; students: Student[] }

type Stat = {
  total: number
  present: number
  late: number
  absent: number
  excused: number
  notMarked: number
}

type ClassStat = ClassRow &
  Stat & {
    grade: string
    gradeNo: number
    marked: number
    rate: number | null
    submitted: boolean
  }

type GradeGroup = Stat & {
  key: string
  gradeNo: number
  classes: ClassStat[]
  marked: number
  rate: number | null
  pending: number
}

const COLORS = {
  present: '#17a69a',
  late: '#f59e0b',
  absent: '#c3161c',
  excused: '#6b8fd6',
  notMarked: '#c9cdd3',
  navy: '#003b78',
}

const SEGMENTS: { key: keyof Omit<Stat, 'total'>; label: string; color: string }[] = [
  { key: 'present', label: 'Present', color: COLORS.present },
  { key: 'late', label: 'Late', color: COLORS.late },
  { key: 'absent', label: 'Absent', color: COLORS.absent },
  { key: 'excused', label: 'Excused', color: COLORS.excused },
  { key: 'notMarked', label: 'Not marked', color: COLORS.notMarked },
]

const emptyStat = (): Stat => ({ total: 0, present: 0, late: 0, absent: 0, excused: 0, notMarked: 0 })

function statusOf(s: Student): keyof Omit<Stat, 'total'> {
  const v = (s.status ?? '').toLowerCase().replace(/[_\s]/g, '')
  if (v === 'present') return 'present'
  if (v === 'late') return 'late'
  if (v === 'absent') return 'absent'
  if (v === 'exempted' || v === 'excused') return 'excused'
  return 'notMarked'
}

function statOf(students: Student[]): Stat {
  const st = emptyStat()
  for (const s of students) {
    st.total += 1
    st[statusOf(s)] += 1
  }
  return st
}

const addStat = (a: Stat, b: Stat): Stat => ({
  total: a.total + b.total,
  present: a.present + b.present,
  late: a.late + b.late,
  absent: a.absent + b.absent,
  excused: a.excused + b.excused,
  notMarked: a.notMarked + b.notMarked,
})

// attendance rate = (present + late) / (present + late + absent); excused and unmarked are left out
function rateOf(s: Stat): number | null {
  const denom = s.present + s.late + s.absent
  return denom === 0 ? null : Math.round(((s.present + s.late) / denom) * 100)
}

// "Grade 8A" -> 8, "10 B" -> 10, anything else -> "Other"
function gradeOf(className: string): { label: string; no: number } {
  const m = className.match(/(\d{1,2})/)
  if (!m) return { label: 'Other', no: 999 }
  const no = parseInt(m[1], 10)
  return { label: `Grade ${no}`, no }
}

const rateColor = (r: number | null) =>
  r === null ? 'text-[#777b84]' : r >= 90 ? 'text-[#0f7d73]' : r >= 75 ? 'text-[#a36a00]' : 'text-[#c3161c]'

/* ───────────────────────── small visual pieces ───────────────────────── */

function Donut({ stat, rate }: { stat: Stat; rate: number | null }) {
  const r = 74
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <div className="relative h-52 w-52 shrink-0">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r={r} fill="none" stroke="#eef0f2" strokeWidth="22" />
        {stat.total > 0 &&
          SEGMENTS.map((s) => {
            const len = (stat[s.key] / stat.total) * c
            if (len <= 0) return null
            const dash = Math.max(len - 2, 0)
            const el = (
              <circle
                key={s.key}
                cx="100"
                cy="100"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="22"
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset}
                className="transition-all duration-700"
              />
            )
            offset += len
            return el
          })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-[#003b78]">{rate === null ? '—' : `${rate}%`}</span>
        <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#777b84]">Attendance</span>
      </div>
    </div>
  )
}

function StackedBar({ stat, className = 'h-2.5' }: { stat: Stat; className?: string }) {
  return (
    <div className={`flex w-full overflow-hidden rounded-full bg-[#eef0f2] ${className}`}>
      {stat.total > 0 &&
        SEGMENTS.map((s) =>
          stat[s.key] > 0 ? (
            <div
              key={s.key}
              title={`${s.label}: ${stat[s.key]}`}
              style={{ width: `${(stat[s.key] / stat.total) * 100}%`, background: s.color }}
              className="h-full transition-all duration-700"
            />
          ) : null
        )}
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-[#e4e5e7] bg-white shadow-sm ${className}`}>{children}</div>
}

function Pill({ tone, children }: { tone: 'ok' | 'warn' | 'bad'; children: React.ReactNode }) {
  const t =
    tone === 'ok'
      ? 'bg-[#cdeee9] text-[#0f7d73]'
      : tone === 'warn'
        ? 'bg-[#fff0cf] text-[#a36a00]'
        : 'bg-[#fde3e5] text-[#c3161c]'
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${t}`}>{children}</span>
}

/* ───────────────────────── page ───────────────────────── */

const PER_GROUP_PREVIEW = 8

export default function AttendanceManagementPage() {
  const [classes, setClasses] = useState<ClassRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'submitted'>('all')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [showAll, setShowAll] = useState<Set<string>>(new Set())

  const [todayLabel, setTodayLabel] = useState('')

  useEffect(() => {
    setTodayLabel(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    )
  }, [])

  useEffect(() => {
    attendanceService
      .getAdminOverview()
      .then((d) => {
        const data = d as unknown as { classes?: ClassRow[] }
        setClasses(data.classes ?? [])
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load overview'))
      .finally(() => setLoading(false))
  }, [])

  /* every class with its numbers */
  const rows: ClassStat[] = useMemo(
    () =>
      classes.map((c) => {
        const st = statOf(c.students ?? [])
        const g = gradeOf(c.className)
        const marked = st.total - st.notMarked
        return {
          ...c,
          ...st,
          grade: g.label,
          gradeNo: g.no,
          marked,
          rate: rateOf(st),
          submitted: st.total > 0 && st.notMarked === 0,
        }
      }),
    [classes]
  )

  /* whole school */
  const school = useMemo(() => rows.reduce<Stat>((a, r) => addStat(a, r), emptyStat()), [rows])
  const schoolRate = rateOf(school)
  const submittedCount = rows.filter((r) => r.submitted).length

  /* per grade (always unfiltered — it's the overview) */
  const grades: GradeGroup[] = useMemo(() => {
    const map = new Map<string, GradeGroup>()
    for (const r of rows) {
      const g =
        map.get(r.grade) ??
        ({ ...emptyStat(), key: r.grade, gradeNo: r.gradeNo, classes: [], marked: 0, rate: null, pending: 0 } as GradeGroup)
      Object.assign(g, addStat(g, r))
      g.classes.push(r)
      map.set(r.grade, g)
    }
    return [...map.values()]
      .map((g) => ({
        ...g,
        marked: g.total - g.notMarked,
        rate: rateOf(g),
        pending: g.classes.filter((c) => !c.submitted).length,
      }))
      .sort((a, b) => a.gradeNo - b.gradeNo)
  }, [rows])

  /* insights */
  const rankedGrades = grades.filter((g) => g.rate !== null)
  const bestGrade = rankedGrades.length ? [...rankedGrades].sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0))[0] : null
  const weakGrade = rankedGrades.length > 1 ? [...rankedGrades].sort((a, b) => (a.rate ?? 0) - (b.rate ?? 0))[0] : null

  const attention = useMemo(
    () =>
      rows
        .filter((r) => !r.submitted || (r.rate !== null && r.rate < 85))
        .sort((a, b) => Number(a.submitted) - Number(b.submitted) || (a.rate ?? -1) - (b.rate ?? -1))
        .slice(0, 5),
    [rows]
  )

  /* filtered, grouped class explorer */
  const q = search.trim().toLowerCase()
  const filteredGroups = useMemo(() => {
    const keep = rows.filter(
      (r) =>
        (gradeFilter === 'all' || r.grade === gradeFilter) &&
        (statusFilter === 'all' || (statusFilter === 'submitted' ? r.submitted : !r.submitted)) &&
        (!q || r.className.toLowerCase().includes(q) || (r.teacherName ?? '').toLowerCase().includes(q))
    )
    const map = new Map<string, GradeGroup>()
    for (const r of keep) {
      const g =
        map.get(r.grade) ??
        ({ ...emptyStat(), key: r.grade, gradeNo: r.gradeNo, classes: [], marked: 0, rate: null, pending: 0 } as GradeGroup)
      Object.assign(g, addStat(g, r))
      g.classes.push(r)
      map.set(r.grade, g)
    }
    return [...map.values()]
      .map((g) => ({
        ...g,
        marked: g.total - g.notMarked,
        rate: rateOf(g),
        pending: g.classes.filter((c) => !c.submitted).length,
        classes: [...g.classes].sort((a, b) => a.className.localeCompare(b.className, undefined, { numeric: true })),
      }))
      .sort((a, b) => a.gradeNo - b.gradeNo)
  }, [rows, gradeFilter, statusFilter, q])

  const forceOpen = q !== '' || gradeFilter !== 'all' || statusFilter !== 'all' || filteredGroups.length <= 3
  const toggle = (set: Set<string>, key: string) => {
    const next = new Set(set)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    return next
  }

  const pendingTotal = rows.length - submittedCount

  return (
    <DashboardLayout userRole="admin" currentPage="attendance" onNavigate={() => {}} searchValue="" onSearch={() => {}}>
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-12 pt-6 lg:px-8">
        {/* header */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#003b78]">Attendance Overview</h1>
            <p className="mt-1 text-sm text-[#555962]">{todayLabel || '\u00A0'}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#e4e5e7] bg-white px-3 py-1.5 text-xs font-semibold text-[#555962] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#17a69a] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#17a69a]" />
            </span>
            Live today · {rows.length} {rows.length === 1 ? 'class' : 'classes'} · {school.total} students
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-md border border-[#f5c0bd] bg-[#fdecea] px-4 py-3 text-sm text-[#c3161c]">{error}</div>
        )}

        {/* hero: donut + submission + insights */}
        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wide text-[#003b78]">Today across the school</h2>
              {pendingTotal > 0 && !loading && <Pill tone="warn">{pendingTotal} not submitted</Pill>}
            </div>
            {loading ? (
              <div className="h-52 animate-pulse rounded-xl bg-[#f1f3f5]" />
            ) : (
              <div className="flex flex-col items-center gap-8 sm:flex-row">
                <Donut stat={school} rate={schoolRate} />
                <div className="grid w-full flex-1 grid-cols-2 gap-3">
                  {SEGMENTS.filter((s) => s.key !== 'excused' || school.excused > 0).map((s) => {
                    const pct = school.total ? Math.round((school[s.key] / school.total) * 100) : 0
                    return (
                      <div key={s.key} className="rounded-xl border border-[#eef0f2] bg-[#fafbfc] p-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#555962]">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                          {s.label}
                        </div>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-[#25272c]">{school[s.key]}</span>
                          <span className="text-xs text-[#777b84]">{pct}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </Card>

          <div className="flex flex-col gap-4">
            <Card className="p-5">
              <h2 className="text-sm font-bold uppercase tracking-wide text-[#003b78]">Registers submitted</h2>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#25272c]">{loading ? '…' : submittedCount}</span>
                <span className="text-sm text-[#777b84]">of {rows.length} classes</span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#eef0f2]">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#17a69a] to-[#0f7d73] transition-all duration-700"
                  style={{ width: `${rows.length ? (submittedCount / rows.length) * 100 : 0}%` }}
                />
              </div>
            </Card>

            <Card className="flex-1 p-5">
              <h2 className="text-sm font-bold uppercase tracking-wide text-[#003b78]">Highlights</h2>
              <ul className="mt-3 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#cdeee9] text-xs text-[#0f7d73]">▲</span>
                  <span className="text-[#555962]">
                    {bestGrade ? (
                      <>
                        <strong className="text-[#25272c]">{bestGrade.key}</strong> leads at{' '}
                        <strong className={rateColor(bestGrade.rate)}>{bestGrade.rate}%</strong>
                      </>
                    ) : (
                      'Rankings appear once registers are marked.'
                    )}
                  </span>
                </li>
                {weakGrade && (
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fde3e5] text-xs text-[#c3161c]">▼</span>
                    <span className="text-[#555962]">
                      <strong className="text-[#25272c]">{weakGrade.key}</strong> is lowest at{' '}
                      <strong className={rateColor(weakGrade.rate)}>{weakGrade.rate}%</strong>
                    </span>
                  </li>
                )}
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fff0cf] text-xs text-[#a36a00]">!</span>
                  <span className="text-[#555962]">
                    <strong className="text-[#25272c]">{school.notMarked}</strong> students still not marked
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* grade breakdown + needs attention */}
        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wide text-[#003b78]">By grade</h2>
              <span className="text-xs text-[#777b84]">Click a grade to filter the class list</span>
            </div>
            {loading ? (
              <div className="h-40 animate-pulse rounded-xl bg-[#f1f3f5]" />
            ) : grades.length === 0 ? (
              <p className="py-10 text-center text-sm text-[#777b84]">No data yet.</p>
            ) : (
              <div className="space-y-3">
                {grades.map((g) => (
                  <button
                    key={g.key}
                    onClick={() => {
                      setGradeFilter(gradeFilter === g.key ? 'all' : g.key)
                      document.getElementById('class-explorer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className={`group grid w-full grid-cols-[88px_1fr_56px] items-center gap-3 rounded-lg px-2 py-1.5 text-left transition hover:bg-[#f7f8fa] ${
                      gradeFilter === g.key ? 'bg-[#eef5ff] ring-1 ring-[#bcd3f2]' : ''
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#25272c]">{g.key}</div>
                      <div className="text-[11px] text-[#777b84]">
                        {g.classes.length} {g.classes.length === 1 ? 'class' : 'classes'}
                      </div>
                    </div>
                    <StackedBar stat={g} className="h-3" />
                    <div className={`text-right text-sm font-bold ${rateColor(g.rate)}`}>{g.rate === null ? '—' : `${g.rate}%`}</div>
                  </button>
                ))}
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-t border-[#eef0f2] pt-3">
              {SEGMENTS.filter((s) => s.key !== 'excused' || school.excused > 0).map((s) => (
                <span key={s.key} className="flex items-center gap-1.5 text-xs text-[#555962]">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#003b78]">Needs attention</h2>
            {loading ? (
              <div className="h-40 animate-pulse rounded-xl bg-[#f1f3f5]" />
            ) : attention.length === 0 ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#cdeee9] text-[#0f7d73]">✓</div>
                <p className="text-sm text-[#555962]">All registers submitted and above 85%.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {attention.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/attendance/school-admin/classes/${r.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-[#eef0f2] px-3 py-2 transition hover:border-[#bcd3f2] hover:bg-[#f7faff]"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-[#25272c]">{r.className}</div>
                        <div className="truncate text-xs text-[#777b84]">{r.teacherName || '—'}</div>
                      </div>
                      {r.submitted ? <Pill tone="bad">{r.rate}%</Pill> : <Pill tone="warn">Pending</Pill>}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* class explorer */}
        <Card className="overflow-hidden" >
          <div id="class-explorer" className="scroll-mt-24 border-b border-[#e4e5e7] px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[#003b78]">Classes</h2>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search class or teacher…"
                  className="h-9 w-56 rounded-md border border-[#d5d7db] px-3 text-sm outline-none focus:border-[#007c6d]"
                />
                <div className="flex overflow-hidden rounded-md border border-[#d5d7db] text-xs font-semibold">
                  {(['all', 'pending', 'submitted'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-2 capitalize ${statusFilter === s ? 'bg-[#073b78] text-white' : 'bg-white text-[#555962] hover:bg-[#f7f8fa]'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {grades.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setGradeFilter('all')}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${gradeFilter === 'all' ? 'bg-[#073b78] text-white' : 'bg-[#eef0f2] text-[#555962] hover:bg-[#e4e6e9]'}`}
                >
                  All grades
                </button>
                {grades.map((g) => (
                  <button
                    key={g.key}
                    onClick={() => setGradeFilter(gradeFilter === g.key ? 'all' : g.key)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${gradeFilter === g.key ? 'bg-[#073b78] text-white' : 'bg-[#eef0f2] text-[#555962] hover:bg-[#e4e6e9]'}`}
                  >
                    {g.key}
                    {g.pending > 0 && <span className="ml-1.5 rounded-full bg-[#f59e0b] px-1.5 text-[10px] text-white">{g.pending}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-3 p-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-[#f1f3f5]" />
              ))}
            </div>
          ) : filteredGroups.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-[#777b84]">No classes match your filters.</p>
          ) : (
            <div className="divide-y divide-[#eef0f2]">
              {filteredGroups.map((g) => {
                const open = forceOpen || expanded.has(g.key)
                const all = showAll.has(g.key) || g.classes.length <= PER_GROUP_PREVIEW
                const list = all ? g.classes : g.classes.slice(0, PER_GROUP_PREVIEW)
                return (
                  <section key={g.key}>
                    <button
                      onClick={() => setExpanded((s) => toggle(s, g.key))}
                      className="grid w-full grid-cols-[24px_1fr_auto] items-center gap-4 px-6 py-4 text-left hover:bg-[#fafbfc] md:grid-cols-[24px_160px_1fr_auto_auto]"
                    >
                      <span className={`text-[#777b84] transition-transform ${open ? 'rotate-90' : ''}`}>▸</span>
                      <div>
                        <div className="font-semibold text-[#25272c]">{g.key}</div>
                        <div className="text-xs text-[#777b84]">
                          {g.classes.length} {g.classes.length === 1 ? 'class' : 'classes'} · {g.total} students
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <StackedBar stat={g} />
                      </div>
                      <div className="hidden md:block">
                        {g.pending > 0 ? <Pill tone="warn">{g.pending} pending</Pill> : <Pill tone="ok">All submitted</Pill>}
                      </div>
                      <div className={`w-14 text-right text-sm font-bold ${rateColor(g.rate)}`}>{g.rate === null ? '—' : `${g.rate}%`}</div>
                    </button>

                    {open && (
                      <div className="bg-[#fafbfc] px-6 pb-4">
                        <div className="overflow-x-auto rounded-xl border border-[#eef0f2] bg-white">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-[#f7f8fa] text-[11px] uppercase tracking-wide text-[#777b84]">
                              <tr>
                                {['Class', 'Teacher', 'Status', 'P', 'L', 'A', 'Attendance', ''].map((h, i) => (
                                  <th key={`${h}-${i}`} className="px-4 py-2.5 font-semibold">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#eef0f2]">
                              {list.map((r) => (
                                <tr key={r.id} className="hover:bg-[#f7f8fa]">
                                  <td className="px-4 py-2.5 font-semibold text-[#25272c]">{r.className}</td>
                                  <td className="px-4 py-2.5 text-[#555962]">{r.teacherName || '—'}</td>
                                  <td className="px-4 py-2.5">
                                    {r.submitted ? <Pill tone="ok">Submitted</Pill> : <Pill tone="warn">Pending</Pill>}
                                  </td>
                                  <td className="px-4 py-2.5 text-[#17a69a]">{r.present}</td>
                                  <td className="px-4 py-2.5 text-[#f59e0b]">{r.late}</td>
                                  <td className="px-4 py-2.5 text-[#c3161c]">{r.absent}</td>
                                  <td className="px-4 py-2.5">
                                    <div className="flex items-center gap-2">
                                      <div className="w-28">
                                        <StackedBar stat={r} className="h-2" />
                                      </div>
                                      <span className={`text-xs font-semibold ${rateColor(r.rate)}`}>{r.rate === null ? '—' : `${r.rate}%`}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-2.5 text-right">
                                    <Link
                                      href={`/attendance/school-admin/classes/${r.id}`}
                                      className="font-semibold text-[#007c6d] hover:underline"
                                    >
                                      View →
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {!all && (
                          <button
                            onClick={() => setShowAll((s) => toggle(s, g.key))}
                            className="mt-3 text-sm font-semibold text-[#007c6d] hover:underline"
                          >
                            Show all {g.classes.length} classes
                          </button>
                        )}
                      </div>
                    )}
                  </section>
                )
              })}
            </div>
          )}
        </Card>
      </main>
    </DashboardLayout>
  )
}