import type { VocabWord } from "../schema";

/**
 * Greetings & Politeness vocabulary. All copy is original; words themselves
 * are public-domain language facts. Every syllable's tone is derived from
 * the tone table in CLAUDE.md and cited in `toneReason` for human review.
 *
 * Verification key per item (as comments):
 *   literal = word-for-word / etymological meaning
 *   tones   = per-syllable, in order
 *   register/particle notes where relevant
 */
export const rawGreetingsWords: VocabWord[] = [
  // สวัสดี — literal: from Sanskrit "svasti" (well-being, good fortune),
  // coined as the standard greeting in the 1930s. Tones: sà (low) ·
  // wàt (low) · dii (mid). Register: the neutral-polite default greeting,
  // used for both hello and goodbye; add ครับ/ค่ะ in almost every situation.
  {
    kind: "word",
    id: "sawatdi",
    thai: "สวัสดี",
    rtgs: "sawatdi",
    meaning: "hello / goodbye",
    literal: "from Sanskrit svasti — “well-being”",
    register: "polite",
    usageNote:
      "The all-purpose greeting and farewell. Nearly always followed by ครับ or ค่ะ — bare สวัสดี can sound abrupt with strangers.",
    audioKey: "words/sawatdi",
    syllables: [
      {
        thai: "ส",
        rtgs: "sa",
        tone: "low",
        initialId: "so_suea",
        toneReason: "high class ส + dead (unwritten short a) → low",
        note: "No written vowel — a lone consonant is read with a short a.",
      },
      {
        thai: "วัส",
        rtgs: "wat",
        tone: "low",
        initialId: "so_suea",
        clusterIds: ["wo_waen"],
        finalId: "so_suea",
        toneReason:
          "the ส before ว leads this syllable — high class + dead (stop final ส = t) → low",
        note: "◌ั writes a short a before a final consonant. Final ส is read t.",
      },
      {
        thai: "ดี",
        rtgs: "di",
        tone: "mid",
        initialId: "do_dek",
        vowelId: "sara_i_long",
        toneReason: "mid class ด + live (long อี, open) → mid",
      },
    ],
  },

  // ครับ — literal: male polite particle (no lexical meaning). Tone:
  // kráp (high). Register: ends almost every polite sentence a man says;
  // doubles as "yes". Spoken fast it often becomes "kháp".
  {
    kind: "word",
    id: "khrap",
    thai: "ครับ",
    rtgs: "khrap",
    meaning: "polite particle (male speaker)",
    register: "polite",
    particleGender: "male",
    usageNote:
      "Men end polite sentences with ครับ — statements and questions alike. Alone it means “yes” or “I hear you”. In fast speech the ร drops: “kháp”.",
    audioKey: "words/khrap",
    syllables: [
      {
        thai: "ครับ",
        rtgs: "khrap",
        tone: "high",
        initialId: "kho_khwai",
        clusterIds: ["ro_ruea"],
        finalId: "bo_baimai",
        toneReason: "low class ค + dead short (◌ั + stop final บ = p) → high",
        note: "คร is a true cluster — the low-class ค governs the tone.",
      },
    ],
  },

  // ค่ะ — literal: female polite particle. Tone: khâ (falling).
  // Register: ends statements. Contrast คะ (high) for questions —
  // that pair is drilled as a tone minimal pair.
  {
    kind: "word",
    id: "kha_statement",
    thai: "ค่ะ",
    rtgs: "kha",
    meaning: "polite particle (female speaker, statements)",
    register: "polite",
    particleGender: "female",
    usageNote:
      "Women end polite statements with falling-tone ค่ะ. Its sibling คะ (high tone) goes on questions — same syllable, different tone, different job.",
    audioKey: "words/kha_statement",
    syllables: [
      {
        thai: "ค่ะ",
        rtgs: "kha",
        tone: "falling",
        initialId: "kho_khwai",
        vowelId: "sara_a_short",
        toneMarkId: "mai_ek",
        toneReason: "low class ค + mai ek → falling",
      },
    ],
  },

  // คะ — literal: female polite particle. Tone: khá (high).
  // Register: ends questions and softens requests.
  {
    kind: "word",
    id: "kha_question",
    thai: "คะ",
    rtgs: "kha",
    meaning: "polite particle (female speaker, questions)",
    register: "polite",
    particleGender: "female",
    usageNote:
      "The question-final twin of ค่ะ. สบายดีไหมคะ — high tone. Mixing the two up is the classic learner giveaway, so train the ear on it.",
    audioKey: "words/kha_question",
    syllables: [
      {
        thai: "คะ",
        rtgs: "kha",
        tone: "high",
        initialId: "kho_khwai",
        vowelId: "sara_a_short",
        toneReason: "low class ค + dead short (ะ, no final) → high",
      },
    ],
  },

  // หวัดดี — literal: clipped สวัสดี (the ส is dropped). Tones: wàt (low) ·
  // dii (mid). Register: casual — friends, peers, chat messages. Not for
  // officials, elders, or first meetings.
  {
    kind: "word",
    id: "wat_di",
    thai: "หวัดดี",
    rtgs: "watdi",
    meaning: "hi (casual)",
    literal: "สวัสดี with the first syllable clipped off",
    register: "casual",
    usageNote:
      "What friends actually say (and type). Fine with peers; too breezy for your boss, officials, or anyone you’d wai.",
    audioKey: "words/wat_di",
    syllables: [
      {
        thai: "หวัด",
        rtgs: "wat",
        tone: "low",
        initialId: "ho_hip",
        clusterIds: ["wo_waen"],
        finalId: "do_dek",
        toneReason:
          "silent ห leads ว into high class — high + dead (stop final ด = t) → low",
        note: "ห-nam: the unsounded ห lends ว its high class.",
      },
      {
        thai: "ดี",
        rtgs: "di",
        tone: "mid",
        initialId: "do_dek",
        vowelId: "sara_i_long",
        toneReason: "mid class ด + live (long อี, open) → mid",
      },
    ],
  },

  // ขอบคุณ — literal: ขอบ (edge/rim; here from ขอบใจ tradition, “to return
  // a favor”) + คุณ (goodness/you) ≈ “I acknowledge your goodness”.
  // Tones: khòp (low) · khun (mid). Register: standard thank-you.
  {
    kind: "word",
    id: "khop_khun",
    thai: "ขอบคุณ",
    rtgs: "khop khun",
    meaning: "thank you",
    literal: "≈ “acknowledge your goodness” (ขอบ + คุณ)",
    register: "polite",
    usageNote:
      "The everyday thank-you. ขอบคุณครับ/ค่ะ with strangers; friends often just say ขอบใจ. A wai is added only for real gratitude or seniors.",
    audioKey: "words/khop_khun",
    syllables: [
      {
        thai: "ขอบ",
        rtgs: "khop",
        tone: "low",
        initialId: "kho_khai",
        vowelId: "sara_o_open_long",
        finalId: "bo_baimai",
        toneReason: "high class ข + dead (stop final บ = p) → low",
      },
      {
        thai: "คุณ",
        rtgs: "khun",
        tone: "mid",
        initialId: "kho_khwai",
        vowelId: "sara_u_short",
        finalId: "no_nen",
        toneReason: "low class ค + live (sonorant final ณ = n) → mid",
      },
    ],
  },

  // ขอโทษ — literal: ขอ (to ask for) + โทษ (blame/punishment) =
  // “I ask for the blame”. Tones: khǒ (rising) · thôt (falling).
  // Register: both “sorry” and “excuse me” (getting attention, squeezing past).
  {
    kind: "word",
    id: "kho_thot",
    thai: "ขอโทษ",
    rtgs: "kho thot",
    meaning: "sorry / excuse me",
    literal: "“ask for the blame” (ขอ + โทษ)",
    register: "polite",
    usageNote:
      "Covers apologies and “excuse me” — brushing past someone at the market, flagging a waiter. ขอโทษครับ/ค่ะ is the full polite form.",
    audioKey: "words/kho_thot",
    syllables: [
      {
        thai: "ขอ",
        rtgs: "kho",
        tone: "rising",
        initialId: "kho_khai",
        vowelId: "sara_o_open_long",
        toneReason: "high class ข + live (long ออ, open) → rising",
      },
      {
        thai: "โทษ",
        rtgs: "thot",
        tone: "falling",
        initialId: "tho_thahan",
        vowelId: "sara_o_long",
        finalId: "so_ruesi",
        toneReason: "low class ท + dead long (โ◌ + stop final ษ = t) → falling",
        note: "Final ษ is read t — one of the many s-letters that close as t.",
      },
    ],
  },

  // ไม่เป็นไร — literal: ไม่ (not) + เป็น (to be) + ไร (anything) =
  // “it is nothing”. Tones: mâi (falling) · pen (mid) · rai (mid).
  // Register: neutral; the standard reply to thanks and apologies.
  {
    kind: "word",
    id: "mai_pen_rai",
    thai: "ไม่เป็นไร",
    rtgs: "mai pen rai",
    meaning: "never mind / you're welcome / it's okay",
    literal: "“it is nothing” (not + be + anything)",
    register: "neutral",
    usageNote:
      "The reply to both ขอบคุณ and ขอโทษ — and a whole philosophy of letting things slide. Someone spills your coffee? ไม่เป็นไร.",
    audioKey: "words/mai_pen_rai",
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
      {
        thai: "เป็น",
        rtgs: "pen",
        tone: "mid",
        initialId: "po_pla",
        vowelId: "sara_e_short",
        finalId: "no_nu",
        toneReason: "mid class ป + live (sonorant final น = n) → mid",
        note: "◌็ (mai taikhu) shortens the เ◌ vowel before the final.",
      },
      {
        thai: "ไร",
        rtgs: "rai",
        tone: "mid",
        initialId: "ro_ruea",
        vowelId: "sara_ai_maimalai",
        toneReason: "low class ร + live (ไ◌ counts as live) → mid",
      },
    ],
  },

  // สบายดี — literal: สบาย (comfortable, at ease) + ดี (good) =
  // “comfortably well”. Tones: sà (low) · baai (mid) · dii (mid).
  // Register: neutral; the stock answer to “how are you?”.
  {
    kind: "word",
    id: "sabai_di",
    thai: "สบายดี",
    rtgs: "sabai di",
    meaning: "fine / doing well",
    literal: "“comfortably good” (สบาย + ดี)",
    register: "neutral",
    usageNote:
      "The default answer to สบายดีไหม. สบาย alone is the deep Thai concept of easy comfort — สบาย ๆ means “totally relaxed”.",
    audioKey: "words/sabai_di",
    syllables: [
      {
        thai: "ส",
        rtgs: "sa",
        tone: "low",
        initialId: "so_suea",
        toneReason: "high class ส + dead (unwritten short a) → low",
        note: "No written vowel — read with a short a.",
      },
      {
        thai: "บาย",
        rtgs: "bai",
        tone: "mid",
        initialId: "bo_baimai",
        vowelId: "sara_a_long",
        finalId: "yo_yak",
        toneReason: "mid class บ + live (glide final ย) → mid",
      },
      {
        thai: "ดี",
        rtgs: "di",
        tone: "mid",
        initialId: "do_dek",
        vowelId: "sara_i_long",
        toneReason: "mid class ด + live (long อี, open) → mid",
      },
    ],
  },

  // สบายดีไหม — literal: “well + question particle” = “are you well?”.
  // Tones: sà (low) · baai (mid) · dii (mid) · mǎi (rising).
  // Register: neutral. ไหม is written rising; in fast speech it's often
  // said as มั้ย (high) — the writing stays ไหม.
  {
    kind: "word",
    id: "sabai_di_mai",
    thai: "สบายดีไหม",
    rtgs: "sabai di mai",
    meaning: "how are you?",
    literal: "“are you well?” — สบายดี + question particle ไหม",
    register: "neutral",
    usageNote:
      "The textbook “how are you”. Real conversations often open with กินข้าวหรือยัง instead. Spoken fast, ไหม comes out as high-tone มั้ย.",
    audioKey: "words/sabai_di_mai",
    syllables: [
      {
        thai: "ส",
        rtgs: "sa",
        tone: "low",
        initialId: "so_suea",
        toneReason: "high class ส + dead (unwritten short a) → low",
        note: "No written vowel — read with a short a.",
      },
      {
        thai: "บาย",
        rtgs: "bai",
        tone: "mid",
        initialId: "bo_baimai",
        vowelId: "sara_a_long",
        finalId: "yo_yak",
        toneReason: "mid class บ + live (glide final ย) → mid",
      },
      {
        thai: "ดี",
        rtgs: "di",
        tone: "mid",
        initialId: "do_dek",
        vowelId: "sara_i_long",
        toneReason: "mid class ด + live (long อี, open) → mid",
      },
      {
        thai: "ไหม",
        rtgs: "mai",
        tone: "rising",
        initialId: "ho_hip",
        clusterIds: ["mo_ma"],
        vowelId: "sara_ai_maimalai",
        toneReason: "silent ห leads ม into high class — high + live (ไ◌) → rising",
        note: "ห-nam again: the ห is silent but sets the class.",
      },
    ],
  },

  // กินข้าวหรือยัง — literal: “eaten rice yet?” — the warm, everyday
  // “how's it going?”. Tones: kin (mid) · khâo (falling) · rǔe (rising) ·
  // yang (mid). Register: casual-neutral; for people you already know.
  {
    kind: "word",
    id: "kin_khao_rue_yang",
    thai: "กินข้าวหรือยัง",
    rtgs: "kin khao rue yang",
    meaning: "have you eaten yet? (a common greeting)",
    literal: "“eaten rice yet?” — rice stands in for food itself",
    register: "casual",
    usageNote:
      "How Thais actually ask “how are you” — caring about whether you've eaten. Expected answers: กินแล้ว (“already ate”) or ยัง (“not yet”), never a literal menu report.",
    audioKey: "words/kin_khao_rue_yang",
    syllables: [
      {
        thai: "กิน",
        rtgs: "kin",
        tone: "mid",
        initialId: "ko_kai",
        vowelId: "sara_i_short",
        finalId: "no_nu",
        toneReason: "mid class ก + live (sonorant final น) → mid",
      },
      {
        thai: "ข้าว",
        rtgs: "khao",
        tone: "falling",
        initialId: "kho_khai",
        vowelId: "sara_a_long",
        finalId: "wo_waen",
        toneMarkId: "mai_tho",
        toneReason: "high class ข + mai tho → falling",
        note: "◌าว = long a closed by the glide ว (ao).",
      },
      {
        thai: "หรือ",
        rtgs: "rue",
        tone: "rising",
        initialId: "ho_hip",
        clusterIds: ["ro_ruea"],
        vowelId: "sara_ue_long",
        toneReason: "silent ห leads ร into high class — high + live (long อือ) → rising",
        note: "ห-nam on ร.",
      },
      {
        thai: "ยัง",
        rtgs: "yang",
        tone: "mid",
        initialId: "yo_yak",
        finalId: "ngo_ngu",
        toneReason: "low class ย + live (sonorant final ง = ng) → mid",
        note: "◌ั writes the short a before the final.",
      },
    ],
  },

  // แล้วคุณล่ะ — literal: แล้ว (then/and) + คุณ (you) + ล่ะ (softening
  // particle) = “and you?”. Tones: láew (high) · khun (mid) · lâ (falling).
  // Register: neutral; bounce any question back.
  {
    kind: "word",
    id: "laeo_khun_la",
    thai: "แล้วคุณล่ะ",
    rtgs: "laeo khun la",
    meaning: "and you?",
    literal: "“then, you…?” (แล้ว + คุณ + ล่ะ)",
    register: "neutral",
    usageNote:
      "Bounces a question back: สบายดีครับ แล้วคุณล่ะ. With friends, swap คุณ for a name or drop it entirely — แล้วเธอล่ะ.",
    audioKey: "words/laeo_khun_la",
    syllables: [
      {
        thai: "แล้ว",
        rtgs: "laeo",
        tone: "high",
        initialId: "lo_ling",
        vowelId: "sara_ae_long",
        finalId: "wo_waen",
        toneMarkId: "mai_tho",
        toneReason: "LOW class ล + mai tho → high",
      },
      {
        thai: "คุณ",
        rtgs: "khun",
        tone: "mid",
        initialId: "kho_khwai",
        vowelId: "sara_u_short",
        finalId: "no_nen",
        toneReason: "low class ค + live (sonorant final ณ = n) → mid",
      },
      {
        thai: "ล่ะ",
        rtgs: "la",
        tone: "falling",
        initialId: "lo_ling",
        vowelId: "sara_a_short",
        toneMarkId: "mai_ek",
        toneReason: "LOW class ล + mai ek → falling",
      },
    ],
  },

  // ลาก่อน — literal: ลา (to take leave) + ก่อน (first/before) =
  // “I take my leave first”. Tones: laa (mid) · kòn (low).
  // Register: formal-ish, slightly final — parting for a long time.
  {
    kind: "word",
    id: "la_kon",
    thai: "ลาก่อน",
    rtgs: "la kon",
    meaning: "goodbye (parting for a while)",
    literal: "“(I) take leave first” (ลา + ก่อน)",
    register: "formal",
    usageNote:
      "Carries weight — a real farewell, not an everyday “bye”. Day to day, Thais close with สวัสดีครับ/ค่ะ or a casual ไปก่อนนะ (“I'm off”).",
    audioKey: "words/la_kon",
    syllables: [
      {
        thai: "ลา",
        rtgs: "la",
        tone: "mid",
        initialId: "lo_ling",
        vowelId: "sara_a_long",
        toneReason: "low class ล + live (long อา, open) → mid",
      },
      {
        thai: "ก่อน",
        rtgs: "kon",
        tone: "low",
        initialId: "ko_kai",
        vowelId: "sara_o_open_long",
        finalId: "no_nu",
        toneMarkId: "mai_ek",
        toneReason: "mid class ก + mai ek → low",
      },
    ],
  },

  // คุณ — literal: goodness/virtue; as a pronoun, the polite “you”
  // (also Mr./Ms. before names). Tone: khun (mid). Register: polite.
  {
    kind: "word",
    id: "khun",
    thai: "คุณ",
    rtgs: "khun",
    meaning: "you (polite); Mr./Ms.",
    literal: "“goodness, virtue” — extended to a respectful “you”",
    register: "polite",
    usageNote:
      "Safe, polite “you” for strangers and equals; also a title: คุณสมชาย ≈ Mr. Somchai. Friends prefer names or kin terms (พี่/น้อง) over คุณ.",
    audioKey: "words/khun",
    syllables: [
      {
        thai: "คุณ",
        rtgs: "khun",
        tone: "mid",
        initialId: "kho_khwai",
        vowelId: "sara_u_short",
        finalId: "no_nen",
        toneReason: "low class ค + live (sonorant final ณ = n) → mid",
      },
    ],
  },
];
