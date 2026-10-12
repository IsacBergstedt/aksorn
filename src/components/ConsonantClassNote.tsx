import type { ThaiCharacter } from "@/content/schema";

/** Optional reference, never a task or an answer to memorize here. */
export function ConsonantClassNote({ character }: { character: ThaiCharacter }) {
  if (character.kind !== "consonant") return null;
  return (
    <details className="max-w-md text-center text-xs text-muted-foreground">
      <summary className="cursor-pointer rounded px-2 py-1 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary">
        Optional: how this letter affects tone
      </summary>
      <p className="mt-2 leading-relaxed">
        <span lang="th" className="font-thai">{character.glyph}</span> belongs to the {character.class} consonant class.
        {" "}This is a spelling group, not a fixed spoken tone. A syllable&apos;s
        tone also depends on its vowel, ending, and any tone mark. You can
        learn the letter&apos;s sound first and explore these rules later.
      </p>
    </details>
  );
}
