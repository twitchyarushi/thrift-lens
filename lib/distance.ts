import type { Product } from "./types";

/** Rough road distance from Pune (the shop's home city), km. Estimates, only used for sorting. */
export const CITY_KM_FROM_PUNE: Record<string, number> = {
  Pune: 0,
  Mumbai: 150,
  Tiruppur: 850,
  Jaipur: 1180,
  Delhi: 1450,
};

/** distanceKm when the maker set one, else a city estimate, else "very far". */
export function distanceFromPune(p: Product): number {
  return p.distanceKm ?? CITY_KM_FROM_PUNE[p.city] ?? Number.MAX_SAFE_INTEGER;
}
