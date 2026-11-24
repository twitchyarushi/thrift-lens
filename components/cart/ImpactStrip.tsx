import { formatINR } from "@/lib/format";
import type { Impact } from "@/lib/types";

/** "You'll save X kg CO2 and Rs Y vs fast fashion". Numbers are estimates from lib/impact.ts. */
export function ImpactStrip({ impact }: { impact: Impact }) {
  return (
    <section
      aria-label="Your impact"
      className="rounded-3xl border-2 border-lyons bg-fanfare p-4 text-paper shadow-hard sm:p-5"
    >
      <p className="font-display text-xl uppercase leading-tight sm:text-2xl">
        You&apos;ll save <span className="text-mikado">{impact.kgCO2} kg CO₂</span> and{" "}
        <span className="text-mikado">{formatINR(impact.inrSaved)}</span> vs fast fashion
      </p>
      <p className="mt-1 font-pixel text-[11px] font-bold uppercase tracking-wider">
        Plus about {impact.litresWater.toLocaleString("en-IN")} litres of water. Estimates, not lab results.
      </p>
    </section>
  );
}
