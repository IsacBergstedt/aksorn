"use client";

import { useCallback, useEffect, useState } from "react";
import { getItem, lessonById, phrasesUnitById } from "@/content";
import {
  buildCheckpointExtras,
  buildLessonExercises,
  type RuntimeExercise,
} from "@/lib/engine";
import type { ToneStats } from "@/lib/srs";
import { useProgressStore, type CharResults } from "@/lib/progress/store";
import { ExerciseRunner } from "@/components/exercises/ExerciseRunner";
import { LessonComplete } from "@/components/LessonComplete";

const PERFECT_BONUS_XP = 5;
/** Consolation XP for a failed checkpoint — the SRS evidence still counts. */
const CHECKPOINT_FAIL_XP = 5;

export function LessonClient({ lessonId }: { lessonId: string }) {
  const lesson = lessonById.get(lessonId)!; // existence checked by the page
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const completeReview = useProgressStore((s) => s.completeReview);
  const streak = useProgressStore((s) => s.stats.currentStreak);

  const isCheckpoint = lesson.kind === "checkpoint";

  // Phrases lessons exit back to the Phrases path, script lessons to Reading.
  const exitHref = phrasesUnitById.has(lesson.unitId) ? "/phrases" : "/reading";

  // Exercises are randomized (distractors, shuffles), so they're built
  // after mount to keep server and client HTML identical.
  const [exercises, setExercises] = useState<RuntimeExercise[] | null>(null);
  const [result, setResult] = useState<{
    xpEarned: number;
    accuracy: number;
    failed: boolean;
  } | null>(null);

  const build = useCallback(() => {
    const base = buildLessonExercises(lesson);
    if (!isCheckpoint) return base;
    // Checkpoints append personalized callbacks from the learner's SRS
    // state — read imperatively; the snapshot at build time is what runs.
    const { srsCards, toneStats } = useProgressStore.getState();
    return [...base, ...buildCheckpointExtras(lesson, srsCards, toneStats)];
  }, [lesson, isCheckpoint]);

  useEffect(() => {
    setExercises(build());
    setResult(null);
  }, [build]);

  const handleFinish = useCallback(
    (charResults: CharResults, accuracy: number, toneResults: ToneStats) => {
      const passed =
        !isCheckpoint || accuracy >= (lesson.passThreshold ?? 0);
      if (passed) {
        const xpEarned =
          lesson.xpReward + (accuracy === 1 ? PERFECT_BONUS_XP : 0);
        completeLesson({
          lessonId: lesson.id,
          xpEarned,
          score: accuracy,
          teaches: lesson.teaches,
          reviews: lesson.reviews,
          charResults,
          toneResults,
        });
        setResult({ xpEarned, accuracy, failed: false });
      } else {
        // No completion recorded — the unit stays gated and the node stays
        // "current", so the checkpoint can be retried immediately. The
        // attempt still counts: SRS + tone stats update via the review path
        // (which only touches cards that already exist).
        completeReview({
          xpEarned: CHECKPOINT_FAIL_XP,
          charResults,
          toneResults,
        });
        setResult({ xpEarned: CHECKPOINT_FAIL_XP, accuracy, failed: true });
      }
    },
    [lesson, isCheckpoint, completeLesson, completeReview],
  );

  const retry = useCallback(() => {
    setExercises(build()); // fresh shuffles and callbacks
    setResult(null);
  }, [build]);

  if (result) {
    return (
      <LessonComplete
        title={lesson.title}
        xpEarned={result.xpEarned}
        accuracy={result.accuracy}
        streak={streak}
        checkpoint={isCheckpoint}
        failed={result.failed}
        passThreshold={lesson.passThreshold}
        onRetry={result.failed ? retry : undefined}
        exitHref={exitHref}
      />
    );
  }

  if (!exercises) {
    const first = lesson.teaches[0] ? getItem(lesson.teaches[0]) : null;
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-xl items-center justify-center text-muted-foreground">
        <span className="font-thai text-5xl animate-pulse">
          {first ? (first.kind === "word" ? first.thai : first.glyph) : "อ"}
        </span>
      </div>
    );
  }

  return (
    <ExerciseRunner
      exercises={exercises}
      exitHref={exitHref}
      onFinish={handleFinish}
    />
  );
}
