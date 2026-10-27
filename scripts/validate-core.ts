import assert from "node:assert/strict";
import { corePilot, coreUnits, coreUnitById, lessons, lessonById, vocabWords } from "../src/content";
import frequency from "../src/content/core-frequency.json";
import { sections } from "../src/lib/navigation";
import { buildLessonExercises } from "../src/lib/engine";

assert.equal(frequency.length, 1000);
assert.equal(new Set(frequency.map(r => r.thai)).size, 1000);
assert.equal(corePilot.length, 100);
assert.equal(new Set(corePilot.map(e => e.wordId)).size, 100);
assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
assert.equal(new Set(vocabWords.map(w => w.id)).size, vocabWords.length);
assert(corePilot.every((e, i) => i === 0 || e.rank > corePilot[i - 1].rank));
assert(frequency.every((r, i) => i === 0 || r.count <= frequency[i - 1].count));
const known = new Set(vocabWords.filter(w => !w.id.startsWith("core_")).map(w => w.id));
const bank = new Set(frequency.map(row => row.thai));
let inBank = 0;
let tokenCount = 0;
for (const unit of coreUnits) {
  assert.equal(unit.lessonIds.length, 6);
  for (const id of unit.lessonIds) {
    const lesson = lessonById.get(id)!;
    assert.equal(lesson.unitId, unit.id);
    lesson.teaches.forEach(word => known.add(word));
    const scored = lesson.exercises.filter(e => !["word_intro", "concept"].includes(e.type));
    assert(scored.every(e => ["sentence_build", "sentence_cloze", "sentence_listening", "dialogue_choice"].includes(e.type)));
    assert.equal(buildLessonExercises(lesson).length, lesson.exercises.length);
    const active = sections.filter(s => s.isActive(`/lesson/${id}`));
    assert.equal(active.length, 1);
    assert.equal(active[0].href, "/core");
    for (const e of lesson.exercises) {
      if ("tokens" in e) for (const token of e.tokens) {
        assert(token.wordId && known.has(token.wordId), `${id}: new support word ${token.wordId}`);
        const word = vocabWords.find(w => w.id === token.wordId)!;
        assert.equal(token.thai, word.thai);
        tokenCount++;
        if (bank.has(token.thai)) inBank++;
      }
      if (e.type === "sentence_cloze") {
        assert(e.distractors.every(d => d.thai !== e.tokens[e.blankIndex].thai));
      }
    }
  }
}
assert(inBank / tokenCount >= 0.9, `Top-1000 vocabulary coverage too low: ${inBank}/${tokenCount}`);
assert.equal(lessons.filter(l => coreUnitById.has(l.unitId) && l.kind !== "checkpoint").length, 20);
assert.equal(lessons.filter(l => coreUnitById.has(l.unitId) && l.kind === "checkpoint").length, 4);
console.log(`Core pilot passed: 1,000 ranked entries, 100 targets, 20 lessons, 4 checkpoints, familiar-word dependencies, navigation, and ${Math.round(inBank / tokenCount * 100)}% top-1,000 sentence-token coverage.`);
