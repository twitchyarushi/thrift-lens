import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BuyBox } from "@/components/product/BuyBox";
import { ScorePanel } from "@/components/product/ScorePanel";
import { ProductCard, SLOT_TONE } from "@/components/ProductCard";
import { PageLoading } from "@/components/shell/PageLoading";
import { ProductImage } from "@/components/ProductImage";
import { Badge, Button, PriceTag, ScoreTag, Sticker, Vinyl } from "@/components/ui";
import { completeTheLook } from "@/lib/completeLook";
import { formatINR } from "@/lib/format";
import { greenerSwap } from "@/lib/greenerSwap";
import { productImpact } from "@/lib/impact";
import { PRODUCTS, getProduct } from "@/lib/products";
import { productScore } from "@/lib/score";
import { toneBg } from "@/lib/tone";
import { SLOT_LABEL, type Product } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = getProduct(id);
  return { title: p ? `${p.name} / Thrift Lens` : "Product not found / Thrift Lens" };
}

const nice = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ");

function SellerLine({ p }: { p: Product }) {
  return (
    <p className="flex flex-wrap items-center gap-2 text-sm">
      <Badge variant={p.source === "secondhand" ? "preloved" : p.source === "local" ? "local" : "new"} />
      {p.source === "secondhand" && (
        <span>
          Pre-loved, sold by <strong>{p.seller}</strong>, a thrift partner in {p.city}.
        </span>
      )}
      {p.source === "local" && (
        <span>
          Made by <strong>{p.seller}</strong> in {p.city}
          {p.distanceKm !== undefined && `, about ${p.distanceKm} km from Pune`}.
        </span>
      )}
      {p.source === "new" && (
        <span>
          Sold new by <strong>{p.seller}</strong>, {p.city}.
        </span>
      )}
    </p>
  );
}

function SwapCard({ p }: { p: Product }) {
  const g = greenerSwap(p);
  if (!g) {
    return (
      <section aria-labelledby="swap-title" className="rounded-3xl border-2 border-lyons bg-mikado p-5 shadow-hard">
        <h2 id="swap-title" className="font-display text-xl uppercase">
          Greener swap
        </h2>
        <p className="mt-1 text-sm font-bold">Nothing greener fits nearby on price. This is already the best pick for its slot.</p>
      </section>
    );
  }
  const delta = productScore(g) - productScore(p);
  const priceDiff = g.price - p.price;
  const co2 = Math.round((productImpact(g).kgCO2 - productImpact(p).kgCO2) * 10) / 10;
  return (
    <section aria-labelledby="swap-title" className="rounded-3xl border-2 border-lyons bg-fanfare p-5 text-paper shadow-hard">
      <h2 id="swap-title" className="font-display text-xl uppercase">
        Greener swap
      </h2>
      <div className="mt-3 flex items-center gap-4">
        <div className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border-2 border-lyons ${toneBg.mikado}`}>
          <ProductImage product={g} className="h-28 w-28 shrink-0 rounded-xl" imageClassName="p-2" />
        </div>
        <div className="min-w-0 text-sm">
          <p className="font-display text-base leading-tight">{g.name}</p>
          <p className="mt-1">
            Score {productScore(g)} (+{delta}) ·{" "}
            {priceDiff === 0 ? "same price" : priceDiff > 0 ? `${formatINR(priceDiff)} more` : `${formatINR(-priceDiff)} less`}
          </p>
          {co2 > 0 && <p className="mt-0.5">About {co2} kg more CO₂ avoided (estimate).</p>}
        </div>
      </div>
      <div className="mt-4">
        <Button href={`/product/${g.id}`} variant="yellow" size="sm">
          See the swap
        </Button>
      </div>
    </section>
  );
}

async function ProductContent({ params }: Props) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) notFound();

  const { look, pieces } = completeTheLook(p);
  const tone = SLOT_TONE[p.slot];
  const stickerLabel = p.source === "secondhand" ? "1 of 1" : p.source === "local" ? "Made local" : "New in";
  const stickerBg = p.source === "secondhand" ? "bg-red text-paper" : p.source === "local" ? "bg-flat text-paper" : "bg-mikado text-lyons";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <Link
        href={`/browse?slot=${p.slot}`}
        className="inline-flex min-h-11 items-center font-pixel text-xs font-bold uppercase tracking-widest underline decoration-2 underline-offset-4"
      >
        ← Back to {SLOT_LABEL[p.slot]}
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-2">
        <div className={`relative mx-auto flex aspect-square w-full max-w-lg items-center justify-center overflow-hidden rounded-3xl lg:max-w-none border-2 border-lyons shadow-hard-lg ${toneBg[tone]}`}>
          <Vinyl tone="lyons" label="mikado" size="65%" spin className="absolute -right-[12%] -top-[10%]" />
          <Vinyl tone="paper" label="red" size="32%" className="absolute -bottom-[6%] -left-[6%]" />
          <ProductImage product={p} className="absolute inset-0 z-10 p-10 sm:p-14" />
          <div className="absolute bottom-5 right-5">
            <Sticker size="md" rotate={9}>
              <div className={`flex h-20 w-20 items-center justify-center rounded-full border-2 border-lyons text-center font-display text-xs uppercase leading-tight ${stickerBg}`}>
                {stickerLabel}
              </div>
            </Sticker>
          </div>
          <div className="absolute left-5 top-3">
            <ScoreTag score={productScore(p)} size="md" />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="font-pixel text-xs font-bold uppercase tracking-widest">
              {p.brand} / {p.category}
            </p>
            <h1 className="mt-1 font-display text-4xl uppercase leading-none [overflow-wrap:anywhere] sm:text-5xl">{p.name}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <PriceTag price={p.price} was={p.mrpNew} size="lg" />
            {p.mrpNew > p.price && (
              <span className="text-sm font-bold">
                Save {formatINR(p.mrpNew - p.price)} vs new ({Math.round(((p.mrpNew - p.price) / p.mrpNew) * 100)}% off)
              </span>
            )}
          </div>

          <SellerLine p={p} />
          <BuyBox key={p.id} product={p} />

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-2xl border-2 border-lyons p-4 text-sm">
            <dt className="font-pixel text-[11px] font-bold uppercase tracking-wider">Material</dt>
            <dd>{p.material}</dd>
            <dt className="font-pixel text-[11px] font-bold uppercase tracking-wider">Made in</dt>
            <dd>{p.origin}</dd>
            {p.condition && (
              <>
                <dt className="font-pixel text-[11px] font-bold uppercase tracking-wider">Condition</dt>
                <dd>{nice(p.condition)}</dd>
              </>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <ScorePanel product={p} />
        <SwapCard p={p} />
      </div>

      <section aria-labelledby="complete-title" className="mt-14">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 id="complete-title" className="font-display text-3xl uppercase sm:text-4xl">
            Complete the <span className="font-serif font-bold normal-case italic text-red">look</span>
          </h2>
          <Button href={`/look/${look.id}`} size="sm" variant="blue">
            Open {look.title}
          </Button>
        </div>
        <ul className="-mx-4 flex snap-x gap-6 overflow-x-auto px-4 pb-6 pt-4">
          {pieces.map((piece) => (
            <li key={piece.id} className="flex w-64 shrink-0 snap-start">
              <ProductCard product={piece} className="w-full" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function ProductPage({ params }: Props) {
  return (
    <main>
      <Suspense fallback={<PageLoading label="Pulling it off the rack..." />}>
        <ProductContent params={params} />
      </Suspense>
    </main>
  );
}
