import { formatINR } from "@/lib/format";
import type { Impact } from "@/lib/types";

function Num({ value, unit }: { value: string; unit: string }) {
  return (
    <div>
      <p className="font-display text-4xl leading-none text-mikado [overflow-wrap:anywhere] min-[480px]:text-2xl md:text-4xl">{value}</p>
      <p className="mt-1 font-pixel text-[11px] font-bold uppercase tracking-wider">{unit}</p>
    </div>
  );
}

/** Sum of every order's stored impact. Estimates, same as the receipt. */
export function ImpactCounter({ impact, orders }: { impact: Impact; orders: number }) {
  return (
    <section aria-label="Lifetime impact" className="on-dark rounded-3xl border-2 border-lyons bg-lyons p-5 text-paper shadow-hard-lg sm:p-6">
      <p className="font-pixel text-xs font-bold uppercase tracking-widest">Your lifetime impact</p>
      <div className="mt-3 grid grid-cols-1 gap-4 min-[480px]:grid-cols-3 min-[480px]:gap-3">
        <Num value={`${Math.round(impact.kgCO2 * 10) / 10}`} unit="kg CO₂ not emitted" />
        <Num value={impact.litresWater.toLocaleString("en-IN")} unit="litres water saved" />
        <Num value={formatINR(impact.inrSaved)} unit="saved vs new" />
      </div>
      <p className="mt-4 font-pixel text-[10px] font-bold uppercase tracking-wider opacity-80">
        {orders === 0 ? "Your first order starts the counter." : `Across ${orders} ${orders === 1 ? "order" : "orders"}. Estimates vs comparable new fast fashion.`}
      </p>
    </section>
  );
}
