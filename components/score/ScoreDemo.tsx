"use client";

import { useId, useState } from "react";
import { ScoreTag, pressableSm } from "@/components/ui";
import { cn } from "@/lib/cn";
import { FACTORS, scoreVerdict, totalScore } from "@/lib/score";
import { scoreTone, toneBg, toneText } from "@/lib/tone";
import type { Scores } from "@/lib/types";

const PRESETS: { label: string; scores: Scores }[] = [
  { label: "Fast-fashion tee", scores: { materials: 25, production: 20, durability: 30, sourcing: 15 } },
  { label: "Mid-range cotton shirt", scores: { materials: 60, production: 45, durability: 60, sourcing: 40 } },
  { label: "Pre-loved denim jacket", scores: { materials: 70, production: 95, durability: 85, sourcing: 90 } },
];

const trim = (n: number) => `${+n.toFixed(2)}`;

/** Four sliders feed the same weighted sum the real catalogue uses, and the thrift tag updates live. */
export function ScoreDemo() {
  const uid = useId();
  const [scores, setScores] = useState<Scores>(PRESETS[2].scores);

  const total = totalScore(scores);
  const raw = FACTORS.reduce((acc, f) => acc + scores[f.key] * f.weight, 0);
  const tone = scoreTone(total);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="rounded-3xl border-2 border-lyons bg-paper p-5 shadow-hard sm:p-6">
        <p className="font-pixel text-xs font-bold uppercase tracking-widest">Start from an example</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const active = FACTORS.every((f) => scores[f.key] === p.scores[f.key]);
            return (
              <button
                key={p.label}
                type="button"
                aria-pressed={active}
                onClick={() => setScores(p.scores)}
                className={cn(
                  "min-h-11 rounded-full border-2 border-lyons px-4 py-1 font-pixel text-[11px] font-bold uppercase tracking-wider shadow-hard-sm",
                  pressableSm,
                  active ? "bg-lyons text-paper" : "bg-paper text-lyons hover:bg-mikado",
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <ul className="mt-6 flex flex-col gap-5">
          {FACTORS.map((f) => {
            const id = `${uid}-${f.key}`;
            const v = scores[f.key];
            return (
              <li key={f.key}>
                <div className="flex items-baseline justify-between gap-3">
                  <label htmlFor={id} className="font-pixel text-xs font-bold uppercase tracking-wider">
                    {f.label} <span className="opacity-80">({Math.round(f.weight * 100)}%)</span>
                  </label>
                  <output htmlFor={id} className="font-display text-xl">
                    {v}
                  </output>
                </div>
                <input
                  id={id}
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={v}
                  onChange={(e) => setScores((s) => ({ ...s, [f.key]: Number(e.target.value) }))}
                  className="mt-1 h-6 w-full cursor-pointer accent-lyons"
                />
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-5 rounded-3xl border-2 border-lyons bg-mikado p-5 shadow-hard sm:p-6" aria-live="polite">
        <div className="flex items-center gap-5">
          <ScoreTag score={total} size="lg" />
          <div>
            <p className="font-display text-2xl uppercase leading-tight">{scoreVerdict(total)} pick</p>
            <p className="mt-1 text-sm font-bold">Drag a slider and watch the tag.</p>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-lyons bg-paper p-4 font-pixel text-[11px] font-bold uppercase tracking-wider">
          <ul className="flex flex-col gap-1.5">
            {FACTORS.map((f) => (
              <li key={f.key} className="flex justify-between gap-3">
                <span>
                  {f.label}: {scores[f.key]} × {f.weight}
                </span>
                <span>{trim(scores[f.key] * f.weight)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between gap-3 border-t-2 border-dashed border-lyons pt-3 text-xs">
            <span>Sum {trim(raw)}, rounded</span>
            <span className={cn("rounded-full border-2 border-lyons px-2.5", toneBg[tone], toneText[tone])}>{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
