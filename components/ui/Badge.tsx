import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  variant: "preloved" | "local" | "new";
  /** override the default label */
  children?: ReactNode;
  className?: string;
};

function Pin() {
  return (
    <svg viewBox="0 0 12 16" className="h-3 w-2.5 fill-current" aria-hidden>
      <path d="M6 0C2.7 0 0 2.6 0 5.8 0 10 6 16 6 16s6-6 6-10.2C12 2.6 9.3 0 6 0Zm0 8.2a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8Z" />
    </svg>
  );
}

export function Badge({ variant, children, className }: Props) {
  if (variant === "preloved") {
    // rubber-stamp look: double border, tilted
    return (
      <span
        className={cn(
          "inline-block -rotate-6 rounded-sm border-2 border-red bg-paper px-2 py-0.5",
          "font-pixel text-[11px] font-bold uppercase tracking-wider text-red",
          "shadow-[inset_0_0_0_2px_var(--color-paper),inset_0_0_0_3px_var(--color-red)]",
          className,
        )}
      >
        {children ?? "Pre-loved"}
      </span>
    );
  }
  if (variant === "local") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border-2 border-lyons bg-flat px-2.5 py-0.5",
          "font-pixel text-[11px] font-bold uppercase tracking-wider text-paper",
          className,
        )}
      >
        <Pin />
        {children ?? "Local"}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-block rotate-3 rounded-full border-2 border-lyons bg-mikado px-2.5 py-0.5",
        "font-display text-[11px] uppercase tracking-wide text-lyons",
        className,
      )}
    >
      {children ?? "New"}
    </span>
  );
}
