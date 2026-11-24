"use client";

import { useEffect, useState } from "react";
import { LookPhoto } from "@/components/look/LookPhoto";
import type { Look } from "@/lib/types";

const STEPS = ["Reading pixels", "Spotting pieces", "Checking thrift racks"];

export function ScanView({ look, src, onCancel }: { look: Look; src?: string; onCancel: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setStep(1), 700), setTimeout(() => setStep(2), 1400)];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="mx-auto w-full max-w-sm" role="status" aria-live="polite">
      <LookPhoto look={look} src={src}>
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, var(--color-lyons) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, var(--color-lyons) 0 1px, transparent 1px 24px)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 animate-scan bg-red shadow-[0_0_14px_3px_var(--color-red)]" />
      </LookPhoto>
      <p className="mt-6 text-center font-pixel text-2xl font-bold uppercase tracking-widest">
        Scanning<span className="animate-blink">...</span>
      </p>
      <p className="mt-1 text-center font-pixel text-xs font-bold uppercase tracking-widest">{STEPS[step]}</p>
      <div className="mt-4 text-center">
        <button type="button" onClick={onCancel} className="inline-flex min-h-11 items-center font-pixel text-xs font-bold uppercase tracking-widest underline decoration-2 underline-offset-4">
          Cancel
        </button>
      </div>
    </div>
  );
}
