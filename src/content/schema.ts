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

/** The five Thai tones. Color-coded app-wide — see src/lib/tone-colors.ts. */
export const toneSchema = z.enum(["mid", "low", "falling", "high", "rising"]);
export type Tone = z.infer<typeof toneSchema>;

/**
 * One spoken syllable of a vocab word, with the spelling breakdown that
 * derives its tone. `thai` is the written segment — the segments of a word
 * must concatenate to exactly the word's `thai` (checked at load), so the
 * UI can color syllables by slicing the rendered string.
 */
export const syllableSchema = z.object({
  thai: z.string().min(1),
  rtgs: z.string().min(1),
  tone: toneSchema,
  /**
   * The consonant whose class drives the tone — for ห-nam and leading
   * clusters this is the (possibly silent) leader, not the sounded letter.
   */
  initialId: characterId,
  /** Remaining consonants of an initial cluster (e.g. ร of คร). */
  clusterIds: z.array(characterId).optional(),
  /** Absent for unwritten inherent vowels and ◌ั (not in the vowel set). */
  vowelId: characterId.optional(),
  finalId: characterId.optional(),
  toneMarkId: characterId.optional(),
  /**
   * Human-verifiable tone derivation citing the CLAUDE.md tone table,
   * e.g. "low class + mai tho → high". Shown in the breakdown view.
   */
  toneReason: z.string().min(1),
  /** Spelling quirks the ids can't express (◌ั, ห-nam, mai taikhu…). */
  note: z.string().optional(),
});
export type Syllable = z.infer<typeof syllableSchema>;

/**
 * A vocab word or phrase for the Thai Phrases course. Ids share the SRS
 * namespace with character ids (collisions rejected at load) and are just
 * as immutable once shipped.
 */
export const vocabWordSchema = z.object({
  kind: z.literal("word"),
  id: characterId,
  thai: z.string().min(1),
  rtgs: z.string().min(1),
  meaning: z.string().min(1),
  /** Literal/etymological meaning, e.g. สวัสดี ← Sanskrit svasti. */
  literal: z.string().optional(),
  syllables: z.array(syllableSchema).min(1),
  register: z.enum(["neutral", "casual", "polite", "formal"]),
  /** Speaker-gender particles: ครับ = male, ค่ะ/คะ = female. */
  particleGender: z.enum(["male", "female"]).optional(),
  /** Register/politeness/culture notes shown on the word card. */
  usageNote: z.string().optional(),
  audioKey: audioKeySchema, // words/{id}
});
export type VocabWord = z.infer<typeof vocabWordSchema>;

/**
 * A minimal-pair set: the same syllable in different tones. Lessons and
 * weakness-targeted reviews reference sets by id; the engine picks which
 * option to play at runtime, so one set drills differently every session.
 */
export const tonePairSetSchema = z.object({
  id: z.string().min(1),
  note: z.string().optional(),
  options: z
    .array(
      z.object({
        thai: z.string().min(1),
        rtgs: z.string().min(1),
        tone: toneSchema,
        meaning: z.string().min(1),
        audioKey: audioKeySchema,
      }),
    )
    .min(2)
    .max(4),
});
export type TonePairSet = z.infer<typeof tonePairSetSchema>;

