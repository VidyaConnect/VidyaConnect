'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/features/attendance/components/DashboardLayout'
import { getSuperAdminReport } from '../services/reportService'
import type { DateRange, ReportFilters, SuperAdminReport } from '../types/report.types'
import EChart from './EChart'
import {
  deliveryRateOption,
  newSchoolsOption,
  schoolsByStatusOption,
  securityEventsOption,
  usersByRoleOption,
} from './chartOptions'
import {
  ChartCard,
  DataTable,
  FilterSelect,
  KpiCard,
  ReportHeader,
  ReportMessage,
} from './ReportUi'

const RANGES = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
]

const fmt = (n: number) => n.toLocaleString('en-US')

export default function SuperAdminReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({ range: '30d', classId: 'all' })
  const [report, setReport] = useState<SuperAdminReport | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getSuperAdminReport(filters)
      .then((data) => {
        if (cancelled) return
        setReport(data)
        setError('')
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load reports.')
      })
    return () => {
      cancelled = true
    }
  }, [filters])

  return (
    <DashboardLayout userRole="super-admin" currentPage="system-reports" onNavigate={() => {}}>
      <main className="mx-auto w-full max-w-[1400px] px-6 py-6">
        <ReportHeader
          title="System reports"
          subtitle="Platform-wide analytics. No student-level personal data."
        >
          <FilterSelect
            label="Date range"
            value={filters.range}
            onChange={(v) => setFilters({ ...filters, range: v as DateRange })}
            options={RANGES}
          />
        </ReportHeader>

        {error ? (
          <ReportMessage text={error} error />
        ) : !report ? (
          <ReportMessage text="Loading reports..." />
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                label="Total schools"
                value={fmt(report.kpis.totalSchools)}
                sub={`+${report.kpis.newSchoolsThisMonth} this month`}
              />
              <KpiCard
                label="Active schools"
                value={fmt(report.kpis.activeSchools)}
                sub={`${
                  report.kpis.totalSchools === 0
                    ? 0
                    : Math.round((report.kpis.activeSchools / report.kpis.totalSchools) * 100)
                }% of all schools`}
                tone="good"
              />
              <KpiCard
                label="Total users (accounts)"
                value={fmt(report.kpis.totalUsers)}
                sub="parents, teachers, school admins"
              />
              <KpiCard
                label="Push delivery rate"
                value={`${report.kpis.pushDeliveryRate}%`}
                sub="target 95% or more"
                tone={report.kpis.pushDeliveryRate >= 95 ? 'good' : 'bad'}
                sample
              />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <ChartCard title="Users by role">
                <EChart option={usersByRoleOption(report.usersByRole)} />
              </ChartCard>
              <ChartCard title="New schools per month">
                <EChart option={newSchoolsOption(report.newSchoolsByMonth)} />
              </ChartCard>
              <ChartCard title="Notification delivery rate (%) vs 95% target" sample>
                <EChart option={deliveryRateOption(report.deliveryRate)} />
              </ChartCard>
              <ChartCard title="Security events this week" sample>
                <EChart option={securityEventsOption(report.securityEvents)} />
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <ChartCard title="Schools by registration status">
                <EChart option={schoolsByStatusOption(report.schoolsByStatus)} />
              </ChartCard>
              <div className="lg:col-span-2">
                <DataTable
                  title="School adoption (accounts created vs active)"
                  exportName="school-adoption"
                  rows={report.schoolAdoption}
                  columns={[
                    { header: 'School', value: (r) => r.school },
                    { header: 'Created', value: (r) => fmt(r.created) },
                    { header: 'Activated', value: (r) => fmt(r.activated) },
                    {
                      header: 'Activation',
                      value: (r) => `${Math.round((r.activated / r.created) * 100)}%`,
                      render: (r) => {
                        const pct = Math.round((r.activated / r.created) * 100)
                        return (
                          <span className={pct < 70 ? 'font-semibold text-[#c3161c]' : ''}>
                            {pct}%
                          </span>
                        )
                      },
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  )
}
