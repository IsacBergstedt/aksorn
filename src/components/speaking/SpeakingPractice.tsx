"use client";

import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { characters, vocabWords } from "@/content";
import type { ThaiCharacter, VocabWord } from "@/content/schema";
import { playAudioKey } from "@/lib/audio";
import { trackPitch, type PitchPoint } from "@/lib/pitch";
import { assessPronunciation, type AssessmentResult } from "@/lib/speech-assess";
import { classBadgeClasses, classLabel, kindBadgeClasses } from "@/lib/class-colors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThaiWordText } from "@/components/ThaiWordText";
import { cn } from "@/lib/utils";
import { Recorder } from "./Recorder";
import {
  PronunciationPanel,
  type AssessStatus,
} from "./PronunciationPanel";

/**
 * Letters: consonants (already in class order) then vowels; tone marks
 * have no fixed sound to imitate, and the obsolete letters aren't worth
 * drilling.
 */
const letterList: ThaiCharacter[] = characters.filter(
  (c) => c.kind !== "tone_mark" && !(c.kind === "consonant" && c.obsolete),
);
/** Words: everything from the Phrases course, in course order. */
const wordList: VocabWord[] = vocabWords;

type Target = ThaiCharacter | VocabWord;

function referenceText(target: Target): string {
  // Characters are assessed on their full Thai name (e.g. ก ไก่) — a lone
  // consonant sound isn't a scorable utterance.
  return target.kind === "word" ? target.thai : target.nameThai;
}

/**
 * Hear the target, record yourself, compare by ear — now with scores:
 * the recording is assessed in-browser against Azure (segment accuracy;
 * see src/lib/speech-assess.ts) and pitch-traced locally for tone shape
 * (see src/lib/pitch.ts). Tones deliberately stay unscored.
 */
export function SpeakingPractice() {
  const [mode, setMode] = useState<"letters" | "words">("letters");
  const [letterIndex, setLetterIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  const [status, setStatus] = useState<AssessStatus>("idle");
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [pitch, setPitch] = useState<PitchPoint[] | null>(null);

  const list: Target[] = mode === "letters" ? letterList : wordList;
  const index = mode === "letters" ? letterIndex : wordIndex;
  const target = list[index];

  const resetAssessment = () => {
    setStatus("idle");
    setError(undefined);
    setResult(null);
    setPitch(null);
  };

  const playTarget = () =>
    playAudioKey(
      target.audioKey,
      target.kind === "word" ? target.thai : target.nameThai,
    );

  const step = (delta: number) => {
    const next = (index + delta + list.length) % list.length;
    if (mode === "letters") setLetterIndex(next);
    else setWordIndex(next);
    resetAssessment();
  };

  const switchMode = (next: "letters" | "words") => {
    if (next === mode) return;
    setMode(next);
    resetAssessment();
  };

  const handleRecorded = useCallback(
    async (blob: Blob) => {
      setStatus("assessing");
      setResult(null);
      setError(undefined);
      try {
        const ctx = new AudioContext();
        const buffer = await ctx.decodeAudioData(await blob.arrayBuffer());
        void ctx.close();
        // The pitch trace is local and instant — show it even if Azure
        // scoring fails afterwards.
        setPitch(trackPitch(buffer));
        setResult(await assessPronunciation(buffer, referenceText(target)));
        setStatus("scored");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Scoring failed.");
        setStatus("error");
      }
    },
    [target],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto flex rounded-full border-2 border-border bg-secondary p-1">
        {(["letters", "words"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={cn(
              "rounded-full px-5 py-1.5 text-sm font-semibold capitalize transition-colors",
              mode === m
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => step(-1)} aria-label="Previous">
          <ChevronLeft className="mr-1 h-4 w-4" /> Prev
        </Button>
        <p className="text-sm text-muted-foreground">
          {index + 1} of {list.length}
        </p>
        <Button variant="ghost" size="sm" onClick={() => step(1)} aria-label="Next">
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-5 p-8">
          {target.kind === "word" ? (
          <Badge variant="outline">
            {target.register === "neutral" ? "word" : target.register}
          </Badge>
          ) : (
            <Badge
              variant="outline"
              className={
                target.kind === "consonant"
                  ? classBadgeClasses[target.class]
                  : kindBadgeClasses.vowel
              }
            >
              {target.kind === "consonant" ? classLabel[target.class] : "Vowel"}
            </Badge>
          )}

          <button
            type="button"
            onClick={playTarget}
            className="group relative rounded-3xl border-2 border-border bg-card px-14 py-8 shadow-sm transition-colors hover:border-primary/40"
            aria-label="Play the target pronunciation"
          >
            {target.kind === "word" ? (
              <ThaiWordText word={target} className="text-6xl leading-tight" />
            ) : (
              <span className="font-thai text-8xl leading-none">
                {target.glyph}
              </span>
            )}
            <Volume2 className="absolute right-3 top-3 h-5 w-5 text-muted-foreground group-hover:text-primary" />
          </button>

          <div className="text-center">
            {target.kind === "word" ? (
              <>
                <p className="text-xl font-bold">{target.meaning}</p>
                <p className="text-lg text-muted-foreground">{target.rtgs}</p>
              </>
            ) : (
              <>
                <p className="text-xl font-bold">{target.nameRtgs}</p>
                <p className="font-thai text-lg text-muted-foreground">
                  {target.nameThai}
                </p>
              </>
            )}
          </div>

          <Button variant="outline" onClick={playTarget}>
            <Volume2 className="mr-2 h-4 w-4" /> Play target
          </Button>

          {/* key resets the recording + panel when the target changes */}
          <Recorder
            key={`${mode}-${target.id}`}
            onPlayTarget={playTarget}
            onRecorded={handleRecorded}
          />

          <PronunciationPanel
            status={status}
            error={error}
            result={result}
            pitch={pitch}
            expectedTones={
              target.kind === "word"
                ? target.syllables.map((s) => s.tone)
                : undefined
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
