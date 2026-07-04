import { z } from "zod";
import {
  characterSchema,
  lessonSchema,
  unitSchema,
  type Lesson,
  type ThaiCharacter,
  type Unit,
} from "./schema";
import { rawCharacters } from "./characters";
import { rawVowels } from "./vowels";
import { rawToneMarks } from "./tone-marks";
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

/** Thai Words course units (all placeholders until the course ships). */
export const wordsUnits: Unit[] = z
  .array(unitSchema)
  .parse(wordsUnitsJson)
  .sort((a, b) => a.order - b.order);

/** All lessons in path order: units by order, lessons by their unit listing. */
export const orderedLessons: Lesson[] = units.flatMap((u) =>
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

// ── Referential integrity checks (run once at load) ──────────────────
for (const lesson of lessons) {
  if (!unitById.has(lesson.unitId)) {
    throw new Error(`Lesson ${lesson.id} references unknown unit ${lesson.unitId}`);
  }
  const referenced = new Set<string>();
  for (const ex of lesson.exercises) {
    if ("characterId" in ex) referenced.add(ex.characterId);
    if ("characterIds" in ex) ex.characterIds.forEach((id) => referenced.add(id));
    if (ex.type === "rule_choice") {
      ex.attributeTo?.forEach((id) => referenced.add(id));
      if (ex.correctIndex >= ex.choices.length) {
        throw new Error(
          `Lesson ${lesson.id}: rule_choice "${ex.prompt}" correctIndex out of range`,
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
  }
  for (const id of [...lesson.teaches, ...lesson.reviews, ...referenced]) {
    getCharacter(id);
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
