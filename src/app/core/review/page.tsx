"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { corePilot, coreSentenceBuild, coreSentenceListening, coreUnits, lessonById } from "@/content";
import { buildLessonExercises, type RuntimeExercise } from "@/lib/engine";
import { useProgressStore, type CharResults } from "@/lib/progress/store";
import type { ToneStats } from "@/lib/srs";
import { ExerciseRunner } from "@/components/exercises/ExerciseRunner";
import { LessonComplete } from "@/components/LessonComplete";
import { Button } from "@/components/ui/button";

export default function CoreReviewPage() {
  const [exercises, setExercises] = useState<RuntimeExercise[] | null>(null);
  const [result, setResult] = useState<{ accuracy: number; xp: number } | null>(null);
  const streak = useProgressStore(s => s.stats.currentStreak);
  useEffect(() => {
    const { completions, srsCards } = useProgressStore.getState();
    const introduced = new Set(coreUnits.flatMap(u => u.lessonIds).filter(id => completions[id]).flatMap(id => lessonById.get(id)!.teaches));
    const due = corePilot.filter(e => introduced.has(e.wordId) && srsCards[e.wordId] && new Date(srsCards[e.wordId].dueAt).getTime() <= Date.now())
      .sort((a, b) => (srsCards[a.wordId].repetitions - srsCards[b.wordId].repetitions) || a.rank - b.rank).slice(0, 10);
    setExercises(due.length ? buildLessonExercises({ id: "core-review", unitId: "core-unit-1", order: 1,
      title: "Core sentence review", xpReward: 10, teaches: [], reviews: due.map(e => e.wordId),
      pedagogy: "Review only introduced, due Core words through their original sentences.",
      exercises: due.map((e, i) => i % 2 ? coreSentenceBuild(e) : coreSentenceListening(e, corePilot)),
    }) : []);
  }, []);
  function finish(charResults: CharResults, accuracy: number, toneResults: ToneStats) {
    const xp = 10 + (accuracy === 1 ? 5 : 0);
    useProgressStore.getState().completeReview({ xpEarned: xp, charResults, toneResults });
    setResult({ accuracy, xp });
  }
  if (result) return <LessonComplete title="Core sentence review" xpEarned={result.xp} accuracy={result.accuracy} streak={streak} exitHref="/core" />;
  if (!exercises) return <main className="mx-auto max-w-xl p-8 text-center text-muted-foreground">Preparing your sentence review…</main>;
  if (!exercises.length) return <main className="mx-auto max-w-xl p-8 text-center"><h1 className="text-2xl font-bold">All caught up</h1><p className="my-4 text-muted-foreground">No introduced Core words are due. Continue a lesson or come back for review later.</p><Button render={<Link href="/core" />}>Back to Core 1,000</Button></main>;
  return <ExerciseRunner exercises={exercises} exitHref="/core" onFinish={finish} />;
}
