"use client";

import type { KeyboardEvent } from "react";
import { Badge, Button, Garment, PriceTag, ScoreTag, pressableSm } from "@/components/ui";
import { ProductImage } from "@/components/ProductImage";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { productScore } from "@/lib/score";
import { toneBg, type Tone } from "@/lib/tone";
import { SLOT_GARMENT, SLOT_LABEL, type Product, type Slot } from "@/lib/types";

export type Tab = "best" | "secondhand" | "local";

export const TAB_LABEL: Record<Tab, string> = {
  best: "Best match",
  secondhand: "Second-hand",
  local: "Local",
};

const STAGE_TONE: Record<Slot, Tone> = {
  top: "mikado",
  bottom: "fanfare",
  outerwear: "dust",
  shoes: "flat",
  bag: "mikado",
};

type Props = {
  slot: Slot;
  /** 1-based number, matches the pin on the photo */
  number: number;
  product?: Product;
  tab: Tab;
  /** position inside the filtered list */
  position: number;
  listLength: number;
  counts: Record<Tab, number>;
  size: string;
  active: boolean;
  inCart: boolean;
  /** the product shown is a greener swap, not one of the look's matches */
  swapped: boolean;
  greener?: Product;
  onTab: (tab: Tab) => void;
  onCycle: (dir: 1 | -1) => void;
  onSize: (size: string) => void;
  onAdd: () => void;
  onSwap: () => void;
  onUndoSwap: () => void;
};

function Arrow({ dir, label, disabled, onClick }: { dir: 1 | -1; label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-lyons bg-mikado text-lyons shadow-hard-sm",
        pressableSm,
        "disabled:pointer-events-none disabled:opacity-40",
      )}
    >
      <svg viewBox="0 0 24 24" className={cn("h-5 w-5", dir === 1 && "-scale-x-100")} aria-hidden>
        <path d="M15 5 8 12l7 7" className="fill-none stroke-lyons" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

const nice = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ");

