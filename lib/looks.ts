import { getProduct } from "./products";
import type { Look, Product, Slot } from "./types";
import { SLOTS } from "./types";

// Sample looks for the faked "AI". Ids are best match first per slot.
// Labels are generic on purpose (no real people).
export const LOOKS: Look[] = [
  {
    id: "retro-denim-day",
    title: "Retro Denim Day",
    vibe: "90s campus, double denim",
    celebLabel: "Inspired by the 90s teen-movie closet",
    slots: {
      top: ["p01", "p02", "p08", "p07"],
      bottom: ["p10", "p11", "p16", "p12"],
      outerwear: ["p17", "p18", "p19"],
      shoes: ["p22", "p23", "p24"],
      bag: ["p27", "p28", "p29"],
    },
  },
  {
    id: "soft-street-neutrals",
    title: "Soft Street Neutrals",
    vibe: "oversized, earthy, effortless",
    celebLabel: "Inspired by an airport street-style look",
    slots: {
      top: ["p05", "p06", "p08", "p03"],
      bottom: ["p11", "p14", "p10", "p12"],
      outerwear: ["p20", "p19", "p17"],
      shoes: ["p23", "p22", "p25", "p26"],
      bag: ["p28", "p27", "p29"],
    },
  },
  {
    id: "cosy-autumn-layers",
    title: "Cosy Autumn Layers",
    vibe: "knits, corduroy, warm earth tones",
    celebLabel: "Inspired by a Pinterest autumn board",
    slots: {
      top: ["p04", "p05", "p06", "p07"],
      bottom: ["p10", "p11", "p14", "p15"],
      outerwear: ["p20", "p19", "p21", "p18"],
      shoes: ["p22", "p25", "p26"],
      bag: ["p28", "p27", "p30"],
    },
  },
  {
    id: "block-print-festival",
    title: "Block-Print Festival",
    vibe: "handmade prints, Jaipur meets Mumbai",
    celebLabel: "Inspired by a music-festival crowd shot",
    slots: {
      top: ["p02", "p07", "p09", "p01"],
      bottom: ["p14", "p16", "p15", "p11"],
      outerwear: ["p19", "p17", "p21"],
      shoes: ["p25", "p26", "p22", "p24"],
      bag: ["p27", "p29", "p30", "p28"],
    },
  },
];

export function getLook(id: string): Look | undefined {
  return LOOKS.find((l) => l.id === id);
}

/** Resolved products for one slot of a look, best match first. */
export function lookSlotProducts(look: Look, slot: Slot): Product[] {
  return look.slots[slot].map(getProduct).filter((p): p is Product => Boolean(p));
}

/** Best match in every slot, i.e. the default "Dress Me" outfit before score-picking. */
export function lookBestMatches(look: Look): Product[] {
  return SLOTS.flatMap((s) => lookSlotProducts(look, s).slice(0, 1));
}
