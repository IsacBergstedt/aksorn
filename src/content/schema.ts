import { z } from "zod";

export const consonantClassSchema = z.enum(["mid", "high", "low"]);
export type ConsonantClass = z.infer<typeof consonantClassSchema>;

/**
 * A single Thai character (Phase 1: consonants only).
 * `id` is a stable snake_case slug from the acrophonic name — never rename
 * once shipped, SRS rows key on it.
 */
export const characterSchema = z.object({
  id: z.string().regex(/^[a-z][a-z_]*$/),
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
export type ThaiCharacter = z.infer<typeof characterSchema>;

const characterId = z.string().regex(/^[a-z][a-z_]*$/);

export const exerciseSchema = z.discriminatedUnion("type", [
  // Unscored teaching card shown before a character is first tested.
  z.object({ type: z.literal("intro"), characterId }),
  // Multiple choice: show glyph, pick the romanized sound.
  z.object({ type: z.literal("glyph_to_sound"), characterId }),
  // Reverse: show name + sound, pick the glyph.
  z.object({ type: z.literal("sound_to_glyph"), characterId }),
  // Match glyphs to their names.
  z.object({
    type: z.literal("match_pairs"),
    characterIds: z.array(characterId).min(3).max(6),
  }),
  // Assign each character to one of two consonant classes.
  z.object({
    type: z.literal("class_sort"),
    characterIds: z.array(characterId).min(4).max(8),
    classes: z.tuple([consonantClassSchema, consonantClassSchema]),
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
  exercises: z.array(exerciseSchema).min(8).max(12),
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
