import { Button, Garment, Sticker, Vinyl } from "@/components/ui";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 pb-10 pt-10 md:grid-cols-2 md:pb-16 md:pt-16">
        <div className="relative z-10">
          <p className="mb-3 inline-block rounded-full border-2 border-lyons bg-mikado px-3 py-1 font-pixel text-[11px] font-bold uppercase tracking-widest">
            Visual thrift finder
          </p>
          <h1 className="font-display text-5xl uppercase leading-[0.95] sm:text-6xl lg:text-7xl">
            Steal the look,
            <br />
            not the <span className="font-serif font-bold normal-case italic text-red">planet.</span>
          </h1>
          <p className="mt-5 max-w-md text-base sm:text-lg">
            Upload any outfit. We split it into pieces and find each one second-hand, local or as green as it gets, at the
            lowest price.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/upload" size="lg" variant="dust">
              Upload a look
            </Button>
            <Button href="/look/retro-denim-day" size="lg" variant="paper">
              Try a sample
            </Button>
          </div>
        </div>

        <div className="relative mx-auto h-80 w-full max-w-md sm:h-96 md:h-[28rem]" aria-hidden>
          <Vinyl tone="lyons" label="dust" size="min(75%, 18rem)" spin className="absolute right-0 top-4" />
          <Sticker size="lg" rotate={-10} className="absolute left-2 top-2 w-32 sm:w-40">
            <Garment type="jacket" color="denim" />
          </Sticker>
          <Sticker size="lg" rotate={8} className="absolute right-4 top-24 w-28 sm:w-36">
            <Garment type="top" color="mustard" stripes />
          </Sticker>
          <Sticker size="lg" rotate={-5} className="absolute bottom-2 left-12 w-28 sm:w-36">
            <Garment type="shoes" color="cream" />
          </Sticker>
          <Sticker size="lg" rotate={12} className="absolute bottom-6 right-2 w-24 sm:w-32">
            <Garment type="bag" color="rust" />
          </Sticker>
        </div>
      </div>
    </section>
  );
}
