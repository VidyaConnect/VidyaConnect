'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AssignmentPortalLayout from './AssignmentPortalLayout'
import FileUpload from '@/features/files/components/FileUpload'
import { useAuth } from '@/features/auth/hooks/userAuth'
import { assignmentService, type AssignmentClass } from './services/assignmentService'

type Attachment = { fileId: string; fileName: string }

export default function AssignmentCreate() {
  const router = useRouter()
  const { user, isInitialized } = useAuth()
  const [klass, setKlass] = useState<AssignmentClass | null>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', subject: '', description: '', publishAt: '', dueAt: '' })

  useEffect(() => {
    if (!isInitialized) return
    if (!user || user.role !== 'TEACHER') { router.replace('/login'); return }
    assignmentService.getClasses().then((classes) => setKlass(classes[0] ?? null)).catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not load your class'))
  }, [isInitialized, user, router])

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const validate = () => {
    if (!klass) return 'You need an assigned class before creating an assignment.'
    if (!form.title.trim() || !form.subject.trim() || !form.description.trim()) return 'Complete the title, subject and instructions.'
    if (!form.publishAt || !form.dueAt) return 'Choose a publication date and deadline.'
    if (new Date(form.dueAt) <= new Date(form.publishAt)) return 'The deadline must be after the publication date.'
    return ''
  }

  async function save(publish: boolean) {
    const validation = validate()
    if (validation) { setError(validation); return }
    setSaving(true); setError('')
    try {
      const assignment = await assignmentService.create({ ...form, attachments })
      if (publish) await assignmentService.publish(assignment.id)
      router.push('/assignments/teacher')
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not save assignment') }
    finally { setSaving(false) }
  }

  return <AssignmentPortalLayout>
    <div className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col bg-[#073b78] text-white xl:flex"><div className="px-8 pb-8 pt-7"><div className="text-[28px] font-extrabold">VidyaConnect</div><div className="text-lg font-semibold text-blue-100">Teacher Portal</div></div><TeacherSidebar active="assignments" router={router}/></div>
    <main className="min-h-screen xl:ml-[260px]"><TopActions router={router}/><div className="mx-auto max-w-[1500px] px-6 py-8 sm:px-10"><div><h1 className="text-3xl font-bold text-[#10233a]">Manage Assignments</h1><p className="mt-1 text-slate-500">Create and organize student tasks for {klass?.className || 'your assigned class'}</p></div>{error&&<p role="alert" className="mt-5 rounded-lg bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    <div className="mt-7 grid items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]"><form onSubmit={(e)=>e.preventDefault()} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between border-b pb-4"><h2 className="text-lg font-semibold">Assignment Details</h2><span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">{saving?'Saving…':'Draft Autosaved'}</span></div>
    <div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="block"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Subject</span><select value={form.subject} onChange={(e)=>update('subject',e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm"><option value="">Select subject / class</option>{['Mathematics','English','Science','History','Geography','Other'].map((x)=><option key={x}>{x}</option>)}</select></label><label className="block"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Deadline</span><input type="datetime-local" value={form.dueAt} onChange={(e)=>update('dueAt',e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm"/></label></div>
    <label className="mt-6 block"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Assignment Title</span><input value={form.title} onChange={(e)=>update('title',e.target.value)} placeholder="e.g. Quadratic Equations Practice Set" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"/></label>
    <label className="mt-6 block"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Description &amp; Instructions</span><textarea rows={9} value={form.description} onChange={(e)=>update('description',e.target.value)} placeholder="Enter detailed assignment instructions here…" className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm"/></label>
    <div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="block"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Publish date</span><input type="datetime-local" value={form.publishAt} onChange={(e)=>update('publishAt',e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm"/></label><div className="text-sm text-slate-500"><span className="font-semibold text-slate-700">Assigned class</span><div className="mt-2 rounded-lg bg-slate-50 px-4 py-3">{klass?.className||'Loading class…'}</div></div></div>
    <div className="mt-7 flex flex-wrap justify-end gap-3 border-t pt-5"><button type="button" disabled={saving} onClick={()=>save(false)} className="rounded-lg px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50">Save as Draft</button><button type="button" disabled={saving} onClick={()=>save(true)} className="rounded-lg bg-[#007c6d] px-6 py-3 font-semibold text-white disabled:opacity-50">{saving?'Saving…':'Post Assignment'}</button></div></form>
    <aside className="space-y-5"><div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-semibold">Distribution</h2><div className="mt-4 rounded-lg border border-slate-200 p-4"><div className="font-semibold">✓ &nbsp; All Students</div><div className="ml-6 text-xs font-semibold uppercase text-slate-400">Assigned class roster</div></div><p className="mt-3 text-xs text-slate-500">Assignments go to students in your assigned class.</p></div><div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-semibold">Supporting Materials</h2><p className="mt-1 text-xs text-slate-500">Attach PDF, Word or image files (up to 10 MB each).</p><div className="mt-4"><FileUpload purpose="assignment-attachment" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" maxFileSizeBytes={10*1024*1024} label="Choose file to upload" onUploadComplete={(fileId,fileName)=>setAttachments((all)=>[...all,{fileId,fileName}])}/></div>{attachments.map((file)=><div key={file.fileId} className="mt-2 flex items-center justify-between rounded bg-slate-50 px-3 py-2 text-sm"><span className="truncate">📎 {file.fileName}</span><button type="button" onClick={()=>setAttachments((all)=>all.filter((x)=>x.fileId!==file.fileId))} className="ml-2 text-rose-700">×</button></div>)}</div><div className="rounded-xl bg-[#1e4772] p-5 text-white"><div className="font-semibold text-teal-200">✦ Pro Tip</div><p className="mt-2 text-sm leading-relaxed">Students do the assigned work at home and return answer sheets physically to the teacher at school.</p></div></aside></div></div></main>
  </AssignmentPortalLayout>
}

function TopActions({router}:{router:ReturnType<typeof useRouter>}){return <header className="sticky top-0 z-20 flex min-h-[72px] items-center justify-end border-b border-slate-200 bg-white px-6 sm:px-10"><div className="flex gap-2 rounded-xl bg-slate-100 p-1"><button className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold shadow-sm">Post New Assignment</button><button onClick={()=>router.push('/assignments/teacher/tracking')} className="rounded-lg px-5 py-2.5 text-sm text-slate-600">View Submissions</button><button onClick={()=>router.push('/assignments/teacher')} className="rounded-lg px-5 py-2.5 text-sm text-slate-600">Assignment Calendar</button></div></header>}
function TeacherSidebar({active,router}:{active:string;router:ReturnType<typeof useRouter>}){return <><nav className="space-y-1 px-4">{[['▦','Dashboard','/dashboard/teacher'],['⚯','My Classes','#'],['▣','Announcements','/announcements/teacher-feed'],['▱','Community Messages','#'],['♙','Mark Attendance','/attendance/teacher'],['▤','Manage Assignments','/assignments/teacher'],['▧','Consent Forms','#'],['▦','Class Calendar','/assignments/teacher'],['◇','Reports','#'],['⚙','Settings','#']].map(([icon,label,href])=><button key={label} onClick={()=>href!=='#'&&router.push(href)} className={`flex h-12 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold ${active==='assignments'&&label==='Manage Assignments'?'bg-[#007c6d] text-white':'text-blue-100 hover:bg-white/10'}`}><span className="w-5 text-center text-lg">{icon}</span>{label}</button>)}</nav><button onClick={()=>router.replace('/login')} className="mt-auto px-8 py-6 text-left font-semibold text-blue-100">⇥ Logout</button></>}
