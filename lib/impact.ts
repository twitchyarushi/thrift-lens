import { productScore } from "./score";
import type { Impact, Product, Slot } from "./types";

// Illustrative estimates, rounded from public lifecycle-assessment ballparks. Label them "estimated" in the UI.
/** kg CO2e to make one new piece in each slot */
export const SLOT_CO2_KG: Record<Slot, number> = { top: 8, bottom: 25, outerwear: 28, shoes: 14, bag: 9 };
/** litres of water to make one new piece in each slot */
export const SLOT_WATER_L: Record<Slot, number> = { top: 2700, bottom: 7500, outerwear: 6000, shoes: 4000, bag: 2000 };

/**
 * Share of a new piece's footprint avoided by buying this one instead.
 * second-hand: production skipped. local: shorter, cleaner chain. new: credit only if the piece
 * actually scores well, so a polyester fast-fashion tee earns nothing.
 */
export function sourceFactor(product: Product): number {
  if (product.source === "secondhand") return 0.8;
  if (product.source === "local") return 0.35;
  return Math.min(0.3, Math.max(0, (productScore(product) - 50) / 100));
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Impact of buying one unit, vs buying a comparable new fast-fashion piece. */
export function productImpact(product: Product): Impact {
  const f = sourceFactor(product);
  return {
    kgCO2: round1(SLOT_CO2_KG[product.slot] * f),
    litresWater: Math.round((SLOT_WATER_L[product.slot] * f) / 10) * 10,
    inrSaved: Math.max(0, product.mrpNew - product.price),
  };
}

/** Total impact for a cart or order. */
export function bundleImpact(lines: { product: Product; qty: number }[]): Impact {
  const total = lines.reduce(
    (acc, { product, qty }) => {
      const i = productImpact(product);
      return {
        kgCO2: acc.kgCO2 + i.kgCO2 * qty,
        litresWater: acc.litresWater + i.litresWater * qty,
        inrSaved: acc.inrSaved + i.inrSaved * qty,
      };
    },
    { kgCO2: 0, litresWater: 0, inrSaved: 0 },
  );
  return { ...total, kgCO2: round1(total.kgCO2) };
}
