import type { Metadata } from "next";
import { ScoreDemo } from "@/components/score/ScoreDemo";
import { Button, ScoreTag, Vinyl, WaveDivider } from "@/components/ui";
import { FACTORS, explainFactor, productScore } from "@/lib/score";
import { PRODUCTS } from "@/lib/products";
import type { Source } from "@/lib/types";

export const metadata: Metadata = { title: "How we score / Thrift Lens" };

const avg = (source: Source) => {
  const list = PRODUCTS.filter((p) => p.source === source);
  return Math.round(list.reduce((n, p) => n + productScore(p), 0) / list.length);
};

const LEGEND = [
  { range: "75 – 100", label: "Great", score: 88, note: "Green tag. Easy to feel good about." },
  { range: "50 – 74", label: "Okay", score: 62, note: "Yellow tag. Fine, but look for a greener swap." },
  { range: "0 – 49", label: "Low", score: 31, note: "Red tag. Fast-fashion territory." },
];

const FACTOR_CARD = ["bg-mikado", "bg-fanfare text-paper", "bg-paper", "bg-mikado"];

export default function ScorePage() {
  const preloved = avg("secondhand");
  const brandNew = avg("new");

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:pt-14">
        <p className="font-pixel text-xs font-bold uppercase tracking-widest">The thrift tag</p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-none sm:text-7xl">
          How we <span className="font-serif font-bold normal-case italic text-red">score</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg">
          Every piece wears a 0-100 tag. It is a weighted mix of four things, so one good trait can&apos;t hide three bad ones.
        </p>
      </section>

      <section aria-labelledby="factors-title" className="mx-auto max-w-6xl px-4 pb-14">
        <h2 id="factors-title" className="mb-5 font-display text-3xl uppercase sm:text-4xl">
          Four factors
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2">
          {FACTORS.map((f, i) => (
            <li key={f.key} className={`flex flex-col gap-3 rounded-3xl border-2 border-lyons p-5 shadow-hard ${FACTOR_CARD[i]}`}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl uppercase">{f.label}</h3>
                <span className="rounded-full border-2 border-lyons bg-paper px-3 py-0.5 font-display text-xl text-lyons">
                  {Math.round(f.weight * 100)}%
                </span>
              </div>
              <p className="text-sm font-bold">{f.measures}</p>
              <dl className="mt-auto grid gap-1 text-sm">
                <div>
                  <dt className="inline font-pixel text-[11px] font-bold uppercase tracking-wider">Scores high: </dt>
                  <dd className="inline">{explainFactor(f.key, 90)}</dd>
                </div>
                <div>
                  <dt className="inline font-pixel text-[11px] font-bold uppercase tracking-wider">Scores low: </dt>
                  <dd className="inline">{explainFactor(f.key, 20)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="demo-title" className="mx-auto max-w-6xl px-4 pb-14">
        <h2 id="demo-title" className="font-display text-3xl uppercase sm:text-4xl">
          Try the <span className="font-serif font-bold normal-case italic text-red">maths</span>
        </h2>
        <p className="mb-5 mt-2 max-w-2xl">
          Each factor is scored 0-100, multiplied by its weight, added up and rounded. Move the sliders to build your own piece.
        </p>
        <ScoreDemo />
      </section>

      <section aria-labelledby="legend-title" className="mx-auto max-w-6xl px-4 pb-14">
        <h2 id="legend-title" className="mb-5 font-display text-3xl uppercase sm:text-4xl">
          Tag colours
        </h2>
        <ul className="grid gap-5 lg:grid-cols-3">
          {LEGEND.map((l) => (
            <li key={l.label} className="flex items-center gap-4 rounded-3xl border-2 border-lyons bg-paper p-4 shadow-hard">
              <ScoreTag score={l.score} size="md" />
              <div>
                <p className="font-display text-xl uppercase leading-tight">{l.label}</p>
                <p className="font-pixel text-[11px] font-bold uppercase tracking-wider">{l.range}</p>
                <p className="mt-1 text-sm">{l.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <WaveDivider tone="fanfare" flip />
      <section aria-labelledby="secondhand-title" className="relative overflow-hidden border-b-2 border-lyons bg-fanfare text-paper">
        <Vinyl tone="lyons" label="mikado" size="18rem" spin className="absolute -right-24 -top-20 hidden sm:block" />
        <div className="relative mx-auto max-w-4xl px-4 py-12">
          <h2 id="secondhand-title" className="font-display text-3xl uppercase sm:text-4xl">
            Why second-hand scores <span className="font-serif font-bold normal-case italic text-mikado">high</span>
          </h2>
          <p className="mt-4 text-lg">
            The greenest garment is the one that already exists. A pre-loved piece skips fibre growing, dyeing and
            factory time, and it has usually travelled once, not twice. That lifts Production and Sourcing, and often
            Materials too.
          </p>
          <p className="mt-3 text-lg">
            In our catalogue, pre-loved pieces average <strong>{preloved}</strong> and new ones average{" "}
            <strong>{brandNew}</strong>. Condition still counts: it feeds Durability, so a tired piece loses points.
          </p>
          <div className="mt-6">
            <Button href="/browse" variant="yellow">
              Browse the racks
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
