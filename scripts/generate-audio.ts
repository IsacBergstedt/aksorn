/**
 * Pre-generates Thai TTS audio for all course content and uploads it to the
 * public Supabase Storage bucket `audio`.
 *
 *   npm run audio:generate              synthesize missing clips + upload
 *   npm run audio:generate -- --dry-run print the manifest, touch nothing
 *   npm run audio:generate -- --force   re-synthesize and re-upload everything
 *
 * Idempotent: synthesized mp3s are cached in .audio-cache/ (gitignored) and
 * skipped on re-runs; uploads skip objects already in the bucket.
 *
 * Env (.env.local): AZURE_SPEECH_KEY, AZURE_SPEECH_REGION,
 * NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
// Importing content runs the Zod schemas + referential checks for free.
import { characters, lessons } from "../src/content";

loadEnv({ path: path.join(__dirname, "..", ".env.local") });

const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");

const CACHE_DIR = path.join(__dirname, "..", ".audio-cache");
const BUCKET = "audio";
const VOICE = "th-TH-PremwadeeNeural";

// ── 1. Manifest: audioKey → Thai text to synthesize ──────────────────

function buildManifest(): Map<string, string> {
  const manifest = new Map<string, string>();
  const conflicts: string[] = [];

  const add = (key: string, text: string, source: string) => {
    const existing = manifest.get(key);
    if (existing !== undefined && existing !== text) {
      conflicts.push(
        `${key}: "${existing}" vs "${text}" (${source}) — same key must always mean the same text`,
      );
      return;
    }
    manifest.set(key, text);
  };

  for (const c of characters) add(c.audioKey, c.nameThai, `character ${c.id}`);

  for (const lesson of lessons) {
    for (const ex of lesson.exercises) {
      if (ex.type === "rule_choice") {
        add(ex.audioKey, ex.prompt, `lesson ${lesson.id}`);
      }
      if (ex.type === "concept" && ex.exampleAudioKey && ex.thaiExample) {
        // "·" is a visual separator, not Thai — read it as a pause.
        add(
          ex.exampleAudioKey,
          ex.thaiExample.replace(/\s*·\s*/g, " "),
          `lesson ${lesson.id}`,
        );
      }
    }
  }

  if (conflicts.length > 0) {
    console.error("Audio key conflicts (fix the lesson JSON):");
    for (const c of conflicts) console.error(`  - ${c}`);
    process.exit(1);
  }
  return manifest;
}

// ── 2. Azure Speech synthesis ─────────────────────────────────────────

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function synthesize(text: string): Promise<Buffer> {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) {
    console.error(
      "AZURE_SPEECH_KEY / AZURE_SPEECH_REGION missing in .env.local — needed to synthesize new clips.",
    );
    process.exit(1);
  }

  const ssml = `<speak version="1.0" xml:lang="th-TH"><voice name="${VOICE}"><prosody rate="-10%">${escapeXml(text)}</prosody></voice></speak>`;

  const request = () =>
    fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-96kbitrate-mono-mp3",
        "User-Agent": "aksorn-audio-gen",
      },
      body: ssml,
    });

  let res = await request();
  if (res.status === 429) {
    const retryAfter = Number(res.headers.get("retry-after")) || 2;
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    res = await request();
  }
  if (!res.ok) {
    throw new Error(
      `Azure TTS ${res.status} for "${text}": ${await res.text()}`,
    );
  }
  return Buffer.from(await res.arrayBuffer());
}

// ── 3. Supabase Storage upload ────────────────────────────────────────

function storageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in .env.local — needed to upload.",
    );
    process.exit(1);
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

async function listExistingKeys(
  storage: SupabaseClient["storage"],
  folders: string[],
): Promise<Set<string>> {
  const existing = new Set<string>();
  // Storage list() is per-folder, not recursive.
  for (const folder of folders) {
    const { data, error } = await storage
      .from(BUCKET)
      .list(folder, { limit: 1000 });
    if (error) throw new Error(`list ${folder}: ${error.message}`);
    for (const obj of data ?? []) {
      if (obj.name.endsWith(".mp3")) {
        existing.add(`${folder}/${obj.name.slice(0, -4)}`);
      }
    }
  }
  return existing;
}

// ── main ──────────────────────────────────────────────────────────────

async function main() {
  const manifest = buildManifest();
  const folders = [...new Set([...manifest.keys()].map((k) => k.split("/")[0]))];

  console.log(
    `Manifest: ${manifest.size} clips across ${folders.join(", ")}`,
  );

  if (DRY_RUN) {
    for (const [key, text] of manifest) console.log(`  ${key}  ←  ${text}`);
    console.log("\nDry run — nothing synthesized or uploaded.");
    return;
  }

  // Synthesize into the local cache.
  let synthesized = 0;
  let cached = 0;
  for (const [key, text] of manifest) {
    const file = path.join(CACHE_DIR, ...key.split("/")) + ".mp3";
    if (!FORCE && existsSync(file)) {
      cached++;
      continue;
    }
    const mp3 = await synthesize(text);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, mp3);
    synthesized++;
    console.log(`  synthesized ${key} (${text})`);
    // Stay well under Azure rate limits.
    await new Promise((r) => setTimeout(r, 200));
  }

  // Upload missing objects.
  const supabase = storageClient();
  const { error: bucketError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
  });
  if (bucketError && !/already exists/i.test(bucketError.message)) {
    throw new Error(`createBucket: ${bucketError.message}`);
  }

  const existing = FORCE
    ? new Set<string>()
    : await listExistingKeys(supabase.storage, folders);

  let uploaded = 0;
  let skipped = 0;
  for (const key of manifest.keys()) {
    if (existing.has(key)) {
      skipped++;
      continue;
    }
    const file = path.join(CACHE_DIR, ...key.split("/")) + ".mp3";
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(`${key}.mp3`, await readFile(file), {
        contentType: "audio/mpeg",
        cacheControl: "31536000",
        upsert: true,
      });
    if (error) throw new Error(`upload ${key}: ${error.message}`);
    uploaded++;
    console.log(`  uploaded ${key}`);
  }

  console.log(
    `\nDone: ${synthesized} synthesized · ${cached} from cache · ${uploaded} uploaded · ${skipped} already in bucket`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
