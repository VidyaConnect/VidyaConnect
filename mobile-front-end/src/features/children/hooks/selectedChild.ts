import { useSyncExternalStore } from "react";

export type SelectedChild = { id: string; name: string } | null;

let current: SelectedChild = null;
const listeners = new Set<() => void>();

export function setSelectedChild(child: SelectedChild) {
  current = child;
  listeners.forEach((l) => l());
}

export function useSelectedChild(): SelectedChild {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => current
  );
}