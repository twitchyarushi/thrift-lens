import { LOOKS, lookSlotProducts } from "./looks";
import { hashString } from "./pickLook";
import { SLOTS, type Look, type Product } from "./types";

/**
 * "Complete the look": the first sample look that features this product, else a look picked by
 * hashing the id (the looks are fake anyway). Returns the best match for every OTHER slot.
 */
export function completeTheLook(product: Product): { look: Look; pieces: Product[] } {
  const look =
    LOOKS.find((l) => l.slots[product.slot].includes(product.id)) ?? LOOKS[hashString(product.id) % LOOKS.length];
  const pieces = SLOTS.filter((s) => s !== product.slot).flatMap((s) => lookSlotProducts(look, s).slice(0, 1));
  return { look, pieces };
}
