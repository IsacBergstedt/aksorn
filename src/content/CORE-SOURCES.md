# Core 1,000 sources and editorial policy

The frequency bank is an adapted subset of `tnc_freq.txt` from
[PyThaiNLP](https://github.com/PyThaiNLP/pythainlp), whose documentation
identifies it as Thai National Corpus frequency data and credits
Korakot Chaovavanich. The upstream repository is distributed under Apache 2.0;
its license is retained in `sources/PYTHAINLP-LICENSE.txt`.

`core-source.json` records the immutable upstream revision, retrieval date,
source URL, full-source checksum, and modifications. `core-frequency.json`
retains the original occurrence counts and source ranks; ranks are not
renumbered after filtering. The importer retains the first 1,000 unique
Thai-script entries without punctuation, numeral-containing forms, or mixed
scripts. This is a written-corpus ranking, not a universal spoken ranking.
Word segmentation follows the source and can include grammatical prefixes.

The playable pilot selects 100 useful entries from this bank, rather than
claiming to cover the first 100 consecutive source ranks. Targets follow
their corpus order. Familiar Phrases vocabulary supports the examples;
new Core-only words must be introduced before they occur as support words.
Remaining bank entries have no authored definitions or lessons yet.

Definitions, example sentences, explanations, and distractors in `vocab/core.ts`
and `core-pilot.ts` are original. Existing shipped words reuse their stable IDs
and pronunciation metadata. New words have `core_` IDs and syllable-by-syllable
tone derivations. Individual meanings are taught in context; the pilot does
not attempt to enumerate every dictionary sense.

Commands (from the repository root):

- `node scripts/run-local-typescript.cjs scripts/import-core-frequency.ts`
  deliberately refreshes the frequency snapshot. Review the diff before using
  a changed teaching order.
- `node scripts/run-local-typescript.cjs scripts/validate-core.ts` checks
  vocabulary coverage, target order, dependencies, schemas, exercise creation,
  and section routing.
- `node scripts/run-local-typescript.cjs scripts/generate-audio.ts --dry-run`
  checks the full-course audio manifest for collisions.
- `node scripts/run-local-typescript.cjs scripts/export-core-audio.ts` copies
  Core-referenced MP3s from `.audio-cache` into `public/audio` and updates the
  bundled-audio index. These clips are served locally before remote storage.

Core lessons use the existing engine, completion storage, and vocabulary SRS.
Introduced count means target words in completed Core lessons. Practice
strength comes from repeated successful SRS sessions; neither is labeled
mastery. Core checkpoints and reviews stay sentence based, without appending
unrelated character exercises.
