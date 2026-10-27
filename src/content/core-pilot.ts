import type { Exercise, Lesson, Unit, VocabWord } from "./schema";
import frequency from "./core-frequency.json";

// Original sentences. Existing Phrases vocabulary is the support vocabulary;
// new Core words only appear once their lesson has introduced them.
const examples: [string, string, string][] = [
  ["thi", "hong_nam yu thi nai khrap", "Where is the bathroom? (male speaker)"],
  ["core_pen", "khun core_pen arai khrap", "What is the matter? (male speaker)"],
  ["core_nai_in", "nam yu core_nai_in hong_nam", "The water is in the bathroom."],
  ["core_khong", "an ni_this core_pen core_khong khun", "This one belongs to you."],
  ["mi", "mi nam mai_question khrap", "Do you have water? (male speaker)"],
  ["core_cha", "phom core_cha pai khrap", "I will go. (male speaker)"],
  ["core_lae", "khun core_lae phom kin khao_rice", "You and I eat rice. (male speaker)"],
  ["mai_not", "phom mai_not ao khrap", "I do not want it. (male speaker)"],
  ["dai", "phom pai dai mai_question khrap", "Can I go? (male speaker)"],
  ["core_hai", "core_hai nam phom noi khrap", "Give me some water, please. (male speaker)"],
  ["core_wa", "phom core_wa khao_rice aroi", "I think the rice is delicious. (male speaker)"],
  ["pai", "phom pai kin khao_rice khrap", "I am going to eat. (male speaker)"],
  ["core_ma", "core_ma kin khao_rice khrap", "Come and eat. (male speaker)"],
  ["khon", "mi khon yu mai_question khrap", "Is anyone there? (male speaker)"],
  ["core_kap", "pai core_kap phom mai_question khrap", "Will you go with me? (male speaker)"],
  ["laeo", "phom kin khao_rice laeo khrap", "I have already eaten. (male speaker)"],
  ["yu", "khun yu thi nai khrap", "Where are you staying? (male speaker)"],
  ["core_rue", "khun core_cha pai core_rue yu", "Will you go or stay?"],
  ["core_chak", "khun core_ma core_chak nai", "Where do you come from?"],
  ["core_kan", "pai kin khao_rice core_kan khrap", "Let us go and eat together. (male speaker)"],
  ["ni_this", "an ni_this thuk mak", "This one is very cheap."],
  ["core_tae", "phom hio core_tae khun mai_not hio", "I am hungry, but you are not hungry. (male speaker)"],
  ["core_tong", "phom core_tong pai khrap", "I have to go. (male speaker)"],
  ["core_duai", "phom pai core_duai khrap", "I am going too. (male speaker)"],
  ["core_khao_he", "core_khao_he yu thi nai", "Where is that person staying?"],
  ["core_nan", "an core_nan thuk mak", "That one is very cheap."],
  ["mak", "khao_rice aroi mak", "The rice is very delicious."],
  ["core_chai_use", "core_chai_use hong_nam dai mai_question khrap", "May I use the bathroom? (male speaker)"],
  ["core_rao", "core_rao pai kin khao_rice core_kan", "We are going to eat together."],
  ["core_yang", "phom core_yang mai_not ru", "I still do not know. (male speaker)"],
  ["core_tham", "khun core_tham arai", "What are you doing?"],
  ["phom", "phom hio mak khrap", "I am very hungry. (male speaker)"],
  ["core_ik", "kho nam core_ik noi khrap", "Some more water, please. (male speaker)"],
  ["nueng", "mi khon yu nueng khon", "There is one person here."],
  ["core_phro", "phom kin khao_rice core_phro hio", "I am eating because I am hungry. (male speaker)"],
  ["core_di", "an ni_this core_di mak", "This one is very good."],
  ["core_ok", "phom core_cha core_ok pai", "I will go out. (male speaker)"],
  ["chan", "chan hio kha_statement", "I am hungry. (female speaker)"],
  ["core_khue", "an ni_this core_khue arai", "What is this?"],
  ["core_hen", "phom core_hen khun", "I can see you. (male speaker)"],
  ["core_thai", "phom core_ma core_chak core_thai", "I come from Thailand. (male speaker)"],
  ["core_pi", "phom yu core_thai nueng core_pi", "I am staying in Thailand for one year. (male speaker)"],
  ["core_thoe", "core_thoe pai nai", "Where are you going? (addressing someone familiar)"],
  ["khun", "khun ao arai khrap", "What would you like? (male speaker)"],
  ["core_man", "core_man yu core_nai_in hong_nam", "It is in the bathroom."],
  ["core_tha", "core_tha hio kin khao_rice dai", "If you are hungry, you can eat."],
  ["arai", "khun core_cha core_tham arai", "What will you do?"],
  ["core_wela", "phom mai_not mi core_wela", "I do not have time. (male speaker)"],
  ["thuk", "an ni_this thuk khrap", "This one is cheap. (male speaker)"],
  ["core_thuk_every", "phom kin khao_rice core_thuk_every wan_day", "I eat rice every day. (male speaker)"],
  ["wan_day", "khun pai wan_day nai", "Which day are you going?"],
  ["core_kon", "phom pai core_kon khrap", "I will go first. (male speaker)"],
  ["core_du", "core_du an ni_this khrap", "Look at this one. (male speaker)"],
  ["ru", "phom mai_not ru khrap", "I do not know. (male speaker)"],
  ["ao", "phom ao an ni_this khrap", "I will take this one. (male speaker)"],
  ["song", "mi khon yu song khon", "There are two people here."],
  ["core_ngan", "phom mi core_ngan", "I have work. (male speaker)"],
  ["core_na", "pai kin khao_rice core_kan core_na", "Let us go and eat, shall we?"],
  ["core_bok", "core_bok phom noi khrap", "Tell me, please. (male speaker)"],
  ["core_klap", "phom core_cha core_klap", "I will go back. (male speaker)"],
  ["core_khit", "phom core_khit core_wa an ni_this core_di", "I think this one is good. (male speaker)"],
  ["core_dek", "core_dek kin khao_rice", "The child is eating."],
  ["core_phut", "khun core_phut arai", "What are you saying?"],
  ["core_ban", "core_ban khun yu thi nai", "Where is your home?"],
  ["core_mai_new", "an ni_this core_mai_new", "This one is new."],
  ["core_ni_here", "phom yu thi core_ni_here", "I am here. (male speaker)"],
  ["khrai", "khrai yu thi core_ni_here", "Who is here?"],
  ["core_yak", "phom core_yak kin khao_rice", "I want to eat. (male speaker)"],
  ["nam", "kho nam noi khrap", "Some water, please. (male speaker)"],
  ["chai", "chai khrap an ni_this core_khong phom", "Yes, this one belongs to me. (male speaker)"],
  ["core_chuai", "core_chuai phom noi khrap", "Help me, please. (male speaker)"],
  ["kho", "kho khao_rice noi khrap", "Some rice, please. (male speaker)"],
  ["an", "phom ao an core_nan", "I will take that one. (male speaker)"],
  ["noi_little", "kho nam noi_little noi khrap", "Just a little water, please. (male speaker)"],
  ["kin", "khun kin arai", "What are you eating?"],
  ["khrap", "kho nam khrap", "Water, please. (male speaker)"],
  ["nai", "khun core_cha pai nai", "Where will you go?"],
  ["khao_chai", "phom khao_chai laeo khrap", "I understand now. (male speaker)"],
  ["trong", "trong pai khrap", "Go straight. (male speaker)"],
  ["chue", "khun chue arai", "What is your name?"],
  ["bat", "an ni_this sip bat", "This one is ten baht."],
  ["sam", "mi khon yu sam khon", "There are three people here."],
  ["lot", "lot noi dai mai_question khrap", "Can you lower it a little? (male speaker)"],
  ["kha_statement", "kho nam kha_statement", "Water, please. (female speaker)"],
  ["kha_question", "ao nam mai_question kha_question", "Would you like water? (female speaker)"],
  ["thammai", "thammai khun mai_not kin khao_rice", "Why are you not eating?"],
  ["mai_question", "khun core_yak pai mai_question", "Do you want to go?"],
  ["khao_rice", "phom core_yak kin khao_rice khrap", "I would like to eat rice. (male speaker)"],
  ["klai_near", "core_ban phom yu klai_near", "My home is nearby. (male speaker)"],
  ["sip", "an ni_this sam sip bat", "This one is thirty baht."],
  ["yangngai", "khun core_cha pai yangngai", "How will you get there?"],
  ["ron", "wan_day ni_this ron mak", "Today is very hot."],
  ["si", "mi khon yu si khon", "There are four people here."],
  ["ha", "an ni_this ha sip bat", "This one is fifty baht."],
  ["roi", "an ni_this nueng roi bat", "This one is one hundred baht."],
  ["noi", "core_chuai phom noi khrap", "Please help me. (male speaker)"],
  ["klai_far", "core_ban phom yu klai_far", "My home is far away. (male speaker)"],
  ["phan", "an ni_this nueng phan bat", "This one is one thousand baht."],
  ["sun", "an ni_this sun bat", "This one is priced at zero baht."],
  ["ki", "an ni_this ki bat", "How many baht is this one?"],
];

