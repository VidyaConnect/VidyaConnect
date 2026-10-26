"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LinkStatus,
  ParentLinkRequest,
  getLinkRequests,
  reviewLinkRequest,
} from "../services/parentRequests.service";
/* ---------- icons (inline, no extra packages) ---------- */

const ICONS = {
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  search: "M21 21l-4.3-4.3M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  back: "M15 18l-6-6 6-6",
  undo: "M3 7v6h6M3 13a9 9 0 1 0 3-7.7L3 8",
  inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  alert: "M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01",
  link: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",
  sparkle: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z",
} as const;

function Icon({ name, className = "h-4 w-4" }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

/* ---------- verification logic ---------- */

type CheckResult = "match" | "close" | "mismatch" | "missing";
interface Check { label: string; entered: string; record: string; result: CheckResult }

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
const digits = (s: string) => s.replace(/\D/g, "").slice(-9);

function compareName(a: string, b: string): CheckResult {
  const x = norm(a), y = norm(b);
  if (x === y) return "match";
  const tx = x.split(" "), ty = y.split(" ");
  const shared = tx.filter((t) => ty.includes(t)).length;
  return shared / Math.min(tx.length, ty.length) >= 0.5 ? "close" : "mismatch";
}

function buildChecks(r: ParentLinkRequest): Check[] {
  const rec = r.record;
  const eq = (a: string, b?: string): CheckResult => (!rec || b === undefined ? "missing" : norm(a) === norm(b) ? "match" : "mismatch");
  return [
    { label: "Student name", entered: r.entered.studentName, record: rec?.name ?? "—", result: rec ? compareName(r.entered.studentName, rec.name) : "missing" },
    { label: "Admission no.", entered: r.entered.admissionNo, record: rec?.admissionNo ?? "—", result: eq(r.entered.admissionNo, rec?.admissionNo) },
    { label: "Class", entered: r.entered.grade, record: rec?.grade ?? "—", result: eq(r.entered.grade, rec?.grade) },
    { label: "Date of birth", entered: fmtDate(r.entered.dob), record: rec ? fmtDate(rec.dob) : "—", result: eq(r.entered.dob, rec?.dob) },
    {
      label: "Parent phone",
      entered: r.parent.phone,
      record: rec?.guardianPhone ?? "—",
      result: !rec ? "missing" : digits(r.parent.phone) === digits(rec.guardianPhone) ? "match" : "mismatch",
    },
  ];
}

type Verdict = "strong" | "check" | "weak" | "notfound";

function getVerdict(r: ParentLinkRequest, checks: Check[]): Verdict {
  if (!r.record) return "notfound";
  if (checks.some((c) => c.result === "mismatch")) {
    return checks.filter((c) => c.result === "mismatch").length >= 2 ? "weak" : "check";
  }
  return checks.every((c) => c.result === "match") ? "strong" : "check";
}

const VERDICT_META: Record<Verdict, { label: string; hint: string; chip: string; box: string; stripe: string }> = {
  strong: { label: "All details match", hint: "Everything the parent entered matches the school record.", chip: "bg-emerald-100 text-emerald-800", box: "border-emerald-200 bg-emerald-50 text-emerald-900", stripe: "bg-emerald-500" },
  check: { label: "Check one detail", hint: "Mostly matching, but one detail needs your eyes.", chip: "bg-amber-100 text-amber-900", box: "border-amber-200 bg-amber-50 text-amber-900", stripe: "bg-amber-400" },
  weak: { label: "Details don’t match", hint: "Several details differ from the school record. Be careful.", chip: "bg-rose-100 text-rose-800", box: "border-rose-200 bg-rose-50 text-rose-900", stripe: "bg-rose-500" },
  notfound: { label: "No student found", hint: "No student with this admission number exists in the school records.", chip: "bg-slate-200 text-slate-700", box: "border-slate-300 bg-slate-100 text-slate-800", stripe: "bg-slate-400" },
};

const RESULT_STYLE: Record<CheckResult, { icon: keyof typeof ICONS; cls: string; text: string }> = {
  match: { icon: "check", cls: "bg-emerald-100 text-emerald-700", text: "Matches" },
  close: { icon: "alert", cls: "bg-amber-100 text-amber-700", text: "Close" },
  mismatch: { icon: "x", cls: "bg-rose-100 text-rose-700", text: "Different" },
  missing: { icon: "alert", cls: "bg-slate-100 text-slate-500", text: "No record" },
};

const STATUS_META: Record<LinkStatus, { label: string; badge: string }> = {
  pending: { label: "Needs review", badge: "bg-amber-100 text-amber-900" },
  approved: { label: "Approved", badge: "bg-emerald-100 text-emerald-900" },
  rejected: { label: "Rejected", badge: "bg-rose-100 text-rose-900" },
};

const REJECT_REASONS = [
  "These details don’t match our records. Please check and apply again.",
  "I can’t find this student in my class. Please check the admission number.",
  "I couldn’t confirm your relationship. Please visit the school office with your ID.",
  "A request for this student already exists.",
];
const APPROVE_NOTES = ["Approved. Welcome!", "Approved. Please keep your login private."];

const AVATAR_COLORS = ["bg-[#0b3a75]", "bg-[#007c6d]", "bg-indigo-600", "bg-rose-600", "bg-amber-600"];
const avatarColor = (name: string) => AVATAR_COLORS[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % AVATAR_COLORS.length];
const initials = (name: string) => name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
function waitLabel(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

type Tab = LinkStatus;
interface UndoState { entries: { id: string; prevStatus: LinkStatus; prevNote?: string }[]; message: string }

/* ---------- component ---------- */

export default function ParentLinkRequestsBoard() {
  const [items, setItems] = useState<ParentLinkRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("pending");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false); // mobile only
  const [note, setNote] = useState("");
  const [mode, setMode] = useState<"idle" | "rejecting">("idle");
  const [needsReason, setNeedsReason] = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [undo, setUndo] = useState<UndoState | null>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getLinkRequests().then((data) => {
      setItems(data);
      setSelectedId(data.find((r) => r.status === "pending")?.id ?? null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!undo) return;
    const t = setTimeout(() => setUndo(null), 8000);
    return () => clearTimeout(t);
  }, [undo]);

  const analysed = useMemo(
    () => items.map((r) => { const checks = buildChecks(r); return { r, checks, verdict: getVerdict(r, checks) }; }),
    [items]
  );

  const count = (s: LinkStatus) => items.filter((r) => r.status === s).length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return analysed
      .filter(({ r }) => r.status === tab)
      .filter(({ r }) => !q || [r.parent.name, r.entered.studentName, r.entered.admissionNo, r.parent.phone].some((t) => t.toLowerCase().includes(q)))
      .sort((a, b) => (tab === "pending" ? a.r.submittedAt.localeCompare(b.r.submittedAt) : b.r.submittedAt.localeCompare(a.r.submittedAt)));
  }, [analysed, tab, query]);

  const current = analysed.find((a) => a.r.id === selectedId) ?? null;
  const strongPending = analysed.filter((a) => a.r.status === "pending" && a.verdict === "strong");

  const resetPanel = () => { setNote(""); setMode("idle"); setNeedsReason(false); };

  const select = (id: string) => { setSelectedId(id); resetPanel(); setShowDetail(true); };

  const changeTab = (t: Tab) => {
    setTab(t);
    setBulkConfirm(false);
    const first = analysed.filter((a) => a.r.status === t).sort((a, b) => a.r.submittedAt.localeCompare(b.r.submittedAt))[0];
    setSelectedId(first?.r.id ?? null);
    resetPanel();
    setShowDetail(false);
  };

  const apply = (ids: string[], next: LinkStatus, reviewNote?: string) =>
    setItems((prev) => prev.map((r) => (ids.includes(r.id) ? { ...r, status: next, reviewNote, linkedParents: next === "approved" ? r.linkedParents + 1 : r.linkedParents } : r)));

  const decide = async (next: "approved" | "rejected") => {
    if (!current || busy) return;
    const text = note.trim();
    if (next === "rejected" && !text) {
      setMode("rejecting");
      setNeedsReason(true);
      noteRef.current?.focus();
      return;
    }
    const { r } = current;
    setBusy(true);
    await reviewLinkRequest(r.id, next, text || undefined);
    apply([r.id], next, text || undefined);
    setUndo({
      entries: [{ id: r.id, prevStatus: r.status, prevNote: r.reviewNote }],
      message: next === "approved" ? `${r.parent.name} is now linked to ${r.entered.studentName}` : `Rejected ${r.parent.name}’s request`,
    });
    const nextPending = visible.find((v) => v.r.id !== r.id)?.r.id ?? null;
    setSelectedId(nextPending);
    if (!nextPending) setShowDetail(false);
    resetPanel();
    setBusy(false);
  };

  const approveAllStrong = async () => {
    if (!strongPending.length) return;
    setBusy(true);
    const ids = strongPending.map((a) => a.r.id);
    await Promise.all(ids.map((id) => reviewLinkRequest(id, "approved")));
    apply(ids, "approved");
    setUndo({
      entries: strongPending.map((a) => ({ id: a.r.id, prevStatus: "pending" as LinkStatus })),
      message: `Approved ${ids.length} verified ${ids.length === 1 ? "request" : "requests"}`,
    });
    setBulkConfirm(false);
    if (ids.includes(selectedId ?? "")) setSelectedId(null);
    setBusy(false);
  };

  const undoLast = async () => {
    if (!undo) return;
    await Promise.all(undo.entries.map((e) => reviewLinkRequest(e.id, e.prevStatus, e.prevNote)));
    setItems((prev) =>
      prev.map((r) => {
        const e = undo.entries.find((x) => x.id === r.id);
        return e ? { ...r, status: e.prevStatus, reviewNote: e.prevNote, linkedParents: r.status === "approved" ? r.linkedParents - 1 : r.linkedParents } : r;
      })
    );
    setTab("pending");
    setSelectedId(undo.entries[0].id);
    setUndo(null);
  };

  const pending = count("pending");
  const handled = items.length - pending;
  const progress = items.length ? Math.round((handled / items.length) * 100) : 0;

  const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007c6d] focus-visible:ring-offset-2";

  const tabs: { key: Tab; label: string; num: string; ring: string }[] = [
    { key: "pending", label: "Needs review", num: "text-amber-600", ring: "ring-amber-400" },
    { key: "approved", label: "Approved", num: "text-emerald-600", ring: "ring-emerald-500" },
    { key: "rejected", label: "Rejected", num: "text-rose-600", ring: "ring-rose-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#0b3a75] to-[#0e5a8f] p-6 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Icon name="link" className="h-6 w-6" /> Parent link requests
          </h1>
          <p className="mt-1 max-w-xl text-sm text-blue-100">
            {loading
              ? "Loading requests…"
              : pending === 0
              ? "You’re all caught up. No parents are waiting for access."
              : `${pending} ${pending === 1 ? "parent wants" : "parents want"} to see their child’s details. Check each request against our records.`}
          </p>
        </div>
        <div className="w-full sm:w-64">
          <div className="mb-1.5 flex justify-between text-xs text-blue-100">
            <span>Reviewed</span>
            <span>{handled} of {items.length}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/20" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Requests reviewed">
            <div className="h-full rounded-full bg-emerald-300 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Tabs as stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => changeTab(t.key)} aria-pressed={active}
              className={`rounded-xl bg-white p-4 text-left shadow-sm transition ${focusRing} ${active ? `ring-2 ${t.ring}` : "ring-1 ring-slate-200 hover:ring-slate-300"}`}>
              <p className="text-sm text-slate-500">{t.label}</p>
              <p className={`mt-1 text-3xl font-bold ${t.num}`}>{count(t.key)}</p>
            </button>
          );
        })}
      </div>

      {/* Quick approve banner */}
      {tab === "pending" && strongPending.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Icon name="sparkle" />
            </span>
            <div>
              <p className="font-semibold text-emerald-900">
                {strongPending.length} {strongPending.length === 1 ? "request matches" : "requests match"} the school records perfectly
              </p>
              <p className="text-sm text-emerald-800">Name, admission number, class, birthday and phone all agree.</p>
            </div>
          </div>
          {bulkConfirm ? (
            <div className="flex gap-2">
              <button onClick={approveAllStrong} disabled={busy} className={`rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 ${focusRing}`}>
                Yes, approve {strongPending.length}
              </button>
              <button onClick={() => setBulkConfirm(false)} className={`rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-800 ${focusRing}`}>
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setBulkConfirm(true)} className={`rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 ${focusRing}`}>
              Approve all verified
            </button>
          )}
        </div>
      )}

      {/* Search */}
      <label className="relative block">
        <span className="sr-only">Search requests</span>
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="search" /></span>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by parent, student, admission no. or phone"
          className={`w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm ${focusRing}`} />
      </label>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* List */}
        <div className={`space-y-3 lg:col-span-2 lg:max-h-[calc(100vh-22rem)] lg:overflow-y-auto lg:pr-1 ${showDetail ? "hidden lg:block" : ""}`}>
          {loading && [0, 1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-200/70" />)}

          {!loading && visible.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Icon name="inbox" className="h-6 w-6" /></div>
              <p className="mt-3 font-semibold text-slate-800">{tab === "pending" && !query ? "All caught up" : "Nothing to show"}</p>
              <p className="mt-1 text-sm text-slate-500">
                {tab === "pending" && !query ? "New requests from parents will appear here." : "Try another tab or search word."}
              </p>
            </div>
          )}

          {visible.map(({ r, verdict }) => {
            const isSel = r.id === selectedId;
            const v = VERDICT_META[verdict];
            return (
              <button key={r.id} onClick={() => select(r.id)} aria-current={isSel}
                className={`relative w-full overflow-hidden rounded-xl bg-white p-4 pl-5 text-left shadow-sm transition ${focusRing} ${isSel ? "ring-2 ring-[#0b3a75]" : "ring-1 ring-slate-200 hover:ring-slate-300"}`}>
                <span className={`absolute inset-y-0 left-0 w-1.5 ${r.status === "pending" ? v.stripe : r.status === "approved" ? "bg-emerald-500" : "bg-rose-500"}`} aria-hidden="true" />
                <div className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColor(r.parent.name)}`}>{initials(r.parent.name)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{r.parent.name}</p>
                    <p className="truncate text-xs text-slate-500">{r.parent.relationship} of {r.entered.studentName}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-500">{waitLabel(r.submittedAt)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-600">{r.entered.admissionNo} · {r.entered.grade}</span>
                  {r.status === "pending" ? (
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${v.chip}`}>{v.label}</span>
                  ) : (
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_META[r.status].badge}`}>{STATUS_META[r.status].label}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div className={`lg:col-span-3 ${showDetail ? "" : "hidden lg:block"}`}>
          {!current ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100"><Icon name="inbox" className="h-6 w-6" /></div>
              <p className="mt-3 font-semibold text-slate-800">Pick a request</p>
              <p className="mt-1 text-sm">Choose one from the list to check the details.</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-24">
              <button onClick={() => setShowDetail(false)} className={`mb-4 inline-flex items-center gap-1 rounded-md text-sm font-medium text-[#0b3a75] lg:hidden ${focusRing}`}>
                <Icon name="back" /> Back to list
              </button>

              {/* Parent */}
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-bold text-white ${avatarColor(current.r.parent.name)}`}>{initials(current.r.parent.name)}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{current.r.parent.name}</p>
                  <p className="flex flex-wrap items-center gap-x-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1"><Icon name="user" className="h-3.5 w-3.5" />{current.r.parent.relationship}</span>
                    <a href={`tel:${current.r.parent.phone}`} className="inline-flex items-center gap-1 hover:text-[#0b3a75]"><Icon name="phone" className="h-3.5 w-3.5" />{current.r.parent.phone}</a>
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_META[current.r.status].badge}`}>{STATUS_META[current.r.status].label}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">Sent {fmtDate(current.r.submittedAt)} ({waitLabel(current.r.submittedAt).toLowerCase()}) from the mobile app</p>

              {/* Verdict */}
              <div className={`mt-5 flex items-start gap-3 rounded-xl border p-4 ${VERDICT_META[current.verdict].box}`}>
                <Icon name={current.verdict === "strong" ? "shield" : "alert"} className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">{VERDICT_META[current.verdict].label}</p>
                  <p className="text-sm opacity-90">{VERDICT_META[current.verdict].hint}</p>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                <div className="grid grid-cols-[1fr_1fr_1fr] bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid-cols-[1.1fr_1.2fr_1.2fr_auto]">
                  <span>Detail</span>
                  <span>Parent entered</span>
                  <span>School record</span>
                  <span className="hidden sm:block">Result</span>
                </div>
                {current.checks.map((c) => {
                  const s = RESULT_STYLE[c.result];
                  return (
                    <div key={c.label} className={`grid grid-cols-[1fr_1fr_1fr] items-center gap-2 border-t border-slate-100 px-4 py-3 text-sm sm:grid-cols-[1.1fr_1.2fr_1.2fr_auto] ${c.result === "mismatch" ? "bg-rose-50/50" : ""}`}>
                      <span className="text-slate-500">{c.label}</span>
                      <span className="font-medium text-slate-900">{c.entered}</span>
                      <span className="flex items-center gap-2 font-medium text-slate-900">
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full sm:hidden ${s.cls}`} title={s.text}><Icon name={s.icon} className="h-3 w-3" /></span>
                        {c.record}
                      </span>
                      <span className={`hidden items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold sm:inline-flex ${s.cls}`}>
                        <Icon name={s.icon} className="h-3 w-3" />{s.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {current.r.linkedParents > 0 && (
                <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <Icon name="link" className="h-4 w-4 text-slate-400" />
                  {current.r.linkedParents} {current.r.linkedParents === 1 ? "parent is" : "parents are"} already linked to this student.
                </p>
              )}

              {current.r.parentNote && (
                <div className="mt-4 rounded-2xl rounded-tl-sm bg-slate-100 p-4 text-sm leading-relaxed text-slate-800">
                  <p className="mb-1 text-xs font-semibold text-slate-500">Note from parent</p>
                  {current.r.parentNote}
                </div>
              )}

              {/* Review result */}
              {current.r.status !== "pending" && (
                <div className={`mt-4 rounded-xl p-4 text-sm ${current.r.status === "approved" ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"}`}>
                  <p className="font-semibold">
                    You {current.r.status} this request{current.r.reviewedAt ? ` on ${fmtDate(current.r.reviewedAt)}` : ""}
                  </p>
                  {current.r.reviewNote ? <p className="mt-1">“{current.r.reviewNote}”</p> : <p className="mt-1 opacity-80">No message was sent.</p>}
                  <button
                    onClick={async () => {
                      await reviewLinkRequest(current.r.id, "pending");
                      setItems((p) => p.map((r) => r.id === current.r.id ? { ...r, status: "pending", reviewNote: undefined, linkedParents: r.status === "approved" ? r.linkedParents - 1 : r.linkedParents } : r));
                      setTab("pending");
                    }}
                    className={`mt-3 inline-flex items-center gap-1.5 rounded-md text-xs font-semibold underline-offset-2 hover:underline ${focusRing}`}
                  >
                    <Icon name="undo" className="h-3.5 w-3.5" /> Move back to review
                  </button>
                </div>
              )}

              {/* Actions */}
              {current.r.status === "pending" && (
                <div className="mt-6 border-t border-slate-100 pt-5">
                  {mode === "rejecting" && (
                    <>
                      <p className="mb-2 text-sm font-medium text-slate-700">Why are you rejecting? The parent will see this.</p>
                      <div className="flex flex-wrap gap-2">
                        {REJECT_REASONS.map((t) => (
                          <button key={t} onClick={() => { setNote(t); setNeedsReason(false); }}
                            className={`rounded-full border px-3 py-1.5 text-left text-xs transition ${focusRing} ${note === t ? "border-rose-400 bg-rose-50 text-rose-800" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-rose-300"}`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {mode === "idle" && (
                    <>
                      <p className="mb-2 text-sm font-medium text-slate-700">Add a message (optional)</p>
                      <div className="flex flex-wrap gap-2">
                        {APPROVE_NOTES.map((t) => (
                          <button key={t} onClick={() => setNote(t)} className={`rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 ${focusRing}`}>{t}</button>
                        ))}
                      </div>
                    </>
                  )}

                  <label className="mt-3 block">
                    <span className="sr-only">Message to parent</span>
                    <textarea ref={noteRef} value={note} rows={2} maxLength={250}
                      onChange={(e) => { setNote(e.target.value); if (e.target.value.trim()) setNeedsReason(false); }}
                      placeholder={mode === "rejecting" ? "Pick a reason above or write your own." : "Write a short message to the parent."}
                      className={`w-full rounded-xl border p-3 text-sm ${focusRing} ${needsReason ? "border-rose-400 bg-rose-50" : "border-slate-200"}`} />
                  </label>
                  <div className="mt-1 flex justify-between text-xs">
                    <span className={needsReason ? "font-medium text-rose-600" : "text-slate-500"}>{needsReason ? "A reason is needed to reject." : "Sent to the parent’s phone."}</span>
                    <span className="text-slate-400">{note.length}/250</span>
                  </div>

                  {current.verdict !== "strong" && mode === "idle" && (
                    <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      Not every detail matches. If you are unsure, call the parent or ask them to visit the school office before approving.
                    </p>
                  )}

                  <div className="mt-4 flex gap-3">
                    <button onClick={() => decide("approved")} disabled={busy}
                      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 ${focusRing}`}>
                      <Icon name="check" /> Approve link
                    </button>
                    <button onClick={() => decide("rejected")} disabled={busy}
                      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60 ${focusRing}`}>
                      <Icon name="x" /> Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Undo toast */}
      {undo && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-xl bg-slate-900 px-5 py-3 text-sm text-white shadow-lg">
          <span>{undo.message}</span>
          <button onClick={undoLast} className={`inline-flex items-center gap-1.5 rounded-md font-semibold text-emerald-300 hover:text-emerald-200 ${focusRing}`}>
            <Icon name="undo" className="h-3.5 w-3.5" /> Undo
          </button>
        </div>
      )}
    </div>
  );
}