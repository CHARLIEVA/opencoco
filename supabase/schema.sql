create table if not exists public.cases (
  id text primary key,
  slug text not null unique,
  model text not null check (model in ('gpt-image-2', 'nano-banana')),
  title jsonb not null,
  summary jsonb not null,
  prompt jsonb not null,
  takeaways jsonb not null,
  tags jsonb not null default '[]'::jsonb,
  source_name text not null,
  source_url text not null,
  author text not null,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  palette jsonb not null
);

create table if not exists public.favorites (
  user_id uuid not null,
  case_id text not null references public.cases(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, case_id)
);

alter table public.cases enable row level security;
alter table public.favorites enable row level security;

create policy "public can read cases"
on public.cases
for select
to anon, authenticated
using (true);

create policy "users can read own favorites"
on public.favorites
for select
to authenticated
using (auth.uid() = user_id);

create policy "users can insert own favorites"
on public.favorites
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users can delete own favorites"
on public.favorites
for delete
to authenticated
using (auth.uid() = user_id);
