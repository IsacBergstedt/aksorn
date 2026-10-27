import type { Syllable, Tone, VocabWord } from "../schema";
import { rawCharacters } from "../characters";

const consonant = (glyph: string) => {
  const item = rawCharacters.find(c => c.glyph === glyph);
  if (!item) throw new Error(`Unknown core consonant ${glyph}`);
  return item;
};

type Rule = "live" | "dead-short" | "dead-long" | "mai_ek" | "mai_tho";
function syllable(thai: string, rtgs: string, initial: string, rule: Rule,
  vowel?: string, final?: string, cluster?: string): Syllable {
  const c = consonant(initial);
  const tone: Tone = rule === "mai_ek" ? (c.class === "low" ? "falling" : "low")
    : rule === "mai_tho" ? (c.class === "low" ? "high" : "falling")
    : rule === "live" ? (c.class === "high" ? "rising" : "mid")
    : c.class === "low" ? (rule === "dead-short" ? "high" : "falling") : "low";
  return { thai, rtgs, tone, initialId: c.id,
    ...(vowel ? { vowelId: vowel } : {}),
    ...(final ? { finalId: consonant(final).id } : {}),
    ...(cluster ? { clusterIds: [consonant(cluster).id] } : {}),
    ...(["mai_ek", "mai_tho"].includes(rule) ? { toneMarkId: rule } : {}),
    toneReason: `${c.class} class ${initial}${cluster ? ` leading ${cluster}` : ""} + ${rule.replaceAll("-", " ")} → ${tone}`,
  };
}

// Original definitions and pronunciation analysis. Corpus rank/count metadata
// lives separately in core-frequency.json. Reuse shipped word IDs elsewhere.
function word(id: string, thai: string, rtgs: string, meaning: string,
  initial: string, rule: Rule, vowel?: string, final?: string, cluster?: string,
  usageNote?: string): VocabWord {
  return { kind: "word", id: `core_${id}`, thai, rtgs, meaning, register: "neutral",
    audioKey: `words/core_${id}`, syllables: [syllable(thai, rtgs, initial, rule, vowel, final, cluster)],
    ...(usageNote ? { usageNote } : {}) };
}

