-- ============================================================
-- MargDarshak — Complete Database Schema (safe to re-run)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. USERS
create table if not exists users (
  id          uuid default gen_random_uuid() primary key,
  clerk_id    text unique not null,
  email       text,
  full_name   text,
  avatar_url  text,
  phone       text,
  created_at  timestamptz default now()
);
create index if not exists idx_users_clerk_id on users (clerk_id);

-- 2. TRIPS
create table if not exists trips (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references users(id) on delete cascade not null,
  intent      text,
  origin      text,
  destination text,
  created_at  timestamptz default now()
);
create index if not exists idx_trips_user_id on trips (user_id);

-- 3. AI HISTORY
create table if not exists ai_history (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references users(id) on delete cascade not null,
  prompt      text,
  response    text,
  created_at  timestamptz default now()
);
create index if not exists idx_ai_history_user_id on ai_history (user_id);

-- 4. INTENTS
create table if not exists intents (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references users(id) on delete cascade not null,
  query       text not null,
  created_at  timestamptz default now()
);
create index if not exists idx_intents_user_id on intents (user_id);

-- ============================================================
-- RLS (drop + recreate to be safe on re-runs)
-- ============================================================

alter table users enable row level security;
alter table trips enable row level security;
alter table ai_history enable row level security;
alter table intents enable row level security;

-- Users
drop policy if exists "Users can read own data" on users;
drop policy if exists "Users can insert own data" on users;
drop policy if exists "Users can update own data" on users;
create policy "Users can read own data" on users for select using (true);
create policy "Users can insert own data" on users for insert with check (true);
create policy "Users can update own data" on users for update using (true);

-- Trips
drop policy if exists "Users can read own trips" on trips;
drop policy if exists "Users can insert own trips" on trips;
drop policy if exists "Users can delete own trips" on trips;
create policy "Users can read own trips" on trips for select using (user_id in (select id from users));
create policy "Users can insert own trips" on trips for insert with check (user_id in (select id from users));
create policy "Users can delete own trips" on trips for delete using (user_id in (select id from users));

-- AI History
drop policy if exists "Users can read own ai_history" on ai_history;
drop policy if exists "Users can insert own ai_history" on ai_history;
create policy "Users can read own ai_history" on ai_history for select using (user_id in (select id from users));
create policy "Users can insert own ai_history" on ai_history for insert with check (user_id in (select id from users));

-- Intents
drop policy if exists "Users can read own intents" on intents;
drop policy if exists "Users can insert own intents" on intents;
drop policy if exists "Users can delete own intents" on intents;
create policy "Users can read own intents" on intents for select using (user_id in (select id from users));
create policy "Users can insert own intents" on intents for insert with check (user_id in (select id from users));
create policy "Users can delete own intents" on intents for delete using (user_id in (select id from users));
