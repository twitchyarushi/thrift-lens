import { describe, expect, it } from "vitest";
import { greenerSwap } from "@/lib/greenerSwap";
import { bundleImpact, productImpact } from "@/lib/impact";
import { LOOKS } from "@/lib/looks";
import { PRODUCT_BY_ID, PRODUCTS } from "@/lib/products";
import { productScore, scoreColor, totalScore } from "@/lib/score";
import { SLOTS } from "@/lib/types";

describe("score", () => {
  it("applies the 35/25/20/20 weights", () => {
    expect(totalScore({ materials: 100, production: 100, durability: 100, sourcing: 100 })).toBe(100);
    expect(totalScore({ materials: 100, production: 0, durability: 0, sourcing: 0 })).toBe(35);
    expect(totalScore({ materials: 0, production: 100, durability: 0, sourcing: 0 })).toBe(25);
    expect(totalScore({ materials: 80, production: 60, durability: 40, sourcing: 20 })).toBe(55);
  });
  it("rounds .5 up", () => {
    // 17.5 + 22 + 11 + 17 = 67.5
    expect(totalScore({ materials: 50, production: 88, durability: 55, sourcing: 85 })).toBe(68);
  });
  it("colors tags at the 75 / 50 boundaries", () => {
    expect(scoreColor(75)).toBe("flat");
    expect(scoreColor(74)).toBe("mikado");
    expect(scoreColor(50)).toBe("mikado");
    expect(scoreColor(49)).toBe("red");
  });
});

describe("catalogue", () => {
  it("has 30 unique products with sane fields", () => {
    expect(PRODUCTS).toHaveLength(30);
    expect(new Set(PRODUCTS.map((p) => p.id)).size).toBe(30);
    for (const p of PRODUCTS) {
      for (const v of Object.values(p.scores)) expect(v >= 0 && v <= 100).toBe(true);
      expect(p.sizes.length).toBeGreaterThan(0);
      if (p.source === "local") expect(p.distanceKm).toBeTypeOf("number");
      if (p.source === "secondhand") expect(p.condition).toBeDefined();
      else expect(p.condition).toBeUndefined();
    }
    for (const s of ["new", "secondhand", "local"] as const) {
      expect(PRODUCTS.some((p) => p.source === s)).toBe(true);
    }
  });
  it("looks reference real products in the right slot, 3-5 per slot", () => {
    expect(LOOKS).toHaveLength(4);
    for (const look of LOOKS) {
      for (const slot of SLOTS) {
        const ids = look.slots[slot];
        expect(ids.length).toBeGreaterThanOrEqual(3);
        expect(ids.length).toBeLessThanOrEqual(5);
        for (const id of ids) expect(PRODUCT_BY_ID[id]?.slot).toBe(slot);
      }
    }
  });
});

describe("greenerSwap", () => {
  it("always returns a same-slot, higher-score, <=+20% price product", () => {
    for (const p of PRODUCTS) {
      const s = greenerSwap(p);
      if (!s) continue;
      expect(s.slot).toBe(p.slot);
      expect(productScore(s)).toBeGreaterThan(productScore(p));
      expect(s.price).toBeLessThanOrEqual(p.price * 1.2);
    }
  });
  it("returns nothing for the top-scoring product in each slot", () => {
    for (const slot of SLOTS) {
      const best = PRODUCTS.filter((p) => p.slot === slot).sort((a, b) => productScore(b) - productScore(a))[0];
      expect(greenerSwap(best)).toBeUndefined();
    }
  });
  it("finds a swap whenever one qualifies (brute-force check)", () => {
    for (const p of PRODUCTS) {
      const exists = PRODUCTS.some(
        (c) => c.slot === p.slot && productScore(c) > productScore(p) && c.price <= p.price * 1.2,
      );
      expect(greenerSwap(p) !== undefined).toBe(exists);
    }
  });
  it("swaps the fast-fashion denim jacket for a greener one", () => {
    const swap = greenerSwap(PRODUCT_BY_ID.p18);
    expect(swap).toBeDefined();
    expect(swap!.slot).toBe("outerwear");
  });
});

describe("impact", () => {
  it("second-hand saves more CO2 than local, and a polyester new piece saves none", () => {
    expect(productImpact(PRODUCT_BY_ID.p10).kgCO2).toBeGreaterThan(productImpact(PRODUCT_BY_ID.p16).kgCO2);
    expect(productImpact(PRODUCT_BY_ID.p03).kgCO2).toBe(0);
  });
  it("never reports negative INR saved and sums by quantity", () => {
    for (const p of PRODUCTS) expect(productImpact(p).inrSaved).toBeGreaterThanOrEqual(0);
    const one = productImpact(PRODUCT_BY_ID.p10);
    const two = bundleImpact([{ product: PRODUCT_BY_ID.p10, qty: 2 }]);
    expect(two.kgCO2).toBeCloseTo(one.kgCO2 * 2, 5);
    expect(two.inrSaved).toBe(one.inrSaved * 2);
  });
});
