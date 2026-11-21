-- Factanza: schema iniziale
-- Ogni utente vede e modifica solo i propri dati (Row Level Security).
-- Le statistiche aggregate stanno nello schema "analytics", non esposto all'API pubblica.

-- ============================================================================
-- Profili
-- ============================================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'Facta Lover' check (char_length(name) between 1 and 30),
  interests text[] not null default '{}',
  formats text[] not null default '{}',
  onboarded boolean not null default false,
  -- Consenso alle statistiche d'uso (tempo di lettura, tocchi): opt-in.
  analytics_consent boolean not null default false,
  notifications boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profilo: lettura propria" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "Profilo: inserimento proprio" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "Profilo: modifica propria" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Crea il profilo alla registrazione, con il nome scelto nel modulo.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(nullif(left(trim(new.raw_user_meta_data ->> 'name'), 30), ''), 'Facta Lover')
  );
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- Voti (domanda del giorno, sondaggi degli articoli, voto prima/dopo i live)
-- ============================================================================
create table public.votes (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  poll_id text not null check (char_length(poll_id) between 1 and 80),
  choice text not null check (char_length(choice) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, poll_id)
);

alter table public.votes enable row level security;

create policy "Voti: lettura propria" on public.votes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Voti: inserimento proprio" on public.votes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Voti: modifica propria" on public.votes
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Voti: cancellazione propria" on public.votes
  for delete to authenticated using ((select auth.uid()) = user_id);

create trigger votes_updated_at before update on public.votes
  for each row execute function public.set_updated_at();

create index votes_poll_idx on public.votes (poll_id);

-- Risultati aggregati e anonimi di un sondaggio (nessun dato del singolo).
create function public.poll_results(p_poll_id text)
returns table (choice text, votes bigint)
language sql stable security definer set search_path = '' as $$
  select v.choice, count(*)::bigint
  from public.votes v
  where v.poll_id = p_poll_id
  group by v.choice;
$$;

revoke all on function public.poll_results(text) from public, anon;
grant execute on function public.poll_results(text) to authenticated;

-- ============================================================================
-- Promemoria (eventi del calendario, dirette)
-- ============================================================================
create table public.reminders (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  item_id text not null check (char_length(item_id) between 1 and 80),
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

alter table public.reminders enable row level security;

create policy "Promemoria: lettura propria" on public.reminders
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Promemoria: inserimento proprio" on public.reminders
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Promemoria: cancellazione propria" on public.reminders
  for delete to authenticated using ((select auth.uid()) = user_id);

-- ============================================================================
-- Eventi d'uso (statistiche): solo con consenso, solo scrittura dall'app
-- ============================================================================
create table public.events (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  session_id text not null check (char_length(session_id) between 8 and 64),
  name text not null check (name ~ '^[a-z_]{2,40}$'),
  path text check (char_length(path) <= 200),
  props jsonb not null default '{}' check (pg_column_size(props) <= 4000),
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

-- Si può solo inserire, per sé stessi e solo se si è dato il consenso. Nessuna lettura dall'app.
create policy "Eventi: inserimento con consenso" on public.events
  for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.analytics_consent
    )
  );

create index events_name_time_idx on public.events (name, created_at);
create index events_user_idx on public.events (user_id);

-- ============================================================================
-- Statistiche aggregate (schema non esposto all'API: si leggono dal pannello Supabase)
-- ============================================================================
create schema analytics;
revoke all on schema analytics from public, anon, authenticated;

-- Minuti di lettura al giorno (la metrica guida di Factanza).
create view analytics.reading_minutes_daily as
select
  (created_at at time zone 'Europe/Rome')::date as giorno,
  round(sum((props ->> 'seconds')::numeric) / 60, 1) as minuti_letti,
  count(distinct user_id) as lettori,
  round(sum((props ->> 'seconds')::numeric) / 60 / nullif(count(distinct user_id), 0), 1) as minuti_per_lettore
from public.events
where name = 'article_read'
group by 1
order by 1 desc;

-- Articoli: letture, tempo medio, quanto si scorre, quanti arrivano in fondo.
create view analytics.article_stats as
select
  props ->> 'article_id' as articolo,
  props ->> 'topic' as tema,
  count(*) as letture,
  count(distinct user_id) as lettori,
  round(avg((props ->> 'seconds')::numeric), 0) as secondi_medi,
  round(avg((props ->> 'max_scroll')::numeric), 0) as scroll_medio_pct,
  round(100.0 * avg(case when (props ->> 'max_scroll')::numeric >= 90 then 1 else 0 end), 0) as completati_pct
from public.events
where name = 'article_read'
group by 1, 2
order by letture desc;

-- Sondaggi: distribuzione delle risposte (solo conteggi).
create view analytics.poll_summary as
select
  poll_id as sondaggio,
  choice as risposta,
  count(*) as voti,
  round(100.0 * count(*) / sum(count(*)) over (partition by poll_id), 1) as percentuale
from public.votes
group by poll_id, choice
order by poll_id, voti desc;

-- Live: quante persone hanno cambiato idea tra il voto prima e dopo il dibattito.
create view analytics.opinion_change as
select
  substring(b.poll_id from 8) as evento,
  count(*) as votanti,
  count(*) filter (where b.choice <> a.choice) as hanno_cambiato_idea,
  round(100.0 * count(*) filter (where b.choice <> a.choice) / count(*), 1) as cambio_pct
from public.votes b
join public.votes a
  on a.user_id = b.user_id and a.poll_id = 'after-' || substring(b.poll_id from 8)
where b.poll_id like 'before-%'
group by 1;

-- Heatmap: tocchi raggruppati per pagina e zona (x in % della larghezza, y in blocchi da 50px).
create view analytics.heatmap_taps as
select
  path as pagina,
  (floor((props ->> 'x')::numeric / 10) * 10)::int as x_pct,
  (floor((props ->> 'y')::numeric / 50) * 50)::int as y_px,
  count(*) as tocchi
from public.events
where name = 'tap'
group by 1, 2, 3
order by tocchi desc;

-- Elementi più toccati.
create view analytics.top_taps as
select path as pagina, props ->> 'label' as elemento, count(*) as tocchi
from public.events
where name = 'tap' and props ->> 'label' is not null
group by 1, 2
order by tocchi desc;

-- Pagine viste e utenti attivi al giorno.
create view analytics.daily_activity as
select
  (created_at at time zone 'Europe/Rome')::date as giorno,
  count(distinct user_id) as utenti_attivi,
  count(distinct session_id) as sessioni,
  count(*) filter (where name = 'page_view') as pagine_viste
from public.events
group by 1
order by 1 desc;

-- Onboarding: temi scelti nello swipe.
create view analytics.swipe_topics as
select
  props ->> 'topic' as tema,
  count(*) filter (where (props ->> 'liked')::boolean) as si,
  count(*) filter (where not (props ->> 'liked')::boolean) as no,
  round(100.0 * avg(case when (props ->> 'liked')::boolean then 1 else 0 end), 0) as si_pct
from public.events
where name = 'swipe'
group by 1
order by si_pct desc;

-- Interessi attuali degli iscritti.
create view analytics.interests as
select tema, count(*) as iscritti
from public.profiles, unnest(interests) as tema
group by tema
order by iscritti desc;

-- Riepilogo degli eventi registrati.
create view analytics.event_counts as
select name as evento, count(*) as volte, count(distinct user_id) as utenti, max(created_at) as ultimo
from public.events
group by name
order by volte desc;
