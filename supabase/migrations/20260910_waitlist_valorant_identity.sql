-- Run once in Supabase SQL Editor for an existing GameSense Lab waitlist table.
-- Existing entries keep NULL values. No rows are deleted or replaced.
begin;

alter table public.waitlist
  add column valorant_name text
    check (char_length(btrim(valorant_name)) between 1 and 80 and position('#' in valorant_name) = 0),
  add column valorant_tagline text
    check (char_length(valorant_tagline) between 1 and 32 and valorant_tagline !~ '[[:space:]#]'),
  add constraint waitlist_valorant_identity_pair check (
    (valorant_name is null and valorant_tagline is null)
    or (main_game = 'VALORANT' and valorant_name is not null and valorant_tagline is not null)
  );

-- The existing table uses column-level grants: allow the two new inputs too.
grant insert (valorant_name, valorant_tagline)
  on public.waitlist to anon, authenticated;

-- Existing RLS and the prohibition on public SELECT/UPDATE/DELETE stay in place.
notify pgrst, 'reload schema';
commit;
