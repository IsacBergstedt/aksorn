"use client";

import { useCallback, useEffect, useState } from "react";
import { getItem, lessonById, phrasesUnitById } from "@/content";
import { buildLessonExercises, type RuntimeExercise } from "@/lib/engine";
import type { ToneStats } from "@/lib/srs";
import { useProgressStore, type CharResults } from "@/lib/progress/store";
import { ExerciseRunner } from "@/components/exercises/ExerciseRunner";
import { LessonComplete } from "@/components/LessonComplete";

const PERFECT_BONUS_XP = 5;

export function LessonClient({ lessonId }: { lessonId: string }) {
  const lesson = lessonById.get(lessonId)!; // existence checked by the page
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const streak = useProgressStore((s) => s.stats.currentStreak);

  // Phrases lessons exit back to the Phrases path, script lessons to Reading.
  const exitHref = phrasesUnitById.has(lesson.unitId) ? "/phrases" : "/reading";

  // Exercises are randomized (distractors, shuffles), so they're built
  // after mount to keep server and client HTML identical.
  const [exercises, setExercises] = useState<RuntimeExercise[] | null>(null);
  const [result, setResult] = useState<{
    xpEarned: number;
    accuracy: number;
  } | null>(null);

  useEffect(() => {
    setExercises(buildLessonExercises(lesson));
    setResult(null);
  }, [lesson]);

  const handleFinish = useCallback(
    (charResults: CharResults, accuracy: number, toneResults: ToneStats) => {
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
      setResult({ xpEarned, accuracy });
    },
    [lesson, completeLesson],
  );

  if (result) {
    return (
      <LessonComplete
        title={lesson.title}
        xpEarned={result.xpEarned}
        accuracy={result.accuracy}
        streak={streak}
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
