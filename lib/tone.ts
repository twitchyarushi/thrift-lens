/** The six palette colors plus paper. Every UI primitive takes a Tone, never a raw color. */
export type Tone = "dust" | "mikado" | "flat" | "fanfare" | "lyons" | "red" | "paper";

export const toneBg: Record<Tone, string> = {
  dust: "bg-dust",
  mikado: "bg-mikado",
  flat: "bg-flat",
  fanfare: "bg-fanfare",
  lyons: "bg-lyons",
  red: "bg-red",
  paper: "bg-paper",
};

/** Readable text color on each tone (dust and flat are ~3:1, use bold/large text only). */
export const toneText: Record<Tone, string> = {
  dust: "text-lyons",
  mikado: "text-lyons",
  flat: "text-paper",
  fanfare: "text-paper",
  lyons: "text-paper",
  red: "text-paper",
  paper: "text-lyons",
};

export const toneFill: Record<Tone, string> = {
  dust: "fill-dust",
  mikado: "fill-mikado",
  flat: "fill-flat",
  fanfare: "fill-fanfare",
  lyons: "fill-lyons",
  red: "fill-red",
  paper: "fill-paper",
};

export const toneStroke: Record<Tone, string> = {
  dust: "stroke-dust",
  mikado: "stroke-mikado",
  flat: "stroke-flat",
  fanfare: "stroke-fanfare",
  lyons: "stroke-lyons",
  red: "stroke-red",
  paper: "stroke-paper",
};

/** Text color matching the tone, for colored text on paper. */
export const toneInk: Record<Tone, string> = {
  dust: "text-dust",
  mikado: "text-mikado",
  flat: "text-flat",
  fanfare: "text-fanfare",
  lyons: "text-lyons",
  red: "text-red",
  paper: "text-paper",
};

/** Sustainability score -> tag color. >=75 flat, 50-74 mikado, <50 red. */
export function scoreTone(score: number): Tone {
  if (score >= 75) return "flat";
  if (score >= 50) return "mikado";
  return "red";
}
