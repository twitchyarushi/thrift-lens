import { cn } from "@/lib/cn";
import { toneFill, type Tone } from "@/lib/tone";

type Props = {
  /** record color */
  tone?: Tone;
  /** center label color */
  label?: Tone;
  /** any CSS length */
  size?: string;
  spin?: boolean;
  className?: string;
};

/** Decorative record. Always aria-hidden. */
export function Vinyl({ tone = "lyons", label = "mikado", size = "10rem", spin = false, className }: Props) {
  const groove = tone === "lyons" ? "stroke-paper" : "stroke-lyons";
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      style={{ width: size, height: size }}
      className={cn("shrink-0", spin && "animate-slow-spin", className)}
    >
      <circle cx="100" cy="100" r="96" className={cn("stroke-lyons", toneFill[tone])} strokeWidth="3" />
      {[86, 78, 70, 62, 54, 46].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} className={cn("fill-none opacity-20", groove)} strokeWidth="1.5" />
      ))}
      {/* gloss */}
      <path d="M38 62A70 70 0 0 1 88 30" className="fill-none stroke-paper opacity-50" strokeWidth="6" strokeLinecap="round" />
      <path d="M162 138A70 70 0 0 1 112 170" className="fill-none stroke-paper opacity-50" strokeWidth="6" strokeLinecap="round" />
      <circle cx="100" cy="100" r="34" className={cn("stroke-lyons", toneFill[label])} strokeWidth="2.5" />
      <circle cx="100" cy="100" r="26" className="fill-none stroke-lyons opacity-40" strokeWidth="1.5" strokeDasharray="3 4" />
      <circle cx="100" cy="100" r="5" className="fill-paper stroke-lyons" strokeWidth="2" />
    </svg>
  );
}
