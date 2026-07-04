import { z } from "zod";

export const consonantClassSchema = z.enum(["mid", "high", "low"]);
export type ConsonantClass = z.infer<typeof consonantClassSchema>;

/**
 * Character IDs are stable snake_case slugs — never rename once shipped,
 * SRS rows key on them.
 */
const characterId = z.string().regex(/^[a-z][a-z_]*$/);

/**
 * Storage path fragment for a pre-generated TTS clip, e.g. `syllables/kaa`
 * or `consonants/ko_kai` — resolved to an mp3 URL by src/lib/audio.ts and
 * synthesized/uploaded by scripts/generate-audio.ts.
 */
const audioKeySchema = z.string().regex(/^[a-z-]+\/[a-z0-9_]+$/);

/** A Thai consonant. `kind` is stamped on at load in src/content/index.ts. */
export const consonantSchema = z.object({
  kind: z.literal("consonant"),
  id: characterId,
  glyph: z.string().min(1),
  nameThai: z.string().min(1),
  nameRtgs: z.string().min(1),
  meaning: z.string().min(1),
  class: consonantClassSchema,
  initialSound: z.string().min(1),
  finalSound: z.string().nullable(),
  audioKey: z.string().min(1),
  /** Shown on the intro card under the meaning, for pedagogical footnotes. */
  note: z.string().optional(),
  /** ฃ and ฅ — kept for completeness, excluded from lessons and distractors. */
  obsolete: z.boolean().optional(),
});
export type ThaiConsonant = z.infer<typeof consonantSchema>;

/**
 * A Thai vowel. Glyphs use ◌ (U+25CC) as the consonant placeholder so the
 * written position is visible (e.g. เ◌ีย). `sound` is RTGS, which does not
 * mark length — `length` disambiguates (surfaced as "a (short)" in answers).
 */
export const vowelSchema = z.object({
  kind: z.literal("vowel"),
  id: characterId,
  glyph: z.string().min(1),
  nameThai: z.string().min(1),
  nameRtgs: z.string().min(1),
  sound: z.string().min(1),
  length: z.enum(["short", "long"]),
  /** Where the vowel is written relative to its consonant. */
  position: z.enum(["after", "before", "above", "below", "around"]),
  audioKey: z.string().min(1),
  note: z.string().optional(),
});
export type ThaiVowel = z.infer<typeof vowelSchema>;

/**
 * A tone mark. Quizzed by name, never by a fixed sound — the tone a mark
 * produces depends on the consonant class it sits on.
 */
export const toneMarkSchema = z.object({
  kind: z.literal("tone_mark"),
  id: characterId,
  glyph: z.string().min(1),
  nameThai: z.string().min(1),
  nameRtgs: z.string().min(1),
  audioKey: z.string().min(1),
  note: z.string().optional(),
});
export type ThaiToneMark = z.infer<typeof toneMarkSchema>;

export const characterSchema = z.discriminatedUnion("kind", [
  consonantSchema,
  vowelSchema,
  toneMarkSchema,
]);
export type ThaiCharacter = z.infer<typeof characterSchema>;

export const exerciseSchema = z.discriminatedUnion("type", [
  // Unscored teaching card shown before a character is first tested.
  z.object({ type: z.literal("intro"), characterId }),
  // Multiple choice: show glyph, pick the romanized sound (or mark name).
  z.object({ type: z.literal("glyph_to_sound"), characterId }),
  // Reverse: show name + sound, pick the glyph.
  z.object({ type: z.literal("sound_to_glyph"), characterId }),
  // Audio-only prompt: play the character's sound, pick the glyph.
  z.object({ type: z.literal("listening"), characterId }),
  // Match glyphs to their names.
  z.object({
    type: z.literal("match_pairs"),
    characterIds: z.array(characterId).min(3).max(6),
  }),
  // Assign each character to one of two consonant classes (consonants only,
  // enforced at load in src/content/index.ts).
  z.object({
    type: z.literal("class_sort"),
    characterIds: z.array(characterId).min(4).max(8),
    classes: z.tuple([consonantClassSchema, consonantClassSchema]),
  }),
  // Unscored concept screen: teaches a rule exercises alone can't convey
  // (consonant classes, syllable liveness, tone logic).
  z.object({
    type: z.literal("concept"),
    title: z.string().min(1),
    body: z.array(z.string().min(1)).min(1).max(4),
    thaiExample: z.string().optional(),
    /** TTS clip for thaiExample (skip when the example isn't pronounceable). */
    exampleAudioKey: audioKeySchema.optional(),
  }),
  // Static multiple choice over a Thai syllable/word: live-or-dead calls,
  // tone identification. `correctIndex` bounds-checked at load.
  z.object({
    type: z.literal("rule_choice"),
    prompt: z.string().min(1),
    /**
     * TTS clip of the prompt syllable (`syllables/{rtgs}`). Required — the
     * tone drills are the audio that matters most. Prompts that repeat
     * across lessons share a key; generate-audio.ts errors if one key maps
     * to two different prompt texts.
     */
    audioKey: audioKeySchema,
    promptNote: z.string().optional(),
    question: z.string().min(1),
    choices: z.array(z.string().min(1)).min(2).max(5),
    correctIndex: z.number().int().nonnegative(),
    explanation: z.string().min(1),
    /** Characters whose SRS cards this answer should count toward. */
    attributeTo: z.array(characterId).optional(),
  }),
]);
export type Exercise = z.infer<typeof exerciseSchema>;

export const lessonSchema = z.object({
  id: z.string(),
  unitId: z.string(),
  order: z.number().int().positive(),
  title: z.string(),
  xpReward: z.number().int().positive(),
  /** Characters introduced in this lesson (get new SRS cards). */
  teaches: z.array(characterId),
  /** Previously taught characters this lesson reinforces. */
  reviews: z.array(characterId),
  /**
   * Human-verifiable citation of what the lesson teaches — the consonant
   * class and/or tone rule covered, for content review.
   */
  pedagogy: z.string().min(1),
  exercises: z.array(exerciseSchema).min(8).max(16),
});
export type Lesson = z.infer<typeof lessonSchema>;

export const unitSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  order: z.number().int().positive(),
  lessonIds: z.array(z.string()),
  comingSoon: z.boolean().optional(),
});
export type Unit = z.infer<typeof unitSchema>;
