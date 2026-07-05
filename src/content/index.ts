import { z } from "zod";
import {
  characterSchema,
  lessonSchema,
  tonePairSetSchema,
  unitSchema,
  vocabWordSchema,
  type Lesson,
  type ThaiCharacter,
  type TonePairSet,
  type Unit,
  type VocabWord,
} from "./schema";
import { rawCharacters } from "./characters";
import { rawVowels } from "./vowels";
import { rawToneMarks } from "./tone-marks";
import { rawGreetingsWords } from "./vocab/greetings";
import { rawTonePairSets } from "./tone-pairs";
import unitsJson from "./units.json";
import wordsUnitsJson from "./words-units.json";
import mid01 from "./lessons/mid-01.json";
import mid02 from "./lessons/mid-02.json";
import mid03 from "./lessons/mid-03.json";
import mid04 from "./lessons/mid-04.json";
import high01 from "./lessons/high-01.json";
import high02 from "./lessons/high-02.json";
import high03 from "./lessons/high-03.json";
import low01 from "./lessons/low-01.json";
import low02 from "./lessons/low-02.json";
import low03 from "./lessons/low-03.json";
import low04 from "./lessons/low-04.json";
import low05 from "./lessons/low-05.json";
import vowel01 from "./lessons/vowel-01.json";
import vowel02 from "./lessons/vowel-02.json";
import vowel03 from "./lessons/vowel-03.json";
import vowel04 from "./lessons/vowel-04.json";
import tone01 from "./lessons/tone-01.json";
import tone02 from "./lessons/tone-02.json";
import tone03 from "./lessons/tone-03.json";
import tone04 from "./lessons/tone-04.json";
import mix01 from "./lessons/mix-01.json";
import mix02 from "./lessons/mix-02.json";
import greet01 from "./lessons/greet-01.json";
import greet02 from "./lessons/greet-02.json";
import greet03 from "./lessons/greet-03.json";
import greet04 from "./lessons/greet-04.json";

// Parsing happens at module load, so invalid content fails the build the
// first time any page imports from src/content.

export const characters: ThaiCharacter[] = z.array(characterSchema).parse([
  ...rawCharacters.map((c) => ({ kind: "consonant" as const, ...c })),
  ...rawVowels,
  ...rawToneMarks,
]);

export const characterById: ReadonlyMap<string, ThaiCharacter> = new Map(
  characters.map((c) => [c.id, c]),
);

/** Vocab for the Thai Words course (one file per unit under vocab/). */
export const vocabWords: VocabWord[] = z
  .array(vocabWordSchema)
  .parse([...rawGreetingsWords]);

export const wordById: ReadonlyMap<string, VocabWord> = new Map(
  vocabWords.map((w) => [w.id, w]),
);

/** Minimal-pair sets for tone_pair drills and weakness-targeted reviews. */
export const tonePairSets: TonePairSet[] = z
  .array(tonePairSetSchema)
  .parse(rawTonePairSets);

export const tonePairSetById: ReadonlyMap<string, TonePairSet> = new Map(
  tonePairSets.map((s) => [s.id, s]),
);

export const lessons: Lesson[] = z.array(lessonSchema).parse([
  mid01,
  mid02,
  mid03,
  mid04,
  high01,
  high02,
  high03,
  low01,
  low02,
  low03,
  low04,
  low05,
  vowel01,
  vowel02,
  vowel03,
  vowel04,
  tone01,
  tone02,
  tone03,
  tone04,
  mix01,
  mix02,
  greet01,
  greet02,
  greet03,
  greet04,
]);

export const lessonById: ReadonlyMap<string, Lesson> = new Map(
  lessons.map((l) => [l.id, l]),
);

export const units: Unit[] = z
  .array(unitSchema)
  .parse(unitsJson)
  .sort((a, b) => a.order - b.order);

export const unitById: ReadonlyMap<string, Unit> = new Map(
  units.map((u) => [u.id, u]),
);

/** Thai Words course units (unit 1 live, the rest Coming-soon stubs). */
export const wordsUnits: Unit[] = z
  .array(unitSchema)
  .parse(wordsUnitsJson)
  .sort((a, b) => a.order - b.order);

export const wordsUnitById: ReadonlyMap<string, Unit> = new Map(
  wordsUnits.map((u) => [u.id, u]),
);

/** All lessons in path order: units by order, lessons by their unit listing. */
export const orderedLessons: Lesson[] = units.flatMap((u) =>
  u.lessonIds.map((id) => {
    const lesson = lessonById.get(id);
    if (!lesson) throw new Error(`Unit ${u.id} references unknown lesson ${id}`);
    return lesson;
  }),
);

