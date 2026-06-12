-- SkyHire schema — mirrors src/data/types.ts (PRD §11).
-- Column names are snake_case; the Supabase repositories map them to the
-- camelCase domain shapes the UI renders. Enum-like fields use text + CHECK
-- constraints matching the TypeScript string unions exactly.

-- ---------------------------------------------------------------------------
-- users — platform accounts (clients, pilots, admins). PRD §11.
-- ---------------------------------------------------------------------------
create table public.users (
  id          text primary key,
  name        text not null,
  email       text not null unique,
  role        text not null check (role in ('client', 'pilot', 'admin')),
  status      text not null default 'active' check (status in ('active', 'flagged', 'suspended')),
  flag_reason text,
  created_at  date not null default current_date
);

-- ---------------------------------------------------------------------------
-- categories — admin-managed marketplace taxonomy behind specialty filters.
-- ---------------------------------------------------------------------------
create table public.categories (
  slug   text primary key,
  label  text not null,
  active boolean not null default true
);

-- ---------------------------------------------------------------------------
-- pilots — public directory profiles. specialties is text[]; portfolio is
-- jsonb (array of {id, imageUrl, caption}) to match PortfolioItem[].
-- ---------------------------------------------------------------------------
create table public.pilots (
  id                  text primary key,
  user_id             text references public.users(id) on delete set null,
  name                text not null,
  business_name       text not null,
  avatar_url          text not null default '',
  bio                 text not null default '',
  location            text not null default '',
  service_area_miles  integer not null default 0,
  specialties         text[] not null default '{}',
  pricing_model       text not null check (pricing_model in ('hourly', 'per-project', 'per-day')),
  starting_price      integer not null default 0,
  verification_status text not null default 'unverified'
                        check (verification_status in ('unverified', 'pending', 'verified', 'rejected')),
  rating_avg          numeric(2,1) not null default 0,
  review_count        integer not null default 0,
  response_time_hours integer not null default 24,
  available           boolean not null default true,
  featured            boolean not null default false,
  portfolio           jsonb not null default '[]'
);

create index pilots_verification_status_idx on public.pilots (verification_status);
create index pilots_featured_idx on public.pilots (featured);

-- ---------------------------------------------------------------------------
-- faa_verifications — certification submissions + admin decisions (PRD §8.4).
-- ---------------------------------------------------------------------------
create table public.faa_verifications (
  id                 text primary key,
  pilot_id           text not null references public.pilots(id) on delete cascade,
  pilot_name         text not null,
  certificate_type   text not null,
  certificate_number text not null,
  status             text not null default 'pending'
                       check (status in ('unverified', 'pending', 'verified', 'rejected')),
  submitted_at       date not null default current_date,
  verified_at        date,
  expires_at         date
);

create index faa_verifications_pilot_status_idx on public.faa_verifications (pilot_id, status);

-- ---------------------------------------------------------------------------
-- reviews — star ratings + structured tags, with moderation status (PRD §8.3).
-- ---------------------------------------------------------------------------
create table public.reviews (
  id           text primary key,
  pilot_id     text not null references public.pilots(id) on delete cascade,
  client_name  text not null,
  rating       integer not null check (rating between 1 and 5),
  text         text not null default '',
  tags         text[] not null default '{}',
  status       text not null default 'published' check (status in ('published', 'flagged', 'removed')),
  verified_job boolean not null default false,
  created_at   date not null default current_date
);

create index reviews_pilot_status_idx on public.reviews (pilot_id, status);

-- ---------------------------------------------------------------------------
-- quote_requests — lead capture → pilot inbox + client job history (PRD §8.5).
-- ---------------------------------------------------------------------------
create table public.quote_requests (
  id           text primary key,
  pilot_id     text not null references public.pilots(id) on delete cascade,
  client_name  text not null,
  client_email text not null,
  job_type     text not null,
  location     text not null,
  budget_range text not null,
  details      text not null default '',
  status       text not null default 'new' check (status in ('new', 'responded', 'closed')),
  created_at   date not null default current_date
);

create index quote_requests_pilot_idx on public.quote_requests (pilot_id);
create index quote_requests_client_email_idx on public.quote_requests (client_email);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- NOTE: Auth is still the front end's mock/localStorage layer this phase, so
-- the browser talks to Postgres with the anon key and there is no signed-in
-- identity for RLS to key off. Policies are therefore permissive (public read
-- everywhere; public writes) to keep the demo functional. Tightening these to
-- role-based RLS is the immediate follow-up once Supabase Auth replaces the
-- mock layer. See PR notes.
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.pilots enable row level security;
alter table public.faa_verifications enable row level security;
alter table public.reviews enable row level security;
alter table public.quote_requests enable row level security;

create policy "public read users"          on public.users             for select using (true);
create policy "public write users"         on public.users             for all    using (true) with check (true);

create policy "public read categories"     on public.categories        for select using (true);
create policy "public write categories"    on public.categories        for all    using (true) with check (true);

create policy "public read pilots"         on public.pilots            for select using (true);
create policy "public write pilots"        on public.pilots            for all    using (true) with check (true);

create policy "public read verifications"  on public.faa_verifications for select using (true);
create policy "public write verifications" on public.faa_verifications for all    using (true) with check (true);

create policy "public read reviews"        on public.reviews           for select using (true);
create policy "public write reviews"       on public.reviews           for all    using (true) with check (true);

create policy "public read quotes"         on public.quote_requests    for select using (true);
create policy "public write quotes"        on public.quote_requests    for all    using (true) with check (true);
