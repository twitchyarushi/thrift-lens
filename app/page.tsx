import { CategoryStrip } from "@/components/home/CategoryStrip";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ValueProps } from "@/components/home/ValueProps";
import { LookCard } from "@/components/LookCard";
import { ProductCard } from "@/components/ProductCard";
import { Button, Garment, Marquee, Sticker, Vinyl, WaveDivider } from "@/components/ui";
import { LOOKS } from "@/lib/looks";
import { getProduct } from "@/lib/products";
import type { Tone } from "@/lib/tone";
import type { Product } from "@/lib/types";

// Hand-picked mix of second-hand, local and new so the row shows every badge.
const NEW_IN = ["p17", "p07", "p22", "p06"]
  .map(getProduct)
  .filter((p): p is Product => Boolean(p));
const CARD_TONES: Tone[] = ["mikado", "fanfare", "dust", "flat"];
const LOOK_TONES: Tone[] = ["fanfare", "dust", "flat"];

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoryStrip />

      <Marquee items={["NEW IN", "JUST DROPPED", "NEW IN", "ONE OF ONE"]} tone="dust" size="lg" separator="✺" />

      <section aria-labelledby="new-title" className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <h2 id="new-title" className="font-display text-3xl uppercase sm:text-4xl">
            Fresh to the <span className="font-serif font-bold normal-case italic">crate</span>
          </h2>
          <Button href="/browse" size="sm" variant="blue">
            See all
          </Button>
        </div>
        <ul className="grid grid-cols-1 gap-8 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {NEW_IN.map((p, i) => (
            <li key={p.id} className="flex">
              <ProductCard product={p} tone={CARD_TONES[i % CARD_TONES.length]} className="w-full" />
            </li>
          ))}
        </ul>
      </section>

      <HowItWorks />

      <section aria-labelledby="looks-title" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-8 text-center">
          <h2 id="looks-title" className="font-display text-3xl uppercase sm:text-4xl">
            Shop the <span className="font-serif font-bold normal-case italic">look</span>
          </h2>
          <p className="mt-2 text-sm">Whole outfits, pre-split into their greenest pieces.</p>
        </div>
        <ul className="grid gap-8 pt-4 md:grid-cols-3">
          {LOOKS.slice(0, 3).map((l, i) => (
            <li key={l.id} className="flex">
              <LookCard look={l} tone={LOOK_TONES[i % LOOK_TONES.length]} className="w-full" />
            </li>
          ))}
        </ul>
      </section>

      <ValueProps />

      <div className="bg-mikado">
        <WaveDivider tone="fanfare" />
        <section aria-labelledby="sell-title" className="relative mx-auto max-w-5xl overflow-hidden px-4 pb-16 pt-6">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <h2 id="sell-title" className="font-display text-3xl uppercase leading-tight sm:text-5xl">
                Got <span className="font-serif font-bold normal-case italic text-red">pre-loved</span> pieces
                <br />
                gathering dust?
              </h2>
              <p className="mt-3 max-w-md text-base">
                List them in two minutes. Someone out there is hunting for exactly that jacket.
              </p>
              <div className="mt-6">
                <Button href="/sell" size="lg" variant="red">
                  Sell your pre-loved pieces
                </Button>
              </div>
            </div>
            <div className="relative mx-auto h-48 w-64" aria-hidden>
              <Vinyl tone="lyons" label="red" size="9rem" spin className="absolute right-0 top-0" />
              <Sticker size="md" rotate={-8} className="absolute bottom-0 left-0 w-28">
                <Garment type="dress" color="lilac" />
              </Sticker>
              <Sticker size="md" rotate={7} className="absolute bottom-2 right-4 w-20">
                <Garment type="hat" color="forest" />
              </Sticker>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
