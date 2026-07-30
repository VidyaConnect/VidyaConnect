'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Topbar from '@/components/Topbar'

// Card 1 icon (Graduation cap)
const CapIcon = () => (
  <svg className="h-8 w-8 text-[#073b78]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.91a2 2 0 0 0 1.66 0z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
)

// Card 2 icon (Exclamation calendar)
const AlertIcon = () => (
  <svg className="h-8 w-8 text-[#ef4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="12" y1="14" x2="12" y2="18" />
  </svg>
)

// Card 3 icon (Unread messages)
const MailIcon = () => (
  <svg className="h-8 w-8 text-[#10b981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

// Card 4 icon (CheckCircle)
const CheckCircleIcon = () => (
  <svg className="h-8 w-8 text-[#007c6d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

export default function TeacherDashboard() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  const handleNavigate = (page: string) => {
    if (page === 'attendance') {
      router.push('/attendance/teacher')
    } else {
      router.push(`/dashboard/${page}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-sans text-[#25272c]">
      <Navbar userRole="teacher" currentPage="dashboard" onNavigate={handleNavigate} />
      <Topbar
        userRole="teacher"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        searchPlaceholder="Search students, classes, or records..."
        searchClassName="max-w-[500px]"
      />

      <main className="ml-64 px-10 pb-28 pt-8">
        {/* Welcome message */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#003b78] tracking-tight">Good morning, Ms. Sarah Jenkins</h1>
          <p className="mt-1.5 text-2xl text-[#6b7280]">Here's what's happening in your classes today.</p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mb-8 grid grid-cols-4 gap-6">
          {/* Card 1: My Classes */}
          <div className="flex items-center gap-5 rounded-2xl border border-[#cfd4dd] bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100">
              <CapIcon />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">My Classes</p>
              <h2 className="text-3xl font-black text-[#0f172a] mt-0.5">3</h2>
            </div>
          </div>

          {/* Card 2: Due Today */}
          <div className="flex items-center gap-5 rounded-2xl border border-[#cfd4dd] bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-50">
              <AlertIcon />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Due Today</p>
              <h2 className="text-3xl font-black text-[#0f172a] mt-0.5">2</h2>
            </div>
          </div>

          {/* Card 3: Unread Messages */}
          <div className="flex items-center gap-5 rounded-2xl border border-[#cfd4dd] bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50">
              <MailIcon />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Unread Messages</p>
              <h2 className="text-3xl font-black text-[#0f172a] mt-0.5">5</h2>
            </div>
          </div>

          {/* Card 4: Attendance */}
          <div className="flex items-center gap-5 rounded-2xl border border-[#cfd4dd] bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50">
              <CheckCircleIcon />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Attendance</p>
              <h2 className="text-2xl font-black text-[#007c6d] mt-0.5">Completed</h2>
            </div>
          </div>
        </div>

        {/* Action & Chart section */}
        <div className="mb-8 grid grid-cols-12 gap-6">
          {/* Action buttons (left 4 columns) */}
          <div className="col-span-4 flex flex-col gap-4">
            <button className="flex items-center justify-center gap-3 rounded-xl bg-[#005f54] hover:bg-[#004d43] py-5 text-xl font-bold text-white shadow transition-all">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Message
            </button>

            <button className="flex items-center justify-center gap-3 rounded-xl border-2 border-[#005f54] bg-white text-[#005f54] hover:bg-slate-50 py-5 text-xl font-bold transition-all">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Post Assignment
            </button>

            <button
              onClick={() => router.push('/attendance/teacher')}
              className="flex items-center justify-center gap-3 rounded-xl bg-[#073b78] hover:bg-[#062f60] py-5 text-xl font-bold text-white shadow transition-all"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              </svg>
              Mark Attendance
            </button>
          </div>

          {/* Chart card (right 8 columns) */}
          <div className="col-span-8 rounded-2xl border border-[#cfd4dd] bg-white p-6 shadow-sm flex items-center justify-around gap-8">
            <div className="relative h-36 w-36 flex items-center justify-center rounded-full" style={{
              background: 'conic-gradient(#007c6d 0% 70%, #f1f5f9 70% 100%)'
            }}>
              <div className="absolute h-[116px] w-[116px] rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                <span className="text-3xl font-black text-[#0f172a]">70%</span>
                <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mt-0.5">Submitted</span>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-black text-[#0f172a]">Assignment Completion</h3>
              <p className="mt-2 text-lg text-[#334155] leading-relaxed">
                <strong className="text-[#073b78]">"Mid-term History Essay"</strong> - 21/30 students have submitted their work. Deadline in 4 hours.
              </p>
              <div className="mt-4 flex gap-6">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full bg-[#007c6d]" />
                  <span className="text-sm font-semibold text-[#64748b]">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full bg-slate-200" />
                  <span className="text-sm font-semibold text-[#64748b]">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Classes Overview & Messages Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Table Card (left 8 columns) */}
          <div className="col-span-8 rounded-2xl border border-[#cfd4dd] bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#cfd4dd]">
              <h3 className="text-2xl font-black text-[#003b78]">My Classes Overview</h3>
              <button className="text-base font-bold text-[#007c6d] hover:text-[#005f54] inline-flex items-center gap-1">
                View All &rarr;
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#cfd4dd] text-left text-xs font-bold uppercase tracking-wider text-[#64748b]">
                    <th className="px-6 py-4">Class Name</th>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4">Students</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#cfd4dd]">
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-5 text-lg font-bold text-[#1e293b]">Mathematics Advanced</td>
                    <td className="px-6 py-5 text-base font-semibold text-[#64748b]">Grade 10-B</td>
                    <td className="px-6 py-5 text-base font-semibold text-[#1e293b]">28</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-5 text-lg font-bold text-[#1e293b]">Modern World History</td>
                    <td className="px-6 py-5 text-base font-semibold text-[#64748b]">Grade 11-A</td>
                    <td className="px-6 py-5 text-base font-semibold text-[#1e293b]">32</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-5 text-lg font-bold text-[#1e293b]">Creative Writing Lab</td>
                    <td className="px-6 py-5 text-base font-semibold text-[#64748b]">Grade 9-C</td>
                    <td className="px-6 py-5 text-base font-semibold text-[#1e293b]">24</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800">
                        PENDING GRADE
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Messages & Announcements (right 4 columns) */}
          <div className="col-span-4 flex flex-col gap-6">
            {/* Messages box */}
            <div className="rounded-2xl border border-[#cfd4dd] bg-white p-6 shadow-sm flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-black text-[#0f172a]">Recent Messages</h3>
                <span className="rounded bg-[#c2161c] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">New</span>
              </div>
              <div className="space-y-4">
                {/* Msg 1 */}
                <div className="flex gap-3 items-start">
                  <div className="h-10 w-10 flex-none rounded-full bg-[#dce7f3] flex items-center justify-center font-bold text-[#003b78]">L</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#0f172a]">Mrs. Linda Chen</p>
                    <p className="text-xs text-[#64748b] truncate mt-0.5">Hi Ms. Jenkins, about Leo's math homework help...</p>
                    <span className="text-[10px] text-slate-400 font-bold mt-1 block">20 mins ago</span>
                  </div>
                </div>
                {/* Msg 2 */}
                <div className="flex gap-3 items-start">
                  <div className="h-10 w-10 flex-none rounded-full bg-[#fcd34d] flex items-center justify-center font-bold text-[#78350f]">M</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#0f172a]">Mr. Marcus Kovic</p>
                    <p className="text-xs text-[#64748b] truncate mt-0.5">Thank you for the update on the field trip details.</p>
                    <span className="text-[10px] text-slate-400 font-bold mt-1 block">2 hours ago</span>
                  </div>
                </div>
              </div>
              <button className="mt-6 text-center text-sm font-bold text-[#007c6d] hover:text-[#005f54] uppercase tracking-wider">
                Go to Inbox
              </button>
            </div>

            {/* School Announcements */}
            <div className="rounded-2xl border border-[#cfd4dd] bg-[#073b78] p-6 text-white shadow-sm flex flex-col relative overflow-hidden">
              <div className="absolute right-[-10px] top-[-10px] opacity-10">
                <svg className="h-32 w-32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-white flex items-center gap-2 mb-4">
                School Announcements
              </h3>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                  <span className="text-[9px] font-bold tracking-wider text-emerald-300 uppercase block">Campus Security</span>
                  <p className="text-xs font-semibold text-white/95 mt-1">New ID badge policy starts Monday. Please check your emails.</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                  <span className="text-[9px] font-bold tracking-wider text-emerald-300 uppercase block">Staff Meeting</span>
                  <p className="text-xs font-semibold text-white/95 mt-1">Monthly general meeting scheduled for Friday at 3:30 PM in the auditorium.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
