import type { VocabWord } from "../schema";

/**
 * Time & Days vocabulary (Thai Phrases unit 8). Tones derived from the
 * CLAUDE.md tone table, cited per syllable in `toneReason`.
 */
export const rawTimeWords: VocabWord[] = [
  // วัน — day. Tone: wan (mid, low + live).
  {
    kind: "word",
    id: "wan_day",
    thai: "วัน",
    rtgs: "wan",
    meaning: "day",
    register: "neutral",
    usageNote:
      "Builds the calendar: วันนี้ today, วันจันทร์ Monday. Sounds identical to หวาน? No — หวาน rises, วัน stays level.",
    audioKey: "words/wan_day",
    syllables: [
      {
        thai: "วัน",
        rtgs: "wan",
        tone: "mid",
        initialId: "wo_waen",
        finalId: "no_nu",
        toneReason: "low class ว + live (sonorant final น) → mid",
        note: "◌ั writes a short a before the final consonant.",
      },
    ],
  },
  // พรุ่งนี้ — tomorrow. Tones: phrûng (falling) · ní (high).
  {
    kind: "word",
    id: "phrung_ni",
    thai: "พรุ่งนี้",
    rtgs: "phrung ni",
    meaning: "tomorrow",
    literal: "“the coming morning + this”",
    register: "neutral",
    usageNote:
      "Everyday “tomorrow”. เจอกันพรุ่งนี้ “see you tomorrow” — the นี้ you know from อันนี้ is doing the pointing.",
    audioKey: "words/phrung_ni",
    syllables: [
      {
        thai: "พรุ่ง",
        rtgs: "phrung",
        tone: "falling",
        initialId: "pho_phan",
        clusterIds: ["ro_ruea"],
        vowelId: "sara_u_short",
        finalId: "ngo_ngu",
        toneMarkId: "mai_ek",
        toneReason: "LOW class พ + mai ek → falling",
        note: "True พร cluster.",
      },
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
  // เมื่อวาน — yesterday. Tones: mûea (falling) · wan (mid).
  {
    kind: "word",
    id: "muea_wan",
    thai: "เมื่อวาน",
    rtgs: "muea wan",
    meaning: "yesterday",
    literal: "“the time that passed” (เมื่อ when/time + วาน)",
    register: "neutral",
    usageNote:
      "Often stretched to เมื่อวานนี้ — same meaning. The เมื่อ syllable returns in เมื่อไหร่ “when?”.",
    audioKey: "words/muea_wan",
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
        thai: "วาน",
        rtgs: "wan",
        tone: "mid",
        initialId: "wo_waen",
        vowelId: "sara_a_long",
        finalId: "no_nu",
        toneReason: "low class ว + live (sonorant final น) → mid",
      },
    ],
  },
  // กี่ — how many. Tone: kì (low, mid + mai ek).
  {
    kind: "word",
    id: "ki",
    thai: "กี่",
    rtgs: "ki",
    meaning: "how many",
    register: "neutral",
    usageNote:
      "Counts things with a classifier after it: กี่โมง what time (how many hours), กี่บาท how many baht, กี่คน how many people.",
    audioKey: "words/ki",
    syllables: [
      {
        thai: "กี่",
        rtgs: "ki",
        tone: "low",
        initialId: "ko_kai",
        vowelId: "sara_i_long",
        toneMarkId: "mai_ek",
        toneReason: "mid class ก + mai ek → low",
      },
    ],
  },
  // โมง — o'clock (daytime hours). Tone: mong (mid, low + live).
  {
    kind: "word",
    id: "mong",
    thai: "โมง",
    rtgs: "mong",
    meaning: "o'clock (daytime hour)",
    register: "neutral",
    usageNote:
      "กี่โมง “what time?” is your key phrase. Thai clocks run in six-hour blocks — โมง for day, ทุ่ม for night — locals will forgive you for using โมง everywhere.",
    audioKey: "words/mong",
    syllables: [
      {
        thai: "โมง",
        rtgs: "mong",
        tone: "mid",
        initialId: "mo_ma",
        vowelId: "sara_o_long",
        finalId: "ngo_ngu",
        toneReason: "low class ม + live (sonorant final ง) → mid",
      },
    ],
  },
  // จันทร์ — Monday (the moon). Tone: chan (mid, mid + live; ทร์ silent).
  {
    kind: "word",
    id: "chan_monday",
    thai: "จันทร์",
    rtgs: "chan",
    meaning: "Monday",
    literal: "“the Moon” — days are named for the planets",
    register: "neutral",
    usageNote:
      "Say it วันจันทร์ (day-moon). Yellow is its color — the days-of-the-week color code is real and Thais know theirs.",
    audioKey: "words/chan_monday",
    syllables: [
      {
        thai: "จันทร์",
        rtgs: "chan",
        tone: "mid",
        initialId: "cho_chan",
        finalId: "no_nu",
        toneReason: "mid class จ + live (sonorant final น) → mid",
        note: "◌ั short a; the ทร์ tail is silenced by the karan.",
      },
    ],
  },
  // เสาร์ — Saturday (Saturn). Tone: sǎo (rising, high + live; ร์ silent).
  {
    kind: "word",
    id: "sao",
    thai: "เสาร์",
    rtgs: "sao",
    meaning: "Saturday",
    literal: "“Saturn” — its color is purple",
    register: "neutral",
    audioKey: "words/sao",
    syllables: [
      {
        thai: "เสาร์",
        rtgs: "sao",
        tone: "rising",
        initialId: "so_suea",
        vowelId: "sara_ao",
        toneReason: "high class ส + live (เ◌า counts as live) → rising",
        note: "The final ร is silenced by the karan (ร์).",
      },
    ],
  },
  // อาทิตย์ — Sunday; also "week". Tones: a (mid) · thít (high).
  {
    kind: "word",
    id: "athit",
    thai: "อาทิตย์",
    rtgs: "athit",
    meaning: "Sunday / week",
    literal: "“the Sun” (Sanskrit āditya) — its color is red",
    register: "neutral",
    usageNote:
      "Does double duty: วันอาทิตย์ Sunday, but อาทิตย์หน้า “next week”. Context picks the meaning.",
    audioKey: "words/athit",
    syllables: [
      {
        thai: "อา",
        rtgs: "a",
        tone: "mid",
        initialId: "o_ang",
        vowelId: "sara_a_long",
        toneReason: "mid class อ + live (long อา, open) → mid",
      },
      {
        thai: "ทิตย์",
        rtgs: "thit",
        tone: "high",
        initialId: "tho_thahan",
        vowelId: "sara_i_short",
        finalId: "to_tao",
        toneReason: "low class ท + dead short (stop final ต) → high",
        note: "The ย์ is silenced by the karan; ต closes the syllable.",
      },
    ],
  },
];
