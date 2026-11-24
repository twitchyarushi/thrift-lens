"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { PageLoading } from "@/components/shell/PageLoading";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  PAYMENT_OPTIONS,
  SHIPPING_FIELDS,
  cleanShipping,
  validateField,
  validateShipping,
  type ShippingErrors,
  type ShippingField,
} from "@/lib/checkout";
import { formatINR } from "@/lib/format";
import type { PaymentMethod, ShippingDetails } from "@/lib/types";
import { useStore } from "@/store";

const FIELDS: { name: ShippingField; label: string; autoComplete: string; inputMode?: "numeric" | "tel"; maxLength?: number; placeholder: string; wide?: boolean }[] = [
  { name: "name", label: "Full name", autoComplete: "name", placeholder: "Aarav Sharma", wide: true },
  { name: "phone", label: "Mobile number", autoComplete: "tel-national", inputMode: "tel", maxLength: 16, placeholder: "98765 43210" },
  { name: "pincode", label: "Pincode", autoComplete: "postal-code", inputMode: "numeric", maxLength: 6, placeholder: "411001" },
  { name: "address", label: "Address", autoComplete: "street-address", placeholder: "Flat 4, Rose Apartments, MG Road", wide: true },
  { name: "city", label: "City", autoComplete: "address-level2", placeholder: "Pune" },
];

const empty: ShippingDetails = { name: "", phone: "", address: "", city: "", pincode: "" };

export function CheckoutForm() {
  const router = useRouter();
  const { hydrated, cartLines, cartCount, cartTotal, placeOrder } = useStore();
  const [values, setValues] = useState<ShippingDetails>(empty);
  const [errors, setErrors] = useState<ShippingErrors>({});
  const [payment, setPayment] = useState<PaymentMethod>("upi");
  // placeOrder empties the cart, so remember we are leaving to avoid flashing the empty state
  const placed = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (!hydrated) {
    return <PageLoading label="Counting your coins..." />;
  }

  if (cartLines.length === 0 && !placed.current) {
    return (
      <div className="mt-8 rounded-3xl border-2 border-lyons bg-mikado p-8 text-center shadow-hard-lg">
        <h2 className="font-display text-3xl uppercase">Nothing to check out</h2>
        <p className="mt-2 font-bold">Add a piece to your cart first.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href="/browse" variant="dust">
            Browse
          </Button>
          <Button href="/cart" variant="paper">
            Back to cart
          </Button>
        </div>
      </div>
    );
  }

  const blur = (f: ShippingField) => setErrors((e) => ({ ...e, [f]: validateField(f, values[f]) }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateShipping(values);
    setErrors(found);
    const first = SHIPPING_FIELDS.find((f) => found[f]);
    if (first) {
      formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const order = placeOrder(cleanShipping(values), payment);
    if (!order) {
      router.replace("/cart");
      return;
    }
    placed.current = true;
    router.push(`/confirmation?id=${order.id}`);
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="flex flex-col gap-8">
        <fieldset className="rounded-3xl border-2 border-lyons bg-paper p-5 shadow-hard sm:p-6">
          <legend className="ml-2 rounded-full border-2 border-lyons bg-mikado px-3 py-0.5 font-display text-sm uppercase">
            1. Where to?
          </legend>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => {
              const err = errors[f.name];
              const id = `field-${f.name}`;
              return (
                <div key={f.name} className={f.wide ? "sm:col-span-2" : undefined}>
                  <label htmlFor={id} className="font-pixel text-xs font-bold uppercase tracking-wider">
                    {f.label}
                  </label>
                  <input
                    id={id}
                    name={f.name}
                    value={values[f.name]}
                    onChange={(e) => {
                      const v = e.target.value;
                      setValues((s) => ({ ...s, [f.name]: v }));
                      // once a field has shown an error, re-check as they fix it
                      if (errors[f.name]) setErrors((s) => ({ ...s, [f.name]: validateField(f.name, v) }));
                    }}
                    onBlur={() => blur(f.name)}
                    autoComplete={f.autoComplete}
                    inputMode={f.inputMode}
                    maxLength={f.maxLength}
                    placeholder={f.placeholder}
                    aria-invalid={err ? true : undefined}
                    aria-describedby={err ? `${id}-error` : undefined}
                    className={cn(
                      "mt-1 w-full rounded-2xl border-2 bg-paper px-4 py-2.5 text-base text-lyons placeholder:text-lyons/75",
                      err ? "border-red" : "border-lyons",
                    )}
                  />
                  <p id={`${id}-error`} role={err ? "alert" : undefined} className="mt-1 min-h-5 text-sm font-bold text-red">
                    {err}
                  </p>
                </div>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="rounded-3xl border-2 border-lyons bg-paper p-5 shadow-hard sm:p-6">
          <legend className="ml-2 rounded-full border-2 border-lyons bg-mikado px-3 py-0.5 font-display text-sm uppercase">
            2. How to pay?
          </legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {PAYMENT_OPTIONS.map((o) => (
              <label key={o.value} className="block cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value={o.value}
                  checked={payment === o.value}
                  onChange={() => setPayment(o.value)}
                  className="peer sr-only"
                />
                <span className="block rounded-2xl border-2 border-lyons bg-paper p-3 shadow-hard-sm transition-colors hover:bg-mikado peer-checked:bg-lyons peer-checked:text-paper peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-lyons">
                  <span className="block font-display text-base uppercase">{o.label}</span>
                  <span className="block text-xs">{o.hint}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-3 font-pixel text-[11px] font-bold uppercase tracking-wider">
            Demo only. Nothing is charged and no payment details are collected.
          </p>
        </fieldset>
      </div>

      <aside aria-label="Order summary" className="self-start rounded-3xl border-2 border-lyons bg-paper p-5 shadow-hard lg:sticky lg:top-6">
        <h2 className="font-display text-xl uppercase">Order summary</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {cartLines.map(({ product: p, size, qty, lineTotal }) => (
            <li key={`${p.id}-${size}`} className="flex justify-between gap-3">
              <span className="min-w-0">
                {qty > 1 && `${qty} × `}
                {p.name} <span className="opacity-80">({size})</span>
              </span>
              <span className="font-bold">{formatINR(lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 flex flex-col gap-1 border-t-2 border-dashed border-lyons pt-3 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal ({cartCount})</dt>
            <dd className="font-bold">{formatINR(cartTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd className="font-bold">Free</dd>
          </div>
        </dl>
        <div className="mt-3 flex items-baseline justify-between border-t-2 border-lyons pt-3">
          <span className="font-display text-lg uppercase">Total</span>
          <span className="font-display text-2xl">{formatINR(cartTotal)}</span>
        </div>
        <Button type="submit" variant="dust" size="lg" className="mt-4 w-full">
          Place order
        </Button>
      </aside>
    </form>
  );
}
