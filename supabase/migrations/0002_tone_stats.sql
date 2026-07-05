-- Per-tone hit/miss tallies from tone_pair drills, e.g.
-- {"falling": {"correct": 4, "wrong": 2}}. Read/written whole by the
-- client snapshot sync; feeds weakness-targeted review sessions.
alter table public.user_stats
  add column tone_stats jsonb not null default '{}'::jsonb;
