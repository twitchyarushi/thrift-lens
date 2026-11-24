import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Cart / Thrift Lens" };

export default function CartPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-5xl uppercase leading-none sm:text-6xl">
        Your <span className="font-serif font-bold normal-case italic text-red">cart</span>
      </h1>
      <CartView />
    </main>
  );
}
