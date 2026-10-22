import { Check, FileText } from "lucide-react";
import { ChatMessage } from "../types/communication";
import { formatTime } from "../utils/format";

interface Props {
  message: ChatMessage;
  showSender: boolean;
  onRetry: (id: string) => void;
}

export function MessageBubble({ message, showSender, onRetry }: Props) {
  const mine = message.senderRole === "teacher";
  const failed = message.status === "failed";

  return (
    <div
      className={`mb-3 flex animate-vc-pop flex-col motion-reduce:animate-none ${
        mine ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`max-w-[88%] break-words whitespace-pre-wrap rounded-[18px] px-3.5 py-2.5 text-[15px] leading-snug shadow-sm sm:max-w-[min(620px,78%)] ${
          mine
            ? "rounded-br-sm bg-vc-primary text-vc-surface"
            : "rounded-bl-sm border border-vc-border bg-vc-surface text-vc-text"
        } ${failed ? "opacity-65" : ""}`}
      >
        {!mine && showSender && (
          <div className="mb-0.5 text-[12.5px] font-extrabold text-vc-navy">
            {message.senderName}
            {message.senderSubtitle && (
              <span className="ml-1.5 font-medium text-vc-text-2">{message.senderSubtitle}</span>
            )}
          </div>
        )}

        {message.body && <span>{message.body}</span>}

        {message.attachments?.map((a) => (
          <div
            key={a.id}
            className={`mt-2 flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 whitespace-normal ${
              mine ? "bg-vc-surface/15" : "bg-vc-muted-soft"
            }`}
          >
            <FileText size={20} className="shrink-0" />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[13px] font-bold">{a.name}</span>
              <span className="text-[11.5px] opacity-75">{a.sizeLabel}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-1 flex items-center gap-1.5 px-1 text-[11.5px] text-vc-muted">
        <span>{formatTime(message.sentAt)}</span>
        {mine && message.status === "sending" && <span>Sending...</span>}
        {mine && message.status === "sent" && <Check size={14} strokeWidth={2.5} />}
        {mine && message.status === "sent" && message.recipientCount !== undefined && (
          <span
            className="font-semibold text-vc-primary"
            title="Read receipts are part of the audit trail"
          >
            Seen by {message.readCount ?? 0} of {message.recipientCount}
          </span>
        )}
      </div>

      {failed && (
        <button
          type="button"
          onClick={() => onRetry(message.id)}
          className="mt-1 cursor-pointer text-xs font-bold text-vc-danger underline focus-visible:outline-2 focus-visible:outline-vc-primary"
        >
          Failed to send. Click to retry
        </button>
      )}
    </div>
  );
}