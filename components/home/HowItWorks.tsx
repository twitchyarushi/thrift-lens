import { Garment, ScoreTag, Sticker } from "@/components/ui";

function Arrow() {
  return (
    <svg viewBox="0 0 40 24" className="mx-auto h-6 w-10 rotate-90 md:rotate-0" aria-hidden>
      <path d="M2 12h30M22 3l11 9-11 9" className="fill-none stroke-paper" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Step({ n, title, text, children }: { n: number; title: string; text: string; children: React.ReactNode }) {
  return (
    <li className="flex flex-col items-center rounded-2xl border-2 border-lyons bg-paper p-4 text-center shadow-hard">
      <span className="-mt-8 mb-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-lyons bg-mikado font-display text-lg">
        {n}
      </span>
      <div className="flex h-24 items-center justify-center">{children}</div>
      <h3 className="mt-2 font-display text-lg uppercase leading-tight">{title}</h3>
      <p className="mt-1 text-sm">{text}</p>
    </li>
  );
}

/** Three steps sitting inside a red thrift basket. */
export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="mx-auto max-w-5xl px-4 py-14">
      <h2 id="how-title" className="mb-2 text-center font-display text-3xl uppercase sm:text-4xl">
        How it <span className="font-serif font-bold normal-case italic">works</span>
      </h2>
      <p className="mb-6 text-center text-sm">Three steps from scroll to sustainable.</p>

      {/* handle */}
      <svg viewBox="0 0 400 110" className="mx-auto -mb-3 h-auto w-3/4 max-w-md" aria-hidden>
        <path d="M40 110C40 10 360 10 360 110" className="fill-none stroke-lyons" strokeWidth="18" strokeLinecap="round" />
        <path d="M40 110C40 10 360 10 360 110" className="fill-none stroke-red" strokeWidth="9" strokeLinecap="round" />
      </svg>

      {/* rim + body */}
      <div className="relative z-10 mx-[-0.5rem] rounded-full border-2 border-lyons bg-red py-2 shadow-hard" />
      <div
        className="relative -mt-2 rounded-b-[3rem] border-2 border-t-0 border-lyons bg-red px-4 pb-10 pt-12 shadow-hard-lg sm:px-8"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 22px, color-mix(in srgb, var(--color-lyons) 35%, transparent) 22px 24px), repeating-linear-gradient(0deg, transparent 0 22px, color-mix(in srgb, var(--color-lyons) 25%, transparent) 22px 24px)",
        }}
      >
        <ol className="grid items-center gap-8 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-3">
          <Step n={1} title="Upload a look" text="Drop in any outfit photo you love.">
            <Sticker size="sm" rotate={-4}>
              <div className="flex h-20 w-16 items-center justify-center rounded-md border-2 border-lyons bg-mikado">
                <svg viewBox="0 0 24 24" className="h-9 w-9" aria-hidden>
                  <path d="M12 16V5M7 10l5-5 5 5M5 19h14" className="fill-none stroke-lyons" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Sticker>
          </Step>
          <Arrow />
          <Step n={2} title="Split into pieces" text="We spot the top, bottom, shoes and more.">
            <div className="flex items-end gap-1">
              <Sticker size="sm" rotate={-5} className="w-12"><Garment type="top" color="mustard" /></Sticker>
              <Sticker size="sm" rotate={3} className="w-12"><Garment type="bottom" color="denim" /></Sticker>
              <Sticker size="sm" rotate={-2} className="w-12"><Garment type="shoes" color="cream" /></Sticker>
            </div>
          </Step>
          <Arrow />
          <Step n={3} title="Buy the greenest" text="Each piece in its cheapest, lowest-impact form.">
            <ScoreTag score={88} size="md" />
          </Step>
        </ol>
      </div>
    </section>
  );
}
