"use client";

import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCharacterAudio } from "@/lib/audio";
import {
  classBadgeClasses,
  classLabel,
  kindBadgeClasses,
} from "@/lib/class-colors";
import { answerLabel } from "@/lib/engine";
import type { ThaiCharacter, ThaiVowel } from "@/content/schema";
import type { OnExerciseComplete } from "./types";

const kindHeading: Record<ThaiCharacter["kind"], string> = {
  consonant: "New character",
  vowel: "New vowel",
  tone_mark: "New tone mark",
};

const positionHint: Record<ThaiVowel["position"], string> = {
  after: "written after the consonant",
  before: "written before the consonant",
  above: "written above the consonant",
  below: "written below the consonant",
  around: "wraps around the consonant",
};

export function IntroCard({
  character,
  onComplete,
}: {
  character: ThaiCharacter;
  onComplete: OnExerciseComplete;
}) {
  const { play } = useCharacterAudio(character);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        {kindHeading[character.kind]}
      </p>

      <motion.button
        type="button"
        onClick={play}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="group relative rounded-3xl border-2 border-border bg-card px-14 py-8 shadow-sm transition-colors hover:border-primary/40"
        aria-label={`Play pronunciation of ${character.nameRtgs}`}
      >
        <span className="font-thai text-8xl leading-none text-foreground sm:text-9xl">
          {character.glyph}
        </span>
        <Volume2 className="absolute right-3 top-3 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
      </motion.button>

      <div className="space-y-1">
        <p className="text-2xl font-semibold">
          {character.nameRtgs}
          <span className="ml-2 font-thai text-xl text-muted-foreground">
            {character.nameThai}
          </span>
        </p>
        {character.kind === "consonant" && (
          <p className="text-muted-foreground">
            &ldquo;{character.meaning}&rdquo; &middot; sounds like{" "}
            <span className="font-semibold text-foreground">
              {character.initialSound}
            </span>
            {character.finalSound &&
              character.finalSound !== character.initialSound && (
                <>
                  {" "}
                  (ends a syllable as{" "}
                  <span className="font-semibold text-foreground">
                    {character.finalSound}
                  </span>
                  )
                </>
              )}
          </p>
        )}
        {character.kind === "vowel" && (
          <p className="text-muted-foreground">
            sounds like{" "}
            <span className="font-semibold text-foreground">
              {answerLabel(character)}
            </span>{" "}
            &middot; {positionHint[character.position]}
          </p>
        )}
      </div>

      {character.kind === "consonant" ? (
        <Badge variant="outline" className={classBadgeClasses[character.class]}>
          {classLabel[character.class]}
        </Badge>
      ) : character.kind === "vowel" ? (
        <Badge variant="outline" className={kindBadgeClasses.vowel}>
          {character.length === "short" ? "Short vowel" : "Long vowel"}
        </Badge>
      ) : (
        <Badge variant="outline" className={kindBadgeClasses.tone_mark}>
          Tone mark
        </Badge>
      )}

      {character.note && (
        <p className="max-w-sm text-sm text-muted-foreground">{character.note}</p>
      )}

      <Button
        size="lg"
        className="mt-2 w-full max-w-xs"
        onClick={() => onComplete([])}
      >
        Got it
      </Button>
    </div>
  );
}
