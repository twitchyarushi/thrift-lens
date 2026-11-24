"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, pressableSm } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/types";
import { useStore } from "@/store";

function Step({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled: boolean; children: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full border-2 border-lyons bg-mikado font-display text-xl leading-none shadow-hard-sm",
        pressableSm,
        "disabled:pointer-events-none disabled:opacity-40",
      )}
    >
      {children}
    </button>
  );
}

export function BuyBox({ product: p }: { product: Product }) {
  const { hydrated, addToCart, cart, toggleWishlist, isWishlisted } = useStore();
  const [size, setSize] = useState(p.sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState<number | null>(null);

  const oneOff = p.source === "secondhand";
  const maxQty = oneOff ? 1 : 10;
  const wished = hydrated && isWishlisted(p.id);
  const inCartQty = hydrated ? cart.filter((i) => i.productId === p.id).reduce((n, i) => n + i.qty, 0) : 0;
  const blocked = oneOff && inCartQty > 0;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p id="size-label" className="mb-2 font-pixel text-xs font-bold uppercase tracking-widest">
          Size
        </p>
        <div role="group" aria-labelledby="size-label" className="flex flex-wrap gap-2">
          {p.sizes.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={size === s}
              onClick={() => setSize(s)}
              className={cn(
                "min-h-11 min-w-12 rounded-full border-2 border-lyons px-4 py-1.5 font-pixel text-xs font-bold uppercase shadow-hard-sm",
                pressableSm,
                size === s ? "bg-lyons text-paper" : "bg-paper text-lyons hover:bg-mikado",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p id="qty-label" className="mb-2 font-pixel text-xs font-bold uppercase tracking-widest">
          Quantity
        </p>
        <div role="group" aria-labelledby="qty-label" className="flex items-center gap-3">
          <Step label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
            −
          </Step>
          <span aria-live="polite" className="w-8 text-center font-display text-2xl">
            {qty}
          </span>
          <Step label="Increase quantity" disabled={qty >= maxQty} onClick={() => setQty((q) => Math.min(maxQty, q + 1))}>
            +
          </Step>
          {oneOff && <span className="font-pixel text-[11px] font-bold uppercase tracking-wider">One of a kind, only 1</span>}
        </div>
      </div>

      <Button
        size="lg"
        variant="dust"
        className="w-full py-5 text-xl"
        disabled={blocked}
        onClick={() => {
          addToCart(p.id, size, qty);
          setAdded(qty);
        }}
      >
        {blocked ? "In your cart ✓" : "Add to cart"}
      </Button>

      <Button
        variant={wished ? "red" : "paper"}
        size="md"
        aria-pressed={wished}
        onClick={() => toggleWishlist(p.id)}
        className="w-full"
      >
        {wished ? "♥ Saved to wishlist" : "♡ Save to wishlist"}
      </Button>

      <p role="status" className="min-h-5 text-sm font-bold">
        {added !== null && (
          <>
            {added} added to your cart.{" "}
            <Link href="/cart" className="inline-flex min-h-11 items-center underline decoration-2 underline-offset-2">
              View cart →
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
