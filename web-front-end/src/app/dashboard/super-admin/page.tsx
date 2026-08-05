'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Topbar from '@/components/Topbar'

// Metrics Icons
const SchoolRegistryIcon = () => (
  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
  </svg>
)

const WhiteUsersIcon = () => (
  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const ActivityIcon = () => (
  <svg className="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

const ShieldIcon = () => (
  <svg className="h-6 w-6 text-[#007c6d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

export default function SuperAdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleNavigate = (page: string) => {
    // Super admin routing logic
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-sans text-[#25272c]">
      <Navbar userRole="super-admin" currentPage="dashboard" onNavigate={handleNavigate} />
      <Topbar
        userRole="super-admin"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        searchPlaceholder="Search schools, users, or logs..."
      />

      <main className="ml-64 px-8 pb-8 pt-6">
        {/* Header Section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-tight text-[#003b78]">Platform Overview</h1>
            <p className="mt-1.5 text-sm text-[#555962]">Command center for real-time educational network monitoring.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="inline-flex items-center gap-2 rounded-lg border border-[#cfd4dd] bg-white px-3 py-1.5 text-sm font-bold text-[#475569] shadow-sm hover:bg-slate-50 transition-all">
              <svg className="h-4 w-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              This Month
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#073b78] hover:bg-[#062f60] px-3 py-1.5 text-sm font-bold text-white shadow transition-all">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Report
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          {/* Card 1: Total Schools (Blue) */}
          <div className="rounded-lg bg-[#073b78] p-4 text-white shadow-sm flex flex-col justify-between h-auto gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/70">Total Schools</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <SchoolRegistryIcon />
              </span>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold">12</h2>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold">
                +2 this month
              </span>
            </div>
          </div>

          {/* Card 2: Total Users (Teal) */}
          <div className="rounded-lg bg-[#00a896] p-4 text-white shadow-sm flex flex-col justify-between h-auto gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/70">Total Users</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <WhiteUsersIcon />
              </span>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold">6,847</h2>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold">
                +124 total
              </span>
            </div>
          </div>

          {/* Card 3: Active Today */}
          <div className="rounded-lg border border-[#cfd4dd] bg-white p-4 shadow-sm flex flex-col justify-between h-auto gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Active Today</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                <ActivityIcon />
              </span>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold text-[#0f172a]">1,203</h2>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                Stable
              </span>
            </div>
          </div>

          {/* Card 4: System Status */}
          <div className="rounded-lg border border-[#cfd4dd] bg-white p-4 shadow-sm flex flex-col justify-between h-auto gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">System Status</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50">
                <ShieldIcon />
              </span>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-xl font-bold text-[#007c6d]">Operational</h2>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                All Systems Go
              </span>
            </div>
          </div>
        </div>

        {/* Recent Schools & Quick Actions grid */}
        <div className="mb-6 grid grid-cols-12 gap-6">
          {/* Recent Schools (left 8 columns) */}
          <div className="col-span-8 rounded-lg border border-[#cfd4dd] bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#cfd4dd]">
              <h3 className="text-lg font-bold text-[#003b78]">Recent Schools</h3>
              <button className="text-sm font-bold text-[#007c6d] hover:text-[#005f54]">
                View All
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full">
                <tbody className="divide-y divide-[#cfd4dd]">
                  {/* School 1 */}
                  <tr className="hover:bg-slate-50">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0f172a]">St. Xavier's International</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">1,420 Students &bull; registered 2d ago</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                        Active
                      </span>
                    </td>
                  </tr>

                  {/* School 2 */}
                  <tr className="hover:bg-slate-50">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0f172a]">Greenwood Public Academy</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">850 Students &bull; registered 5d ago</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                        Active
                      </span>
                    </td>
                  </tr>

                  {/* School 3 */}
                  <tr className="hover:bg-slate-50">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0f172a]">Oakridge Elementary</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">420 Students &bull; registered 1w ago</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                        Pending
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions (right 4 columns) */}
          <div className="col-span-4 rounded-lg border border-[#cfd4dd] bg-white p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0f172a] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Action 1 */}
                <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors h-auto py-4">
                  <svg className="h-5 w-5 text-slate-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-[11px] font-bold text-slate-800 text-center">Register School</span>
                </button>

                {/* Action 2 */}
                <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors h-auto py-4">
                  <svg className="h-5 w-5 text-slate-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span className="text-[11px] font-bold text-slate-800 text-center">View All Schools</span>
                </button>

                {/* Action 3 */}
                <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors h-auto py-4 relative">
                  <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#073b78] text-[9px] font-bold text-white">3</span>
                  <svg className="h-5 w-5 text-slate-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-[11px] font-bold text-slate-800 text-center">School Requests</span>
                </button>

                {/* Action 4 */}
                <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors h-auto py-4">
                  <svg className="h-5 w-5 text-slate-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[11px] font-bold text-slate-800 text-center">Audit Logs</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Security Console */}
        <div className="rounded-lg border border-[#cfd4dd] bg-[#1e293b] p-5 text-white shadow-sm flex flex-col">
          <div className="mb-4 flex items-center gap-2 text-base font-bold text-white">
            <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Global Security
          </div>

          <div className="space-y-3 font-mono text-xs text-slate-300 bg-slate-900/50 rounded-lg p-3 border border-slate-800">
            {/* Log 1 */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-bold text-red-400">Root Login Detected</span>
              </div>
              <span className="text-slate-500">14:20:05 &bull; IP 192.168.1.1</span>
            </div>

            {/* Log 2 */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="font-bold text-blue-400">Schema Updated</span>
              </div>
              <span className="text-slate-500">12:15:33 &bull; DB Instance: AS1</span>
            </div>

            {/* Log 3 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-emerald-400">School Verified</span>
              </div>
              <span className="text-slate-500">09:10:12 &bull; ID: #SX22</span>
            </div>
          </div>

          <button className="mt-4 self-center border border-slate-700 hover:bg-slate-800/50 hover:text-white px-4 py-2 rounded-lg text-xs font-bold text-slate-400 transition-all uppercase tracking-wider">
            Download Report
          </button>
        </div>

        {/* Footer */}
        <p className="mt-12 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">
          &copy; 2024 VIDYACONNECT PLATFORM CONTROL. ALL RIGHTS RESERVED.
        </p>
      </main>
    </div>
  )
}
