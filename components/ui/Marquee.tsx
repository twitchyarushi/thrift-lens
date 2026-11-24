import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { toneBg, toneText, type Tone } from "@/lib/tone";

type Props = {
  items: string[];
  tone?: Tone;
  /** Optional override: seconds for one full loop. Leave it out so every strip scrolls at the same pace. */
  speed?: number;
  reverse?: boolean;
  /** sm = thin announcement strip, lg = big "NEW NEW NEW" band */
  size?: "sm" | "lg";
  separator?: string;
  className?: string;
};

/** Scroll speed per strip size, in px/s, so a long strip and a short one move at the same pace. */
const PX_PER_SEC = { sm: 45, lg: 90 };
/** Rough rendered width of one character / one item's padding + separator, per size. */
const CHAR_PX = { sm: 9, lg: 24 };
const ITEM_PX = { sm: 46, lg: 90 };

export function Marquee({
  items,
  tone = "flat",
  speed,
  reverse = false,
  size = "sm",
  separator = "★",
  className,
}: Props) {
  // Each half of the track must be wider than the viewport so the loop never shows a gap.
  const repeat = Math.max(1, Math.ceil(12 / items.length));
  const units = Array.from({ length: repeat }).flatMap(() => items);
  const loopPx = units.reduce((n, t) => n + t.length * CHAR_PX[size] + ITEM_PX[size], 0);
  const duration = speed ?? Math.max(12, Math.round(loopPx / PX_PER_SEC[size]));

  const track = (hidden: boolean) => (
    <div className={cn("flex shrink-0 items-center motion-reduce:flex-wrap motion-reduce:justify-center", hidden && "motion-reduce:hidden")} aria-hidden={hidden || undefined}>
      {units.map((text, i) => (
        <span key={i} className={cn("flex items-center", i >= items.length && "motion-reduce:hidden")}>
          <span className="px-4">{text}</span>
          <span className="opacity-70">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "overflow-hidden border-y-2 border-lyons whitespace-nowrap motion-reduce:whitespace-normal motion-reduce:text-center",
        toneBg[tone],
        toneText[tone],
        size === "sm"
          ? "py-1.5 font-pixel text-[11px] font-bold uppercase tracking-widest"
          : "py-3 font-display text-3xl uppercase tracking-wide sm:text-5xl",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:justify-center",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
