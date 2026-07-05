"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { playAudioKey } from "@/lib/audio";
import { useUiSettings } from "@/lib/ui-settings";
import type { RuntimeExercise } from "@/lib/engine";
import type { OnExerciseComplete } from "./types";

type RegisterChoiceRuntime = Extract<RuntimeExercise, { kind: "register_choice" }>;

/**
 * Reserved outcome id for unattributed register questions — counts toward
 * accuracy, never becomes an SRS card (same pattern as rule_choice's "rule").
 */
const REGISTER_OUTCOME_ID = "register";

/**
 * Register drill: a social situation, several Thai forms — pick the one
 * that fits the room. The correct form is voiced with the feedback.
 */
export function RegisterChoice({
  exercise,
  onComplete,
}: {
  exercise: RegisterChoiceRuntime;
  onComplete: OnExerciseComplete;
}) {
  const { context, question, choices, correctIndex, explanation } = exercise;
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === correctIndex;
  const showRomanization = useUiSettings((s) => s.showRomanization);

  const select = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    // Voice the appropriate form — hearing it in context is the lesson.
    const right = choices[correctIndex];
    playAudioKey(right.audioKey, right.thai);
  };

  const optionState = (i: number) => {
    if (selected === null) return "idle";
    if (i === correctIndex) return "correct";
    if (i === selected) return "wrong";
    return "dimmed";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3 rounded-2xl border-2 border-primary/20 bg-primary/5 p-4">
        <MessagesSquare className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-left font-medium">{context}</p>
      </div>

      <h2 className="text-center text-lg font-semibold text-muted-foreground">
        {question}
      </h2>

      <div className="flex flex-col gap-3">
        {choices.map((choice, i) => {
          const state = optionState(i);
          return (
            <motion.button
              key={i}
              type="button"
              whileTap={selected === null ? { scale: 0.98 } : undefined}
              onClick={() => select(i)}
              disabled={selected !== null}
              className={cn(
                "rounded-2xl border-2 bg-card px-5 py-4 shadow-sm transition-colors",
                state === "idle" && "border-border hover:border-primary/50 hover:bg-secondary",
                state === "correct" && "border-emerald-500 bg-emerald-50",
                state === "wrong" && "border-destructive bg-red-50",
                state === "dimmed" && "border-border opacity-40",
              )}
            >
              <span className="font-thai text-2xl leading-snug">{choice.thai}</span>
              {showRomanization && (
                <span className="ml-3 text-sm text-muted-foreground">
                  {choice.rtgs}
                </span>
              )}
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
                  (exercise.attributeTo ?? [REGISTER_OUTCOME_ID]).map((id) => ({
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
