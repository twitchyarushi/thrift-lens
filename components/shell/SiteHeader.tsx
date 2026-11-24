"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, pressable } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useStore } from "@/store";

const NAV = [
  { href: "/browse", label: "Browse" },
  { href: "/score", label: "Score" },
  { href: "/sell", label: "Sell" },
];

function Count({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-lyons bg-red px-1 font-pixel text-[10px] font-bold leading-none text-paper">
      {n > 99 ? "99+" : n}
    </span>
  );
}

function IconLink({ href, label, count, children }: { href: string; label: string; count: number; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-label={count > 0 ? `${label}, ${count} items` : label}
      className={cn(
        "relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-lyons bg-paper text-lyons",
        "shadow-hard",
        pressable,
      )}
    >
      {children}
      <Count n={count} />
    </Link>
  );
}

function NavPills({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className={cn("items-center gap-2", className)}>
      {NAV.map((n) => {
        const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
        return (
          <Button
            key={n.href}
            href={n.href}
            size="sm"
            variant={active ? "blue" : "paper"}
            aria-current={active ? "page" : undefined}
          >
            {n.label}
          </Button>
        );
      })}
    </nav>
  );
}

export function SiteHeader() {
  const { hydrated, wishlist, cartCount } = useStore();
  const wishN = hydrated ? wishlist.length : 0;
  const cartN = hydrated ? cartCount : 0;

  return (
    <header className="sticky top-0 z-50 border-b-2 border-lyons bg-mikado">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3">
        <NavPills className="hidden sm:flex" />
        <span className="sm:hidden" aria-hidden />

        <Link href="/" aria-label="Thrift Lens home" className="flex items-center gap-2 justify-self-center">
          <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden>
            <circle cx="14" cy="14" r="10" className="fill-paper stroke-lyons" strokeWidth="3" />
            <circle cx="14" cy="14" r="4" className="fill-fanfare" />
            <path d="M21.5 21.5 29 29" className="stroke-lyons" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="font-display text-xl uppercase leading-none tracking-tight sm:text-2xl">
            Thrift <span className="font-serif font-bold normal-case italic">Lens</span>
          </span>
        </Link>

        <div className="flex items-center justify-end gap-3">
          <IconLink href="/profile" label="Wishlist" count={wishN}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path
                d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11Z"
                className="fill-red stroke-lyons"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </IconLink>
          <IconLink href="/cart" label="Cart" count={cartN}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path d="M5 8h14l-1.2 12H6.2L5 8Z" className="fill-flat stroke-lyons" strokeWidth="2" strokeLinejoin="round" />
              <path d="M9 10V7a3 3 0 0 1 6 0v3" className="fill-none stroke-lyons" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </IconLink>
        </div>
      </div>
      <div className="flex justify-center px-4 pb-3 sm:hidden">
        <NavPills className="flex" />
      </div>
    </header>
  );
}
