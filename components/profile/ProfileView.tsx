"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ProductCard } from "@/components/ProductCard";
import { PageLoading } from "@/components/shell/PageLoading";
import { Button, pressableSm } from "@/components/ui";
import { cn } from "@/lib/cn";
import { PRODUCT_BY_ID } from "@/lib/products";
import type { Impact } from "@/lib/types";
import { useStore } from "@/store";
import { ImpactCounter } from "./ImpactCounter";
import { MoodBoard } from "./MoodBoard";
import { OrdersList } from "./OrdersList";

type TabId = "looks" | "wishlist" | "orders";

function Wishlist() {
  const { wishlist } = useStore();
  const products = wishlist.flatMap((id) => (PRODUCT_BY_ID[id] ? [PRODUCT_BY_ID[id]] : []));
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-lyons bg-mikado p-8 text-center shadow-hard">
        <h2 className="font-display text-2xl uppercase">Wishlist is empty</h2>
        <p className="mt-2 font-bold">Tap the heart on anything you want to come back to.</p>
        <Button href="/browse" variant="dust" className="mt-5">
          Browse
        </Button>
      </div>
    );
  }
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <li key={p.id} className="flex">
          <ProductCard product={p} className="w-full" />
        </li>
      ))}
    </ul>
  );
}

export function ProfileView() {
  const { hydrated, orders, savedLooks, wishlist } = useStore();
  const [tab, setTab] = useState<TabId>("looks");
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ looks: null, wishlist: null, orders: null });

  if (!hydrated) {
    return <PageLoading label="Opening your closet..." />;
  }

  const lifetime: Impact = orders.reduce(
    (acc, o) => ({
      kgCO2: acc.kgCO2 + o.impact.kgCO2,
      litresWater: acc.litresWater + o.impact.litresWater,
      inrSaved: acc.inrSaved + o.impact.inrSaved,
    }),
    { kgCO2: 0, litresWater: 0, inrSaved: 0 },
  );

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: "looks", label: "Saved looks", count: savedLooks.length },
    { id: "wishlist", label: "Wishlist", count: wishlist.length },
    { id: "orders", label: "Orders", count: orders.length },
  ];

  const onKey = (e: KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" ? (i + 1) % tabs.length : e.key === "ArrowLeft" ? (i + tabs.length - 1) % tabs.length : -1;
    if (next < 0) return;
    e.preventDefault();
    setTab(tabs[next].id);
    tabRefs.current[tabs[next].id]?.focus();
  };

  return (
    <div className="mt-6 flex flex-col gap-8">
      <ImpactCounter impact={lifetime} orders={orders.length} />

      <div>
        <div role="tablist" aria-label="Your stuff" className="flex flex-wrap gap-2">
          {tabs.map((t, i) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[t.id] = el;
                }}
                id={`tab-${t.id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${t.id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "min-h-11 rounded-full border-2 border-lyons px-4 py-2 font-display text-sm uppercase shadow-hard-sm",
                  pressableSm,
                  active ? "bg-lyons text-paper" : "bg-paper text-lyons hover:bg-mikado",
                )}
              >
                {t.label} <span className="font-pixel text-[11px]">({t.count})</span>
              </button>
            );
          })}
        </div>

        <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0} className="mt-6">
          {tab === "looks" && <MoodBoard />}
          {tab === "wishlist" && <Wishlist />}
          {tab === "orders" && <OrdersList />}
        </div>
      </div>
    </div>
  );
}
