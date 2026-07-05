"use client";

import type { VocabWord } from "@/content/schema";
import { toneTextClasses } from "@/lib/tone-colors";
import { cn } from "@/lib/utils";

/**
 * A vocab word rendered syllable by syllable, each colored by its tone —
 * the app-wide tone color code (src/lib/tone-colors.ts). Set
 * `colored={false}` where colors would leak an answer (e.g. tone_pair
 * options before answering).
 */
export function ThaiWordText({
  word,
  colored = true,
  className,
}: {
  word: VocabWord;
  colored?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("font-thai", className)}>
      {word.syllables.map((s, i) => (
        <span key={i} className={colored ? toneTextClasses[s.tone] : undefined}>
          {s.thai}
        </span>
      ))}
    </span>
  );
}
