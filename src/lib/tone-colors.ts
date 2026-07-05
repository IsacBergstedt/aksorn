import type { Tone } from "@/content/schema";

/**
 * The fixed five-tone palette, used CONSISTENTLY everywhere a tone is
 * shown: syllable text, badges, contour strokes. Documented in CLAUDE.md;
 * deliberately distinct from the consonant-class colors (indigo/teal/rose).
 */
export const toneLabel: Record<Tone, string> = {
  mid: "mid",
  low: "low",
  falling: "falling",
  high: "high",
  rising: "rising",
};

/** Tone color applied to Thai glyph text, one syllable at a time. */
export const toneTextClasses: Record<Tone, string> = {
  mid: "text-slate-600",
  low: "text-sky-700",
  falling: "text-violet-600",
  high: "text-orange-600",
  rising: "text-emerald-600",
};

export const toneBadgeClasses: Record<Tone, string> = {
  mid: "bg-slate-100 text-slate-700 border-slate-200",
  low: "bg-sky-100 text-sky-800 border-sky-200",
  falling: "bg-violet-100 text-violet-800 border-violet-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  rising: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

/** Hex values (Tailwind slate-600/sky-700/violet-600/orange-600/emerald-600) for SVG strokes. */
export const toneHex: Record<Tone, string> = {
  mid: "#475569",
  low: "#0369a1",
  falling: "#7c3aed",
  high: "#ea580c",
  rising: "#059669",
};

/**
 * Pitch contours in a 100×48 viewBox (y down: 4 = highest pitch, 44 =
 * lowest). Shapes follow the standard Thai tone trajectories: mid = flat
 * middle; low = low with a slight settle; falling = rise then steep drop;
 * high = high with a late rise; rising = dip then climb.
 */
export const toneContourPath: Record<Tone, string> = {
  mid: "M 6 24 L 94 24",
  low: "M 6 34 C 40 36, 70 40, 94 40",
  falling: "M 6 18 C 30 6, 48 8, 62 18 C 76 28, 88 38, 94 42",
  high: "M 6 20 C 40 18, 66 16, 80 12 C 86 10, 91 8, 94 6",
  rising: "M 6 26 C 24 34, 40 36, 56 30 C 74 22, 86 12, 94 6",
};
