# Thrift Lens

Visual fashion discovery plus sustainable e-commerce, with a retro thrift look. Upload an outfit, get it split into pieces, and buy each piece in its greenest, cheapest form (second-hand, local, then new).

College project. **The "AI" is faked**: the sample looks are pre-mapped to pre-tagged products, and an uploaded photo is matched to one of four sample looks from its filename. Prices, scores and impact figures are sample data and estimates.

## Run it

Needs Node.js 20.9 or newer (Next.js 16 requirement).

```bash
npm install
npm run dev        # http://localhost:3000
```

Other commands:

```bash
npm test           # vitest, tests/
npx tsc --noEmit   # type check
npm run build      # production build
npm start          # serve the production build on :3000
```

Cart, wishlist, saved looks and orders live in `localStorage`. To reset the demo, clear site data in the browser (or use a private window).

## Routes

| Route | What it is |
| --- | --- |
| `/` | Home: hero, categories, new in, how it works, shop the look |
| `/upload` | Upload a photo, paste a link, or pick a sample look |
| `/look/[id]` | Look breakdown and the "closet" (Dress Me, greener swap) |
| `/browse` | All pieces with filters and sort |
| `/product/[id]` | Product, score flip-card, greener swap, complete the look |
| `/score` | How the 0-100 sustainability score works, with live sliders |
| `/cart` `/checkout` `/confirmation` | Cart, checkout (demo only, nothing is charged), impact receipt |
| `/profile` | Saved looks, wishlist, orders, lifetime impact |
| `/sell` | "Sell your pre-loved pieces" form with a live estimated score |
| `/dev` | Component check only |

## 2-minute demo script

Use the look **Soft Street Neutrals**. It is the one where Dress Me and the greener swap both visibly change things. Numbers below come from the sample data. Times add up to 2:00.

| Time | Page | Do | Say |
| --- | --- | --- | --- |
| 0:00 | Home | Scroll the hero, point at the marquee and the "Fresh to the crate" row. | "Thrift Lens turns any outfit into pieces you can buy second-hand, local or as green as it gets." |
| 0:10 | Upload | Click the **Soft Street Neutrals** sample chip. Watch the 2 second scan. | "We fake the AI for this project: a photo is matched to a pre-tagged look." |
| 0:25 | Look breakdown | Click pin 3 on the photo to jump to Outerwear. Focus an arrow and press Left/Right on the keyboard to cycle matches. Switch a slot to the **Local** filter. | "Each pin is a piece. Every slot has ranked matches, second-hand first, with a sustainability tag." |
| 0:45 | Dress Me | Press **Dress Me**. Bottom, outerwear, shoes and bag change to the highest-scoring picks (jeans 83, chore jacket 89, mojari 77, tote 82). | "One tap puts the greenest pick in every slot." |
| 0:55 | Greener swap | On **Top** (Cream Fisherman Knit, score 83), press **Greener swap**. It becomes the Handloom Khadi Shirt (local, score 87, ₹100 cheaper). Press Undo to show it reverses. | "Greener swap finds a better-scoring piece in the same slot for at most 20% more money." |
| 1:05 | Cart | Press **Add whole look**, then **View cart**. Point at the impact strip and that pre-loved items are quantity 1. | "Second-hand pieces are one of a kind, so quantity is capped at 1." |
| 1:15 | Checkout | Press Checkout. Submit empty once to show the errors, then fill the placeholder values (Aarav Sharma, 98765 43210, 411001, any address, Pune). Pick UPI, press **Place order**. | "Demo only: no payment details are collected." |
| 1:30 | Confirmation | Show the stamp and the receipt. Point at the impact: about 40.7 kg CO₂, 11,140 litres of water, ₹4,000 saved vs new. Press **Share your impact**. | "Every order ends with an impact receipt. These are estimates, and the UI says so." |
| 1:45 | Sell form | Open **Sell your pre-loved pieces** from the footer. Add any image, enter Levi's / Jacket / M / Like new / price 1499. Type `100% polyester` as the material, then change it to `100% organic cotton` and watch the thrift tag climb. | "The only seller side is this one form. The score updates live from material and condition." |

Expected totals for the script above: whole look ₹5,895 (top ₹1,199, bottom ₹1,099, outerwear ₹2,199, shoes ₹899, bag ₹499).

If something goes wrong on stage, `/look/soft-street-neutrals` opens the look directly, and `/browse` always has content.

## Project notes

- Stack: Next.js (App Router), TypeScript, Tailwind v4 (tokens in `app/globals.css`), INR via `formatINR()`.
- Design rules, palette and component list are in `CLAUDE.md`. UI primitives live in `components/ui`.
- Data layer: `lib/` (products, looks, score, impact, greener swap) and `store/index.tsx` (cart, wishlist, saved looks, orders).
- Accessibility: visible focus rings (paper rings on dark panels), skip link, 44px tap targets on touch, arrow-key cycling on the closet, `prefers-reduced-motion` respected (animations stop, marquees become static).
- Known palette limit: lyons text on the orange `dust` colour is about 2.97:1, so dust surfaces only carry bold or large display text.
