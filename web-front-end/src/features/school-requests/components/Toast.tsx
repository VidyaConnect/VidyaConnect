"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export interface ToastState {
  kind: "success" | "error";
  text: string;
}

export default function Toast({ toast, onDone }: { toast: ToastState | null; onDone: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [toast, onDone]);

  if (!toast) return null;
  const Icon = toast.kind === "success" ? CheckCircle2 : XCircle;
  return (
    <div role="status" className="fixed bottom-6 right-6 z-[70] flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
      <Icon className={`h-5 w-5 ${toast.kind === "success" ? "text-emerald-400" : "text-red-400"}`} aria-hidden />
      {toast.text}
    </div>
  );
}
