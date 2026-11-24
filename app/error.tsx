"use client";

import { Button, Stamp } from "@/components/ui";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-16 text-center sm:py-24">
      <Stamp>Snagged</Stamp>
      <h1 className="font-display text-4xl uppercase leading-none sm:text-5xl">
        Something <span className="font-serif font-bold normal-case italic text-red">tore.</span>
      </h1>
      <p className="max-w-md text-base sm:text-lg">That page hit a snag. Try again, or head back to the racks.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="dust" size="lg" onClick={reset}>
          Try again
        </Button>
        <Button href="/" variant="paper" size="lg">
          Back home
        </Button>
      </div>
    </main>
  );
}
