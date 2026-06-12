-- Real auth + role-based RLS. Replaces the interim permissive write policies
-- (which existed only because the app talked to Postgres with the public key
-- and no identity). Now sign-in goes through Supabase Auth, so auth.uid() is
-- present and policies can enforce client/pilot/admin boundaries.

-- ---------------------------------------------------------------------------
-- Link public.users (text PKs like usr-001) to auth.users (uuid).
-- ---------------------------------------------------------------------------
alter table public.users
  add column if not exists auth_id uuid unique references auth.users(id) on delete set null;

-- ---------------------------------------------------------------------------
-- Helper functions. SECURITY DEFINER so they bypass RLS (avoids recursion when
-- a policy on `users` needs to read the caller's own row). Locked search_path.
-- ---------------------------------------------------------------------------
create or replace function public.app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users where auth_id = auth.uid()
$$;

create or replace function public.current_email()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select email from public.users where auth_id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.app_role() = 'admin', false)
$$;

create or replace function public.owns_pilot(pid text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.pilots p
    join public.users u on u.id = p.user_id
    where p.id = pid and u.auth_id = auth.uid()
  )
$$;

-- ---------------------------------------------------------------------------
-- On auth signup, upsert the matching public.users row. For seeded demo
-- accounts (same email already present) this just links auth_id and preserves
-- their existing id/role/status; for brand-new client signups it creates a
-- fresh client row. Runs as definer so it bypasses RLS.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, auth_id, name, email, role, status)
  values (
    'usr-' || left(replace(new.id::text, '-', ''), 10),
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    'active'
  )
  on conflict (email) do update set auth_id = excluded.auth_id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Replace the permissive "public write" policies with role-based ones.
-- Public SELECT stays open where the UI is public (browse, profiles, reviews,
-- categories); everything that mutates is now gated.
-- ---------------------------------------------------------------------------

-- users -------------------------------------------------------------------
drop policy if exists "public write users" on public.users;
drop policy if exists "public read users" on public.users;
create policy "users readable by self or admin" on public.users
  for select using (is_admin() or auth_id = auth.uid());
create policy "users updatable by admin" on public.users
  for update using (is_admin()) with check (is_admin());

-- categories --------------------------------------------------------------
drop policy if exists "public write categories" on public.categories;
create policy "categories writable by admin" on public.categories
  for all using (is_admin()) with check (is_admin());

-- pilots ------------------------------------------------------------------
drop policy if exists "public write pilots" on public.pilots;
create policy "pilots updatable by owner or admin" on public.pilots
  for update using (is_admin() or owns_pilot(id)) with check (is_admin() or owns_pilot(id));
create policy "pilots insertable by admin" on public.pilots
  for insert with check (is_admin());
create policy "pilots deletable by admin" on public.pilots
  for delete using (is_admin());

-- faa_verifications -------------------------------------------------------
drop policy if exists "public read verifications" on public.faa_verifications;
drop policy if exists "public write verifications" on public.faa_verifications;
create policy "verifications readable by owner or admin" on public.faa_verifications
  for select using (is_admin() or owns_pilot(pilot_id));
create policy "verifications insertable by owner" on public.faa_verifications
  for insert with check (owns_pilot(pilot_id));
create policy "verifications updatable by admin" on public.faa_verifications
  for update using (is_admin()) with check (is_admin());

-- reviews -----------------------------------------------------------------
drop policy if exists "public read reviews" on public.reviews;
drop policy if exists "public write reviews" on public.reviews;
-- Published reviews are public; flagged/removed visible only to admin/owner.
create policy "reviews readable" on public.reviews
  for select using (status = 'published' or is_admin() or owns_pilot(pilot_id));
-- Signed-in users may leave reviews; moderation (update) is admin-only.
create policy "reviews insertable by authenticated" on public.reviews
  for insert with check (auth.uid() is not null);
create policy "reviews updatable by admin" on public.reviews
  for update using (is_admin()) with check (is_admin());

-- quote_requests ----------------------------------------------------------
drop policy if exists "public read quotes" on public.quote_requests;
drop policy if exists "public write quotes" on public.quote_requests;
-- A lead is visible to the addressed pilot, an admin, or the client who sent it.
create policy "quotes readable by participants" on public.quote_requests
  for select using (
    is_admin() or owns_pilot(pilot_id) or client_email = current_email()
  );
-- Lead capture stays frictionless: anyone (even logged-out) can request a quote.
create policy "quotes insertable by anyone" on public.quote_requests
  for insert with check (true);
create policy "quotes updatable by pilot or admin" on public.quote_requests
  for update using (is_admin() or owns_pilot(pilot_id))
  with check (is_admin() or owns_pilot(pilot_id));
