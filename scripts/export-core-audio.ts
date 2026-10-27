import { copyFileSync, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { coreUnitById, getWord, lessons } from "../src/content";

// Bundle only the playable Core pilot's referenced clips. Keep the wider
// course on its existing storage-backed audio pipeline.
const keys = new Set<string>();
for (const lesson of lessons.filter(l => coreUnitById.has(l.unitId))) {
  for (const ex of lesson.exercises) {
    if (ex.type === "word_intro") keys.add(getWord(ex.wordId).audioKey);
    if ("audioKey" in ex) keys.add(ex.audioKey);
    if (ex.type === "dialogue_choice") {
      keys.add(ex.speaker.audioKey);
      ex.choices.forEach(c => { if (c.audioKey) keys.add(c.audioKey); });
    }
  }
}
const ordered = [...keys].sort();
for (const key of ordered) {
  const source = path.join(process.cwd(), ".audio-cache", `${key}.mp3`);
  if (!existsSync(source) || statSync(source).size === 0) throw new Error(`Missing cached audio ${key}; run audio:generate first.`);
  const target = path.join(process.cwd(), "public/audio", `${key}.mp3`);
  mkdirSync(path.dirname(target), { recursive: true });
  copyFileSync(source, target);
}
writeFileSync(path.join(process.cwd(), "src/lib/bundled-audio.json"), JSON.stringify(ordered, null, 2) + "\n");
console.log(`Bundled ${ordered.length} Core pilot audio clips.`);
