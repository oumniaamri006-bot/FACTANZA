/** Salvataggio dei giochi e lettura della classifica su Supabase. */
import { getSupabase } from "@/lib/supabase";
import type { GameKind } from "./types";

export type GamePlay = {
  day: string;
  game: GameKind;
  score: number;
  correct: number;
  items: number;
  duration_ms: number;
};

export async function fetchWeekPlays(weekStart: string): Promise<GamePlay[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("game_plays")
    .select("day, game, score, correct, items, duration_ms")
    .gte("day", weekStart)
    .order("created_at");
  return (data as GamePlay[] | null) ?? [];
}

export async function recordPlay(play: {
  game: GameKind;
  topic: string;
  score: number;
  correct: number;
  items: number;
  durationMs: number;
}) {
  const supabase = getSupabase();
  if (!supabase) return { error: "Accesso non disponibile" };
  const { error } = await supabase.rpc("record_game_play", {
    p_game: play.game,
    p_topic: play.topic,
    p_score: play.score,
    p_correct: play.correct,
    p_items: play.items,
    p_duration_ms: play.durationMs,
  });
  if (!error) return { error: null };
  if (error.code === "23505") return { error: "Hai già giocato questo gioco oggi." };
  if (error.message.includes("Troppo veloce"))
    return { error: "Risposte troppo veloci: non conteggiate." };
  return { error: "Non sono riuscito a salvare il punteggio." };
}

export type LeaderboardRow = {
  rank: number;
  name: string;
  points: number;
  days: number;
  total_ms: number;
  news_correct: number;
  is_me: boolean;
  players: number;
  level: string;
};

/** Classifica generale (la funzione SQL supporta anche livello e tema, non usati nell’app). */
export async function fetchLeaderboard(scope: "generale" = "generale") {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase.rpc("weekly_leaderboard", {
    p_scope: scope,
    p_value: null,
    p_limit: 100,
  });
  return ((data as LeaderboardRow[] | null) ?? []).map((row) => ({
    ...row,
    rank: Number(row.rank),
    points: Number(row.points),
    days: Number(row.days),
    total_ms: Number(row.total_ms),
    news_correct: Number(row.news_correct),
    players: Number(row.players),
  }));
}

/** "Sei 128° su 5.400, ti mancano 40 punti per entrare nei primi 100". */
export function positionMessage(rows: LeaderboardRow[]) {
  const me = rows.find((row) => row.is_me);
  if (!me) return "Gioca oggi per entrare in classifica.";
  const players = me.players.toLocaleString("it-IT");
  const base = `Sei ${me.rank}° su ${players}`;
  for (const target of [100, 10, 3, 1]) {
    if (me.rank <= target) continue;
    const threshold =
      rows.find((row) => row.rank === target) ?? rows.filter((row) => row.rank <= target).at(-1);
    if (!threshold) continue;
    const gap = threshold.points - me.points + 1;
    const label = target === 1 ? "il primo posto" : target === 3 ? "il podio" : `i primi ${target}`;
    return `${base}: ti mancano ${gap} punti per ${label}.`;
  }
  return me.rank === 1 ? `${base}: sei in testa!` : `${base}.`;
}
