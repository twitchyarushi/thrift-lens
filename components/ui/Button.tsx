import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "yellow" | "dust" | "green" | "teal" | "blue" | "red" | "paper";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  yellow: "bg-mikado text-lyons",
  dust: "bg-dust text-lyons",
  green: "bg-flat text-paper",
  teal: "bg-fanfare text-paper",
  blue: "bg-lyons text-paper",
  red: "bg-red text-paper",
  paper: "bg-paper text-lyons",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 py-1.5 text-xs sm:min-h-9",
  md: "min-h-11 px-6 py-2.5 text-sm",
  lg: "min-h-12 px-8 py-3.5 text-base",
};

/**
 * One hover/press feel for every pill-shaped control (buttons, icon buttons, steppers, chips).
 * Hover lifts up-left, press sinks down-right and drops the hard shadow.
 * `pressable` goes with shadow-hard, `pressableSm` with shadow-hard-sm.
 */
const lift = "transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";
export const pressable = `${lift} hover:shadow-hard-lg`;
export const pressableSm = `${lift} hover:shadow-hard`;

export function buttonClasses(
  variant: ButtonVariant = "yellow",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full border-2 border-lyons font-display uppercase tracking-wide whitespace-nowrap",
    "shadow-hard",
    pressable,
    "aria-disabled:pointer-events-none aria-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};
type AsButton = Common & Omit<ComponentProps<"button">, keyof Common> & { href?: undefined };
type AsLink = Common & Omit<ComponentProps<typeof Link>, keyof Common | "href"> & { href: string };

export function Button(props: AsButton | AsLink) {
  if (props.href !== undefined) {
    const { variant, size, className, children, ...rest } = props;
    return (
      <Link className={buttonClasses(variant, size, className)} {...rest}>
        {children}
      </Link>
    );
  }
  const { variant, size, className, children, type = "button", ...rest } = props;
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
