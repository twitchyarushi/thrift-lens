import { PRODUCTS } from "@/lib/products";
import { SLOTS, type Look, type Slot } from "@/lib/types";

// Simple, explainable keyword matching. Garment type is weighted most heavily.
const SLOT_WORDS: Record<Slot, string[]> = {
  top: ["top", "tee", "tshirt", "t-shirt", "shirt", "blouse", "sweater", "jumper", "knit", "pullover", "crop top", "hoodie"],
  bottom: ["bottom", "jeans", "trousers", "pants", "skirt", "shorts", "palazzo"],
  outerwear: ["jacket", "coat", "blazer", "cardigan", "overshirt", "vest", "puffer"],
  shoes: ["shoes", "shoe", "sneakers", "sneaker", "trainers", "boots", "flats", "mojari", "slip-ons"],
  bag: ["bag", "tote", "purse", "handbag", "crossbody", "shoulder bag"],
};
const SYNONYMS: Record<string, string[]> = {
  sweater: ["knit", "pullover", "jumper"], knit: ["sweater", "pullover", "jumper"],
  sneakers: ["sneaker", "trainers"], sneaker: ["sneakers", "trainers"], trainers: ["sneakers", "sneaker"],
  tote: ["bag"], jeans: ["denim"], cream: ["ivory", "offwhite"], ivory: ["cream", "offwhite"],
  blue: ["denim", "indigo"], indigo: ["blue", "denim"], beige: ["khaki", "tan"], tan: ["beige", "khaki"],
  loose: ["oversized", "baggy", "relaxed", "wide-leg"], oversized: ["loose", "baggy", "relaxed"],
  comfy: ["comfortable", "cosy", "casual"], cosy: ["comfy", "comfortable"], vintage: ["retro", "90s"],
  minimal: ["basic", "simple", "neutral"],
};
const COLORS = ["cream", "ivory", "white", "black", "blue", "denim", "indigo", "beige", "khaki", "tan", "brown", "rust", "brick", "green", "sage", "forest", "olive", "pink", "mustard", "lilac", "maroon"];

function clean(text: string) { return text.toLowerCase().replace(/[^a-z0-9- ]/g, " ").replace(/\s+/g, " ").trim(); }
function normalize(text: string): string[] { return clean(text).split(" ").filter((word: string) => word.length > 0); }
function includesPhrase(text: string, phrase: string) { return (` ${text} `).includes(` ${phrase} `); }
function expand(words: string[]) { return new Set(words.flatMap((word) => [word, ...(SYNONYMS[word] ?? [])])); }
function slotMentioned(text: string, slot: Slot) { return SLOT_WORDS[slot].some((word) => includesPhrase(text, word)); }

function scoreProduct(description: string, product: (typeof PRODUCTS)[number]): number {
  const queryWords = normalize(description);
  const expanded = expand(queryWords);
  const name = clean(product.name);
  const category = clean(product.category);
  const tags = product.tags.map(clean);
  const searchable = clean([product.name, product.category, product.color, product.material, ...product.tags].join(" "));
  let score = 0;

  // Exact garment name/category match is the strongest signal.
  for (const phrase of [name, category]) {
    if (phrase && includesPhrase(description, phrase)) score += 12;
  }
  const requestedTypes = queryWords.filter((word) => Object.values(SLOT_WORDS).flat().includes(word));
  for (const type of requestedTypes) {
    if (includesPhrase(name, type) || includesPhrase(category, type) || tags.some((tag) => includesPhrase(tag, type))) score += 9;
  }

  // Match colour as a product attribute, not just any word in its description.
  const requestedColors = COLORS.filter((color) => expanded.has(color));
  for (const color of requestedColors) {
    const productColors = expand(normalize(product.color));
    if (productColors.has(color)) score += 7;
  }

  for (const word of expanded) {
    if (word.length < 3 || COLORS.includes(word)) continue;
    if (includesPhrase(name, word) || includesPhrase(category, word)) score += 3;
    else if (tags.some((tag) => includesPhrase(tag, word))) score += 2;
    else if (includesPhrase(clean(product.material), word)) score += 3;
  }
  return score;
}

export function matchDescription(description: string, selectedSlots: Slot[] = []): { look: Look; matchedSlots: Slot[] } {
  const text = clean(description);
  const mentionedSlots = SLOTS.filter((slot) => slotMentioned(text, slot));
  // User-selected categories are additive; with no selections, infer categories from the description.
  const requestedSlots = [...new Set([...mentionedSlots, ...selectedSlots])];
  const slots = Object.fromEntries(SLOTS.map((slot) => {
    if (!requestedSlots.includes(slot)) return [slot, []];
    const ranked = PRODUCTS.filter((product) => product.slot === slot)
      .map((product) => ({ product, score: scoreProduct(text, product) }))
      .sort((a, b) => b.score - a.score || a.product.price - b.product.price);
    // If a category was explicitly selected but not described, show that category's catalogue.
    const categoryWasSelected = selectedSlots.includes(slot) && !mentionedSlots.includes(slot);
    return [slot, ranked.filter((item) => categoryWasSelected || item.score > 0).map((item) => item.product.id)];
  })) as Look["slots"];

  const matchedSlots = SLOTS.filter((slot) => slots[slot].length > 0);
  return {
    look: {
      id: "description-results",
      title: "Your Description Match",
      vibe: `Matched from your description: “${description.trim()}”`,
      celebLabel: "YOUR STYLE, MATCHED BY KEYWORDS",
      slots,
    },
    matchedSlots,
  };
}
