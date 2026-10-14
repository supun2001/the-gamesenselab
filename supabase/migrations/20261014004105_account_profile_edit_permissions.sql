-- Existing owner-only RLS policies enforce row ownership for these column grants.
-- Applied to xhlvxxeaobztxohjuhko using the Supabase migration tool.
grant insert (id, display_name, updated_at) on public.user_profiles to authenticated;
grant update (display_name, updated_at) on public.user_profiles to authenticated;
