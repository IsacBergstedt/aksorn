import assert from "node:assert/strict";
import { corePilot, coreUnits } from "../src/content";
import bundledAudio from "../src/lib/bundled-audio.json";
import { existsSync, statSync } from "node:fs";
import path from "node:path";

async function main() {
  const origin = "http://localhost:3100";
  const urls = ["/core", "/core/review", "/lesson/core-01", "/lesson/core-cp-4", "/phrases", "/reading"];
  await Promise.all(urls.map(async route => {
    const response = await fetch(origin + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert(html.includes("Core 1,000"), `${route}: Core navigation missing`);
    if (route === "/core") {
      assert(html.includes("Words introduced"));
      for (const unit of coreUnits) for (const id of unit.lessonIds) assert(html.includes(`/lesson/${id}`), `Unavailable lesson ${id}`);
    }
  }));
  for (const key of bundledAudio) {
    const file = path.join(process.cwd(), "public/audio", `${key}.mp3`);
    assert(existsSync(file) && statSync(file).size > 100, `Missing audio ${key}`);
  }
  for (const e of [corePilot[0], corePilot[corePilot.length - 1]]) {
    const response = await fetch(`${origin}/audio/${e.audioKey}.mp3`);
    assert.equal(response.status, 200);
    assert(response.headers.get("content-type")?.includes("audio"));
    assert((await response.arrayBuffer()).byteLength > 100);
  }
  console.log(`HTTP smoke passed: six routes, all 24 lesson links, ${bundledAudio.length} audio files, and served MP3 playback assets.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
