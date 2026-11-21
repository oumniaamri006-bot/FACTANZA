-- Minigiochi a una domanda: punteggio massimo 100 per ogni gioco (anche il quiz della domenica)
-- e tempo minimo plausibile più basso (1 s, o 0,4 s per elemento in "Metti in ordine").
create or replace function public.record_game_play(
  p_game text, p_topic text, p_score int, p_correct int, p_items int, p_duration_ms int
) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_today date := (now() at time zone 'Europe/Rome')::date;
  v_min_ms int := greatest(1000, p_items * 400);
begin
  if auth.uid() is null then raise exception 'Serve l’accesso'; end if;
  if p_score < 0 or p_score > 100 then raise exception 'Punteggio non valido'; end if;
  if p_duration_ms < v_min_ms then raise exception 'Troppo veloce per essere vero'; end if;
  insert into public.game_plays (user_id, day, game, topic, score, correct, items, duration_ms, news_correct)
  values (auth.uid(), v_today, p_game, left(p_topic, 40), p_score, p_correct, p_items, p_duration_ms,
          p_game = 'notizia' and p_score > 0);
end;
$$;
revoke all on function public.record_game_play(text, text, int, int, int, int) from public, anon;
grant execute on function public.record_game_play(text, text, int, int, int, int) to authenticated;

-- Nuove regole: si riparte da zero per tutti.
delete from public.game_plays;
