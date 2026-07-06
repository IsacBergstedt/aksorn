import {
  characters,
  getCharacter,
  getItem,
  getWord,
  tonePairSetById,
  tonePairSets,
  vocabWords,
} from "@/content";
import type {
  ConsonantClass,
  Lesson,
  ThaiCharacter,
  ThaiConsonant,
  Tone,
  TonePairSet,
  VocabWord,
} from "@/content/schema";
import {
  dueCards,
  weaknessFirst,
  type SrsCard,
  type ToneStats,
} from "@/lib/srs";

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
      exampleAudioKey?: string;
    }
  | {
      kind: "choice";
      direction: "glyph_to_sound" | "sound_to_glyph";
      target: ThaiCharacter;
      options: ThaiCharacter[]; // includes the target, shuffled
    }
  | {
      kind: "listening";
      target: ThaiCharacter;
      options: ThaiCharacter[]; // includes the target, shuffled
    }
  | { kind: "match_pairs"; items: MatchItem[] }
  | {
      kind: "class_sort";
      characters: ThaiConsonant[];
      classes: [ConsonantClass, ConsonantClass];
    }
  | {
      kind: "rule_choice";
      prompt: string;
      audioKey: string;
      promptNote?: string;
      question: string;
      choices: string[];
      correctIndex: number;
      explanation: string;
      attributeTo?: string[];
    }
  | { kind: "word_intro"; word: VocabWord }
  | {
      kind: "word_choice";
      direction: "thai_to_meaning" | "meaning_to_thai";
      target: VocabWord;
      options: VocabWord[]; // includes the target, shuffled
    }
  | {
      kind: "word_listening";
      target: VocabWord;
      options: VocabWord[]; // includes the target, shuffled
    }
  | {
      kind: "tone_pair";
      set: TonePairSet;
      correctIndex: number; // target option, chosen at build time
    }
  | {
      kind: "sentence_build";
      meaning: string;
      gloss: string;
      audioKey: string;
      promptMode: "meaning" | "audio";
      /** Correct order. */
      tokens: SentenceChip[];
      /** Tokens + distractors, shuffled for the chip bank. */
      chips: SentenceChip[];
      explanation?: string;
      attributeTo?: string[];
    }
  | {
      kind: "register_choice";
      context: string;
      question: string;
      choices: { thai: string; rtgs: string; audioKey?: string }[];
      correctIndex: number;
      explanation: string;
      attributeTo?: string[];
    }
  | {
      kind: "sentence_cloze";
      meaning: string;
      audioKey: string;
      tokens: SentenceChip[];
      blankIndex: number;
      /** Blanked token + distractors, shuffled. */
      choices: { thai: string; rtgs: string }[];
      correctIndex: number;
      explanation: string;
      attributeTo?: string[];
    }
  | {
      kind: "sentence_listening";
      audioKey: string;
      thai: string;
      rtgs: string;
      mode: "meaning" | "transcript";
      choices: { thai: string; rtgs: string; meaning: string }[];
      correctIndex: number;
      explanation?: string;
      attributeTo?: string[];
    }
  | {
      kind: "dialogue_choice";
      context: string;
      speaker: { thai: string; rtgs: string; meaning: string; audioKey: string };
      question: string;
      choices: {
        thai: string;
        rtgs: string;
        audioKey?: string;
        quality: "best" | "register" | "meaning" | "situation";
        note: string;
      }[];
      attributeTo?: string[];
    };

/** match_pairs tiles: characters pair glyph↔name, words pair Thai↔meaning. */
export type MatchItem = ThaiCharacter | VocabWord;

/** One draggable/tappable chip of a sentence_build bank. */
export type SentenceChip = { thai: string; rtgs: string; wordId?: string };

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

/**
 * What a word option displays for each direction: meanings when the prompt
 * is Thai, Thai script when the prompt is the meaning (or audio).
 */
