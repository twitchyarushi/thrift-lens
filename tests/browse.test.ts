import { describe, expect, it } from "vitest";
import { DEFAULT_FILTERS, filterProducts, filtersFromQuery, sortProducts } from "@/lib/browse";
import { completeTheLook } from "@/lib/completeLook";
import { distanceFromPune } from "@/lib/distance";
import { PRODUCTS } from "@/lib/products";
import { productScore } from "@/lib/score";

describe("browse", () => {
  it("reads slot and source from the query, with aliases, ignoring junk", () => {
    const q = new URLSearchParams("slot=top,bag,nope&source=second-hand,local,xx&sort=cheapest");
    const { filters, sort } = filtersFromQuery((k) => q.get(k));
    expect(filters.slots).toEqual(["top", "bag"]);
    expect(filters.sources).toEqual(["secondhand", "local"]);
    expect(sort).toBe("cheapest");
  });
  it("filters by score, source and slot together", () => {
    const out = filterProducts(PRODUCTS, { ...DEFAULT_FILTERS, minScore: 70, sources: ["local"], slots: ["top"] });
    expect(out.length).toBeGreaterThan(0);
    for (const p of out) {
      expect(p.source).toBe("local");
      expect(p.slot).toBe("top");
      expect(productScore(p)).toBeGreaterThanOrEqual(70);
    }
  });
  it("sorts greenest, cheapest and nearest", () => {
    const g = sortProducts(PRODUCTS, "greenest");
    expect(productScore(g[0])).toBeGreaterThanOrEqual(productScore(g[g.length - 1]));
    const c = sortProducts(PRODUCTS, "cheapest");
    expect(c[0].price).toBeLessThanOrEqual(c[1].price);
    const n = sortProducts(PRODUCTS, "nearest");
    expect(distanceFromPune(n[0])).toBeLessThanOrEqual(distanceFromPune(n[n.length - 1]));
  });
});

describe("completeTheLook", () => {
  it("never repeats the product's own slot and fills the rest", () => {
    for (const p of PRODUCTS) {
      const { pieces } = completeTheLook(p);
      expect(pieces.every((x) => x.slot !== p.slot)).toBe(true);
      expect(pieces).toHaveLength(4);
    }
  });
});
