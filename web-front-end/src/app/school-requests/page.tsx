"use client";

import { useCallback, useState } from "react";
import { Download } from "lucide-react";
import RolePortalChrome from "../../components/RolePortalChrome";
import { useSchoolRequests } from "../../features/school-requests/hooks/useSchoolRequests";
import RequestStats from "../../features/school-requests/components/RequestStats";
import RequestFilters from "../../features/school-requests/components/RequestFilters";
import RequestsTable from "../../features/school-requests/components/RequestsTable";
import RequestDetailsDrawer from "../../features/school-requests/components/RequestDetailsDrawer";
import DecisionModal, { type DecisionMode } from "../../features/school-requests/components/DecisionModal";
import Toast, { type ToastState } from "../../features/school-requests/components/Toast";
import type { DecisionInput, SchoolRequest } from "../../features/school-requests/types/school-request.types";

const DONE_TEXT = { approve: "approved", reject: "rejected", info: "marked as needing more information" } as const;

export default function SchoolRequestsPage() {
  const h = useSchoolRequests();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ mode: DecisionMode; id: string } | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

  const selected = h.requests.find((r) => r.id === selectedId) ?? null;
  const modalRequest = modal ? h.requests.find((r) => r.id === modal.id) ?? null : null;

  async function openRequest(r: SchoolRequest) {
    setSelectedId(r.id);
    if (r.status === "pending") await h.startReview(r.id).catch(() => undefined);
  }

  async function handleDecision(input: DecisionInput) {
    if (!modalRequest) return;
    try {
      await h.decide(modalRequest.id, input);
      setToast({ kind: "success", text: `${modalRequest.schoolName} ${DONE_TEXT[input.type]}.` });
      setModal(null);
    } catch {
      setToast({ kind: "error", text: "That didn't save. Try again." });
    }
  }

  async function handleNote(text: string) {
    if (!selected) return;
    try {
      await h.addNote(selected.id, text);
    } catch {
      setToast({ kind: "error", text: "Couldn't save the note. Try again." });
    }
  }

  function exportCsv() {
    const head = ["ID", "School", "Type", "Applicant", "Email", "District", "Students", "Status", "Submitted"];
    const rows = h.filtered.map((r) => [r.id, r.schoolName, r.type, r.adminName, r.adminEmail, r.district, r.students, r.status, r.submittedAt]);
    const csv = [head, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "school-requests.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <>
    <RolePortalChrome userRole="admin" />
    <main className="mx-auto w-full max-w-[1480px] px-6 pb-8 pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B3D7A]">School requests</h1>
          <p className="mt-1 text-sm text-slate-500">Review schools that want to join VidyaConnect, then approve or reject them.</p>
        </div>
        <button onClick={exportCsv} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <Download className="h-4 w-4" aria-hidden /> Export CSV
        </button>
      </div>

      <div className="space-y-6">
        <RequestStats stats={h.stats} active={h.status} onSelect={h.setStatus} />
        <RequestFilters search={h.search} onSearch={h.setSearch} status={h.status} onStatus={h.setStatus} type={h.type} onType={h.setType} counts={h.counts} />
        <RequestsTable rows={h.filtered} loading={h.loading} error={h.error} onRetry={h.reload}
          onReview={openRequest} onReject={(r) => setModal({ mode: "reject", id: r.id })} />
      </div>

      {selected && (
        <RequestDetailsDrawer key={selected.id} request={selected} onClose={() => setSelectedId(null)}
          onDecision={(mode) => setModal({ mode, id: selected.id })} onAddNote={handleNote} />
      )}

      {modal && modalRequest && (
        <DecisionModal key={`${modal.id}-${modal.mode}`} mode={modal.mode} request={modalRequest} onClose={() => setModal(null)} onSubmit={handleDecision} />
      )}

      <Toast toast={toast} onDone={clearToast} />
    </main>
    </>
  );
}