function wordOptionLabel(
  w: VocabWord,
  direction: "thai_to_meaning" | "meaning_to_thai",
): string {
  return direction === "thai_to_meaning" ? w.meaning : w.thai;
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

function pickWordDistractors(
  target: VocabWord,
  lessonPool: VocabWord[],
  direction: "thai_to_meaning" | "meaning_to_thai",
): VocabWord[] {
  // Preference tiers mirror pickDistractors: lesson words first, then the
  // whole vocab pool.
  const tiers = [lessonPool, vocabWords];
  const picked: VocabWord[] = [];
  const usedIds = new Set([target.id]);
  const usedLabels = new Set([wordOptionLabel(target, direction)]);

  for (const tier of tiers) {
    for (const w of shuffle(tier)) {
      if (picked.length >= OPTION_COUNT - 1) break;
      if (usedIds.has(w.id)) continue;
      // Both directions display a text label, so labels must be distinct.
      if (usedLabels.has(wordOptionLabel(w, direction))) continue;
      picked.push(w);
      usedIds.add(w.id);
      usedLabels.add(wordOptionLabel(w, direction));
    }
  }
  return picked;
}

function buildWordChoice(
  direction: "thai_to_meaning" | "meaning_to_thai",
  wordId: string,
  lessonPool: VocabWord[],
): RuntimeExercise {
  const target = getWord(wordId);
  const distractors = pickWordDistractors(target, lessonPool, direction);
  return {
    kind: "word_choice",
    direction,
    target,
    options: shuffle([target, ...distractors]),
  };
}

function buildWordListening(
  wordId: string,
  lessonPool: VocabWord[],
): RuntimeExercise {
  const target = getWord(wordId);
  // Options show Thai script — same distinctness rule as meaning_to_thai.
  const distractors = pickWordDistractors(target, lessonPool, "meaning_to_thai");
  return {
    kind: "word_listening",
    target,
    options: shuffle([target, ...distractors]),
  };
}

function buildTonePair(set: TonePairSet, targetTone?: Tone): RuntimeExercise {
  // The target rotates per session; a weakness drill pins the target tone.
  const eligible = set.options
    .map((o, i) => ({ tone: o.tone, i }))
    .filter((o) => (targetTone ? o.tone === targetTone : true));
  const pick = eligible[Math.floor(Math.random() * eligible.length)] ?? {
    i: 0,
  };
  return { kind: "tone_pair", set, correctIndex: pick.i };
}

function buildListening(
  characterId: string,
  lessonPool: ThaiCharacter[],
): RuntimeExercise {
  const target = getCharacter(characterId);
  // Options are glyphs, so duplicate answer labels are fine — same rule as
  // sound_to_glyph.
  const distractors = pickDistractors(target, lessonPool, "sound_to_glyph");
  return {
    kind: "listening",
    target,
    options: shuffle([target, ...distractors]),
  };
}

export function buildLessonExercises(lesson: Lesson): RuntimeExercise[] {
  const lessonItems = [...lesson.teaches, ...lesson.reviews].map(getItem);
  const lessonPool = lessonItems.filter(
    (i): i is ThaiCharacter => i.kind !== "word",
  );
  const lessonWordPool = lessonItems.filter(
    (i): i is VocabWord => i.kind === "word",
  );

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
          exampleAudioKey: ex.exampleAudioKey,
        };
      case "glyph_to_sound":
      case "sound_to_glyph":
        return buildChoice(ex.type, ex.characterId, lessonPool);
      case "listening":
        return buildListening(ex.characterId, lessonPool);
      case "match_pairs":
        return {
          kind: "match_pairs",
          items: ex.characterIds.map(getItem),
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
          audioKey: ex.audioKey,
          promptNote: ex.promptNote,
          question: ex.question,
          choices: ex.choices,
          correctIndex: ex.correctIndex,
          explanation: ex.explanation,
          attributeTo: ex.attributeTo,
        };
      case "word_intro":
        return { kind: "word_intro", word: getWord(ex.wordId) };
      case "word_choice":
        return buildWordChoice(ex.direction, ex.wordId, lessonWordPool);
      case "word_listening":
        return buildWordListening(ex.wordId, lessonWordPool);
      case "tone_pair": {
        const set = tonePairSetById.get(ex.setId);
        if (!set) throw new Error(`Unknown tone pair set: ${ex.setId}`);
        return buildTonePair(set);
      }
      case "sentence_build":
        return {
          kind: "sentence_build",
          meaning: ex.meaning,
          gloss: ex.gloss,
          audioKey: ex.audioKey,
          promptMode: ex.promptMode,
          tokens: ex.tokens,
          chips: shuffle([...ex.tokens, ...(ex.distractors ?? [])]),
          explanation: ex.explanation,
          attributeTo: ex.attributeTo,
        };
      case "sentence_cloze": {
        const blank = ex.tokens[ex.blankIndex];
        // The blanked token joins the distractors as the choice set; its
        // shuffled position becomes the correct index.
        const choices = shuffle([
          { thai: blank.thai, rtgs: blank.rtgs },
          ...ex.distractors,
        ]);
        return {
          kind: "sentence_cloze",
          meaning: ex.meaning,
          audioKey: ex.audioKey,
          tokens: ex.tokens,
          blankIndex: ex.blankIndex,
          choices,
          correctIndex: choices.findIndex((c) => c.thai === blank.thai),
          explanation: ex.explanation,
          attributeTo: ex.attributeTo,
        };
      }
      case "sentence_listening":
        return {
          kind: "sentence_listening",
          audioKey: ex.audioKey,
          thai: ex.thai,
          rtgs: ex.rtgs,
          mode: ex.mode,
          choices: ex.choices,
          correctIndex: ex.correctIndex,
          explanation: ex.explanation,
          attributeTo: ex.attributeTo,
        };
      case "dialogue_choice":
        return {
          kind: "dialogue_choice",
          context: ex.context,
          speaker: ex.speaker,
          question: ex.question,
          // Authored order is already deliberate-looking; shuffle anyway so
          // the best answer can't be position-learned on retry.
          choices: shuffle(ex.choices),
          attributeTo: ex.attributeTo,
        };
      case "register_choice":
        return {
          kind: "register_choice",
          context: ex.context,
          question: ex.question,
          choices: ex.choices,
          correctIndex: ex.correctIndex,
          explanation: ex.explanation,
          attributeTo: ex.attributeTo,
        };
    }
  });
}

