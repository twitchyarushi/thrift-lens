import Link from "next/link";
import { Garment, Sticker } from "@/components/ui";
import { toneBg, type Tone } from "@/lib/tone";
import { SLOT_GARMENT, SLOT_LABEL, SLOTS, type Slot } from "@/lib/types";
import { cn } from "@/lib/cn";

const LOOK: Record<Slot, { color: string; tone: Tone; rotate: number }> = {
  top: { color: "mustard", tone: "fanfare", rotate: -4 },
  bottom: { color: "denim", tone: "dust", rotate: 3 },
  outerwear: { color: "forest", tone: "mikado", rotate: -2 },
  shoes: { color: "cream", tone: "flat", rotate: 4 },
  bag: { color: "rust", tone: "fanfare", rotate: -3 },
};

export function CategoryStrip() {
  return (
    <section aria-label="Shop by category" className="mx-auto max-w-6xl px-4 pb-12">
      <ul className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 pt-2 sm:justify-center">
        {SLOTS.map((s) => (
          <li key={s} className="shrink-0 snap-start">
            <Link href={`/browse?slot=${s}`} className="group flex flex-col items-center gap-3">
              <span
                className={cn(
                  "flex h-28 w-28 items-center justify-center rounded-full border-2 border-lyons shadow-hard transition-all duration-150 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-hard-lg group-active:translate-x-0.5 group-active:translate-y-0.5 group-active:shadow-none",
                  toneBg[LOOK[s].tone],
                )}
              >
                <Sticker size="sm" rotate={LOOK[s].rotate} className="w-16">
                  <Garment type={SLOT_GARMENT[s]} color={LOOK[s].color} />
                </Sticker>
              </span>
              <span className="rounded-full border-2 border-lyons bg-paper px-3 py-0.5 font-pixel text-[11px] font-bold uppercase tracking-widest">
                {SLOT_LABEL[s]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
