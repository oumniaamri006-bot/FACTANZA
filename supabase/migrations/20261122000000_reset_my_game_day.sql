-- Solo per l'MVP: l'utente può cancellare le proprie partite di oggi e rifare il quiz.
create or replace function public.reset_my_game_day() returns void
language sql security definer set search_path = '' as $$
  delete from public.game_plays
  where user_id = auth.uid() and day = (now() at time zone 'Europe/Rome')::date;
$$;
revoke all on function public.reset_my_game_day() from public, anon;
grant execute on function public.reset_my_game_day() to authenticated;