export type CoreExample = {
  wordId: string;
  rank: number;
  sourceRank: number;
  meaning: string;
  thai: string;
  rtgs: string;
  audioKey: string;
  tokens: { thai: string; rtgs: string; wordId: string }[];
};

export function createCoreCourse(words: VocabWord[]) {
  const byId = new Map(words.map(w => [w.id, w]));
  const get = (id: string) => {
    const word = byId.get(id);
    if (!word) throw new Error(`Unknown Core word ${id}`);
    return word;
  };
  const pilot: CoreExample[] = examples.map(([wordId, ids, meaning]) => {
    const word = get(wordId);
    const index = frequency.findIndex(row => row.thai === word.thai);
    if (index < 0) throw new Error(`Core target ${wordId} is outside the frequency bank`);
    const tokens = ids.split(" ").map(id => {
      const w = get(id); return { thai: w.thai, rtgs: w.rtgs, wordId: id };
    });
    return { wordId, rank: index + 1, sourceRank: frequency[index].sourceRank,
      meaning, thai: tokens.map(t => t.thai).join(""), rtgs: tokens.map(t => t.rtgs).join(" "),
      audioKey: `phrases/core_${wordId}${wordId === "sip" ? "_thirty" : ""}`, tokens };
  }).sort((a, b) => a.rank - b.rank);

  function build(example: CoreExample, audio = false): Exercise {
    return { type: "sentence_build", meaning: example.meaning,
      gloss: example.tokens.map(t => get(t.wordId).meaning).join(" + "),
      audioKey: example.audioKey, tokens: example.tokens,
      promptMode: audio ? "audio" : "meaning", attributeTo: [example.wordId],
      explanation: `Practice ${get(example.wordId).thai} in a complete sentence. Replay the whole sentence after answering.` };
  }
  function listen(example: CoreExample, others: CoreExample[]): Exercise {
    return { type: "sentence_listening", mode: "meaning", audioKey: example.audioKey,
      thai: example.thai, rtgs: example.rtgs,
      choices: [example, ...others.filter(e => e.thai !== example.thai && e.meaning !== example.meaning).slice(0, 2)]
        .map(e => ({ thai: e.thai, rtgs: e.rtgs, meaning: e.meaning })), correctIndex: 0,
      explanation: `Listen for ${get(example.wordId).thai}, then connect it to the meaning of the whole sentence.`,
      attributeTo: [example.wordId] };
  }
  function cloze(example: CoreExample): Exercise {
    const blankIndex = example.tokens.findIndex(t => t.wordId === example.wordId);
    return { type: "sentence_cloze", tokens: example.tokens, blankIndex,
      meaning: example.meaning, audioKey: example.audioKey,
      distractors: ["nam", "sun", "mai_not", "phom"].filter(id => get(id).thai !== get(example.wordId).thai)
        .slice(0, 2).map(id => ({ thai: get(id).thai, rtgs: get(id).rtgs })),
      explanation: `${get(example.wordId).thai} means ${get(example.wordId).meaning} here.`,
      attributeTo: [example.wordId] };
  }
  function dialogue(index: number): Exercise {
    const voiced = (thai: string, rtgs: string) => ({ thai, rtgs,
      audioKey: `phrases/core_dialogue_${rtgs.replaceAll(" ", "_")}` });
    const scenes: Extract<Exercise, { type: "dialogue_choice" }>[] = [
      {
        type: "dialogue_choice", context: "A passer-by asks you for directions. You are a man; the bathroom is straight ahead.",
        speaker: { ...voiced("ห้องน้ำอยู่ที่ไหนคะ", "hong nam yu thi nai kha"), meaning: "Where is the bathroom?" },
        question: "Which reply gives the route?",
        choices: [
          { ...voiced("ตรงไปครับ", "trong pai khrap"), quality: "best", note: "ตรงไปครับ gives the direction the person needs." },
          { thai: "ขอน้ำหน่อยครับ", rtgs: "kho nam noi khrap", quality: "situation", note: "This requests water instead of giving directions." },
          { thai: "ไม่รู้ครับ", rtgs: "mai ru khrap", quality: "meaning", note: "You know the way; this says you do not know." },
        ], attributeTo: ["trong", "pai", "khrap"],
      },
      {
        type: "dialogue_choice", context: "Someone checks whether you understood. You are a man and did understand.",
        speaker: { ...voiced("เข้าใจไหมคะ", "khao chai mai kha"), meaning: "Do you understand?" },
        question: "How do you confirm that you understand?",
        choices: [
          { ...voiced("เข้าใจครับ", "khao chai khrap"), quality: "best", note: "Repeat the verb เข้าใจ to confirm that you understand." },
          { thai: "ไม่เข้าใจครับ", rtgs: "mai khao chai khrap", quality: "meaning", note: "This says you do not understand." },
          { thai: "ขอข้าวครับ", rtgs: "kho khao khrap", quality: "situation", note: "This orders rice; it does not answer the question." },
        ], attributeTo: ["khao_chai", "khrap"],
      },
      {
        type: "dialogue_choice", context: "You are a male vendor. A customer points to an item priced at 30 baht.",
        speaker: { ...voiced("อันนี้เท่าไหร่คะ", "an ni thao rai kha"), meaning: "How much is this one?" },
        question: "Tell the customer its price.",
        choices: [
          { ...voiced("สามสิบบาทครับ", "sam sip bat khrap"), quality: "best", note: "สามสิบ is thirty; add บาท and the male polite ending." },
          { thai: "ห้าสิบบาทครับ", rtgs: "ha sip bat khrap", quality: "meaning", note: "This says fifty baht, not thirty." },
          { thai: "ตรงไปครับ", rtgs: "trong pai khrap", quality: "situation", note: "This gives a direction rather than a price." },
        ], attributeTo: ["sam", "sip", "bat", "khrap"],
      },
      {
        type: "dialogue_choice", context: "You are a man heading out for a meal. A neighbor asks where you are going.",
        speaker: { ...voiced("ไปไหนคะ", "pai nai kha"), meaning: "Where are you going?" },
        question: "Answer with your plan.",
        choices: [
          { ...voiced("ไปกินข้าวครับ", "pai kin khao khrap"), quality: "best", note: "ไปกินข้าวครับ explains where you are heading and what you will do." },
          { thai: "ไม่เอาครับ", rtgs: "mai ao khrap", quality: "situation", note: "This declines an offer; nobody has offered you anything." },
          { thai: "ไม่ไปครับ", rtgs: "mai pai khrap", quality: "meaning", note: "This says you are not going, but you are heading out." },
        ], attributeTo: ["pai", "kin", "khao_rice", "khrap"],
      },
    ];
    if (index % 5) return scenes[(index % 5) - 1];
    return { type: "dialogue_choice",
      context: "A vendor offers water. You are a man who wants some water.",
      speaker: { thai: "เอาน้ำไหมคะ", rtgs: "ao nam mai kha", meaning: "Would you like water?", audioKey: "phrases/ao_nam_mai_kha_question" },
      question: "What do you say next?",
      choices: [
        { thai: "ขอน้ำหน่อยครับ", rtgs: "kho nam noi khrap", audioKey: "phrases/kho_nam_noi_khrap", quality: "best", note: "Ask for the water that was offered." },
        { thai: "ไม่เอาครับ", rtgs: "mai ao khrap", quality: "meaning", note: "This declines the water, but you want some." },
        { thai: "เท่าไหร่ครับ", rtgs: "thao rai khrap", quality: "situation", note: "This asks a price; your goal here is to request the offered water." },
      ], attributeTo: ["kho", "nam", "noi", "khrap"] };
  }

  const units: Unit[] = [];
  const lessons: Lesson[] = [];
  const names = ["Build your sentence toolkit", "Connect familiar ideas", "People, actions & requests", "Everyday details"];
  for (let u = 0; u < 4; u++) {
    const unitId = `core-unit-${u + 1}`;
    const lessonIds: string[] = [];
    for (let i = 0; i < 5; i++) {
      const n = u * 5 + i;
      const batch = pilot.slice(n * 5, n * 5 + 5);
      const id = `core-${String(n + 1).padStart(2, "0")}`;
      lessonIds.push(id);
      const exercises: Exercise[] = batch.map(e => ({ type: "word_intro", wordId: e.wordId }));
      exercises.push(...batch.map((e, j) => build(e, j === 4)),
        listen(batch[0], batch), cloze(batch[1]), listen(batch[2], batch), cloze(batch[3]), dialogue(n));
      const references = new Set(batch.flatMap(e => e.tokens.map(t => t.wordId)));
      const last = exercises[exercises.length - 1];
      if (last.type === "dialogue_choice") last.attributeTo?.forEach(id => references.add(id));
      lessons.push({ id, unitId, order: i + 1, title: `Words ${n * 5 + 1}–${n * 5 + 5}`,
        xpReward: 25, teaches: batch.map(e => e.wordId),
        reviews: [...references].filter(id => !batch.some(e => e.wordId === id)),
        pedagogy: "Five common target words in original sentences. Meaning/audio sentence building, cloze, listening, and a familiar dialogue. Target-only SRS attribution prevents new support words receiving unearned credit. Syllable tones follow each word's existing toneReason. Teaching order follows cleaned corpus rank, with familiar Phrases support vocabulary.", exercises });
    }
    const checkpointId = `core-cp-${u + 1}`;
    lessonIds.push(checkpointId);
    const unitExamples = pilot.slice(u * 25, (u + 1) * 25);
    const reviewExamples = unitExamples.filter((_, i) => i % 2 === 0).slice(0, 10);
    lessons.push({ id: checkpointId, unitId, order: 6, title: `Checkpoint: ${u * 25 + 1}–${(u + 1) * 25}`,
      kind: "checkpoint", passThreshold: 0.8, xpReward: 40, teaches: [],
      reviews: unitExamples.map(e => e.wordId),
      pedagogy: "Cumulative sentence-only review of this 25-word block. No new vocabulary. Alternates sentence comprehension and production, reusing original voiced examples and existing syllable-tone metadata.",
      exercises: reviewExamples.map((e, i) => i % 2 ? build(e, true) : listen(e, unitExamples)) });
    units.push({ id: unitId, order: u + 1, title: names[u],
      description: `Pilot words ${u * 25 + 1}–${(u + 1) * 25} · five short lessons and a checkpoint`, lessonIds });
  }
  return { pilot, units, lessons, build, listen };
}
