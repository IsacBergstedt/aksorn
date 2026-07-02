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
import unitsJson from "./units.json";
import mid01 from "./lessons/mid-01.json";
import mid02 from "./lessons/mid-02.json";
import mid03 from "./lessons/mid-03.json";
import mid04 from "./lessons/mid-04.json";

// Parsing happens at module load, so invalid content fails the build the
// first time any page imports from src/content.

export const characters: ThaiCharacter[] = z
  .array(characterSchema)
  .parse(rawCharacters);

export const characterById: ReadonlyMap<string, ThaiCharacter> = new Map(
  characters.map((c) => [c.id, c]),
);

export const lessons: Lesson[] = z
  .array(lessonSchema)
  .parse([mid01, mid02, mid03, mid04]);

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
  }
  for (const id of [...lesson.teaches, ...lesson.reviews, ...referenced]) {
    getCharacter(id);
  }
  for (const id of lesson.teaches) {
    if (!referenced.has(id)) {
      throw new Error(`Lesson ${lesson.id} teaches ${id} but never exercises it`);
    }
  }
  if (lesson.teaches.some((id) => characterById.get(id)?.obsolete)) {
    throw new Error(`Lesson ${lesson.id} teaches an obsolete character`);
  }
}
