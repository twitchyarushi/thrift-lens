/**
 * Product colors for <Garment>. These are product data (what the clothes look like),
 * not UI colors, so they live outside the Tailwind palette.
 */
export const garmentColors: Record<string, string> = {
  denim: "#5f87b5",
  indigo: "#2f4d7a",
  khaki: "#bba67c",
  cream: "#f2e8cf",
  white: "#f8f5ec",
  black: "#1e1e22",
  charcoal: "#454a52",
  olive: "#838a4a",
  forest: "#2f5d46",
  rust: "#b5532b",
  brick: "#a8402f",
  maroon: "#7a2230",
  mustard: "#d9a521",
  tan: "#c89a6a",
  lilac: "#9c86b5",
  pink: "#e29bb0",
  sage: "#a7b99a",
};

export function resolveGarmentColor(color: string | undefined, fallback = "denim") {
  const c = color ?? fallback;
  return garmentColors[c] ?? c;
}
