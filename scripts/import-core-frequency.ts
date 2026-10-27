import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

// Refresh deliberately: the checked-in snapshot is stable between imports.
async function main() {
  const repo = "PyThaiNLP/pythainlp";
  const file = "pythainlp/corpus/tnc_freq.txt";
  const response = await fetch(`https://api.github.com/repos/${repo}/commits?path=${file}&per_page=1`, {
    headers: { "User-Agent": "Aksorn-frequency-import" },
  });
  if (!response.ok) throw new Error(`Source revision lookup: ${response.status}`);
  const revisions = await response.json() as { sha: string }[];
  const revision = revisions[0].sha;
  const url = `https://raw.githubusercontent.com/${repo}/${revision}/${file}`;
  const sourceResponse = await fetch(url);
  if (!sourceResponse.ok) throw new Error(`Frequency download: ${sourceResponse.status}`);
  const source = await sourceResponse.text();
  const seen = new Set<string>();
  const rows = source.trim().split(/\r?\n/).map((line, i) => {
    const [thai, count] = line.split("\t");
    return { thai, count: Number(count), sourceRank: i + 1 };
  }).filter(row => {
    if (!/^[ก-๙]+$/.test(row.thai) || /[ๆฯ๐-๙]/.test(row.thai) || !Number.isFinite(row.count) || row.count <= 0 || seen.has(row.thai)) return false;
    seen.add(row.thai); return true;
  }).slice(0, 1000);
  if (rows.length !== 1000) throw new Error("Source has fewer than 1,000 valid entries");
  const content = path.join(process.cwd(), "src/content");
  writeFileSync(path.join(content, "core-frequency.json"), JSON.stringify(rows, null, 2) + "\n");
  writeFileSync(path.join(content, "core-source.json"), JSON.stringify({
    name: "Thai National Corpus word frequencies, distributed by PyThaiNLP",
    credit: "Korakot Chaovavanich; PyThaiNLP contributors",
    url, revision, retrievedAt: new Date().toISOString().slice(0, 10),
    sha256: createHash("sha256").update(source).digest("hex"),
    repositoryLicense: "Apache-2.0",
    modifications: "Retain first 1,000 unique Thai-script entries; remove punctuation, numeral-containing, and mixed-script forms. Preserve counts and original source ranks.",
  }, null, 2) + "\n");
  const licenseResponse = await fetch(`https://raw.githubusercontent.com/${repo}/${revision}/LICENSE`);
  if (!licenseResponse.ok) throw new Error(`License download: ${licenseResponse.status}`);
  mkdirSync(path.join(content, "sources"), { recursive: true });
  writeFileSync(path.join(content, "sources/PYTHAINLP-LICENSE.txt"), await licenseResponse.text());
  console.log(`Imported ${rows.length} entries from immutable source revision ${revision}.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
