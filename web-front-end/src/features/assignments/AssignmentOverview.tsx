'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import AssignmentPortalLayout from './AssignmentPortalLayout'
import { useAuth } from '@/features/auth/hooks/userAuth'
import { assignmentService, type Assignment } from './services/assignmentService'

export default function AssignmentOverview() {
  const router = useRouter()
  const { user, isInitialized } = useAuth()
  const [items, setItems] = useState<Assignment[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(() => new Date())

  useEffect(() => {
    if (!isInitialized) return
    if (!user || user.role !== 'TEACHER') { router.replace('/login'); return }
    assignmentService.list().then(setItems).catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not load assignments')).finally(() => setLoading(false))
  }, [isInitialized, user, router])

  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1)
    const offset = (first.getDay() + 6) % 7
    const start = new Date(first); start.setDate(first.getDate() - offset)
    return Array.from({ length: 42 }, (_, index) => { const date = new Date(start); date.setDate(start.getDate() + index); return date })
  }, [month])
  const published = items.filter((item) => item.status === 'PUBLISHED')
  const upcoming = published.filter((item) => new Date(item.dueAt).getTime() > Date.now()).sort((a,b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()).slice(0,4)

  return <AssignmentPortalLayout>
    <main className="min-h-screen"><header className="sticky top-0 z-20 flex min-h-[72px] items-center justify-end border-b border-slate-200 bg-white px-6 sm:px-10"><div className="flex gap-2 rounded-xl bg-slate-100 p-1"><button onClick={()=>router.push('/assignments/teacher/create')} className="rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-600">Post New Assignment</button><button onClick={()=>router.push('/assignments/teacher/tracking')} className="rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-600">View Submissions</button><button className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm">Assignment Calendar</button></div></header>
    <div className="mx-auto max-w-[1500px] px-6 py-8 sm:px-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-bold text-[#10233a]">Manage Assignments</h1><p className="mt-1 text-slate-500">Create and organize student tasks for your assigned class</p></div><div className="flex gap-2"><button onClick={()=>router.push('/assignments/teacher/create')} className="rounded-lg bg-[#007c6d] px-5 py-3 font-semibold text-white">＋ Post New Assignment</button><button onClick={()=>router.push('/assignments/teacher/tracking')} className="rounded-lg border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700">View Submissions</button></div></div>
    {error&&<p role="alert" className="mt-5 rounded-lg bg-rose-50 p-4 text-rose-800">{error}</p>}
    <div className="mt-7 grid gap-6 2xl:grid-cols-[minmax(0,1fr)_380px]"><section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-5"><div><h2 className="font-semibold">Assignment Calendar</h2><p className="mt-1 text-sm text-slate-500">Deadlines for your class assignments</p></div><div className="flex gap-2"><button aria-label="Previous month" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))} className="rounded-lg border px-3 py-2">‹</button><button onClick={()=>setMonth(new Date())} className="rounded-lg border px-3 py-2 text-sm">Today</button><button aria-label="Next month" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))} className="rounded-lg border px-3 py-2">›</button></div><h3 className="w-full text-lg font-bold">{month.toLocaleDateString(undefined,{month:'long',year:'numeric'})}</h3></div><div className="grid grid-cols-7 bg-slate-50 text-center text-xs font-semibold uppercase text-slate-500">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day)=><div key={day} className="py-3">{day}</div>)}</div><div className="grid grid-cols-7">{days.map((day,index)=>{const events=published.filter((item)=>new Date(item.dueAt).toDateString()===day.toDateString());const current=day.getMonth()===month.getMonth();return <div key={index} className={`min-h-24 border-b border-r border-slate-100 p-2 ${current?'bg-white':'bg-slate-50/70'}`}><div className={`text-sm ${current?'text-slate-700':'text-slate-400'}`}>{day.getDate()}</div>{events.map((item)=><button key={item.id} onClick={()=>router.push(`/assignments/teacher/tracking?assignmentId=${item.id}`)} className="mt-1 block w-full truncate border-l-4 border-blue-800 bg-blue-50 px-1 py-1 text-left text-[11px] font-semibold text-blue-900">{item.title}</button>)}</div>})}</div></section>
    <aside className="space-y-5"><div className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-semibold">Upcoming deadlines</h2>{loading?<p className="mt-4 text-sm text-slate-500">Loading…</p>:upcoming.length===0?<p className="mt-4 text-sm text-slate-500">No upcoming deadlines.</p>:<div className="mt-4 space-y-3">{upcoming.map((item)=><button key={item.id} onClick={()=>router.push(`/assignments/teacher/tracking?assignmentId=${item.id}`)} className="flex w-full gap-3 rounded-lg border p-3 text-left"><div className="min-w-12 text-center"><div className="text-xs uppercase text-slate-400">{new Date(item.dueAt).toLocaleDateString(undefined,{month:'short'})}</div><div className="text-xl font-bold">{new Date(item.dueAt).getDate()}</div></div><div><div className="font-semibold">{item.title}</div><div className="text-sm text-slate-500">{item.subject}</div></div></button>)}</div>}</div><div className="rounded-xl bg-[#1e4772] p-5 text-white"><div className="font-semibold text-teal-200">✦ Reminder tip</div><p className="mt-2 text-sm">Students complete work at home and hand answer sheets in at school.</p></div><div className="grid grid-cols-2 gap-3"><Metric label="Published" value={published.length}/><Metric label="Drafts" value={items.filter((item)=>item.status==='DRAFT').length}/></div></aside></div></div></main>
  </AssignmentPortalLayout>
}
function Metric({label,value}:{label:string;value:number}){return <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-sm text-slate-500">{label}</div><div className="mt-1 text-2xl font-bold">{value}</div></div>}
