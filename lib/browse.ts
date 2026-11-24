import { distanceFromPune } from "./distance";
import { PRODUCTS } from "./products";
import { productScore } from "./score";
import { SLOTS, type Product, type Slot, type Source } from "./types";

export type SortKey = "greenest" | "cheapest" | "nearest";

export const SORTS: { key: SortKey; label: string }[] = [
  { key: "greenest", label: "Greenest" },
  { key: "cheapest", label: "Cheapest" },
  { key: "nearest", label: "Nearest" },
];

export const SOURCE_LABEL: Record<Source, string> = {
  new: "New",
  secondhand: "Second-hand",
  local: "Local",
};
export const SOURCES: Source[] = ["secondhand", "local", "new"];

export type Filters = {
  minScore: number;
  minPrice: number;
  maxPrice: number;
  /** empty = any */
  sources: Source[];
  slots: Slot[];
  sizes: string[];
};

export const PRICE_MIN = Math.floor(Math.min(...PRODUCTS.map((p) => p.price)) / 100) * 100;
export const PRICE_MAX = Math.ceil(Math.max(...PRODUCTS.map((p) => p.price)) / 100) * 100;

export const DEFAULT_FILTERS: Filters = {
  minScore: 0,
  minPrice: PRICE_MIN,
  maxPrice: PRICE_MAX,
  sources: [],
  slots: [],
  sizes: [],
};

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "28", "30", "32", "34", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "One size"];
const sizeRank = (s: string) => {
  const i = SIZE_ORDER.indexOf(s);
  return i === -1 ? SIZE_ORDER.length : i;
};

/** Every size that exists in the catalogue, in a sensible order. */
export const ALL_SIZES = [...new Set(PRODUCTS.flatMap((p) => p.sizes))].sort(
  (a, b) => sizeRank(a) - sizeRank(b) || a.localeCompare(b),
);

const SOURCE_ALIAS: Record<string, Source> = {
  new: "new",
  secondhand: "secondhand",
  "second-hand": "secondhand",
  preloved: "secondhand",
  "pre-loved": "secondhand",
  local: "local",
};

const list = (raw: string | null) =>
  (raw ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

/** Reads ?slot=top,bag&source=secondhand,local&sort=cheapest. Unknown values are ignored. */
export function filtersFromQuery(get: (key: string) => string | null): { filters: Filters; sort: SortKey } {
  const slots = [...new Set(list(get("slot")).filter((s): s is Slot => (SLOTS as string[]).includes(s)))];
  const sources = [...new Set(list(get("source")).flatMap((s) => (SOURCE_ALIAS[s] ? [SOURCE_ALIAS[s]] : [])))];
  const sortRaw = get("sort");
  const sort = SORTS.some((s) => s.key === sortRaw) ? (sortRaw as SortKey) : "greenest";
  return { filters: { ...DEFAULT_FILTERS, slots, sources }, sort };
}

export function filterProducts(products: Product[], f: Filters): Product[] {
  return products.filter(
    (p) =>
      productScore(p) >= f.minScore &&
      p.price >= f.minPrice &&
      p.price <= f.maxPrice &&
      (f.sources.length === 0 || f.sources.includes(p.source)) &&
      (f.slots.length === 0 || f.slots.includes(p.slot)) &&
      (f.sizes.length === 0 || p.sizes.some((s) => f.sizes.includes(s))),
  );
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const byScore = (a: Product, b: Product) => productScore(b) - productScore(a);
  const cmp: Record<SortKey, (a: Product, b: Product) => number> = {
    greenest: byScore,
    cheapest: (a, b) => a.price - b.price || byScore(a, b),
    nearest: (a, b) => distanceFromPune(a) - distanceFromPune(b) || byScore(a, b),
  };
  return [...products].sort((a, b) => cmp[sort](a, b) || a.id.localeCompare(b.id));
}

/** How many filters differ from the defaults (for the mobile "Filters (n)" badge). */
export function activeFilterCount(f: Filters): number {
  return (
    (f.minScore > 0 ? 1 : 0) +
    (f.minPrice > PRICE_MIN || f.maxPrice < PRICE_MAX ? 1 : 0) +
    (f.sources.length ? 1 : 0) +
    (f.slots.length ? 1 : 0) +
    (f.sizes.length ? 1 : 0)
  );
}
