import {
  Badge,
  Button,
  Garment,
  Marquee,
  PriceTag,
  Scribble,
  ScoreTag,
  Sticker,
  Vinyl,
  WaveDivider,
  type ButtonVariant,
  type GarmentType,
} from "@/components/ui";
import type { Tone } from "@/lib/tone";

// Component check only. Not part of the product.

const tones: Tone[] = ["dust", "mikado", "flat", "fanfare", "lyons", "red", "paper"];
const buttonVariants: ButtonVariant[] = ["yellow", "dust", "green", "teal", "blue", "red", "paper"];
const garmentTypes: GarmentType[] = ["top", "jacket", "bottom", "dress", "shoes", "bag", "hat"];
const garmentColorway = ["denim", "khaki", "cream", "rust", "forest", "lilac", "mustard"];

const swatchBg: Record<Tone, string> = {
  dust: "bg-dust",
  mikado: "bg-mikado",
  flat: "bg-flat",
  fanfare: "bg-fanfare",
  lyons: "bg-lyons text-paper",
  red: "bg-red text-paper",
  paper: "bg-paper",
};

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 font-pixel text-sm font-bold uppercase tracking-widest">{children}</h2>;
}

export const metadata = { title: "Thrift Lens / dev" };

export default function DevPage() {
  return (
    <main>
      <Marquee items={["Free shipping over ₹999", "Pre-loved is pre-greened", "Look it. Find it. Keep it out of landfill."]} tone="flat" />

      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-4xl sm:text-6xl">
          Design <span className="font-serif italic">system</span>
        </h1>
        <p className="mt-2 max-w-prose">
          Everything in <code className="font-pixel">components/ui</code>, on one page. Check this after changing a token.
        </p>

        <div className="mt-10">
          <H>Palette</H>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {tones.map((t) => (
              <div key={t} className={`${swatchBg[t]} rounded-2xl border-2 border-lyons p-3 shadow-hard`}>
                <div className="font-display text-sm uppercase">{t}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <H>Type</H>
          <p className="font-display text-3xl">Bowlby One: chunky headings</p>
          <p className="font-serif text-3xl italic">Fraunces italic: the accent word</p>
          <p className="text-lg">DM Sans: body copy, descriptions, forms and long reads.</p>
          <p className="font-pixel text-lg font-bold uppercase tracking-widest">Silkscreen: dress me / browse / scanning...</p>
        </div>

        <div className="mt-10">
          <H>Buttons</H>
          <div className="flex flex-wrap gap-4">
            {buttonVariants.map((v) => (
              <Button key={v} variant={v}>
                {v}
              </Button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Button size="sm">small</Button>
            <Button size="md">medium</Button>
            <Button size="lg">large</Button>
            <Button href="/" variant="blue">
              as link
            </Button>
            <Button disabled>disabled</Button>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-start gap-10">
          <div>
            <H>Price tags</H>
            <div className="flex flex-col items-start gap-4">
              <PriceTag price={1499} size="sm" />
              <PriceTag price={899} was={2499} />
              <PriceTag price={12999} size="lg" rotate={1.5} />
            </div>
          </div>
          <div>
            <H>Score tags</H>
            <div className="flex flex-wrap items-start gap-6 pt-2">
              <ScoreTag score={92} swing />
              <ScoreTag score={75} />
              <ScoreTag score={64} swing />
              <ScoreTag score={31} />
              <ScoreTag score={100} size="sm" />
              <ScoreTag score={58} size="lg" swing />
            </div>
          </div>
          <div>
            <H>Badges</H>
            <div className="flex flex-col items-start gap-4">
              <Badge variant="preloved" />
              <Badge variant="local" />
              <Badge variant="local">Pune · 4 km</Badge>
              <Badge variant="new" />
            </div>
          </div>
          <div>
            <H>Scribbles</H>
            <div className="flex flex-col items-start gap-6 font-display text-2xl">
              <Scribble>NEW</Scribble>
              <Scribble variant="underline" tone="dust">
                greenest
              </Scribble>
              <Scribble tone="fanfare">local</Scribble>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider tone="flat" flip />
      <section className="bg-flat py-10">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-4 font-pixel text-sm font-bold uppercase tracking-widest text-paper">
            Garments as stickers (denim, khaki, cream, rust, forest, lilac, mustard)
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
            {garmentTypes.map((type, i) => (
              <Sticker key={type} rotate={i % 2 ? 3 : -3}>
                <Garment type={type} color={garmentColorway[i]} className="w-28" />
              </Sticker>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
            <Sticker size="lg">
              <Garment type="top" color="cream" stripes="khaki" className="w-28" />
            </Sticker>
            <Sticker size="sm">
              <Garment type="top" color="white" stripes="indigo" className="w-28" />
            </Sticker>
            <Sticker>
              <Garment type="dress" color="maroon" stripes />
            </Sticker>
            <Sticker>
              <Garment type="jacket" color="indigo" className="w-28" />
            </Sticker>
            <Sticker>
              <Garment type="shoes" color="white" className="w-28" />
            </Sticker>
            <Sticker>
              <Garment type="hat" color="#f3620f" className="w-28" />
            </Sticker>
            <Sticker lift={false}>
              <Garment type="bag" color="lilac" className="w-28" />
            </Sticker>
          </div>
        </div>
      </section>
      <WaveDivider tone="flat" />

      <Marquee items={["NEW"]} tone="flat" size="lg" reverse />

      <section className="mx-auto max-w-5xl px-4 py-10">
        <H>Vinyl</H>
        <div className="flex flex-wrap items-center gap-6">
          <Vinyl tone="lyons" label="mikado" spin />
          <Vinyl tone="dust" label="paper" size="8rem" />
          <Vinyl tone="fanfare" label="red" size="6rem" />
          <Vinyl tone="mikado" label="lyons" size="8rem" spin />
          <Vinyl tone="red" label="mikado" size="5rem" />
          <Vinyl tone="flat" label="paper" size="7rem" />
        </div>
      </section>

      <WaveDivider tone="lyons" flip />
      <section className="bg-lyons py-10 text-paper">
        <div className="mx-auto max-w-5xl px-4">
          <H>Wave dividers + marquee tones</H>
          <div className="flex flex-col gap-3">
            {tones.map((t) => (
              <Marquee key={t} items={[`marquee ${t}`, "thrift lens"]} tone={t} />
            ))}
          </div>
        </div>
      </section>
      <WaveDivider tone="lyons" />
      <div className="h-16" />
    </main>
  );
}