export const rawCoreWords: VocabWord[] = [
  word("pen", "เป็น", "pen", "to be (identity, role, or state)", "ป", "live", "sara_e_short", "น"),
  word("nai_in", "ใน", "nai", "in / inside", "น", "live", "sara_ai_maimuan"),
  word("khong", "ของ", "khong", "of / belonging to", "ข", "live", "sara_o_open_long", "ง"),
  word("cha", "จะ", "cha", "will / going to", "จ", "dead-short", "sara_a_short"),
  word("lae", "และ", "lae", "and", "ล", "dead-short", "sara_ae_short"),
  word("hai", "ให้", "hai", "to give / for someone", "ห", "mai_tho", "sara_ai_maimuan"),
  word("wa", "ว่า", "wa", "to say / think; that (introduces a statement)", "ว", "mai_ek", "sara_a_long"),
  word("ma", "มา", "ma", "to come", "ม", "live", "sara_a_long"),
  word("kap", "กับ", "kap", "with", "ก", "dead-short", undefined, "บ"),
  word("rue", "หรือ", "rue", "or", "ห", "live", "sara_ue_long", undefined, "ร"),
  word("chak", "จาก", "chak", "from", "จ", "dead-long", "sara_a_long", "ก"),
  word("kan", "กัน", "kan", "together / one another", "ก", "live", undefined, "น"),
  word("tae", "แต่", "tae", "but", "ต", "mai_ek", "sara_ae_long"),
  word("tong", "ต้อง", "tong", "must / have to", "ต", "mai_tho", "sara_o_open_long", "ง"),
  word("duai", "ด้วย", "duai", "too / as well", "ด", "mai_tho", "sara_ua", "ย"),
  word("khao_he", "เขา", "khao", "he / she / they (another person)", "ข", "live", "sara_ao"),
  word("nan", "นั้น", "nan", "that (after a noun)", "น", "mai_tho", undefined, "น"),
  word("chai_use", "ใช้", "chai", "to use", "ช", "mai_tho", "sara_ai_maimalai"),
  word("rao", "เรา", "rao", "we / us", "ร", "live", "sara_ao"),
  word("yang", "ยัง", "yang", "still / yet", "ย", "live", undefined, "ง"),
  word("tham", "ทำ", "tham", "to do / make", "ท", "live", "sara_am"),
  word("ik", "อีก", "ik", "more / again", "อ", "dead-long", "sara_i_long", "ก"),
  word("phro", "เพราะ", "phro", "because", "พ", "dead-short", "sara_o_open_short", undefined, "ร"),
  word("di", "ดี", "di", "good / well", "ด", "live", "sara_i_long"),
  word("ok", "ออก", "ok", "out / to go out", "อ", "dead-long", "sara_o_open_long", "ก"),
  word("khue", "คือ", "khue", "is / means (identifies or defines)", "ค", "live", "sara_ue_long"),
  word("hen", "เห็น", "hen", "to see", "ห", "live", "sara_e_short", "น"),
  word("thai", "ไทย", "thai", "Thai / Thailand (in context)", "ท", "live", "sara_ai_maimalai", "ย"),
  word("pi", "ปี", "pi", "year", "ป", "live", "sara_i_long"),
  word("thoe", "เธอ", "thoe", "you (familiar) / she", "ธ", "live", "sara_oe_long", undefined, undefined,
    "Familiar rather than a default polite 'you' for strangers. คุณ is the safer neutral choice."),
  word("man", "มัน", "man", "it (things or animals)", "ม", "live", undefined, "น", undefined,
    "Use for things and animals here. Referring to a person this way can sound rude."),
  word("tha", "ถ้า", "tha", "if", "ถ", "mai_tho", "sara_a_long"),
  {
    kind: "word", id: "core_wela", thai: "เวลา", rtgs: "wela", meaning: "time",
    register: "neutral", audioKey: "words/core_wela",
    syllables: [syllable("เว", "we", "ว", "live", "sara_e_long"), syllable("ลา", "la", "ล", "live", "sara_a_long")],
  },
  word("thuk_every", "ทุก", "thuk", "every / each", "ท", "dead-short", "sara_u_short", "ก"),
  word("kon", "ก่อน", "kon", "before / first", "ก", "mai_ek", "sara_o_open_long", "น"),
  word("du", "ดู", "du", "to look / watch", "ด", "live", "sara_u_long"),
  word("ngan", "งาน", "ngan", "work / a job", "ง", "live", "sara_a_long", "น"),
  word("na", "นะ", "na", "softening or inviting particle", "น", "dead-short", "sara_a_short"),
  word("bok", "บอก", "bok", "to tell", "บ", "dead-long", "sara_o_open_long", "ก"),
  word("klap", "กลับ", "klap", "to return / go back", "ก", "dead-short", undefined, "บ", "ล"),
  word("khit", "คิด", "khit", "to think", "ค", "dead-short", "sara_i_short", "ด"),
  word("dek", "เด็ก", "dek", "child / children", "ด", "dead-short", "sara_e_short", "ก"),
  word("phut", "พูด", "phut", "to speak / say", "พ", "dead-long", "sara_u_long", "ด"),
  word("ban", "บ้าน", "ban", "house / home", "บ", "mai_tho", "sara_a_long", "น"),
  word("mai_new", "ใหม่", "mai", "new", "ห", "mai_ek", "sara_ai_maimuan", undefined, "ม"),
  word("ni_here", "นี่", "ni", "here / this (pointing)", "น", "mai_ek", "sara_i_long", undefined, undefined,
    "นี่ has a falling tone. นี้ in อันนี้ has a high tone; they are different words."),
  word("yak", "อยาก", "yak", "to want to (do something)", "อ", "dead-long", "sara_a_long", "ก", "ย"),
  word("chuai", "ช่วย", "chuai", "to help", "ช", "mai_ek", "sara_ua", "ย"),
];
