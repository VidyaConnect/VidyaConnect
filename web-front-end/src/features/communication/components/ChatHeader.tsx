import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Avatar } from "./Avatar";

interface Props {
  title: string;
  subtitle: string;
  avatarName: string;
  avatarLabel?: string;
  avatarSquare?: boolean;
  onBack: () => void;
  /** When set, the title block becomes a button (e.g. open the members list). */
  onTitleClick?: () => void;
  actions?: ReactNode;
}

export function ChatHeader({
  title,
  subtitle,
  avatarName,
  avatarLabel,
  avatarSquare,
  onBack,
  onTitleClick,
  actions
}: Props) {
  const titleBlock = (
    <>
      <Avatar name={avatarName} label={avatarLabel} square={avatarSquare} size={42} />
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-base font-bold">{title}</span>
        <span className="mt-0.5 truncate text-[12.5px] text-vc-header-sub">{subtitle}</span>
      </span>
    </>
  );

  return (
    <header className="flex shrink-0 items-center gap-3 bg-vc-navy px-5 py-3 text-vc-surface max-sm:px-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full transition hover:bg-vc-surface/15 active:scale-90 focus-visible:outline-2 focus-visible:outline-vc-surface"
      >
        <ArrowLeft size={20} />
      </button>

      {onTitleClick ? (
        <button
          type="button"
          onClick={onTitleClick}
          title="View members"
          className="-mx-2 -my-1 flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-xl px-2 py-1 text-left transition hover:bg-vc-surface/10 focus-visible:outline-2 focus-visible:outline-vc-surface"
        >
          {titleBlock}
        </button>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3">{titleBlock}</div>
      )}

      {actions}
    </header>
  );
}