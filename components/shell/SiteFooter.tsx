import Link from "next/link";
import { Button, Vinyl } from "@/components/ui";

const LINKS = [
  { href: "/upload", label: "Upload a look" },
  { href: "/browse", label: "Browse" },
  { href: "/score", label: "How we score" },
  { href: "/profile", label: "Profile" },
  { href: "/cart", label: "Cart" },
];

export function SiteFooter() {
  return (
    <footer className="on-dark relative overflow-hidden border-t-2 border-lyons bg-lyons text-paper">
      <Vinyl tone="paper" label="red" size="9rem" className="absolute -bottom-10 -right-8 opacity-90" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-2xl uppercase leading-none">
            Thrift <span className="font-serif font-bold normal-case italic">Lens</span>
          </p>
          <p className="mt-2 max-w-xs text-sm">Look it. Find it. Keep it out of landfill.</p>
          <div className="mt-4">
            <Button href="/sell" variant="yellow" size="md">
              Sell your pre-loved pieces
            </Button>
          </div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-1 pr-24 font-pixel text-xs font-bold uppercase tracking-widest">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center underline decoration-2 underline-offset-4 hover:text-mikado">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="relative border-t-2 border-paper/30 px-4 py-3 text-center font-pixel text-[10px] uppercase tracking-widest">
        College project. Sample data only. Impact figures are estimates.
      </p>
    </footer>
  );
}
