'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Topbar from '@/components/Topbar'

// Metrics Icons
const UsersIcon = () => (
  <svg className="h-6 w-6 text-[#073b78]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const TeacherIcon = () => (
  <svg className="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

const CheckIcon = () => (
  <svg className="h-6 w-6 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const AlertExclamationIcon = () => (
  <svg className="h-6 w-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

export default function SchoolAdminDashboard() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [trendType, setTrendType] = useState<'daily' | 'weekly'>('weekly')

  const handleNavigate = (page: string) => {
    if (page === 'attendance') {
      router.push('/attendance/school-admin')
    } else {
      router.push(`/dashboard/${page}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-sans text-[#25272c]">
      <Navbar userRole="admin" currentPage="dashboard" onNavigate={handleNavigate} />
      <Topbar
        userRole="admin"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
      />

      <main className="ml-64 px-8 pb-8 pt-6">
        {/* Dashboard Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-tight text-[#003b78]">Admin Dashboard</h1>
            <p className="mt-1.5 text-sm text-[#555962]">Welcome back, Principal Henderson. Here is what's happening today.</p>
          </div>

          {/* Date Picker Button */}
          <button className="inline-flex items-center gap-2 rounded-lg border border-[#cfd4dd] bg-white px-3 py-1.5 text-sm font-bold text-[#475569] shadow-sm hover:bg-slate-50 transition-colors">
            <svg className="h-4 w-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Jun 24, 2026
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          {/* Card 1: Total Students */}
          <div className="rounded-lg border border-[#cfd4dd] bg-white p-4 shadow-sm flex flex-col justify-between h-auto gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Total Students</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                <UsersIcon />
              </span>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold text-[#0f172a]">847</h2>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                +2.4%
              </span>
            </div>
          </div>

          {/* Card 2: Active Teachers */}
          <div className="rounded-lg border border-[#cfd4dd] bg-white p-4 shadow-sm flex flex-col justify-between h-auto gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Active Teachers</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                <TeacherIcon />
              </span>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold text-[#0f172a]">52</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                Active Now
              </span>
            </div>
          </div>

          {/* Card 3: Attendance */}
          <div className="rounded-lg border border-[#cfd4dd] bg-white p-4 shadow-sm flex flex-col justify-between h-auto gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Attendance</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50">
                <CheckIcon />
              </span>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold text-[#0f172a]">91%</h2>
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-bold text-sky-800">
                Excellent
              </span>
            </div>
          </div>

          {/* Card 4: Action Required */}
          <div className="rounded-lg border border-[#cfd4dd] bg-white p-4 shadow-sm flex flex-col justify-between h-auto gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Action Required</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 relative">
                <AlertExclamationIcon />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
              </span>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-xl font-bold text-red-600">7 Pending Forms</h2>
            </div>
          </div>
        </div>

        {/* Attendance overview & subscription grid */}
        <div className="mb-6 grid grid-cols-12 gap-6">
          {/* Attendance Chart (left 8 columns) */}
          <div className="col-span-8 rounded-lg border border-[#cfd4dd] bg-white p-5 shadow-sm flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#003b78]">Attendance Overview</h3>
              <div className="inline-flex rounded-lg bg-slate-100 p-1">
                <button
                  onClick={() => setTrendType('daily')}
                  className={`rounded-md px-4 py-1.5 text-sm font-bold transition-all ${
                    trendType === 'daily' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTrendType('weekly')}
                  className={`rounded-md px-4 py-1.5 text-sm font-bold transition-all ${
                    trendType === 'weekly' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>

            {/* Horizontal Bar Chart list */}
            <div className="space-y-6 flex-1 justify-center flex flex-col">
              {/* Row 1 */}
              <div>
                <div className="mb-1 flex items-center justify-between text-sm font-bold text-slate-700">
                  <span>Grade 1A</span>
                  <span className="font-black text-[#007c6d]">98%</span>
                </div>
                <div className="h-4 w-full rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#007c6d]" style={{ width: '98%' }} />
                </div>
              </div>

              {/* Row 2 */}
              <div>
                <div className="mb-1 flex items-center justify-between text-sm font-bold text-slate-700">
                  <span>Grade 3B</span>
                  <span className="font-black text-[#007c6d]">92%</span>
                </div>
                <div className="h-4 w-full rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#007c6d]" style={{ width: '92%' }} />
                </div>
              </div>

              {/* Row 3 */}
              <div>
                <div className="mb-1 flex items-center justify-between text-sm font-bold text-slate-700">
                  <span>Grade 5C</span>
                  <span className="font-black text-indigo-600">85%</span>
                </div>
                <div className="h-4 w-full rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: '85%' }} />
                </div>
              </div>

              {/* Row 4 */}
              <div>
                <div className="mb-1 flex items-center justify-between text-sm font-bold text-slate-700">
                  <span>Grade 8A</span>
                  <span className="font-black text-red-600">68%</span>
                </div>
                <div className="h-4 w-full rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-red-500" style={{ width: '68%' }} />
                </div>
              </div>
            </div>

            {/* X-axis legends */}
            <div className="mt-6 flex items-center justify-between text-xs font-bold text-slate-400 border-t border-slate-100 pt-3">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Subscription & Pending Forms (right 4 columns) */}
          <div className="col-span-4 flex flex-col gap-6">
            {/* Subscription Box */}
            <div className="rounded-lg border border-[#cfd4dd] bg-[#073b78] p-5 text-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Subscription Status</h3>
                  <span className="rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">Active</span>
                </div>
                <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white/70">Current Plan</span>
                    <span>Standard Enterprise</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white/70">Monthly Amount</span>
                    <span className="font-bold">LKR 5,000</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white/70">Renewal Date</span>
                    <span>Nov 12, 2023</span>
                  </div>
                </div>
              </div>
              <button className="mt-6 w-full rounded-lg bg-white hover:bg-slate-50 py-2 text-xs font-bold text-[#073b78] shadow transition-all">
                Manage Billing
              </button>
            </div>

            {/* Pending Forms Box */}
            <div className="rounded-lg border border-[#cfd4dd] bg-white p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#0f172a]">Pending Forms</h3>
                  <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 uppercase tracking-wider">7 Urgent</span>
                </div>

                <div className="mt-4 space-y-2">
                  {/* Form 1 */}
                  <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2.5 hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-[#0f172a]">Field Trip: Zoo Visit</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Due in 2 days &bull; 124/300 signed</p>
                    </div>
                    <span className="text-slate-400 text-base">&rsaquo;</span>
                  </div>
                  {/* Form 2 */}
                  <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2.5 hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-[#0f172a]">Annual Medical Waiver</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Due in 5 days &bull; 45/300 signed</p>
                    </div>
                    <span className="text-slate-400 text-base">&rsaquo;</span>
                  </div>
                </div>
              </div>

              <button className="mt-4 text-left text-xs font-bold text-[#007c6d] hover:text-[#005f54] inline-flex items-center gap-1">
                View All Forms &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Announcements card */}
        <div className="rounded-lg border border-[#cfd4dd] bg-white p-5 shadow-sm flex flex-col">
          <div className="mb-4 flex items-center justify-between border-b border-[#cfd4dd] pb-3">
            <h3 className="text-lg font-bold text-[#003b78]">Recent Announcements</h3>
            <button className="rounded-lg bg-[#073b78] hover:bg-[#062f60] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors">
              + Post Announcement
            </button>
          </div>

          {/* Log entries */}
          <div className="divide-y divide-[#cfd4dd]">
            {/* Log 1 */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-slate-100 font-bold border border-slate-200">
                  <span className="text-[10px] text-[#64748b] leading-none">Nov</span>
                  <span className="text-sm text-[#0f172a] leading-tight mt-0.5">23</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f172a]">Mid-Term Holiday Schedule Updated</h4>
                  <p className="text-xs text-[#64748b] mt-0.5">The revised schedule for the upcoming November holidays is now available in the teacher portal.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full bg-[#cbd5e1] border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-700 select-none">JA</div>
                  <div className="h-6 w-6 rounded-full bg-[#dce7f3] border-2 border-white flex items-center justify-center text-[8px] font-bold text-[#003b78] select-none">MK</div>
                </div>
                <span className="text-[10px] font-bold text-[#94a3b8] min-w-[50px] text-right">2h ago</span>
              </div>
            </div>

            {/* Log 2 */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-slate-100 font-bold border border-slate-200">
                  <span className="text-[10px] text-[#64748b] leading-none">Nov</span>
                  <span className="text-sm text-[#0f172a] leading-tight mt-0.5">22</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f172a]">Parent-Teacher Meeting Day (Grade 5-8)</h4>
                  <p className="text-xs text-[#64748b] mt-0.5">Registration for time slots is now open via the mobile app for all parents.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-[#fee2e2] border-2 border-white flex items-center justify-center text-[8px] font-bold text-red-700 select-none">AL</div>
                <span className="text-[10px] font-bold text-[#94a3b8] min-w-[50px] text-right">1d ago</span>
              </div>
            </div>

            {/* Log 3 */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-slate-100 font-bold border border-slate-200">
                  <span className="text-[10px] text-[#64748b] leading-none">Nov</span>
                  <span className="text-sm text-[#0f172a] leading-tight mt-0.5">21</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f172a]">Server Maintenance: System Downtime</h4>
                  <p className="text-xs text-[#64748b] mt-0.5">The management portal will be offline for 2 hours this Sunday for security patches.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-[#94a3b8] min-w-[50px] text-right">2d ago</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action '+' Button */}
      <button className="fixed bottom-8 right-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#007c6d] hover:bg-[#005f54] text-white shadow-lg transition-all text-xl font-bold">
        +
      </button>
    </div>
  )
}
