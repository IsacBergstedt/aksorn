import type { VocabWord } from "../schema";

/**
 * Yes, No & Basic Responses vocabulary (Thai Phrases unit 2). All copy is
 * original; the words are public-domain language facts. Every syllable's
 * tone is derived from the tone table in CLAUDE.md and cited in
 * `toneReason` for human review.
 *
 * Verification key per item (as comments):
 *   literal = word-for-word / etymological meaning
 *   tones   = per-syllable, in order
 *   register/particle notes where relevant
 */
export const rawResponsesWords: VocabWord[] = [
  // ใช่ — literal: "to be so". Tone: chai (falling). Register: neutral.
  // ⚠ Scope is narrower than English "yes": it confirms identity questions
  // ("is it X?"); verb questions are answered by echoing the verb.
  {
    kind: "word",
    id: "chai",
    thai: "ใช่",
    rtgs: "chai",
    meaning: "yes, that's right",
    literal: "“to be so”",
    register: "neutral",
    usageNote:
      "Confirms “is it X?” questions — ใช่, that's the one. For “do you want / can you / did you” questions, Thai answers by repeating the verb, not with ใช่.",
    audioKey: "words/chai",
    syllables: [
      {
        thai: "ใช่",
        rtgs: "chai",
        tone: "falling",
        initialId: "cho_chang",
        vowelId: "sara_ai_maimuan",
        toneMarkId: "mai_ek",
        toneReason: "low class ช + mai ek → falling",
      },
    ],
  },

  // ไม่ — literal: "not". Tone: mai (falling). Register: neutral.
  // The negator: ไม่ + verb. Also the bare "no" to verb questions
  // (politely: ไม่ครับ / ไม่ค่ะ).
  {
    kind: "word",
    id: "mai_not",
    thai: "ไม่",
    rtgs: "mai",
    meaning: "not / no",
    register: "neutral",
    usageNote:
      "Goes in front of the verb: ไม่เอา “don't want”, ไม่ใช่ “not so”. As a bare answer, soften it with the polite particle: ไม่ครับ / ไม่ค่ะ.",
    audioKey: "words/mai_not",
    syllables: [
      {
        thai: "ไม่",
        rtgs: "mai",
        tone: "falling",
        initialId: "mo_ma",
        vowelId: "sara_ai_maimalai",
        toneMarkId: "mai_ek",
        toneReason: "low class ม + mai ek → falling",
      },
    ],
  },

  // ได้ — literal: "to get / attain" → "can, may, OK". Tone: dai (falling).
  // Register: neutral. The all-purpose "sure, can do".
  {
    kind: "word",
    id: "dai",
    thai: "ได้",
    rtgs: "dai",
    meaning: "can / OK, sure",
    literal: "“to get, to attain” — extended to ability and permission",
    register: "neutral",
    usageNote:
      "The all-purpose green light: ได้ครับ/ค่ะ = “sure, no problem”. Negated it flips to refusal or inability: ไม่ได้ = “can't / not allowed”.",
    audioKey: "words/dai",
    syllables: [
      {
        thai: "ได้",
        rtgs: "dai",
        tone: "falling",
        initialId: "do_dek",
        vowelId: "sara_ai_maimalai",
        toneMarkId: "mai_tho",
        toneReason: "mid class ด + mai tho → falling",
      },
    ],
  },

  // เข้าใจ — literal: เข้า (to enter) + ใจ (heart/mind) = "to enter the
  // heart" → understand. Tones: khâo (falling) · jai (mid, RTGS chai).
  // Register: neutral.
  {
    kind: "word",
    id: "khao_chai",
    thai: "เข้าใจ",
    rtgs: "khao chai",
    meaning: "to understand",
    literal: "“to enter the heart” (เข้า + ใจ)",
    register: "neutral",
    usageNote:
      "เข้าใจ = “got it”; ไม่เข้าใจ = “I don't understand” — the single most useful sentence a learner owns. Add ครับ/ค่ะ with strangers.",
    audioKey: "words/khao_chai",
    syllables: [
      {
        thai: "เข้า",
        rtgs: "khao",
        tone: "falling",
        initialId: "kho_khai",
        vowelId: "sara_ao",
        toneMarkId: "mai_tho",
        toneReason: "high class ข + mai tho → falling",
      },
      {
        thai: "ใจ",
        rtgs: "chai",
        tone: "mid",
        initialId: "cho_chan",
        vowelId: "sara_ai_maimuan",
        toneReason: "mid class จ + live (ใ◌ counts as live) → mid",
      },
    ],
  },

  // รู้ — literal: "to know (facts)". Tone: rúu (high). Register: neutral,
  // ⚠ but bare ไม่รู้ reads curt with strangers — ไม่ทราบ (mâi sâap) is the
  // polite counterpart. Flagged in the usage note; ทราบ itself is not
  // taught at this level.
  {
    kind: "word",
    id: "ru",
    thai: "รู้",
    rtgs: "ru",
    meaning: "to know",
    register: "neutral",
    usageNote:
      "Knowing facts (not people). ไม่รู้ between friends is fine; to a stranger or official it can sound curt — ไม่ทราบครับ/ค่ะ is the polished version you'll hear back.",
    audioKey: "words/ru",
    syllables: [
      {
        thai: "รู้",
        rtgs: "ru",
        tone: "high",
        initialId: "ro_ruea",
        vowelId: "sara_u_long",
        toneMarkId: "mai_tho",
        toneReason: "LOW class ร + mai tho → high",
      },
    ],
  },

  // เอา — literal: "to take" → "want / I'll take it". Tone: ao (mid).
  // Register: neutral in transactions, ⚠ blunt without a particle —
  // ไม่เอา alone can land like "don't want it!". Drilled via
  // register_choice in resp-03.
  {
    kind: "word",
    id: "ao",
    thai: "เอา",
    rtgs: "ao",
    meaning: "to want / to take",
    literal: "“to take” — in shops and stalls, “I'll take…”",
    register: "neutral",
    usageNote:
      "The transaction verb: เอาครับ “yes please / I'll take it”, ไม่เอาค่ะ “no thanks”. Without the particle, ไม่เอา is abrupt — fine with friends, rude to a vendor.",
    audioKey: "words/ao",
    syllables: [
      {
        thai: "เอา",
        rtgs: "ao",
        tone: "mid",
        initialId: "o_ang",
        vowelId: "sara_ao",
        toneReason: "mid class อ + live (เ◌า counts as live) → mid",
      },
    ],
  },
];
