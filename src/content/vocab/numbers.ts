import type { VocabWord } from "../schema";

/**
 * Numbers & Counting vocabulary (Thai Phrases unit 4). Tones derived from
 * the CLAUDE.md tone table, cited per syllable in `toneReason`.
 */
export const rawNumbersWords: VocabWord[] = [
  // หนึ่ง — 1. Tone: nùeng (low, ห-nam + mai ek).
  {
    kind: "word",
    id: "nueng",
    thai: "หนึ่ง",
    rtgs: "nueng",
    meaning: "one (1)",
    register: "neutral",
    usageNote:
      "In casual counting-off Thais often flip it to เอ็ด in compounds: 11 is สิบเอ็ด, never สิบหนึ่ง.",
    audioKey: "words/nueng",
    syllables: [
      {
        thai: "หนึ่ง",
        rtgs: "nueng",
        tone: "low",
        initialId: "ho_hip",
        clusterIds: ["no_nu"],
        vowelId: "sara_ue_short",
        finalId: "ngo_ngu",
        toneMarkId: "mai_ek",
        toneReason: "silent ห leads น into high class — high + mai ek → low",
        note: "ห-nam: the unsounded ห lends น its high class.",
      },
    ],
  },
  // สอง — 2. Tone: sǒng (rising, high + live).
  {
    kind: "word",
    id: "song",
    thai: "สอง",
    rtgs: "song",
    meaning: "two (2)",
    register: "neutral",
    audioKey: "words/song",
    syllables: [
      {
        thai: "สอง",
        rtgs: "song",
        tone: "rising",
        initialId: "so_suea",
        vowelId: "sara_o_open_long",
        finalId: "ngo_ngu",
        toneReason: "high class ส + live (sonorant final ง) → rising",
      },
    ],
  },
  // สาม — 3. Tone: sǎm (rising, high + live).
  {
    kind: "word",
    id: "sam",
    thai: "สาม",
    rtgs: "sam",
    meaning: "three (3)",
    register: "neutral",
    audioKey: "words/sam",
    syllables: [
      {
        thai: "สาม",
        rtgs: "sam",
        tone: "rising",
        initialId: "so_suea",
        vowelId: "sara_a_long",
        finalId: "mo_ma",
        toneReason: "high class ส + live (sonorant final ม) → rising",
      },
    ],
  },
  // สี่ — 4. Tone: sì (low, high + mai ek). Minimal pair with สี (color,
  // rising) — drilled as si_set.
  {
    kind: "word",
    id: "si",
    thai: "สี่",
    rtgs: "si",
    meaning: "four (4)",
    register: "neutral",
    usageNote:
      "One tone away from สี “color” (rising) — the si_set drill trains the pair. Thais don't fear four; no tetraphobia here.",
    audioKey: "words/si",
    syllables: [
      {
        thai: "สี่",
        rtgs: "si",
        tone: "low",
        initialId: "so_suea",
        vowelId: "sara_i_long",
        toneMarkId: "mai_ek",
        toneReason: "high class ส + mai ek → low",
      },
    ],
  },
  // ห้า — 5. Tone: hâ (falling, high + mai tho). 555 = ha-ha-ha in Thai chat.
  {
    kind: "word",
    id: "ha",
    thai: "ห้า",
    rtgs: "ha",
    meaning: "five (5)",
    register: "neutral",
    usageNote:
      "Why Thai internet laughs in numbers: 555 reads hâ-hâ-hâ. Here ห is sounded — no ห-nam, it's the initial itself.",
    audioKey: "words/ha",
    syllables: [
      {
        thai: "ห้า",
        rtgs: "ha",
        tone: "falling",
        initialId: "ho_hip",
        vowelId: "sara_a_long",
        toneMarkId: "mai_tho",
        toneReason: "high class ห + mai tho → falling",
      },
    ],
  },
  // หก — 6. Tone: hòk (low, high + dead).
  {
    kind: "word",
    id: "hok",
    thai: "หก",
    rtgs: "hok",
    meaning: "six (6)",
    register: "neutral",
    audioKey: "words/hok",
    syllables: [
      {
        thai: "หก",
        rtgs: "hok",
        tone: "low",
        initialId: "ho_hip",
        finalId: "ko_kai",
        toneReason: "high class ห + dead (stop final ก) → low",
        note: "No written vowel — a short o is inherent between two consonants.",
      },
    ],
  },
  // เจ็ด — 7. Tone: chèt (low, mid + dead).
  {
    kind: "word",
    id: "chet",
    thai: "เจ็ด",
    rtgs: "chet",
    meaning: "seven (7)",
    register: "neutral",
    audioKey: "words/chet",
    syllables: [
      {
        thai: "เจ็ด",
        rtgs: "chet",
        tone: "low",
        initialId: "cho_chan",
        vowelId: "sara_e_short",
        finalId: "do_dek",
        toneReason: "mid class จ + dead (stop final ด) → low",
        note: "◌็ (mai taikhu) marks the เ◌ vowel short before the final.",
      },
    ],
  },
  // แปด — 8. Tone: pàet (low, mid + dead — dead beats the long vowel).
  {
    kind: "word",
    id: "paet",
    thai: "แปด",
    rtgs: "paet",
    meaning: "eight (8)",
    register: "neutral",
    audioKey: "words/paet",
    syllables: [
      {
        thai: "แปด",
        rtgs: "paet",
        tone: "low",
        initialId: "po_pla",
        vowelId: "sara_ae_long",
        finalId: "do_dek",
        toneReason: "mid class ป + dead (stop final ด) → low",
      },
    ],
  },
  // เก้า — 9. Tone: kâo (falling, mid + mai tho).
  {
    kind: "word",
    id: "kao",
    thai: "เก้า",
    rtgs: "kao",
    meaning: "nine (9)",
    register: "neutral",
    usageNote:
      "Sounds like ก้าว “to step forward” — which is why nine is the lucky number here.",
    audioKey: "words/kao",
    syllables: [
      {
        thai: "เก้า",
        rtgs: "kao",
        tone: "falling",
        initialId: "ko_kai",
        vowelId: "sara_ao",
        toneMarkId: "mai_tho",
        toneReason: "mid class ก + mai tho → falling",
      },
    ],
  },
  // สิบ — 10. Tone: sìp (low, high + dead).
  {
    kind: "word",
    id: "sip",
    thai: "สิบ",
    rtgs: "sip",
    meaning: "ten (10)",
    register: "neutral",
    usageNote:
      "The stacking block: ยี่สิบ 20 (ยี่, not สอง!), สามสิบ 30, สามสิบห้า 35 — say the digits in place order.",
    audioKey: "words/sip",
    syllables: [
      {
        thai: "สิบ",
        rtgs: "sip",
        tone: "low",
        initialId: "so_suea",
        vowelId: "sara_i_short",
        finalId: "bo_baimai",
        toneReason: "high class ส + dead (stop final บ) → low",
      },
    ],
  },
  // ศูนย์ — 0. Tone: sǔn (rising, high + live; ย์ silent).
  {
    kind: "word",
    id: "sun",
    thai: "ศูนย์",
    rtgs: "sun",
    meaning: "zero (0)",
    literal: "also “center” — ศูนย์การค้า is a shopping center",
    register: "neutral",
    usageNote:
      "Phone numbers are read digit by digit, so ศูนย์ earns its keep fast. The ย์ is silenced by the karan mark.",
    audioKey: "words/sun",
    syllables: [
      {
        thai: "ศูนย์",
        rtgs: "sun",
        tone: "rising",
        initialId: "so_sala",
        vowelId: "sara_u_long",
        finalId: "no_nu",
        toneReason: "high class ศ + live (sonorant final น) → rising",
        note: "◌์ (karan) silences the ย; the น closes the syllable.",
      },
    ],
  },
  // ร้อย — 100. Tone: rói (high, LOW + mai tho).
  {
    kind: "word",
    id: "roi",
    thai: "ร้อย",
    rtgs: "roi",
    meaning: "hundred (100)",
    register: "neutral",
    audioKey: "words/roi",
    syllables: [
      {
        thai: "ร้อย",
        rtgs: "roi",
        tone: "high",
        initialId: "ro_ruea",
        vowelId: "sara_o_open_long",
        finalId: "yo_yak",
        toneMarkId: "mai_tho",
        toneReason: "LOW class ร + mai tho → high",
      },
    ],
  },
  // พัน — 1,000. Tone: phan (mid, low + live).
  {
    kind: "word",
    id: "phan",
    thai: "พัน",
    rtgs: "phan",
    meaning: "thousand (1,000)",
    register: "neutral",
    audioKey: "words/phan",
    syllables: [
      {
        thai: "พัน",
        rtgs: "phan",
        tone: "mid",
        initialId: "pho_phan",
        finalId: "no_nu",
        toneReason: "low class พ + live (sonorant final น) → mid",
        note: "◌ั writes a short a before the final consonant.",
      },
    ],
  },
  // บาท — baht. Tone: bàt (low, mid + dead).
  {
    kind: "word",
    id: "bat",
    thai: "บาท",
    rtgs: "bat",
    meaning: "baht (฿)",
    register: "neutral",
    usageNote:
      "Follows the number: ห้าสิบบาท “fifty baht”. Vendors often drop it — a bare สี่สิบ is still a price.",
    audioKey: "words/bat",
    syllables: [
      {
        thai: "บาท",
        rtgs: "bat",
        tone: "low",
        initialId: "bo_baimai",
        vowelId: "sara_a_long",
        finalId: "tho_thahan",
        toneReason: "mid class บ + dead (stop final ท = t) → low",
      },
    ],
  },
  // เท่าไหร่ — how much. Tones: thâo (falling) · rài (low, ห-nam + mai ek).
  {
    kind: "word",
    id: "thao_rai",
    thai: "เท่าไหร่",
    rtgs: "thao rai",
    meaning: "how much",
    literal: "“to what extent” (เท่า equal/extent + ไหร่)",
    register: "neutral",
    usageNote:
      "The price question: อันนี้เท่าไหร่ “how much is this one?”. Also written เท่าไร in formal text — same word, same tones.",
    audioKey: "words/thao_rai",
    syllables: [
      {
        thai: "เท่า",
        rtgs: "thao",
        tone: "falling",
        initialId: "tho_thahan",
        vowelId: "sara_ao",
        toneMarkId: "mai_ek",
        toneReason: "low class ท + mai ek → falling",
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
];
