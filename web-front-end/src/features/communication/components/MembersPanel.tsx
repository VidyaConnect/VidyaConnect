import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import { ClassMember } from "../types/communication";
import { Avatar } from "./Avatar";

interface Props {
  open: boolean;
  onClose: () => void;
  classId: string;
  className: string;
  teacherName: string;
  members: ClassMember[];
}

export function MembersPanel({ open, onClose, classId, className, teacherName, members }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...members]
      .sort((a, b) => a.parentName.localeCompare(b.parentName))
      .filter(
        (m) =>
          !q ||
          m.parentName.toLowerCase().includes(q) ||
          m.studentName.toLowerCase().includes(q)
      );
  }, [members, query]);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 z-30 bg-vc-text/40 transition-[opacity,visibility] duration-200 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${className} members`}
        className={`absolute inset-y-0 right-0 z-40 flex w-full max-w-100 flex-col bg-vc-surface shadow-2xl transition-[transform,visibility] duration-300 motion-reduce:transition-none ${
          open ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 bg-vc-navy px-5 py-4 text-vc-surface">
          <div>
            <div className="text-base font-bold">{className} members</div>
            <div className="mt-0.5 text-[12.5px] text-vc-header-sub">
              {members.length} parents · click one to message privately
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close members"
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full transition hover:bg-vc-surface/15 active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative border-b border-vc-border px-4 py-3">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-7.5 -translate-y-1/2 text-vc-muted"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parent or student"
            aria-label="Search members"
            className="h-10 w-full rounded-full border border-vc-border bg-vc-muted-soft pr-3.5 pl-10 text-sm outline-none transition focus:border-vc-primary focus:bg-vc-surface focus:ring-3 focus:ring-vc-primary/15"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="px-3 pt-3 pb-1.5 text-[11.5px] font-extrabold tracking-wider text-vc-text-2 uppercase">
            Class teacher
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Avatar name={teacherName} size={40} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[14.5px] font-bold">{teacherName} (You)</span>
              <span className="text-[12.5px] text-vc-text-2">Class teacher</span>
            </span>
            <span className="rounded-full bg-vc-primary-light px-2 py-0.5 text-[11px] font-bold text-vc-primary-dark">
              Admin
            </span>
          </div>

          <div className="px-3 pt-3 pb-1.5 text-[11.5px] font-extrabold tracking-wider text-vc-text-2 uppercase">
            Parents ({filtered.length})
          </div>
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-vc-text-2">
              No members match your search.
            </div>
          )}
          {filtered.map((m) => (
            <Link
              key={m.id}
              href={`/classes/${classId}/messages/${m.id}`}
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-vc-muted-soft focus-visible:outline-2 focus-visible:outline-vc-primary"
            >
              <Avatar name={m.parentName} size={40} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[14.5px] font-bold">{m.parentName}</span>
                <span className="truncate text-[12.5px] text-vc-text-2">
                  {m.relation} of {m.studentName}
                </span>
              </span>
              <ChevronRight size={18} className="text-vc-muted" />
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}