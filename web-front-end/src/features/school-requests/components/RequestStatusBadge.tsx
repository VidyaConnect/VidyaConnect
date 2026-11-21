import type { RequestStatus } from "../types/school-request.types";

const STYLES: Record<RequestStatus, { label: string; cls: string; dot: string }> = {
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-800 ring-amber-200", dot: "bg-amber-500" },
  under_review: { label: "Under review", cls: "bg-blue-50 text-blue-800 ring-blue-200", dot: "bg-blue-500" },
  needs_info: { label: "Needs info", cls: "bg-purple-50 text-purple-800 ring-purple-200", dot: "bg-purple-500" },
  approved: { label: "Approved", cls: "bg-emerald-50 text-emerald-800 ring-emerald-200", dot: "bg-emerald-500" },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-800 ring-red-200", dot: "bg-red-500" },
};

export function statusLabel(s: RequestStatus) {
  return STYLES[s].label;
}

export default function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const s = STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
