import Link from "next/link";
import { PriceTag, ScoreTag, buttonClasses } from "@/components/ui";
import { ProductImage } from "@/components/ProductImage";
import { cn } from "@/lib/cn";
import { lookBestMatches } from "@/lib/looks";
import { productScore } from "@/lib/score";
import { toneBg, type Tone } from "@/lib/tone";
import { type Look } from "@/lib/types";

type Props = { look: Look; tone?: Tone; className?: string };

const TILT = [-4, 3, -2, 4, -3];

export function LookCard({ look, tone = "fanfare", className }: Props) {
  const pieces = lookBestMatches(look);
  const total = pieces.reduce((n, p) => n + p.price, 0);
  const was = pieces.reduce((n, p) => n + p.mrpNew, 0);
  const score = Math.round(pieces.reduce((n, p) => n + productScore(p), 0) / Math.max(1, pieces.length));

  return (
    <Link
      href={`/look/${look.id}`}
      className={cn(
        "group relative flex flex-col rounded-2xl border-2 border-lyons bg-paper shadow-hard",
        "transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg",
        className,
      )}
    >
      <div className={cn("relative rounded-t-[0.9rem] border-b-2 border-lyons px-3 pb-5 pt-8", toneBg[tone])}>
        <div className="grid grid-cols-5 items-end gap-1.5">
          {pieces.map((p, i) => (
            <ProductImage key={p.id} product={p} className="aspect-square w-full rounded-lg border border-lyons bg-paper p-1" />
          ))}
        </div>
        <div className="absolute right-3 -top-1">
          <ScoreTag score={score} size="sm" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-pixel text-[10px] font-bold uppercase tracking-widest">{look.celebLabel}</p>
        <h3 className="font-display text-xl leading-tight">{look.title}</h3>
        <p className="text-sm">{look.vibe}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <PriceTag price={total} was={was} />
          <span className={buttonClasses("yellow", "sm")}>Shop it</span>
        </div>
      </div>
    </Link>
  );
}
