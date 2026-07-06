"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAudio } from "@/lib/audio";
import { useUiSettings } from "@/lib/ui-settings";
import type { RuntimeExercise } from "@/lib/engine";
import type { OnExerciseComplete } from "./types";

type SentenceListeningRuntime = Extract<
  RuntimeExercise,
  { kind: "sentence_listening" }
>;

/** Outcome id for unattributed answers — sentences aren't SRS items. */
const LISTENING_OUTCOME_ID = "listening";

/**
 * Sentence-level listening comprehension: play a full sentence, then pick
 * its meaning (mode "meaning") or the Thai sentence that was said (mode
 * "transcript"). What the clip actually says is revealed only in feedback.
 */
export function SentenceListening({
  exercise,
  onComplete,
}: {
  exercise: SentenceListeningRuntime;
  onComplete: OnExerciseComplete;
}) {
  const { audioKey, thai, rtgs, mode, choices, correctIndex, explanation } =
    exercise;
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === correctIndex;
  const { play } = useAudio(audioKey, thai);
  const showRomanization = useUiSettings((s) => s.showRomanization);

  // Autoplay on mount may be blocked before the first user gesture — the
  // speaker button is the guaranteed path (same pattern as WordListening).
  useEffect(() => {
    play();
  }, [play]);

  const select = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    // Replay so the sentence lands with the answer revealed.
    play();
  };

  const choiceState = (i: number) => {
    if (selected === null) return "idle";
    if (i === correctIndex) return "correct";
    if (i === selected) return "wrong";
    return "dimmed";
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold text-muted-foreground">
          {mode === "meaning" ? "What does it mean?" : "What did you hear?"}
        </h2>
        <button
          type="button"
          onClick={play}
          className="group rounded-3xl border-2 border-border bg-card px-16 py-10 shadow-sm transition-colors hover:border-primary/40"
          aria-label="Play the sentence again"
        >
          <Volume2 className="h-14 w-14 text-primary transition-transform group-hover:scale-110" />
        </button>
        <p className="text-sm text-muted-foreground">Tap to hear it again</p>
      </div>

      <div className="flex flex-col gap-3">
        {choices.map((choice, i) => {
          const state = choiceState(i);
          return (
            <motion.button
              key={i}
              type="button"
              whileTap={selected === null ? { scale: 0.98 } : undefined}
              onClick={() => select(i)}
              disabled={selected !== null}
              className={cn(
                "rounded-2xl border-2 bg-card px-5 py-4 text-left shadow-sm transition-colors",
                state === "idle" && "border-border hover:border-primary/50 hover:bg-secondary",
                state === "correct" && "border-emerald-500 bg-emerald-50",
                state === "wrong" && "border-destructive bg-red-50",
                state === "dimmed" && "border-border opacity-40",
              )}
            >
              {mode === "meaning" ? (
                <span className="text-lg font-medium">{choice.meaning}</span>
              ) : (
                <>
                  <span className="font-thai text-2xl leading-snug">
                    {choice.thai}
                  </span>
                  {showRomanization && (
                    <span className="ml-3 text-sm text-muted-foreground">
                      {choice.rtgs}
                    </span>
                  )}
                </>
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
                You heard <span className="font-thai text-xl">{thai}</span>
                {showRomanization && <span className="ml-1">({rtgs})</span>} —{" "}
                <strong>{choices[correctIndex].meaning}</strong>.
              </p>
              {explanation && <p className="mt-1 text-sm">{explanation}</p>}
            </div>
            <Button
              onClick={() =>
                onComplete(
                  (exercise.attributeTo ?? [LISTENING_OUTCOME_ID]).map((id) => ({
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
