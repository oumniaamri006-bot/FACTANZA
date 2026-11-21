-- Permessi di base per gli utenti con account (le righe visibili restano limitate dalle policy RLS).
-- I visitatori senza account (anon) non hanno accesso a nessuna tabella.
grant usage on schema public to authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.votes to authenticated;
grant select, insert, delete on public.reminders to authenticated;
grant insert on public.events to authenticated;
grant usage on sequence public.events_id_seq to authenticated;

revoke all on public.profiles, public.votes, public.reminders, public.events from anon;
