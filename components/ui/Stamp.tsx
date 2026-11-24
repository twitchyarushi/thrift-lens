import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { toneInk, type Tone } from "@/lib/tone";

type Props = {
  children: ReactNode;
  /** colour of the ink; red reads as a classic rubber stamp */
  tone?: Tone;
  size?: "md" | "lg";
  rotate?: number;
  className?: string;
};

/** Big rubber-stamp label with a double border, e.g. "ORDER PLACED". Static, no motion. */
export function Stamp({ children, tone = "red", size = "lg", rotate = -6, className }: Props) {
  return (
    <div
      role="img"
      aria-label={typeof children === "string" ? children : undefined}
      className={cn(
        "mx-auto w-fit rounded-md border-4 border-current p-1",
        "shadow-[inset_0_0_0_2px_var(--color-paper),inset_0_0_0_4px_currentColor]",
        toneInk[tone],
        className,
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <p
        className={cn(
          "px-4 py-1 text-center font-display uppercase leading-none tracking-wide",
          size === "lg" ? "text-3xl sm:text-5xl" : "text-xl sm:text-2xl",
        )}
      >
        {children}
      </p>
    </div>
  );
}
