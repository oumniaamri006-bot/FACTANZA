-- Lancio pubblico: risultati reali per i live e cancellazione dell'account.

-- Live: quante persone hanno votato prima e dopo il dibattito e quante hanno cambiato idea.
create function public.opinion_change(p_event_id text)
returns table (votanti bigint, cambiati bigint)
language sql stable security definer set search_path = '' as $$
  select count(*)::bigint, count(*) filter (where b.choice <> a.choice)::bigint
  from public.votes b
  join public.votes a on a.user_id = b.user_id and a.poll_id = 'after-' || p_event_id
  where b.poll_id = 'before-' || p_event_id;
$$;

revoke all on function public.opinion_change(text) from public, anon;
grant execute on function public.opinion_change(text) to authenticated;

-- Diritto alla cancellazione (GDPR art. 17): l'utente elimina il proprio account e,
-- a cascata, profilo, voti, promemoria e statistiche.
create function public.delete_my_account()
returns void
language sql security definer set search_path = '' as $$
  delete from auth.users where id = auth.uid();
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
