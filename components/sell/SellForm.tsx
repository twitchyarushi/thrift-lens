"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button, ScoreTag, Stamp } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { FACTORS, scoreVerdict, totalScore } from "@/lib/score";
import {
  CONDITION_OPTIONS,
  SELL_CATEGORIES,
  estimateScores,
  validateListing,
  validatePhoto,
  type SellErrors,
  type SellField,
  type SellForm as Values,
} from "@/lib/sell";
import { scoreTone, toneBg } from "@/lib/tone";

const EMPTY: Values = { brand: "", category: "", size: "", condition: "", material: "", price: "" };
const ORDER: (SellField | "photo")[] = ["photo", "brand", "category", "size", "condition", "material", "price"];

const control = "mt-1 w-full rounded-2xl border-2 bg-paper px-4 py-2.5 text-base text-lyons placeholder:text-lyons/75";
const labelCls = "font-pixel text-xs font-bold uppercase tracking-wider";

type Photo = { url: string; name: string };

function Err({ id, msg }: { id: string; msg?: string }) {
  return (
    <p id={id} role={msg ? "alert" : undefined} className="mt-1 min-h-5 text-sm font-bold text-red">
      {msg}
    </p>
  );
}

export function SellForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [errors, setErrors] = useState<SellErrors>({});
  const [submitted, setSubmitted] = useState<{ values: Values; photo: Photo } | null>(null);

  // preview URLs are blob: URLs; release the old one whenever the photo changes or the page closes
  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo.url);
    };
  }, [photo]);

  const scores = estimateScores(values);
  const total = totalScore(scores);

  const set = (f: SellField, v: string) => {
    setValues((s) => ({ ...s, [f]: v }));
    if (errors[f]) setErrors((e) => ({ ...e, [f]: validateListing({ ...values, [f]: v }, !!photo)[f] }));
  };

  const onPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const problem = validatePhoto(file);
    if (problem) {
      setErrors((s) => ({ ...s, photo: problem }));
      e.target.value = "";
      return;
    }
    setPhoto({ url: URL.createObjectURL(file), name: file.name });
    setErrors((s) => ({ ...s, photo: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateListing(values, !!photo);
    setErrors(found);
    const first = ORDER.find((f) => found[f]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (photo) setSubmitted({ values, photo });
  };

  const reset = () => {
    setSubmitted(null);
    setPhoto(null);
    setValues(EMPTY);
    setErrors({});
  };

  if (submitted) {
    const v = submitted.values;
    return (
      <div className="mx-auto mt-10 max-w-xl text-center">
        <Stamp size="md">Submitted for review</Stamp>
        <p role="status" className="mt-6 text-lg font-bold">
          Submitted for review. We&apos;ll match it to outfit searches once approved.
        </p>
        <div className="mt-6 flex items-center gap-4 rounded-3xl border-2 border-lyons bg-paper p-4 text-left shadow-hard">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={submitted.photo.url} alt={`${v.brand} ${v.category}`} className="h-24 w-24 shrink-0 rounded-2xl border-2 border-lyons object-cover" />
          <div className="min-w-0">
            <p className="font-display text-lg uppercase leading-tight">
              {v.brand} {v.category}
            </p>
            <p className="text-sm">
              Size {v.size} · {CONDITION_OPTIONS.find((c) => c.value === v.condition)?.label} · {formatINR(Number(v.price))}
            </p>
            <p className="mt-1 font-pixel text-[11px] font-bold uppercase tracking-wider">Estimated score {total}/100</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="dust" onClick={reset}>
            Sell another piece
          </Button>
          <Button href="/browse" variant="paper">
            Browse
          </Button>
        </div>
      </div>
    );
  }

  const field = (f: SellField) => ({
    id: `${uid}-${f}`,
    name: f,
    "aria-invalid": errors[f] ? (true as const) : undefined,
    "aria-describedby": errors[f] ? `${uid}-${f}-error` : undefined,
    className: cn(control, errors[f] ? "border-red" : "border-lyons"),
    onBlur: () => setErrors((s) => ({ ...s, [f]: validateListing(values, !!photo)[f] })),
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col gap-4 rounded-3xl border-2 border-lyons bg-paper p-5 shadow-hard sm:p-6">
        <div>
          <label htmlFor={`${uid}-photo`} className={labelCls}>
            Photo
          </label>
          <div className="mt-1 flex items-center gap-4">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-lyons bg-mikado">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo.url} alt="Preview of your photo" className="h-full w-full object-cover" />
              ) : (
                <span className="px-2 text-center font-pixel text-[10px] font-bold uppercase tracking-wider">No photo yet</span>
              )}
            </div>
            <div className="min-w-0">
              <input
                id={`${uid}-photo`}
                name="photo"
                type="file"
                accept="image/*"
                onChange={onPhoto}
                aria-invalid={errors.photo ? true : undefined}
                aria-describedby={`${uid}-photo-error`}
                className="block w-full max-w-full text-sm file:mr-3 file:cursor-pointer file:rounded-full file:border-2 file:border-lyons file:bg-mikado file:min-h-11 file:px-4 file:py-1.5 file:font-display file:text-xs file:uppercase file:text-lyons"
              />
              <p className="mt-1 text-xs">Preview only. Nothing is uploaded anywhere. JPG or PNG, up to 5 MB.</p>
            </div>
          </div>
          <Err id={`${uid}-photo-error`} msg={errors.photo} />
        </div>

        <div className="grid gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-brand`} className={labelCls}>
              Brand
            </label>
            <input {...field("brand")} value={values.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Levi's" autoComplete="off" />
            <Err id={`${uid}-brand-error`} msg={errors.brand} />
          </div>
          <div>
            <label htmlFor={`${uid}-category`} className={labelCls}>
              Category
            </label>
            <select {...field("category")} value={values.category} onChange={(e) => set("category", e.target.value)}>
              <option value="">Pick one</option>
              {SELL_CATEGORIES.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
            <Err id={`${uid}-category-error`} msg={errors.category} />
          </div>
          <div>
            <label htmlFor={`${uid}-size`} className={labelCls}>
              Size
            </label>
            <input {...field("size")} value={values.size} onChange={(e) => set("size", e.target.value)} placeholder="M or UK 8" autoComplete="off" />
            <Err id={`${uid}-size-error`} msg={errors.size} />
          </div>
          <div>
            <label htmlFor={`${uid}-condition`} className={labelCls}>
              Condition
            </label>
            <select {...field("condition")} value={values.condition} onChange={(e) => set("condition", e.target.value)}>
              <option value="">Pick one</option>
              {CONDITION_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <Err id={`${uid}-condition-error`} msg={errors.condition} />
          </div>
          <div>
            <label htmlFor={`${uid}-material`} className={labelCls}>
              Material
            </label>
            <input {...field("material")} value={values.material} onChange={(e) => set("material", e.target.value)} placeholder="100% cotton" autoComplete="off" />
            <Err id={`${uid}-material-error`} msg={errors.material} />
          </div>
          <div>
            <label htmlFor={`${uid}-price`} className={labelCls}>
              Price (₹)
            </label>
            <input {...field("price")} value={values.price} onChange={(e) => set("price", e.target.value)} inputMode="numeric" placeholder="799" autoComplete="off" />
            <Err id={`${uid}-price-error`} msg={errors.price} />
          </div>
        </div>

        <Button type="submit" variant="dust" size="lg" className="w-full">
          Submit for review
        </Button>
      </div>

      <aside aria-label="Estimated sustainability score" className="self-start rounded-3xl border-2 border-lyons bg-mikado p-5 shadow-hard lg:sticky lg:top-6">
        <h2 className="font-pixel text-xs font-bold uppercase tracking-widest">Estimated score</h2>
        <div className="mt-2 flex items-center gap-4" aria-live="polite">
          <ScoreTag score={total} size="lg" />
          <p className="font-display text-xl uppercase leading-tight">{scoreVerdict(total)} pick</p>
        </div>
        <ul className="mt-4 flex flex-col gap-2.5 rounded-2xl border-2 border-lyons bg-paper p-3">
          {FACTORS.map((f) => (
            <li key={f.key}>
              <div className="flex justify-between font-pixel text-[11px] font-bold uppercase tracking-wider">
                <span>{f.label}</span>
                <span>{scores[f.key]}</span>
              </div>
              <div className="mt-1 h-3 overflow-hidden rounded-full border-2 border-lyons bg-paper">
                <div className={cn("h-full border-r-2 border-lyons", toneBg[scoreTone(scores[f.key])])} style={{ width: `${scores[f.key]}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs font-bold">
          A rough guide from your material and condition. Pre-loved pieces always get high Production and Sourcing. The final score is set at review.
        </p>
      </aside>
    </form>
  );
}
