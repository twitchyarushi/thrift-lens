import { cn } from "@/lib/cn";
import { scoreTone, toneFill } from "@/lib/tone";

type Props = {
  score: number;
  size?: "sm" | "md" | "lg";
  /** gentle hanging sway; keep off in long lists */
  swing?: boolean;
  className?: string;
};

const sizes = { sm: "w-12", md: "w-20", lg: "w-28" };

/** Hanging thrift-shop price tag showing the sustainability score. */
export function ScoreTag({ score, size = "md", swing = false, className }: Props) {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  const tone = scoreTone(s);
  const ink = tone === "mikado" ? "fill-lyons" : "fill-paper";
  const verdict = s >= 75 ? "great" : s >= 50 ? "okay" : "low";

  return (
    <svg
      viewBox="0 0 80 124"
      role="img"
      aria-label={`Sustainability score ${s} out of 100, ${verdict}`}
      className={cn(
        "h-auto shrink-0 overflow-visible origin-top",
        sizes[size],
        swing && "animate-swing",
        className,
      )}
    >
      {/* string */}
      <path
        d="M46 -2 C 28 10 54 22 40 40"
        className="fill-none stroke-lyons"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* hard shadow */}
      <polygon points="25,29 61,29 75,43 75,121 11,121 11,43" className="fill-lyons" />
      {/* tag body */}
      <polygon
        points="22,26 58,26 72,40 72,118 8,118 8,40"
        className={cn("stroke-lyons", toneFill[tone])}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* punched hole + reinforcement ring */}
      <circle cx="40" cy="40" r="9" className="fill-paper/50" />
      <circle cx="40" cy="40" r="4.5" className="fill-paper stroke-lyons" strokeWidth="2" />
      <text x="40" y="66" textAnchor="middle" className={cn("font-pixel font-bold", ink)} fontSize="8">
        SCORE
      </text>
      <text
        x="40"
        y="96"
        textAnchor="middle"
        className={cn("font-display", ink)}
        fontSize={s >= 100 ? 24 : 30}
      >
        {s}
      </text>
      <text x="40" y="110" textAnchor="middle" className={cn("font-pixel font-bold", ink)} fontSize="9">
        /100
      </text>
    </svg>
  );
}
