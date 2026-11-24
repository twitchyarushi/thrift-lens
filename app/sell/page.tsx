import type { Metadata } from "next";
import { SellForm } from "@/components/sell/SellForm";

export const metadata: Metadata = { title: "Sell your pre-loved pieces / Thrift Lens" };

export default function SellPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-5xl uppercase leading-none sm:text-6xl">
        Sell your <span className="font-serif font-bold normal-case italic text-red">pre-loved</span> pieces
      </h1>
      <p className="mt-3 max-w-2xl text-lg">Tell us about it, watch the thrift tag fill in, and we&apos;ll match it to outfit searches once it&apos;s approved.</p>
      <SellForm />
    </main>
  );
}
