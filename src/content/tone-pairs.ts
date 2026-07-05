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
