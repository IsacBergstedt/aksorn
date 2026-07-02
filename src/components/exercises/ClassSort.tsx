"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { classButtonClasses, classLabel } from "@/lib/class-colors";
import type { ConsonantClass, ThaiCharacter } from "@/content/schema";
import type { ExerciseOutcome, OnExerciseComplete } from "./types";

export function ClassSort({
  characters,
  classes,
  onComplete,
}: {
  characters: ThaiCharacter[];
  classes: [ConsonantClass, ConsonantClass];
  onComplete: OnExerciseComplete;
}) {
  const [index, setIndex] = useState(0);
  const [outcomes, setOutcomes] = useState<ExerciseOutcome[]>([]);
  const [feedback, setFeedback] = useState<{
    chosen: ConsonantClass;
    correct: boolean;
  } | null>(null);

  const current = characters[index];

  const choose = (chosen: ConsonantClass) => {
    if (feedback || !current) return;
    const correct = current.class === chosen;
    const nextOutcomes = [...outcomes, { characterId: current.id, correct }];
    setOutcomes(nextOutcomes);
    setFeedback({ chosen, correct });
    setTimeout(() => {
      setFeedback(null);
      if (index + 1 >= characters.length) {
        onComplete(nextOutcomes);
      } else {
        setIndex(index + 1);
      }
    }, 850);
  };

  if (!current) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-muted-foreground">
          Which class does this consonant belong to?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {index + 1} of {characters.length} &middot; not one you&rsquo;ve
          learned? It belongs in the other group.
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          className={cn(
            "rounded-3xl border-2 bg-card px-12 py-6 shadow-sm",
            feedback
              ? feedback.correct
                ? "border-emerald-500 bg-emerald-50"
                : "border-destructive bg-red-50"
              : "border-border",
          )}
        >
          <span className="font-thai text-8xl leading-none">{current.glyph}</span>
        </motion.div>
      </AnimatePresence>

      <div className="grid w-full max-w-md grid-cols-2 gap-3">
        {classes.map((cls) => (
          <motion.button
            key={cls}
            type="button"
            whileTap={{ scale: 0.96 }}
            disabled={!!feedback}
            onClick={() => choose(cls)}
            className={cn(
              "rounded-2xl border-2 bg-card py-4 text-lg font-semibold shadow-sm transition-colors",
              classButtonClasses[cls],
              feedback &&
                cls === current.class &&
                "border-emerald-500 bg-emerald-50 text-emerald-900",
              feedback &&
                !feedback.correct &&
                cls === feedback.chosen &&
                "border-destructive bg-red-50 text-red-900",
            )}
          >
            {classLabel[cls]}
          </motion.button>
        ))}
      </div>

      <div className="h-6 text-center" aria-live="polite">
        {feedback && (
          <p
            className={cn(
              "font-semibold",
              feedback.correct ? "text-emerald-700" : "text-red-700",
            )}
          >
            {feedback.correct
              ? "Correct!"
              : `${current.nameRtgs} is ${classLabel[current.class].toLowerCase()}.`}
          </p>
        )}
      </div>
    </div>
  );
}
