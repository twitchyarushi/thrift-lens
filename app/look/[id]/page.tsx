import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Wardrobe } from "@/components/look/Wardrobe";
import { PageLoading } from "@/components/shell/PageLoading";
import { LOOKS, getLook } from "@/lib/looks";
import type { Look } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };
const EMPTY_DESCRIPTION_LOOK: Look = {
  id: "description-results",
  title: "Your Description Match",
  vibe: "Your matched pieces will appear here.",
  celebLabel: "YOUR STYLE, MATCHED BY KEYWORDS",
  slots: { top: [], bottom: [], outerwear: [], shoes: [], bag: [] },
};

export function generateStaticParams() {
  return [...LOOKS.map((look) => ({ id: look.id })), { id: "description-results" }];
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const look = getLook(id);
  return { title: look ? `${look.title} / Thrift Lens` : id === "description-results" ? "Your matches / Thrift Lens" : "Look not found / Thrift Lens" };
}
async function LookContent({ params }: Props) {
  const { id } = await params;
  const look = getLook(id);
  const resolved = look ?? (id === "description-results" ? EMPTY_DESCRIPTION_LOOK : undefined);
  if (!resolved) notFound();
  return <Wardrobe key={id} look={resolved} />;
}
export default function LookPage({ params }: Props) {
  return <main><Suspense fallback={<PageLoading label="Opening closet..." />}><LookContent params={params} /></Suspense></main>;
}
