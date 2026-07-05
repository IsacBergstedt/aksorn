/**
 * SM-2 style spaced repetition over per-item cards (characters AND vocab
 * words share the id namespace). Shapes mirror the `srs_cards` table (and
 * the guest localStorage copy).
 */

import type { Tone } from "@/content/schema";

/**
 * Per-tone hit/miss tally from tone_pair drills — mirrors
 * user_stats.tone_stats (jsonb). Feeds weakness-targeted reviews.
 */
export type ToneStats = Partial<Record<Tone, { correct: number; wrong: number }>>;

export interface SrsCard {
  characterId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  lapses: number;
  dueAt: string; // ISO timestamp
  lastReviewedAt: string | null;
}

export function newCard(characterId: string, now: Date = new Date()): SrsCard {
  return {
    characterId,
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    lapses: 0,
    dueAt: now.toISOString(),
    lastReviewedAt: null,
  };
}

/** SM-2 quality (0–5) from how a character fared within a session. */
export function qualityFromCounts(correct: number, wrong: number): number {
  const total = correct + wrong;
  if (total === 0) return 4; // seen but never tested (intro only)
  if (wrong === 0) return 5;
  const accuracy = correct / total;
  if (accuracy >= 0.6) return 4;
  if (accuracy >= 0.4) return 3;
  return 2;
}

export function reviewCard(
  card: SrsCard,
  quality: number,
  now: Date = new Date(),
): SrsCard {
  const q = Math.max(0, Math.min(5, quality));
  let { easeFactor, intervalDays, repetitions, lapses } = card;

  if (q < 3) {
    repetitions = 0;
    intervalDays = 1;
    lapses += 1;
  } else {
    if (repetitions === 0) intervalDays = 1;
    else if (repetitions === 1) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);
    repetitions += 1;
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  const dueAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  return {
    ...card,
    easeFactor,
    intervalDays,
    repetitions,
    lapses,
    dueAt: dueAt.toISOString(),
    lastReviewedAt: now.toISOString(),
  };
}

export function isDue(card: SrsCard, now: Date = new Date()): boolean {
  return new Date(card.dueAt).getTime() <= now.getTime();
}

export function dueCards(
  cards: Record<string, SrsCard>,
  now: Date = new Date(),
): SrsCard[] {
  return Object.values(cards)
    .filter((c) => isDue(c, now))
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
}

/**
 * Weakest cards first: most lapses, then lowest ease. Review sessions use
 * this so the cap and the listening drills favor what the learner misses.
 */
export function weaknessFirst(cards: SrsCard[]): SrsCard[] {
  return [...cards].sort(
    (a, b) => b.lapses - a.lapses || a.easeFactor - b.easeFactor,
  );
}
