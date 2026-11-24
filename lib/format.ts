const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** 1499 -> "₹1,499" */
export function formatINR(value: number) {
  return `₹${inr.format(value)}`;
}
