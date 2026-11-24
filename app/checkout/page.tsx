import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "Checkout / Thrift Lens" };

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-5xl uppercase leading-none sm:text-6xl">
        Check<span className="font-serif font-bold normal-case italic text-red">out</span>
      </h1>
      <CheckoutForm />
    </main>
  );
}