export const exerciseSchema = z.discriminatedUnion("type", [
  // Unscored teaching card shown before a character is first tested.
  z.object({ type: z.literal("intro"), characterId }),
  // Multiple choice: show glyph, pick the romanized sound (or mark name).
  z.object({ type: z.literal("glyph_to_sound"), characterId }),
  // Reverse: show name + sound, pick the glyph.
  z.object({ type: z.literal("sound_to_glyph"), characterId }),
  // Audio-only prompt: play the character's sound, pick the glyph.
  z.object({ type: z.literal("listening"), characterId }),
  // Match glyphs to their names (characters) or Thai to meaning (words).
  z.object({
    type: z.literal("match_pairs"),
    /** Character and/or vocab word ids (words pair Thai ↔ meaning). */
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
  // Unscored teaching card for a vocab word: tone-colored syllables,
  // contours, meaning, register badge, expandable spelling breakdown.
  z.object({ type: z.literal("word_intro"), wordId: characterId }),
  // Multiple choice over a vocab word; distractors generated at runtime
  // from the vocab pool (lesson words first, then all words).
  z.object({
    type: z.literal("word_choice"),
    wordId: characterId,
    direction: z.enum(["thai_to_meaning", "meaning_to_thai"]),
  }),
  // Listening-first: audio-only prompt → pick the Thai word; meaning is
  // revealed only in the feedback panel.
  z.object({ type: z.literal("word_listening"), wordId: characterId }),
  // Minimal-pair tone drill over a set from src/content/tone-pairs.ts.
  // The target option is chosen at runtime; the outcome carries its tone
  // for weakness tracking.
  z.object({ type: z.literal("tone_pair"), setId: z.string().min(1) }),
  // Arrange Thai word-chips into the target sentence. The core mechanic of
  // the Thai Phrases course: meaning-prompted (translate and build) or
  // audio-prompted (listen and build). Chips are shuffled at runtime.
  z.object({
    type: z.literal("sentence_build"),
    /** English prompt; in audio mode it's revealed with the feedback. */
    meaning: z.string().min(1),
    /** Word-for-word gloss for content review, e.g. "not + be-right". */
    gloss: z.string().min(1),
    /**
     * Full-sentence TTS clip (phrases/{slug}) of the tokens joined in
     * order — the prompt in audio mode, feedback audio otherwise.
     */
    audioKey: audioKeySchema,
    promptMode: z.enum(["meaning", "audio"]),
    /**
     * Chips in correct order. wordId ties the chip to a vocab word (SRS
     * attribution); literal chips (names, places) carry no wordId.
     */
    tokens: z
      .array(
        z.object({
          thai: z.string().min(1),
          rtgs: z.string().min(1),
          wordId: characterId.optional(),
        }),
      )
      .min(2)
      .max(8),
    /**
     * Extra wrong chips mixed into the bank. Content rule (human-checked,
     * not machine-checkable): a distractor must not allow an alternate
     * grammatical sentence.
     */
    distractors: z
      .array(z.object({ thai: z.string().min(1), rtgs: z.string().min(1) }))
      .max(3)
      .optional(),
    explanation: z.string().optional(),
    /** Defaults to the token wordIds; set to narrow SRS attribution. */
    attributeTo: z.array(characterId).optional(),
  }),
  // Sentence fill-in-the-blank: the sentence is shown with one token
  // hidden; the learner picks the missing token from the blanked token +
  // authored distractors. Particle blanks and content-word blanks are the
  // same schema — only blankIndex differs.
  z.object({
    type: z.literal("sentence_cloze"),
    /** Sentence tokens in order; exactly one (blankIndex) is hidden. */
    tokens: z
      .array(
        z.object({
          thai: z.string().min(1),
          rtgs: z.string().min(1),
          wordId: characterId.optional(),
        }),
      )
      .min(2)
      .max(8),
    blankIndex: z.number().int().nonnegative(),
    /**
     * English of the full sentence — the prompt above the gap. For
     * particle blanks it must pin the context the particle depends on
     * (speaker gender, statement vs question).
     */
    meaning: z.string().min(1),
    /** Full-sentence clip (phrases/{slug}) — plays when feedback shows. */
    audioKey: audioKeySchema,
    /**
     * Wrong fillers, mixed with the blanked token as the choices.
     * Content rule (human-checked): a distractor may be grammatical, but
     * must not produce a sentence that also matches `meaning`.
     */
    distractors: z
      .array(z.object({ thai: z.string().min(1), rtgs: z.string().min(1) }))
      .min(2)
      .max(3),
    explanation: z.string().min(1),
    /** Defaults to the blanked token's wordId. */
    attributeTo: z.array(characterId).optional(),
  }),
  // Sentence-level listening comprehension: play a full sentence, then
  // either pick its English meaning or pick which Thai sentence was said.
  // Distractors are authored (sentences aren't a pool the engine can draw
  // from); every choice carries both sides so feedback shows the full story.
  z.object({
    type: z.literal("sentence_listening"),
    /** phrases/{slug} — often reuses an existing sentence clip. */
    audioKey: audioKeySchema,
    /** What the clip says — revealed in the feedback panel. */
    thai: z.string().min(1),
    rtgs: z.string().min(1),
    /** meaning: options are English translations. transcript: options are Thai. */
    mode: z.enum(["meaning", "transcript"]),
    choices: z
      .array(
        z.object({
          thai: z.string().min(1),
          rtgs: z.string().min(1),
          meaning: z.string().min(1),
        }),
      )
      .min(2)
      .max(4),
    correctIndex: z.number().int().nonnegative(),
    explanation: z.string().optional(),
    /** Words whose SRS cards this answer should count toward. */
    attributeTo: z.array(characterId).optional(),
  }),
  // Dialogue turn: a voiced Thai speaker line in a described situation →
  // pick the reply that fits. Every choice is grammatical Thai; the wrong
  // ones are wrong for different reasons, and each carries its own
  // teaching note. Content rules (human-checked): the best answer is the
  // most NATURAL thing a Thai speaker would say, not the most textbook-
  // polite (verify softeners like หน่อย read naturally for the scene);
  // the speaker line may use natural service-Thai slightly above level,
  // but choices only use taught vocabulary.
  z.object({
    type: z.literal("dialogue_choice"),
    /** Scene-setting in English: place, who's speaking, what you want. */
    context: z.string().min(1),
    /** The other speaker's line — voiced; meaning revealed in feedback. */
    speaker: z.object({
      thai: z.string().min(1),
      rtgs: z.string().min(1),
      meaning: z.string().min(1),
      audioKey: audioKeySchema, // phrases/{slug}
    }),
    question: z.string().min(1),
    choices: z
      .array(
        z.object({
          thai: z.string().min(1),
          rtgs: z.string().min(1),
          /** Required on the best choice (checked at load) — it plays with feedback. */
          audioKey: audioKeySchema.optional(),
          /**
           * best = the reply. register = understood but blunt/over-formal
           * (soft wrong: dents accuracy via the "register" bucket, never
           * the vocab SRS). meaning = says the wrong thing. situation =
           * right phrase, wrong moment.
           */
          quality: z.enum(["best", "register", "meaning", "situation"]),
          /** Why this choice is or isn't right — shown when picked. */
          note: z.string().min(1),
        }),
      )
      .min(3)
      .max(4),
    /** Words in the best reply — they get the SRS credit/blame. */
    attributeTo: z.array(characterId).optional(),
  }),
  // Register drill: a social context → pick the appropriate Thai form.
  z.object({
    type: z.literal("register_choice"),
    /** The social situation, e.g. "You bump into someone on the BTS." */
    context: z.string().min(1),
    question: z.string().min(1),
    choices: z
      .array(
        z.object({
          thai: z.string().min(1),
          rtgs: z.string().min(1),
          /** phrases/{slug}; the correct choice's clip plays with feedback. */
          audioKey: audioKeySchema.optional(),
        }),
      )
      .min(2)
      .max(4),
    correctIndex: z.number().int().nonnegative(),
    explanation: z.string().min(1),
    /** Words whose SRS cards this answer should count toward. */
    attributeTo: z.array(characterId).optional(),
  }),
]);
export type Exercise = z.infer<typeof exerciseSchema>;

export const lessonSchema = z.object({
  id: z.string(),
  unitId: z.string(),
  order: z.number().int().positive(),
  title: z.string(),
  /**
   * checkpoint = a unit's closing cumulative review: teaches nothing,
   * requires passThreshold accuracy to record a completion (so the next
   * unit stays locked until passed — failing still feeds SRS and can be
   * retried immediately), and the engine appends due-card callbacks from
   * earlier units plus weak-tone drills at runtime. Absent = standard.
   */
  kind: z.enum(["standard", "checkpoint"]).optional(),
  /** Accuracy (0–1] required to pass. Checkpoints only (checked at load). */
  passThreshold: z.number().gt(0).lte(1).optional(),
  xpReward: z.number().int().positive(),
  /** Characters or vocab words introduced here (get new SRS cards). */
  teaches: z.array(characterId),
  /** Previously taught characters/words this lesson reinforces. */
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
  /** Learning goals, shown as a bullet list on locked stub path nodes. */
  goals: z.array(z.string().min(1)).optional(),
});
export type Unit = z.infer<typeof unitSchema>;
