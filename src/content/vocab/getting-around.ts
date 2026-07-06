import type { VocabWord } from "../schema";

/**
 * Directions & Getting Around vocabulary (Thai Phrases unit 7). Tones
 * derived from the CLAUDE.md tone table, cited per syllable in `toneReason`.
 */
export const rawGettingAroundWords: VocabWord[] = [
  // ไป — to go. Tone: pai (mid, mid + live).
  {
    kind: "word",
    id: "pai",
    thai: "ไป",
    rtgs: "pai",
    meaning: "to go",
    register: "neutral",
    usageNote:
      "The engine of every trip: ไปไหน “where to?”, ตรงไป “go straight”. After an adjective it means “too …” — แพงไป “too expensive”.",
    audioKey: "words/pai",
    syllables: [
      {
        thai: "ไป",
        rtgs: "pai",
        tone: "mid",
        initialId: "po_pla",
        vowelId: "sara_ai_maimalai",
        toneReason: "mid class ป + live (ไ◌ counts as live) → mid",
      },
    ],
  },
  // อยู่ — to be (located). Tone: yù (low, อ-nam: one of the four อ+ย words).
  {
    kind: "word",
    id: "yu",
    thai: "อยู่",
    rtgs: "yu",
    meaning: "to be at / to be located",
    register: "neutral",
    usageNote:
      "Location verb: X อยู่ที่ไหน “where is X?”. One of only four words where silent อ leads ย (อย่า อยู่ อย่าง อยาก) — mid-class rules apply.",
    audioKey: "words/yu",
    syllables: [
      {
        thai: "อยู่",
        rtgs: "yu",
        tone: "low",
        initialId: "o_ang",
        clusterIds: ["yo_yak"],
        vowelId: "sara_u_long",
        toneMarkId: "mai_ek",
        toneReason: "silent อ leads ย into mid class — mid + mai ek → low",
        note: "อ-nam: อ is unsounded but donates its mid class.",
      },
    ],
  },
  // ที่ — at / place. Tone: thî (falling, low + mai ek). Same syllable as
  // in ยินดีที่ได้รู้จัก.
  {
    kind: "word",
    id: "thi",
    thai: "ที่",
    rtgs: "thi",
    meaning: "at / place",
    register: "neutral",
    usageNote:
      "Glue word: ที่ไหน “at where?”, ที่โรงแรม “at the hotel”. Also the “that/which” you met inside ยินดีที่ได้รู้จัก.",
    audioKey: "words/thi",
    syllables: [
      {
        thai: "ที่",
        rtgs: "thi",
        tone: "falling",
        initialId: "tho_thahan",
        vowelId: "sara_i_long",
        toneMarkId: "mai_ek",
        toneReason: "low class ท + mai ek → falling",
      },
    ],
  },
  // ซ้าย — left. Tone: sái (high, LOW + mai tho).
  {
    kind: "word",
    id: "sai",
    thai: "ซ้าย",
    rtgs: "sai",
    meaning: "left",
    register: "neutral",
    audioKey: "words/sai",
    syllables: [
      {
        thai: "ซ้าย",
        rtgs: "sai",
        tone: "high",
        initialId: "so_so",
        vowelId: "sara_a_long",
        finalId: "yo_yak",
        toneMarkId: "mai_tho",
        toneReason: "LOW class ซ + mai tho → high",
      },
    ],
  },
  // ขวา — right. Tone: khwǎ (rising, high + live; true ขว cluster).
  {
    kind: "word",
    id: "khwa",
    thai: "ขวา",
    rtgs: "khwa",
    meaning: "right (side)",
    register: "neutral",
    audioKey: "words/khwa",
    syllables: [
      {
        thai: "ขวา",
        rtgs: "khwa",
        tone: "rising",
        initialId: "kho_khai",
        clusterIds: ["wo_waen"],
        vowelId: "sara_a_long",
        toneReason: "high class ข + live (long อา, open) → rising",
        note: "ขว is a true cluster — the high-class ข governs the tone.",
      },
    ],
  },
  // ตรง — straight. Tone: trong (mid, mid + live; true ตร cluster).
  {
    kind: "word",
    id: "trong",
    thai: "ตรง",
    rtgs: "trong",
    meaning: "straight / directly",
    register: "neutral",
    usageNote:
      "ตรงไป “straight ahead” — the phrase that ends most taxi negotiations. ตรงนี้ = “right here”.",
    audioKey: "words/trong",
    syllables: [
      {
        thai: "ตรง",
        rtgs: "trong",
        tone: "mid",
        initialId: "to_tao",
        clusterIds: ["ro_ruea"],
        finalId: "ngo_ngu",
        toneReason: "mid class ต + live (sonorant final ง) → mid",
        note: "True ตร cluster; no written vowel — inherent short o.",
      },
    ],
  },
  // ห้องน้ำ — bathroom. Tones: hông (falling) · nám (high). Literal
  // "water room".
  {
    kind: "word",
    id: "hong_nam",
    thai: "ห้องน้ำ",
    rtgs: "hong nam",
    meaning: "bathroom / toilet",
    literal: "“water room” (ห้อง room + น้ำ water)",
    register: "neutral",
    usageNote:
      "The single most searched-for room in any country. ห้อง alone is “room” — ห้องน้ำอยู่ที่ไหน works everywhere, no euphemisms needed.",
    audioKey: "words/hong_nam",
    syllables: [
      {
        thai: "ห้อง",
        rtgs: "hong",
        tone: "falling",
        initialId: "ho_hip",
        vowelId: "sara_o_open_long",
        finalId: "ngo_ngu",
        toneMarkId: "mai_tho",
        toneReason: "high class ห + mai tho → falling",
      },
      {
        thai: "น้ำ",
        rtgs: "nam",
        tone: "high",
        initialId: "no_nu",
        vowelId: "sara_am",
        toneMarkId: "mai_tho",
        toneReason: "LOW class น + mai tho → high",
      },
    ],
  },
  // ใกล้ — near. Tone: klâi (falling, mid + mai tho). Minimal pair with
  // ไกล "far" — one tone apart, opposite meanings (klai_set).
  {
    kind: "word",
    id: "klai_near",
    thai: "ใกล้",
    rtgs: "klai",
    meaning: "near",
    register: "neutral",
    usageNote:
      "Thai's cruelest minimal pair: ใกล้ (falling) near, ไกล (mid) far. Get the tone wrong and the taxi meter decides for you — drill klai_set until it hurts.",
    audioKey: "words/klai_near",
    syllables: [
      {
        thai: "ใกล้",
        rtgs: "klai",
        tone: "falling",
        initialId: "ko_kai",
        clusterIds: ["lo_ling"],
        vowelId: "sara_ai_maimuan",
        toneMarkId: "mai_tho",
        toneReason: "mid class ก + mai tho → falling",
        note: "True กล cluster.",
      },
    ],
  },
  // ไกล — far. Tone: klai (mid, mid + live).
  {
    kind: "word",
    id: "klai_far",
    thai: "ไกล",
    rtgs: "klai",
    meaning: "far",
    register: "neutral",
    usageNote:
      "The mid-tone twin of ใกล้. Different vowel letter in writing (ไ vs ใ), identical sound — only the tone tells a Thai ear which one you said.",
    audioKey: "words/klai_far",
    syllables: [
      {
        thai: "ไกล",
        rtgs: "klai",
        tone: "mid",
        initialId: "ko_kai",
        clusterIds: ["lo_ling"],
        vowelId: "sara_ai_maimalai",
        toneReason: "mid class ก + live (ไ◌ counts as live) → mid",
        note: "True กล cluster.",
      },
    ],
  },
];
