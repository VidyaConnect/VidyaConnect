import { CheckCircle2, Clock3, Inbox, XCircle } from "lucide-react";
import type { StatusFilter } from "../types/school-request.types";

interface Props {
  stats: { awaiting: number; approvedThisMonth: number; rejectedThisMonth: number; avgHours: number };
  active: StatusFilter;
  onSelect: (s: StatusFilter) => void;
}

export default function RequestStats({ stats, active, onSelect }: Props) {
  const cards = [
    { key: "pending" as const, label: "Awaiting your review", value: stats.awaiting, icon: Inbox, accent: true },
    { key: "approved" as const, label: "Approved this month", value: stats.approvedThisMonth, icon: CheckCircle2, accent: false },
    { key: "rejected" as const, label: "Rejected this month", value: stats.rejectedThisMonth, icon: XCircle, accent: false },
    { key: null, label: "Average time to decide", value: `${stats.avgHours}h`, icon: Clock3, accent: false },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        const isActive = c.key !== null && active === c.key;
        const base = "rounded-xl border p-5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D7A]";
        const tone = c.accent
          ? "border-[#0B3D7A] bg-[#0B3D7A] text-white"
          : isActive
            ? "border-[#0B3D7A] bg-white text-slate-900 ring-2 ring-[#0B3D7A]/20"
            : "border-slate-200 bg-white text-slate-900 hover:border-slate-300";
        const content = (
          <>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${c.accent ? "text-blue-100" : "text-slate-500"}`}>{c.label}</span>
              <Icon className={`h-5 w-5 ${c.accent ? "text-blue-100" : "text-slate-400"}`} aria-hidden />
            </div>
            <div className="mt-3 text-3xl font-bold tabular-nums">{c.value}</div>
          </>
        );
        return c.key ? (
          <button key={c.label} onClick={() => onSelect(isActive ? "all" : c.key!)} className={`${base} ${tone}`} aria-pressed={isActive}>
            {content}
          </button>
        ) : (
          <div key={c.label} className={`${base} ${tone}`}>{content}</div>
        );
      })}
    </div>
  );
}
