import type { VocabWord } from "../schema";

/**
 * Ordering Food & Drink vocabulary (Thai Phrases unit 5). Tones derived
 * from the CLAUDE.md tone table, cited per syllable in `toneReason`.
 */
export const rawFoodWords: VocabWord[] = [
  // ขอ — "may I have". Tone: khǒ (rising, high + live). Same syllable that
  // opens ขอโทษ.
  {
    kind: "word",
    id: "kho",
    thai: "ขอ",
    rtgs: "kho",
    meaning: "may I have… / please give me…",
    literal: "“to ask for” — the same ขอ as in ขอโทษ",
    register: "polite",
    usageNote:
      "The ordering verb: ขอ + thing (+ หน่อย) + ครับ/ค่ะ is automatically polite — Thai rarely needs a separate “please”.",
    audioKey: "words/kho",
    syllables: [
      {
        thai: "ขอ",
        rtgs: "kho",
        tone: "rising",
        initialId: "kho_khai",
        vowelId: "sara_o_open_long",
        toneReason: "high class ข + live (long ออ, open) → rising",
      },
    ],
  },
  // ข้าว — rice / a meal. Tone: khâo (falling, high + mai tho). Same
  // syllable as in กินข้าวหรือยัง.
  {
    kind: "word",
    id: "khao_rice",
    thai: "ข้าว",
    rtgs: "khao",
    meaning: "rice / a meal",
    register: "neutral",
    usageNote:
      "Rice stands in for food itself: กินข้าว is “to eat (anything)”, หิวข้าว is plain “hungry”. The grain runs the language.",
    audioKey: "words/khao_rice",
    syllables: [
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
    ],
  },
  // น้ำ — water. Tone: nám (high, LOW + mai tho); spoken with a long vowel.
  {
    kind: "word",
    id: "nam",
    thai: "น้ำ",
    rtgs: "nam",
    meaning: "water / drink",
    register: "neutral",
    usageNote:
      "Spelled short (◌ำ) but spoken long: náam. It prefixes every drink — น้ำ + fruit = juice of that fruit.",
    audioKey: "words/nam",
    syllables: [
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
  // กิน — to eat. Tone: kin (mid, mid + live). Casual-neutral; ทาน is the
  // dressier table word.
  {
    kind: "word",
    id: "kin",
    thai: "กิน",
    rtgs: "kin",
    meaning: "to eat / to drink (casually)",
    register: "neutral",
    usageNote:
      "Everyday eat-and-drink verb. Polite menus and hosts say ทาน (than) instead — understand both, say กิน with friends.",
    audioKey: "words/kin",
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
    ],
  },
  // อร่อย — delicious. Tones: à (low) · ròi (low, อ-nam: อ leads ร into
  // mid class + mai ek → low).
  {
    kind: "word",
    id: "aroi",
    thai: "อร่อย",
    rtgs: "aroi",
    meaning: "delicious",
    register: "neutral",
    usageNote:
      "The compliment every cook wants. อร่อยมาก = very tasty; หรอย in the south, ลำ up north — อร่อย works everywhere.",
    audioKey: "words/aroi",
    syllables: [
      {
        thai: "อ",
        rtgs: "a",
        tone: "low",
        initialId: "o_ang",
        toneReason: "mid class อ + dead (unwritten short a) → low",
        note: "No written vowel — a lone consonant is read with a short a.",
      },
      {
        thai: "ร่อย",
        rtgs: "roi",
        tone: "low",
        initialId: "o_ang",
        clusterIds: ["ro_ruea"],
        vowelId: "sara_o_open_long",
        finalId: "yo_yak",
        toneMarkId: "mai_ek",
        toneReason:
          "the อ before ร leads this syllable — mid class + mai ek → low",
        note: "อักษรนำ with อ: like ห-nam, the leader donates its class to ร.",
      },
    ],
  },
  // เผ็ด — spicy. Tone: phèt (low, high + dead).
  {
    kind: "word",
    id: "phet",
    thai: "เผ็ด",
    rtgs: "phet",
    meaning: "spicy",
    register: "neutral",
    usageNote:
      "Self-defense vocabulary: ไม่เผ็ด “not spicy” — and know that street-stall “not spicy” is still spicy. เผ็ดน้อย is the realistic ask.",
    audioKey: "words/phet",
    syllables: [
      {
        thai: "เผ็ด",
        rtgs: "phet",
        tone: "low",
        initialId: "pho_phueng",
        vowelId: "sara_e_short",
        finalId: "do_dek",
        toneReason: "high class ผ + dead (stop final ด) → low",
        note: "◌็ (mai taikhu) marks the เ◌ vowel short before the final.",
      },
    ],
  },
  // หวาน — sweet. Tone: wǎn (rising, ห-nam + live).
  {
    kind: "word",
    id: "wan_sweet",
    thai: "หวาน",
    rtgs: "wan",
    meaning: "sweet",
    register: "neutral",
    usageNote:
      "Thai drinks default to very sweet — หวานน้อย “lightly sweet” is the phrase that saves your teeth.",
    audioKey: "words/wan_sweet",
    syllables: [
      {
        thai: "หวาน",
        rtgs: "wan",
        tone: "rising",
        initialId: "ho_hip",
        clusterIds: ["wo_waen"],
        vowelId: "sara_a_long",
        finalId: "no_nu",
        toneReason: "silent ห leads ว into high class — high + live → rising",
        note: "ห-nam on ว.",
      },
    ],
  },
  // หน่อย — "a little", the request softener. Tone: nòi (low, ห-nam +
  // mai ek).
  {
    kind: "word",
    id: "noi",
    thai: "หน่อย",
    rtgs: "noi",
    meaning: "a little / just a bit (softener)",
    register: "polite",
    usageNote:
      "Tacked onto requests to shrink them: ขอน้ำหน่อย ≈ “could I just get some water”. Not literal quantity — pure politeness padding.",
    audioKey: "words/noi",
    syllables: [
      {
        thai: "หน่อย",
        rtgs: "noi",
        tone: "low",
        initialId: "ho_hip",
        clusterIds: ["no_nu"],
        vowelId: "sara_o_open_long",
        finalId: "yo_yak",
        toneMarkId: "mai_ek",
        toneReason: "silent ห leads น into high class — high + mai ek → low",
        note: "ห-nam on น.",
      },
    ],
  },
];
