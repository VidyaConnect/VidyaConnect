'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AssignmentPortalLayout from './AssignmentPortalLayout'
import { useAuth } from '@/features/auth/hooks/userAuth'
import { assignmentService, type Assignment, type ProgressStatus } from './services/assignmentService'

export default function AssignmentTracking() {
  const router = useRouter()
  const params = useSearchParams()
  const { user, isInitialized } = useAuth()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [selectedId, setSelectedId] = useState(params.get('assignmentId') || '')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'ALL'|'COMPLETED'|'PENDING'|'MISSING'>('ALL')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState('')

  useEffect(() => {
    if (!isInitialized) return
    if (!user || user.role !== 'TEACHER') { router.replace('/login'); return }
    assignmentService.list().then(setAssignments).catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not load progress')).finally(() => setLoading(false))
  }, [isInitialized,user,router])

  const published=assignments.filter((a)=>a.status==='PUBLISHED')
  const selected=published.find((a)=>a.id===selectedId)||published[0]
  const statuses=selected?.studentStatuses||[]
  const counts=useMemo(()=>({complete:statuses.filter(x=>x.status==='COMPLETED').length,pending:statuses.filter(x=>x.status==='PENDING').length,missing:statuses.filter(x=>x.status==='MISSING').length}),[statuses])
  const visible=useMemo(()=>statuses.filter((student)=>`${student.studentName} ${student.rollNumber||''}`.toLowerCase().includes(search.toLowerCase())&&(filter==='ALL'||student.status===filter)),[statuses,search,filter])

  async function update(id:string,status:ProgressStatus,marks?:number|null,feedback?:string|null){if(!selected)return;setSaving(id);setError('');try{const result=await assignmentService.updateStatus(selected.id,id,{status,marks,feedback});setAssignments((all)=>all.map((a)=>a.id===result.id?result:a))}catch(err){setError(err instanceof Error?err.message:'Could not update progress')}finally{setSaving('')}}

  return <AssignmentPortalLayout>
    <main className="min-h-screen"><header className="sticky top-0 z-20 flex min-h-[72px] items-center justify-end border-b bg-white px-6"><div className="flex gap-2 rounded-xl bg-slate-100 p-1"><button onClick={()=>router.push('/assignments/teacher/create')} className="rounded-lg px-5 py-2.5 text-sm text-slate-600">Post New Assignment</button><button className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold shadow-sm">View Submissions</button><button onClick={()=>router.push('/assignments/teacher')} className="rounded-lg px-5 py-2.5 text-sm text-slate-600">Assignment Calendar</button></div></header><div className="mx-auto max-w-[1500px] px-6 py-8 sm:px-10"><div><h1 className="text-3xl font-bold">Manage Assignments</h1><p className="mt-1 text-slate-500">Review class progress after students hand in their work</p></div>
    {error&&<p role="alert" className="mt-5 rounded-lg bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {loading?<p className="mt-8 text-slate-500">Loading assignments…</p>:published.length===0?<div className="mt-7 rounded-xl border bg-white p-10 text-center"><h2 className="font-semibold">No published assignments to track</h2><button onClick={()=>router.push('/assignments/teacher/create')} className="mt-3 text-sm font-semibold text-teal-800">Post an assignment</button></div>:<>
      <div className="mt-6 rounded-xl border bg-white p-5"><div className="text-xs font-semibold uppercase text-slate-400">Current selection</div><div className="mt-2 flex flex-wrap items-center gap-4"><select aria-label="Select assignment" value={selected?.id||''} onChange={(e)=>setSelectedId(e.target.value)} className="min-w-64 flex-1 rounded-lg border px-3 py-3 font-semibold">{published.map(a=><option key={a.id} value={a.id}>{a.title} — Due {new Date(a.dueAt).toLocaleDateString()}</option>)}</select><span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">● Active · {counts.complete}/{statuses.length} Complete</span></div></div>
      {selected&&<div className="mt-6 grid items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]"><section className="overflow-hidden rounded-xl border bg-white shadow-sm"><div className="border-b p-5"><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search students" className="w-full max-w-sm rounded-lg border px-4 py-2.5 text-sm"/><div className="mt-4 flex flex-wrap gap-2">{(['ALL','COMPLETED','PENDING','MISSING'] as const).map((id)=><button key={id} onClick={()=>setFilter(id)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${filter===id?'bg-[#10233a] text-white':'bg-slate-100 text-slate-600'}`}>{id==='ALL'?`All (${statuses.length})`:id==='COMPLETED'?`Complete (${counts.complete})`:id==='PENDING'?`Pending (${counts.pending})`:`Missing (${counts.missing})`}</button>)}</div></div>
      {visible.length===0?<p className="p-8 text-sm text-slate-500">No students match this filter.</p>:<div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500"><tr><th className="px-5 py-4">Student Name</th><th className="px-4 py-4">Roll No.</th><th className="px-4 py-4">Handed In</th><th className="px-4 py-4">Marks &amp; Feedback</th><th className="px-4 py-4">Status</th></tr></thead><tbody className="divide-y">{visible.map(student=><tr key={student.studentId}><td className="px-5 py-4 font-semibold">{student.studentName}</td><td className="px-4 py-4 text-slate-500">{student.rollNumber||'—'}</td><td className="px-4 py-4 text-slate-500">{student.status==='PENDING'?'Not recorded':student.markedAt?new Date(student.markedAt).toLocaleString():'Received at school'}</td><td className="px-4 py-4">{student.marks??'—'} <button onClick={()=>{const raw=window.prompt(`Mark for ${student.studentName}`,student.marks==null?'':String(student.marks));if(raw===null)return;const mark=Number(raw);if(!raw.trim()||!Number.isFinite(mark)||mark<0||mark>100){setError('Enter a mark from 0 to 100.');return}void update(student.studentId,student.status,mark,student.feedback)}} className="ml-2 text-xs font-semibold text-teal-800">{student.marks==null?'Add mark':'Edit mark'}</button>{student.status==='COMPLETED'&&<button onClick={()=>{const feedback=window.prompt(`Feedback for ${student.studentName}`,student.feedback||'');if(feedback===null)return;void update(student.studentId,student.status,student.marks,feedback)}} className="ml-2 text-xs font-semibold text-teal-800">Feedback</button>}{student.feedback&&<p className="mt-1 max-w-xs text-xs text-slate-500">{student.feedback}</p>}</td><td className="px-4 py-4"><select aria-label={`Progress for ${student.studentName}`} disabled={saving===student.studentId} value={student.status} onChange={(e)=>update(student.studentId,e.target.value as ProgressStatus,student.marks,student.feedback)} className="rounded-full border px-3 py-2 text-xs font-semibold"><option value="COMPLETED">Complete</option><option value="PENDING">Pending review</option><option value="MISSING">Missing</option></select></td></tr>)}</tbody></table></div>}
      <div className="border-t p-4 text-sm text-slate-500">Showing {visible.length} of {statuses.length} students</div></section>
      <aside className="space-y-5"><div className="rounded-xl border bg-white p-5"><h2 className="font-semibold">Submission Overview</h2><div className="mt-5 grid grid-cols-3 gap-2 text-center"><Summary label="Complete" value={counts.complete} color="text-emerald-700"/><Summary label="Pending" value={counts.pending} color="text-amber-700"/><Summary label="Missing" value={counts.missing} color="text-rose-700"/></div><div className="mt-5 border-t pt-4"><div className="text-xs uppercase text-slate-400">Class average</div><div className="mt-1 text-2xl font-bold">{statuses.filter(x=>x.marks!=null).length?`${(statuses.filter(x=>x.marks!=null).reduce((sum,x)=>sum+(x.marks||0),0)/statuses.filter(x=>x.marks!=null).length).toFixed(1)}`:'—'}</div></div></div><div className="rounded-xl border bg-white p-5"><h2 className="font-semibold">Marking Progress</h2><p className="mt-2 text-sm text-slate-500">Marks entered for {statuses.filter(x=>x.marks!=null).length} of {statuses.length} students</p><div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-teal-700" style={{width:`${statuses.length?statuses.filter(x=>x.marks!=null).length/statuses.length*100:0}%`}}/></div></div><div className="rounded-xl bg-[#073b78] p-5 text-sm leading-relaxed text-blue-50">Students hand physical answer sheets to you at school. No online student submission is collected.</div></aside></div>}
    </>}</div></main>
  </AssignmentPortalLayout>
}

function Summary({label,value,color}:{label:string;value:number;color:string}){return <div className="rounded-lg bg-slate-50 p-3"><div className={`text-xl font-bold ${color}`}>{value}</div><div className="mt-1 text-xs text-slate-500">{label}</div></div>}
