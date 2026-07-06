"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAudio } from "@/lib/audio";
import { useUiSettings } from "@/lib/ui-settings";
import type { RuntimeExercise } from "@/lib/engine";
import type { OnExerciseComplete } from "./types";

type SentenceClozeRuntime = Extract<RuntimeExercise, { kind: "sentence_cloze" }>;

/** Outcome id when the blanked token has no wordId and no attributeTo. */
const CLOZE_OUTCOME_ID = "cloze";

/**
 * Sentence fill-in-the-blank: the sentence renders with one token hidden;
 * pick the missing token. After answering, the gap fills with the correct
 * token so the learner always reads the complete sentence, voiced.
 */
export function SentenceCloze({
  exercise,
  onComplete,
}: {
  exercise: SentenceClozeRuntime;
  onComplete: OnExerciseComplete;
}) {
  const { meaning, audioKey, tokens, blankIndex, choices, correctIndex, explanation } =
    exercise;
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === correctIndex;
  const sentence = tokens.map((t) => t.thai).join("");
  const { play } = useAudio(audioKey, sentence);
  const showRomanization = useUiSettings((s) => s.showRomanization);

  const select = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    // Voice the full sentence with the feedback (inside the tap gesture).
    play();
  };

  const choiceState = (i: number) => {
    if (selected === null) return "idle";
    if (i === correctIndex) return "correct";
    if (i === selected) return "wrong";
    return "dimmed";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-lg font-semibold text-muted-foreground">
          Fill in the missing word&hellip;
        </h2>
        <p className="text-xl font-bold sm:text-2xl">&ldquo;{meaning}&rdquo;</p>
      </div>

      {/* The sentence, with the blank as a dashed slot until answered. */}
      <div className="flex flex-wrap items-end justify-center gap-2">
        {tokens.map((token, i) =>
          i === blankIndex ? (
            <span
              key={i}
              className={cn(
                "inline-flex min-w-16 justify-center rounded-xl border-2 border-dashed px-3 py-2",
                selected === null && "border-primary/50 bg-primary/5",
                selected !== null && "border-emerald-500 bg-emerald-50",
              )}
            >
              {selected !== null ? (
                <span className="font-thai text-2xl leading-snug">
                  {choices[correctIndex].thai}
                </span>
              ) : (
                <span className="text-2xl leading-snug text-muted-foreground">
                  ?
                </span>
              )}
            </span>
          ) : (
            <span key={i} className="px-0.5 text-center">
              <span className="font-thai text-2xl leading-snug">{token.thai}</span>
              {showRomanization && (
                <span className="block text-xs text-muted-foreground">
                  {token.rtgs}
                </span>
              )}
            </span>
          ),
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {choices.map((choice, i) => {
          const state = choiceState(i);
          return (
            <motion.button
              key={i}
              type="button"
              whileTap={selected === null ? { scale: 0.96 } : undefined}
              onClick={() => select(i)}
              disabled={selected !== null}
              className={cn(
                "rounded-2xl border-2 bg-card px-4 py-4 shadow-sm transition-colors",
                state === "idle" && "border-border hover:border-primary/50 hover:bg-secondary",
                state === "correct" && "border-emerald-500 bg-emerald-50",
                state === "wrong" && "border-destructive bg-red-50",
                state === "dimmed" && "border-border opacity-40",
              )}
            >
              <span className="font-thai text-2xl leading-snug">{choice.thai}</span>
              {showRomanization && (
                <span className="block text-xs text-muted-foreground">
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
              <p className="text-sm">
                <span className="font-thai text-xl">{sentence}</span>
                {showRomanization && (
                  <span className="ml-2">({tokens.map((t) => t.rtgs).join(" ")})</span>
                )}
              </p>
              <p className="mt-1 text-sm">{explanation}</p>
            </div>
            <Button
              onClick={() => {
                const blankWordId = tokens[blankIndex].wordId;
                const ids =
                  exercise.attributeTo ??
                  (blankWordId ? [blankWordId] : [CLOZE_OUTCOME_ID]);
                onComplete(ids.map((id) => ({ characterId: id, correct })));
              }}
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
