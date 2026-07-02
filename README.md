# Aksorn — อักษร

Script-first Thai for serious learners. Aksorn teaches the Thai writing
system the way it actually works: the 44 consonants by consonant class
(mid → high → low), then vowels, then tone rules — because consonant class
is the key that unlocks Thai tones.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS + shadcn/ui ·
Framer Motion · Supabase (auth + progress + SRS) · Vercel

## Getting started

```bash
npm install
npm run dev
```

The app runs in **guest mode** out of the box — progress is stored in
`localStorage`. To enable accounts:

1. Create a Supabase project and run `supabase/migrations/0001_init.sql`
   against it (or `supabase db push` with the CLI).
2. Enable the Email and Google providers under Authentication.
3. Copy `.env.local.example` to `.env.local` and fill in the project URL and
   anon key.

Guest progress migrates to the account automatically on first sign-in.

## Project layout

- `src/content/` — course content: characters, units, lesson JSON
  (Zod-validated at build time)
- `src/lib/engine.ts` — turns lesson JSON into runtime exercises and
  generates distractors
- `src/lib/srs.ts` — SM-2 spaced repetition
- `src/lib/progress/` — progress store (localStorage) + Supabase sync
- `src/components/exercises/` — the exercise engine UI
- `supabase/migrations/` — database schema

See `CLAUDE.md` for the full product vision, roadmap, and conventions.
