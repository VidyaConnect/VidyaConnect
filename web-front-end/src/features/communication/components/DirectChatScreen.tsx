"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { communicationService } from "../services/communicationService";
import { useConversation } from "../hooks/useConversation";
import { ClassMember } from "../types/communication";
import { ChatHeader } from "./ChatHeader";
import { ChatShell } from "./ChatShell";
import { ChatView } from "./ChatView";

export function DirectChatScreen() {
  const params = useParams();
  const classId = String(params?.classId ?? "");
  const parentId = String(params?.parentId ?? "");
  const router = useRouter();

  const [member, setMember] = useState<ClassMember | null>(null);

  useEffect(() => {
    let alive = true;
    communicationService
      .getMember(classId, parentId)
      .then((m) => alive && setMember(m))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [classId, parentId]);

  useEffect(() => {
    void communicationService.markRead(classId, parentId);
  }, [classId, parentId]);

  const convo = useConversation({ kind: "direct", classId, parentId });
  const name = member?.parentName ?? "Parent";

  return (
    <ChatShell>
      <ChatView
        header={
          <ChatHeader
            title={name}
            subtitle={member ? `${member.relation} of ${member.studentName}` : "Loading..."}
            avatarName={name}
            onBack={() => router.push(`/classes/${classId}/inbox`)}
          />
        }
        messages={convo.messages}
        loading={convo.loading}
        error={convo.error}
        onReload={convo.reload}
        onSend={convo.send}
        onRetry={convo.retry}
        composerHint={`Private conversation with ${name}. Only you and this parent can see it.`}
        emptyText={`No messages yet. Say hello to ${name}.`}
        placeholder={`Message ${name}...`}
      />
    </ChatShell>
  );
}