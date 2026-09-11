-- Run LAST, after deploying the worker and adding waitlist_worker_secret to Vault.
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

do $$
begin
  if not exists (select 1 from vault.decrypted_secrets where name = 'waitlist_worker_secret') then
    raise exception 'Add waitlist_worker_secret in Supabase Vault first';
  end if;
end;
$$;

-- Calling schedule with the same name updates the existing schedule.
select cron.schedule('gamesense-waitlist-welcome', '* * * * *', $job$
  select net.http_post(
    url := 'https://xhlvxxeaobztxohjuhko.supabase.co/functions/v1/waitlist-welcome',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Worker-Secret', (select decrypted_secret from vault.decrypted_secrets where name = 'waitlist_worker_secret' limit 1)
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  );
$job$);
