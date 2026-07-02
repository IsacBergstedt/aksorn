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

- Content: `characters.ts` (id, glyph, thai name, RTGS, class, initial/final
  sound, acrophonic meaning, audioKey), `lessons/*.json` (id, unit, title,
  xp, teaches[], reviews[], exercises[]).
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
- Romanization: RTGS everywhere in learner-facing copy.
- shadcn/ui components live in `src/components/ui/`; app components in
  `src/components/`; exercise engine in `src/components/exercises/`.
- Supabase migrations in `supabase/migrations/` — schema changes go through
  migration files, never ad-hoc.
