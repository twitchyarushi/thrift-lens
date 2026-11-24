import { WaveDivider } from "@/components/ui";

const ICON = "h-10 w-10";

const VALUES = [
  {
    title: "Second-hand first",
    text: "Pre-loved pieces from thrift partners, so nothing new gets made.",
    icon: (
      <svg viewBox="0 0 24 24" className={ICON} aria-hidden>
        <path d="M12 5a2 2 0 1 1 2 2c-1.2.4-2 1-2 2v1M12 10 3 17h18l-9-7Z" className="fill-none stroke-lyons" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 21h12" className="stroke-lyons" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Local makers",
    text: "Handmade pieces from small makers in Pune, Mumbai and Jaipur.",
    icon: (
      <svg viewBox="0 0 24 24" className={ICON} aria-hidden>
        <path d="M12 22s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" className="fill-none stroke-lyons" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.5" className="fill-red stroke-lyons" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Honest score",
    text: "Every piece gets a 0-100 sustainability score, with the maths shown.",
    icon: (
      <svg viewBox="0 0 24 24" className={ICON} aria-hidden>
        <path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15Z" className="fill-flat stroke-lyons" strokeWidth="2" strokeLinejoin="round" />
        <path d="M5 19c3-5 6-8 10-10" className="fill-none stroke-lyons" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

/** Wavy divider off the paper section above, then three value icons on teal. */
export function ValueProps() {
  return (
    <div className="bg-fanfare text-paper">
      <WaveDivider tone="paper" />
      <section aria-labelledby="values-title" className="mx-auto max-w-5xl px-4 pb-14 pt-6">
        <h2 id="values-title" className="mb-8 text-center font-display text-3xl uppercase sm:text-4xl">
          Why it&rsquo;s <span className="font-serif font-bold normal-case italic">greener</span>
        </h2>
        <ul className="grid gap-8 sm:grid-cols-3">
          {VALUES.map((v, i) => (
            <li key={v.title} className="flex flex-col items-center text-center">
              <span
                className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-lyons bg-mikado shadow-hard"
                style={{ transform: `rotate(${i % 2 ? 4 : -4}deg)` }}
              >
                {v.icon}
              </span>
              <h3 className="mt-4 font-display text-xl uppercase">{v.title}</h3>
              <p className="mt-1 max-w-xs text-sm">{v.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
