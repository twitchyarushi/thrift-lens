import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { toneStroke, type Tone } from "@/lib/tone";

type Props = {
  children: ReactNode;
  variant?: "circle" | "underline";
  tone?: Tone;
  /** draw the stroke in on load */
  animate?: boolean;
  className?: string;
};

const paths = {
  circle: {
    viewBox: "0 0 200 80",
    d: "M30 14C80 2 160 4 184 26C202 46 150 74 96 72C40 70 4 54 12 34C20 14 70 8 120 8",
    pos: "-inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)]",
  },
  underline: {
    viewBox: "0 0 200 20",
    d: "M4 12C30 4 50 18 80 10S130 4 160 12S190 8 196 6",
    pos: "-bottom-2 left-0 h-3 w-full",
  },
};

/** Hand-drawn marker circle or underline around inline content. */
export function Scribble({
  children,
  variant = "circle",
  tone = "red",
  animate = true,
  className,
}: Props) {
  const p = paths[variant];
  return (
    <span className={cn("relative inline-block", className)}>
      <span className="relative z-10">{children}</span>
      <svg
        viewBox={p.viewBox}
        preserveAspectRatio="none"
        aria-hidden
        className={cn("pointer-events-none absolute overflow-visible", p.pos)}
      >
        <path
          d={p.d}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={0}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className={cn("fill-none", toneStroke[tone], animate && "animate-draw")}
        />
      </svg>
    </span>
  );
}
