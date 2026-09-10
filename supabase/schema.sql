-- Run once in a new Supabase project's SQL editor, as the project owner.
begin;

create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(btrim(first_name)) between 1 and 80),
  email text unique not null check (char_length(email) <= 254 and email = lower(btrim(email)) and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  main_game text not null check (main_game in ('VALORANT', 'League of Legends', 'CS2', 'Fortnite', 'Dota 2', 'Other')),
  rank text check (char_length(rank) <= 80),
  valorant_name text check (char_length(btrim(valorant_name)) between 1 and 80 and position('#' in valorant_name) = 0),
  valorant_tagline text check (char_length(valorant_tagline) between 1 and 32 and valorant_tagline !~ '[[:space:]#]'),
  constraint waitlist_valorant_identity_pair check (
    (valorant_name is null and valorant_tagline is null)
    or (main_game = 'VALORANT' and valorant_name is not null and valorant_tagline is not null)
  ),
  created_at timestamptz not null default now()
);
alter table public.waitlist enable row level security;
revoke all on public.waitlist from anon, authenticated;
grant insert (first_name, email, main_game, rank, valorant_name, valorant_tagline) on public.waitlist to anon, authenticated;
create policy "Accept valid waitlist submissions" on public.waitlist for insert to anon, authenticated
  with check (char_length(btrim(first_name)) between 1 and 80 and email = lower(btrim(email)));
-- No public SELECT/UPDATE/DELETE policies or grants. INSERT must not request returned rows.

create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.user_profiles enable row level security;
revoke all on public.user_profiles from anon, authenticated;
grant select on public.user_profiles to authenticated;
grant insert (id, display_name), update (display_name) on public.user_profiles to authenticated;
create policy "Read own profile" on public.user_profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Insert own profile" on public.user_profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "Update own profile" on public.user_profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Works even when email confirmation means signup returns no authenticated session.
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.user_profiles (id, display_name)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 80))
  on conflict (id) do update set display_name = excluded.display_name, updated_at = now();
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create function public.touch_profile() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
revoke all on function public.touch_profile() from public, anon, authenticated;
create trigger on_profile_updated before update on public.user_profiles for each row execute function public.touch_profile();

-- No input email: a caller can only check the verified email belonging to their auth.uid().
create function public.my_waitlist_status() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.waitlist w join auth.users u on w.email = lower(btrim(u.email))
    where u.id = (select auth.uid()) and u.email_confirmed_at is not null
  );
$$;
revoke all on function public.my_waitlist_status() from public, anon, authenticated;
grant execute on function public.my_waitlist_status() to authenticated;
commit;
