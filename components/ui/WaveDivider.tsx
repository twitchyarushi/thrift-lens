import { cn } from "@/lib/cn";
import { toneInk, toneFill, type Tone } from "@/lib/tone";

type Props = {
  /** color of the section ABOVE the wave (default) */
  tone: Tone;
  /** fill the area below the wave instead, i.e. the color of the section BELOW */
  flip?: boolean;
  className?: string;
};

/** Place between sections. Fills with `tone` on one side of a wavy edge, the other side stays transparent. */
export function WaveDivider({ tone, flip = false, className }: Props) {
  return (
    <div className={cn("-mb-px -mt-px leading-[0]", toneInk[tone], className)} aria-hidden>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={cn("block h-8 w-full sm:h-12 lg:h-16", flip && "-scale-y-100", toneFill[tone])}
      >
        <path d="M0 0H1440V44C1320 76 1200 76 1080 44S840 12 720 44S480 76 360 44S120 12 0 44Z" />
      </svg>
    </div>
  );
}
