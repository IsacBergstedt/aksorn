"use client";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { SrsCard } from "@/lib/srs";
import {
  useProgressStore,
  type LessonCompletion,
  type ProgressSnapshot,
} from "./store";

/**
 * Guest → account migration and ongoing sync.
 * On sign-in: if the account has no progress yet, the local (guest) state is
 * pushed up; otherwise the remote state wins and replaces local. After that,
 * every store change is pushed (debounced). Data volume is tiny (≤44 cards),
 * so we upsert the full snapshot rather than tracking diffs.
 */

let unsubscribe: (() => void) | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;

export async function startSync(supabase: SupabaseClient, user: User) {
  stopSync();

  await supabase.from("profiles").upsert({
    id: user.id,
    display_name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? null,
  });

  const remote = await pullSnapshot(supabase, user.id);
  const store = useProgressStore;
  if (remote) {
    store.getState().adoptSnapshot(remote);
  } else {
    await pushSnapshot(supabase, user.id, store.getState());
  }

  unsubscribe = store.subscribe(() => {
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      void pushSnapshot(supabase, user.id, store.getState());
    }, 2000);
  });
}

export function stopSync() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = null;
  unsubscribe?.();
  unsubscribe = null;
}

async function pullSnapshot(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProgressSnapshot | null> {
  const [statsRes, completionsRes, cardsRes] = await Promise.all([
    supabase.from("user_stats").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("lesson_completions").select("*").eq("user_id", userId),
    supabase.from("srs_cards").select("*").eq("user_id", userId),
  ]);

  if (statsRes.error || completionsRes.error || cardsRes.error) {
    console.error("aksorn: failed to pull progress", {
      stats: statsRes.error,
      completions: completionsRes.error,
      cards: cardsRes.error,
    });
    return null;
  }
  if (!statsRes.data) return null; // no remote progress yet

  const completions: Record<string, LessonCompletion> = {};
  for (const row of completionsRes.data) {
    completions[row.lesson_id] = {
      lessonId: row.lesson_id,
      firstCompletedAt: row.first_completed_at,
      bestScore: row.best_score,
      timesCompleted: row.times_completed,
    };
  }

  const srsCards: Record<string, SrsCard> = {};
  for (const row of cardsRes.data) {
    srsCards[row.character_id] = {
      characterId: row.character_id,
      easeFactor: row.ease_factor,
      intervalDays: row.interval_days,
      repetitions: row.repetitions,
      lapses: row.lapses,
      dueAt: row.due_at,
      lastReviewedAt: row.last_reviewed_at,
    };
  }

  return {
    stats: {
      xp: statsRes.data.xp,
      currentStreak: statsRes.data.current_streak,
      longestStreak: statsRes.data.longest_streak,
      lastActiveDate: statsRes.data.last_active_date,
    },
    completions,
    srsCards,
    toneStats: statsRes.data.tone_stats ?? {},
  };
}

async function pushSnapshot(
  supabase: SupabaseClient,
  userId: string,
  snapshot: ProgressSnapshot,
) {
  const results = await Promise.all([
    supabase.from("user_stats").upsert({
      user_id: userId,
      xp: snapshot.stats.xp,
      current_streak: snapshot.stats.currentStreak,
      longest_streak: snapshot.stats.longestStreak,
      last_active_date: snapshot.stats.lastActiveDate,
      tone_stats: snapshot.toneStats,
      updated_at: new Date().toISOString(),
    }),
    supabase.from("lesson_completions").upsert(
      Object.values(snapshot.completions).map((c) => ({
        user_id: userId,
        lesson_id: c.lessonId,
        first_completed_at: c.firstCompletedAt,
        best_score: c.bestScore,
        times_completed: c.timesCompleted,
      })),
    ),
    supabase.from("srs_cards").upsert(
      Object.values(snapshot.srsCards).map((card) => ({
        user_id: userId,
        character_id: card.characterId,
        ease_factor: card.easeFactor,
        interval_days: card.intervalDays,
        repetitions: card.repetitions,
        lapses: card.lapses,
        due_at: card.dueAt,
        last_reviewed_at: card.lastReviewedAt,
      })),
    ),
  ]);
  for (const res of results) {
    if (res.error) console.error("aksorn: failed to push progress", res.error);
  }
}
