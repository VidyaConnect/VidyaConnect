import type { TimelineEntry } from "../types/school-request.types";
import { formatDateTime } from "../utils";

export default function ActivityTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="space-y-4">
      {[...entries].reverse().map((e, i) => (
        <li key={e.id} className="relative pl-6">
          <span className={`absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-[#0B3D7A]" : "bg-slate-300"}`} />
          {i < entries.length - 1 && <span className="absolute left-[4px] top-4 h-[calc(100%+4px)] w-px bg-slate-200" />}
          <p className="text-sm font-semibold text-slate-900">{e.action}</p>
          <p className="text-xs text-slate-500">{e.actor}, {formatDateTime(e.at)}</p>
          {e.note && <p className="mt-1 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">{e.note}</p>}
        </li>
      ))}
    </ol>
  );
}
