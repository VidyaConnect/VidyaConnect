'use client'

import type { ReactNode } from 'react'

/* Small building blocks shared by every Reports page. */

export function ReportHeader({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[#003b78]">{title}</h1>
        <p className="mt-1 text-sm text-[#6b7280]">{subtitle}</p>
      </div>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  )
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-[#cfd4dd] bg-white px-3 py-2 text-sm text-[#25272c] shadow-sm focus:border-[#007c6d] focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

const TONES = {
  good: 'text-[#007c6d]',
  warn: 'text-[#d97706]',
  bad: 'text-[#c3161c]',
  neutral: 'text-[#6b7280]',
} as const

export function KpiCard({
  label,
  value,
  sub,
  tone = 'neutral',
  sample = false,
}: {
  label: string
  value: string
  sub?: string
  tone?: keyof typeof TONES
  sample?: boolean
}) {
  return (
    <div className="rounded-lg border border-[#cfd4dd] bg-white px-5 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-[#6b7280]">{label}</p>
        {sample && <SampleBadge />}
      </div>
      <p className="mt-1 text-3xl font-bold text-[#25272c]">{value}</p>
      {sub && <p className={`mt-1 text-sm ${TONES[tone]}`}>{sub}</p>}
    </div>
  )
}

export function SampleBadge() {
  return (
    <span className="rounded-full bg-[#fff4d6] px-2 py-0.5 text-xs font-semibold text-[#9a6700]">
      Sample data
    </span>
  )
}

export function ChartCard({
  title,
  sample = false,
  className = '',
  children,
}: {
  title: string
  sample?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <section
      className={`rounded-lg border border-[#cfd4dd] bg-white px-5 py-5 shadow-sm ${className}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#003b78]">{title}</h2>
        {sample && <SampleBadge />}
      </div>
      {children}
    </section>
  )
}

export interface Column<T> {
  header: string
  /** plain value, used for sorting-free display and for the CSV export */
  value: (row: T) => string | number
  /** optional custom cell (for example red text) */
  render?: (row: T) => ReactNode
}

function downloadCsv<T>(filename: string, rows: T[], columns: Column<T>[]) {
  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
  const lines = [
    columns.map((c) => escape(c.header)).join(','),
    ...rows.map((r) => columns.map((c) => escape(c.value(r))).join(',')),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function DataTable<T>({
  title,
  rows,
  columns,
  exportName,
  sample = false,
  className = '',
}: {
  title: string
  rows: T[]
  columns: Column<T>[]
  exportName: string
  sample?: boolean
  className?: string
}) {
  return (
    <ChartCard title={title} sample={sample} className={className}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#cfd4dd] text-[#6b7280]">
              {columns.map((c) => (
                <th key={c.header} className="py-2 pr-4 font-medium">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-6 text-center text-[#888]">
                  Nothing to show.
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} className="border-b border-[#eef0f3] last:border-0">
                  {columns.map((c) => (
                    <td key={c.header} className="py-2.5 pr-4 text-[#25272c]">
                      {c.render ? c.render(row) : c.value(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={() => downloadCsv(exportName, rows, columns)}
        className="mt-4 rounded-lg border border-[#007c6d] px-3 py-1.5 text-sm font-semibold text-[#007c6d] hover:bg-[#007c6d] hover:text-white"
      >
        Export CSV
      </button>
    </ChartCard>
  )
}

export function ReportMessage({ text, error = false }: { text: string; error?: boolean }) {
  return (
    <p
      className={`py-16 text-center text-sm ${
        error ? 'font-semibold text-[#dc2626]' : 'text-[#6b7280]'
      }`}
    >
      {text}
    </p>
  )
}
