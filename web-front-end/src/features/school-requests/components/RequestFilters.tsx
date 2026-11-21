import { Search } from "lucide-react";
import type { SchoolType, StatusFilter } from "../types/school-request.types";

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "under_review", label: "Under review" },
  { key: "needs_info", label: "Needs info" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];
const TYPES: SchoolType[] = ["Primary", "Secondary", "International", "Private", "Government"];

interface Props {
  search: string;
  onSearch: (v: string) => void;
  status: StatusFilter;
  onStatus: (s: StatusFilter) => void;
  type: "all" | SchoolType;
  onType: (t: "all" | SchoolType) => void;
  counts: Record<StatusFilter, number>;
}

export default function RequestFilters({ search, onSearch, status, onStatus, type, onType, counts }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 border-b border-slate-200" role="tablist" aria-label="Filter by status">
        {TABS.map((t) => {
          const active = status === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={active}
              onClick={() => onStatus(t.key)}
              className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition ${
                active ? "border-[#0B3D7A] text-[#0B3D7A]" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.label}
              <span className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${active ? "bg-[#0B3D7A] text-white" : "bg-slate-100 text-slate-600"}`}>
                {counts[t.key]}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3">
        <label className="relative min-w-[260px] flex-1">
          <span className="sr-only">Search requests</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by school, applicant, email or registration number"
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0B3D7A] focus:ring-2 focus:ring-[#0B3D7A]/20"
          />
        </label>
        <label>
          <span className="sr-only">School type</span>
          <select
            value={type}
            onChange={(e) => onType(e.target.value as "all" | SchoolType)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0B3D7A] focus:ring-2 focus:ring-[#0B3D7A]/20"
          >
            <option value="all">All school types</option>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
      </div>
    </div>
  );
}
