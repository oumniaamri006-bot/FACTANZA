-- Più dati per utente: dati dichiarati nel profilo, provenienza, nuove viste statistiche.

-- ============================================================================
-- Profilo: dati dichiarati dall'utente (onboarding "Parlaci di te", modificabili dal profilo)
-- ============================================================================
alter table public.profiles
  add column birth_year int check (birth_year between 1900 and 2030),
  add column region text check (char_length(region) <= 40),
  add column occupation text check (char_length(occupation) <= 40),
  add column gender text check (char_length(gender) <= 40),
  add column referral text check (char_length(referral) <= 40),
  -- Provenienza alla prima visita: sito di provenienza e parametri utm_*.
  add column first_touch jsonb not null default '{}' check (pg_column_size(first_touch) <= 2000),
  add column last_seen_at timestamptz;

-- Alla registrazione salviamo anche la provenienza passata dall'app.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, name, first_touch)
  values (
    new.id,
    coalesce(nullif(left(trim(new.raw_user_meta_data ->> 'name'), 30), ''), 'Facta Lover'),
    case
      when jsonb_typeof(new.raw_user_meta_data -> 'first_touch') = 'object'
        and pg_column_size(new.raw_user_meta_data -> 'first_touch') <= 2000
      then new.raw_user_meta_data -> 'first_touch'
      else '{}'::jsonb
    end
  );
  return new;
end;
$$;

-- Statistiche d'uso: solo con consenso e solo da 14 anni in su (età del consenso digitale in Italia).
drop policy "Eventi: inserimento con consenso" on public.events;
create policy "Eventi: inserimento con consenso" on public.events
  for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.analytics_consent
        and (p.birth_year is null or p.birth_year <= extract(year from now())::int - 14)
    )
  );

-- ============================================================================
-- Nuove viste statistiche
-- ============================================================================

-- Scheda per utente: chi è, quanto usa l'app, cosa legge.
create view analytics.users as
with reading as (
  select user_id,
    round(sum((props ->> 'seconds')::numeric) / 60, 1) as minuti_letti,
    count(distinct props ->> 'read_id') as articoli_letti
  from public.events where name = 'article_read' group by user_id
),
favorite as (
  select distinct on (user_id) user_id, props ->> 'topic' as tema_preferito
  from public.events where name = 'article_read'
  group by user_id, props ->> 'topic'
  order by user_id, sum((props ->> 'seconds')::numeric) desc
),
sessions as (
  select user_id, count(distinct session_id) as sessioni, max(created_at) as ultima_attivita
  from public.events group by user_id
),
device as (
  select distinct on (user_id) user_id, props ->> 'device' as dispositivo, props ->> 'os' as sistema
  from public.events where name = 'session_start'
  order by user_id, created_at desc
),
counts as (
  select p.id as user_id,
    (select count(*) from public.votes v where v.user_id = p.id) as voti,
    (select count(*) from public.reminders r where r.user_id = p.id) as promemoria
  from public.profiles p
)
select
  p.id as user_id,
  p.name as nome,
  case
    when p.birth_year is null then null
    else extract(year from now())::int - p.birth_year
  end as eta,
  p.region as regione,
  p.occupation as occupazione,
  p.gender as genere,
  p.referral as come_ci_ha_conosciuto,
  p.first_touch ->> 'utm_source' as utm_source,
  p.first_touch ->> 'referrer' as provenienza,
  p.interests as interessi,
  p.formats as formati,
  p.analytics_consent as consenso_statistiche,
  p.created_at as registrato_il,
  coalesce(p.last_seen_at, s.ultima_attivita) as ultimo_accesso,
  coalesce(s.sessioni, 0) as sessioni,
  coalesce(r.minuti_letti, 0) as minuti_letti,
  coalesce(r.articoli_letti, 0) as articoli_letti,
  f.tema_preferito,
  c.voti,
  c.promemoria,
  d.dispositivo,
  d.sistema
from public.profiles p
left join reading r on r.user_id = p.id
left join favorite f on f.user_id = p.id
left join sessions s on s.user_id = p.id
left join device d on d.user_id = p.id
left join counts c on c.user_id = p.id
order by p.created_at desc;

