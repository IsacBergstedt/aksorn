import type { VocabWord } from "../schema";

/**
 * Shopping & Prices vocabulary (Thai Phrases unit 6). Tones derived from
 * the CLAUDE.md tone table, cited per syllable in `toneReason`.
 */
export const rawShoppingWords: VocabWord[] = [
  // อัน — classifier "one/thing". Tone: an (mid, mid + live).
  {
    kind: "word",
    id: "an",
    thai: "อัน",
    rtgs: "an",
    meaning: "one / thing (general classifier)",
    register: "neutral",
    usageNote:
      "The pointer word: อันนี้ “this one”, อันไหน “which one?”. Technically each noun has its own classifier — อัน is the safe fallback for small things.",
    audioKey: "words/an",
    syllables: [
      {
        thai: "อัน",
        rtgs: "an",
        tone: "mid",
        initialId: "o_ang",
        finalId: "no_nu",
        toneReason: "mid class อ + live (sonorant final น) → mid",
        note: "◌ั writes a short a before the final consonant.",
      },
    ],
  },
  // นี้ — this. Tone: ní (high, LOW + mai tho).
  {
    kind: "word",
    id: "ni_this",
    thai: "นี้",
    rtgs: "ni",
    meaning: "this",
    register: "neutral",
    usageNote:
      "Follows what it points at: อันนี้ “this one”, วันนี้ “today (this day)”. Its sibling นี่ (falling) stands alone as “this here”.",
    audioKey: "words/ni_this",
    syllables: [
      {
        thai: "นี้",
        rtgs: "ni",
        tone: "high",
        initialId: "no_nu",
        vowelId: "sara_i_long",
        toneMarkId: "mai_tho",
        toneReason: "LOW class น + mai tho → high",
      },
    ],
  },
  // แพง — expensive. Tone: phaeng (mid, low + live).
  {
    kind: "word",
    id: "phaeng",
    thai: "แพง",
    rtgs: "phaeng",
    meaning: "expensive",
    register: "neutral",
    usageNote:
      "Blurting แพง! at a vendor is haggling theater — normal at a market, eyebrow-raising in a mall. Pair it with a smile.",
    audioKey: "words/phaeng",
    syllables: [
      {
        thai: "แพง",
        rtgs: "phaeng",
        tone: "mid",
        initialId: "pho_phan",
        vowelId: "sara_ae_long",
        finalId: "ngo_ngu",
        toneReason: "low class พ + live (sonorant final ง) → mid",
      },
    ],
  },
  // ถูก — cheap (also "correct"). Tone: thùk (low, high + dead).
  {
    kind: "word",
    id: "thuk",
    thai: "ถูก",
    rtgs: "thuk",
    meaning: "cheap",
    literal: "also “correct, right” — context decides",
    register: "neutral",
    usageNote:
      "Double life: ถูก is both “cheap” and “correct”. ของถูก cheap stuff, ตอบถูก answered right. Context (and a price tag) disambiguates.",
    audioKey: "words/thuk",
    syllables: [
      {
        thai: "ถูก",
        rtgs: "thuk",
        tone: "low",
        initialId: "tho_thung",
        vowelId: "sara_u_long",
        finalId: "ko_kai",
        toneReason: "high class ถ + dead (stop final ก) → low",
      },
    ],
  },
  // มี — to have. Tone: mi (mid, low + live).
  {
    kind: "word",
    id: "mi",
    thai: "มี",
    rtgs: "mi",
    meaning: "to have / there is",
    register: "neutral",
    usageNote:
      "Both “have” and “there is”: มีน้ำไหม “is there water?”. Answered Thai-style with the verb: มี or ไม่มี.",
    audioKey: "words/mi",
    syllables: [
      {
        thai: "มี",
        rtgs: "mi",
        tone: "mid",
        initialId: "mo_ma",
        vowelId: "sara_i_long",
        toneReason: "low class ม + live (long อี, open) → mid",
      },
    ],
  },
  // ไหม — yes/no question particle. Tone: mǎi (rising, ห-nam + live).
  // Already met by ear in สบายดีไหม and the mai_set tone drill.
  {
    kind: "word",
    id: "mai_question",
    thai: "ไหม",
    rtgs: "mai",
    meaning: "yes/no question particle",
    register: "neutral",
    usageNote:
      "The question machine: statement + ไหม = question. มีน้ำ “there's water” → มีน้ำไหม “is there water?”. Spoken fast it becomes high-tone มั้ย; the writing stays ไหม.",
    audioKey: "words/mai_question",
    syllables: [
      {
        thai: "ไหม",
        rtgs: "mai",
        tone: "rising",
        initialId: "ho_hip",
        clusterIds: ["mo_ma"],
        vowelId: "sara_ai_maimalai",
        toneReason: "silent ห leads ม into high class — high + live (ไ◌) → rising",
        note: "ห-nam on ม.",
      },
    ],
  },
  // ลด — to reduce / discount. Tone: lót (high, low + dead-short).
  {
    kind: "word",
    id: "lot",
    thai: "ลด",
    rtgs: "lot",
    meaning: "to lower / to discount",
    register: "neutral",
    usageNote:
      "The bargaining verb: ลดหน่อยได้ไหม “could you come down a bit?”. ลดราคา on a sign means SALE.",
    audioKey: "words/lot",
    syllables: [
      {
        thai: "ลด",
        rtgs: "lot",
        tone: "high",
        initialId: "lo_ling",
        finalId: "do_dek",
        toneReason: "low class ล + dead short (inherent o + stop final ด) → high",
        note: "No written vowel — a short o is inherent between two consonants.",
      },
    ],
  },
];
