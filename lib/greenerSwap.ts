import { PRODUCTS } from "./products";
import { productScore } from "./score";
import type { Product } from "./types";

/** Max price increase a swap may ask for. */
export const SWAP_PRICE_CAP = 1.2;

/**
 * Closest same-slot product with a higher score at no more than +20% price.
 * "Closest" = same category, then same color, then nearest price; ties go to the higher score.
 * Returns undefined when nothing greener fits (the product is already the best option).
 */
export function greenerSwap(product: Product, pool: Product[] = PRODUCTS): Product | undefined {
  const base = productScore(product);
  const candidates = pool.filter(
    (c) =>
      c.slot === product.slot &&
      c.id !== product.id &&
      productScore(c) > base &&
      c.price <= product.price * SWAP_PRICE_CAP,
  );
  if (candidates.length === 0) return undefined;

  const distance = (c: Product) =>
    (c.category === product.category ? 0 : 0.5) +
    (c.color === product.color ? 0 : 0.25) +
    Math.abs(c.price - product.price) / product.price;

  return [...candidates].sort(
    (a, b) => distance(a) - distance(b) || productScore(b) - productScore(a) || a.id.localeCompare(b.id),
  )[0];
}
