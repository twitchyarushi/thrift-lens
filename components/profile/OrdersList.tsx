"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { PAYMENT_LABEL } from "@/lib/checkout";
import { formatINR } from "@/lib/format";
import { useStore } from "@/store";

export function OrdersList() {
  const { orders } = useStore();

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-lyons bg-mikado p-8 text-center shadow-hard">
        <h2 className="font-display text-2xl uppercase">No orders yet</h2>
        <p className="mt-2 font-bold">Your first thrifted piece will show up here, with its impact.</p>
        <Button href="/browse" variant="dust" className="mt-5">
          Browse
        </Button>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-5">
      {orders.map((o) => (
        <li key={o.id} className="rounded-3xl border-2 border-lyons bg-paper p-5 shadow-hard">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-xl uppercase">{o.id}</h3>
            <p className="font-pixel text-[11px] font-bold uppercase tracking-wider">
              {new Date(o.placedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })} · {PAYMENT_LABEL[o.payment]}
            </p>
          </div>
          <ul className="mt-3 flex flex-col gap-1 text-sm">
            {o.lines.map((l) => (
              <li key={`${l.productId}-${l.size}`} className="flex justify-between gap-3">
                <Link href={`/product/${l.productId}`} className="min-w-0 underline-offset-4 hover:underline">
                  {l.qty > 1 && `${l.qty} × `}
                  {l.name} <span className="opacity-80">({l.size})</span>
                </Link>
                <span className="font-bold">{formatINR(l.unitPrice * l.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-baseline justify-between border-t-2 border-dashed border-lyons pt-3">
            <span className="font-display uppercase">Total</span>
            <span className="font-display text-xl">{formatINR(o.total)}</span>
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-2 rounded-2xl border-2 border-lyons bg-mikado p-3 text-center [overflow-wrap:anywhere]">
            <div>
              <dd className="font-display text-lg leading-none">{o.impact.kgCO2}</dd>
              <dt className="font-pixel text-[10px] font-bold uppercase tracking-wider">kg CO₂</dt>
            </div>
            <div>
              <dd className="font-display text-lg leading-none">{o.impact.litresWater.toLocaleString("en-IN")}</dd>
              <dt className="font-pixel text-[10px] font-bold uppercase tracking-wider">litres water</dt>
            </div>
            <div>
              <dd className="font-display text-lg leading-none">{formatINR(o.impact.inrSaved)}</dd>
              <dt className="font-pixel text-[10px] font-bold uppercase tracking-wider">saved</dt>
            </div>
          </dl>
          <Link
            href={`/confirmation?id=${o.id}`}
            className="mt-1 inline-flex min-h-11 items-center font-pixel text-[11px] font-bold uppercase tracking-wider underline decoration-2 underline-offset-4"
          >
            View receipt →
          </Link>
        </li>
      ))}
    </ul>
  );
}
