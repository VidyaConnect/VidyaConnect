'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowRight, CalendarDays, CheckCircle2, ChevronRight, ClipboardCheck, Clock3, FilePlus2, Filter, Search, Users, XCircle } from 'lucide-react'
import RolePortalChrome from '@/components/RolePortalChrome'
import { useAuth } from '@/features/auth/hooks/userAuth'
import { roleHome } from '@/features/auth/roleRoutes'
import { demoConsentForms, type ConsentForm, type ConsentStatus } from '../types/consent'

type Role = 'teacher' | 'school-admin'
type View = 'overview' | 'forms' | 'create' | 'details'

const statusStyles: Record<ConsentStatus, string> = {
  DRAFT: 'bg-slate-100 text-slate-600',
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  CLOSED: 'bg-slate-100 text-slate-500',
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
}

function Progress({ form }: { form: ConsentForm }) {
  const completed = form.accepted + form.declined
  const percent = form.recipients ? Math.round((completed / form.recipients) * 100) : 0
  return (
    <div className="min-w-36">
      <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
        <span>{completed} of {form.recipients} responses</span><span>{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-[#007c6d]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

function Stat({ label, value, detail, icon: Icon, tone }: { label: string; value: string | number; detail: string; icon: typeof Users; tone: string }) {
  return (
    <div className="flex min-h-[142px] flex-col justify-between rounded-lg border border-[#cfd4dd] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div><p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">{label}</p><p className="mt-2 text-3xl font-bold text-[#0f172a]">{value}</p></div>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}><Icon size={19} /></span>
      </div>
      <p className="text-xs font-medium text-[#64748b]">{detail}</p>
    </div>
  )
}

function FormTable({ forms, role }: { forms: ConsentForm[]; role: Role }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'ALL' | ConsentStatus>('ALL')
  const filtered = forms.filter((form) => (status === 'ALL' || form.status === status) && `${form.title} ${form.audience} ${form.creator}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <section className="rounded-xl border border-[#d8dee8] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
        <div><h2 className="text-lg font-bold text-[#082f61]">Consent forms</h2><p className="mt-1 text-sm text-slate-500">{role === 'teacher' ? 'Forms created by you' : 'All forms within your school'}</p></div>
        <Link href={`/consent/${role}/create`} className="inline-flex items-center gap-2 rounded-lg bg-[#007c6d] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#006b5e]"><FilePlus2 size={17} /> Create form</Link>
      </div>
      <div className="flex flex-wrap gap-3 border-b border-slate-100 p-4">
        <label className="relative min-w-60 flex-1"><Search className="absolute left-3 top-2.5 text-slate-400" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search forms, classes, or creators..." className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-[#007c6d] focus:ring-2 focus:ring-[#007c6d]/10" /></label>
        <label className="relative"><Filter className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={16} /><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="h-10 appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-sm font-semibold text-slate-600 outline-none"><option value="ALL">All statuses</option><option value="ACTIVE">Active</option><option value="DRAFT">Draft</option><option value="CLOSED">Closed</option></select></label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-205 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3 font-bold">Form</th><th className="px-5 py-3 font-bold">Audience</th><th className="px-5 py-3 font-bold">Deadline</th><th className="px-5 py-3 font-bold">Status</th><th className="px-5 py-3 font-bold">Progress</th><th className="px-5 py-3" /></tr></thead>
          <tbody className="divide-y divide-slate-100">{filtered.map((form) => <tr key={form.id} className="group hover:bg-slate-50/70">
            <td className="px-5 py-4"><Link href={`/consent/${role}/${form.id}`} className="font-bold text-[#082f61] hover:text-[#007c6d]">{form.title}</Link><p className="mt-1 text-xs text-slate-400">Created {formatDate(form.createdAt)} · {form.creator}</p></td>
            <td className="px-5 py-4 text-slate-600">{form.audience}</td><td className="px-5 py-4 text-slate-600">{formatDate(form.deadline)}</td>
            <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[form.status]}`}>{form.status === 'ACTIVE' ? 'Published' : form.status[0] + form.status.slice(1).toLowerCase()}</span></td>
            <td className="px-5 py-4"><Progress form={form} /></td><td className="px-5 py-4 text-right"><Link href={`/consent/${role}/${form.id}`} aria-label={`View ${form.title}`} className="inline-flex rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#082f61]"><ChevronRight size={18} /></Link></td>
          </tr>)}{filtered.length === 0 && <tr><td colSpan={6} className="p-12 text-center text-sm text-slate-500">No consent forms match your filters.</td></tr>}</tbody>
        </table>
      </div>
    </section>
  )
}

