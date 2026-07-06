# CLAUDE.md — Thai Script Trainer

## Vision

A Thai language learning web app for **serious learners** (English UI).
Duolingo-style gamification, but **script-first**: the market gap is that
existing apps (Ling, Drops) teach vocab by sight without properly teaching
the Thai writing system. We teach the 44 consonants by consonant class
(mid / high / low), vowels, and tone rules — because consonant class is the
key that unlocks Thai tones, and skipping it is why other apps fail serious
learners.

## Branding (decided 2026-07-02)

- Name: **Aksorn** (อักษร = "letter/script"). Wordmark: Thai อักษร in
  marigold + "Aksorn" in indigo. No mascot.
- Palette: deep indigo primary (oklch ≈ #312E81), marigold gold accent
  (≈ #F59E0B), warm cream background (≈ #FAF7F2), charcoal-ink text.
  Tokens live in `src/app/globals.css`.
- Consonant-class accent colors (badges, sort buttons): mid = indigo,
  high = teal, low = rose (`src/lib/class-colors.ts`).
- **Tone color palette (fixed, app-wide — decided 2026-07-05)**: every
  place a tone is shown (syllable text, badges, contour strokes) uses
  `src/lib/tone-colors.ts`: mid = slate, low = sky, falling = violet,
  high = orange, rising = emerald. Never introduce other tone colors,
  and don't reuse these five for non-tone meanings in learning UI. The
  animated pitch-contour glyph is `src/components/ToneContour.tsx`;
  tone-colored words render via `src/components/ThaiWordText.tsx`
  (pass `colored={false}` wherever the color would leak an answer).
- Fonts: Geist (UI), Noto Sans Thai Looped (all learning glyphs, via
  `font-thai` utility).

## Legal constraints (IMPORTANT — applies to every session)

Must avoid **all Duolingo copyright and trade dress**:

- ✅ OK as concepts: streaks, XP, hearts, lesson paths, spaced repetition
  (game mechanics are not copyrightable).
- ❌ NOT OK: their visual design, mascot/characters (no owl, no cartoon
  mascot resembling Duo), green color scheme, the Duolingo name or anything
  confusingly similar, and their course content.
- All branding, UI design, and lesson content must be **original**.
- Thai script facts (letter names, classes, tone rules) are public domain;
  example words and lesson copy must be written by us, not lifted from any
  app or textbook.

## Tech stack (fixed — do not substitute)

- Next.js 15 (App Router) + TypeScript (strict)
- Tailwind CSS + shadcn/ui
- Framer Motion for exercise animations
- Supabase: auth (email + Google), Postgres for user progress + SRS scheduling
- Deployed on Vercel

## Roadmap

- **Phase 1 (current)**: Thai script trainer — 44 consonants by class
  (starting mid class), vowels, tone rules. Bite-sized lessons.
- **Phase 2 (later)**: tone/listening drills with audio.
- **Phase 3 (later)**: vocab + sentence course tree, Thai script only.

## Navigation (added 2026-07-03)

Three top-level learning sections, defined once in `src/lib/navigation.ts`
and rendered by `src/components/SectionTabs.tsx` (desktop: inline header
links; mobile: fixed bottom tab bar, hidden on `/lesson/*`):

- **Reading Thai** (`/reading`) — LIVE, full Phase-1 curriculum shipped
  2026-07-04: 6 units / 22 lessons — mid class (4), high class (3),
  low class (5), vowels (4), tone rules (4), mixed review (2).
  `/lesson/*` and `/review` belong to this section for active-state
  purposes. `/` currently redirects here (default landing until Thai
  Words ships — the redirect in `src/app/page.tsx` is the one line to
  flip).
- **Thai Words** (`/words`) — LIVE as the main course skeleton (shipped
  2026-07-05): 10 themed units in `src/content/words-units.json`, rendered
  by `src/components/WordsPathMap.tsx` as a Duolingo-style winding path of
  lesson nodes under unit banners (layout concept only — visuals are our
  own). Unit 1 **Greetings & Politeness** is real content (greet-01..04);
  units 2–10 (Numbers & Prices, Food & Ordering, Getting Around, Shopping
  & Bargaining, Time & Days, People & Family, Common Verbs, Feelings &
  Small Talk, Help & Emergencies) are locked `comingSoon` stubs with
  `goals` bullets — write their lessons in that order. **Gating**: unit 1
  unlocks only when every Reading-Thai mid-class lesson is complete
  (checked against `unitById.get("mid-class")` completions); unit N+1
  unlocks when unit N's lessons are all complete. Words lessons run on the
  same engine and `/lesson/[lessonId]` route (exit href picks /words vs
  /reading by unit) — never a separate engine.
- **Practice Speaking** (`/speaking`) — MINIMAL V1 (shipped 2026-07-04):
  self-assessment loop — step through consonants + vowels, play the TTS
  target, record yourself via MediaRecorder, replay both side by side.
  No uploads, no scoring (`src/components/speaking/`). Automated
  tone/pronunciation scoring remains Phase 2.

## Phase 1 requirements

1. **Lesson engine**: lessons are JSON definitions rendered by a generic
   exercise engine. Exercise types: multiple choice (character → sound),
   reverse (sound → character), matching pairs, character-class sorting.
2. **Progression**: units grouped by consonant class, mid class first.
   8–12 exercises per lesson. Lesson path/map on the home screen.
3. **Spaced repetition**: per-character strength in Supabase, SM-2-style
   scheduling.
4. **Gamification**: XP per lesson, daily streak, per-unit progress.
5. **Auth**: Supabase email/password (+ reset flow) and Google OAuth.
   Guest mode with local progress; signing up starts a fresh account —
   guest progress is discarded, not migrated (decided 2026-07-06).
6. **Design**: clean, premium, desktop-first but fully responsive.
   Original branding, clearly distinct from Duolingo's green-owl aesthetic.

## Architecture decisions

- **Lesson content lives in the repo** (`src/content/`), not in the DB:
  characters and lessons are versioned TypeScript/JSON validated with Zod.
  Only *user state* (progress, SRS, stats) lives in Supabase. Revisit if/when
  a CMS is needed.
- **Exercise engine generates distractors** at runtime from the character
  pool (same-class / similar-sound heuristics), so lesson JSON stays compact.
- **Guest mode**: identical progress shapes persisted to `localStorage`
  (namespaced key). On sign-in the remote snapshot always wins; a
  brand-new account resets local state (no guest→account migration,
  decided 2026-07-06). Auth UI: `/login` (login/signup/forgot modes,
  Google button) and `/reset-password` (recovery-link landing).
- **Reviews** are dynamically generated lessons built from due SRS cards.
- **Audio (shipped 2026-07-04)**: pre-generated Azure TTS clips (voice
  `th-TH-PremwadeeNeural`) in the public Supabase Storage bucket `audio`,
  one mp3 per `audioKey` (`consonants/{id}`, `vowels/{id}`,
  `tone-marks/{id}`, `syllables/{rtgs}` for rule_choice prompts,
  `examples/...` for concept thaiExamples, `words/{id}` for vocab words
  and tone-pair options, `phrases/{slug}` for register_choice phrases). `src/lib/audio.ts` exposes
  `playAudioKey(key, fallbackText)` / `useAudio` / `useCharacterAudio`;
  URL is `{SUPABASE_URL}/storage/v1/object/public/audio/{key}.mp3`, with
  `/public/audio` as the no-env dev fallback and Web Speech as the final
  fallback when a file is missing or playback is blocked. Exercises
  auto-play the correct answer's clip at the moment feedback shows (inside
  the tap gesture — don't move it to an effect, autoplay policy). See
  "Audio generation" below for the script.
- **Auth is client-side only in Phase 1**: no server-rendered protected
  routes; all progress reads/writes happen in the browser, so there is no
  Next.js middleware or server Supabase client yet.

See the "Data model" section below for tables and the lesson JSON schema.
(Ask the user before changing the data model or making other big
architectural decisions.)

## Data model (approved by user 2026-07-02)

- Content: characters are a discriminated union on `kind` —
  `characters.ts` (44 consonants: id, glyph, thai name, RTGS, class,
  initial/final sound, acrophonic meaning, audioKey), `vowels.ts`
  (25 vowels: sound, length short/long, written position, ◌ placeholder
  in glyphs), `tone-marks.ts` (4 marks, quizzed by name — their tone
  effect depends on class). `lessons/*.json` (id, unit, title, xp,
  teaches[], reviews[], pedagogy, exercises[]).
- **Vocab words** (`vocab/*.ts`, one file per Words unit, kind: "word"):
  thai, RTGS, meaning, optional literal meaning + usageNote, register
  (neutral/casual/polite/formal), optional particleGender (ครับ/ค่ะ),
  audioKey `words/{id}`, and `syllables[]` — each syllable carries its
  written segment (segments must concatenate to the word, checked at
  load), RTGS, **tone**, the breakdown ids (initialId = class-driving
  consonant incl. ห-nam/cluster leaders, clusterIds, vowelId, finalId,
  toneMarkId) and a human-verifiable `toneReason` citing the tone table.
  Word ids share the SRS id namespace with characters (collisions
  rejected at load); same never-rename rule.
- **Tone-pair bank** (`tone-pairs.ts`): minimal-pair sets (same syllable,
  different tones) with per-option audioKey; referenced by `tone_pair`
  exercises and sampled by weakness-targeted reviews.
- Exercise types: `intro`, `glyph_to_sound`, `sound_to_glyph`,
  `listening` (audio-only prompt → pick the glyph; distractors generated
  like sound_to_glyph, wrong answers re-queued once),
  `match_pairs`, `class_sort` (consonants only), `concept` (unscored
  teaching screens — every unit opens with 1–2; optional `thaiExample`
  + `exampleAudioKey` renders a tappable, voiced example), `rule_choice` (static
  MC over a Thai syllable for live/dead and tone drills; required
  `audioKey` (`syllables/{rtgs}`) voices the prompt — the same syllable
  in different lessons must reuse the same key; optional `attributeTo`
  routes the result to specific SRS cards, otherwise it counts toward
  accuracy only). Word-course exercise types (added 2026-07-05):
  `word_intro` (unscored card: tone-colored syllables, animated contours,
  register badge, expandable "Why these tones?" breakdown), `word_choice`
  (thai_to_meaning / meaning_to_thai, distractors from the vocab pool),
  `word_listening` (listening-first: audio-only prompt, meaning revealed
  only in feedback), `tone_pair` (references a bank set; the engine picks
  the target at runtime — options stay uncolored until answered; outcome
  carries the tone), `register_choice` (social-context prompt, Thai-form
  choices with optional `phrases/{slug}` audio, `attributeTo` like
  rule_choice). `match_pairs` accepts word ids too (Thai ↔ meaning).
- Romanization is a toggle, not a default: word exercises show RTGS only
  when `useUiSettings.showRomanization` is on (persisted, default off).
- **Weakness targeting**: `ExerciseOutcome.tone` from tone drills is
  tallied into `toneStats` (store + `user_stats.tone_stats` jsonb);
  reviews order due cards weakest-first (`weaknessFirst` in srs.ts) and
  append pinned-target tone_pair drills for tones with ≥3 attempts and
  >30% miss rate (`weakTones` in engine.ts). Words get SRS cards through
  the same store path as characters.
- Every lesson has a required `pedagogy` field citing the consonant
  class / tone rule it teaches, so content can be human-verified against
  the tone tables. Keep it accurate when editing lessons.
- Supabase: `profiles`, `user_stats` (xp, streaks), `lesson_completions`,
  `srs_cards` (SM-2 fields per character). All tables RLS-scoped to
  `auth.uid()`. Plus the Storage bucket `audio` (public read; created
  idempotently by the generation script, not by a migration — the
  migrations rule below covers Postgres schema).

## Audio generation

`npm run audio:generate` (or directly `npx tsx scripts/generate-audio.ts`
— note PowerShell strips npm's `--` separator, so pass flags via the
direct form on Windows) synthesizes every clip the content references
and uploads to Supabase Storage:

- Manifest = every character's `audioKey`→`nameThai`, every vocab word's
  `audioKey`→`thai` (`words/{id}`), every tone-pair option, every
  `register_choice` choice with an `audioKey` (`phrases/{slug}`), every
  `rule_choice.audioKey`→`prompt`, every `concept.exampleAudioKey`→
  `thaiExample` (with the `·` separator stripped). The script fails if
  one key maps to two different texts — that check is what keeps lesson
  JSON and audio in sync; run `--dry-run` (no env needed) to see the
  manifest.
- Idempotent: mp3s cache in `.audio-cache/` (gitignored); cached files
  skip TTS, objects already in the bucket skip upload. `--force`
  regenerates everything (note: Storage CDN caches for 1 year — if the
  voice ever changes, version the key paths instead of fighting it).
- Env in `.env.local` (never committed, never `NEXT_PUBLIC_`):
  `AZURE_SPEECH_KEY` + `AZURE_SPEECH_REGION` (Azure Speech resource) and
  `SUPABASE_SERVICE_ROLE_KEY` for the upload. Run it after adding any
  character, rule_choice, or voiced concept example.

## Conventions

- TypeScript strict; Zod schemas for all content JSON — content is validated
  at build time.
- Character IDs are stable snake_case slugs from the acrophonic name, e.g.
  `ko_kai` (ก), `cho_chan` (จ). Never rename once shipped (SRS rows key on
  them).
- Thai text always rendered with a dedicated Thai-capable font stack; never
  rely on system fallback for the learning glyphs.
- Romanization: **RTGS** everywhere in learner-facing copy (decided
  2026-07-04). RTGS doesn't mark vowel length or the two o-qualities, so
  answer labels disambiguate as e.g. "a, short" / "a, long" and
  "o (open)" — see `answerLabel()` in `src/lib/engine.ts`.
- Tone-rule ground truth (encode lessons against exactly this):
  unmarked — mid+live=mid, mid+dead=low, high+live=rising, high+dead=low,
  low+live=mid, low+dead-short=high, low+dead-long=falling;
  marked — mid/high + mai ek = low, mid/high + mai tho = falling,
  LOW + mai ek = falling, LOW + mai tho = high, mai tri = high and
  mai chattawa = rising (mid class, where they practically occur).
  ไ◌ ใ◌ เ◌า ◌ำ count as live despite being written short.
- shadcn/ui components live in `src/components/ui/`; app components in
  `src/components/`; exercise engine in `src/components/exercises/`.
- Supabase migrations in `supabase/migrations/` — schema changes go through
  migration files, never ad-hoc.
