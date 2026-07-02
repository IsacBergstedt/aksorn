"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { RuntimeExercise } from "@/lib/engine";
import type { CharResults } from "@/lib/progress/store";
import { IntroCard } from "./IntroCard";
import { ChoiceExercise } from "./ChoiceExercise";
import { MatchPairs } from "./MatchPairs";
import { ClassSort } from "./ClassSort";
import type { ExerciseOutcome } from "./types";

type QueuedExercise = RuntimeExercise & { isRetry?: boolean };

/**
 * Drives a session of exercises: progress bar, transitions, result
 * accumulation. A choice exercise answered wrong is re-queued once at the
 * end of the session.
 */
export function ExerciseRunner({
  exercises,
  exitHref,
  onFinish,
}: {
  exercises: RuntimeExercise[];
  exitHref: string;
  onFinish: (results: CharResults, accuracy: number) => void;
}) {
  const [queue, setQueue] = useState<QueuedExercise[]>(exercises);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<CharResults>({});

  const current = queue[index];

  const handleComplete = useCallback(
    (outcomes: ExerciseOutcome[]) => {
      const nextResults = { ...results };
      for (const { characterId, correct } of outcomes) {
        const counts = nextResults[characterId] ?? { correct: 0, wrong: 0 };
        nextResults[characterId] = {
          correct: counts.correct + (correct ? 1 : 0),
          wrong: counts.wrong + (correct ? 0 : 1),
        };
      }
      setResults(nextResults);

      let nextQueue = queue;
      if (
        current.kind === "choice" &&
        !current.isRetry &&
        outcomes.some((o) => !o.correct)
      ) {
        nextQueue = [...queue, { ...current, isRetry: true }];
        setQueue(nextQueue);
      }

      if (index + 1 >= nextQueue.length) {
        const totals = Object.values(nextResults).reduce(
          (acc, c) => ({
            correct: acc.correct + c.correct,
            wrong: acc.wrong + c.wrong,
          }),
          { correct: 0, wrong: 0 },
        );
        const answered = totals.correct + totals.wrong;
        onFinish(nextResults, answered === 0 ? 1 : totals.correct / answered);
      } else {
        setIndex(index + 1);
      }
    },
    [current, index, queue, results, onFinish],
  );

  if (!current) return null;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-6">
      <div className="flex items-center gap-4">
        <Link
          href={exitHref}
          aria-label="Exit lesson"
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-6 w-6" />
        </Link>
        <Progress value={(index / queue.length) * 100} className="h-3" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {current.kind === "intro" && (
            <IntroCard character={current.character} onComplete={handleComplete} />
          )}
          {current.kind === "choice" && (
            <ChoiceExercise exercise={current} onComplete={handleComplete} />
          )}
          {current.kind === "match_pairs" && (
            <MatchPairs characters={current.characters} onComplete={handleComplete} />
          )}
          {current.kind === "class_sort" && (
            <ClassSort
              characters={current.characters}
              classes={current.classes}
              onComplete={handleComplete}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
