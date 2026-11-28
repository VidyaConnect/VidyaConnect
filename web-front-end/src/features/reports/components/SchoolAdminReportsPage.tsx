'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/features/attendance/components/DashboardLayout'
import { getSchoolAdminReport } from '../services/reportService'
import type { DateRange, ReportFilters, SchoolAdminReport } from '../types/report.types'
import EChart from './EChart'
import {
  announcementReachOption,
  attendanceTrendOption,
  classComparisonOption,
  consentOption,
  heatmapOption,
  statusSplitOption,
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

export default function SchoolAdminReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({ range: '30d', classId: 'all' })
  const [report, setReport] = useState<SchoolAdminReport | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getSchoolAdminReport(filters)
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
    <DashboardLayout userRole="admin" currentPage="reports" onNavigate={() => {}}>
      <main className="mx-auto w-full max-w-[1400px] px-6 py-6">
        <ReportHeader
          title="School reports"
          subtitle="Attendance, communication, forms and accounts for your school."
        >
          <FilterSelect
            label="Class"
            value={filters.classId}
            onChange={(v) => setFilters({ ...filters, classId: v })}
            options={[
              { value: 'all', label: 'All classes' },
              ...(report?.classes ?? []).map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
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
                label="Latest attendance"
                value={
                  report.kpis.todayAttendance === null
                    ? '--'
                    : `${report.kpis.todayAttendance}%`
                }
                sub={
                  report.kpis.attendanceChange === null
                    ? 'no data for same day last week'
                    : `${report.kpis.attendanceChange >= 0 ? '+' : ''}${
                        report.kpis.attendanceChange
                      }% vs same day last week`
                }
                tone={
                  report.kpis.attendanceChange === null
                    ? 'neutral'
                    : report.kpis.attendanceChange >= 0
                    ? 'good'
                    : 'bad'
                }
              />
              <KpiCard
                label="Avg announcement read"
                value={`${report.kpis.avgAnnouncementRead}%`}
                sub="last 30 days"
                tone="warn"
                sample
              />
              <KpiCard
                label="Consent response rate"
                value={`${report.kpis.consentResponseRate}%`}
                sub={`${report.kpis.openForms} forms open`}
              />
              <KpiCard
                label="Inactive accounts"
                value={String(report.kpis.inactiveAccounts)}
                sub={`of ${report.kpis.totalAccounts.toLocaleString('en-US')} accounts`}
                tone={report.kpis.inactiveAccounts > 0 ? 'bad' : 'good'}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <ChartCard title="Attendance trend (%)">
                <EChart option={attendanceTrendOption(report.attendanceTrend)} />
              </ChartCard>
              <ChartCard title="Class vs class attendance (%)">
                <EChart option={classComparisonOption(report.classComparison)} />
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ChartCard title="Attendance calendar heatmap">
                  <EChart option={heatmapOption(report.heatmap)} height={240} />
                </ChartCard>
              </div>
              <ChartCard title="Attendance status split">
                <EChart option={statusSplitOption(report.statusSplit)} height={240} />
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <ChartCard title="Announcement reach (%)" sample>
                <EChart option={announcementReachOption(report.announcementReach)} />
              </ChartCard>
              <ChartCard title="Consent form responses">
                <EChart option={consentOption(report.consentResponses)} />
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <DataTable
                title="Students below 80% attendance"
                exportName="students-below-80"
                rows={report.studentsBelow80}
                columns={[
                  { header: 'Student', value: (r) => r.name },
                  { header: 'Class', value: (r) => r.className },
                  {
                    header: 'Attendance',
                    value: (r) => `${r.rate}%`,
                    render: (r) => (
                      <span className="font-semibold text-[#c3161c]">{r.rate}%</span>
                    ),
                  },
                ]}
              />
              <DataTable
                title="Inactive accounts"
                exportName="inactive-accounts"
                rows={report.inactiveAccountsList}
                columns={[
                  { header: 'Name', value: (r) => r.name },
                  { header: 'Role', value: (r) => r.role },
                  { header: 'Email', value: (r) => r.email },
                ]}
              />
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  )
}
