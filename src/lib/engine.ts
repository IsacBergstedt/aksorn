import { characters, getCharacter } from "@/content";
import type { ConsonantClass, Lesson, ThaiCharacter } from "@/content/schema";

/**
 * Runtime exercise shapes consumed by the exercise components.
 * Lesson JSON stays compact; distractors are generated here from the
 * character pool (lesson characters first, then same class, then anywhere).
 * Randomness means this must run client-side (after mount) to avoid
 * hydration mismatches.
 */
export type RuntimeExercise =
  | { kind: "intro"; character: ThaiCharacter }
  | {
      kind: "choice";
      direction: "glyph_to_sound" | "sound_to_glyph";
      target: ThaiCharacter;
      options: ThaiCharacter[]; // includes the target, shuffled
    }
  | { kind: "match_pairs"; characters: ThaiCharacter[] }
  | {
      kind: "class_sort";
      characters: ThaiCharacter[];
      classes: [ConsonantClass, ConsonantClass];
    };

function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const OPTION_COUNT = 4;

function pickDistractors(
  target: ThaiCharacter,
  lessonPool: ThaiCharacter[],
  direction: "glyph_to_sound" | "sound_to_glyph",
): ThaiCharacter[] {
  // Preference tiers: lesson characters → same class → everything else.
  const tiers = [
    lessonPool,
    characters.filter((c) => c.class === target.class),
    characters,
  ];

  const picked: ThaiCharacter[] = [];
  const usedIds = new Set([target.id]);
  const usedSounds = new Set([target.initialSound]);

  for (const tier of tiers) {
    for (const c of shuffle(tier)) {
      if (picked.length >= OPTION_COUNT - 1) break;
      if (usedIds.has(c.id) || c.obsolete) continue;
      // Answers are sounds, so every option needs a distinct sound.
      if (direction === "glyph_to_sound" && usedSounds.has(c.initialSound)) continue;
      picked.push(c);
      usedIds.add(c.id);
      usedSounds.add(c.initialSound);
    }
  }
  return picked;
}

function buildChoice(
  direction: "glyph_to_sound" | "sound_to_glyph",
  characterId: string,
  lessonPool: ThaiCharacter[],
): RuntimeExercise {
  const target = getCharacter(characterId);
  const distractors = pickDistractors(target, lessonPool, direction);
  return {
    kind: "choice",
    direction,
    target,
    options: shuffle([target, ...distractors]),
  };
}

export function buildLessonExercises(lesson: Lesson): RuntimeExercise[] {
  const lessonPool = [...lesson.teaches, ...lesson.reviews].map(getCharacter);

  return lesson.exercises.map((ex): RuntimeExercise => {
    switch (ex.type) {
      case "intro":
        return { kind: "intro", character: getCharacter(ex.characterId) };
      case "glyph_to_sound":
      case "sound_to_glyph":
        return buildChoice(ex.type, ex.characterId, lessonPool);
      case "match_pairs":
        return {
          kind: "match_pairs",
          characters: ex.characterIds.map(getCharacter),
        };
      case "class_sort":
        return {
          kind: "class_sort",
          characters: shuffle(ex.characterIds.map(getCharacter)),
          classes: ex.classes,
        };
    }
  });
}

const REVIEW_MAX_CHARACTERS = 6;

/** A review session is a dynamically generated lesson over due SRS cards. */
export function buildReviewExercises(characterIds: string[]): RuntimeExercise[] {
  const chars = characterIds.slice(0, REVIEW_MAX_CHARACTERS).map(getCharacter);
  const pool = chars.length > 1 ? chars : characters.filter((c) => !c.obsolete);

  const exercises: RuntimeExercise[] = [
    ...chars.map((c) => buildChoice("glyph_to_sound", c.id, pool)),
    ...shuffle(chars).map((c) => buildChoice("sound_to_glyph", c.id, pool)),
  ];
  if (chars.length >= 4) {
    exercises.push({ kind: "match_pairs", characters: chars.slice(0, 4) });
  }
  return exercises;
}

export function reviewXp(characterCount: number): number {
  return Math.min(5 + 2 * characterCount, 20);
}
