import { useSyncExternalStore } from "react";
import type { Look } from "@/lib/types";

export type UploadSession = {
  name: string;
  lookId: string;
  matchedLook?: Look;
};
const STORAGE_KEY = "second-spin:description-session";
let current: UploadSession | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function loadSession() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    current = saved ? JSON.parse(saved) as UploadSession : null;
  } catch { current = null; }
}
export function setUploadSession(next: UploadSession | null) {
  current = next;
  loaded = true;
  if (typeof window !== "undefined") {
    try {
      if (next) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch { /* session storage is optional */ }
  }
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  loadSession();
  return () => listeners.delete(listener);
}
function getSnapshot() { loadSession(); return current; }
function getServerSnapshot() { return null; }
export function useUploadSession(): UploadSession | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
