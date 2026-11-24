import { Vinyl } from "@/components/ui";
import { ProductImage } from "@/components/ProductImage";
import { lookBestMatches } from "@/lib/looks";
import { type Look, type Product, type Slot } from "@/lib/types";

type Pos = { x: number; y: number; w: number; rot: number };

/** Flat-lay layout (percent of the frame, centre point). Doubles as the pin position on the scene. */
export const FLAT_POS: Record<Slot, Pos> = {
  outerwear: { x: 31, y: 33, w: 42, rot: -6 },
  top: { x: 71, y: 27, w: 30, rot: 5 },
  bottom: { x: 52, y: 61, w: 32, rot: -2 },
  shoes: { x: 27, y: 85, w: 28, rot: 4 },
  bag: { x: 74, y: 82, w: 24, rot: -7 },
};

/** Stand-in for a sample look photo: the look's best matches laid out flat on a record-crate backdrop. */
export function LookScene({ look, products }: { look: Look; products?: Product[] }) {
  const pieces = products ?? lookBestMatches(look);
  return (
    <div className="absolute inset-0 bg-fanfare" role="img" aria-label={`Flat-lay of the ${look.title} look`}>
      <Vinyl tone="lyons" label="mikado" size="70%" className="absolute -right-[18%] -top-[8%] opacity-90" />
      <Vinyl tone="mikado" label="red" size="40%" className="absolute -bottom-[10%] -left-[12%]" />
      {pieces.map((p) => {
        const pos = FLAT_POS[p.slot];
        return (
          <div
            key={p.id}
            className="absolute"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${pos.w}%`, transform: `translate(-50%, -50%) rotate(${pos.rot}deg)` }}
          >
            <ProductImage product={p} className="aspect-square w-full rounded-xl border-2 border-lyons bg-paper p-2 shadow-hard" />
          </div>
        );
      })}
    </div>
  );
}
