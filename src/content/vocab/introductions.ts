import type { VocabWord } from "../schema";

/**
 * Introducing Yourself vocabulary (Thai Phrases unit 3). All copy is
 * original; the words are public-domain language facts. Every syllable's
 * tone is derived from the tone table in CLAUDE.md and cited in
 * `toneReason` for human review.
 *
 * Verification key per item (as comments):
 *   literal = word-for-word / etymological meaning
 *   tones   = per-syllable, in order
 *   register/particle notes where relevant
 */
export const rawIntroductionsWords: VocabWord[] = [
  // ผม — literal: "hair (of the head)" — the same word doubles as the
  // standard male "I". Tone: phǒm (rising). Register: polite default for
  // male speakers.
  {
    kind: "word",
    id: "phom",
    thai: "ผม",
    rtgs: "phom",
    meaning: "I / me (male speaker)",
    literal: "also the word for “(head) hair” — context decides",
    register: "polite",
    particleGender: "male",
    usageNote:
      "The safe, standard male “I”. Thais drop pronouns whenever context carries them — saying ผม every sentence sounds like a textbook.",
    audioKey: "words/phom",
    syllables: [
      {
        thai: "ผม",
        rtgs: "phom",
        tone: "rising",
        initialId: "pho_phueng",
        finalId: "mo_ma",
        toneReason: "high class ผ + live (sonorant final ม) → rising",
        note: "No written vowel — a short o is inherent between two consonants.",
      },
    ],
  },

  // ฉัน — literal: female / informal "I". Tone: chǎn (rising) as written;
  // ⚠ in relaxed speech it's often said mid. Register: neutral-informal;
  // the very formal female ดิฉัน exists but sounds stiff in conversation
  // (mentioned, not taught).
  {
    kind: "word",
    id: "chan",
    thai: "ฉัน",
    rtgs: "chan",
    meaning: "I / me (female or informal speaker)",
    register: "neutral",
    particleGender: "female",
    usageNote:
      "Everyday female “I” (and an informal “I” in songs and close talk regardless of gender). Written rising, often spoken mid. The ultra-formal ดิฉัน is real but stiff — announcements, not conversations.",
    audioKey: "words/chan",
    syllables: [
      {
        thai: "ฉัน",
        rtgs: "chan",
        tone: "rising",
        initialId: "cho_ching",
        finalId: "no_nu",
        toneReason: "high class ฉ + live (sonorant final น) → rising",
        note: "◌ั writes a short a before the final consonant.",
      },
    ],
  },

  // ชื่อ — literal: "name; to be named". Tone: chûe (falling).
  // Register: neutral. Works as a verb — no "is" needed.
  {
    kind: "word",
    id: "chue",
    thai: "ชื่อ",
    rtgs: "chue",
    meaning: "name / to be named",
    register: "neutral",
    usageNote:
      "A verb in disguise: ผมชื่อ… is literally “I am-named…” — no “is” anywhere. Nicknames rule daily life; ชื่อเล่น is the “play name” everyone actually uses.",
    audioKey: "words/chue",
    syllables: [
      {
        thai: "ชื่อ",
        rtgs: "chue",
        tone: "falling",
        initialId: "cho_chang",
        vowelId: "sara_ue_long",
        toneMarkId: "mai_ek",
        toneReason: "low class ช + mai ek → falling",
      },
    ],
  },

  // อะไร — literal: "what". Tones: à (low) · rai (mid). Register: neutral;
  // soften with ครับ/ค่ะ as usual.
  {
    kind: "word",
    id: "arai",
    thai: "อะไร",
    rtgs: "arai",
    meaning: "what",
    register: "neutral",
    usageNote:
      "Question words sit where the answer will go: คุณชื่ออะไร = you-name-WHAT. No word-order flip, ever. Bare อะไร? as a reply (“what?”) is as brusque as in English.",
    audioKey: "words/arai",
    syllables: [
      {
        thai: "อะ",
        rtgs: "a",
        tone: "low",
        initialId: "o_ang",
        vowelId: "sara_a_short",
        toneReason: "mid class อ + dead (short ะ, no final) → low",
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

  // มาจาก — literal: มา (come) + จาก (from). Tones: maa (mid) · jàak (low,
  // RTGS chak). Register: neutral.
  {
    kind: "word",
    id: "ma_chak",
    thai: "มาจาก",
    rtgs: "ma chak",
    meaning: "to come from",
    literal: "“come + from” (มา + จาก)",
    register: "neutral",
    usageNote:
      "The origin verb: ผมมาจากสวีเดน “I'm from Sweden”. มา alone is “come” — one of Thai's famous tone trios (มา ม้า หมา: come, horse, dog).",
    audioKey: "words/ma_chak",
    syllables: [
      {
        thai: "มา",
        rtgs: "ma",
        tone: "mid",
        initialId: "mo_ma",
        vowelId: "sara_a_long",
        toneReason: "low class ม + live (long อา, open) → mid",
      },
      {
        thai: "จาก",
        rtgs: "chak",
        tone: "low",
        initialId: "cho_chan",
        vowelId: "sara_a_long",
        finalId: "ko_kai",
        toneReason: "mid class จ + dead (stop final ก) → low",
      },
    ],
  },

  // ไหน — literal: "where / which". Tone: nǎi (rising, via ห-nam).
  // Register: neutral.
  {
    kind: "word",
    id: "nai",
    thai: "ไหน",
    rtgs: "nai",
    meaning: "where / which",
    register: "neutral",
    usageNote:
      "Attaches after what it asks about: มาจากไหน “from where?”, อันไหน “which one?”. Like อะไร, it sits where the answer will go.",
    audioKey: "words/nai",
    syllables: [
      {
        thai: "ไหน",
        rtgs: "nai",
        tone: "rising",
        initialId: "ho_hip",
        clusterIds: ["no_nu"],
        vowelId: "sara_ai_maimalai",
        toneReason: "silent ห leads น into high class — high + live (ไ◌) → rising",
        note: "ห-nam: the unsounded ห lends น its high class.",
      },
    ],
  },

  // คน — literal: "person, human"; also the classifier for people.
  // Tone: khon (mid). Register: neutral. คน + country = nationality.
  {
    kind: "word",
    id: "khon",
    thai: "คน",
    rtgs: "khon",
    meaning: "person / people",
    register: "neutral",
    usageNote:
      "คน + a place makes the person from there: คนไทย “a Thai”, คนสวีเดน “a Swede”. It's also the counting word for people — สองคน “two people”.",
    audioKey: "words/khon",
    syllables: [
      {
        thai: "คน",
        rtgs: "khon",
        tone: "mid",
        initialId: "kho_khwai",
        finalId: "no_nu",
        toneReason: "low class ค + live (sonorant final น) → mid",
        note: "No written vowel — a short o is inherent between two consonants.",
      },
    ],
  },

  // ยินดีที่ได้รู้จัก — literal: ยินดี (glad) + ที่ (that) + ได้ (got to) +
  // รู้จัก (know [a person]) = "glad to have gotten to know you".
  // Tones: yin (mid) · dii (mid) · thîi (falling) · dâi (falling) ·
  // rúu (high) · jàk (low). Register: polite — ⚠ textbook-formal; real
  // first meetings are usually a wai and สวัสดีครับ/ค่ะ.
  {
    kind: "word",
    id: "yindi_ruchak",
    thai: "ยินดีที่ได้รู้จัก",
    rtgs: "yindi thi dai ru chak",
    meaning: "nice to meet you",
    literal: "“glad that (I) got to know (you)”",
    register: "polite",
    usageNote:
      "Understand it more than you say it: it appears in introductions and formal settings, but most first meetings are simply a wai and สวัสดีครับ/ค่ะ. รู้จัก (know a person) is รู้'s social sibling.",
    audioKey: "words/yindi_ruchak",
    syllables: [
      {
        thai: "ยิน",
        rtgs: "yin",
        tone: "mid",
        initialId: "yo_yak",
        vowelId: "sara_i_short",
        finalId: "no_nu",
        toneReason: "low class ย + live (sonorant final น) → mid",
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
        thai: "ที่",
        rtgs: "thi",
        tone: "falling",
        initialId: "tho_thahan",
        vowelId: "sara_i_long",
        toneMarkId: "mai_ek",
        toneReason: "low class ท + mai ek → falling",
      },
      {
        thai: "ได้",
        rtgs: "dai",
        tone: "falling",
        initialId: "do_dek",
        vowelId: "sara_ai_maimalai",
        toneMarkId: "mai_tho",
        toneReason: "mid class ด + mai tho → falling",
      },
      {
        thai: "รู้",
        rtgs: "ru",
        tone: "high",
        initialId: "ro_ruea",
        vowelId: "sara_u_long",
        toneMarkId: "mai_tho",
        toneReason: "LOW class ร + mai tho → high",
      },
      {
        thai: "จัก",
        rtgs: "chak",
        tone: "low",
        initialId: "cho_chan",
        finalId: "ko_kai",
        toneReason: "mid class จ + dead (stop final ก) → low",
        note: "◌ั writes a short a before the final consonant.",
      },
    ],
  },
];
