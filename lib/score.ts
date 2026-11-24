import { scoreTone, type Tone } from "./tone";
import type { Factor, Product, Scores } from "./types";

export const WEIGHTS: Record<Factor, number> = {
  materials: 0.35,
  production: 0.25,
  durability: 0.2,
  sourcing: 0.2,
};

/** Display metadata for the score explainer page. */
export const FACTORS: { key: Factor; label: string; weight: number; measures: string }[] = [
  { key: "materials", label: "Materials", weight: WEIGHTS.materials, measures: "Fibre type: organic, recycled or reclaimed vs virgin synthetics." },
  { key: "production", label: "Production", weight: WEIGHTS.production, measures: "Energy, water and dyeing. Pre-loved pieces need no new production." },
  { key: "durability", label: "Durability", weight: WEIGHTS.durability, measures: "Construction quality and how long it will realistically last." },
  { key: "sourcing", label: "Sourcing", weight: WEIGHTS.sourcing, measures: "Distance travelled and how traceable the maker or reseller is." },
];

/** Weighted total, rounded to a whole number 0-100. */
export function totalScore(scores: Scores): number {
  const sum = (Object.keys(WEIGHTS) as Factor[]).reduce((acc, k) => acc + scores[k] * WEIGHTS[k], 0);
  return Math.round(sum);
}

export function productScore(product: Product): number {
  return totalScore(product.scores);
}

/** Tag color: >=75 flat, 50-74 mikado, <50 red. */
export function scoreColor(score: number): Tone {
  return scoreTone(score);
}

export function scoreVerdict(score: number): "Great" | "Okay" | "Low" {
  return score >= 75 ? "Great" : score >= 50 ? "Okay" : "Low";
}

const EXPLAIN: Record<Factor, [great: string, okay: string, low: string]> = {
  materials: [
    "Organic, recycled or reclaimed fibres with a low footprint.",
    "Natural fibres, but conventionally grown or blended with synthetics.",
    "Mostly virgin synthetics that shed microplastics when washed.",
  ],
  production: [
    "Little or no new production: pre-loved, small-batch or low-water dyeing.",
    "Standard factory production with some responsible practices.",
    "Fast-fashion factory production with heavy energy and water use.",
  ],
  durability: [
    "Built to last for years and easy to repair.",
    "Should hold up well with normal care.",
    "Likely to lose shape or fall apart within a season or two.",
  ],
  sourcing: [
    "Reused, or made close to you by traceable makers.",
    "Reasonably traceable, but travels a fair distance.",
    "Long, opaque supply chain shipped across continents.",
  ],
};

/** One-line plain-English reason for a single factor score. */
export function explainFactor(factor: Factor, value: number): string {
  const [great, okay, low] = EXPLAIN[factor];
  return value >= 75 ? great : value >= 50 ? okay : low;
}
