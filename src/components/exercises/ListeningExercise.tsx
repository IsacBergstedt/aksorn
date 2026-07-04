"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCharacterAudio } from "@/lib/audio";
import { answerLabel, type RuntimeExercise } from "@/lib/engine";
import type { OnExerciseComplete } from "./types";

type ListeningRuntime = Extract<RuntimeExercise, { kind: "listening" }>;

/**
 * Audio-only prompt: hear the character, pick its glyph. Autoplay on mount
 * may be blocked before the first user gesture — the play() promise is
 * catch-wrapped in the audio lib, and the speaker button is the guaranteed
 * path.
 */
export function ListeningExercise({
  exercise,
  onComplete,
}: {
  exercise: ListeningRuntime;
  onComplete: OnExerciseComplete;
}) {
  const { target, options } = exercise;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const { play } = useCharacterAudio(target);

  useEffect(() => {
    play();
  }, [play]);

  const select = (optionId: string) => {
    if (status !== "idle") return;
    setSelectedId(optionId);
    setStatus(optionId === target.id ? "correct" : "wrong");
    // Replay the answer so the sound lands with the glyph now revealed.
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
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold text-muted-foreground">
          What do you hear?
        </h2>
        <button
          type="button"
          onClick={play}
          className="group rounded-3xl border-2 border-border bg-card px-16 py-10 shadow-sm transition-colors hover:border-primary/40"
          aria-label="Play the sound again"
        >
          <Volume2 className="h-14 w-14 text-primary transition-transform group-hover:scale-110" />
        </button>
        <p className="text-sm text-muted-foreground">Tap to hear it again</p>
      </div>

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
              <span className="font-thai text-5xl leading-none">{option.glyph}</span>
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
                  You heard <strong>{target.nameRtgs}</strong> — written{" "}
                  <strong className="font-thai text-lg">{target.glyph}</strong>
                  {target.kind !== "tone_mark" && (
                    <>
                      {" "}
                      (sounds like <strong>{answerLabel(target)}</strong>)
                    </>
                  )}
                  .
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
