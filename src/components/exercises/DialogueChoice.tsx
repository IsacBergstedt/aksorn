"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessagesSquare, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { playAudioKey } from "@/lib/audio";
import { useUiSettings } from "@/lib/ui-settings";
import type { RuntimeExercise } from "@/lib/engine";
import type { OnExerciseComplete } from "./types";

type DialogueChoiceRuntime = Extract<RuntimeExercise, { kind: "dialogue_choice" }>;

/**
 * Register-slip outcomes route here instead of the vocab cards: picking an
 * understandable-but-blunt reply dents session accuracy (and re-queues the
 * exercise) but is not evidence the learner doesn't know the words.
 * Same reserved-id pattern as RegisterChoice.
 */
const REGISTER_OUTCOME_ID = "register";
/** Outcome id when the exercise has no attributeTo. */
const DIALOGUE_OUTCOME_ID = "dialogue";

/**
 * A dialogue turn: hear the other speaker, pick the reply that fits the
 * situation. Every choice is grammatical — the wrong ones are wrong for
 * different reasons (meaning, register, situation), and the picked
 * choice's own note is the feedback. Register slips get a softer, amber
 * verdict: understood, but blunt.
 */
export function DialogueChoice({
  exercise,
  onComplete,
}: {
  exercise: DialogueChoiceRuntime;
  onComplete: OnExerciseComplete;
}) {
  const { context, speaker, question, choices } = exercise;
  const [selected, setSelected] = useState<number | null>(null);
  const showRomanization = useUiSettings((s) => s.showRomanization);

  const bestIndex = choices.findIndex((c) => c.quality === "best");
  const picked = selected === null ? null : choices[selected];
  const verdict = picked?.quality ?? null;

  const playSpeaker = () => playAudioKey(speaker.audioKey, speaker.thai);

  const select = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    // The best reply is always voiced with the feedback — hearing the
    // natural answer in context is the lesson (inside the tap gesture).
    const best = choices[bestIndex];
    playAudioKey(best.audioKey, best.thai);
  };

  const choiceState = (i: number) => {
    if (selected === null) return "idle";
    if (i === bestIndex) return "correct";
    if (i === selected) return verdict === "register" ? "soft" : "wrong";
    return "dimmed";
  };

  const finish = () => {
    if (verdict === null) return;
    const words = exercise.attributeTo ?? [DIALOGUE_OUTCOME_ID];
    if (verdict === "register") {
      // Soft wrong: accuracy only, vocab SRS untouched.
      onComplete([{ characterId: REGISTER_OUTCOME_ID, correct: false }]);
    } else {
      onComplete(
        words.map((id) => ({ characterId: id, correct: verdict === "best" })),
      );
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3 rounded-2xl border-2 border-primary/20 bg-primary/5 p-4">
        <MessagesSquare className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-left font-medium">{context}</p>
      </div>

      {/* The other speaker's line — a voiced chat bubble. */}
      <div className="flex justify-start">
        <button
          type="button"
          onClick={playSpeaker}
          className="group flex max-w-[85%] items-center gap-3 rounded-2xl rounded-tl-sm border-2 border-border bg-card px-4 py-3 text-left shadow-sm transition-colors hover:border-primary/40"
          aria-label="Play the speaker's line again"
        >
          <Volume2 className="h-5 w-5 shrink-0 text-primary" />
          <span>
            <span className="font-thai text-2xl leading-snug">{speaker.thai}</span>
            {showRomanization && (
              <span className="block text-xs text-muted-foreground">
                {speaker.rtgs}
              </span>
            )}
            {selected !== null && (
              <span className="block text-sm text-muted-foreground">
                &ldquo;{speaker.meaning}&rdquo;
              </span>
            )}
          </span>
        </button>
      </div>

      <h2 className="text-center text-lg font-semibold text-muted-foreground">
        {question}
      </h2>

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
                state === "soft" && "border-amber-500 bg-amber-50",
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
        {picked !== null && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className={cn(
              "flex items-start justify-between gap-4 rounded-2xl border-2 p-4",
              verdict === "best" && "border-emerald-500 bg-emerald-50 text-emerald-900",
              verdict === "register" && "border-amber-500 bg-amber-50 text-amber-900",
              (verdict === "meaning" || verdict === "situation") &&
                "border-destructive bg-red-50 text-red-900",
            )}
          >
            <div>
              <p className="font-bold">
                {verdict === "best"
                  ? "Correct!"
                  : verdict === "register"
                    ? "They'd understand you — but it's blunt."
                    : "Not quite."}
              </p>
              <p className="text-sm">{picked.note}</p>
              {verdict !== "best" && (
                <p className="mt-1 text-sm">
                  The natural reply:{" "}
                  <span className="font-thai text-lg">{choices[bestIndex].thai}</span>
                  {showRomanization && (
                    <span className="ml-1">({choices[bestIndex].rtgs})</span>
                  )}
                </p>
              )}
            </div>
            <Button
              onClick={finish}
              variant={verdict === "best" ? "default" : "destructive"}
              className={cn(
                verdict === "register" &&
                  "bg-amber-600 text-white hover:bg-amber-700",
              )}
            >
              Continue
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
