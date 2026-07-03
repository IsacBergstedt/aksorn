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
- **Thai Words** (`/words`) — PLACEHOLDER SHELL. Will become the main
  course: a winding vertical unit path where units unlock sequentially
  (`src/components/LessonPath.tsx`). Placeholder units live in
  `src/content/words-units.json`, validated by the existing `unitSchema`.
  It MUST reuse the existing lesson engine, JSON schema, and
  `/lesson/[lessonId]` route when real content lands — no separate engine.
- **Practice Speaking** (`/speaking`) — PLACEHOLDER PAGE only ("Coming
  soon"). Audio functionality is Phase 2.

## Phase 1 requirements

1. **Lesson engine**: lessons are JSON definitions rendered by a generic
   exercise engine. Exercise types: multiple choice (character → sound),
   reverse (sound → character), matching pairs, character-class sorting.
2. **Progression**: units grouped by consonant class, mid class first.
   8–12 exercises per lesson. Lesson path/map on the home screen.
3. **Spaced repetition**: per-character strength in Supabase, SM-2-style
   scheduling.
4. **Gamification**: XP per lesson, daily streak, per-unit progress.
5. **Auth**: Supabase email + Google. Guest mode with local progress that
   migrates to the account on signup.
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
  (namespaced key), upserted to Supabase on signup.
- **Reviews** are dynamically generated lessons built from due SRS cards.
- **Audio**: placeholder hook (`useCharacterAudio(character)`) tries static
  files under `/audio/{audioKey}.mp3`, falls back to Web Speech API, until
  Phase 2 real audio lands.
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
- Exercise types: `intro`, `glyph_to_sound`, `sound_to_glyph`,
  `match_pairs`, `class_sort` (consonants only), `concept` (unscored
  teaching screens — every unit opens with 1–2), `rule_choice` (static
  MC over a Thai syllable for live/dead and tone drills; optional
  `attributeTo` routes the result to specific SRS cards, otherwise it
  counts toward accuracy only).
- Every lesson has a required `pedagogy` field citing the consonant
  class / tone rule it teaches, so content can be human-verified against
  the tone tables. Keep it accurate when editing lessons.
- Supabase: `profiles`, `user_stats` (xp, streaks), `lesson_completions`,
  `srs_cards` (SM-2 fields per character). All tables RLS-scoped to
  `auth.uid()`.

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
