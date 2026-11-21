/**
 * Punteggi dei minigiochi e bonus della classifica settimanale.
 * Funzioni pure e testabili: le stesse regole sono replicate nel database
 * (supabase/migrations/*_games.sql) per la classifica.
 */
import type { Answer, GameKind } from "./types";

export const maxGameScore: Record<GameKind, number> = {
  notizia: 100,
  "piu-grande": 100,
  cifra: 100,
  "vero-falso": 100,
  "chi-l-ha-detto": 100,
  "chi-e-chi": 100,
  "cosa-significa": 100,
  clickbait: 100,
  "prima-dopo": 100,
  "dove-succede": 100,
  "metti-in-ordine": 100,
  collega: 100,
  riepilogo: 400,
};

/** Durata massima di ogni gioco (il riepilogo della domenica ha 10 domande: 120 s). */
export const gameSeconds = (kind: GameKind) => (kind === "riepilogo" ? 120 : 45);

/** Tempo per singola domanda, dove previsto. */
export const itemSeconds: Partial<Record<GameKind, number>> = {
  "piu-grande": 10,
  "vero-falso": 8,
};

/** Tempo minimo plausibile per completare un gioco (controllo antibaro), in ms. */
export const minDurationMs = (kind: GameKind, items: number) =>
  kind === "notizia" ? 1500 : Math.max(2000, items * 800);

/** Notizia del giorno: 70 se giusta + fino a 30 di bonus velocità, lineare sul tempo. */
export function newsScore(correct: boolean, elapsedMs: number, limitMs = 45_000) {
  if (!correct) return 0;
  const left = Math.max(0, Math.min(1, 1 - elapsedMs / limitMs));
  return 70 + Math.round(30 * left);
}

/** Indovina la cifra: punti per fasce di errore relativo. */
export function sliderPoints(guess: number, answer: number) {
  const error = Math.abs(guess - answer) / Math.abs(answer || 1);
  if (error <= 0.05) return 25;
  if (error <= 0.1) return 20;
  if (error <= 0.2) return 15;
  if (error <= 0.35) return 10;
  if (error <= 0.5) return 5;
  return 0;
}

/** Chi è chi: 100 al primo indizio, poi 80, 60, 40, 20. */
export const cluePoints = (clueIndex: number) => Math.max(0, 100 - 20 * clueIndex);

/** Dove succede: Paese esatto 25, entro 1.000 km 15, stesso continente 5. */
export function mapPoints(exact: boolean, km: number, sameContinent: boolean) {
  if (exact) return 25;
  if (km <= 1000) return 15;
  if (sameContinent) return 5;
  return 0;
}

/** Distanza in km tra due punti (formula dell'emisenoverso). */
export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)));
}

/** Punteggio di un gioco a partire dalle risposte. */
export function gameScore(kind: GameKind, answers: Answer[], elapsedMs = 0): number {
  const right = answers.filter((answer) => answer.correct).length;
  switch (kind) {
    case "notizia":
      return newsScore(answers[0]?.correct ?? false, elapsedMs);
    case "piu-grande":
    case "vero-falso":
    case "clickbait":
    case "prima-dopo":
      return Math.min(100, right * 20);
    case "cosa-significa":
    case "collega":
      return Math.min(100, right * 25);
    case "chi-l-ha-detto":
      return Math.min(100, right * 30 + (answers.length > 0 && right === answers.length ? 10 : 0));
    case "cifra":
      return Math.min(
        100,
        answers.reduce(
          (sum, answer) => sum + (answer.error === undefined ? 0 : errorToPoints(answer.error)),
          0,
        ),
      );
    case "chi-e-chi": {
      const first = answers[0];
      return first?.correct ? cluePoints(first.clue ?? 0) : 0;
    }
    case "dove-succede":
      return Math.min(
        100,
        answers.reduce(
          (sum, answer) =>
            sum + mapPoints(answer.correct, answer.km ?? Infinity, answer.sameContinent ?? false),
          0,
        ),
      );
    case "metti-in-ordine":
      return Math.min(100, (answers[0]?.inPlace ?? 0) * 25);
    case "riepilogo":
      return Math.min(400, right * 40);
  }
}

function errorToPoints(error: number) {
  return sliderPoints(1 + error, 1);
}

// ---------------------------------------------------------------------------
// Bonus e totale settimanale
// ---------------------------------------------------------------------------

export const dayCompleteBonus = 50;

/** Bonus costanza: si applica solo il più alto. */
export function streakBonus(daysPlayed: number) {
  if (daysPlayed >= 7) return 200;
  if (daysPlayed >= 5) return 100;
  if (daysPlayed >= 3) return 50;
  return 0;
}

/** Bonus inviti: 30 punti per amico che si iscrive e gioca nella settimana, massimo 3. */
export const inviteBonus = (friends: number) => Math.min(3, Math.max(0, friends)) * 30;

export type DayPlays = { gamesPlayed: number; gamesInDay: number; points: number };

/** Totale settimanale: punti dei giochi + giornate complete + costanza (+ inviti). */
export function weeklyTotal(days: DayPlays[], invitedFriends = 0) {
  const games = days.reduce((sum, day) => sum + day.points, 0);
  const complete = days.filter((day) => day.gamesPlayed >= day.gamesInDay).length;
  const played = days.filter((day) => day.gamesPlayed > 0).length;
  return games + complete * dayCompleteBonus + streakBonus(played) + inviteBonus(invitedFriends);
}

/**
 * Massimo teorico settimanale (senza inviti): 6 giorni × (4 × 100 + 50) + domenica (100 + 400 + 50)
 * + 200 di costanza = 3.450. Il brief indicava 3.350: vedi nota in GIOCHI.md.
 */
export const weeklyMax = 6 * (4 * 100 + dayCompleteBonus) + (100 + 400 + dayCompleteBonus) + 200;

/** Spareggi: più giorni, meno tempo totale, più Notizie del giorno indovinate. */
export type Ranked = { points: number; days: number; totalMs: number; newsCorrect: number };
export function compareRanked(a: Ranked, b: Ranked) {
  return (
    b.points - a.points || b.days - a.days || a.totalMs - b.totalMs || b.newsCorrect - a.newsCorrect
  );
}