function CreateForm({ role }: { role: Role }) {
  const [saved, setSaved] = useState(false)
  return <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
    <form onSubmit={(event) => { event.preventDefault(); setSaved(true) }} className="rounded-xl border border-[#d8dee8] bg-white p-6 shadow-sm">
      <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#007c6d]">New consent request</p><h1 className="mt-2 text-2xl font-extrabold text-[#082f61]">{role === 'teacher' ? 'Create a consent form' : 'Create a school-wide form'}</h1><p className="mt-2 text-sm text-slate-500">Give families the context they need to make an informed decision.</p></div>
      {saved && <div className="mb-5 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"><CheckCircle2 size={18} /> Draft saved locally. Connect the consent service API to persist it.</div>}
      <div className="space-y-5">
        <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Form title <b className="text-red-500">*</b></span><input required placeholder="e.g. Field Trip: City Zoo Visit" className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#007c6d] focus:ring-2 focus:ring-[#007c6d]/10" /></label>
        <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Purpose and description <b className="text-red-500">*</b></span><textarea required rows={4} placeholder="Explain what permission is needed and why..." className="w-full resize-y rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#007c6d] focus:ring-2 focus:ring-[#007c6d]/10" /></label>
        <div className="grid gap-5 sm:grid-cols-2"><label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Audience</span><select className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"><option>{role === 'teacher' ? 'Grade 8A' : 'All students in my school'}</option><option>Grade 5 • All sections</option><option>Grade 3B</option></select></label><label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Response deadline <b className="text-red-500">*</b></span><input required type="date" defaultValue="2026-11-30" className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm" /></label></div>
        <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Instructions for parents</span><textarea rows={3} placeholder="Add anything families should know before responding..." className="w-full resize-y rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#007c6d] focus:ring-2 focus:ring-[#007c6d]/10" /></label>
      </div>
      <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5"><Link href={`/consent/${role}`} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</Link><button type="submit" className="rounded-lg border border-[#007c6d] px-4 py-2.5 text-sm font-bold text-[#007c6d] hover:bg-emerald-50">Save draft</button><button type="button" className="rounded-lg bg-[#007c6d] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#006b5e]">Preview & publish</button></div>
    </form>
    <aside className="h-fit rounded-xl border border-[#d8dee8] bg-[#f1f7f7] p-5"><div className="flex items-center gap-2 text-sm font-bold text-[#082f61]"><ClipboardCheck size={18} className="text-[#007c6d]" /> Before you publish</div><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600"><li>• Confirm the audience and recipient count.</li><li>• Use a clear deadline that gives families enough time.</li><li>• Published forms cannot be edited after responses arrive.</li><li>• Parents will see the title, description, instructions, and response options in the mobile app.</li></ul></aside>
  </div>
}

function Detail({ form, role }: { form: ConsentForm; role: Role }) {
  const responseTotal = form.accepted + form.declined
  return <div className="space-y-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><Link href={`/consent/${role}`} className="text-sm font-bold text-[#007c6d]">← Back to forms</Link><h1 className="mt-3 text-2xl font-extrabold text-[#082f61]">{form.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{form.description}</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[form.status]}`}>{form.status === 'ACTIVE' ? 'Published and collecting responses' : form.status}</span></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Recipients" value={form.recipients} detail={form.audience} icon={Users} tone="bg-blue-50 text-blue-600" /><Stat label="Accepted" value={form.accepted} detail={`${Math.round(form.accepted / form.recipients * 100)}% of recipients`} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-600" /><Stat label="Declined" value={form.declined} detail="Parent decisions" icon={XCircle} tone="bg-red-50 text-red-600" /><Stat label="Pending" value={form.pending} detail={`Deadline ${formatDate(form.deadline)}`} icon={Clock3} tone="bg-amber-50 text-amber-600" /></div>
    <div className="grid gap-6 lg:grid-cols-[1fr_330px]"><section className="rounded-xl border border-[#d8dee8] bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-[#082f61]">Response progress</h2><span className="text-sm font-bold text-[#007c6d]">{Math.round(responseTotal / form.recipients * 100)}% complete</span></div><div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#007c6d]" style={{ width: `${responseTotal / form.recipients * 100}%` }} /></div><div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm"><div><p className="font-extrabold text-emerald-600">{form.accepted}</p><p className="mt-1 text-xs text-slate-500">Accepted</p></div><div><p className="font-extrabold text-red-500">{form.declined}</p><p className="mt-1 text-xs text-slate-500">Declined</p></div><div><p className="font-extrabold text-amber-600">{form.pending}</p><p className="mt-1 text-xs text-slate-500">Pending</p></div></div></section><aside className="rounded-xl border border-[#d8dee8] bg-white p-6 shadow-sm"><h2 className="text-lg font-bold text-[#082f61]">Form details</h2><dl className="mt-4 space-y-4 text-sm"><div><dt className="text-xs font-bold uppercase text-slate-400">Created by</dt><dd className="mt-1 font-semibold text-slate-700">{form.creator}</dd></div><div><dt className="text-xs font-bold uppercase text-slate-400">Created</dt><dd className="mt-1 font-semibold text-slate-700">{formatDate(form.createdAt)}</dd></div><div><dt className="text-xs font-bold uppercase text-slate-400">Deadline</dt><dd className="mt-1 font-semibold text-slate-700">{formatDate(form.deadline)}</dd></div></dl></aside></div>
    <section className="rounded-xl border border-[#d8dee8] bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-[#082f61]">Response monitoring</h2><button className="text-sm font-bold text-[#007c6d] hover:underline">Export responses</button></div><div className="mt-5 rounded-lg bg-slate-50 p-5 text-sm text-slate-600"><div className="flex items-start gap-3"><AlertCircle size={18} className="mt-0.5 shrink-0 text-[#007c6d]" /><p>Individual parent responses will appear here when the Consent Service API is connected. Access remains limited to authorised {role === 'teacher' ? 'form owners' : 'school administrators'}.</p></div></div></section>
  </div>
}

export default function ConsentWorkspace({ role, view = 'overview', formId }: { role: Role; view?: View; formId?: string }) {
  const { user, isInitialized } = useAuth()
  const router = useRouter()
  const [activeView, setActiveView] = useState<View>(view)
  useEffect(() => {
    if (!isInitialized) return
    const requiredRole = role === 'teacher' ? 'TEACHER' : 'SCHOOL_ADMIN'
    if (!user) router.replace('/login')
    else if (user.role !== requiredRole) router.replace(roleHome[user.role] ?? '/login')
  }, [isInitialized, role, router, user])
  if (!isInitialized || !user || user.role !== (role === 'teacher' ? 'TEACHER' : 'SCHOOL_ADMIN')) return null
  const forms = role === 'teacher' ? demoConsentForms.filter((form) => form.creator === 'Mrs. Thompson') : demoConsentForms
  const selected = forms.find((form) => form.id === formId) ?? forms[0]
  const activeLabel = role === 'teacher' ? 'Teacher' : 'School Admin'
  const activeForms = forms.filter((form) => form.status === 'ACTIVE')
  const pending = forms.reduce((sum, form) => sum + form.pending, 0)
  return <div className="min-h-screen bg-[#f7f8fa] font-sans text-[#25272c]"><RolePortalChrome userRole={role} /><main className="mx-auto w-full max-w-370 px-6 pb-12 pt-8">
    {activeView !== 'create' && activeView !== 'details' && <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-[#007c6d]">{activeLabel} workspace</p><h1 className="mt-1 text-2xl font-bold text-[#003b78]">Consent Forms</h1><p className="mt-1.5 text-sm text-[#555962]">{role === 'teacher' ? 'Create, publish, and monitor permissions for your classes.' : 'Keep your school’s consent requests organised and visible.'}</p></div><Link href={`/consent/${role}/create`} className="inline-flex items-center gap-2 rounded-lg bg-[#007c6d] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#006b5e]"><FilePlus2 size={18} /> Create consent form</Link></div>}
    {activeView === 'overview' && <><div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Total forms" value={forms.length} detail="Across your workspace" icon={ClipboardCheck} tone="bg-blue-50 text-blue-600" /><Stat label="Active forms" value={activeForms.length} detail="Currently collecting responses" icon={CheckCircle2} tone="bg-emerald-50 text-emerald-600" /><Stat label="Pending responses" value={pending} detail="Need parent attention" icon={Clock3} tone="bg-amber-50 text-amber-600" /><Stat label="Due soon" value={forms.filter((form) => form.status === 'ACTIVE').length} detail="Forms with upcoming deadlines" icon={CalendarDays} tone="bg-violet-50 text-violet-600" /></div><div className="mb-5 flex gap-2 border-b border-[#cfd4dd]"><button onClick={() => setActiveView('overview')} className="border-b-2 border-[#007c6d] px-1 pb-3 text-sm font-bold text-[#007c6d]">Overview</button><button onClick={() => setActiveView('forms')} className="px-1 pb-3 text-sm font-bold text-[#64748b] hover:text-[#003b78]">All forms <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs">{forms.length}</span></button></div><div className="grid gap-5 lg:grid-cols-[1fr_320px]"><section className="rounded-lg border border-[#cfd4dd] bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-bold text-[#003b78]">Recent forms</h2><p className="mt-1 text-sm text-[#64748b]">Your latest consent activity</p></div><button onClick={() => setActiveView('forms')} className="inline-flex items-center gap-1 text-sm font-bold text-[#007c6d]">View all <ArrowRight size={16} /></button></div><div className="divide-y divide-slate-100">{forms.slice(0, 3).map((form) => <Link key={form.id} href={`/consent/${role}/${form.id}`} className="flex items-center justify-between gap-4 py-4 first:pt-1 hover:bg-slate-50"><div className="min-w-0"><p className="truncate font-bold text-[#003b78]">{form.title}</p><p className="mt-1 text-xs text-[#64748b]">{form.audience} · Due {formatDate(form.deadline)}</p></div><Progress form={form} /></Link>)}</div></section><aside className="rounded-lg bg-[#073b78] p-6 text-white shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15"><ClipboardCheck size={21} /></div><h2 className="mt-5 text-xl font-extrabold">Make every response count</h2><p className="mt-2 text-sm leading-6 text-blue-100">Clear details and realistic deadlines help families respond on time.</p><Link href={`/consent/${role}/create`} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-[#073b78] hover:bg-blue-50">Start a form <ArrowRight size={16} /></Link></aside></div><div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]"><section className="rounded-lg border border-[#cfd4dd] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-[#003b78]">Response snapshot</h2><p className="mt-1 text-sm text-[#64748b]">How families are responding across active forms</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Live overview</span></div><div className="mt-5 space-y-4">{[{ label: 'Accepted', value: forms.reduce((sum, form) => sum + form.accepted, 0), color: 'bg-[#007c6d]' }, { label: 'Declined', value: forms.reduce((sum, form) => sum + form.declined, 0), color: 'bg-red-500' }, { label: 'Awaiting response', value: pending, color: 'bg-amber-400' }].map((item) => <div key={item.label}><div className="mb-1 flex justify-between text-xs font-bold text-[#64748b]"><span>{item.label}</span><span>{item.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.min(100, (item.value / Math.max(1, pending + item.value)) * 100)}%` }} /></div></div>)}</div></section><aside className="rounded-lg border border-[#cfd4dd] bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><CalendarDays size={18} className="text-[#007c6d]" /><h2 className="text-lg font-bold text-[#003b78]">Keep forms moving</h2></div><p className="mt-3 text-sm leading-6 text-[#64748b]">Review pending responses and send reminders before deadlines.</p><button onClick={() => setActiveView('forms')} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#007c6d]">Review all forms <ArrowRight size={16} /></button></aside></div></>}
    {activeView === 'forms' && <FormTable forms={forms} role={role} />}
    {activeView === 'create' && <CreateForm role={role} />}
    {activeView === 'details' && selected && <Detail form={selected} role={role} />}
  </main></div>
}
