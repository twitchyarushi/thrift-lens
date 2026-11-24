import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseClient } from "@/components/browse/BrowseClient";
import { PageLoading } from "@/components/shell/PageLoading";

export const metadata: Metadata = { title: "Browse / Thrift Lens" };

export default function BrowsePage() {
  return (
    <main>
      <Suspense fallback={<PageLoading label="Digging through the crate..." />}>
        <BrowseClient />
      </Suspense>
    </main>
  );
}
