"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Users } from "lucide-react";
import { communicationService } from "../services/communicationService";
import { useConversation } from "../hooks/useConversation";
import { ClassCommunity, ClassMember } from "../types/communication";
import { ChatHeader } from "./ChatHeader";
import { ChatShell } from "./ChatShell";
import { ChatView } from "./ChatView";
import { MembersPanel } from "./MembersPanel";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { useInbox } from "../hooks/useInbox";

export function CommunityScreen() {
  const params = useParams();
  const classId = String(params?.classId ?? "");
  const router = useRouter();
  const search = useSearchParams();

  // /classes/8-a/community?members=1 opens the drawer (used later by Class details > Members).
  const [membersOpen, setMembersOpen] = useState(search?.get("members") === "1");
  const closeMembers = useCallback(() => setMembersOpen(false), []);

  const [community, setCommunity] = useState<ClassCommunity | null>(null);
  const [members, setMembers] = useState<ClassMember[]>([]);

  useEffect(() => {
    let alive = true;
    Promise.all([communicationService.getCommunity(classId), communicationService.getMembers(classId)])
      .then(([c, m]) => {
        if (!alive) return;
        setCommunity(c);
        setMembers(m);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [classId]);

  const convo = useConversation({ kind: "community", classId });
  const { totalUnread } = useInbox(classId);

  const goBack = () => {
    // TODO: point to the Class details page (/classes/[classId]) once it exists.
    router.push("/dashboard/teacher");
  };

  const preview = members.slice(0, 3).map((m) => m.parentName).join(", ");
  const more = members.length - 3;
  const subtitle = members.length
    ? `${preview}${more > 0 ? ` and ${more} more` : ""}`
    : "Loading members...";

  return (
    <ChatShell>
      <ChatView
        header={
          <ChatHeader
            title={community?.title ?? "Class Community"}
            subtitle={subtitle}
            avatarName={community?.name ?? "Class"}
            avatarLabel={community ? community.name.replace("Grade ", "") : "..."}
            avatarSquare
            onBack={goBack}
            onTitleClick={() => setMembersOpen(true)}
            actions={
                <div className="flex shrink-0 items-center gap-2">
                    <Link
                        href={`/classes/${classId}/inbox`}
                        className="relative inline-flex items-center gap-2 rounded-full border border-vc-surface/30 bg-vc-surface/10 px-3.5 py-2 text-[13px] font-semibold transition hover:bg-vc-surface/20"
                    >
                        <MessageSquare size={16} />
                        <span className="max-sm:hidden">View chats</span>
                        {totalUnread > 0 && (
                            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-vc-danger px-1.5 text-[11px] font-bold">
                                {totalUnread}
                            </span>
                        )}
                    </Link>
                    <button
                        type="button"
                        onClick={() => setMembersOpen(true)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-vc-surface/30 bg-vc-surface/10 px-3.5 py-2 text-[13px] font-semibold transition hover:bg-vc-surface/20"
                    >
                        <Users size={16} />
                        <span className="max-sm:hidden">Members</span>
                        <span>{members.length}</span>
                    </button>
                </div>
            }
          />
        }
        messages={convo.messages}
        loading={convo.loading}
        error={convo.error}
        onReload={convo.reload}
        onSend={convo.send}
        onRetry={convo.retry}
        showSender
        composerHint={
          community
            ? `Visible to all ${members.length} parents in ${community.name}. Parents reply here or privately.`
            : undefined
        }
        emptyText="No messages yet. Send the first announcement to your class parents."
        placeholder="Message all parents..."
      />

      <MembersPanel
        open={membersOpen}
        onClose={closeMembers}
        classId={classId}
        className={community?.name ?? "Class"}
        teacherName={community?.teacherName ?? "Teacher"}
        members={members}
      />
    </ChatShell>
  );
}