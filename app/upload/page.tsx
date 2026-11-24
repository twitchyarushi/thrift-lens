import type { Metadata } from "next";
import { UploadClient } from "@/components/upload/UploadClient";

export const metadata: Metadata = { title: "Upload a look / Thrift Lens" };

export default function UploadPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-4xl uppercase leading-none sm:text-5xl">
        Show us the <span className="font-serif font-bold normal-case italic text-red">fit.</span>
      </h1>
      <p className="mb-8 mt-3 text-base">
        Describe an outfit you love. We match its colours, clothing types and style keywords to pieces in our thrift catalogue.
      </p>
      <UploadClient />
    </main>
  );
}
