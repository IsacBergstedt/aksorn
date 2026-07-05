"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThaiWordText } from "@/components/ThaiWordText";
import { ToneContour } from "@/components/ToneContour";
import { useAudio } from "@/lib/audio";
import { classBadgeClasses, classLabel } from "@/lib/class-colors";
import { toneBadgeClasses, toneLabel } from "@/lib/tone-colors";
import { useUiSettings } from "@/lib/ui-settings";
import { getCharacter } from "@/content";
import type { Syllable, VocabWord } from "@/content/schema";
import { cn } from "@/lib/utils";
import type { OnExerciseComplete } from "./types";

const registerLabel: Record<VocabWord["register"], string> = {
  neutral: "any situation",
  casual: "casual",
  polite: "polite",
  formal: "formal",
};

/** One row of the "Why these tones?" breakdown. */
function SyllableBreakdown({ syllable }: { syllable: Syllable }) {
  const initial = getCharacter(syllable.initialId);
  const parts: { label: string; glyph: string; badge?: string }[] = [];

  if (initial.kind === "consonant") {
    parts.push({
      label: classLabel[initial.class],
      glyph: initial.glyph,
      badge: classBadgeClasses[initial.class],
    });
  }
  for (const id of syllable.clusterIds ?? []) {
    const c = getCharacter(id);
    parts.push({ label: "cluster", glyph: c.glyph });
  }
  if (syllable.vowelId) {
    parts.push({ label: "vowel", glyph: getCharacter(syllable.vowelId).glyph });
  }
  if (syllable.finalId) {
    parts.push({ label: "final", glyph: getCharacter(syllable.finalId).glyph });
  }
  if (syllable.toneMarkId) {
    parts.push({
      label: getCharacter(syllable.toneMarkId).nameRtgs,
      glyph: getCharacter(syllable.toneMarkId).glyph,
    });
  }

  return (
    <div className="rounded-xl border bg-card p-3 text-left">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-thai text-2xl">{syllable.thai}</span>
        <Badge variant="outline" className={toneBadgeClasses[syllable.tone]}>
          <ToneContour tone={syllable.tone} className="mr-1 h-2.5 w-6" />
          {toneLabel[syllable.tone]}
        </Badge>
        {parts.map((p, i) => (
          <Badge
            key={i}
            variant="outline"
            className={cn("gap-1 font-normal", p.badge)}
          >
            <span className="font-thai text-base leading-none">{p.glyph}</span>
            <span className="text-[11px] uppercase tracking-wide">{p.label}</span>
          </Badge>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{syllable.toneReason}</p>
      {syllable.note && (
        <p className="mt-1 text-xs text-muted-foreground/80">{syllable.note}</p>
      )}
    </div>
  );
}

/** Unscored teaching card for a vocab word — the word-level IntroCard. */
export function WordIntroCard({
  word,
  onComplete,
}: {
  word: VocabWord;
  onComplete: OnExerciseComplete;
}) {
  const { play } = useAudio(word.audioKey, word.thai);
  const [playTrigger, setPlayTrigger] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const showRomanization = useUiSettings((s) => s.showRomanization);
  const toggleRomanization = useUiSettings((s) => s.toggleRomanization);

  const playWithContours = () => {
    play();
    setPlayTrigger((t) => t + 1);
  };

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        {word.syllables.length > 2 ? "New phrase" : "New word"}
      </p>

      <motion.button
        type="button"
        onClick={playWithContours}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="group relative rounded-3xl border-2 border-border bg-card px-10 py-7 shadow-sm transition-colors hover:border-primary/40"
        aria-label={`Play pronunciation of ${word.rtgs}`}
      >
        <ThaiWordText word={word} className="text-6xl leading-snug sm:text-7xl" />
        <Volume2 className="absolute right-3 top-3 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
      </motion.button>

      {/* Per-syllable tone contours, drawn along with the audio. */}
      <div className="flex items-end justify-center gap-4">
        {word.syllables.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <ToneContour tone={s.tone} playTrigger={playTrigger} className="h-5 w-11" />
            {showRomanization && (
              <span className="text-xs text-muted-foreground">{s.rtgs}</span>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-semibold">{word.meaning}</p>
        {showRomanization && (
          <p className="text-muted-foreground">{word.rtgs}</p>
        )}
        {word.literal && (
          <p className="text-sm text-muted-foreground">{word.literal}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant="secondary">{registerLabel[word.register]}</Badge>
        {word.particleGender && (
          <Badge variant="secondary">
            {word.particleGender === "male" ? "male speakers" : "female speakers"}
          </Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleRomanization}
          className={cn(
            "h-6 rounded-full border px-2 text-xs",
            showRomanization
              ? "border-primary/40 text-primary"
              : "border-border text-muted-foreground",
          )}
        >
          abc
        </Button>
      </div>

      {word.usageNote && (
        <p className="max-w-md text-sm text-muted-foreground">{word.usageNote}</p>
      )}

      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => setShowBreakdown((v) => !v)}
          className="mx-auto flex items-center gap-1 text-sm font-medium text-primary"
        >
          Why these tones?
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              showBreakdown && "rotate-180",
            )}
          />
        </button>
        <AnimatePresence initial={false}>
          {showBreakdown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-col gap-2">
                {word.syllables.map((s, i) => (
                  <SyllableBreakdown key={i} syllable={s} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        size="lg"
        className="mt-1 w-full max-w-xs"
        onClick={() => onComplete([])}
      >
        Got it
      </Button>
    </div>
  );
}
