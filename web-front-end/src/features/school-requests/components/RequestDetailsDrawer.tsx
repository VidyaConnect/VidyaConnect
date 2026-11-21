"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, FileText, Lock, X } from "lucide-react";
import type { SchoolRequest } from "../types/school-request.types";
import { formatDateTime, initials } from "../utils";
import ActivityTimeline from "./ActivityTimeline";
import type { DecisionMode } from "./DecisionModal";
import RequestStatusBadge from "./RequestStatusBadge";

const CHECKS = ["Documents match the school details", "Registration number is valid", "Applicant email is verified"];

interface Props {
  request: SchoolRequest;
  onClose: () => void;
  onDecision: (mode: DecisionMode) => void;
  onAddNote: (text: string) => Promise<void>;
}

const Row = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="flex justify-between gap-4 py-2 text-sm">
    <dt className="text-slate-500">{label}</dt>
    <dd className="text-right font-medium text-slate-900">{value || "Not provided"}</dd>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="border-t border-slate-100 px-6 py-5">
    <h3 className="mb-2 text-sm font-bold text-slate-900">{title}</h3>
    {children}
  </section>
);

export default function RequestDetailsDrawer({ request: r, onClose, onDecision, onAddNote }: Props) {
  const [checked, setChecked] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const final = r.status === "approved" || r.status === "rejected";
  const allChecked = checked.length === CHECKS.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function saveNote() {
    if (!note.trim()) return;
    setSavingNote(true);
    try {
      await onAddNote(note.trim());
      setNote("");
    } finally {
      setSavingNote(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" onMouseDown={onClose}>
      <aside role="dialog" aria-modal="true" aria-label={`Request from ${r.schoolName}`} onMouseDown={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B3D7A] text-sm font-bold text-white">{initials(r.schoolName)}</span>
            <div>
              <h2 className="text-lg font-bold leading-tight text-slate-900">{r.schoolName}</h2>
              <p className="text-xs text-slate-500">{r.id}, submitted {formatDateTime(r.submittedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RequestStatusBadge status={r.status} />
            <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {r.duplicateOf && !final && (
            <div className="mx-6 mb-4 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <p>This school looks similar to <strong>{r.duplicateOf}</strong>, which is already on the platform. Compare the address and registration number before you decide.</p>
            </div>
          )}

          <Section title="School">
            <dl className="divide-y divide-slate-100">
              <Row label="Type" value={r.type} />
              <Row label="Address" value={`${r.address}, ${r.district}, ${r.country}`} />
              <Row label="Phone" value={r.phone} />
              <Row label="Official email" value={r.officialEmail} />
              <Row label="Website" value={r.website} />
              <Row label="Students / teachers" value={`${r.students.toLocaleString()} / ${r.teachers}`} />
              <Row label="Registration number" value={r.registrationNumber} />
            </dl>
          </Section>

          <Section title="Applicant">
            <dl className="divide-y divide-slate-100">
              <Row label="Name" value={r.adminName} />
              <Row label="Designation" value={r.adminDesignation} />
              <Row label="Email" value={r.adminEmail} />
              <Row label="Phone" value={r.adminPhone} />
            </dl>
          </Section>

          <Section title={`Documents (${r.documents.length})`}>
            {r.documents.length === 0 ? (
              <p className="text-sm text-slate-500">No documents uploaded.</p>
            ) : (
              <ul className="space-y-2">
                {r.documents.map((d) => (
                  <li key={d.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5">
                    <span className="flex items-center gap-2 text-sm text-slate-800"><FileText className="h-4 w-4 text-slate-400" aria-hidden />{d.name}</span>
                    <span className="text-xs text-slate-500">{d.sizeKb} KB</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {!final && (
            <Section title="Verification checklist">
              <div className="space-y-2">
                {CHECKS.map((c) => (
                  <label key={c} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <input type="checkbox" className="h-4 w-4 accent-[#0B3D7A]" checked={checked.includes(c)}
                      onChange={() => setChecked((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]))} />
                    {c}
                  </label>
                ))}
              </div>
            </Section>
          )}

          <Section title="Internal notes">
            <p className="mb-3 flex items-center gap-1.5 text-xs text-slate-500"><Lock className="h-3 w-3" aria-hidden />Only platform admins can see these.</p>
            <ul className="mb-3 space-y-2">
              {r.notes.map((n) => (
                <li key={n.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {n.text}<span className="mt-1 block text-xs text-slate-500">{n.by}, {formatDateTime(n.at)}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveNote()} placeholder="Add a note"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0B3D7A] focus:ring-2 focus:ring-[#0B3D7A]/20" />
              <button onClick={saveNote} disabled={!note.trim() || savingNote} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Add</button>
            </div>
          </Section>

          <Section title="Activity"><ActivityTimeline entries={r.timeline} /></Section>
        </div>

        <footer className="border-t border-slate-200 bg-white px-6 py-4">
          {final ? (
            <p className="text-center text-sm text-slate-500">This request is {r.status}. Decisions can't be changed.</p>
          ) : (
            <>
              {!allChecked && <p className="mb-3 text-xs text-slate-500">Complete the checklist to enable approval.</p>}
              <div className="flex gap-3">
                <button onClick={() => onDecision("reject")} className="flex-1 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50">Reject</button>
                <button onClick={() => onDecision("info")} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Ask for info</button>
                <button onClick={() => onDecision("approve")} disabled={!allChecked} className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40">Approve</button>
              </div>
            </>
          )}
        </footer>
      </aside>
    </div>
  );
}
