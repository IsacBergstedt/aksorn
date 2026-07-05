"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Learner UI preferences (not progress — that's progress/store.ts).
 * Romanization is OFF by default: the course is script-first, and RTGS is
 * a hint the learner opts into, per word card or globally.
 */
interface UiSettings {
  showRomanization: boolean;
  toggleRomanization(): void;
}

export const useUiSettings = create<UiSettings>()(
  persist(
    (set) => ({
      showRomanization: false,
      toggleRomanization: () =>
        set((s) => ({ showRomanization: !s.showRomanization })),
    }),
    { name: "aksorn-ui-settings-v1" },
  ),
);
