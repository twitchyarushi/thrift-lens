import type { GarmentType } from "@/components/ui/Garment";

export type Slot = "top" | "bottom" | "outerwear" | "shoes" | "bag";
export type Source = "new" | "secondhand" | "local";
export type Condition = "like-new" | "good" | "fair";
export type PaymentMethod = "upi" | "card" | "cod";

export const SLOTS: Slot[] = ["top", "bottom", "outerwear", "shoes", "bag"];

export const SLOT_LABEL: Record<Slot, string> = {
  top: "Top",
  bottom: "Bottom",
  outerwear: "Outerwear",
  shoes: "Shoes",
  bag: "Bag",
};

/** Which <Garment> silhouette draws each slot. */
export const SLOT_GARMENT: Record<Slot, GarmentType> = {
  top: "top",
  bottom: "bottom",
  outerwear: "jacket",
  shoes: "shoes",
  bag: "bag",
};

export type Scores = {
  materials: number;
  production: number;
  durability: number;
  sourcing: number;
};
export type Factor = keyof Scores;

export type Product = {
  id: string;
  name: string;
  /** free-text type, e.g. "Flannel shirt", "Jeans", "Tote" */
  category: string;
  slot: Slot;
  /** selling price, INR */
  price: number;
  /** typical price of a comparable brand-new piece, INR (drives "you saved" maths) */
  mrpNew: number;
  source: Source;
  /** second-hand only */
  condition?: Condition;
  brand: string;
  /** one-off thrift pieces list a single size */
  sizes: string[];
  /** name from lib/garment-colors.ts */
  color: string;
  /** "striped" renders cream stripes on the Garment */
  pattern?: "striped" | "plain";
  material: string;
  /** where it was made */
  origin: string;
  /** local only: km from the shop's home city (Pune) */
  distanceKm?: number;
  /** thrift partner or maker selling it */
  seller: string;
  city: string;
  scores: Scores;
  tags: string[];
};

export type Look = {
  id: string;
  title: string;
  vibe: string;
  celebLabel: string;
  /** product ids per slot, best match first */
  slots: Record<Slot, string[]>;
};

export type Impact = {
  kgCO2: number;
  litresWater: number;
  inrSaved: number;
};

export type CartItem = { productId: string; size: string; qty: number };

export type OrderLine = {
  productId: string;
  name: string;
  size: string;
  qty: number;
  unitPrice: number;
};

export type ShippingDetails = {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

export type Order = {
  id: string;
  /** ISO timestamp */
  placedAt: string;
  lines: OrderLine[];
  total: number;
  impact: Impact;
  shipping: ShippingDetails;
  payment: PaymentMethod;
};
