import type { TonePairSet } from "./schema";

/**
 * Minimal-pair bank: the same syllable in different tones, for pick-by-ear
 * drills. Lessons reference sets by id (`tone_pair` exercises); weakness-
 * targeted reviews sample from here too, so keep sets self-contained.
 * Tones verified against the CLAUDE.md tone table (derivations in comments).
 */
export const rawTonePairSets: TonePairSet[] = [
  // ค่ะ = low ค + mai ek → falling; คะ = low ค + dead short → high.
  {
    id: "kha_set",
    note: "The female polite particles — the tone IS the grammar: falling ends statements, high ends questions.",
    options: [
      {
        thai: "ค่ะ",
        rtgs: "kha",
        tone: "falling",
        meaning: "polite particle (statements)",
        audioKey: "words/kha_statement",
      },
      {
        thai: "คะ",
        rtgs: "kha",
        tone: "high",
        meaning: "polite particle (questions)",
        audioKey: "words/kha_question",
      },
    ],
  },
  // ไม่ = low ม + mai ek → falling; ไม้ = low ม + mai tho → high;
  // ใหม่ = ห-nam (high) + mai ek → low; ไหม = ห-nam (high) + live → rising.
  {
    id: "mai_set",
    note: "Four spellings, four tones, four meanings — the classic proof that tones carry meaning. (ไม้ใหม่ไม่ไหม้ = “new wood doesn't burn.”)",
    options: [
      {
        thai: "ไม่",
        rtgs: "mai",
        tone: "falling",
        meaning: "not",
        audioKey: "words/mai_not",
      },
      {
        thai: "ไม้",
        rtgs: "mai",
        tone: "high",
        meaning: "wood",
        audioKey: "words/mai_wood",
      },
      {
        thai: "ใหม่",
        rtgs: "mai",
        tone: "low",
        meaning: "new",
        audioKey: "words/mai_new",
      },
      {
        thai: "ไหม",
        rtgs: "mai",
        tone: "rising",
        meaning: "silk; question particle",
        audioKey: "words/mai_question",
      },
    ],
  },
  // มา = low ม + live (long อา) → mid; ม้า = LOW ม + mai tho → high;
  // หมา = ห-nam (high) + live → rising.
  {
    id: "ma_set",
    note: "Come, horse, dog — the trio every Thai teacher opens with. Get the tone wrong and the dog comes instead of you.",
    options: [
      {
        thai: "มา",
        rtgs: "ma",
        tone: "mid",
        meaning: "to come",
        audioKey: "words/ma_come",
      },
      {
        thai: "ม้า",
        rtgs: "ma",
        tone: "high",
        meaning: "horse",
        audioKey: "words/ma_horse",
      },
      {
        thai: "หมา",
        rtgs: "ma",
        tone: "rising",
        meaning: "dog",
        audioKey: "words/ma_dog",
      },
    ],
  },
  // สี่ = high ส + mai ek → low; สี = high ส + live → rising.
  {
    id: "si_set",
    note: "Four or a color — สี่ dips low, สี rises. Market stakes: สี่สิบ is 40, สีสิบ is nonsense.",
    options: [
      {
        thai: "สี่",
        rtgs: "si",
        tone: "low",
        meaning: "four (4)",
        audioKey: "words/si",
      },
      {
        thai: "สี",
        rtgs: "si",
        tone: "rising",
        meaning: "color",
        audioKey: "words/si_color",
      },
    ],
  },
  // ใกล้ = mid ก + mai tho → falling; ไกล = mid ก + live → mid.
  {
    id: "klai_set",
    note: "Near or far — same sound, opposite meanings, one tone apart. The pair that decides your taxi fare.",
    options: [
      {
        thai: "ใกล้",
        rtgs: "klai",
        tone: "falling",
        meaning: "near",
        audioKey: "words/klai_near",
      },
      {
        thai: "ไกล",
        rtgs: "klai",
        tone: "mid",
        meaning: "far",
        audioKey: "words/klai_far",
      },
    ],
  },
  // เสือ = high ส + live → rising; เสื้อ = high ส + mai tho → falling;
  // เสื่อ = high ส + mai ek → low.
  {
    id: "suea_set",
    note: "Tiger, shirt, or mat — hear the difference before you buy a เสื้อ and get a เสือ.",
    options: [
      {
        thai: "เสือ",
        rtgs: "suea",
        tone: "rising",
        meaning: "tiger",
        audioKey: "words/suea_tiger",
      },
      {
        thai: "เสื้อ",
        rtgs: "suea",
        tone: "falling",
        meaning: "shirt",
        audioKey: "words/suea_shirt",
      },
      {
        thai: "เสื่อ",
        rtgs: "suea",
        tone: "low",
        meaning: "mat",
        audioKey: "words/suea_mat",
      },
    ],
  },
];
