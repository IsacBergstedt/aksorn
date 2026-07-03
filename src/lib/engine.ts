import { characters, getCharacter } from "@/content";
import type {
  ConsonantClass,
  Lesson,
  ThaiCharacter,
  ThaiConsonant,
} from "@/content/schema";

/**
 * Runtime exercise shapes consumed by the exercise components.
 * Lesson JSON stays compact; distractors are generated here from the
 * character pool (lesson characters first, then same class/kind, then
 * anywhere). Randomness means this must run client-side (after mount) to
 * avoid hydration mismatches.
 */
export type RuntimeExercise =
  | { kind: "intro"; character: ThaiCharacter }
  | {
      kind: "concept";
      title: string;
      body: string[];
      thaiExample?: string;
    }
  | {
      kind: "choice";
      direction: "glyph_to_sound" | "sound_to_glyph";
      target: ThaiCharacter;
      options: ThaiCharacter[]; // includes the target, shuffled
    }
  | { kind: "match_pairs"; characters: ThaiCharacter[] }
  | {
      kind: "class_sort";
      characters: ThaiConsonant[];
      classes: [ConsonantClass, ConsonantClass];
    }
  | {
      kind: "rule_choice";
      prompt: string;
      promptNote?: string;
      question: string;
      choices: string[];
      correctIndex: number;
      explanation: string;
      attributeTo?: string[];
    };

/**
 * What a choice answer displays for a character. Consonants answer with
 * their sound; vowels with sound + length (RTGS collapses length, so the
 * label disambiguates); tone marks with their name (their tone effect
 * depends on consonant class, so they have no fixed sound).
 */
export function answerLabel(c: ThaiCharacter): string {
  switch (c.kind) {
    case "consonant":
      return c.initialSound;
    case "vowel":
      return `${c.sound}, ${c.length}`;
    case "tone_mark":
      return c.nameRtgs;
  }
}

function isObsolete(c: ThaiCharacter): boolean {
  return c.kind === "consonant" && c.obsolete === true;
}

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
  // Preference tiers: lesson characters of the same kind → same class (or
  // same kind for vowels/tone marks) → same kind anywhere → anything.
  const sameKind = (c: ThaiCharacter) => c.kind === target.kind;
  const tiers = [
    lessonPool.filter(sameKind),
    target.kind === "consonant"
      ? characters.filter(
          (c) => c.kind === "consonant" && c.class === target.class,
        )
      : characters.filter(sameKind),
    characters.filter(sameKind),
    characters,
  ];

  const picked: ThaiCharacter[] = [];
  const usedIds = new Set([target.id]);
  const usedLabels = new Set([answerLabel(target)]);

  for (const tier of tiers) {
    for (const c of shuffle(tier)) {
      if (picked.length >= OPTION_COUNT - 1) break;
      if (usedIds.has(c.id) || isObsolete(c)) continue;
      // Answers are labels, so every option needs a distinct label.
      if (direction === "glyph_to_sound" && usedLabels.has(answerLabel(c)))
        continue;
      picked.push(c);
      usedIds.add(c.id);
      usedLabels.add(answerLabel(c));
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
      case "concept":
        return {
          kind: "concept",
          title: ex.title,
          body: ex.body,
          thaiExample: ex.thaiExample,
        };
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
          // Consonant-only is enforced at content load in src/content/index.ts.
          characters: shuffle(
            ex.characterIds.map((id) => {
              const c = getCharacter(id);
              if (c.kind !== "consonant") {
                throw new Error(`class_sort got non-consonant ${id}`);
              }
              return c;
            }),
          ),
          classes: ex.classes,
        };
      case "rule_choice":
        return {
          kind: "rule_choice",
          prompt: ex.prompt,
          promptNote: ex.promptNote,
          question: ex.question,
          choices: ex.choices,
          correctIndex: ex.correctIndex,
          explanation: ex.explanation,
          attributeTo: ex.attributeTo,
        };
    }
  });
}

const REVIEW_MAX_CHARACTERS = 6;

/** A review session is a dynamically generated lesson over due SRS cards. */
export function buildReviewExercises(characterIds: string[]): RuntimeExercise[] {
  const chars = characterIds.slice(0, REVIEW_MAX_CHARACTERS).map(getCharacter);
  const pool = chars.length > 1 ? chars : characters.filter((c) => !isObsolete(c));

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
