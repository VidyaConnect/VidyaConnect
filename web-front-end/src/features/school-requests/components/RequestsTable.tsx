import { AlertTriangle, Building2, SearchX } from "lucide-react";
import type { SchoolRequest } from "../types/school-request.types";
import { timeAgo } from "../utils";
import RequestStatusBadge from "./RequestStatusBadge";

interface Props {
  rows: SchoolRequest[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onReview: (r: SchoolRequest) => void;
  onReject: (r: SchoolRequest) => void;
}

const isFinal = (r: SchoolRequest) => r.status === "approved" || r.status === "rejected";

export default function RequestsTable({ rows, loading, error, onRetry, onReview, onReject }: Props) {
  if (error)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-semibold text-red-900">{error}</p>
        <button onClick={onRetry} className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800">
          Try again
        </button>
      </div>
    );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
            <tr>
              <th className="px-5 py-3">School</th>
              <th className="px-5 py-3">Applicant</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3 text-right">Students</th>
              <th className="px-5 py-3">Submitted</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-slate-100" /></td>
                  ))}
                </tr>
              ))}

            {!loading && rows.map((r) => (
              <tr key={r.id} onClick={() => onReview(r)} className="cursor-pointer transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <Building2 className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-slate-900">
                        {r.schoolName}
                        {r.duplicateOf && !isFinal(r) && (
                          <span title={`Similar to ${r.duplicateOf}`} className="text-amber-600">
                            <AlertTriangle className="h-4 w-4" aria-label="Possible duplicate" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{r.type} school, {r.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-slate-900">{r.adminName}</div>
                  <div className="text-xs text-slate-500">{r.adminEmail}</div>
                </td>
                <td className="px-5 py-4 text-slate-600">{r.district}, {r.country}</td>
                <td className="px-5 py-4 text-right tabular-nums text-slate-600">{r.students.toLocaleString()}</td>
                <td className="px-5 py-4 text-slate-600">{timeAgo(r.submittedAt)}</td>
                <td className="px-5 py-4"><RequestStatusBadge status={r.status} /></td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onReview(r)} className="rounded-lg bg-[#0B3D7A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#093263]">
                      {isFinal(r) ? "View" : "Review"}
                    </button>
                    {!isFinal(r) && (
                      <button onClick={() => onReject(r)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50">
                        Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && rows.length === 0 && (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <SearchX className="h-8 w-8 text-slate-400" aria-hidden />
          <p className="mt-3 font-semibold text-slate-900">No requests match these filters</p>
          <p className="mt-1 text-sm text-slate-500">Clear the search or choose a different status.</p>
        </div>
      )}
    </div>
  );
}
