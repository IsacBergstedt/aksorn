import type { Tone } from "@/content/schema";

export interface ExerciseOutcome {
  characterId: string;
  correct: boolean;
  /** Set by tone drills (tone_pair) — feeds per-tone weakness stats. */
  tone?: Tone;
}

export type OnExerciseComplete = (outcomes: ExerciseOutcome[]) => void;
