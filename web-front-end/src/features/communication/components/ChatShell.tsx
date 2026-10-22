import { ReactNode } from "react";

/**
 * Outer frame of every chat screen. `h-dvh` fills the browser window.
 * When this is placed inside the portal layout (sidebar/topbar), change it to `h-full`.
 */
export function ChatShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-vc-chat-bg text-vc-text">
      {children}
    </div>
  );
}