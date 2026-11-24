import type { Condition, Scores, Slot } from "./types";

/** Seller-facing categories. Each maps to a slot so the listing can slot into outfit searches later. */
export const SELL_CATEGORIES: { label: string; slot: Slot; durable: boolean }[] = [
  { label: "T-shirt", slot: "top", durable: false },
  { label: "Shirt", slot: "top", durable: false },
  { label: "Jeans", slot: "bottom", durable: true },
  { label: "Trousers", slot: "bottom", durable: false },
  { label: "Jacket", slot: "outerwear", durable: true },
  { label: "Shoes", slot: "shoes", durable: true },
  { label: "Bag", slot: "bag", durable: true },
];

export const CONDITION_OPTIONS: { value: Condition; label: string }[] = [
  { value: "like-new", label: "Like new" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];

export type SellForm = {
  brand: string;
  category: string;
  size: string;
  condition: string;
  material: string;
  price: string;
};
export type SellField = keyof SellForm;
export type SellErrors = Partial<Record<SellField | "photo", string>>;

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const GREEN = ["organic", "hemp", "linen", "recycled", "deadstock", "reclaimed", "upcycled"];
const NATURAL = ["cotton", "wool", "leather", "denim", "silk", "jute", "canvas", "cashmere"];
const SYNTHETIC = ["polyester", "nylon", "acrylic", "synthetic", "rayon", "viscose", "spandex", "elastane", "pu ", "faux"];

const has = (text: string, words: string[]) => words.some((w) => text.includes(w));

/** 0-100 materials score from free text. Blends of natural and synthetic land in the middle. */
export function materialsScore(material: string): number {
  const m = `${material.toLowerCase().trim()} `;
  if (m.trim() === "") return 50;
  const synthetic = has(m, SYNTHETIC);
  const natural = has(m, NATURAL);
  if (has(m, GREEN) && !synthetic) return 85;
  if (synthetic && natural) return 45;
  if (synthetic) return 30;
  if (natural) return 65;
  return 50;
}

/**
 * Simple heuristics for the seller's "estimated score". Pre-loved always gets high Production and
 * Sourcing (nothing new is made, it travels once); Materials comes from the fibre text and
 * Durability from condition, with a small bonus for categories that tend to last.
 */
export function estimateScores(input: { category: string; condition: string; material: string }): Scores {
  const cat = SELL_CATEGORIES.find((c) => c.label === input.category);
  const base = input.condition === "like-new" ? 85 : input.condition === "good" ? 70 : input.condition === "fair" ? 50 : 55;
  const durability = Math.min(100, base + (cat?.durable ? 5 : 0));
  return { materials: materialsScore(input.material), production: 90, durability, sourcing: 88 };
}

export function validateListing(f: SellForm, hasPhoto: boolean): SellErrors {
  const e: SellErrors = {};
  if (!hasPhoto) e.photo = "Add a photo of the piece.";
  if (f.brand.trim().length < 2) e.brand = "Enter the brand, or \"Unbranded\".";
  if (!SELL_CATEGORIES.some((c) => c.label === f.category)) e.category = "Pick a category.";
  if (f.size.trim() === "") e.size = "Enter the size, e.g. M or UK 8.";
  if (!CONDITION_OPTIONS.some((c) => c.value === f.condition)) e.condition = "Pick a condition.";
  if (f.material.trim().length < 3) e.material = "Enter the material, e.g. 100% cotton.";
  const price = Number(f.price);
  if (f.price.trim() === "" || !Number.isFinite(price) || price < 1 || price > 100000 || !Number.isInteger(price)) {
    e.price = "Enter a whole-rupee price between 1 and 100000.";
  }
  return e;
}

/** Returns an error message for a picked file, or undefined if it's fine. */
export function validatePhoto(file: { type: string; size: number }): string | undefined {
  if (!file.type.startsWith("image/")) return "That isn't an image. Try a JPG or PNG.";
  if (file.size > MAX_PHOTO_BYTES) return "That photo is over 5 MB. Try a smaller one.";
  return undefined;
}
