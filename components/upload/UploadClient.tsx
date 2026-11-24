"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Sticker, Vinyl } from "@/components/ui";
import { matchDescription } from "@/lib/matchDescription";
import { setUploadSession } from "@/lib/uploadSession";
import { SLOTS, SLOT_LABEL, type Slot } from "@/lib/types";

const EXAMPLES = [
  "An oversized blue denim jacket with a white tee and baggy jeans",
  "A cosy cream sweater with wide-leg beige trousers",
  "A black graphic tee, pleated skirt and chunky sneakers",
  "A sage green shirt with printed palazzo pants",
];

export function UploadClient() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try { setRecent(JSON.parse(localStorage.getItem("second-spin:descriptions") ?? "[]")); }
    catch { setRecent([]); }
  }, []);

  function findPieces(value = description) {
    const text = value.trim();
    if (text.length < 8) {
      setError("Add a little more detail so we can find relevant pieces (at least 8 characters).");
      return;
    }
    const result = matchDescription(text, selectedSlots);
    setUploadSession({ name: text, lookId: result.look.id, matchedLook: result.look });
    const next = [text, ...recent.filter((item) => item !== text)].slice(0, 5);
    setRecent(next);
    try { localStorage.setItem("second-spin:descriptions", JSON.stringify(next)); } catch { /* optional */ }
    setError("");
    router.push(`/look/${result.look.id}`);
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="relative overflow-hidden rounded-3xl border-4 border-lyons bg-paper p-6 shadow-hard-lg sm:p-10">
        <Vinyl tone="lyons" label="mikado" size="8rem" className="absolute -left-10 -top-10" />
        <Vinyl tone="mikado" label="lyons" size="7rem" className="absolute -bottom-8 -right-6" />
        <div className="relative flex flex-col gap-4">
          <div className="text-center">
            <Sticker size="md" rotate={-2}><span className="font-pixel text-xs font-bold uppercase">No scan. Just describe.</span></Sticker>
            <h2 className="mt-5 font-display text-2xl uppercase sm:text-3xl">What does the outfit look like?</h2>
            <p className="mt-2 text-sm">Describe the clothes, colours, fit or vibe. We’ll search the thrift catalogue using matching keywords.</p>
          </div>
          <label htmlFor="outfit-description" className="font-pixel text-xs font-bold uppercase tracking-widest">Your outfit description</label>
          <textarea
            id="outfit-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="e.g. An oversized blue denim jacket, white graphic tee, loose black trousers and chunky sneakers..."
            rows={5}
            maxLength={500}
            className="w-full resize-y rounded-2xl border-2 border-lyons bg-white p-4 text-base shadow-hard-sm placeholder:text-lyons/60 focus:outline-none focus:ring-2 focus:ring-mikado"
          />
          <div className="flex items-center justify-between text-xs"><span>{description.length}/500</span><span>Colours · pieces · fit · style</span></div>
          <fieldset className="rounded-2xl border-2 border-lyons bg-white p-4">
            <legend className="px-2 font-pixel text-xs font-bold uppercase tracking-widest">Choose categories (optional)</legend>
            <p className="mb-3 text-xs">Select any pieces you want us to find, even if you didn’t mention them above. Leave everything unselected to detect categories from your description.</p>
            <div className="flex flex-wrap gap-2">
              {SLOTS.map((slot) => {
                const checked = selectedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    aria-pressed={checked}
                    onClick={() => setSelectedSlots((current) => checked ? current.filter((item) => item !== slot) : [...current, slot])}
                    className={`rounded-full border-2 border-lyons px-4 py-2 text-sm font-bold transition-colors ${checked ? "bg-lyons text-paper" : "bg-paper text-lyons"}`}
                  >
                    {checked ? "✓ " : "+ "}{SLOT_LABEL[slot]}
                  </button>
                );
              })}
            </div>
          </fieldset>
          {error && <p role="alert" className="rounded-xl border-2 border-lyons bg-red px-4 py-2 text-sm font-bold text-paper">{error}</p>}
          <Button variant="yellow" size="md" onClick={() => findPieces()}>Find my pieces →</Button>
        </div>
      </div>

      <section>
        <p className="font-pixel text-xs font-bold uppercase tracking-widest">Need inspiration? Try one</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => <button key={example} type="button" onClick={() => { setDescription(example); findPieces(example); }} className="rounded-full border-2 border-lyons bg-mikado px-4 py-2 text-left text-sm font-bold shadow-hard-sm">{example}</button>)}
        </div>
      </section>

      {recent.length > 0 && <section>
        <div className="flex items-center justify-between"><p className="font-pixel text-xs font-bold uppercase tracking-widest">Recent descriptions</p><button type="button" className="text-xs underline" onClick={() => { setRecent([]); localStorage.removeItem("second-spin:descriptions"); }}>Clear</button></div>
        <div className="mt-3 flex flex-wrap gap-2">{recent.map((item) => <button key={item} type="button" onClick={() => findPieces(item)} className="rounded-full border-2 border-lyons bg-paper px-4 py-2 text-sm">{item}</button>)}</div>
      </section>}
    </div>
  );
}
