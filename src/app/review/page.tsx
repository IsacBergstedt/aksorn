"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildReviewExercises,
  reviewXp,
  type RuntimeExercise,
} from "@/lib/engine";
import { dueCards } from "@/lib/srs";
import { useProgressStore, type CharResults } from "@/lib/progress/store";
import { ExerciseRunner } from "@/components/exercises/ExerciseRunner";
import { LessonComplete } from "@/components/LessonComplete";

export default function ReviewPage() {
  const completeReview = useProgressStore((s) => s.completeReview);
  const streak = useProgressStore((s) => s.stats.currentStreak);

  const [session, setSession] = useState<{
    characterIds: string[];
    exercises: RuntimeExercise[];
  } | null>(null);
  const [empty, setEmpty] = useState(false);
  const [result, setResult] = useState<{
    xpEarned: number;
    accuracy: number;
  } | null>(null);

  // The due list is frozen once on mount so completing exercises doesn't
  // reshuffle the session under the learner.
  useEffect(() => {
    const due = dueCards(useProgressStore.getState().srsCards);
    if (due.length === 0) {
      setEmpty(true);
      return;
    }
    const characterIds = due.map((c) => c.characterId);
    setSession({
      characterIds,
      exercises: buildReviewExercises(characterIds),
    });
  }, []);

  const handleFinish = useCallback(
    (charResults: CharResults, accuracy: number) => {
      if (!session) return;
      const xpEarned = reviewXp(
        Math.min(session.characterIds.length, Object.keys(charResults).length),
      );
      completeReview({ xpEarned, charResults });
      setResult({ xpEarned, accuracy });
    },
    [session, completeReview],
  );

  if (result) {
    return (
      <LessonComplete
        title="Review session"
        xpEarned={result.xpEarned}
        accuracy={result.accuracy}
        streak={streak}
      />
    );
  }

  if (empty) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <BookOpenCheck className="h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Nothing due right now</h1>
        <p className="text-muted-foreground">
          Your characters are all fresh in memory. Keep going with the next
          lesson, or come back when reviews are due.
        </p>
        <Button render={<Link href="/reading" />}>Back to lessons</Button>
      </main>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-xl items-center justify-center">
        <span className="font-thai text-5xl animate-pulse text-muted-foreground">
          อ
        </span>
      </div>
    );
  }

  return (
    <ExerciseRunner
      exercises={session.exercises}
      exitHref="/reading"
      onFinish={handleFinish}
    />
  );
}
