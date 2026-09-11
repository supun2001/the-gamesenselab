-- Run after schema.sql (also safe for the existing waitlist table).
begin;
create table if not exists public.waitlist_email_queue (
  waitlist_id uuid primary key references public.waitlist(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'failed')),
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  claim_token uuid,
  sent_at timestamptz,
  last_error text,
  created_at timestamptz not null default now()
);
alter table public.waitlist_email_queue enable row level security;
revoke all on public.waitlist_email_queue from public, anon, authenticated;
grant select, update on public.waitlist_email_queue to service_role;

create or replace function public.queue_waitlist_welcome()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.waitlist_email_queue(waitlist_id) values (new.id)
  on conflict (waitlist_id) do nothing;
  return new;
end;
$$;
revoke all on function public.queue_waitlist_welcome() from public, anon, authenticated;
drop trigger if exists on_waitlist_joined on public.waitlist;
create trigger on_waitlist_joined after insert on public.waitlist
for each row execute function public.queue_waitlist_welcome();

-- One atomic claim per message: concurrent invocations cannot claim the same row.
create or replace function public.claim_waitlist_email()
returns table(waitlist_id uuid, email text, attempts integer, claim_token uuid)
language plpgsql security definer set search_path = '' as $$
begin
  update public.waitlist_email_queue q set status = 'failed', last_error = 'retry_limit'
  where q.status in ('pending', 'sending') and q.attempts >= 5 and q.available_at <= now();
  return query
  with candidate as (
    select q.waitlist_id from public.waitlist_email_queue q
    where q.status in ('pending', 'sending') and q.attempts < 5 and q.available_at <= now()
    order by q.available_at, q.created_at for update skip locked limit 1
  ), claimed as (
    update public.waitlist_email_queue q
    set status = 'sending', attempts = q.attempts + 1,
        claim_token = gen_random_uuid(), available_at = now() + interval '5 minutes'
    from candidate c where q.waitlist_id = c.waitlist_id
    returning q.waitlist_id, q.attempts, q.claim_token
  )
  select c.waitlist_id, w.email, c.attempts, c.claim_token
  from claimed c join public.waitlist w on w.id = c.waitlist_id;
end;
$$;
revoke all on function public.claim_waitlist_email() from public, anon, authenticated;
grant execute on function public.claim_waitlist_email() to service_role;
-- Deliberately do not email people who joined before this migration.
notify pgrst, 'reload schema';
commit;
