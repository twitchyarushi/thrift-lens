"use client";

import Link from "next/link";
import { useState } from "react";
import { ScoreTag } from "@/components/ui";
import { cn } from "@/lib/cn";
import { FACTORS, explainFactor, productScore, scoreVerdict } from "@/lib/score";
import { scoreTone, toneBg } from "@/lib/tone";
import type { Product } from "@/lib/types";

const face = "col-start-1 row-start-1 rounded-3xl border-2 border-lyons bg-paper p-5 shadow-hard [backface-visibility:hidden]";

/** Click the thrift tag to flip the card and see the four factors behind the score. */
export function ScorePanel({ product: p }: { product: Product }) {
  const [flipped, setFlipped] = useState(false);
  const score = productScore(p);

  return (
    <section aria-labelledby="score-title" className="[perspective:1200px]">
      <div className={cn("grid transition-transform duration-500 [transform-style:preserve-3d]", flipped && "[transform:rotateY(180deg)]")}>
        <div className={face} inert={flipped}>
          <h2 id="score-title" className="mb-3 font-pixel text-xs font-bold uppercase tracking-widest">
            Sustainability score
          </h2>
          <button
            type="button"
            aria-pressed={flipped}
            aria-label="Show the four factors behind this score"
            onClick={() => setFlipped(true)}
            className="flex min-h-11 w-full items-center gap-5 text-left"
          >
            <ScoreTag score={score} size="lg" swing />
            <span>
              <span className="block font-display text-2xl uppercase leading-tight">{scoreVerdict(score)} pick</span>
              <span className="mt-1 block text-sm">Tap the tag to see how it adds up.</span>
            </span>
          </button>
          <Link href="/score" className="mt-4 inline-block font-pixel text-xs font-bold uppercase tracking-widest underline decoration-2 underline-offset-4">
            How we score →
          </Link>
        </div>

        <div className={cn(face, "[transform:rotateY(180deg)]")} inert={!flipped}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-pixel text-xs font-bold uppercase tracking-widest">Why {score}/100</h2>
            <button
              type="button"
              onClick={() => setFlipped(false)}
              className="font-pixel text-xs font-bold uppercase tracking-widest underline decoration-2 underline-offset-4"
            >
              Flip back
            </button>
          </div>
          <ul className="flex flex-col gap-3">
            {FACTORS.map((f) => {
              const v = p.scores[f.key];
              return (
                <li key={f.key}>
                  <div className="flex items-baseline justify-between font-pixel text-[11px] font-bold uppercase tracking-wider">
                    <span>
                      {f.label} <span className="opacity-80">({Math.round(f.weight * 100)}%)</span>
                    </span>
                    <span>{v}</span>
                  </div>
                  <div
                    role="meter"
                    aria-label={`${f.label} score`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={v}
                    className="mt-1 h-4 overflow-hidden rounded-full border-2 border-lyons bg-paper"
                  >
                    <div className={cn("h-full border-r-2 border-lyons", toneBg[scoreTone(v)])} style={{ width: `${v}%` }} />
                  </div>
                  <p className="mt-1 text-xs">{explainFactor(f.key, v)}</p>
                </li>
              );
            })}
          </ul>
          <Link href="/score" className="mt-4 inline-block font-pixel text-xs font-bold uppercase tracking-widest underline decoration-2 underline-offset-4">
            How we score →
          </Link>
        </div>
      </div>
    </section>
  );
}
