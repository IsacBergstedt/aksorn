"use client";

import { motion } from "framer-motion";
import { Lightbulb, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/lib/audio";
import type { RuntimeExercise } from "@/lib/engine";
import type { OnExerciseComplete } from "./types";

type ConceptRuntime = Extract<RuntimeExercise, { kind: "concept" }>;

/**
 * Unscored teaching screen for rules that character drills alone can't
 * convey (consonant classes, live/dead syllables, tone logic).
 */
export function ConceptCard({
  exercise,
  onComplete,
}: {
  exercise: ConceptRuntime;
  onComplete: OnExerciseComplete;
}) {
  const { title, body, thaiExample, exampleAudioKey } = exercise;
  const { play } = useAudio(exampleAudioKey, thaiExample);

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Concept
      </p>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full rounded-3xl border-2 border-border bg-card p-8 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Lightbulb className="h-6 w-6 shrink-0 text-amber-500" />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>

        {thaiExample &&
          (exampleAudioKey ? (
            <button
              type="button"
              onClick={play}
              className="group relative mx-auto mt-6 block rounded-2xl px-8 py-2 text-center transition-colors hover:bg-secondary"
              aria-label="Play the example"
            >
              <span className="font-thai text-6xl leading-tight">{thaiExample}</span>
              <Volume2 className="absolute -right-1 top-0 h-5 w-5 text-muted-foreground group-hover:text-primary" />
            </button>
          ) : (
            <p className="mt-6 text-center font-thai text-6xl leading-tight">
              {thaiExample}
            </p>
          ))}

        <div className="mt-5 space-y-3 text-muted-foreground">
          {body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </motion.div>

      <Button
        size="lg"
        className="w-full max-w-xs"
        onClick={() => onComplete([])}
      >
        Got it
      </Button>
    </div>
  );
}
