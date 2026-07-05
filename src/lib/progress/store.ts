"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  newCard,
  qualityFromCounts,
  reviewCard,
  type SrsCard,
  type ToneStats,
} from "@/lib/srs";

export interface CharOutcomeCounts {
  correct: number;
  wrong: number;
}
export type CharResults = Record<string, CharOutcomeCounts>;

export interface LessonCompletion {
  lessonId: string;
  firstCompletedAt: string;
  bestScore: number; // 0–1 accuracy
  timesCompleted: number;
}

export interface Stats {
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // local YYYY-MM-DD
}

export interface ProgressSnapshot {
  stats: Stats;
  completions: Record<string, LessonCompletion>;
  srsCards: Record<string, SrsCard>;
  /** Per-tone hit/miss from tone drills — drives review over-sampling. */
  toneStats: ToneStats;
}

interface ProgressStore extends ProgressSnapshot {
  completeLesson(input: {
    lessonId: string;
    xpEarned: number;
    score: number;
    teaches: string[];
    reviews: string[];
    charResults: CharResults;
    toneResults: ToneStats;
  }): void;
  completeReview(input: {
    xpEarned: number;
    charResults: CharResults;
    toneResults: ToneStats;
  }): void;
  adoptSnapshot(snapshot: ProgressSnapshot): void;
  resetAll(): void;
}

const emptyStats: Stats = {
  xp: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
};

/** Local calendar date as YYYY-MM-DD (sv-SE locale formats exactly that). */
export function localDate(now: Date = new Date()): string {
  return now.toLocaleDateString("sv-SE");
}

function touchStreak(stats: Stats, now: Date = new Date()): Stats {
  const today = localDate(now);
  if (stats.lastActiveDate === today) return stats;
  const yesterday = localDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  const currentStreak =
    stats.lastActiveDate === yesterday ? stats.currentStreak + 1 : 1;
  return {
    ...stats,
    currentStreak,
    longestStreak: Math.max(stats.longestStreak, currentStreak),
    lastActiveDate: today,
  };
}

function mergeToneStats(base: ToneStats, delta: ToneStats): ToneStats {
  const next: ToneStats = { ...base };
  for (const [tone, counts] of Object.entries(delta) as [
    keyof ToneStats,
    { correct: number; wrong: number },
  ][]) {
    const existing = next[tone] ?? { correct: 0, wrong: 0 };
    next[tone] = {
      correct: existing.correct + counts.correct,
      wrong: existing.wrong + counts.wrong,
    };
  }
  return next;
}

function applySrsResults(
  cards: Record<string, SrsCard>,
  charResults: CharResults,
  allowedIds: Set<string>,
  now: Date,
): Record<string, SrsCard> {
  const next = { ...cards };
  for (const [characterId, counts] of Object.entries(charResults)) {
    // Characters that only appeared as sorting contrast (not yet taught)
    // must not get SRS cards prematurely.
    if (!allowedIds.has(characterId)) continue;
    const card = next[characterId] ?? newCard(characterId, now);
    const quality = qualityFromCounts(counts.correct, counts.wrong);
    next[characterId] = reviewCard(card, quality, now);
  }
  return next;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      stats: emptyStats,
      completions: {},
      srsCards: {},
      toneStats: {},

      completeLesson: ({
        lessonId,
        xpEarned,
        score,
        teaches,
        reviews,
        charResults,
        toneResults,
      }) =>
        set((state) => {
          const now = new Date();
          const touched = touchStreak(state.stats, now);
          const existing = state.completions[lessonId];
          const completion: LessonCompletion = existing
            ? {
                ...existing,
                bestScore: Math.max(existing.bestScore, score),
                timesCompleted: existing.timesCompleted + 1,
              }
            : {
                lessonId,
                firstCompletedAt: now.toISOString(),
                bestScore: score,
                timesCompleted: 1,
              };
          return {
            stats: { ...touched, xp: touched.xp + xpEarned },
            completions: { ...state.completions, [lessonId]: completion },
            srsCards: applySrsResults(
              state.srsCards,
              charResults,
              new Set([...teaches, ...reviews]),
              now,
            ),
            toneStats: mergeToneStats(state.toneStats, toneResults),
          };
        }),

      completeReview: ({ xpEarned, charResults, toneResults }) =>
        set((state) => {
          const now = new Date();
          const touched = touchStreak(state.stats, now);
          return {
            stats: { ...touched, xp: touched.xp + xpEarned },
            srsCards: applySrsResults(
              state.srsCards,
              charResults,
              // Reviews only ever quiz items that already have cards.
              new Set(Object.keys(state.srsCards)),
              now,
            ),
            toneStats: mergeToneStats(state.toneStats, toneResults),
          };
        }),

      adoptSnapshot: (snapshot) =>
        set(() => ({
          stats: snapshot.stats,
          completions: snapshot.completions,
          srsCards: snapshot.srsCards,
          toneStats: snapshot.toneStats ?? {},
        })),

      resetAll: () =>
        set(() => ({
          stats: emptyStats,
          completions: {},
          srsCards: {},
          toneStats: {},
        })),
    }),
    { name: "aksorn-progress-v1" },
  ),
);
