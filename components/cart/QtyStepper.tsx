"use client";

import { pressableSm } from "@/components/ui";
import { cn } from "@/lib/cn";

type Props = { label: string; value: number; min?: number; max: number; onChange: (qty: number) => void };

function Step({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled: boolean; children: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full border-2 border-lyons bg-mikado font-display text-lg leading-none shadow-hard-sm sm:h-10 sm:w-10",
        pressableSm,
        "disabled:pointer-events-none disabled:opacity-40",
      )}
    >
      {children}
    </button>
  );
}

export function QtyStepper({ label, value, min = 1, max, onChange }: Props) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      <Step label={`Decrease quantity of ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}>
        −
      </Step>
      <span aria-live="polite" className="w-7 text-center font-display text-xl">
        {value}
      </span>
      <Step label={`Increase quantity of ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
        +
      </Step>
    </div>
  );
}
