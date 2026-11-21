import { useEffect, useState } from "react";
import { flushEvents } from "./analytics";
import { getSupabase } from "./supabase";
import { percentages } from "./poll";

/** Dopo quanti secondi senza tocchi o scroll smettiamo di contare il tempo di lettura. */
export const idleAfterSeconds = 30;

type Track = (name: string, props: Record<string, string | number | boolean>) => void;

/**
 * Tempo di lettura attivo e scroll massimo di un articolo.
 * Conta un secondo solo se la scheda è visibile e c'è stata attività negli ultimi 30 secondi;
 * invia `article_read` quando si lascia l'articolo o si nasconde la scheda.
 */
export function useReadingTracker(articleId: string, topic: string, track: Track) {
  useEffect(() => {
    if (!articleId) return;
    const readId = crypto.randomUUID();
    let seconds = 0;
    let maxScroll = 0;
    let lastActivity = Date.now();

    const measureScroll = () => {
      const page = document.documentElement;
      const seen = ((window.scrollY + window.innerHeight) / Math.max(page.scrollHeight, 1)) * 100;
      maxScroll = Math.max(maxScroll, Math.min(100, Math.round(seen)));
    };
    const onActivity = () => {
      lastActivity = Date.now();
    };
    const onScroll = () => {
      onActivity();
      measureScroll();
    };
    const send = () => {
      if (seconds < 1) return;
      track("article_read", {
        article_id: articleId,
        topic,
        read_id: readId,
        seconds,
        max_scroll: maxScroll,
      });
      seconds = 0;
      void flushEvents();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") send();
      else onActivity();
    };

    measureScroll();
    const tick = setInterval(() => {
      const active = Date.now() - lastActivity < idleAfterSeconds * 1000;
      if (document.visibilityState === "visible" && active) seconds++;
    }, 1000);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onActivity, { passive: true });
    window.addEventListener("keydown", onActivity);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(tick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onActivity);
      window.removeEventListener("keydown", onActivity);
      document.removeEventListener("visibilitychange", onVisibility);
      send();
    };
  }, [articleId, topic, track]);
}

/**
 * Conteggi reali e anonimi di un sondaggio (funzione `poll_results` del database).
 * Si aggiornano quando cambia `refreshKey` (di solito il voto dell'utente).
 */
export function usePollCounts(pollId: string, refreshKey?: string) {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !pollId) return;
    let cancelled = false;
    // Breve attesa: il voto appena dato deve essere già salvato.
    const timer = setTimeout(
      () => {
        void supabase.rpc("poll_results", { p_poll_id: pollId }).then(({ data }) => {
          if (cancelled || !Array.isArray(data)) return;
          const rows = data as { choice: string; votes: number }[];
          setCounts(Object.fromEntries(rows.map((row) => [row.choice, Number(row.votes)])));
        });
      },
      refreshKey ? 600 : 0,
    );
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pollId, refreshKey]);
  return counts;
}

/** Risultati reali di un sondaggio: percentuali per risposta e numero di voti. */
export function usePollResults(pollId: string, options: string[], choice?: string) {
  const counts = usePollCounts(pollId, choice);
  const values = options.map((option) => counts?.[option] ?? 0);
  // Il voto appena dato conta subito, anche prima che il database risponda.
  const mine = choice ? options.indexOf(choice) : -1;
  if (mine >= 0 && (values[mine] ?? 0) === 0) values[mine] = 1;
  const total = values.reduce((sum, value) => sum + value, 0);
  return { percents: percentages(values), total, loaded: counts !== null };
}

/** Live: votanti prima e dopo il dibattito e quanti hanno cambiato idea. */
export function useOpinionChange(eventId: string, refreshKey?: string) {
  const [result, setResult] = useState<{ voters: number; changed: number } | null>(null);
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !eventId || !refreshKey) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      void supabase.rpc("opinion_change", { p_event_id: eventId }).then(({ data }) => {
        const row = Array.isArray(data) ? (data[0] as { votanti: number; cambiati: number }) : null;
        if (!cancelled && row)
          setResult({ voters: Number(row.votanti), changed: Number(row.cambiati) });
      });
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [eventId, refreshKey]);
  return result;
}
