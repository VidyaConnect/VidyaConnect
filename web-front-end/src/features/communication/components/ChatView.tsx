import { ReactNode, UIEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, Lock } from "lucide-react";
import { ChatMessage } from "../types/communication";
import { buildChatItems } from "../utils/format";
import { Composer } from "./Composer";
import { MessageBubble } from "./MessageBubble";

interface Props {
  header: ReactNode;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  onReload: () => void;
  onSend: (text: string, files: File[]) => void;
  onRetry: (id: string) => void;
  showSender?: boolean;
  composerHint?: string;
  emptyText: string;
  placeholder?: string;
}

export function ChatView({
  header,
  messages,
  loading,
  error,
  onReload,
  onSend,
  onRetry,
  showSender = false,
  composerHint,
  emptyText,
  placeholder
}: Props) {
  const items = useMemo(() => buildChatItems(messages), [messages]);
  const endRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);

  // Follow new messages when at the bottom, or always after the teacher sends.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (atBottom || last?.senderRole === "teacher") {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, loading]);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {header}

      <div className="flex shrink-0 items-center justify-center gap-2 border-b border-vc-border bg-vc-primary-light px-4 py-2 text-[12.5px] font-semibold text-vc-primary-dark">
        <Lock size={14} />
        Messages are recorded by the school and cannot be edited or deleted.
      </div>

      <div className="relative min-h-0 flex-1">
        {loading ? (
          <div className="h-full overflow-y-auto px-5 pt-5 pb-3 max-sm:px-3">
            <div className="mx-auto flex max-w-215 flex-col">
              <div className="mb-3 h-12 w-[55%] animate-pulse rounded-[18px] bg-vc-border" />
              <div className="mb-3 h-12 w-[40%] self-end animate-pulse rounded-[18px] bg-vc-border" />
              <div className="mb-3 h-12 w-[55%] animate-pulse rounded-[18px] bg-vc-border" />
            </div>
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="font-semibold text-vc-danger">{error}</div>
            <button
              type="button"
              onClick={onReload}
              className="cursor-pointer rounded-[10px] bg-vc-primary px-5 py-2.5 font-bold text-vc-surface transition hover:bg-vc-primary-dark active:scale-95"
            >
              Try again
            </button>
          </div>
        ) : (
          <div onScroll={onScroll} className="h-full overflow-y-auto px-5 pt-5 pb-3 max-sm:px-3">
            <div className="mx-auto flex max-w-215 flex-col">
              {items.length === 0 && (
                <div className="p-10 text-center text-sm text-vc-text-2">{emptyText}</div>
              )}
              {items.map((item) =>
                item.type === "date" ? (
                  <div
                    key={item.id}
                    className="my-3.5 self-center rounded-xl bg-vc-border px-3 py-1 text-xs font-semibold text-vc-text-2"
                  >
                    {item.label}
                  </div>
                ) : (
                  <MessageBubble
                    key={item.id}
                    message={item.message}
                    showSender={showSender}
                    onRetry={onRetry}
                  />
                )
              )}
              <div ref={endRef} />
            </div>
          </div>
        )}

        {!atBottom && !loading && !error && (
          <button
            type="button"
            aria-label="Jump to latest message"
            onClick={() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })}
            className="absolute right-6 bottom-4 grid size-10 cursor-pointer place-items-center rounded-full border border-vc-border bg-vc-surface text-vc-navy shadow-lg transition hover:-translate-y-0.5"
          >
            <ArrowDown size={20} />
          </button>
        )}
      </div>

      <Composer
        onSend={onSend}
        disabled={loading || !!error}
        hint={composerHint}
        placeholder={placeholder}
      />
    </div>
  );
}