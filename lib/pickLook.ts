import { LOOKS } from "./looks";
import type { Look } from "./types";

/** FNV-1a, 32-bit. Stable across runs, so the same filename always lands on the same look. */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** The faked "AI": pick a sample look from the filename (or link). */
export function lookForName(name: string): Look {
  return LOOKS[hashString(name.trim().toLowerCase()) % LOOKS.length];
}