/** Thai Words lessons in path order (drives the /words path + unlocking). */
export const wordsOrderedLessons: Lesson[] = wordsUnits.flatMap((u) =>
  u.lessonIds.map((id) => {
    const lesson = lessonById.get(id);
    if (!lesson) throw new Error(`Unit ${u.id} references unknown lesson ${id}`);
    return lesson;
  }),
);

export function getCharacter(id: string): ThaiCharacter {
  const c = characterById.get(id);
  if (!c) throw new Error(`Unknown character id: ${id}`);
  return c;
}

export function getWord(id: string): VocabWord {
  const w = wordById.get(id);
  if (!w) throw new Error(`Unknown word id: ${id}`);
  return w;
}

/**
 * Characters and vocab words share one id namespace (SRS cards key on it);
 * lesson teaches/reviews and match_pairs may mix both kinds.
 */
export function getItem(id: string): ThaiCharacter | VocabWord {
  return characterById.get(id) ?? getWord(id);
}

// ── Referential integrity checks (run once at load) ──────────────────

// Words and characters share the SRS id namespace — collisions would
// silently merge two items' learning history.
for (const w of vocabWords) {
  if (characterById.has(w.id)) {
    throw new Error(`Word id ${w.id} collides with a character id`);
  }
  // Syllable segments must reassemble the written word exactly — the UI
  // colors tones by rendering the segments in sequence.
  const joined = w.syllables.map((s) => s.thai).join("");
  if (joined !== w.thai) {
    throw new Error(
      `Word ${w.id}: syllable segments "${joined}" do not reassemble "${w.thai}"`,
    );
  }
  for (const s of w.syllables) {
    for (const id of [s.initialId, ...(s.clusterIds ?? [])]) {
      if (getCharacter(id).kind !== "consonant") {
        throw new Error(`Word ${w.id}: ${id} is not a consonant`);
      }
    }
    if (s.finalId && getCharacter(s.finalId).kind !== "consonant") {
      throw new Error(`Word ${w.id}: final ${s.finalId} is not a consonant`);
    }
    if (s.vowelId && getCharacter(s.vowelId).kind !== "vowel") {
      throw new Error(`Word ${w.id}: ${s.vowelId} is not a vowel`);
    }
    if (s.toneMarkId && getCharacter(s.toneMarkId).kind !== "tone_mark") {
      throw new Error(`Word ${w.id}: ${s.toneMarkId} is not a tone mark`);
    }
  }
}

const allUnitIds = new Set([...unitById.keys(), ...wordsUnitById.keys()]);

for (const lesson of lessons) {
  if (!allUnitIds.has(lesson.unitId)) {
    throw new Error(`Lesson ${lesson.id} references unknown unit ${lesson.unitId}`);
  }
  const referenced = new Set<string>();
  for (const ex of lesson.exercises) {
    if ("characterId" in ex) referenced.add(ex.characterId);
    if ("wordId" in ex) referenced.add(ex.wordId);
    if ("characterIds" in ex) ex.characterIds.forEach((id) => referenced.add(id));
    if (ex.type === "rule_choice" || ex.type === "register_choice") {
      ex.attributeTo?.forEach((id) => referenced.add(id));
      if (ex.correctIndex >= ex.choices.length) {
        throw new Error(
          `Lesson ${lesson.id}: ${ex.type} correctIndex out of range`,
        );
      }
    }
    if (ex.type === "concept" && ex.exampleAudioKey && !ex.thaiExample) {
      throw new Error(
        `Lesson ${lesson.id}: concept "${ex.title}" has exampleAudioKey but no thaiExample`,
      );
    }
    if (ex.type === "class_sort") {
      for (const id of ex.characterIds) {
        if (getCharacter(id).kind !== "consonant") {
          throw new Error(
            `Lesson ${lesson.id}: class_sort includes non-consonant ${id}`,
          );
        }
      }
    }
    if (
      (ex.type === "word_intro" ||
        ex.type === "word_choice" ||
        ex.type === "word_listening") &&
      !wordById.has(ex.wordId)
    ) {
      throw new Error(`Lesson ${lesson.id}: ${ex.type} references unknown word ${ex.wordId}`);
    }
    if (ex.type === "tone_pair" && !tonePairSetById.has(ex.setId)) {
      throw new Error(
        `Lesson ${lesson.id}: tone_pair references unknown set ${ex.setId}`,
      );
    }
  }
  for (const id of [...lesson.teaches, ...lesson.reviews, ...referenced]) {
    getItem(id);
  }
  for (const id of lesson.teaches) {
    if (!referenced.has(id)) {
      throw new Error(`Lesson ${lesson.id} teaches ${id} but never exercises it`);
    }
  }
  if (
    lesson.teaches.some((id) => {
      const c = characterById.get(id);
      return c?.kind === "consonant" && c.obsolete;
    })
  ) {
    throw new Error(`Lesson ${lesson.id} teaches an obsolete character`);
  }
}
