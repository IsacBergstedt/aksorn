"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCharacterAudio } from "@/lib/audio";
import { answerLabel, type RuntimeExercise } from "@/lib/engine";
import type { ThaiCharacter } from "@/content/schema";
import type { OnExerciseComplete } from "./types";

type ChoiceRuntime = Extract<RuntimeExercise, { kind: "choice" }>;

const glyphPromptByKind: Record<ThaiCharacter["kind"], string> = {
  consonant: "What sound does this consonant make?",
  vowel: "What sound does this vowel make?",
  tone_mark: "What is this tone mark called?",
};

export function ChoiceExercise({
  exercise,
  onComplete,
}: {
  exercise: ChoiceRuntime;
  onComplete: OnExerciseComplete;
}) {
  const { direction, target, options } = exercise;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const { play } = useCharacterAudio(target);

  const select = (optionId: string) => {
    if (status !== "idle") return;
    setSelectedId(optionId);
    setStatus(optionId === target.id ? "correct" : "wrong");
  };

  const optionState = (optionId: string) => {
    if (status === "idle") return "idle";
    if (optionId === target.id) return "correct";
    if (optionId === selectedId) return "wrong";
    return "dimmed";
  };

  return (
    <div className="flex flex-col gap-8">
      {direction === "glyph_to_sound" ? (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-lg font-semibold text-muted-foreground">
            {glyphPromptByKind[target.kind]}
          </h2>
          <button
            type="button"
            onClick={play}
            className="group relative rounded-3xl border-2 border-border bg-card px-12 py-6 shadow-sm transition-colors hover:border-primary/40"
            aria-label="Play pronunciation"
          >
            <span className="font-thai text-8xl leading-none">{target.glyph}</span>
            <Volume2 className="absolute right-3 top-3 h-5 w-5 text-muted-foreground group-hover:text-primary" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-lg font-semibold text-muted-foreground">
            Which one is&hellip;
          </h2>
          <p className="text-3xl font-bold">
            {target.nameRtgs}
            {/* Tone marks are named by their label — no point repeating it. */}
            {target.kind !== "tone_mark" && (
              <span className="ml-2 text-xl font-normal text-muted-foreground">
                ({answerLabel(target)})
              </span>
            )}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
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
                "rounded-2xl border-2 bg-card py-5 shadow-sm transition-colors",
                state === "idle" && "border-border hover:border-primary/50 hover:bg-secondary",
                state === "correct" && "border-emerald-500 bg-emerald-50",
                state === "wrong" && "border-destructive bg-red-50",
                state === "dimmed" && "border-border opacity-40",
              )}
            >
              {direction === "glyph_to_sound" ? (
                <span className="text-2xl font-semibold">
                  {answerLabel(option)}
                </span>
              ) : (
                <span className="font-thai text-5xl leading-none">{option.glyph}</span>
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
                  {direction === "glyph_to_sound" ? (
                    <>
                      <span className="font-thai">{target.glyph}</span> is{" "}
                      <strong>{target.nameRtgs}</strong>
                      {target.kind !== "tone_mark" && (
                        <>
                          {" "}
                          — it sounds like <strong>{answerLabel(target)}</strong>
                        </>
                      )}
                      .
                    </>
                  ) : (
                    <>
                      {target.nameRtgs} is written{" "}
                      <strong className="font-thai text-lg">{target.glyph}</strong>.
                    </>
                  )}
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
