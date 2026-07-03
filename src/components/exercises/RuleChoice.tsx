"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RuntimeExercise } from "@/lib/engine";
import type { OnExerciseComplete } from "./types";

type RuleChoiceRuntime = Extract<RuntimeExercise, { kind: "rule_choice" }>;

/**
 * Reserved outcome id for unattributed rule questions: counts toward
 * session accuracy but never becomes an SRS card (the store only accepts
 * ids listed in the lesson's teaches/reviews).
 */
const RULE_OUTCOME_ID = "rule";

/** Static multiple choice over a syllable: live/dead calls, tone naming. */
export function RuleChoice({
  exercise,
  onComplete,
}: {
  exercise: RuleChoiceRuntime;
  onComplete: OnExerciseComplete;
}) {
  const { prompt, promptNote, question, choices, correctIndex, explanation } =
    exercise;
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === correctIndex;

  const optionState = (i: number) => {
    if (selected === null) return "idle";
    if (i === correctIndex) return "correct";
    if (i === selected) return "wrong";
    return "dimmed";
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-lg font-semibold text-muted-foreground">
          {question}
        </h2>
        <div className="rounded-3xl border-2 border-border bg-card px-12 py-6 shadow-sm">
          <span className="font-thai text-7xl leading-snug">{prompt}</span>
        </div>
        {promptNote && (
          <p className="text-sm text-muted-foreground">{promptNote}</p>
        )}
      </div>

      <div
        className={cn(
          "grid gap-3",
          choices.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3",
        )}
      >
        {choices.map((choice, i) => {
          const state = optionState(i);
          return (
            <motion.button
              key={i}
              type="button"
              whileTap={selected === null ? { scale: 0.96 } : undefined}
              onClick={() => selected === null && setSelected(i)}
              disabled={selected !== null}
              className={cn(
                "rounded-2xl border-2 bg-card px-4 py-4 text-lg font-semibold shadow-sm transition-colors",
                state === "idle" &&
                  "border-border hover:border-primary/50 hover:bg-secondary",
                state === "correct" && "border-emerald-500 bg-emerald-50",
                state === "wrong" && "border-destructive bg-red-50",
                state === "dimmed" && "border-border opacity-40",
              )}
            >
              {choice}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className={cn(
              "flex items-start justify-between gap-4 rounded-2xl border-2 p-4",
              correct
                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                : "border-destructive bg-red-50 text-red-900",
            )}
          >
            <div>
              <p className="font-bold">{correct ? "Correct!" : "Not quite."}</p>
              {/* The explanation is the lesson — show it either way. */}
              <p className="text-sm">{explanation}</p>
            </div>
            <Button
              onClick={() =>
                onComplete(
                  (exercise.attributeTo ?? [RULE_OUTCOME_ID]).map((id) => ({
                    characterId: id,
                    correct,
                  })),
                )
              }
              variant={correct ? "default" : "destructive"}
            >
              Continue
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
