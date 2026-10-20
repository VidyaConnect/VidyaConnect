'use client'

import Link from 'next/link'
import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowRight, CalendarDays, CheckCircle2, ChevronRight, ClipboardCheck, Clock3, FilePlus2, Filter, Search, Sparkles, Users, XCircle } from 'lucide-react'
import RolePortalChrome from '@/components/RolePortalChrome'
import { useAuth } from '@/features/auth/hooks/userAuth'
import { roleHome } from '@/features/auth/roleRoutes'
import { closeConsentForm, createConsentForm, getConsentForm, getConsentForms, getConsentResponses, publishConsentForm, type ConsentResponse } from '../services/consentService'
import type { ConsentForm, ConsentStatus } from '../types/consent'

type Role = 'teacher' | 'school-admin'
type View = 'overview' | 'forms' | 'create' | 'details'

const statusStyles: Record<ConsentStatus, string> = {
  DRAFT: 'bg-slate-100 text-slate-600',
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  CLOSED: 'bg-slate-100 text-slate-500',
}

function formatDate(date: string) {
  const value = date.length > 10 ? date : `${date}T12:00:00`
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

function isDueSoon(form: ConsentForm) {
  if (form.status !== 'ACTIVE') return false
  const days = (new Date(form.deadline).getTime() - Date.now()) / 86400000
  return days >= 0 && days <= 7
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
    <div className="group relative flex min-h-36 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,47,97,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,47,97,0.1)]">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-50 transition group-hover:scale-125" />
      <div className="flex items-start justify-between">
        <div className="relative"><p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">{label}</p><p className="mt-2 text-3xl font-black tracking-tight text-[#0f172a]">{value}</p></div>
        <span className={`relative flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}><Icon size={19} /></span>
      </div>
      <p className="relative text-xs font-medium text-slate-500">{detail}</p>
    </div>
  )
}

function FormTable({ forms, role }: { forms: ConsentForm[]; role: Role }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'ALL' | ConsentStatus>('ALL')
  const filtered = forms.filter((form) => (status === 'ALL' || form.status === status) && `${form.title} ${form.audience} ${form.creator}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,47,97,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-white to-[#f0f8f7] p-6">
        <div><div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#e2f4f1] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#007c6d]"><ClipboardCheck size={13} /> Workspace library</div><h2 className="text-xl font-black tracking-tight text-[#082f61]">Consent forms</h2><p className="mt-1 text-sm text-slate-500">{role === 'teacher' ? 'Forms created by you' : 'All forms within your school'}</p></div>
        <Link href={`/consent/${role}/create`} className="inline-flex items-center gap-2 rounded-xl bg-[#007c6d] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(0,124,109,0.2)] transition hover:-translate-y-0.5 hover:bg-[#006b5e]"><FilePlus2 size={17} /> Create form</Link>
      </div>
      <div className="flex flex-wrap gap-3 border-b border-slate-100 p-4">
        <label className="relative min-w-60 flex-1"><Search className="absolute left-3 top-2.5 text-slate-400" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search forms, classes, or creators..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#007c6d] focus:bg-white focus:ring-4 focus:ring-[#007c6d]/10" /></label>
        <label className="relative"><Filter className="pointer-events-none absolute left-3 top-3 text-slate-400" size={16} /><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="h-11 appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-sm font-semibold text-slate-600 outline-none transition hover:border-slate-300 focus:border-[#007c6d] focus:ring-4 focus:ring-[#007c6d]/10"><option value="ALL">All statuses</option><option value="ACTIVE">Active</option><option value="DRAFT">Draft</option><option value="CLOSED">Closed</option></select></label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-205 text-left text-sm">
          <thead className="bg-slate-50/80 text-[11px] uppercase tracking-[0.14em] text-slate-500"><tr><th className="px-5 py-3.5 font-extrabold">Form</th><th className="px-5 py-3.5 font-extrabold">Audience</th><th className="px-5 py-3.5 font-extrabold">Deadline</th><th className="px-5 py-3.5 font-extrabold">Status</th><th className="px-5 py-3.5 font-extrabold">Progress</th><th className="px-5 py-3.5" /></tr></thead>
          <tbody className="divide-y divide-slate-100">{filtered.map((form) => <tr key={form.id} className="group transition hover:bg-[#f5fbfa]">
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

function CreateForm({ role, onCreated }: { role: Role; onCreated: (form: ConsentForm) => void }) {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [audience, setAudience] = useState(role === 'teacher' ? 'Grade 8A' : 'All students in my school')
  const [deadline, setDeadline] = useState('')
  const [instructions, setInstructions] = useState('')
  const today = new Date().toISOString().slice(0, 10)

  async function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const shouldPublish = (event.nativeEvent.submitter as HTMLButtonElement | null)?.value === 'publish'
    setError('')
    if (!title.trim() || !description.trim() || !deadline) {
      setError('Complete the title, description, and response deadline before saving.')
      return
    }
    if (deadline <= today) {
      setError('The response deadline must be a future date.')
      return
    }
    setSaving(true)
    try {
      const form = await createConsentForm({
        title: title.trim(),
        description: description.trim(),
        audience,
        instructions: instructions.trim() || undefined,
        deadline,
        scope: role === 'teacher' ? 'CLASS' : 'SCHOOL',
      })
      const savedForm = shouldPublish ? await publishConsentForm(form.id) : form
      setSaved(true)
      onCreated(savedForm)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save the consent form.')
    } finally {
      setSaving(false)
    }
  }

  return <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
    <form onSubmit={saveDraft} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_14px_40px_rgba(15,47,97,0.07)]">
      <div className="border-b border-slate-100 bg-gradient-to-r from-[#f0f8f7] via-white to-white px-6 py-7"><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e2f4f1] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#007c6d]"><Sparkles size={13} /> New consent request</div><h1 className="text-2xl font-black tracking-tight text-[#082f61]">{role === 'teacher' ? 'Create a consent form' : 'Create a school-wide form'}</h1><p className="mt-2 text-sm leading-6 text-slate-500">Give families the context they need to make an informed decision.</p></div>
      {saved && <div className="mb-5 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"><CheckCircle2 size={18} /> Draft saved successfully.</div>}
      {error && <div role="alert" className="mb-5 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700"><AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}</div>}
      <div className="space-y-5 px-6 pt-6">
        <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Form title <b className="text-red-500">*</b></span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Field Trip: City Zoo Visit" className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#007c6d] focus:ring-2 focus:ring-[#007c6d]/10" /></label>
        <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Purpose and description <b className="text-red-500">*</b></span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} placeholder="Explain what permission is needed and why..." className="w-full resize-y rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#007c6d] focus:ring-2 focus:ring-[#007c6d]/10" /></label>
        <div className="grid gap-5 sm:grid-cols-2"><label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Audience</span><input value={audience} onChange={(event) => setAudience(event.target.value)} readOnly={role === 'school-admin'} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm read-only:bg-slate-50 read-only:text-slate-600" /><span className="mt-1.5 block text-xs text-slate-500">{role === 'teacher' ? 'Your assigned class will receive this request.' : 'Every active student in your school will receive this request.'}</span></label><label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Response deadline <b className="text-red-500">*</b></span><input required min={today} type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm" /></label></div>
        <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Instructions for parents</span><textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} rows={3} placeholder="Add anything families should know before responding..." className="w-full resize-y rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#007c6d] focus:ring-2 focus:ring-[#007c6d]/10" /></label>
      </div>
      <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-slate-100 px-6 py-5"><Link href={`/consent/${role}`} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Cancel</Link><button type="button" onClick={() => setPreview((value) => !value)} className="rounded-xl border border-[#007c6d] px-4 py-2.5 text-sm font-bold text-[#007c6d] transition hover:bg-emerald-50">{preview ? 'Hide preview' : 'Preview'}</button><button disabled={saving} value="draft" type="submit" className="rounded-xl border border-[#007c6d] px-4 py-2.5 text-sm font-bold text-[#007c6d] transition hover:bg-emerald-50 disabled:opacity-60">{saving ? 'Saving…' : 'Save draft'}</button><button disabled={saving} value="publish" type="submit" className="rounded-xl bg-[#007c6d] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(0,124,109,0.2)] transition hover:-translate-y-0.5 hover:bg-[#006b5e] disabled:cursor-wait disabled:opacity-60">{saving ? 'Publishing…' : 'Preview & publish'}</button></div>
    </form>
    <aside className="h-fit space-y-5">{preview ? <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_14px_40px_rgba(15,47,97,0.07)]"><div className="bg-[#073b78] px-5 py-4 text-white"><p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-200">Parent preview</p><h2 className="mt-2 text-xl font-black">{title || 'Untitled consent form'}</h2></div><div className="p-5"><p className="text-sm leading-6 text-slate-600">{description || 'Your description will appear here.'}</p><div className="mt-5 rounded-xl bg-[#f3f8f8] p-4 text-sm"><p className="font-bold text-[#082f61]">For: {audience}</p><p className="mt-1 text-slate-500">Respond by {deadline ? formatDate(deadline) : 'the selected deadline'}</p></div><p className="mt-4 text-sm leading-6 text-slate-600">{instructions || 'Additional parent instructions will appear here.'}</p><div className="mt-5 grid grid-cols-2 gap-3"><button type="button" className="rounded-xl border border-emerald-600 px-3 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">Accept</button><button type="button" className="rounded-xl border border-red-300 px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50">Decline</button></div></div></div> : <div className="rounded-2xl border border-[#cfe8e3] bg-gradient-to-br from-[#f1f9f8] to-white p-6 shadow-[0_10px_30px_rgba(0,124,109,0.06)]"><div className="flex items-center gap-2 text-sm font-extrabold text-[#082f61]"><ClipboardCheck size={18} className="text-[#007c6d]" /> Before you publish</div><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600"><li>• Confirm the audience and recipient count.</li><li>• Use a clear deadline that gives families enough time.</li><li>• Published forms cannot be edited after responses arrive.</li><li>• Parents will see the title, description, instructions, and response options in the mobile app.</li></ul></div>}</aside>
  </div>
}

function Detail({ form, role, onUpdated }: { form: ConsentForm; role: Role; onUpdated: (form: ConsentForm) => void }) {
  const responseTotal = form.accepted + form.declined
  const [responses, setResponses] = useState<ConsentResponse[]>([])
  const [actionError, setActionError] = useState('')
  const [actionPending, setActionPending] = useState(false)
  useEffect(() => {
    let cancelled = false
    getConsentResponses(form.id).then((items) => {
      if (!cancelled) setResponses(items)
    }).catch((error) => {
      if (!cancelled) setActionError(error instanceof Error ? error.message : 'Unable to load responses.')
    })
    return () => { cancelled = true }
  }, [form.id])

  async function changeStatus(action: () => Promise<ConsentForm>) {
    setActionError('')
    setActionPending(true)
    try {
      onUpdated(await action())
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to update the consent form.')
    } finally {
      setActionPending(false)
    }
  }

  return <div className="space-y-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><Link href={`/consent/${role}`} className="text-sm font-bold text-[#007c6d]">← Back to forms</Link><h1 className="mt-3 text-2xl font-extrabold text-[#082f61]">{form.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{form.description}</p></div><div className="flex items-center gap-3"><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[form.status]}`}>{form.status === 'ACTIVE' ? 'Published and collecting responses' : form.status}</span>{form.status === 'DRAFT' && <button disabled={actionPending} onClick={() => changeStatus(() => publishConsentForm(form.id))} className="rounded-lg bg-[#007c6d] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">{actionPending ? 'Updating…' : 'Publish form'}</button>}{form.status === 'ACTIVE' && <button disabled={actionPending} onClick={() => changeStatus(() => closeConsentForm(form.id))} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-60">{actionPending ? 'Updating…' : 'Close form'}</button>}</div></div>{actionError && <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{actionError}</div>}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Recipients" value={form.recipients} detail={form.audience} icon={Users} tone="bg-blue-50 text-blue-600" /><Stat label="Accepted" value={form.accepted} detail={`${Math.round(form.accepted / form.recipients * 100)}% of recipients`} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-600" /><Stat label="Declined" value={form.declined} detail="Parent decisions" icon={XCircle} tone="bg-red-50 text-red-600" /><Stat label="Pending" value={form.pending} detail={`Deadline ${formatDate(form.deadline)}`} icon={Clock3} tone="bg-amber-50 text-amber-600" /></div>
    <div className="grid gap-6 lg:grid-cols-[1fr_330px]"><section className="rounded-xl border border-[#d8dee8] bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-[#082f61]">Response progress</h2><span className="text-sm font-bold text-[#007c6d]">{Math.round(responseTotal / form.recipients * 100)}% complete</span></div><div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#007c6d]" style={{ width: `${responseTotal / form.recipients * 100}%` }} /></div><div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm"><div><p className="font-extrabold text-emerald-600">{form.accepted}</p><p className="mt-1 text-xs text-slate-500">Accepted</p></div><div><p className="font-extrabold text-red-500">{form.declined}</p><p className="mt-1 text-xs text-slate-500">Declined</p></div><div><p className="font-extrabold text-amber-600">{form.pending}</p><p className="mt-1 text-xs text-slate-500">Pending</p></div></div></section><aside className="rounded-xl border border-[#d8dee8] bg-white p-6 shadow-sm"><h2 className="text-lg font-bold text-[#082f61]">Form details</h2><dl className="mt-4 space-y-4 text-sm"><div><dt className="text-xs font-bold uppercase text-slate-400">Created by</dt><dd className="mt-1 font-semibold text-slate-700">{form.creator}</dd></div><div><dt className="text-xs font-bold uppercase text-slate-400">Created</dt><dd className="mt-1 font-semibold text-slate-700">{formatDate(form.createdAt)}</dd></div><div><dt className="text-xs font-bold uppercase text-slate-400">Deadline</dt><dd className="mt-1 font-semibold text-slate-700">{formatDate(form.deadline)}</dd></div></dl></aside></div>
    <section className="rounded-xl border border-[#d8dee8] bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-[#082f61]">Response monitoring</h2><span className="text-sm font-bold text-[#007c6d]">{responses.length} recipients</span></div><div className="mt-5 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Student</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Responded</th><th className="px-3 py-2">Remarks</th></tr></thead><tbody className="divide-y divide-slate-100">{responses.map((response) => <tr key={response.id}><td className="px-3 py-3 font-medium text-slate-700">{response.studentId}</td><td className="px-3 py-3">{response.status ? <span className={response.status === 'ACCEPTED' ? 'font-bold text-emerald-700' : 'font-bold text-red-600'}>{response.status === 'ACCEPTED' ? 'Accepted' : 'Declined'}</span> : <span className="text-slate-500">Pending</span>}</td><td className="px-3 py-3 text-slate-500">{response.respondedAt ? formatDate(response.respondedAt) : '—'}</td><td className="px-3 py-3 text-slate-500">{response.remarks || '—'}</td></tr>)}</tbody></table></div></section>
  </div>
}

export default function ConsentWorkspace({ role, view = 'overview', formId }: { role: Role; view?: View; formId?: string }) {
  const { user, isInitialized } = useAuth()
  const router = useRouter()
  const [activeView, setActiveView] = useState<View>(view)
  const [forms, setForms] = useState<ConsentForm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!isInitialized) return
    const requiredRole = role === 'teacher' ? 'TEACHER' : 'SCHOOL_ADMIN'
    if (!user) router.replace('/login')
    else if (user.role !== requiredRole) router.replace(roleHome[user.role] ?? '/login')
  }, [isInitialized, role, router, user])
  useEffect(() => {
    if (!isInitialized || !user || view === 'create') return
    let cancelled = false
    const load = formId ? getConsentForm(formId).then((form) => [form]) : getConsentForms()
    load.then((items) => {
      if (!cancelled) {
        setForms(items)
        setError('')
      }
    }).catch((requestError) => {
      if (!cancelled) setError(requestError instanceof Error ? requestError.message : 'Unable to load consent forms.')
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [formId, isInitialized, user, view])
  if (!isInitialized) return <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa] text-sm font-semibold text-[#64748b]">Loading consent workspace…</div>
  if (!user || user.role !== (role === 'teacher' ? 'TEACHER' : 'SCHOOL_ADMIN')) return null
  const selected = forms.find((form) => form.id === formId) ?? forms[0]
  const activeLabel = role === 'teacher' ? 'Teacher' : 'School Admin'
  const activeForms = forms.filter((form) => form.status === 'ACTIVE')
  const pending = forms.reduce((sum, form) => sum + form.pending, 0)
  if (loading && view !== 'create') return <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa] text-sm font-semibold text-[#64748b]">Loading consent forms…</div>
  if (error && view !== 'create') return <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-6 text-center text-sm font-semibold text-red-700">{error}</div>
  return <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#e7f5f2_0,_#f7f9fb_34%,_#f7f8fa_70%)] font-sans text-[#25272c]"><RolePortalChrome userRole={role} /><main className="mx-auto w-full max-w-370 px-4 pb-16 pt-7 sm:px-6 lg:pt-10">
    {activeView !== 'create' && activeView !== 'details' && <div className="relative mb-8 overflow-hidden rounded-3xl bg-[#073b78] px-6 py-7 text-white shadow-[0_18px_45px_rgba(7,59,120,0.18)] sm:px-8"><div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border-[28px] border-white/10" /><div className="absolute -bottom-32 right-24 h-64 w-64 rounded-full bg-[#007c6d]/30 blur-2xl" /><div className="relative flex flex-wrap items-end justify-between gap-6"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-100"><Sparkles size={14} /> {activeLabel} workspace</div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Consent forms</h1><p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">{role === 'teacher' ? 'Create, publish, and monitor permissions for your classes.' : 'Keep your school’s consent requests organised, visible, and easy to action.'}</p></div><Link href={`/consent/${role}/create`} className="relative inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[#073b78] shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"><FilePlus2 size={18} /> Create consent form</Link></div></div>}
    {activeView === 'overview' && <><div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Total forms" value={forms.length} detail={role === 'school-admin' ? 'Across your school' : 'Across your workspace'} icon={ClipboardCheck} tone="bg-blue-50 text-blue-600" /><Stat label="Active forms" value={activeForms.length} detail="Currently collecting responses" icon={CheckCircle2} tone="bg-emerald-50 text-emerald-600" /><Stat label="Pending responses" value={pending} detail="Need parent attention" icon={Clock3} tone="bg-amber-50 text-amber-600" /><Stat label="Due soon" value={forms.filter(isDueSoon).length} detail="Due within the next 7 days" icon={CalendarDays} tone="bg-violet-50 text-violet-600" /></div><div className="mb-6 flex gap-5 border-b border-slate-200"><button onClick={() => setActiveView('overview')} className="border-b-2 border-[#007c6d] px-1 pb-3 text-sm font-extrabold text-[#007c6d]">Overview</button><button onClick={() => setActiveView('forms')} className="px-1 pb-3 text-sm font-bold text-slate-500 transition hover:text-[#003b78]">All forms <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs">{forms.length}</span></button></div><div className="grid gap-6 lg:grid-cols-[1fr_320px]"><section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_10px_35px_rgba(15,47,97,0.06)]"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-black text-[#003b78]">Recent forms</h2><p className="mt-1 text-sm text-slate-500">Your latest consent activity</p></div><button onClick={() => setActiveView('forms')} className="inline-flex items-center gap-1 text-sm font-extrabold text-[#007c6d] transition hover:gap-2">View all <ArrowRight size={16} /></button></div><div className="divide-y divide-slate-100">{forms.slice(0, 3).map((form) => <Link key={form.id} href={`/consent/${role}/${form.id}`} className="flex items-center justify-between gap-4 rounded-xl py-4 first:pt-1 hover:bg-[#f5fbfa]"><div className="min-w-0 pl-2"><p className="truncate font-bold text-[#003b78]">{form.title}</p><p className="mt-1 text-xs text-slate-500">{form.audience} · Due {formatDate(form.deadline)}</p></div><Progress form={form} /></Link>)}</div></section><aside className="relative overflow-hidden rounded-2xl bg-[#073b78] p-6 text-white shadow-[0_14px_35px_rgba(7,59,120,0.18)]"><div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[18px] border-white/10" /><div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/15"><ClipboardCheck size={21} /></div><h2 className="relative mt-5 text-xl font-black">Make every response count</h2><p className="relative mt-2 text-sm leading-6 text-blue-100">Clear details and realistic deadlines help families respond on time.</p><Link href={`/consent/${role}/create`} className="relative mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-[#073b78] transition hover:-translate-y-0.5 hover:bg-blue-50">Start a form <ArrowRight size={16} /></Link></aside></div><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]"><section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_10px_35px_rgba(15,47,97,0.06)]"><div className="flex items-center justify-between"><div><h2 className="text-lg font-black text-[#003b78]">Response snapshot</h2><p className="mt-1 text-sm text-slate-500">How families are responding across active forms</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700">Live overview</span></div><div className="mt-5 space-y-4">{[{ label: 'Accepted', value: forms.reduce((sum, form) => sum + form.accepted, 0), color: 'bg-[#007c6d]' }, { label: 'Declined', value: forms.reduce((sum, form) => sum + form.declined, 0), color: 'bg-red-500' }, { label: 'Awaiting response', value: pending, color: 'bg-amber-400' }].map((item) => <div key={item.label}><div className="mb-1 flex justify-between text-xs font-bold text-slate-500"><span>{item.label}</span><span>{item.value}</span></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.min(100, (item.value / Math.max(1, pending + item.value)) * 100)}%` }} /></div></div>)}</div></section><aside className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_10px_35px_rgba(15,47,97,0.06)]"><div className="flex items-center gap-2"><CalendarDays size={18} className="text-[#007c6d]" /><h2 className="text-lg font-black text-[#003b78]">Keep forms moving</h2></div><p className="mt-3 text-sm leading-6 text-slate-500">Review pending responses and send reminders before deadlines.</p><button onClick={() => setActiveView('forms')} className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold text-[#007c6d] transition hover:gap-2">Review all forms <ArrowRight size={16} /></button></aside></div></>}
    {activeView === 'forms' && <FormTable forms={forms} role={role} />}
    {activeView === 'create' && <CreateForm role={role} onCreated={(form) => { setForms((current) => [form, ...current]); router.push(`/consent/${role}/${form.id}`) }} />}
    {activeView === 'details' && selected && <Detail form={selected} role={role} onUpdated={(updated) => setForms((current) => current.map((item) => item.id === updated.id ? updated : item))} />}
  </main></div>
}
