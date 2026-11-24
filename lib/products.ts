import type { Product, Scores } from "./types";

// Mock catalogue. Brand-new pieces from invented labels (Streetly, Glamora) are the low-score
// "fast fashion" foil that makes Greener Swap interesting. Second-hand brands are real, as in a real thrift rack.
// Local = made by small makers in Pune / Mumbai / Jaipur; distanceKm is from Pune.
const sc = (materials: number, production: number, durability: number, sourcing: number): Scores => ({
  materials,
  production,
  durability,
  sourcing,
});

const SHOE_SIZES = ["UK 5", "UK 6", "UK 7", "UK 8", "UK 9"];

export const PRODUCTS: Product[] = [
  // ---------- TOPS ----------
  {
    id: "p01", name: "Striped Cotton Tee", category: "T-shirt", slot: "top", price: 599, mrpNew: 899,
    source: "secondhand", condition: "like-new", brand: "Uniqlo", sizes: ["M"], color: "cream", pattern: "striped",
    material: "100% cotton", origin: "Vietnam", seller: "Second Spin Thrift", city: "Mumbai",
    scores: sc(62, 90, 70, 88), tags: ["stripes", "basics", "90s"],
  },
  {
    id: "p02", name: "Hand-Block Print Tee", category: "T-shirt", slot: "top", price: 899, mrpNew: 1199,
    source: "local", brand: "Chippa & Co", sizes: ["S", "M", "L", "XL"], color: "mustard",
    material: "Organic cotton, natural dyes", origin: "Jaipur, India", distanceKm: 1180,
    seller: "Chippa & Co Studio", city: "Jaipur",
    scores: sc(88, 80, 72, 60), tags: ["block-print", "organic", "handmade"],
  },
  {
    id: "p03", name: "Boxy Graphic Tee", category: "T-shirt", slot: "top", price: 449, mrpNew: 549,
    source: "new", brand: "Streetly", sizes: ["S", "M", "L", "XL"], color: "black", pattern: "plain",
    material: "65% polyester, 35% cotton", origin: "Bangladesh", seller: "Streetly Official", city: "Delhi",
    scores: sc(28, 30, 38, 25), tags: ["graphic", "streetwear", "oversized"],
  },
  {
    id: "p04", name: "Brick Red Flannel Shirt", category: "Flannel shirt", slot: "top", price: 749, mrpNew: 1799,
    source: "secondhand", condition: "good", brand: "Wrangler", sizes: ["L"], color: "brick",
    material: "Cotton flannel", origin: "India", seller: "Aaji's Almirah", city: "Pune",
    scores: sc(70, 92, 78, 90), tags: ["flannel", "grunge", "cosy"],
  },
  {
    id: "p05", name: "Cream Fisherman Knit", category: "Knit", slot: "top", price: 1299, mrpNew: 2999,
    source: "secondhand", condition: "good", brand: "Marks & Spencer", sizes: ["M"], color: "cream",
    material: "Wool blend", origin: "Sri Lanka", seller: "Second Spin Thrift", city: "Mumbai",
    scores: sc(75, 92, 85, 85), tags: ["knit", "cosy", "autumn"],
  },
  {
    id: "p06", name: "Chunky Organic Pullover", category: "Knit", slot: "top", price: 1799, mrpNew: 1999,
    source: "new", brand: "Loomfolk", sizes: ["S", "M", "L"], color: "tan",
    material: "Organic cotton", origin: "Tiruppur, India", seller: "Loomfolk", city: "Tiruppur",
    scores: sc(85, 70, 75, 55), tags: ["knit", "organic", "cosy"],
  },
  {
    id: "p07", name: "Handloom Khadi Shirt", category: "Shirt", slot: "top", price: 1199, mrpNew: 1599,
    source: "local", brand: "Kora Kollective", sizes: ["S", "M", "L", "XL"], color: "sage",
    material: "Handspun khadi cotton", origin: "Pune, India", distanceKm: 9,
    seller: "Kora Kollective", city: "Pune",
    scores: sc(92, 88, 70, 95), tags: ["khadi", "handloom", "relaxed"],
  },
  {
    id: "p08", name: "Retro Ringer Tee", category: "T-shirt", slot: "top", price: 399, mrpNew: 699,
    source: "secondhand", condition: "fair", brand: "H&M", sizes: ["S"], color: "white",
    material: "Cotton blend", origin: "Cambodia", seller: "Bhurki Thrift Co.", city: "Pune",
    scores: sc(50, 88, 55, 85), tags: ["retro", "basics", "90s"],
  },
  {
    id: "p09", name: "Printed Crop Top", category: "Crop top", slot: "top", price: 549, mrpNew: 699,
    source: "new", brand: "Glamora", sizes: ["XS", "S", "M", "L"], color: "pink",
    material: "Polyester", origin: "China", seller: "Glamora", city: "Delhi",
    scores: sc(22, 28, 30, 30), tags: ["crop", "party", "print"],
  },

  // ---------- BOTTOMS ----------
  {
    id: "p10", name: "Vintage Straight-Leg Jeans", category: "Jeans", slot: "bottom", price: 1099, mrpNew: 3499,
    source: "secondhand", condition: "good", brand: "Levi's", sizes: ["30"], color: "denim",
    material: "100% cotton denim", origin: "India", seller: "Second Spin Thrift", city: "Mumbai",
    scores: sc(65, 95, 90, 90), tags: ["denim", "vintage", "straight-leg"],
  },
  {
    id: "p11", name: "Wide-Leg Khaki Trousers", category: "Trousers", slot: "bottom", price: 849, mrpNew: 1799,
    source: "secondhand", condition: "like-new", brand: "Zara", sizes: ["32"], color: "khaki",
    material: "Cotton twill", origin: "Turkey", seller: "Pehnaava Preloved", city: "Pune",
    scores: sc(60, 92, 75, 86), tags: ["wide-leg", "neutral", "workwear"],
  },
  {
    id: "p12", name: "Dark Wash Baggy Jeans", category: "Jeans", slot: "bottom", price: 1299, mrpNew: 1499,
    source: "new", brand: "Streetly", sizes: ["28", "30", "32", "34"], color: "indigo",
    material: "78% cotton, 20% polyester, 2% elastane", origin: "Bangladesh", seller: "Streetly Official", city: "Delhi",
    scores: sc(35, 30, 45, 28), tags: ["denim", "baggy", "streetwear"],
  },
  {
    id: "p13", name: "Recycled-Denim Straight Jeans", category: "Jeans", slot: "bottom", price: 2499, mrpNew: 2999,
    source: "new", brand: "Loomfolk", sizes: ["28", "30", "32", "34"], color: "denim",
    material: "60% recycled cotton, 40% organic cotton", origin: "Tiruppur, India", seller: "Loomfolk", city: "Tiruppur",
    scores: sc(90, 78, 82, 60), tags: ["denim", "recycled", "straight-leg"],
  },
  {
    id: "p14", name: "Block-Print Palazzo Pants", category: "Trousers", slot: "bottom", price: 999, mrpNew: 1499,
    source: "local", brand: "Chippa & Co", sizes: ["S", "M", "L"], color: "sage",
    material: "Organic cotton, natural dyes", origin: "Jaipur, India", distanceKm: 1180,
    seller: "Chippa & Co Studio", city: "Jaipur",
    scores: sc(88, 80, 65, 60), tags: ["block-print", "wide-leg", "handmade"],
  },
  {
    id: "p15", name: "Pleated Mini Skirt", category: "Skirt", slot: "bottom", price: 449, mrpNew: 1299,
    source: "secondhand", condition: "good", brand: "Vero Moda", sizes: ["S"], color: "black",
    material: "Polyester blend", origin: "India", seller: "Bhurki Thrift Co.", city: "Pune",
    scores: sc(35, 90, 60, 85), tags: ["mini", "pleated", "preppy"],
  },
  {
    id: "p16", name: "Patchwork Denim Skirt", category: "Skirt", slot: "bottom", price: 1399, mrpNew: 1499,
    source: "local", brand: "Patch Atelier", sizes: ["S", "M", "L"], color: "denim",
    material: "Upcycled denim offcuts", origin: "Mumbai, India", distanceKm: 150,
    seller: "Patch Atelier", city: "Mumbai",
    scores: sc(95, 85, 68, 80), tags: ["upcycled", "denim", "patchwork"],
  },

  // ---------- OUTERWEAR ----------
  {
    id: "p17", name: "Classic Denim Trucker Jacket", category: "Denim jacket", slot: "outerwear", price: 1599, mrpNew: 5499,
    source: "secondhand", condition: "good", brand: "Levi's", sizes: ["M"], color: "denim",
    material: "100% cotton denim", origin: "Mexico", seller: "Second Spin Thrift", city: "Mumbai",
    scores: sc(68, 95, 92, 88), tags: ["denim", "vintage", "trucker"],
  },
  {
    id: "p18", name: "Oversized Denim Jacket", category: "Denim jacket", slot: "outerwear", price: 1799, mrpNew: 1999,
    source: "new", brand: "Streetly", sizes: ["S", "M", "L", "XL"], color: "indigo",
    material: "Cotton-polyester denim", origin: "Bangladesh", seller: "Streetly Official", city: "Delhi",
    scores: sc(38, 30, 48, 28), tags: ["denim", "oversized", "streetwear"],
  },
  {
    id: "p19", name: "Forest Green Chore Jacket", category: "Chore jacket", slot: "outerwear", price: 2199, mrpNew: 2799,
    source: "local", brand: "Kora Kollective", sizes: ["S", "M", "L", "XL"], color: "forest",
    material: "Organic cotton canvas", origin: "Pune, India", distanceKm: 9,
    seller: "Kora Kollective", city: "Pune",
    scores: sc(90, 85, 88, 95), tags: ["workwear", "organic", "layering"],
  },
  {
    id: "p20", name: "Rust Corduroy Overshirt", category: "Overshirt", slot: "outerwear", price: 999, mrpNew: 3299,
    source: "secondhand", condition: "like-new", brand: "Gap", sizes: ["L"], color: "rust",
    material: "Cotton corduroy", origin: "Vietnam", seller: "Aaji's Almirah", city: "Pune",
    scores: sc(66, 92, 80, 86), tags: ["corduroy", "autumn", "layering"],
  },
  {
    id: "p21", name: "Quilted Puffer Vest", category: "Vest", slot: "outerwear", price: 1499, mrpNew: 1799,
    source: "new", brand: "Glamora", sizes: ["S", "M", "L"], color: "black",
    material: "Polyester shell and fill", origin: "China", seller: "Glamora", city: "Delhi",
    scores: sc(25, 30, 40, 30), tags: ["puffer", "winter", "layering"],
  },

  // ---------- SHOES ----------
  {
    id: "p22", name: "High-Top Canvas Sneakers", category: "Sneakers", slot: "shoes", price: 1299, mrpNew: 3999,
    source: "secondhand", condition: "good", brand: "Converse", sizes: ["UK 8"], color: "white",
    material: "Canvas, rubber sole", origin: "Vietnam", seller: "Pehnaava Preloved", city: "Pune",
    scores: sc(55, 93, 70, 88), tags: ["sneakers", "high-top", "classic"],
  },
  {
    id: "p23", name: "Retro Runner Sneakers", category: "Sneakers", slot: "shoes", price: 1799, mrpNew: 7999,
    source: "secondhand", condition: "like-new", brand: "Adidas", sizes: ["UK 7"], color: "cream",
    material: "Mesh and suede", origin: "Vietnam", seller: "Second Spin Thrift", city: "Mumbai",
    scores: sc(45, 92, 75, 86), tags: ["sneakers", "retro", "runner"],
  },
  {
    id: "p24", name: "Chunky Platform Sneakers", category: "Sneakers", slot: "shoes", price: 1899, mrpNew: 2299,
    source: "new", brand: "Streetly", sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"], color: "white",
    material: "PU synthetic leather", origin: "China", seller: "Streetly Official", city: "Delhi",
    scores: sc(20, 25, 40, 28), tags: ["sneakers", "chunky", "streetwear"],
  },
  {
    id: "p25", name: "Hand-Stitched Jaipuri Mojari", category: "Mojari", slot: "shoes", price: 899, mrpNew: 1299,
    source: "local", brand: "Rang Mojari", sizes: SHOE_SIZES, color: "tan",
    material: "Vegetable-tanned leather", origin: "Jaipur, India", distanceKm: 1180,
    seller: "Rang Mojari", city: "Jaipur",
    scores: sc(82, 80, 78, 62), tags: ["handmade", "leather", "festive"],
  },
  {
    id: "p26", name: "Recycled-Rubber Slip-Ons", category: "Slip-ons", slot: "shoes", price: 1599, mrpNew: 1899,
    source: "local", brand: "Soleful Studio", sizes: ["UK 6", "UK 7", "UK 8", "UK 9"], color: "olive",
    material: "Recycled rubber, organic cotton", origin: "Pune, India", distanceKm: 12,
    seller: "Soleful Studio", city: "Pune",
    scores: sc(80, 72, 60, 70), tags: ["slip-on", "recycled", "casual"],
  },

  // ---------- BAGS ----------
  {
    id: "p27", name: "Daisy Canvas Tote", category: "Tote", slot: "bag", price: 499, mrpNew: 699,
    source: "local", brand: "Kora Kollective", sizes: ["One size"], color: "lilac",
    material: "Recycled cotton canvas", origin: "Pune, India", distanceKm: 9,
    seller: "Kora Kollective", city: "Pune",
    scores: sc(85, 85, 60, 95), tags: ["tote", "recycled", "daisy"],
  },
  {
    id: "p28", name: "Leather Crossbody Bag", category: "Crossbody", slot: "bag", price: 1899, mrpNew: 5995,
    source: "secondhand", condition: "good", brand: "Hidesign", sizes: ["One size"], color: "tan",
    material: "Full-grain leather", origin: "Pondicherry, India", seller: "Pehnaava Preloved", city: "Pune",
    scores: sc(60, 94, 92, 90), tags: ["leather", "crossbody", "vintage"],
  },
  {
    id: "p29", name: "Mini Shoulder Bag", category: "Shoulder bag", slot: "bag", price: 599, mrpNew: 1999,
    source: "secondhand", condition: "fair", brand: "Lavie", sizes: ["One size"], color: "maroon",
    material: "Faux leather", origin: "India", seller: "Bhurki Thrift Co.", city: "Pune",
    scores: sc(30, 90, 50, 85), tags: ["mini", "retro", "shoulder"],
  },
  {
    id: "p30", name: "Glossy Faux-Leather Tote", category: "Tote", slot: "bag", price: 1299, mrpNew: 1499,
    source: "new", brand: "Glamora", sizes: ["One size"], color: "black",
    material: "PU faux leather", origin: "China", seller: "Glamora", city: "Delhi",
    scores: sc(18, 25, 35, 30), tags: ["tote", "glossy", "work"],
  },
];

export const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

export function getProduct(id: string): Product | undefined {
  return PRODUCT_BY_ID[id];
}
