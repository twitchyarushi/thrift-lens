import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfirmationView } from "@/components/confirmation/ConfirmationView";
import { PageLoading } from "@/components/shell/PageLoading";

export const metadata: Metadata = { title: "Order placed / Thrift Lens" };

export default function ConfirmationPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Suspense fallback={<PageLoading label="Stamping your receipt..." />}>
        <ConfirmationView />
      </Suspense>
    </main>
  );
}