-- Chi sono gli iscritti.
create view analytics.age_groups as
select
  case
    when birth_year is null then 'non indicata'
    when extract(year from now())::int - birth_year < 14 then 'sotto 14'
    when extract(year from now())::int - birth_year <= 17 then '14-17'
    when extract(year from now())::int - birth_year <= 21 then '18-21'
    when extract(year from now())::int - birth_year <= 25 then '22-25'
    when extract(year from now())::int - birth_year <= 30 then '26-30'
    else 'oltre 30'
  end as fascia,
  count(*) as iscritti
from public.profiles
group by 1
order by 1;

create view analytics.demographics as
select 'regione' as dato, coalesce(region, 'non indicata') as valore, count(*) as iscritti
from public.profiles group by 2
union all
select 'occupazione', coalesce(occupation, 'non indicata'), count(*) from public.profiles group by 2
union all
select 'genere', coalesce(gender, 'non indicato'), count(*) from public.profiles group by 2
union all
select 'come ci ha conosciuto', coalesce(referral, 'non indicato'), count(*) from public.profiles group by 2
union all
select 'utm_source', coalesce(first_touch ->> 'utm_source', 'nessuna'), count(*)
from public.profiles group by 2
order by 1, 3 desc;

-- Dispositivi e contesto delle visite.
create view analytics.devices as
select
  props ->> 'device' as dispositivo,
  props ->> 'os' as sistema,
  props ->> 'browser' as browser,
  count(distinct session_id) as sessioni,
  count(distinct user_id) as utenti
from public.events
where name = 'session_start'
group by 1, 2, 3
order by sessioni desc;

-- Feed: quante volte una notizia è vista e quante volte è aperta (tasso di click).
create view analytics.feed_ctr as
with seen as (
  select props ->> 'article_id' as articolo, props ->> 'feed' as feed, count(*) as viste
  from public.events where name = 'card_view' group by 1, 2
),
opened as (
  select props ->> 'article_id' as articolo, props ->> 'feed' as feed, count(*) as aperture
  from public.events where name = 'article_open' group by 1, 2
)
select
  coalesce(s.articolo, o.articolo) as articolo,
  coalesce(s.feed, o.feed) as feed,
  coalesce(s.viste, 0) as viste,
  coalesce(o.aperture, 0) as aperture,
  round(100.0 * coalesce(o.aperture, 0) / nullif(s.viste, 0), 1) as ctr_pct
from seen s
full join opened o on o.articolo = s.articolo and o.feed = s.feed
order by viste desc;

-- Tempo e scroll per pagina.
create view analytics.page_time as
select
  path as pagina,
  count(*) as visite,
  round(avg((props ->> 'seconds')::numeric), 0) as secondi_medi,
  round(avg((props ->> 'max_scroll')::numeric), 0) as scroll_medio_pct
from public.events
where name = 'page_time'
group by 1
order by visite desc;

-- Durata delle sessioni.
create view analytics.sessions as
select
  session_id as sessione,
  user_id,
  min(created_at) as inizio,
  round(extract(epoch from max(created_at) - min(created_at)) / 60, 1) as minuti,
  count(*) as eventi,
  count(*) filter (where name = 'page_view') as pagine
from public.events
group by session_id, user_id
order by inizio desc;

-- Podcast: quanto viene ascoltato.
create view analytics.media_progress as
select
  props ->> 'media_id' as contenuto,
  count(*) filter (where name = 'media_play') as avvii,
  round(avg((props ->> 'pct')::numeric) filter (where name = 'media_progress'), 0) as ascoltato_medio_pct
from public.events
where name in ('media_play', 'media_progress')
group by 1
order by avvii desc;

-- Onboarding: tempo per passaggio.
create view analytics.onboarding_steps as
select
  props ->> 'step' as passaggio,
  count(*) as volte,
  round(avg((props ->> 'seconds')::numeric), 0) as secondi_medi
from public.events
where name = 'onboarding_step'
group by 1
order by 1;

-- Errori dell'app.
create view analytics.errors as
select props ->> 'message' as errore, path as pagina, count(*) as volte, max(created_at) as ultimo
from public.events
where name = 'js_error'
group by 1, 2
order by volte desc;
