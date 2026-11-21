"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MessageSquareMore, X, XCircle } from "lucide-react";
import type { DecisionInput, SchoolRequest } from "../types/school-request.types";

export type DecisionMode = "approve" | "reject" | "info";

const REASONS = ["Invalid documents", "Duplicate registration", "Unverifiable school", "Incomplete information", "Other"];
const INFO_ITEMS = ["Registration certificate", "Authorization letter", "Admin ID proof", "Official school email", "Correct address"];

const META = {
  approve: { title: "Approve registration", cta: "Approve school", icon: CheckCircle2, btn: "bg-emerald-600 hover:bg-emerald-700", tint: "text-emerald-600" },
  reject: { title: "Reject registration", cta: "Reject request", icon: XCircle, btn: "bg-red-600 hover:bg-red-700", tint: "text-red-600" },
  info: { title: "Ask for more information", cta: "Send request", icon: MessageSquareMore, btn: "bg-[#0B3D7A] hover:bg-[#093263]", tint: "text-[#0B3D7A]" },
} as const;

interface Props {
  mode: DecisionMode;
  request: SchoolRequest;
  onClose: () => void;
  onSubmit: (input: DecisionInput) => Promise<void>;
}

export default function DecisionModal({ mode, request, onClose, onSubmit }: Props) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [notify, setNotify] = useState(true);
  const [items, setItems] = useState<string[]>([]);
  const meta = META[mode];
  const Icon = meta.icon;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  const valid = mode === "approve" || (mode === "reject" ? !!reason && !!comment.trim() : !!message.trim() || items.length > 0);

  async function submit() {
    if (!valid || busy) return;
    setBusy(true);
    try {
      await onSubmit(
        mode === "approve" ? { type: "approve", message: message.trim() || undefined, sendEmail }
        : mode === "reject" ? { type: "reject", reason, comment: comment.trim(), notify }
        : { type: "info", message: message.trim(), items },
      );
    } finally {
      setBusy(false);
    }
  }

  const field = "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#0B3D7A] focus:ring-2 focus:ring-[#0B3D7A]/20";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4" onMouseDown={() => !busy && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="decision-title" onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 ${meta.tint}`} aria-hidden />
            <div>
              <h2 id="decision-title" className="text-lg font-bold text-slate-900">{meta.title}</h2>
              <p className="text-sm text-slate-500">{request.schoolName}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-4 p-5">
          {mode === "approve" && (
            <>
              <p className="text-sm text-slate-600">
                This creates the school on VidyaConnect and gives {request.adminName} access as school admin.
              </p>
              <label className="block text-sm font-medium text-slate-700">Welcome message (optional)
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className={`${field} mt-1.5`} placeholder="Welcome to VidyaConnect." />
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="h-4 w-4 accent-[#0B3D7A]" />
                Email onboarding instructions to {request.adminEmail}
              </label>
            </>
          )}

          {mode === "reject" && (
            <>
              <label className="block text-sm font-medium text-slate-700">Reason
                <select value={reason} onChange={(e) => setReason(e.target.value)} className={`${field} mt-1.5`}>
                  <option value="">Choose a reason</option>
                  {REASONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">Explain the decision
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className={`${field} mt-1.5`} placeholder="The applicant will see this message." />
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="h-4 w-4 accent-[#0B3D7A]" />
                Notify the applicant by email
              </label>
            </>
          )}

          {mode === "info" && (
            <>
              <fieldset>
                <legend className="text-sm font-medium text-slate-700">What do you need?</legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {INFO_ITEMS.map((it) => (
                    <label key={it} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
                      <input type="checkbox" checked={items.includes(it)} className="h-4 w-4 accent-[#0B3D7A]"
                        onChange={() => setItems((p) => (p.includes(it) ? p.filter((x) => x !== it) : [...p, it]))} />
                      {it}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="block text-sm font-medium text-slate-700">Message
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className={`${field} mt-1.5`} placeholder="Tell the applicant what to fix or upload." />
              </label>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 p-5">
          <button onClick={onClose} disabled={busy} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
          <button onClick={submit} disabled={!valid || busy} className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${meta.btn}`}>
            {busy ? "Saving..." : meta.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
