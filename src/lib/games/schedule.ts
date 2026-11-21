/**
 * Struttura giornaliera: 4 minigiochi al giorno (la domenica 2: Notizia + Riepilogo).
 * Rotazione settimanale come da brief; i contenuti vengono scelti dal catalogo in base alla data.
 */
import type { GameKind } from "./types";

/** Giorno della settimana ISO: 1 = lunedì … 7 = domenica. */
export function isoWeekday(day: string) {
  const weekday = new Date(`${day}T12:00:00Z`).getUTCDay();
  return weekday === 0 ? 7 : weekday;
}

/** I tre giochi a rotazione (numeri / persone e parole / tempo e luoghi) per giorno. */
const rotation: Record<number, GameKind[]> = {
  1: ["piu-grande", "chi-l-ha-detto", "prima-dopo"],
  2: ["vero-falso", "cosa-significa", "dove-succede"],
  3: ["cifra", "chi-e-chi", "metti-in-ordine"],
  4: ["piu-grande", "clickbait", "dove-succede"],
  5: ["vero-falso", "chi-l-ha-detto", "prima-dopo"],
  6: ["cifra", "cosa-significa", "collega"],
  7: ["riepilogo"],
};

export function gamesForDay(day: string): GameKind[] {
  return ["notizia", ...(rotation[isoWeekday(day)] ?? [])];
}

/** Lunedì della settimana di `day` (AAAA-MM-GG). */
export function weekStart(day: string) {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - (isoWeekday(day) - 1));
  return date.toISOString().slice(0, 10);
}

export function addDays(day: string, amount: number) {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

/** Giorni dal 1° gennaio 2026: serve a far ruotare i contenuti disponibili. */
export function dayNumber(day: string) {
  return Math.round(
    (Date.parse(`${day}T12:00:00Z`) - Date.parse("2026-01-01T12:00:00Z")) / 86_400_000,
  );
}

/** Oggi a Roma (AAAA-MM-GG). */
export function todayInRome(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(now);
}

export const gameInfo: Record<GameKind, { title: string; blurb: string; family: string }> = {
  notizia: {
    title: "La notizia del giorno",
    blurb: "Tre titoli, uno solo è vero.",
    family: "Ogni giorno",
  },
  "piu-grande": {
    title: "Cos’è più grande?",
    blurb: "Cinque coppie di numeri, 10 secondi l’una.",
    family: "Numeri",
  },
  cifra: {
    title: "Indovina la cifra",
    blurb: "Quattro numeri da indovinare col cursore.",
    family: "Numeri",
  },
  "vero-falso": {
    title: "Vero o falso?",
    blurb: "Cinque affermazioni, 8 secondi l’una.",
    family: "Numeri",
  },
  "chi-l-ha-detto": {
    title: "Chi l’ha detto?",
    blurb: "Tre frasi, quattro nomi.",
    family: "Persone e parole",
  },
  "chi-e-chi": {
    title: "Chi è chi?",
    blurb: "Indovina il personaggio con meno indizi possibili.",
    family: "Persone e parole",
  },
  "cosa-significa": {
    title: "Cosa significa?",
    blurb: "Quattro parole difficili, spiegate.",
    family: "Persone e parole",
  },
  clickbait: {
    title: "Titolo o clickbait?",
    blurb: "Scegli il titolo onesto.",
    family: "Persone e parole",
  },
  "prima-dopo": {
    title: "Prima o dopo?",
    blurb: "Quale è successo prima?",
    family: "Tempo e luoghi",
  },
  "dove-succede": {
    title: "Dove succede?",
    blurb: "Tocca il Paese sulla mappa.",
    family: "Tempo e luoghi",
  },
  "metti-in-ordine": {
    title: "Metti in ordine",
    blurb: "Quattro elementi da ordinare.",
    family: "Tempo e luoghi",
  },
  collega: {
    title: "Collega i puntini",
    blurb: "Ogni causa ha il suo effetto.",
    family: "Tempo e luoghi",
  },
  riepilogo: {
    title: "Quiz della settimana",
    blurb: "Dieci domande su quello che è successo.",
    family: "Domenica",
  },
};
