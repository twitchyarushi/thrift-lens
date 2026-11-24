"use client";

import Link from "next/link";
import { Badge, Button, PriceTag, Vinyl } from "@/components/ui";
import { ProductImage } from "@/components/ProductImage";
import { formatINR } from "@/lib/format";
import { bundleImpact } from "@/lib/impact";
import { useStore } from "@/store";
import { PageLoading } from "@/components/shell/PageLoading";
import { ImpactStrip } from "./ImpactStrip";
import { QtyStepper } from "./QtyStepper";

export function CartView() {
  const { hydrated, cartLines, cartCount, cartTotal, setCartQty, removeFromCart } = useStore();

  if (!hydrated) {
    return <PageLoading label="Emptying your pockets..." />;
  }

  if (cartLines.length === 0) {
    return (
      <div className="relative mt-8 overflow-hidden rounded-3xl border-2 border-lyons bg-mikado p-8 text-center shadow-hard-lg sm:p-12">
        <Vinyl tone="lyons" label="red" size="12rem" className="absolute -left-10 -top-10 opacity-90" />
        <div className="relative">
          <h2 className="font-display text-3xl uppercase">Your cart is empty</h2>
          <p className="mx-auto mt-2 max-w-md font-bold">Scan an outfit or dig through the racks and add something pre-loved.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/upload" variant="dust">
              Scan an outfit
            </Button>
            <Button href="/browse" variant="paper">
              Browse
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const impact = bundleImpact(cartLines);

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
      <ul className="flex flex-col gap-4">
        {cartLines.map(({ product: p, size, qty, lineTotal }) => (
          <li
            key={`${p.id}-${size}`}
            className="flex gap-4 rounded-3xl border-2 border-lyons bg-paper p-3 shadow-hard sm:p-4"
          >
            <Link
              href={`/product/${p.id}`}
              aria-label={`View ${p.name}`}
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-lyons bg-mikado sm:h-32 sm:w-32"
            >
              <ProductImage product={p} className="h-full w-full rounded-xl p-2" />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link href={`/product/${p.id}`} className="font-display text-lg uppercase leading-tight [overflow-wrap:anywhere] underline-offset-4 hover:underline">
                    {p.name}
                  </Link>
                  <p className="mt-0.5 text-sm">
                    {p.brand} · Size {size}
                  </p>
                </div>
                <Badge variant={p.source === "secondhand" ? "preloved" : p.source === "local" ? "local" : "new"} />
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                {p.source === "secondhand" ? (
                  <span className="font-pixel text-[11px] font-bold uppercase tracking-wider">One of a kind, qty 1</span>
                ) : (
                  <QtyStepper label={p.name} value={qty} max={10} onChange={(n) => setCartQty(p.id, size, n)} />
                )}
                <div className="flex items-center gap-3">
                  {qty > 1 && <span className="text-xs font-bold">{formatINR(p.price)} each</span>}
                  <PriceTag price={lineTotal} size="sm" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeFromCart(p.id, size)}
                aria-label={`Remove ${p.name} from cart`}
                className="-my-1 inline-flex min-h-11 items-center self-start font-pixel text-[11px] font-bold uppercase tracking-wider underline decoration-2 underline-offset-4 hover:text-red"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <aside aria-label="Order summary" className="flex flex-col gap-4 self-start lg:sticky lg:top-6">
        <ImpactStrip impact={impact} />
        <div className="rounded-3xl border-2 border-lyons bg-paper p-5 shadow-hard">
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt>
                Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})
              </dt>
              <dd className="font-bold">{formatINR(cartTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd className="font-bold">Free</dd>
            </div>
          </dl>
          <div className="mt-3 flex items-baseline justify-between border-t-2 border-dashed border-lyons pt-3">
            <span className="font-display text-lg uppercase">Total</span>
            <span className="font-display text-2xl">{formatINR(cartTotal)}</span>
          </div>
          <Button href="/checkout" variant="dust" size="lg" className="mt-4 w-full">
            Checkout
          </Button>
          <Link
            href="/browse"
            className="mt-1 flex min-h-11 items-center justify-center text-center font-pixel text-[11px] font-bold uppercase tracking-wider underline decoration-2 underline-offset-4"
          >
            Keep browsing
          </Link>
        </div>
      </aside>
    </div>
  );
}
