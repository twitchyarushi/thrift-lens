"use client";

import { useSearchParams } from "next/navigation";
import { filtersFromQuery } from "@/lib/browse";
import { BrowseView } from "./BrowseView";

/** Reads slot / source / sort from the URL. Keyed on the query so a new link (e.g. from Home) re-initialises the filters. */
export function BrowseClient() {
  const params = useSearchParams();
  const { filters, sort } = filtersFromQuery((k) => params.get(k));
  return <BrowseView key={params.toString()} initialFilters={filters} initialSort={sort} />;
}
