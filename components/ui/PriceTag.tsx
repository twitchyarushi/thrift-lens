import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";

type Props = {
  price: number;
  /** original / new-retail price, shown struck through */
  was?: number;
  size?: "sm" | "md" | "lg";
  /** degrees; a little tilt makes it feel hand-marked */
  rotate?: number;
  className?: string;
};

const sizes = {
  sm: "px-2 py-0.5 text-sm",
  md: "px-3 py-0.5 text-xl",
  lg: "px-4 py-1 text-3xl",
};

export function PriceTag({ price, was, size = "md", rotate = -2, className }: Props) {
  return (
    <span
      className={cn("inline-flex items-baseline gap-2", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span
        className={cn(
          "bg-mikado font-display text-lyons",
          "[clip-path:polygon(0_14%,2%_0,97%_6%,100%_0,98%_92%,100%_100%,3%_94%,0_100%)]",
          sizes[size],
        )}
      >
        {formatINR(price)}
      </span>
      {was !== undefined && (
        <span className="font-sans text-xs font-bold text-lyons line-through">
          {formatINR(was)}
        </span>
      )}
    </span>
  );
}
