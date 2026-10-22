'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/userAuth'

export interface SubNavItem { label: string; href: string }

export default function SubNav({ items }: { items: SubNavItem[] }) {
  const pathname = usePathname()
  const { user, isInitialized, logout } = useAuth()
  const teacherAssignments = pathname.startsWith('/assignments/teacher')

  if (teacherAssignments) {
    if (!isInitialized || user?.role !== 'TEACHER') return null
    const navItems = [
      { label: 'Dashboard', href: '/dashboard/teacher', icon: '▦' },
      { label: 'My Classes', href: '#', icon: '⚯' },
      { label: 'Announcements', href: '/announcements/teacher-feed', icon: '▣' },
      { label: 'Community Messages', href: '#', icon: '▱' },
      { label: 'Mark Attendance', href: '/attendance/teacher', icon: '♙' },
      { label: 'Manage Assignments', href: '/assignments/teacher', icon: '▤' },
      { label: 'Consent Forms', href: '#', icon: '▧' },
      { label: 'Class Calendar', href: '/assignments/teacher/calendar', icon: '▦' },
      { label: 'Reports', href: '#', icon: '◇' },
      { label: 'Settings', href: '#', icon: '⚙' },
    ]
    return <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col bg-[#073b78] text-white lg:flex">
      <div className="px-7 pb-10 pt-7"><div className="text-[25px] font-extrabold tracking-tight">VidyaConnect</div><div className="text-lg font-semibold text-blue-100">Teacher Portal</div></div>
      <nav className="space-y-1 px-3">{navItems.map((item) => {
        const active = item.href === '/assignments/teacher' ? pathname === item.href || pathname.startsWith('/assignments/teacher/create') || pathname.startsWith('/assignments/teacher/tracking') : item.href !== '#' && pathname.startsWith(item.href)
        return <Link key={item.label} href={item.href} className={`flex h-12 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${active ? 'bg-[#007c6d] text-white' : 'text-blue-100 hover:bg-white/10'}`}><span className="w-5 text-center text-lg" aria-hidden>{item.icon}</span>{item.label}</Link>
      })}</nav>
      <button onClick={() => { logout(); window.location.assign('/login') }} className="mt-auto flex items-center gap-3 px-7 py-6 text-sm font-semibold text-blue-100 hover:bg-white/10"><span aria-hidden>⇥</span>Logout</button>
    </aside>
  }

  return <nav className="w-full bg-[#073b78] shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.08)]"><div className="mx-auto flex h-14 w-max max-w-full items-center justify-center overflow-x-auto px-8">{items.map((item) => {
    const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'))
    return <Link key={item.label} href={item.href} className={`flex h-full items-center whitespace-nowrap px-5 text-base transition-colors ${active ? 'bg-[#007c6d] font-semibold text-white' : 'text-white hover:bg-white/10'}`}>{item.label}</Link>
  })}</div></nav>
}
