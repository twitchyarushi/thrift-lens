import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { garmentColors, resolveGarmentColor } from "@/lib/garment-colors";

export type GarmentType = "top" | "bottom" | "jacket" | "shoes" | "bag" | "dress" | "hat";

type Props = {
  type: GarmentType;
  /** name from lib/garment-colors.ts, or any CSS color */
  color?: string;
  /** true = cream stripes, or pass a color name / CSS color */
  stripes?: boolean | string;
  /** accessible name; defaults to the type */
  label?: string;
  className?: string;
};

type Shape = {
  /** drawn behind the body (bag handles) */
  before?: (fill: string) => ReactNode;
  /** silhouette path(s): filled, outlined, and used to clip stripes + details */
  body: string[];
  details?: ReactNode;
  /** drawn on top, unclipped (shoe sole) */
  after?: ReactNode;
  transform?: string;
};

const line = "fill-none stroke-lyons/50";
const dark = "fill-lyons/20 stroke-lyons/50";

const SHAPES: Record<GarmentType, Shape> = {
  top: {
    body: [
      "M62 26 L88 18 Q100 34 112 18 L138 26 L178 58 L158 86 L141 74 V176 Q141 182 135 182 H65 Q59 182 59 176 V74 L42 86 L22 58 Z",
    ],
    details: (
      <>
        <path d="M88 18 Q100 34 112 18" className="fill-none stroke-lyons/80" strokeWidth="7" />
        <path d="M59 168 H141" className={line} strokeWidth="2.5" />
        <path d="M62 26 L59 74 M138 26 L141 74" className={line} strokeWidth="2" />
      </>
    ),
  },
  jacket: {
    body: [
      "M58 26 L86 18 L100 36 L114 18 L142 26 L184 68 L176 164 L158 162 L147 104 V180 H53 V104 L42 162 L24 164 L16 68 Z",
    ],
    details: (
      <>
        <path d="M86 18 L72 32 L98 50 L100 36 Z" className={dark} strokeWidth="2" strokeLinejoin="round" />
        <path d="M114 18 L128 32 L102 50 L100 36 Z" className={dark} strokeWidth="2" strokeLinejoin="round" />
        <path d="M100 36 V180" className={line} strokeWidth="2.5" />
        <rect x="62" y="76" width="28" height="24" rx="2" className={line} strokeWidth="2.5" />
        <rect x="110" y="76" width="28" height="24" rx="2" className={line} strokeWidth="2.5" />
        <path d="M62 84 H90 M110 84 H138" className={line} strokeWidth="2" />
        <path d="M53 164 H147" className={line} strokeWidth="2.5" />
        {[66, 92, 118, 144].map((y) => (
          <circle key={y} cx="100" cy={y} r="3.2" className="fill-paper stroke-lyons" strokeWidth="1.5" />
        ))}
      </>
    ),
  },
  bottom: {
    body: ["M62 18 H138 L150 58 L154 184 H108 L100 90 L92 184 H46 L50 58 Z"],
    details: (
      <>
        <path d="M50 34 H150" className={line} strokeWidth="2.5" />
        <path d="M100 34 V74" className={line} strokeWidth="2.5" />
        <path d="M58 36 Q66 62 90 62 M142 36 Q134 62 110 62" className={line} strokeWidth="2.5" />
        <path d="M44 172 H94 M106 172 H156" className={line} strokeWidth="2.5" />
        <circle cx="100" cy="27" r="3" className="fill-paper stroke-lyons" strokeWidth="1.5" />
      </>
    ),
  },
  dress: {
    body: ["M72 20 H84 Q100 54 116 20 H128 L136 84 L178 184 H22 L64 84 Z"],
    details: (
      <>
        <path d="M84 20 Q100 54 116 20" className="fill-none stroke-lyons/80" strokeWidth="6" />
        <path d="M64 84 H136" className={line} strokeWidth="2.5" />
        <path d="M84 86 L64 184 M116 86 L136 184 M100 86 V184" className={line} strokeWidth="2" />
      </>
    ),
  },
  shoes: {
    transform: "translate(0 -14)",
    body: [
      "M22 132 V106 Q22 96 32 96 H62 Q76 96 86 82 L98 66 Q106 58 118 64 L130 78 Q142 100 170 110 Q186 116 186 134 V140 H22 Z",
    ],
    details: (
      <>
        <path d="M100 70 L112 84 M92 80 L106 94 M86 90 L98 102" className={line} strokeWidth="3" />
        <path d="M150 106 Q162 118 164 140" className={line} strokeWidth="2.5" />
        <path d="M22 112 H40" className={line} strokeWidth="2.5" />
      </>
    ),
    after: (
      <>
        <path
          d="M18 136 H190 V152 Q190 160 182 160 H26 Q18 160 18 152 Z"
          className="fill-paper stroke-lyons"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M18 146 H190" className="fill-none stroke-lyons/40" strokeWidth="2" />
      </>
    ),
  },
  bag: {
    before: (fill) => (
      <>
        <path d="M72 80 V54 Q72 28 100 28 Q128 28 128 54 V80" className="fill-none stroke-lyons" strokeWidth="11" strokeLinecap="round" />
        <path d="M72 80 V54 Q72 28 100 28 Q128 28 128 54 V80" fill="none" stroke={fill} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
    body: ["M42 76 H158 L166 174 Q166 184 156 184 H44 Q34 184 34 174 Z"],
    details: (
      <>
        <path d="M40 88 H160" className={line} strokeWidth="2.5" strokeDasharray="5 4" />
        <circle cx="100" cy="134" r="24" className="fill-paper stroke-lyons/60" strokeWidth="2" strokeDasharray="4 3" />
        {[
          [110, 134],
          [105, 142.7],
          [95, 142.7],
          [90, 134],
          [95, 125.3],
          [105, 125.3],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="6.5" className="fill-mikado stroke-lyons" strokeWidth="1.5" />
        ))}
        <circle cx="100" cy="134" r="5" className="fill-dust stroke-lyons" strokeWidth="1.5" />
      </>
    ),
  },
  hat: {
    body: [
      "M22 126 Q26 106 56 110 H144 Q174 106 178 126 Q178 144 100 146 Q22 144 22 126 Z",
      "M56 112 Q54 60 100 58 Q146 60 144 112 Z",
    ],
    details: (
      <>
        <path d="M54 100 H146" className={line} strokeWidth="2.5" />
        <path d="M30 128 Q100 140 170 128 M40 135 Q100 145 160 135" className={line} strokeWidth="2" strokeDasharray="5 4" />
        <circle cx="72" cy="84" r="2.5" className="fill-lyons/60" />
        <circle cx="128" cy="84" r="2.5" className="fill-lyons/60" />
      </>
    ),
  },
};

