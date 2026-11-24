import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  /** outline thickness */
  size?: "sm" | "md" | "lg";
  rotate?: number;
  /** soft drop under the sticker */
  lift?: boolean;
  className?: string;
};

const outline = { sm: 2, md: 4, lg: 6 };

/**
 * Die-cut sticker look: a white outline hugging whatever is inside.
 * Works on SVG and transparent PNGs because it uses stacked drop-shadows, not borders.
 */
export function Sticker({ children, size = "md", rotate = 0, lift = true, className }: Props) {
  const o = outline[size];
  const c = "var(--color-sticker)";
  const filter = [
    `drop-shadow(${o}px 0 0 ${c})`,
    `drop-shadow(-${o}px 0 0 ${c})`,
    `drop-shadow(0 ${o}px 0 ${c})`,
    `drop-shadow(0 -${o}px 0 ${c})`,
    lift ? "drop-shadow(2px 4px 0 color-mix(in srgb, var(--color-lyons) 35%, transparent))" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cn("inline-block", className)}
      style={{ filter, transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      {children}
    </div>
  );
}
