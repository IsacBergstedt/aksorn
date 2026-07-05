"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Ear, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToneContour } from "@/components/ToneContour";
import { cn } from "@/lib/utils";
import { playAudioKey, useAudio } from "@/lib/audio";
import { toneBadgeClasses, toneLabel, toneTextClasses } from "@/lib/tone-colors";
import type { RuntimeExercise } from "@/lib/engine";
import type { OnExerciseComplete } from "./types";

type TonePairRuntime = Extract<RuntimeExercise, { kind: "tone_pair" }>;

/**
 * Minimal-pair tone drill: hear one word, pick it among spellings that
 * differ only in tone. Options stay in neutral ink until answered — the
 * tone colors would give the game away. After answering every option is
 * tappable, so the learner can A/B the tones side by side.
 */
export function TonePair({
  exercise,
  onComplete,
}: {
  exercise: TonePairRuntime;
  onComplete: OnExerciseComplete;
}) {
  const { set, correctIndex } = exercise;
  const target = set.options[correctIndex];
  const [selected, setSelected] = useState<number | null>(null);
  const status =
    selected === null ? "idle" : selected === correctIndex ? "correct" : "wrong";
  const { play } = useAudio(target.audioKey, target.thai);

  useEffect(() => {
    play();
  }, [play]);

  const select = (i: number) => {
    if (selected !== null) {
      // Post-answer: compare the tones by ear.
      const opt = set.options[i];
      playAudioKey(opt.audioKey, opt.thai);
      return;
    }
    setSelected(i);
    play();
  };

  const optionState = (i: number) => {
    if (selected === null) return "idle";
    if (i === correctIndex) return "correct";
    if (i === selected) return "wrong";
    return "dimmed";
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
          <Ear className="h-5 w-5" />
          Same syllable — which tone do you hear?
        </h2>
        <button
          type="button"
          onClick={play}
          className="group rounded-3xl border-2 border-border bg-card px-16 py-10 shadow-sm transition-colors hover:border-primary/40"
          aria-label="Play the word again"
        >
          <Volume2 className="h-14 w-14 text-primary transition-transform group-hover:scale-110" />
        </button>
        <p className="text-sm text-muted-foreground">Tap to hear it again</p>
      </div>

      <div
        className={cn(
          "grid gap-3",
          set.options.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4",
        )}
      >
        {set.options.map((option, i) => {
          const state = optionState(i);
          return (
            <motion.button
              key={i}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => select(i)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border-2 bg-card px-3 py-5 shadow-sm transition-colors",
                state === "idle" && "border-border hover:border-primary/50 hover:bg-secondary",
                state === "correct" && "border-emerald-500 bg-emerald-50",
                state === "wrong" && "border-destructive bg-red-50",
                state === "dimmed" && "border-border opacity-50",
              )}
            >
              <span
                className={cn(
                  "font-thai text-4xl leading-snug",
                  selected !== null && toneTextClasses[option.tone],
                )}
              >
                {option.thai}
              </span>
              {/* The reveal: tone, contour, and meaning appear together. */}
              {selected !== null && (
                <>
                  <Badge variant="outline" className={toneBadgeClasses[option.tone]}>
                    <ToneContour tone={option.tone} className="mr-1 h-2.5 w-6" />
                    {toneLabel[option.tone]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {option.meaning}
                  </span>
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
              status === "correct"
                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                : "border-destructive bg-red-50 text-red-900",
            )}
          >
            <div>
              <p className="font-bold">
                {status === "correct" ? "Correct!" : "Not quite."}
              </p>
              <p className="text-sm">
                You heard{" "}
                <strong className="font-thai text-lg">{target.thai}</strong> —{" "}
                {toneLabel[target.tone]} tone, &ldquo;{target.meaning}&rdquo;.
                {set.note && <> {set.note}</>}
              </p>
              <p className="mt-1 text-xs opacity-80">
                Tap the options to compare the tones.
              </p>
            </div>
            <Button
              onClick={() =>
                onComplete([
                  {
                    characterId: "tone",
                    correct: status === "correct",
                    tone: target.tone,
                  },
                ])
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
