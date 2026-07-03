import type { ThaiToneMark } from "./schema";

/**
 * The four tone marks. They are quizzed by name only: the tone a mark
 * produces depends on the class of the consonant it sits on, so a fixed
 * "sound" would be wrong (that mapping is taught in the tone-rules unit).
 */
export const rawToneMarks: ThaiToneMark[] = [
  {
    kind: "tone_mark",
    id: "mai_ek",
    glyph: "◌่",
    nameThai: "ไม้เอก",
    nameRtgs: "mai ek",
    audioKey: "tone-marks/mai_ek",
    note: "On mid and high class → low tone. On low class → falling tone.",
  },
  {
    kind: "tone_mark",
    id: "mai_tho",
    glyph: "◌้",
    nameThai: "ไม้โท",
    nameRtgs: "mai tho",
    audioKey: "tone-marks/mai_tho",
    note: "On mid and high class → falling tone. On low class → high tone.",
  },
  {
    kind: "tone_mark",
    id: "mai_tri",
    glyph: "◌๊",
    nameThai: "ไม้ตรี",
    nameRtgs: "mai tri",
    audioKey: "tone-marks/mai_tri",
    note: "High tone. In practice appears almost only on mid-class consonants.",
  },
  {
    kind: "tone_mark",
    id: "mai_chattawa",
    glyph: "◌๋",
    nameThai: "ไม้จัตวา",
    nameRtgs: "mai chattawa",
    audioKey: "tone-marks/mai_chattawa",
    note: "Rising tone. In practice appears almost only on mid-class consonants.",
  },
];
