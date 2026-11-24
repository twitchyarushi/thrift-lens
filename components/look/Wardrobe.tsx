"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui";
import { formatINR } from "@/lib/format";
import { greenerSwap } from "@/lib/greenerSwap";
import { bundleImpact } from "@/lib/impact";
import { lookSlotProducts } from "@/lib/looks";
import { productScore } from "@/lib/score";
import { SLOTS, type Look, type Product, type Slot } from "@/lib/types";
import { useUploadSession } from "@/lib/uploadSession";
import { useStore } from "@/store";
import { ClosetSlot, type Tab } from "./ClosetSlot";
import { LookPhoto } from "./LookPhoto";

type SlotState = { tab: Tab; idx: number; swap?: Product };

/** Leopard-style spots from palette colours only: lyons rim + dust centre, two offset rows. */
const LEOPARD: CSSProperties = {
  backgroundColor: "var(--color-mikado)",
  backgroundImage: [
    "radial-gradient(ellipse 7px 5px at 10px 10px, var(--color-lyons) 96%, transparent 100%)",
    "radial-gradient(ellipse 5px 3.5px at 11px 11px, var(--color-dust) 96%, transparent 100%)",
    "radial-gradient(ellipse 7px 5px at 10px 10px, var(--color-lyons) 96%, transparent 100%)",
    "radial-gradient(ellipse 5px 3.5px at 11px 11px, var(--color-dust) 96%, transparent 100%)",
    "radial-gradient(circle 1.6px at 31px 7px, var(--color-lyons) 96%, transparent 100%)",
  ].join(", "),
  backgroundSize: "40px 40px",
  backgroundPosition: "0 0, 0 0, 20px 22px, 20px 22px, 0 0",
};

const matchesTab = (p: Product, tab: Tab) => tab === "best" || p.source === tab;

const initialSlots = (): Record<Slot, SlotState> =>
  Object.fromEntries(SLOTS.map((s) => [s, { tab: "best", idx: 0 }])) as Record<Slot, SlotState>;

