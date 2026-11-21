-- Classifica generale di tutte le persone registrate: chi non ha ancora giocato questa settimana
-- compare con 0 punti. Livelli e temi non sono più usati dall'app (restano i parametri per
-- compatibilità, ma vengono ignorati).
create or replace function public.weekly_leaderboard(p_scope text default 'generale', p_value text default null, p_limit int default 100)
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
  invites as (
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
  everyone as (
    select p.id as user_id, p.name, p.leaderboard_opt_in,
      coalesce(t.points, 0) as points, coalesce(t.days, 0) as days,
      coalesce(t.total_ms, 0) as total_ms, coalesce(t.news_correct, 0) as news_correct
    from public.profiles p
    left join totals t on t.user_id = p.id
  ),
  ranked as (
    select e.*,
      rank() over (order by points desc, days desc,
        case when days > 0 then total_ms end asc nulls last, news_correct desc) as rnk,
      count(*) over () as players
    from everyone e
  )
  select rnk,
    case when user_id = auth.uid() or leaderboard_opt_in then coalesce(nullif(trim(name), ''), 'Utente') else 'Utente anonimo' end,
    points::bigint, days::bigint, total_ms::bigint, news_correct::bigint, user_id = auth.uid(), players, 'generale'
  from ranked
  where rnk <= p_limit or user_id = auth.uid()
  order by rnk, name;
$$;
revoke all on function public.weekly_leaderboard(text, text, int) from public, anon;
grant execute on function public.weekly_leaderboard(text, text, int) to authenticated;
