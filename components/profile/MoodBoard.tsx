"use client";

import Link from "next/link";
import { Button, pressableSm } from "@/components/ui";
import { ProductImage } from "@/components/ProductImage";
import { cn } from "@/lib/cn";
import { getLook, lookBestMatches } from "@/lib/looks";
import { toneBg, type Tone } from "@/lib/tone";
import { useStore } from "@/store";

const TILT = [-2.5, 1.5, -1, 3, -3, 2];
const TONES: Tone[] = ["mikado", "fanfare", "dust", "flat"];

/** Saved looks pinned up like a mood board: tilted tiles, uneven heights, tape on top. */
export function MoodBoard() {
  const { savedLooks, toggleSavedLook } = useStore();
  const looks = savedLooks.flatMap((id) => {
    const l = getLook(id);
    return l ? [l] : [];
  });

  if (looks.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-lyons bg-mikado p-8 text-center shadow-hard">
        <h2 className="font-display text-2xl uppercase">No saved looks yet</h2>
        <p className="mt-2 font-bold">Save a look from a scan and it gets pinned here.</p>
        <Button href="/upload" variant="dust" className="mt-5">
          Scan an outfit
        </Button>
      </div>
    );
  }

  return (
    <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {looks.map((look, i) => {
        const pieces = lookBestMatches(look);
        return (
          <li key={look.id} className="relative mb-8 break-inside-avoid" style={{ transform: `rotate(${TILT[i % TILT.length]}deg)` }}>
            <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 border-2 border-lyons bg-mikado/90" />
            <Link
              href={`/look/${look.id}`}
              aria-label={`Open ${look.title}`}
              className="block rounded-2xl border-2 border-lyons bg-paper shadow-hard transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
            >
              <div className={cn("rounded-t-[0.9rem] border-b-2 border-lyons px-3 pb-4 pt-6", toneBg[TONES[i % TONES.length]])}>
                <div className={cn("grid items-end gap-2", i % 2 === 0 ? "grid-cols-3" : "grid-cols-2")}>
                  {pieces.map((p) => (
                    <ProductImage key={p.id} product={p} className="aspect-square w-full rounded-lg border border-lyons bg-paper p-1" />
                  ))}
                </div>
              </div>
              <div className="p-3">
                <p className="font-display text-lg uppercase leading-tight">{look.title}</p>
                <p className="text-sm">{look.vibe}</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => toggleSavedLook(look.id)}
              aria-label={`Unpin ${look.title}`}
              className={cn(
                "absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-lyons bg-paper font-display text-base leading-none shadow-hard-sm hover:bg-red hover:text-paper",
                pressableSm,
              )}
            >
              ×
            </button>
          </li>
        );
      })}
    </ul>
  );
}
