import type { VocabWord } from "../schema";

/**
 * Small Talk & Feelings vocabulary (Thai Phrases unit 9). Tones derived
 * from the CLAUDE.md tone table, cited per syllable in `toneReason`.
 */
export const rawFeelingsWords: VocabWord[] = [
  // ร้อน — hot. Tone: rón (high, LOW + mai tho).
  {
    kind: "word",
    id: "ron",
    thai: "ร้อน",
    rtgs: "ron",
    meaning: "hot",
    register: "neutral",
    usageNote:
      "The national weather report. ร้อนมาก covers eight months of the year — the other four are ร้อนมาก ๆ.",
    audioKey: "words/ron",
    syllables: [
      {
        thai: "ร้อน",
        rtgs: "ron",
        tone: "high",
        initialId: "ro_ruea",
        vowelId: "sara_o_open_long",
        finalId: "no_nu",
        toneMarkId: "mai_tho",
        toneReason: "LOW class ร + mai tho → high",
      },
    ],
  },
  // หนาว — cold (weather/feeling). Tone: nǎo (rising, ห-nam + live).
  {
    kind: "word",
    id: "nao",
    thai: "หนาว",
    rtgs: "nao",
    meaning: "cold (feeling)",
    register: "neutral",
    usageNote:
      "For feeling cold and cold weather. Cold things (drinks) are เย็น instead — you feel หนาว, the น้ำ is เย็น.",
    audioKey: "words/nao",
    syllables: [
      {
        thai: "หนาว",
        rtgs: "nao",
        tone: "rising",
        initialId: "ho_hip",
        clusterIds: ["no_nu"],
        vowelId: "sara_a_long",
        finalId: "wo_waen",
        toneReason: "silent ห leads น into high class — high + live → rising",
        note: "ห-nam on น; ◌าว = long a closed by the glide ว.",
      },
    ],
  },
  // มาก — very / a lot. Tone: mâk (falling, low + dead-long).
  {
    kind: "word",
    id: "mak",
    thai: "มาก",
    rtgs: "mak",
    meaning: "very / a lot",
    register: "neutral",
    usageNote:
      "The universal amplifier, always after what it amplifies: ร้อนมาก, อร่อยมาก, ขอบคุณมาก. Doubled (มาก ๆ) it turns the dial to eleven.",
    audioKey: "words/mak",
    syllables: [
      {
        thai: "มาก",
        rtgs: "mak",
        tone: "falling",
        initialId: "mo_ma",
        vowelId: "sara_a_long",
        finalId: "ko_kai",
        toneReason: "low class ม + dead long (อา + stop final ก) → falling",
      },
    ],
  },
  // หิว — hungry. Tone: hǐo (rising, high + live).
  {
    kind: "word",
    id: "hio",
    thai: "หิว",
    rtgs: "hio",
    meaning: "hungry",
    register: "neutral",
    usageNote:
      "หิวข้าว “hungry (for a meal)”, หิวน้ำ “thirsty” — hunger in Thai always says what it's hungry for. Here ห is sounded, not a silent leader.",
    audioKey: "words/hio",
    syllables: [
      {
        thai: "หิว",
        rtgs: "hio",
        tone: "rising",
        initialId: "ho_hip",
        vowelId: "sara_i_short",
        finalId: "wo_waen",
        toneReason: "high class ห + live (glide final ว) → rising",
      },
    ],
  },
  // เหนื่อย — tired. Tone: nùeai (low, ห-nam + mai ek).
  {
    kind: "word",
    id: "nueai",
    thai: "เหนื่อย",
    rtgs: "nueai",
    meaning: "tired",
    register: "neutral",
    usageNote:
      "Physical tiredness — after the market, the heat, the stairs. Sleepy is ง่วง; เหนื่อยใจ (tired at heart) is a whole other conversation.",
    audioKey: "words/nueai",
    syllables: [
      {
        thai: "เหนื่อย",
        rtgs: "nueai",
        tone: "low",
        initialId: "ho_hip",
        clusterIds: ["no_nu"],
        vowelId: "sara_uea",
        finalId: "yo_yak",
        toneMarkId: "mai_ek",
        toneReason: "silent ห leads น into high class — high + mai ek → low",
        note: "ห-nam on น; เ◌ือ + ย closes with the glide.",
      },
    ],
  },
  // ดีใจ — glad / happy. Tones: di (mid) · chai (mid). Literal "good heart".
  {
    kind: "word",
    id: "di_chai",
    thai: "ดีใจ",
    rtgs: "di chai",
    meaning: "glad / happy (about something)",
    literal: "“good heart” (ดี + ใจ)",
    register: "neutral",
    usageNote:
      "Happy about a thing that just happened: ดีใจมาก “I'm so glad!”. ใจ builds dozens of feeling words — you met เข้าใจ (enter-heart) already.",
    audioKey: "words/di_chai",
    syllables: [
      {
        thai: "ดี",
        rtgs: "di",
        tone: "mid",
        initialId: "do_dek",
        vowelId: "sara_i_long",
        toneReason: "mid class ด + live (long อี, open) → mid",
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
  // จริงเหรอ — "really?". Tones: ching (mid; silent ร) · rǒe (rising,
  // ห-nam). ⚠ casual register — for friends, not formal settings.
  {
    kind: "word",
    id: "ching_roe",
    thai: "จริงเหรอ",
    rtgs: "ching roe",
    meaning: "really? / no way!",
    literal: "“true?” (จริง true + เหรอ casual question particle)",
    register: "casual",
    usageNote:
      "Small-talk fuel — say it and the story continues. Casual: fine with friends and peers; in polite company round it up to จริงหรือครับ/คะ.",
    audioKey: "words/ching_roe",
    syllables: [
      {
        thai: "จริง",
        rtgs: "ching",
        tone: "mid",
        initialId: "cho_chan",
        clusterIds: ["ro_ruea"],
        vowelId: "sara_i_short",
        finalId: "ngo_ngu",
        toneReason: "mid class จ + live (sonorant final ง) → mid",
        note: "The ร of จร is silent — spoken “jing”, spelled จริง.",
      },
      {
        thai: "เหรอ",
        rtgs: "roe",
        tone: "rising",
        initialId: "ho_hip",
        clusterIds: ["ro_ruea"],
        vowelId: "sara_oe_long",
        toneReason: "silent ห leads ร into high class — high + live → rising",
        note: "ห-nam on ร; the informal spelling of หรือ in speech.",
      },
    ],
  },
];
