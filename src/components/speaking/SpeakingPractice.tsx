"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { characters } from "@/content";
import { playAudioKey } from "@/lib/audio";
import { classBadgeClasses, classLabel, kindBadgeClasses } from "@/lib/class-colors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Recorder } from "./Recorder";

/**
 * Hear the target, record yourself, compare by ear. Consonants (already in
 * class order) then vowels; tone marks have no fixed sound to imitate, and
 * the obsolete letters aren't worth drilling.
 */
const practiceList = characters.filter(
  (c) => c.kind !== "tone_mark" && !(c.kind === "consonant" && c.obsolete),
);

export function SpeakingPractice() {
  const [index, setIndex] = useState(0);
  const character = practiceList[index];

  const playTarget = () => playAudioKey(character.audioKey, character.nameThai);

  const step = (delta: number) =>
    setIndex((i) => (i + delta + practiceList.length) % practiceList.length);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => step(-1)} aria-label="Previous character">
          <ChevronLeft className="mr-1 h-4 w-4" /> Prev
        </Button>
        <p className="text-sm text-muted-foreground">
          {index + 1} of {practiceList.length}
        </p>
        <Button variant="ghost" size="sm" onClick={() => step(1)} aria-label="Next character">
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-5 p-8">
          <Badge
            variant="outline"
            className={
              character.kind === "consonant"
                ? classBadgeClasses[character.class]
                : kindBadgeClasses.vowel
            }
          >
            {character.kind === "consonant" ? classLabel[character.class] : "Vowel"}
          </Badge>

          <button
            type="button"
            onClick={playTarget}
            className="group relative rounded-3xl border-2 border-border bg-card px-14 py-8 shadow-sm transition-colors hover:border-primary/40"
            aria-label="Play the target pronunciation"
          >
            <span className="font-thai text-8xl leading-none">{character.glyph}</span>
            <Volume2 className="absolute right-3 top-3 h-5 w-5 text-muted-foreground group-hover:text-primary" />
          </button>

          <div className="text-center">
            <p className="text-xl font-bold">{character.nameRtgs}</p>
            <p className="font-thai text-lg text-muted-foreground">
              {character.nameThai}
            </p>
          </div>

          <Button variant="outline" onClick={playTarget}>
            <Volume2 className="mr-2 h-4 w-4" /> Play target
          </Button>

          {/* key resets the recording when the character changes */}
          <Recorder key={character.id} onPlayTarget={playTarget} />
        </CardContent>
      </Card>
    </div>
  );
}
