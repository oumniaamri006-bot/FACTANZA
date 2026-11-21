-- Minigiochi informativi e classifica settimanale individuale.

alter table public.profiles
  add column leaderboard_opt_in boolean not null default true;

create table public.game_plays (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  day date not null,
  game text not null check (game ~ '^[a-z-]{3,20}$'),
  topic text check (char_length(topic) <= 40),
  score int not null check (score between 0 and 400),
  correct int not null default 0 check (correct between 0 and 10),
  items int not null default 0 check (items between 0 and 10),
  duration_ms int not null check (duration_ms between 0 and 600000),
  news_correct boolean not null default false,
  created_at timestamptz not null default now(),
  -- Un solo tentativo per gioco al giorno.
  unique (user_id, day, game)
);

alter table public.game_plays enable row level security;
create policy "Giochi: lettura propria" on public.game_plays
  for select to authenticated using ((select auth.uid()) = user_id);
grant select on public.game_plays to authenticated;
create index game_plays_day_idx on public.game_plays (day);

-- Registrazione di un gioco con controlli antibaro: solo oggi (ora di Roma), punteggio entro il
-- massimo del gioco, tempo minimo plausibile, un tentativo al giorno (vincolo unique).
create function public.record_game_play(
  p_game text, p_topic text, p_score int, p_correct int, p_items int, p_duration_ms int
) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_today date := (now() at time zone 'Europe/Rome')::date;
  v_max int := case when p_game = 'riepilogo' then 400 else 100 end;
  v_min_ms int := case when p_game = 'notizia' then 1500 else greatest(2000, p_items * 800) end;
begin
  if auth.uid() is null then raise exception 'Serve l’accesso'; end if;
  if p_score < 0 or p_score > v_max then raise exception 'Punteggio non valido'; end if;
  if p_duration_ms < v_min_ms then raise exception 'Troppo veloce per essere vero'; end if;
  insert into public.game_plays (user_id, day, game, topic, score, correct, items, duration_ms, news_correct)
  values (auth.uid(), v_today, p_game, left(p_topic, 40), p_score, p_correct, p_items, p_duration_ms,
          p_game = 'notizia' and p_score > 0);
end;
$$;
revoke all on function public.record_game_play(text, text, int, int, int, int) from public, anon;
grant execute on function public.record_game_play(text, text, int, int, int, int) to authenticated;

-- Classifica settimanale (lunedì–domenica, ora di Roma).
-- p_scope: 'generale' | 'livello' (p_value: 'principiante' | 'esperto') | 'tema' (p_value: nome tema).
-- Livello: esperto se prima di questa settimana ha giocato almeno 7 giorni (ipotesi, vedi GIOCHI.md).
-- Restituisce i primi p_limit e sempre la riga di chi chiama.
create function public.weekly_leaderboard(p_scope text default 'generale', p_value text default null, p_limit int default 100)
returns table (
  rank bigint, name text, points bigint, days bigint, total_ms bigint, news_correct bigint,
  is_me boolean, players bigint, level text
)
language sql stable security definer set search_path = '' as $$
  with params as (
    select date_trunc('week', (now() at time zone 'Europe/Rome'))::date as week_start
  ),
  week as (
    select g.* from public.game_plays g, params where g.day >= params.week_start and g.day < params.week_start + 7
  ),
  per_day as (
    select user_id, day, count(*) as games, sum(score) as points,
      case when extract(isodow from day) = 7 then 2 else 4 end as needed
    from week group by user_id, day
  ),
  history as (
    select user_id, count(distinct day) as past_days
    from public.game_plays g, params where g.day < params.week_start group by user_id
  ),
  invites as (
    -- Amici iscritti con il tuo link che hanno giocato almeno una volta questa settimana (max 3).
    select left(inviter.id::text, 8) as code, least(3, count(distinct friend.id)) as friends
    from public.profiles friend
    join public.profiles inviter on left(inviter.id::text, 8) = friend.first_touch ->> 'invito'
    where exists (select 1 from week w where w.user_id = friend.id)
    group by 1
  ),
  totals as (
    select
      d.user_id,
      sum(d.points)
        + 50 * count(*) filter (where d.games >= d.needed)
        + case when count(*) >= 7 then 200 when count(*) >= 5 then 100 when count(*) >= 3 then 50 else 0 end
        + 30 * coalesce(max(i.friends), 0) as points,
      count(*) as days,
      (select sum(duration_ms) from week w where w.user_id = d.user_id) as total_ms,
      (select count(*) from week w where w.user_id = d.user_id and w.news_correct) as news_correct
    from per_day d
    left join invites i on i.code = left(d.user_id::text, 8)
    group by d.user_id
  ),
  theme as (
    select user_id, sum(score) as points, count(distinct day) as days, sum(duration_ms) as total_ms,
      count(*) filter (where news_correct) as news_correct
    from week where topic = p_value group by user_id
  ),
  scored as (
    select s.*, p.name, p.leaderboard_opt_in,
      case when coalesce(h.past_days, 0) >= 7 then 'esperto' else 'principiante' end as level
    from (
      select user_id, points, days, total_ms, news_correct from totals where p_scope <> 'tema'
      union all
      select user_id, points, days, total_ms, news_correct from theme where p_scope = 'tema'
    ) s
    join public.profiles p on p.id = s.user_id
    left join history h on h.user_id = s.user_id
  ),
  filtered as (
    select * from scored where p_scope <> 'livello' or level = p_value
  ),
  ranked as (
    select f.*,
      rank() over (order by points desc, days desc, total_ms asc, news_correct desc) as rnk,
      count(*) over () as players
    from filtered f
  )
  select rnk, case when user_id = auth.uid() or leaderboard_opt_in then name else 'Utente anonimo' end,
    points, days, total_ms, news_correct, user_id = auth.uid(), players, level
  from ranked
  where rnk <= p_limit or user_id = auth.uid()
  order by rnk;
$$;
revoke all on function public.weekly_leaderboard(text, text, int) from public, anon;
grant execute on function public.weekly_leaderboard(text, text, int) to authenticated;

-- Statistiche dei giochi per la redazione.
create view analytics.game_stats as
select game as gioco, day as giorno, count(*) as partite, round(avg(score), 0) as punti_medi,
  round(avg(duration_ms) / 1000.0, 1) as secondi_medi,
  round(100.0 * avg(case when items > 0 then correct::numeric / items end), 0) as risposte_giuste_pct
from public.game_plays group by game, day order by day desc, game;
