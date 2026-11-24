import { cn } from "@/lib/cn";
import { Vinyl } from "@/components/ui";

type Props = {
  /** pixel-font line under the record */
  label?: string;
  className?: string;
};

/** Themed loading state: a spinning record and one pixel-font line. Used by loading.tsx and every Suspense fallback. */
export function PageLoading({ label = "Digging through the crate...", className }: Props) {
  return (
    <div role="status" aria-live="polite" className={cn("flex flex-col items-center gap-4 px-4 py-20 text-center", className)}>
      <Vinyl tone="lyons" label="mikado" size="6rem" spin />
      <p className="font-pixel text-sm font-bold uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
}
