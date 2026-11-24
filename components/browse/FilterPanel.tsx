"use client";

import {
  ALL_SIZES,
  PRICE_MAX,
  PRICE_MIN,
  SOURCE_LABEL,
  SOURCES,
  type Filters,
} from "@/lib/browse";
import { SLOTS, SLOT_LABEL, type Slot, type Source } from "@/lib/types";

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
};

const labelClass = "flex cursor-pointer items-center gap-2 text-sm";
const checkClass = "h-4 w-4 accent-[#084973]";

export function FilterPanel({ filters, onChange, onReset }: Props) {
  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  const toggle = <T extends string>(items: T[], value: T): T[] =>
    items.includes(value) ? items.filter((item) => item !== value) : [...items, value];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-lg uppercase">Filter pieces</h2>
        <button type="button" onClick={onReset} className="font-pixel text-[10px] font-bold uppercase underline underline-offset-4">
          Reset
        </button>
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-2 font-pixel text-[11px] font-bold uppercase tracking-wide">Minimum green score</legend>
        <div className="flex items-center gap-3">
          <input
            aria-label="Minimum green score"
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.minScore}
            onChange={(e) => update({ minScore: Number(e.target.value) })}
            className="min-w-0 flex-1 accent-[#084973]"
          />
          <span className="w-10 text-right text-sm font-bold">{filters.minScore}+</span>
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-2 font-pixel text-[11px] font-bold uppercase tracking-wide">Price (₹)</legend>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs">Min
            <input aria-label="Minimum price" type="number" min={PRICE_MIN} max={filters.maxPrice} value={filters.minPrice}
              onChange={(e) => update({ minPrice: Math.min(filters.maxPrice, Math.max(PRICE_MIN, Number(e.target.value) || PRICE_MIN)) })}
              className="mt-1 w-full rounded-lg border-2 border-lyons bg-white px-2 py-1.5 text-sm" />
          </label>
          <label className="text-xs">Max
            <input aria-label="Maximum price" type="number" min={filters.minPrice} max={PRICE_MAX} value={filters.maxPrice}
              onChange={(e) => update({ maxPrice: Math.max(filters.minPrice, Math.min(PRICE_MAX, Number(e.target.value) || PRICE_MAX)) })}
              className="mt-1 w-full rounded-lg border-2 border-lyons bg-white px-2 py-1.5 text-sm" />
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-2 font-pixel text-[11px] font-bold uppercase tracking-wide">Source</legend>
        {SOURCES.map((source: Source) => (
          <label key={source} className={labelClass}>
            <input className={checkClass} type="checkbox" checked={filters.sources.includes(source)}
              onChange={() => update({ sources: toggle(filters.sources, source) })} />
            {SOURCE_LABEL[source]}
          </label>
        ))}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-2 font-pixel text-[11px] font-bold uppercase tracking-wide">Category</legend>
        {SLOTS.map((slot: Slot) => (
          <label key={slot} className={labelClass}>
            <input className={checkClass} type="checkbox" checked={filters.slots.includes(slot)}
              onChange={() => update({ slots: toggle(filters.slots, slot) })} />
            {SLOT_LABEL[slot]}
          </label>
        ))}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-2 font-pixel text-[11px] font-bold uppercase tracking-wide">Size</legend>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <label key={size} className="cursor-pointer">
              <input className="peer sr-only" type="checkbox" checked={filters.sizes.includes(size)}
                onChange={() => update({ sizes: toggle(filters.sizes, size) })} />
              <span className="inline-flex min-h-9 items-center rounded-full border-2 border-lyons px-3 text-xs font-bold peer-checked:bg-lyons peer-checked:text-paper">
                {size}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
