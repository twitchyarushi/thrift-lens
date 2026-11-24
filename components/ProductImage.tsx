import type { Product } from "@/lib/types";
import { cn } from "@/lib/cn";

type Props = {
  product: Product;
  className?: string;
  imageClassName?: string;
};

/** One consistent source of truth for catalogue photography across the app. */
export function ProductImage({ product, className, imageClassName }: Props) {
  return (
    <div className={cn("relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden", className)}>
      <img
        src={`/products/${product.id}.webp`}
        alt={product.name}
        loading="lazy"
        decoding="async"
        className={cn("h-full w-full object-contain", imageClassName)}
      />
    </div>
  );
}
