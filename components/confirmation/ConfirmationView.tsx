"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, Stamp } from "@/components/ui";
import { PageLoading } from "@/components/shell/PageLoading";
import { PAYMENT_LABEL, shareText } from "@/lib/checkout";
import { formatINR } from "@/lib/format";
import type { Order } from "@/lib/types";
import { useStore } from "@/store";

const ZIGZAG = `M0 0 ${Array.from({ length: 24 }, (_, i) => `L${i * 10 + 5} 10 L${i * 10 + 10} 0`).join(" ")}`;

function Big({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div className="rounded-2xl border-2 border-lyons bg-mikado p-3 text-center">
      <p className="font-display text-3xl leading-none [overflow-wrap:anywhere] min-[480px]:text-2xl sm:text-3xl">{value}</p>
      <p className="mt-1 font-pixel text-[11px] font-bold uppercase tracking-wider">{unit}</p>
      <p className="font-pixel text-[10px] font-bold uppercase tracking-wider">{label}</p>
    </div>
  );
}

function Receipt({ order }: { order: Order }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const pieces = order.lines.reduce((n, l) => n + l.qty, 0);
  const text = shareText(order.id, pieces, order.impact);
  const when = new Date(order.placedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-xl">
      <div className="rounded-t-2xl border-x-2 border-t-2 border-lyons bg-paper p-5 shadow-hard-lg sm:p-7">
        <div className="text-center">
          <p className="font-display text-xl uppercase">Thrift Lens</p>
          <p className="font-pixel text-[11px] font-bold uppercase tracking-widest">Your impact receipt</p>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-y-1 border-y-2 border-dashed border-lyons py-3 font-pixel text-[11px] font-bold uppercase tracking-wider">
          <dt>Order no.</dt>
          <dd className="text-right">{order.id}</dd>
          <dt>Date</dt>
          <dd className="text-right">{when}</dd>
          <dt>Pay</dt>
          <dd className="text-right">{PAYMENT_LABEL[order.payment]}</dd>
          <dt>Ship to</dt>
          <dd className="text-right">
            {order.shipping.city} {order.shipping.pincode}
          </dd>
        </dl>

        <ul className="mt-3 flex flex-col gap-1.5 text-sm">
          {order.lines.map((l) => (
            <li key={`${l.productId}-${l.size}`} className="flex justify-between gap-3">
              <span className="min-w-0">
                {l.qty > 1 && `${l.qty} × `}
                {l.name} <span className="opacity-80">({l.size})</span>
              </span>
              <span className="font-bold">{formatINR(l.unitPrice * l.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-baseline justify-between border-t-2 border-dashed border-lyons pt-3">
          <span className="font-display text-lg uppercase">Total paid</span>
          <span className="font-display text-2xl">{formatINR(order.total)}</span>
        </div>

        <h2 className="mt-6 text-center font-display text-lg uppercase">What you kept out of landfill</h2>
        <div className="mt-3 grid grid-cols-1 gap-2 min-[480px]:grid-cols-3 sm:gap-3">
          <Big value={`${order.impact.kgCO2}`} unit="kg CO₂" label="not emitted" />
          <Big value={order.impact.litresWater.toLocaleString("en-IN")} unit="litres" label="water saved" />
          <Big value={formatINR(order.impact.inrSaved)} unit="rupees" label="saved vs new" />
        </div>
        <p className="mt-3 text-center font-pixel text-[10px] font-bold uppercase tracking-wider opacity-80">
          Estimates vs buying comparable new fast fashion
        </p>
      </div>
      <svg viewBox="0 0 240 10" preserveAspectRatio="none" aria-hidden className="block h-3 w-full">
        <path d={`${ZIGZAG} H0 Z`} className="fill-paper" />
        <path d={ZIGZAG} className="fill-none stroke-lyons" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="teal" onClick={copy}>
            Share your impact
          </Button>
          <Button href="/upload" variant="dust">
            Scan another outfit
          </Button>
        </div>
        <p role="status" className="min-h-5 text-sm font-bold">
          {status === "copied" && "Copied. Paste it anywhere."}
          {status === "failed" && "Couldn't copy automatically. Select the text below instead."}
        </p>
        {status === "failed" && (
          <textarea readOnly value={text} rows={3} onFocus={(e) => e.currentTarget.select()} className="w-full rounded-2xl border-2 border-lyons bg-paper p-3 text-sm" />
        )}
      </div>
    </div>
  );
}

export function ConfirmationView() {
  const { hydrated, orders } = useStore();
  const id = useSearchParams().get("id");

  if (!hydrated) {
    return <PageLoading label="Stamping your receipt..." />;
  }

  // no id: show the most recent order; unknown id: say so
  const order = id ? orders.find((o) => o.id === id) : orders[0];

  if (!order) {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-3xl border-2 border-lyons bg-mikado p-8 text-center shadow-hard-lg">
        <h1 className="font-display text-3xl uppercase">No order here</h1>
        <p className="mt-2 font-bold">We couldn&apos;t find that order on this device.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href="/upload" variant="dust">
            Scan an outfit
          </Button>
          <Button href="/browse" variant="paper">
            Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="sr-only">Order placed</h1>
      <Stamp>Order placed</Stamp>
      <p className="mx-auto mt-5 max-w-md text-center text-lg">
        Thanks, {order.shipping.name.split(" ")[0]}. Your pieces are being packed. Order <strong>{order.id}</strong>.
      </p>
      <Receipt order={order} />
    </div>
  );
}
