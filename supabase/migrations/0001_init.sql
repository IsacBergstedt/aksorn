-- Aksorn initial schema: user state only (course content lives in the repo).
-- Every table is RLS-scoped to the owning user.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users manage their own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create table public.user_stats (
  user_id uuid primary key references auth.users (id) on delete cascade,
  xp integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_date date,
  updated_at timestamptz not null default now()
);

alter table public.user_stats enable row level security;

create policy "Users manage their own stats"
  on public.user_stats for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table public.lesson_completions (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null,
  first_completed_at timestamptz not null default now(),
  best_score real not null default 0,
  times_completed integer not null default 1,
  primary key (user_id, lesson_id)
);

alter table public.lesson_completions enable row level security;

create policy "Users manage their own completions"
  on public.lesson_completions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- SM-2 spaced-repetition state, one row per (user, character).
-- character_id is a stable slug from src/content/characters.ts (e.g. ko_kai).
create table public.srs_cards (
  user_id uuid not null references auth.users (id) on delete cascade,
  character_id text not null,
  ease_factor real not null default 2.5,
  interval_days real not null default 0,
  repetitions integer not null default 0,
  lapses integer not null default 0,
  due_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  primary key (user_id, character_id)
);

alter table public.srs_cards enable row level security;

create policy "Users manage their own cards"
  on public.srs_cards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index srs_cards_due_idx on public.srs_cards (user_id, due_at);
