"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAudio } from "@/lib/audio";
import { useUiSettings } from "@/lib/ui-settings";
import type { RuntimeExercise } from "@/lib/engine";
import type { OnExerciseComplete } from "./types";

type SentenceBuildRuntime = Extract<RuntimeExercise, { kind: "sentence_build" }>;

/** Outcome id when no token carries a wordId (all-literal sentences). */
const SENTENCE_OUTCOME_ID = "sentence";

/**
 * Word-order drill: tap chips from the bank into the answer row to build
 * the Thai sentence. Chips are tracked by bank index, so duplicate words
 * in one sentence stay distinct. Checking is explicit (a Check button) —
 * unlike the choice exercises there's no single decisive tap.
 */
export function SentenceBuild({
  exercise,
  onComplete,
}: {
  exercise: SentenceBuildRuntime;
  onComplete: OnExerciseComplete;
}) {
  const { meaning, gloss, audioKey, promptMode, tokens, chips, explanation } =
    exercise;
  // Bank indices in placement order.
  const [placed, setPlaced] = useState<number[]>([]);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const sentence = tokens.map((t) => t.thai).join("");
  const { play } = useAudio(audioKey, sentence);
  const showRomanization = useUiSettings((s) => s.showRomanization);

  const placeChip = (bankIndex: number) => {
    if (status !== "idle" || placed.includes(bankIndex)) return;
    setPlaced([...placed, bankIndex]);
  };

  const removeChip = (bankIndex: number) => {
    if (status !== "idle") return;
    setPlaced(placed.filter((i) => i !== bankIndex));
  };

  const check = () => {
    if (status !== "idle" || placed.length === 0) return;
    const built = placed.map((i) => chips[i].thai).join("");
    setStatus(built === sentence ? "correct" : "wrong");
    // Voice the target sentence with the feedback (inside the tap gesture).
    play();
  };

  const correct = status === "correct";

  return (
    <div className="flex flex-col gap-6">
      {promptMode === "meaning" ? (
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-lg font-semibold text-muted-foreground">
            Build it in Thai&hellip;
          </h2>
          <p className="text-2xl font-bold sm:text-3xl">&ldquo;{meaning}&rdquo;</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-lg font-semibold text-muted-foreground">
            Listen, then build what you hear
          </h2>
          <button
            type="button"
            onClick={play}
            aria-label="Play sentence"
            className="group rounded-3xl border-2 border-border bg-card px-10 py-6 shadow-sm transition-colors hover:border-primary/40"
          >
            <Volume2 className="h-10 w-10 text-primary transition-transform group-active:scale-90" />
          </button>
        </div>
      )}

      {/* Answer row */}
      <div
        className={cn(
          "flex min-h-20 flex-wrap content-start items-start gap-2 rounded-2xl border-2 border-dashed p-3",
          status === "idle" && "border-border bg-secondary/40",
          status === "correct" && "border-emerald-500 bg-emerald-50",
          status === "wrong" && "border-destructive bg-red-50",
        )}
        aria-label="Your sentence"
      >
        <AnimatePresence>
          {placed.map((bankIndex) => (
            <motion.button
              key={bankIndex}
              layout
              type="button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => removeChip(bankIndex)}
              disabled={status !== "idle"}
              className="rounded-xl border-2 border-border bg-card px-3 py-2 shadow-sm transition-colors hover:border-primary/50"
            >
              <span className="font-thai text-2xl leading-snug">
                {chips[bankIndex].thai}
              </span>
              {showRomanization && (
                <span className="block text-xs text-muted-foreground">
                  {chips[bankIndex].rtgs}
                </span>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Chip bank */}
      <div className="flex flex-wrap justify-center gap-2">
        {chips.map((chip, bankIndex) => {
          const used = placed.includes(bankIndex);
          return (
            <motion.button
              key={bankIndex}
              type="button"
              whileTap={!used && status === "idle" ? { scale: 0.94 } : undefined}
              onClick={() => placeChip(bankIndex)}
              disabled={used || status !== "idle"}
              className={cn(
                "rounded-xl border-2 px-3 py-2 shadow-sm transition-colors",
                used
                  ? "border-transparent bg-secondary text-transparent shadow-none"
                  : "border-border bg-card hover:border-primary/50 hover:bg-secondary",
              )}
            >
              <span className="font-thai text-2xl leading-snug">{chip.thai}</span>
              {showRomanization && (
                <span
                  className={cn(
                    "block text-xs",
                    used ? "text-transparent" : "text-muted-foreground",
                  )}
                >
                  {chip.rtgs}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {status === "idle" ? (
        <Button onClick={check} disabled={placed.length === 0} className="self-center">
          Check
        </Button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
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
                {promptMode === "audio" && (
                  <>
                    {" "}
                    — <strong>{meaning}</strong>
                  </>
                )}
              </p>
              <p className="mt-1 text-xs opacity-80">Literally: {gloss}</p>
              {explanation && <p className="mt-1 text-sm">{explanation}</p>}
            </div>
            <Button
              onClick={() => {
                const ids =
                  exercise.attributeTo ??
                  tokens.flatMap((t) => (t.wordId ? [t.wordId] : []));
                onComplete(
                  (ids.length > 0 ? ids : [SENTENCE_OUTCOME_ID]).map((id) => ({
                    characterId: id,
                    correct,
                  })),
                );
              }}
              variant={correct ? "default" : "destructive"}
            >
              Continue
            </Button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
