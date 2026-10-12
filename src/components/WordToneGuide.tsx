import type { VocabWord } from "@/content/schema";
import { ToneContour } from "@/components/ToneContour";
import { toneLabel, toneTextClasses } from "@/lib/tone-colors";
import { cn } from "@/lib/utils";

/** Spoken tones in syllable order, without spelling-rule terminology. */
export function WordToneGuide({
  word,
  playTrigger = 0,
}: {
  word: VocabWord;
  playTrigger?: number;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        {word.syllables.length === 1 ? "Spoken tone" : "Spoken tones, syllable by syllable"}
      </p>
      <ol className="flex flex-wrap justify-center gap-3" aria-label="Syllable tones">
        {word.syllables.map((syllable, index) => (
          <li key={index} className="flex flex-col items-center gap-1">
            <span lang="th" className={cn("font-thai text-lg", toneTextClasses[syllable.tone])}>
              {syllable.thai}
            </span>
            <ToneContour
              tone={syllable.tone}
              playTrigger={playTrigger}
              delay={index * 0.4}
              className="h-4 w-9"
            />
            <span className={cn("text-xs", toneTextClasses[syllable.tone])}>
              {toneLabel[syllable.tone]}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
