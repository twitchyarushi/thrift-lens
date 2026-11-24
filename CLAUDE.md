# Thrift Lens

Visual fashion discovery + sustainable e-commerce, retro thrift theme. Upload an outfit, get it split into pieces, buy each piece in its greenest, cheapest form. College project graded on novelty. No seller side beyond one "Sell your pre-loved pieces" form. The AI is faked: sample looks are pre-mapped to pre-tagged products.

## Working rules
- No recaps. Don't print whole files. Run `npx tsc --noEmit` at the end of a task only.
- `AGENTS.md` applies: this Next.js version differs from older ones. Check `node_modules/next/dist/docs/` before using a Next API you're unsure of.
- Reuse components/ui/ and lib/ before writing anything new. Server components by default, `"use client"` only where state or handlers are needed.
- `cacheComponents` is on in next.config.ts: no `Math.random()` / `Date.now()` in server components.

## Stack
Next.js (App Router) + TypeScript + Tailwind v4 (tokens in `app/globals.css`, no tailwind.config). `cn()` in `lib/cn.ts`. Currency is INR via `formatINR()` in `lib/format.ts`.

## Routes
`/` `/upload` `/look/[id]` `/browse` `/product/[id]` `/score` `/cart` `/checkout` `/confirmation` `/profile` `/sell` (and `/dev`, component check only)

## Design rules
- Vibe: flea-market flyer x record crate x 90s computer closet. Chunky, playful, sticker-like, slightly messy on purpose.
- Palette only. Tailwind's default colors are removed, so only these exist: `dust #F3620F`, `mikado #FFC20A`, `flat #67944B`, `fanfare #078D8C`, `lyons #084973`, `red #DA0D1E`. Neutrals: `paper #FFF4DC` (background), ink = `lyons` (text). `sticker` (white) is for sticker outlines only. Nothing else.
- Contrast: lyons text on mikado/paper, paper text on flat/fanfare/lyons/red. Dust and flat are ~3:1, so bold or large text only there. See `toneText` in `lib/tone.ts`.
- Fonts: `font-display` Bowlby One (headings), `font-serif` Fraunces italic (one accent word per headline), `font-sans` DM Sans (body), `font-pixel` Silkscreen (UI labels, closet UI).
- Motifs: marquee strips, oval pill buttons (2px lyons border + hard offset shadow), yellow highlighter price tags, white-outlined sticker cutouts, wavy section dividers, hand-drawn scribbles, paper grain overlay (global, already on), vinyl records as decoration.
- Mobile-first. Respect `prefers-reduced-motion` (handled globally in globals.css).

## Components (components/ui, import from `@/components/ui`)
Button (pill; variants yellow|dust|green|teal|blue|red|paper; sizes sm|md|lg; `href` renders a Link) · Marquee (items, tone, speed, reverse, size) · PriceTag (price, was) · ScoreTag (hanging thrift tag, score 0-100, tone from `scoreTone()`) · Badge (preloved stamp | local | new) · WaveDivider (tone = color of the section above, `flip` to fill below) · Sticker (white-outlined cutout wrapper, works on SVG/PNG alpha) · Garment (SVG silhouette: top|bottom|jacket|shoes|bag|dress|hat, `color` = name from `lib/garment-colors.ts` or any CSS color, `stripes`) · Scribble (circle|underline hand-drawn marker) · Vinyl (decor record, optional spin).

Primitives take a `Tone`, not raw colors (`lib/tone.ts`). Product colors are the one exception (Garment).

## Data layer (lib/, store/)
- `lib/types.ts` types + `SLOTS`, `SLOT_LABEL`, `SLOT_GARMENT` (slot -> `<Garment type>`; outerwear -> jacket). `lib/products.ts` 30 mock products (`PRODUCTS`, `getProduct`). `lib/looks.ts` 4 sample looks (`getLook`, `lookSlotProducts`, `lookBestMatches`), best match first per slot.
- `lib/score.ts` `productScore(p)`, `totalScore`, `scoreColor`, `explainFactor`, `FACTORS` (explainer page). `lib/impact.ts` `productImpact`, `bundleImpact` (kg CO2, litres water, INR saved; estimates, label as such). `lib/greenerSwap.ts` `greenerSwap(p)` -> greener same-slot product or undefined.
- `store/index.tsx`: `<StoreProvider>` (already wired in app/layout.tsx) + `useStore()` for cart, wishlist, saved looks, orders (persisted to localStorage). Gate cart-count badges on `hydrated` to avoid hydration mismatch. Second-hand pieces are one-off: qty is capped at 1.
- Tests: `npm test` (vitest, `tests/`).
