"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { RuntimeExercise } from "@/lib/engine";
import type { ToneStats } from "@/lib/srs";
import type { CharResults } from "@/lib/progress/store";
import { IntroCard } from "./IntroCard";
import { ConceptCard } from "./ConceptCard";
import { ChoiceExercise } from "./ChoiceExercise";
import { ListeningExercise } from "./ListeningExercise";
import { MatchPairs } from "./MatchPairs";
import { ClassSort } from "./ClassSort";
import { RuleChoice } from "./RuleChoice";
import { WordIntroCard } from "./WordIntroCard";
import { WordChoice } from "./WordChoice";
import { WordListening } from "./WordListening";
import { TonePair } from "./TonePair";
import { RegisterChoice } from "./RegisterChoice";
import { SentenceBuild } from "./SentenceBuild";
import type { ExerciseOutcome } from "./types";

type QueuedExercise = RuntimeExercise & { isRetry?: boolean };

/** Choice-style exercises answered wrong get re-queued once at the end. */
const RETRYABLE = new Set<RuntimeExercise["kind"]>([
  "choice",
  "rule_choice",
  "listening",
  "word_choice",
  "word_listening",
  "tone_pair",
  "register_choice",
  "sentence_build",
]);

/**
 * Drives a session of exercises: progress bar, transitions, result
 * accumulation (per-item counts for SRS plus per-tone counts for
 * weakness targeting). A choice exercise answered wrong is re-queued once
 * at the end of the session.
 */
export function ExerciseRunner({
  exercises,
  exitHref,
  onFinish,
}: {
  exercises: RuntimeExercise[];
  exitHref: string;
  onFinish: (results: CharResults, accuracy: number, toneResults: ToneStats) => void;
}) {
  const [queue, setQueue] = useState<QueuedExercise[]>(exercises);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<CharResults>({});
  const [toneResults, setToneResults] = useState<ToneStats>({});

  const current = queue[index];

  const handleComplete = useCallback(
    (outcomes: ExerciseOutcome[]) => {
      const nextResults = { ...results };
      const nextToneResults = { ...toneResults };
      for (const { characterId, correct, tone } of outcomes) {
        const counts = nextResults[characterId] ?? { correct: 0, wrong: 0 };
        nextResults[characterId] = {
          correct: counts.correct + (correct ? 1 : 0),
          wrong: counts.wrong + (correct ? 0 : 1),
        };
        if (tone) {
          const t = nextToneResults[tone] ?? { correct: 0, wrong: 0 };
          nextToneResults[tone] = {
            correct: t.correct + (correct ? 1 : 0),
            wrong: t.wrong + (correct ? 0 : 1),
          };
        }
      }
      setResults(nextResults);
      setToneResults(nextToneResults);

      let nextQueue = queue;
      if (
        RETRYABLE.has(current.kind) &&
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
        onFinish(
          nextResults,
          answered === 0 ? 1 : totals.correct / answered,
          nextToneResults,
        );
      } else {
        setIndex(index + 1);
      }
    },
    [current, index, queue, results, toneResults, onFinish],
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
          {current.kind === "concept" && (
            <ConceptCard exercise={current} onComplete={handleComplete} />
          )}
          {current.kind === "rule_choice" && (
            <RuleChoice exercise={current} onComplete={handleComplete} />
          )}
          {current.kind === "choice" && (
            <ChoiceExercise exercise={current} onComplete={handleComplete} />
          )}
          {current.kind === "listening" && (
            <ListeningExercise exercise={current} onComplete={handleComplete} />
          )}
          {current.kind === "match_pairs" && (
            <MatchPairs items={current.items} onComplete={handleComplete} />
          )}
          {current.kind === "class_sort" && (
            <ClassSort
              characters={current.characters}
              classes={current.classes}
              onComplete={handleComplete}
            />
          )}
          {current.kind === "word_intro" && (
            <WordIntroCard word={current.word} onComplete={handleComplete} />
          )}
          {current.kind === "word_choice" && (
            <WordChoice exercise={current} onComplete={handleComplete} />
          )}
          {current.kind === "word_listening" && (
            <WordListening exercise={current} onComplete={handleComplete} />
          )}
          {current.kind === "tone_pair" && (
            <TonePair exercise={current} onComplete={handleComplete} />
          )}
          {current.kind === "register_choice" && (
            <RegisterChoice exercise={current} onComplete={handleComplete} />
          )}
          {current.kind === "sentence_build" && (
            <SentenceBuild exercise={current} onComplete={handleComplete} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
