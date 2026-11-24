import { describe, expect, it } from "vitest";
import { LOOKS } from "@/lib/looks";
import { hashString, lookForName } from "@/lib/pickLook";

describe("pickLook", () => {
  it("is deterministic and case/space-insensitive", () => {
    expect(lookForName("Outfit.JPG").id).toBe(lookForName("  outfit.jpg ").id);
    expect(hashString("a")).toBe(hashString("a"));
  });
  it("always returns a sample look", () => {
    for (const n of ["", "x.png", "IMG_0001.jpg", "https://example.com/a.webp"]) {
      expect(LOOKS.map((l) => l.id)).toContain(lookForName(n).id);
    }
  });
});
