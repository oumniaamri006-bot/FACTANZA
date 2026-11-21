-- Cronologia leggibile di cosa ha fatto ogni utente (solo chi ha dato il consenso).
-- Esclude i tocchi singoli e le card solo viste, che sono troppi per leggerli uno a uno
-- (si trovano in heatmap_taps / top_taps / feed_ctr).
create view analytics.user_activity as
select
  to_char(e.created_at at time zone 'Europe/Rome', 'DD/MM HH24:MI:SS') as quando,
  p.name as utente,
  u.email,
  case e.name
    when 'session_start' then 'Ha aperto l’app'
    when 'page_view' then 'Ha visitato una pagina'
    when 'page_time' then 'È rimastə sulla pagina'
    when 'article_open' then 'Ha aperto un articolo dal feed'
    when 'article_read' then 'Ha letto un articolo'
    when 'poll_vote' then 'Ha votato un sondaggio'
    when 'video_open' then 'Ha aperto un video'
    when 'media_play' then 'Ha avviato un podcast'
    when 'media_progress' then 'Ha chiuso il podcast'
    when 'share' then 'Ha condiviso un articolo'
    when 'feed_tab' then 'Ha cambiato scheda del feed'
    when 'category_open' then 'Ha aperto una categoria'
    when 'calendar_day' then 'Ha guardato un giorno del calendario'
    when 'reminder' then 'Ha impostato un promemoria'
    when 'swipe' then 'Swipe nell’onboarding'
    when 'onboarding_complete' then 'Ha finito l’onboarding'
    when 'interests_change' then 'Ha cambiato i suoi interessi'
    when 'live_phase' then 'Ha seguito un live'
    when 'chat_message' then 'Ha scritto nella chat del live'
    when 'offer_open' then 'Ha aperto un’offerta'
    when 'code_copy' then 'Ha copiato un codice sconto'
    when 'js_error' then 'Errore dell’app'
    else e.name
  end as azione,
  coalesce(
    e.props ->> 'article_id',
    e.props ->> 'media_id',
    e.props ->> 'poll_id',
    e.props ->> 'slug',
    e.props ->> 'topic',
    e.props ->> 'event_id',
    e.props ->> 'partner',
    e.props ->> 'tab',
    e.props ->> 'day'
  ) as contenuto,
  case
    when e.props ? 'seconds' then (e.props ->> 'seconds') || ' s'
  end as tempo,
  case
    when e.props ? 'max_scroll' then (e.props ->> 'max_scroll') || '%'
    when e.props ? 'pct' then (e.props ->> 'pct') || '% ascoltato'
  end as scroll_o_ascolto,
  case
    when e.name = 'swipe' then case when (e.props ->> 'liked')::boolean then 'sì' else 'no' end
    when e.name = 'session_start' then concat_ws(' · ', e.props ->> 'device', e.props ->> 'os', e.props ->> 'browser')
    when e.props ? 'position' then 'posizione ' || (e.props ->> 'position') || ' in ' || (e.props ->> 'feed')
  end as dettagli,
  e.path as pagina,
  e.user_id
from public.events e
join public.profiles p on p.id = e.user_id
join auth.users u on u.id = e.user_id
where e.name not in ('tap', 'card_view')
order by e.created_at desc;
