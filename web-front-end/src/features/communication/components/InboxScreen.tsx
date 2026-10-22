"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, Users } from "lucide-react";
import { useInbox } from "../hooks/useInbox";
import { formatDayLabel, formatTime } from "../utils/format";
import { Avatar } from "./Avatar";
import { ChatHeader } from "./ChatHeader";
import { ChatShell } from "./ChatShell";

const stamp = (iso: string) => (formatDayLabel(iso) === "Today" ? formatTime(iso) : formatDayLabel(iso));

export function InboxScreen() {
  const params = useParams();
  const classId = String(params?.classId ?? "");
  const router = useRouter();
  const { chats, loading, error, reload, totalUnread } = useInbox(classId);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chats.filter(
      (c) => !q || c.parentName.toLowerCase().includes(q) || c.studentName.toLowerCase().includes(q)
    );
  }, [chats, query]);

  return (
    <ChatShell>
      <ChatHeader
        title="Chats"
        subtitle={totalUnread > 0 ? `${totalUnread} unread` : "All caught up"}
        avatarName="Chats"
        avatarLabel="💬"
        onBack={() => router.push("/dashboard/teacher")}
        actions={
          <Link
            href={`/classes/${classId}/community`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-vc-surface/30 bg-vc-surface/10 px-3.5 py-2 text-[13px] font-semibold transition hover:bg-vc-surface/20"
          >
            <Users size={16} />
            <span className="max-sm:hidden">Class community</span>
          </Link>
        }
      />

      <div className="relative border-b border-vc-border bg-vc-surface px-5 py-3 max-sm:px-3">
        <Search size={16} className="pointer-events-none absolute top-1/2 left-9 -translate-y-1/2 text-vc-muted max-sm:left-7" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search parent or student"
          aria-label="Search chats"
          className="mx-auto block h-10 w-full max-w-215 rounded-full border border-vc-border bg-vc-muted-soft pr-4 pl-10 text-sm outline-none transition focus:border-vc-primary focus:bg-vc-surface focus:ring-3 focus:ring-vc-primary/15"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 max-sm:px-3">
        <div className="mx-auto max-w-215">
          {loading && (
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-vc-border" />
              ))}
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-3 p-8 text-center">
              <div className="font-semibold text-vc-danger">{error}</div>
              <button onClick={reload} className="rounded-[10px] bg-vc-primary px-5 py-2.5 font-bold text-vc-surface hover:bg-vc-primary-dark">
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="p-10 text-center text-sm text-vc-text-2">
              No chats found. Open the class community and pick a parent to start one.
            </div>
          )}

          {!loading &&
            !error &&
            filtered.map((c) => (
              <Link
                key={c.parentId}
                href={`/classes/${classId}/messages/${c.parentId}`}
                className="mb-1.5 flex items-center gap-3 rounded-xl border border-transparent bg-vc-surface px-3 py-3 transition hover:border-vc-border hover:shadow-sm focus-visible:outline-2 focus-visible:outline-vc-primary"
              >
                <Avatar name={c.parentName} size={44} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className={`truncate text-[14.5px] ${c.unreadCount ? "font-extrabold" : "font-bold"}`}>
                      {c.parentName}
                      <span className="ml-1.5 text-xs font-medium text-vc-text-2">
                        {c.relation} of {c.studentName}
                      </span>
                    </span>
                    <span className={`shrink-0 text-[11.5px] ${c.unreadCount ? "font-bold text-vc-primary" : "text-vc-muted"}`}>
                      {stamp(c.lastMessageAt)}
                    </span>
                  </span>
                  <span className="flex items-center justify-between gap-2">
                    <span className={`truncate text-[13px] ${c.unreadCount ? "font-semibold text-vc-text" : "text-vc-text-2"}`}>
                      {c.lastMessage}
                    </span>
                    {c.unreadCount > 0 && (
                      <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-vc-primary px-1.5 text-[11px] font-bold text-vc-surface">
                        {c.unreadCount}
                      </span>
                    )}
                  </span>
                </span>
              </Link>
            ))}
        </div>
      </div>
    </ChatShell>
  );
}