import type { VocabWord } from "../schema";

/**
 * Question Words vocabulary (Thai Phrases unit 10). Tones derived from
 * the CLAUDE.md tone table, cited per syllable in `toneReason`.
 * (อะไร, ไหน, เท่าไหร่, กี่ and ไหม were taught in earlier units — this
 * unit completes the toolkit and drills them together.)
 */
export const rawQuestionsWords: VocabWord[] = [
  // ใคร — who. Tone: khrai (mid, low + live; true คร cluster).
  {
    kind: "word",
    id: "khrai",
    thai: "ใคร",
    rtgs: "khrai",
    meaning: "who",
    register: "neutral",
    usageNote:
      "Slot rule, as always: ใครมา “who's coming?”, มากับใคร “coming with whom?”. Same คร cluster you met in ครับ.",
    audioKey: "words/khrai",
    syllables: [
      {
        thai: "ใคร",
        rtgs: "khrai",
        tone: "mid",
        initialId: "kho_khwai",
        clusterIds: ["ro_ruea"],
        vowelId: "sara_ai_maimuan",
        toneReason: "low class ค + live (ใ◌ counts as live) → mid",
        note: "True คร cluster — ค governs the tone.",
      },
    ],
  },
  // ทำไม — why. Tones: tham (mid) · mai (mid).
  {
    kind: "word",
    id: "thammai",
    thai: "ทำไม",
    rtgs: "thammai",
    meaning: "why",
    literal: "“do what” (ทำ do + ไม)",
    register: "neutral",
    usageNote:
      "Can open or close the sentence: ทำไมแพง / แพงทำไม both work. Bare ทำไม? as a reply is as pointed as English “why?!” — add a particle.",
    audioKey: "words/thammai",
    syllables: [
      {
        thai: "ทำ",
        rtgs: "tham",
        tone: "mid",
        initialId: "tho_thahan",
        vowelId: "sara_am",
        toneReason: "low class ท + live (◌ำ counts as live) → mid",
      },
      {
        thai: "ไม",
        rtgs: "mai",
        tone: "mid",
        initialId: "mo_ma",
        vowelId: "sara_ai_maimalai",
        toneReason: "low class ม + live (ไ◌ counts as live) → mid",
        note: "No tone mark — unlike ไม่ (not), which carries mai ek.",
      },
    ],
  },
  // เมื่อไหร่ — when. Tones: mûea (falling) · rài (low, ห-nam + mai ek).
  {
    kind: "word",
    id: "muea_rai",
    thai: "เมื่อไหร่",
    rtgs: "muea rai",
    meaning: "when",
    literal: "“at which time” (เมื่อ time + ไหร่)",
    register: "neutral",
    usageNote:
      "Both halves are reruns: เมื่อ from เมื่อวาน, ไหร่ from เท่าไหร่. ไปเมื่อไหร่ “when do we go?” — slot rule as ever.",
    audioKey: "words/muea_rai",
    syllables: [
      {
        thai: "เมื่อ",
        rtgs: "muea",
        tone: "falling",
        initialId: "mo_ma",
        vowelId: "sara_uea",
        toneMarkId: "mai_ek",
        toneReason: "low class ม + mai ek → falling",
      },
      {
        thai: "ไหร่",
        rtgs: "rai",
        tone: "low",
        initialId: "ho_hip",
        clusterIds: ["ro_ruea"],
        vowelId: "sara_ai_maimalai",
        toneMarkId: "mai_ek",
        toneReason: "silent ห leads ร into high class — high + mai ek → low",
        note: "ห-nam on ร.",
      },
    ],
  },
  // ยังไง — how (colloquial). Tones: yang (mid) · ngai (mid).
  // ⚠ spoken form; the formal written form is อย่างไร.
  {
    kind: "word",
    id: "yangngai",
    thai: "ยังไง",
    rtgs: "yangngai",
    meaning: "how / in what way",
    literal: "spoken squeeze of อย่างไร “in which manner”",
    register: "casual",
    usageNote:
      "What everyone actually says: ไปยังไง “how do we get there?”. In writing and formal speech it straightens up into อย่างไร — recognize both.",
    audioKey: "words/yangngai",
    syllables: [
      {
        thai: "ยัง",
        rtgs: "yang",
        tone: "mid",
        initialId: "yo_yak",
        finalId: "ngo_ngu",
        toneReason: "low class ย + live (sonorant final ง) → mid",
        note: "◌ั writes a short a before the final consonant.",
      },
      {
        thai: "ไง",
        rtgs: "ngai",
        tone: "mid",
        initialId: "ngo_ngu",
        vowelId: "sara_ai_maimalai",
        toneReason: "low class ง + live (ไ◌ counts as live) → mid",
      },
    ],
  },
];
