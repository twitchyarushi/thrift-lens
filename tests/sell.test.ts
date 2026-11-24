import { describe, expect, it } from "vitest";
import { estimateScores, materialsScore, validateListing, validatePhoto } from "@/lib/sell";
import { totalScore } from "@/lib/score";

describe("sell heuristics", () => {
  it("rates fibres sensibly", () => {
    expect(materialsScore("Organic cotton")).toBe(85);
    expect(materialsScore("100% cotton")).toBe(65);
    expect(materialsScore("65% polyester, 35% cotton")).toBe(45);
    expect(materialsScore("Polyester")).toBe(30);
    expect(materialsScore("")).toBe(50);
  });
  it("better condition scores higher", () => {
    const s = (condition: string) => totalScore(estimateScores({ category: "Jeans", condition, material: "Denim" }));
    expect(s("like-new")).toBeGreaterThan(s("good"));
    expect(s("good")).toBeGreaterThan(s("fair"));
  });
  it("keeps every sub-score in 0-100", () => {
    const s = estimateScores({ category: "Jacket", condition: "like-new", material: "Recycled wool" });
    for (const v of Object.values(s)) expect(v >= 0 && v <= 100).toBe(true);
  });
  it("validates the listing", () => {
    const ok = { brand: "Levi's", category: "Jeans", size: "32", condition: "good", material: "Denim", price: "899" };
    expect(validateListing(ok, true)).toEqual({});
    expect(validateListing(ok, false).photo).toBeDefined();
    expect(validateListing({ ...ok, price: "0" }, true).price).toBeDefined();
    expect(validateListing({ ...ok, price: "9.5" }, true).price).toBeDefined();
    expect(Object.keys(validateListing({ brand: "", category: "", size: "", condition: "", material: "", price: "" }, true))).toHaveLength(6);
  });
  it("checks photo type and size", () => {
    expect(validatePhoto({ type: "image/png", size: 1000 })).toBeUndefined();
    expect(validatePhoto({ type: "application/pdf", size: 1000 })).toBeDefined();
    expect(validatePhoto({ type: "image/jpeg", size: 6 * 1024 * 1024 })).toBeDefined();
  });
});
