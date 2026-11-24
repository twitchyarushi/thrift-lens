import { Button, Garment, Scribble, Stamp, Sticker, Vinyl } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="relative overflow-hidden">
      <Vinyl tone="lyons" label="red" size="16rem" spin className="absolute -right-16 -top-12 hidden sm:block" />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-16 text-center sm:py-24">
        <Stamp>404</Stamp>
        <h1 className="font-display text-4xl uppercase leading-none sm:text-5xl">
          Wrong <Scribble variant="underline"><span className="font-serif font-bold normal-case italic text-red">rack.</span></Scribble>
        </h1>
        <Sticker size="md" rotate={-6} className="w-28">
          <Garment type="hat" color="mustard" label="" />
        </Sticker>
        <p className="max-w-md text-base sm:text-lg">
          That page isn&apos;t in the crate. The link may be old, or the piece has already found a new home.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/" variant="yellow" size="lg">
            Back home
          </Button>
          <Button href="/browse" variant="paper" size="lg">
            Browse
          </Button>
          <Button href="/upload" variant="dust" size="lg">
            Scan an outfit
          </Button>
        </div>
      </div>
    </main>
  );
}
