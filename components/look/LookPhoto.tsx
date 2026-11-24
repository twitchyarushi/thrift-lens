"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SLOTS, SLOT_LABEL, type Look, type Product, type Slot } from "@/lib/types";
import { FLAT_POS, LookScene } from "./LookScene";

/** Rough body positions for a real photo of a person (fake detection, same spots every time). */
const BODY_POS: Record<Slot, { x: number; y: number }> = {
  top: { x: 50, y: 30 },
  outerwear: { x: 27, y: 38 },
  bottom: { x: 50, y: 60 },
  bag: { x: 76, y: 56 },
  shoes: { x: 50, y: 90 },
};

type Props = {
  look: Look;
  /** uploaded image (object URL or pasted link); falls back to the sample scene */
  src?: string;
  products?: Product[];
  showPins?: boolean;
  activeSlot?: Slot | null;
  onPin?: (slot: Slot) => void;
  className?: string;
  /** extra overlays (scan line) */
  children?: ReactNode;
};

export function LookPhoto({ look, src, products, showPins = false, activeSlot, onPin, className, children }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const photo = src && src !== failedSrc ? src : undefined;

  return (
    <div
      className={cn(
        "relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-2 border-lyons bg-fanfare shadow-hard-lg",
        className,
      )}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- user upload / arbitrary link, not optimisable
        <img
          src={photo}
          alt="Your uploaded outfit photo"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailedSrc(photo)}
        />
      ) : (
        <LookScene look={look} products={products} />
      )}

      {showPins &&
        SLOTS.map((s, i) => {
          const pos = photo ? BODY_POS[s] : FLAT_POS[s];
          const active = activeSlot === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onPin?.(s)}
              aria-label={`Piece ${i + 1}: ${SLOT_LABEL[s]}`}
              aria-pressed={active}
              className={cn(
                "absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-lyons",
                "font-pixel text-sm font-bold shadow-hard-sm transition-transform duration-150 hover:scale-110",
                // invisible ring pads the tap target to 44px; paper focus ring reads on the teal scene
                "after:absolute after:-inset-1 after:content-[''] focus-visible:outline-paper",
                active ? "scale-125 bg-mikado text-lyons" : "bg-red text-paper",
              )}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {i + 1}
              {active && (
                <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-lyons bg-paper px-2 py-0.5 font-pixel text-[10px] uppercase text-lyons">
                  {SLOT_LABEL[s]}
                </span>
              )}
            </button>
          );
        })}

      {children}
    </div>
  );
}