export function Wardrobe({ look }: { look: Look }) {
  const { hydrated, cart, addToCart, toggleSavedLook, isLookSaved } = useStore();
  const session = useUploadSession();
  const activeLook = session?.lookId === look.id && session.matchedLook ? session.matchedLook : look;
  // Description-based looks do not contain an uploaded photo.

  const matches = useMemo(
    () => Object.fromEntries(SLOTS.map((s) => [s, lookSlotProducts(activeLook, s)])) as Record<Slot, Product[]>,
    [activeLook],
  );
  const [slots, setSlots] = useState<Record<Slot, SlotState>>(initialSlots);
  const [active, setActive] = useState<Slot | null>(null);
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ text: string; cart: boolean } | null>(null);

  const listFor = (slot: Slot, tab: Tab) => matches[slot].filter((p) => matchesTab(p, tab));
  const currentFor = (slot: Slot): Product | undefined => {
    const st = slots[slot];
    return st.swap ?? listFor(slot, st.tab)[st.idx];
  };
  const sizeFor = (p: Product) => sizes[p.id] ?? p.sizes[0];

  const patch = (slot: Slot, next: SlotState) => setSlots((prev) => ({ ...prev, [slot]: next }));

  const current = SLOTS.map((s) => ({ slot: s, product: currentFor(s) }));
  const picked = current.flatMap((c) => (c.product ? [c.product] : []));
  const total = picked.reduce((n, p) => n + p.price, 0);
  const impact = bundleImpact(picked.map((product) => ({ product, qty: 1 })));
  const saved = hydrated && isLookSaved(activeLook.id);
  const inCart = (p?: Product) => hydrated && !!p && cart.some((i) => i.productId === p.id);

  function focusSlot(slot: Slot) {
    setActive(slot);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(`slot-${slot}`)?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }

  function cycle(slot: Slot, dir: 1 | -1) {
    const st = slots[slot];
    const n = listFor(slot, st.tab).length;
    if (n < 2) return;
    patch(slot, { tab: st.tab, idx: (st.idx + dir + n) % n });
  }

  function dressMe() {
    setSlots(() => {
      const next = initialSlots();
      for (const s of SLOTS) {
        if (matches[s].length === 0) {
          next[s] = { tab: "best", idx: 0 };
          continue;
        }
        let best = 0;
        matches[s].forEach((p, i) => {
          if (productScore(p) > productScore(matches[s][best])) best = i;
        });
        next[s] = { tab: "best", idx: best };
      }
      return next;
    });
    setNotice({ text: "Dressed in the highest-scoring pick for every slot.", cart: false });
  }

  function add(slot: Slot) {
    const p = currentFor(slot);
    if (!p) return;
    addToCart(p.id, sizeFor(p));
    setNotice({ text: `${p.name} added to your cart.`, cart: true });
  }

  function addAll() {
    if (picked.length === 0) return;
    picked.forEach((p) => addToCart(p.id, sizeFor(p)));
    setNotice({ text: `${picked.length} pieces added to your cart.`, cart: true });
  }

  const words = activeLook.title.split(" ");
  const last = words.pop();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/upload" className="inline-flex min-h-11 items-center font-pixel text-xs font-bold uppercase tracking-widest underline decoration-2 underline-offset-4">
        ← Scan another look
      </Link>
      <header className="mb-6 mt-1">
        <p className="font-pixel text-[11px] font-bold uppercase tracking-widest">{activeLook.celebLabel}</p>
        <h1 className="font-display text-4xl uppercase leading-none sm:text-5xl">
          {words.join(" ")} <span className="font-serif font-bold normal-case italic text-red">{last}</span>
        </h1>
        <p className="mt-2 text-base">{activeLook.vibe}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="mx-auto w-full max-w-md self-start lg:sticky lg:top-24 lg:max-w-none">
          <LookPhoto
            look={activeLook}
            products={picked}
            showPins
            activeSlot={active}
            onPin={focusSlot}
          />
          <p className="mt-3 font-pixel text-[11px] font-bold uppercase tracking-widest">
            {activeLook.id === "description-results" ? "Your selected pieces · Live outfit preview" : "Sample look · Tap a pin to jump to that piece"}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border-2 border-lyons bg-paper shadow-hard-lg">
          <div className="on-dark flex items-center gap-2 border-b-2 border-lyons bg-lyons px-3 py-2 font-pixel text-xs font-bold uppercase tracking-widest text-paper">
            <span className="h-3 w-3 rounded-full border-2 border-paper bg-dust" aria-hidden />
            <span className="h-3 w-3 rounded-full border-2 border-paper bg-mikado" aria-hidden />
            <span className="h-3 w-3 rounded-full border-2 border-paper bg-flat" aria-hidden />
            <span className="ml-2">closet.exe</span>
          </div>
          <div className="flex">
            <div className="w-3 shrink-0 border-r-2 border-lyons sm:w-7" style={LEOPARD} aria-hidden />
            <div className="min-w-0 flex-1 p-3 sm:p-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-pixel text-2xl font-bold uppercase tracking-widest">My closet</h2>
                  <p className="font-pixel text-[10px] font-bold uppercase tracking-wider">
                    Pick, swap, or let us dress you
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="md" variant="dust" onClick={dressMe}>
                    Dress Me
                  </Button>
                  <Button size="md" variant={saved ? "green" : "paper"} aria-pressed={saved} onClick={() => toggleSavedLook(activeLook.id)}>
                    {saved ? "Saved ✓" : "Save look"}
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                {SLOTS.map((slot, i) => {
                  const st = slots[slot];
                  const list = listFor(slot, st.tab);
                  const p = currentFor(slot);
                  const g = p ? greenerSwap(p) : undefined;
                  return (
                    <ClosetSlot
                      key={slot}
                      slot={slot}
                      number={i + 1}
                      product={p}
                      tab={st.tab}
                      position={st.idx}
                      listLength={list.length}
                      counts={{
                        best: matches[slot].length,
                        secondhand: matches[slot].filter((m) => m.source === "secondhand").length,
                        local: matches[slot].filter((m) => m.source === "local").length,
                      }}
                      size={p ? sizeFor(p) : ""}
                      active={active === slot}
                      inCart={inCart(p)}
                      swapped={!!st.swap}
                      greener={g}
                      onTab={(tab) => patch(slot, { tab, idx: 0 })}
                      onCycle={(dir) => cycle(slot, dir)}
                      onSize={(size) => p && setSizes((prev) => ({ ...prev, [p.id]: size }))}
                      onAdd={() => add(slot)}
                      onSwap={() => g && patch(slot, { ...st, swap: g })}
                      onUndoSwap={() => patch(slot, { tab: st.tab, idx: st.idx })}
                    />
                  );
                })}
              </div>

              <div className="on-dark mt-5 rounded-2xl border-2 border-lyons bg-lyons p-4 text-paper">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="font-pixel text-[11px] font-bold uppercase tracking-widest">
                      Whole look ({picked.length}/{SLOTS.length} pieces)
                    </p>
                    <p className="font-display text-3xl leading-none">{formatINR(total)}</p>
                    <p className="mt-1 text-sm">
                      Save {formatINR(impact.inrSaved)} vs new · about {impact.kgCO2} kg CO₂ saved{" "}
                      <span className="font-pixel text-[10px] uppercase">(estimate)</span>
                    </p>
                  </div>
                  <Button variant="yellow" size="md" onClick={addAll} disabled={picked.length === 0}>
                    Add whole look
                  </Button>
                </div>
                <p role="status" className="mt-3 min-h-5 text-sm font-bold">
                  {notice?.text}{" "}
                  {notice?.cart && (
                    <Link href="/cart" className="inline-flex min-h-11 items-center underline decoration-2 underline-offset-2">
                      View cart →
                    </Link>
                  )}
                </p>
              </div>
            </div>
            <div className="w-3 shrink-0 border-l-2 border-lyons sm:w-7" style={LEOPARD} aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}