const REVIEW_MAX_ITEMS = 6;
const WEAK_TONE_MIN_ATTEMPTS = 3;
const WEAK_TONE_MISS_RATE = 0.3;

/** Tones the learner demonstrably struggles with, worst first. */
export function weakTones(toneStats: ToneStats): Tone[] {
  return (Object.entries(toneStats) as [Tone, { correct: number; wrong: number }][])
    .map(([tone, c]) => ({
      tone,
      attempts: c.correct + c.wrong,
      rate: c.wrong / Math.max(1, c.correct + c.wrong),
    }))
    .filter((t) => t.attempts >= WEAK_TONE_MIN_ATTEMPTS && t.rate > WEAK_TONE_MISS_RATE)
    .sort((a, b) => b.rate - a.rate)
    .map((t) => t.tone);
}

/**
 * A review session is a dynamically generated lesson over due SRS cards
 * (characters and vocab words). `itemIds` is expected weakest-first (see
 * weaknessFirst in src/lib/srs.ts): the weakest items also get the
 * listening exercises. Tones the learner keeps missing (per `toneStats`)
 * get minimal-pair drills appended from the tone-pair bank.
 */
export function buildReviewExercises(
  itemIds: string[],
  toneStats: ToneStats = {},
): RuntimeExercise[] {
  const items = itemIds.slice(0, REVIEW_MAX_ITEMS).map(getItem);
  const chars = items.filter((i): i is ThaiCharacter => i.kind !== "word");
  const words = items.filter((i): i is VocabWord => i.kind === "word");

  const charPool =
    chars.length > 1 ? chars : characters.filter((c) => !isObsolete(c));
  const wordPool = words.length > 1 ? words : vocabWords;

  const exercises: RuntimeExercise[] = [
    ...chars.map((c) => buildChoice("glyph_to_sound", c.id, charPool)),
    ...words.map((w) => buildWordChoice("thai_to_meaning", w.id, wordPool)),
    ...shuffle(chars).map((c) => buildChoice("sound_to_glyph", c.id, charPool)),
    ...shuffle(words).map((w) =>
      buildWordChoice("meaning_to_thai", w.id, wordPool),
    ),
    // Weakest-first order means the listening drills land on the items
    // that need the ear training most.
    ...chars.slice(0, 3).map((c) => buildListening(c.id, charPool)),
    ...words.slice(0, 3).map((w) => buildWordListening(w.id, wordPool)),
  ];
  if (items.length >= 4) {
    exercises.push({ kind: "match_pairs", items: items.slice(0, 4) });
  }

  // Over-sample the tones this learner misses most: one pinned-target
  // minimal-pair drill per weak tone, worst two tones only.
  for (const tone of weakTones(toneStats).slice(0, 2)) {
    const set = shuffle(
      tonePairSets.filter((s) => s.options.some((o) => o.tone === tone)),
    )[0];
    if (set) exercises.push(buildTonePair(set, tone));
  }

  return exercises;
}

export function reviewXp(characterCount: number): number {
  return Math.min(5 + 2 * characterCount, 20);
}

const CHECKPOINT_CALLBACKS = 3;

/**
 * The dynamic tail of a checkpoint lesson: light SRS callbacks — due
 * cards from OUTSIDE the checkpoint's own material, weakest first — plus
 * the same weak-tone minimal-pair drills reviews append. The authored
 * exercises cover the unit; this part personalizes the session.
 */
export function buildCheckpointExtras(
  lesson: Lesson,
  srsCards: Record<string, SrsCard>,
  toneStats: ToneStats = {},
): RuntimeExercise[] {
  const own = new Set([...lesson.teaches, ...lesson.reviews]);
  const callbacks = weaknessFirst(dueCards(srsCards))
    .filter((c) => !own.has(c.characterId))
    .slice(0, CHECKPOINT_CALLBACKS)
    .map((c) => getItem(c.characterId));

  const charPool = characters.filter((c) => !isObsolete(c));
  const exercises: RuntimeExercise[] = callbacks.map((item) =>
    item.kind === "word"
      ? buildWordChoice("thai_to_meaning", item.id, vocabWords)
      : buildChoice("glyph_to_sound", item.id, charPool),
  );

  for (const tone of weakTones(toneStats).slice(0, 2)) {
    const set = shuffle(
      tonePairSets.filter((s) => s.options.some((o) => o.tone === tone)),
    )[0];
    if (set) exercises.push(buildTonePair(set, tone));
  }
  return exercises;
}