export function ClosetSlot(props: Props) {
  const { slot, number, product: p, tab, position, listLength, counts, size, active, inCart, swapped, greener } = props;
  const label = SLOT_LABEL[slot];
  const saving = p ? Math.max(0, p.mrpNew - p.price) : 0;
  const cycleDisabled = listLength < 2;

  // Left/Right on the carousel row cycles matches, same as the arrow buttons.
  // The size <select> and the arrow buttons keep their own native key handling.
  const onCarouselKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (cycleDisabled || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target instanceof HTMLSelectElement) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      props.onCycle(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      props.onCycle(1);
    }
  };

  return (
    <section
      id={`slot-${slot}`}
      aria-label={label}
      className={cn(
        "scroll-mt-28 rounded-2xl border-2 border-lyons bg-paper p-3 shadow-hard-sm transition-shadow",
        active && "ring-4 ring-red",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-pixel text-sm font-bold uppercase tracking-widest">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-lyons bg-red text-xs text-paper">
            {number}
          </span>
          {label}
        </h3>
        <div role="group" aria-label={`${label} filter`} className="flex flex-wrap gap-1.5">
          {(Object.keys(TAB_LABEL) as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tab === t}
              disabled={counts[t] === 0}
              onClick={() => props.onTab(t)}
              className={cn(
                "min-h-11 rounded-full border-2 border-lyons px-3 py-0.5 font-pixel text-[10px] font-bold uppercase tracking-wider shadow-hard-sm sm:min-h-8",
                pressableSm,
                tab === t ? "bg-lyons text-paper" : "bg-paper text-lyons hover:bg-mikado",
                "disabled:pointer-events-none disabled:opacity-40",
              )}
            >
              {TAB_LABEL[t]} {counts[t]}
            </button>
          ))}
        </div>
      </div>

      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={`${label} matches. Use left and right arrow keys to cycle.`}
        onKeyDown={onCarouselKey}
        className="mt-3 flex items-center gap-2"
      >
        <Arrow dir={-1} label={`Previous ${label} match`} disabled={cycleDisabled} onClick={() => props.onCycle(-1)} />

        <div className="grid min-w-0 flex-1 items-center gap-3 sm:grid-cols-[9rem_1fr]">
          <div
            className={cn(
              "relative mx-auto flex h-36 w-full max-w-[9rem] items-center justify-center rounded-xl border-2 border-lyons",
              toneBg[STAGE_TONE[slot]],
            )}
          >
            {p ? (
              <ProductImage product={p} className="absolute inset-0 p-2" />
            ) : (
              <Garment type={SLOT_GARMENT[slot]} label={label} className="w-24 opacity-30" />
            )}
            {p && (
              <>
                <div className="absolute left-2 top-2">
                  <Badge variant={p.source === "secondhand" ? "preloved" : p.source === "local" ? "local" : "new"} />
                </div>
                <div className="absolute -right-3 -top-3">
                  <ScoreTag score={productScore(p)} size="sm" />
                </div>
                {listLength > 0 && !swapped && (
                  <span className="absolute bottom-1.5 right-2 rounded-full border-2 border-lyons bg-paper px-1.5 font-pixel text-[10px] font-bold">
                    {position + 1}/{listLength}
                  </span>
                )}
              </>
            )}
          </div>

          {p ? (
            <div className="min-w-0">
              <h4 className="font-display text-sm leading-tight">{p.name}</h4>
              <p className="mt-1 text-xs">
                {p.brand} · {p.city}
                {p.condition ? ` · ${nice(p.condition)}` : ""}
              </p>
              <div className="mt-1.5 flex items-center gap-2 font-pixel text-[11px] font-bold uppercase">
                {p.sizes.length > 1 ? (
                  <label className="flex items-center gap-1.5">
                    Size
                    <select
                      value={size}
                      onChange={(e) => props.onSize(e.target.value)}
                      className="min-h-9 rounded-full border-2 border-lyons bg-paper px-2 py-0.5 font-pixel text-[11px]"
                    >
                      {p.sizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <span>Size {p.sizes[0]}</span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <PriceTag price={p.price} was={p.mrpNew} />
                <span className="text-xs font-bold">
                  {saving > 0 ? `Save ${formatINR(saving)} (${Math.round((saving / p.mrpNew) * 100)}% off new)` : "About retail price"}
                </span>
              </div>
            </div>
          ) : (
            <p className="font-pixel text-xs font-bold uppercase">No {TAB_LABEL[tab].toLowerCase()} match for this slot</p>
          )}
        </div>

        <Arrow dir={1} label={`Next ${label} match`} disabled={cycleDisabled} onClick={() => props.onCycle(1)} />
        <p className="sr-only" role="status">
          {p ? `${label}: ${p.name}${listLength > 0 && !swapped ? `, match ${position + 1} of ${listLength}` : ""}` : `${label}: no match`}
        </p>
      </div>

      {p && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button size="sm" variant="green" onClick={props.onAdd} aria-label={inCart ? `${p.name} is in your cart. Add again` : `Add ${p.name} to cart`}>
            {inCart ? "In cart ✓" : "Add"}
          </Button>
          <Button size="sm" variant="paper" href={`/browse?slot=${slot}`} aria-label={`Browse all ${label.toLowerCase()} pieces`}>
            Browse
          </Button>
          {greener && (
            <Button size="sm" variant="teal" onClick={props.onSwap} aria-label={`Swap ${p.name} for ${greener.name}`}>
              Greener swap
            </Button>
          )}
          {swapped && (
            <Button size="sm" variant="paper" onClick={props.onUndoSwap}>
              Undo swap
            </Button>
          )}
        </div>
      )}
      {p && greener && (
        <p className="mt-2 font-pixel text-[10px] font-bold uppercase tracking-wider">
          Greener: {greener.name}, score +{productScore(greener) - productScore(p)}
        </p>
      )}
      {p && !greener && (
        <p className="mt-2 font-pixel text-[10px] font-bold uppercase tracking-wider">
          {swapped ? "Greener swap applied" : "Already the greenest pick"}
        </p>
      )}
    </section>
  );
}

