-- Additive migration: existing records and historical migrations remain untouched.
create table public.altheia_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(btrim(email)) and length(email) between 3 and 254),
  game text check (game in ('CS2','VALORANT','League of Legends','Dota 2','Fortnite','Other')),
  role text check (role in ('individual','team')),
  marketing_consent boolean not null default false,
  consent_version text, consent_at timestamptz,
  created_at timestamptz not null default now(),
  check ((marketing_consent and consent_version is not null and consent_at is not null) or (not marketing_consent and consent_version is null and consent_at is null))
);
create table public.altheia_team_interest (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 100),
  email text not null check (email = lower(btrim(email)) and length(email) between 3 and 254),
  game text not null check (game in ('CS2','VALORANT','League of Legends','Dota 2','Fortnite','Other')),
  team_size integer not null check (team_size between 2 and 100),
  level text check (length(level) <= 100), challenge text not null check (length(challenge) between 1 and 2000),
  contact_permission boolean not null check (contact_permission),
  consent_version text not null, consent_at timestamptz not null,
  created_at timestamptz not null default now()
);
create table public.altheia_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 100),
  email text not null check (email = lower(btrim(email)) and length(email) between 3 and 254),
  category text not null check (category in ('General','Team testing','Creator partnership','Business enquiry','Privacy request')),
  message text not null check (length(message) between 1 and 4000),
  created_at timestamptz not null default now()
);
create table public.altheia_rate_limits (
  key_hash text not null, bucket bigint not null, hits integer not null default 1,
  expires_at timestamptz not null,
  primary key (key_hash, bucket)
);
alter table public.altheia_waitlist enable row level security;
alter table public.altheia_team_interest enable row level security;
alter table public.altheia_enquiries enable row level security;
alter table public.altheia_rate_limits enable row level security;
revoke all on public.altheia_waitlist, public.altheia_team_interest, public.altheia_enquiries, public.altheia_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on public.altheia_waitlist, public.altheia_team_interest, public.altheia_enquiries, public.altheia_rate_limits to service_role;
create or replace function public.altheia_consume_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean language plpgsql security definer set search_path = '' as $$
declare current_hits integer;
begin
  if p_key !~ '^[a-f0-9]{64}$' or p_limit < 1 or p_limit > 100 or p_window_seconds not in (60, 3600) then
    raise exception 'Invalid limiter arguments';
  end if;
  delete from public.altheia_rate_limits where expires_at < now();
  insert into public.altheia_rate_limits (key_hash, bucket, hits, expires_at)
  values (p_key, floor(extract(epoch from now()) / p_window_seconds)::bigint, 1, now() + make_interval(secs => p_window_seconds * 2))
  on conflict (key_hash, bucket) do update set hits = public.altheia_rate_limits.hits + 1
  returning hits into current_hits;
  return current_hits <= p_limit;
end;
$$;
revoke all on function public.altheia_consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.altheia_consume_rate_limit(text, integer, integer) to service_role;
