"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThaiWordText } from "@/components/ThaiWordText";
import { cn } from "@/lib/utils";
import { useAudio } from "@/lib/audio";
import { useUiSettings } from "@/lib/ui-settings";
import type { RuntimeExercise } from "@/lib/engine";
import type { OnExerciseComplete } from "./types";

type WordChoiceRuntime = Extract<RuntimeExercise, { kind: "word_choice" }>;

/** Multiple choice over a vocab word, in either direction. */
export function WordChoice({
  exercise,
  onComplete,
}: {
  exercise: WordChoiceRuntime;
  onComplete: OnExerciseComplete;
}) {
  const { direction, target, options } = exercise;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const { play } = useAudio(target.audioKey, target.thai);
  const showRomanization = useUiSettings((s) => s.showRomanization);

  const select = (optionId: string) => {
    if (status !== "idle") return;
    setSelectedId(optionId);
    setStatus(optionId === target.id ? "correct" : "wrong");
    // Voice the word with the feedback (inside the tap gesture — autoplay).
    play();
  };

  const optionState = (optionId: string) => {
    if (status === "idle") return "idle";
    if (optionId === target.id) return "correct";
    if (optionId === selectedId) return "wrong";
    return "dimmed";
  };

  return (
    <div className="flex flex-col gap-8">
      {direction === "thai_to_meaning" ? (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-lg font-semibold text-muted-foreground">
            What does this mean?
          </h2>
          <button
            type="button"
            onClick={play}
            className="group relative rounded-3xl border-2 border-border bg-card px-10 py-6 shadow-sm transition-colors hover:border-primary/40"
            aria-label="Play pronunciation"
          >
            <ThaiWordText word={target} className="text-5xl leading-snug sm:text-6xl" />
            <Volume2 className="absolute right-3 top-3 h-5 w-5 text-muted-foreground group-hover:text-primary" />
          </button>
          {showRomanization && (
            <p className="text-sm text-muted-foreground">{target.rtgs}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-lg font-semibold text-muted-foreground">
            Which one says&hellip;
          </h2>
          <p className="text-3xl font-bold">&ldquo;{target.meaning}&rdquo;</p>
        </div>
      )}

      <div
        className={cn(
          "grid gap-3",
          direction === "thai_to_meaning" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2",
        )}
      >
        {options.map((option) => {
          const state = optionState(option.id);
          return (
            <motion.button
              key={option.id}
              type="button"
              whileTap={status === "idle" ? { scale: 0.96 } : undefined}
              onClick={() => select(option.id)}
              disabled={status !== "idle"}
              className={cn(
                "rounded-2xl border-2 bg-card px-4 py-5 shadow-sm transition-colors",
                state === "idle" && "border-border hover:border-primary/50 hover:bg-secondary",
                state === "correct" && "border-emerald-500 bg-emerald-50",
                state === "wrong" && "border-destructive bg-red-50",
                state === "dimmed" && "border-border opacity-40",
              )}
            >
              {direction === "thai_to_meaning" ? (
                <span className="text-lg font-semibold">{option.meaning}</span>
              ) : (
                // Tone colors appear once answered — before that they'd
                // hand script-savvy learners nothing, but keep the reveal
                // moment consistent with tone_pair.
                <ThaiWordText
                  word={option}
                  colored={status !== "idle"}
                  className="text-3xl leading-snug"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {status !== "idle" && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className={cn(
              "flex items-center justify-between gap-4 rounded-2xl border-2 p-4",
              status === "correct"
                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                : "border-destructive bg-red-50 text-red-900",
            )}
          >
            <div>
              <p className="font-bold">
                {status === "correct" ? "Correct!" : "Not quite."}
              </p>
              {status === "wrong" && (
                <p className="text-sm">
                  <ThaiWordText word={target} className="text-xl" /> ({target.rtgs})
                  means <strong>{target.meaning}</strong>.
                </p>
              )}
            </div>
            <Button
              onClick={() =>
                onComplete([{ characterId: target.id, correct: status === "correct" }])
              }
              variant={status === "correct" ? "default" : "destructive"}
            >
              Continue
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
