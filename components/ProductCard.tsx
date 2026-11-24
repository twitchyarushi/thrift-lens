"use client";

import Link from "next/link";
import { Badge, Button, PriceTag, ScoreTag, buttonClasses, pressableSm } from "@/components/ui";
import { ProductImage } from "@/components/ProductImage";
import { cn } from "@/lib/cn";
import { productScore } from "@/lib/score";
import { toneBg, type Tone } from "@/lib/tone";
import { type Product, type Slot } from "@/lib/types";
import { useStore } from "@/store";

/** Default picture-area colour per slot. */
export const SLOT_TONE: Record<Slot, Tone> = {
  top: "mikado",
  bottom: "fanfare",
  outerwear: "dust",
  shoes: "flat",
  bag: "mikado",
};

type Props = {
  product: Product;
  /** background of the picture area (defaults to the slot's colour) */
  tone?: Tone;
  className?: string;
};

export function ProductCard({ product: p, tone, className }: Props) {
  const { hydrated, toggleWishlist, isWishlisted, addToCart, cart } = useStore();
  const wished = hydrated && isWishlisted(p.id);
  const inCart = hydrated && cart.some((i) => i.productId === p.id);
  const oneOff = p.source === "secondhand";
  const singleSize = p.sizes.length === 1;
  const badge = p.source === "secondhand" ? "preloved" : p.source === "local" ? "local" : "new";
  const href = `/product/${p.id}`;

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl border-2 border-lyons bg-paper shadow-hard",
        "transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg",
        className,
      )}
    >
      <div className="relative">
        <Link
          href={href}
          aria-label={`${p.name}, score ${productScore(p)} out of 100`}
          className={cn(
            "relative flex h-48 items-center justify-center rounded-t-[0.9rem] border-b-2 border-lyons",
            toneBg[tone ?? SLOT_TONE[p.slot]],
          )}
        >
          <ProductImage
            product={p}
            className="absolute inset-0 p-3 transition-transform duration-150 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3">
            <Badge variant={badge} />
          </span>
        </Link>
        <div className="pointer-events-none absolute -top-1 right-3">
          <ScoreTag score={productScore(p)} size="sm" />
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(p.id)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
          className={cn(
            "absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-lyons bg-paper shadow-hard-sm",
            pressableSm,
          )}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path
              d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11Z"
              className={cn("stroke-lyons", wished ? "fill-red" : "fill-paper")}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="font-pixel text-[10px] font-bold uppercase tracking-widest">
          {p.brand} / {p.city}
        </p>
        <h3 className="font-display text-base leading-tight">
          <Link href={href} className="py-1 hover:underline">
            {p.name}
          </Link>
        </h3>
        <div className="mt-auto flex flex-col gap-3 pt-3">
          <PriceTag price={p.price} was={p.mrpNew} />
          {singleSize ? (
            <Button
              size="sm"
              variant="green"
              className="w-full"
              disabled={oneOff && inCart}
              onClick={() => addToCart(p.id, p.sizes[0])}
              aria-label={`Add ${p.name} to cart`}
            >
              {oneOff && inCart ? "In cart ✓" : "Add to cart"}
            </Button>
          ) : (
            <Link href={href} className={buttonClasses("green", "sm", "w-full")}>
              Pick a size
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
