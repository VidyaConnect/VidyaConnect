import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { FileText, Paperclip, SendHorizontal, X } from "lucide-react";

const MAX_FILES = 5;
const MAX_BYTES = 10 * 1024 * 1024;

interface Props {
  onSend: (text: string, files: File[]) => void;
  disabled?: boolean;
  hint?: string;
  placeholder?: string;
}

export function Composer({ onSend, disabled, hint, placeholder = "Type a message..." }: Props) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const canSend = (text.trim().length > 0 || files.length > 0) && !disabled;

  // Auto-grow the textarea up to 140px.
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [text]);

  const submit = () => {
    if (!canSend) return;
    onSend(text, files);
    setText("");
    setFiles([]);
    setError(null);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    const tooBig = picked.find((f) => f.size > MAX_BYTES);
    if (tooBig) {
      setError(`${tooBig.name} is larger than 10 MB.`);
      return;
    }
    if (files.length + picked.length > MAX_FILES) {
      setError(`You can attach up to ${MAX_FILES} files per message.`);
      return;
    }
    setError(null);
    setFiles((prev) => [...prev, ...picked]);
  };

  return (
    <div className="shrink-0 border-t border-vc-border bg-vc-surface px-5 pt-3 pb-4 max-sm:px-3 max-sm:pb-3">
      <div className="mx-auto max-w-215">
        {hint && <div className="mb-2 text-xs text-vc-text-2">{hint}</div>}
        {error && (
          <div role="alert" className="mb-2 text-[12.5px] font-semibold text-vc-danger">
            {error}
          </div>
        )}

        {files.length > 0 && (
          <div className="mb-2.5 flex flex-wrap gap-2">
            {files.map((f, i) => (
              <span
                key={`${f.name}-${i}`}
                className="inline-flex max-w-60 items-center gap-2 rounded-full bg-vc-primary-light py-1.5 pr-2 pl-2.5 text-[12.5px] font-semibold text-vc-primary-dark"
              >
                <FileText size={14} className="shrink-0" />
                <span className="truncate">{f.name}</span>
                <button
                  type="button"
                  aria-label={`Remove ${f.name}`}
                  onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="grid size-5 cursor-pointer place-items-center rounded-full transition hover:bg-vc-primary/15"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2.5">
          <input
            ref={fileRef}
            type="file"
            multiple
            hidden
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            onChange={onPick}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label="Attach a file"
            title="Attach a file"
            className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-vc-border bg-vc-muted-soft text-vc-text-2 transition hover:border-vc-primary hover:bg-vc-primary-light hover:text-vc-primary focus-visible:outline-2 focus-visible:outline-vc-primary"
          >
            <Paperclip size={20} />
          </button>

          <textarea
            ref={areaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            maxLength={2000}
            aria-label="Message input"
            className="max-h-35 min-h-11 flex-1 resize-none rounded-[22px] border border-vc-border bg-vc-muted-soft px-4 py-2.75 text-[15px] leading-snug text-vc-text outline-none transition placeholder:text-vc-muted focus:border-vc-primary focus:bg-vc-surface focus:ring-3 focus:ring-vc-primary/15"
          />

          <button
            type="button"
            onClick={submit}
            disabled={!canSend}
            aria-label="Send message"
            className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-vc-primary text-vc-surface transition enabled:hover:bg-vc-primary-dark enabled:active:scale-90 disabled:cursor-not-allowed disabled:bg-vc-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vc-primary"
          >
            <SendHorizontal size={20} />
          </button>
        </div>
        <div className="mt-1.5 text-right text-[11.5px] text-vc-muted">
          Enter to send · Shift+Enter for a new line
        </div>
      </div>
    </div>
  );
}