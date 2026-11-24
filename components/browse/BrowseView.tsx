"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button, Garment, Scribble } from "@/components/ui";
import {
  DEFAULT_FILTERS,
  SORTS,
  activeFilterCount,
  filterProducts,
  sortProducts,
  type Filters,
  type SortKey,
} from "@/lib/browse";
import { PRODUCTS } from "@/lib/products";
import { FilterPanel } from "./FilterPanel";

type Props = { initialFilters: Filters; initialSort: SortKey };

export function BrowseView({ initialFilters, initialSort }: Props) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [sheet, setSheet] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => sortProducts(filterProducts(PRODUCTS, filters), sort), [filters, sort]);
  const active = activeFilterCount(filters);
  const reset = () => setFilters(DEFAULT_FILTERS);

  // sheet: Escape closes, Tab stays inside, page behind doesn't scroll, focus moves in and back out
  useEffect(() => {
    if (!sheet) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSheet(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]):not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!items || items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      opener?.focus();
    };
  }, [sheet]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <h1 className="font-display text-4xl uppercase leading-none sm:text-5xl">
        Browse the <span className="font-serif font-bold normal-case italic text-red">crate</span>
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside
          aria-label="Filters"
          className="hidden self-start rounded-2xl border-2 border-lyons bg-paper p-4 shadow-hard lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
        >
          <FilterPanel filters={filters} onChange={setFilters} onReset={reset} />
        </aside>

        <section aria-label="Results">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button className="lg:hidden" size="sm" variant="blue" onClick={() => setSheet(true)}>
                Filters{active > 0 ? ` (${active})` : ""}
              </Button>
              <p role="status" className="font-pixel text-xs font-bold uppercase tracking-widest">
                {results.length} {results.length === 1 ? "piece" : "pieces"}
              </p>
            </div>
            <label className="flex items-center gap-2 font-pixel text-xs font-bold uppercase tracking-widest">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="min-h-11 rounded-full border-2 border-lyons bg-paper px-3 py-1.5 font-pixel text-xs shadow-hard-sm sm:min-h-9"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {results.length > 0 ? (
            <ul className="grid grid-cols-1 gap-7 pt-3 min-[520px]:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => (
                <li key={p.id} className="flex">
                  <ProductCard product={p} className="w-full" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-3xl border-4 border-dashed border-lyons px-6 py-14 text-center">
              <Garment type="hat" color="mustard" className="w-24" label="" />
              <p className="font-display text-3xl uppercase leading-tight">
                <Scribble variant="circle">Nothing here</Scribble>
              </p>
              <p className="max-w-sm text-sm">No pieces match all of those filters. Loosen one or two and the crate refills.</p>
              <Button variant="dust" onClick={reset}>
                Reset filters
              </Button>
            </div>
          )}
        </section>
      </div>

      {sheet && (
        <div ref={dialogRef} className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" aria-label="Close filters" tabIndex={-1} className="absolute inset-0 bg-lyons/60" onClick={() => setSheet(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-3xl border-2 border-lyons bg-paper shadow-hard-lg">
            <div className="flex items-center justify-between border-b-2 border-lyons px-5 py-3">
              <h2 className="font-display text-xl uppercase">Filters</h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setSheet(false)}
                className="inline-flex min-h-11 items-center px-2 font-pixel text-xs font-bold uppercase tracking-widest underline decoration-2 underline-offset-4"
              >
                Close
              </button>
            </div>
            <div className="overflow-y-auto p-5">
              <FilterPanel filters={filters} onChange={setFilters} onReset={reset} />
            </div>
            <div className="border-t-2 border-lyons p-4">
              <Button className="w-full" variant="yellow" onClick={() => setSheet(false)}>
                Show {results.length} {results.length === 1 ? "piece" : "pieces"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
