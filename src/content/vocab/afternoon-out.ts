import type { VocabWord } from "../schema";

/**
 * An Afternoon Out vocabulary (Thai Phrases unit 12). The unit recombines
 * units 1–11 into longer, connected sentences; these three high-frequency
 * words are the only new items, chosen because they unlock turn-by-turn
 * directions, connected clauses, and idiomatic "less/mildly". Tones derived
 * from the CLAUDE.md tone table, cited per syllable in `toneReason`.
 */
export const rawAfternoonOutWords: VocabWord[] = [
  // เลี้ยว — to turn. Tone: líao (high, LOW class + mai tho). Vowel เ◌ีย
  // (ia) closed by the glide ว.
  {
    kind: "word",
    id: "liao",
    thai: "เลี้ยว",
    rtgs: "liao",
    meaning: "to turn",
    register: "neutral",
    usageNote:
      "เลี้ยวซ้าย turn left, เลี้ยวขวา turn right. String it after ตรงไป with แล้ว for real directions: ตรงไปแล้วเลี้ยวซ้าย.",
    audioKey: "words/liao",
    syllables: [
      {
        thai: "เลี้ยว",
        rtgs: "liao",
        tone: "high",
        initialId: "lo_ling",
        vowelId: "sara_ia",
        finalId: "wo_waen",
        toneMarkId: "mai_tho",
        toneReason: "LOW class ล + mai tho → high",
        note: "Vowel เ◌ีย (ia); the ว is the closing glide (iao).",
      },
    ],
  },

  // แล้ว — then / already. Tone: láew (high, LOW class + mai tho). Same
  // syllable already met inside แล้วคุณล่ะ; taught here as a free word with
  // its two everyday jobs.
  {
    kind: "word",
    id: "laeo",
    thai: "แล้ว",
    rtgs: "laeo",
    meaning: "then / already",
    register: "neutral",
    usageNote:
      "Two jobs, context decides. As a connector, 'then / and then': ตรงไปแล้วเลี้ยวซ้าย 'go straight, then turn left'. After a verb or adjective, 'already': กินข้าวแล้ว 'already ate', ถูกแล้ว 'that's already a good price'. You first met it inside แล้วคุณล่ะ.",
    audioKey: "words/laeo",
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
    ],
  },

  // น้อย — a little / less. Tone: nói (high, LOW class + mai tho). RTGS
  // collides with หน่อย (low) — the tone is the whole difference, and both
  // can stack: หวานน้อยหน่อย.
  {
    kind: "word",
    id: "noi_little",
    thai: "น้อย",
    rtgs: "noi",
    meaning: "a little / less",
    register: "neutral",
    usageNote:
      "Scales down whatever it follows: เผ็ดน้อย 'mildly spicy', หวานน้อย 'less sweet'. Don't confuse high-tone น้อย ('less') with low-tone หน่อย (the request softener) — they stack: ขอน้ำหวานน้อยหน่อย 'a drink, less sweet, please'.",
    audioKey: "words/noi_little",
    syllables: [
      {
        thai: "น้อย",
        rtgs: "noi",
        tone: "high",
        initialId: "no_nu",
        vowelId: "sara_o_open_long",
        finalId: "yo_yak",
        toneMarkId: "mai_tho",
        toneReason: "LOW class น + mai tho → high",
      },
    ],
  },
];
