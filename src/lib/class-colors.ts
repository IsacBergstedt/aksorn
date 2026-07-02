import type { ConsonantClass } from "@/content/schema";

export const classLabel: Record<ConsonantClass, string> = {
  mid: "Mid class",
  high: "High class",
  low: "Low class",
};

/** Consistent per-class accent colors used on badges and sort buttons. */
export const classBadgeClasses: Record<ConsonantClass, string> = {
  mid: "bg-indigo-100 text-indigo-800 border-indigo-200",
  high: "bg-teal-100 text-teal-800 border-teal-200",
  low: "bg-rose-100 text-rose-800 border-rose-200",
};

export const classButtonClasses: Record<ConsonantClass, string> = {
  mid: "border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-900",
  high: "border-teal-300 hover:border-teal-500 hover:bg-teal-50 text-teal-900",
  low: "border-rose-300 hover:border-rose-500 hover:bg-rose-50 text-rose-900",
};
