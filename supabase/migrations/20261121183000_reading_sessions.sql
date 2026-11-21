-- Le letture sono inviate a pezzi (quando si lascia l'articolo o si nasconde la scheda):
-- le raggruppiamo per read_id, così una lettura conta una volta sola.
drop view if exists analytics.article_stats;

create view analytics.article_stats as
with reads as (
  select
    props ->> 'read_id' as read_id,
    user_id,
    props ->> 'article_id' as articolo,
    props ->> 'topic' as tema,
    sum((props ->> 'seconds')::numeric) as secondi,
    max((props ->> 'max_scroll')::numeric) as scroll
  from public.events
  where name = 'article_read'
  group by 1, 2, 3, 4
)
select
  articolo,
  tema,
  count(*) as letture,
  count(distinct user_id) as lettori,
  round(avg(secondi), 0) as secondi_medi,
  round(avg(scroll), 0) as scroll_medio_pct,
  round(100.0 * avg(case when scroll >= 90 then 1 else 0 end), 0) as completati_pct
from reads
group by articolo, tema
order by letture desc;