/** Flat SVG garment silhouette. Stands in for product photos. */
export function Garment({ type, color = "denim", stripes, label, className }: Props) {
  const uid = useId();
  const clipId = `clip-${uid.replace(/:/g, "")}`;
  const shape = SHAPES[type];
  const fill = resolveGarmentColor(color);
  const stripeFill =
    stripes === true ? garmentColors.cream : typeof stripes === "string" ? resolveGarmentColor(stripes) : null;

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={label ?? type}
      className={cn("h-auto w-full overflow-visible", className)}
    >
      <defs>
        <clipPath id={clipId}>
          {shape.body.map((d) => (
            <path key={d} d={d} />
          ))}
        </clipPath>
      </defs>
      <g transform={shape.transform}>
        {shape.before?.(fill)}
        {shape.body.map((d) => (
          <path key={d} d={d} fill={fill} className="stroke-lyons" strokeWidth="4" strokeLinejoin="round" />
        ))}
        <g clipPath={`url(#${clipId})`}>
          {stripeFill &&
            Array.from({ length: 13 }).map((_, i) => (
              <rect key={i} x="0" y={14 + i * 15} width="200" height="6" fill={stripeFill} />
            ))}
          {shape.details}
        </g>
        {shape.body.map((d) => (
          <path key={`o-${d}`} d={d} className="fill-none stroke-lyons" strokeWidth="4" strokeLinejoin="round" />
        ))}
        {shape.after}
      </g>
    </svg>
  );
}
