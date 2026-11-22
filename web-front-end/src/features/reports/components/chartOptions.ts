import type { EChartsOption } from 'echarts'
import type { SchoolAdminReport, SuperAdminReport } from '../types/report.types'

// Theme colours (same as the rest of the portal)
const NAVY = '#003b78'
const GREEN = '#007c6d'
const AMBER = '#f59e0b'
const RED = '#c3161c'
const GREY = '#9aa3b2'
const GRID_LINE = '#e6e8eb'

const grid = { left: 44, right: 16, top: 24, bottom: 56 }

// Note: no formatter functions here. Options are compared as JSON in EChart.tsx.
function targetLine(value: number, label: string) {
  return {
    silent: true,
    symbol: 'none',
    lineStyle: { color: RED, type: 'dashed' as const },
    label: { formatter: label, color: RED },
    data: [{ yAxis: value }],
  }
}

/* ---------- Super Admin ---------- */

export function usersByRoleOption(data: SuperAdminReport['usersByRole']): EChartsOption {
  return {
    color: [NAVY, GREEN, AMBER, GREY],
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: ['55%', '78%'],
        center: ['50%', '44%'],
        label: { show: false },
        data: data.map((d) => ({ name: d.role, value: d.count })),
      },
    ],
  }
}

export function newSchoolsOption(data: SuperAdminReport['newSchoolsByMonth']): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    grid: { ...grid, bottom: 28 },
    xAxis: { type: 'category', data: data.map((d) => d.month) },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: GRID_LINE } } },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.count),
        itemStyle: { color: NAVY, borderRadius: [4, 4, 0, 0] },
      },
    ],
  }
}

export function deliveryRateOption(data: SuperAdminReport['deliveryRate']): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    grid: { ...grid, bottom: 28 },
    xAxis: { type: 'category', data: data.map((d) => d.day) },
    yAxis: {
      type: 'value',
      min: 90,
      max: 100,
      axisLabel: { formatter: '{value}%' },
      splitLine: { lineStyle: { color: GRID_LINE } },
    },
    series: [
      {
        name: 'Delivery rate',
        type: 'line',
        smooth: true,
        data: data.map((d) => d.rate),
        lineStyle: { color: GREEN, width: 3 },
        itemStyle: { color: GREEN },
        markLine: targetLine(95, '95% target'),
      },
    ],
  }
}

export function securityEventsOption(data: SuperAdminReport['securityEvents']): EChartsOption {
  return {
    color: [NAVY, RED, GREEN],
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid,
    xAxis: { type: 'category', data: data.map((d) => d.day) },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: GRID_LINE } } },
    series: [
      { name: 'Failed logins', type: 'bar', stack: 'events', data: data.map((d) => d.failedLogins) },
      { name: '403 events', type: 'bar', stack: 'events', data: data.map((d) => d.forbidden) },
      { name: 'Exports', type: 'bar', stack: 'events', data: data.map((d) => d.exports) },
    ],
  }
}

/* ---------- School Admin ---------- */

export function attendanceTrendOption(data: SchoolAdminReport['attendanceTrend']): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    grid: { ...grid, bottom: 28 },
    xAxis: { type: 'category', data: data.map((d) => d.date) },
    yAxis: {
      type: 'value',
      min: 70,
      max: 100,
      axisLabel: { formatter: '{value}%' },
      splitLine: { lineStyle: { color: GRID_LINE } },
    },
    series: [
      {
        name: 'Attendance',
        type: 'line',
        smooth: true,
        data: data.map((d) => d.rate),
        lineStyle: { color: NAVY, width: 3 },
        itemStyle: { color: NAVY },
        markLine: targetLine(80, '80% minimum'),
      },
    ],
  }
}

export function classComparisonOption(data: SchoolAdminReport['classComparison']): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    grid: { ...grid, bottom: 28 },
    xAxis: { type: 'category', data: data.map((d) => d.className) },
    yAxis: {
      type: 'value',
      min: 60,
      max: 100,
      axisLabel: { formatter: '{value}%' },
      splitLine: { lineStyle: { color: GRID_LINE } },
    },
    series: [
      {
        name: 'Attendance',
        type: 'bar',
        data: data.map((d) => ({
          value: d.rate,
          itemStyle: { color: d.rate < 80 ? RED : GREEN, borderRadius: [4, 4, 0, 0] },
        })),
      },
    ],
  }
}

export function heatmapOption(data: SchoolAdminReport['heatmap']): EChartsOption {
  const first = data[0]?.date ?? '2026-09-14'
  const last = data[data.length - 1]?.date ?? '2026-11-12'
  return {
    tooltip: {},
    visualMap: {
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      pieces: [
        { min: 0, max: 79, label: 'Below 80%', color: '#f4b4b6' },
        { min: 80, max: 89, label: '80-89%', color: '#b7e4dc' },
        { min: 90, max: 94, label: '90-94%', color: '#4fb3a5' },
        { min: 95, max: 100, label: '95%+', color: GREEN },
      ],
    },
    calendar: {
      top: 30,
      left: 40,
      right: 16,
      cellSize: ['auto', 22],
      range: [first, last],
      itemStyle: { borderWidth: 3, borderColor: '#ffffff' },
      splitLine: { show: false },
      yearLabel: { show: false },
      dayLabel: { firstDay: 1 },
    },
    series: [
      {
        name: 'Attendance %',
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: data.map((d) => [d.date, d.rate]),
      },
    ],
  }
}

export function announcementReachOption(data: SchoolAdminReport['announcementReach']): EChartsOption {
  return {
    color: [NAVY, GREEN],
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid,
    xAxis: { type: 'category', data: data.map((d) => d.title) },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: { formatter: '{value}%' },
      splitLine: { lineStyle: { color: GRID_LINE } },
    },
    series: [
      { name: 'Read', type: 'bar', data: data.map((d) => d.read) },
      { name: 'Confirmed', type: 'bar', data: data.map((d) => d.confirmed) },
    ],
  }
}

export function consentOption(data: SchoolAdminReport['consentResponses']): EChartsOption {
  return {
    color: [GREEN, AMBER, RED],
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid,
    xAxis: { type: 'category', data: data.map((d) => d.form) },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: GRID_LINE } } },
    series: [
      { name: 'Submitted', type: 'bar', stack: 'forms', data: data.map((d) => d.submitted) },
      { name: 'Pending', type: 'bar', stack: 'forms', data: data.map((d) => d.pending) },
      { name: 'Overdue', type: 'bar', stack: 'forms', data: data.map((d) => d.overdue) },
    ],
  }
}

export function statusSplitOption(data: SchoolAdminReport['statusSplit']): EChartsOption {
  const colors: Record<string, string> = { Present: GREEN, Late: AMBER, Absent: RED }
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: ['55%', '78%'],
        center: ['50%', '44%'],
        label: { show: false },
        data: data.map((d) => ({
          name: d.status,
          value: d.count,
          itemStyle: { color: colors[d.status] },
        })),
      },
    ],
  }
}

export function schoolsByStatusOption(data: SuperAdminReport['schoolsByStatus']): EChartsOption {
  const colors: Record<string, string> = {
    'Under review': AMBER,
    Approved: GREEN,
    Rejected: RED,
  }
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: ['55%', '78%'],
        center: ['50%', '44%'],
        label: { show: false },
        data: data.map((d) => ({
          name: d.status,
          value: d.count,
          itemStyle: { color: colors[d.status] },
        })),
      },
    ],
  }
}