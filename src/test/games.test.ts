import { describe, expect, it } from "vitest";
import { categories } from "@/data/categories";
import { contentFor, gameCatalog } from "@/data/games/content";
import worldMap from "@/data/games/world-map.json";
import { positionMessage, type LeaderboardRow } from "@/lib/games/api";
import {
  addDays,
  gameInfo,
  gamesForDay,
  isoWeekday,
  todayInRome,
  weekStart,
} from "@/lib/games/schedule";
import {
  cluePoints,
  compareRanked,
  distanceKm,
  gameScore,
  inviteBonus,
  mapPoints,
  maxGameScore,
  minDurationMs,
  newsScore,
  sliderPoints,
  streakBonus,
  weeklyMax,
  weeklyTotal,
} from "@/lib/games/scoring";
import { shareSquares } from "@/lib/games/share";
import type { GameKind } from "@/lib/games/types";

const ok = { correct: true };
const ko = { correct: false };
const kinds = Object.keys(gameInfo) as GameKind[];

describe("Punteggi dei minigiochi", () => {
  it("Notizia del giorno: 70 + bonus velocità fino a 30", () => {
    expect(newsScore(true, 0)).toBe(100);
    expect(newsScore(true, 22_500)).toBe(85);
    expect(newsScore(true, 45_000)).toBe(70);
    expect(newsScore(true, 90_000)).toBe(70);
    expect(newsScore(false, 1_000)).toBe(0);
    expect(gameScore("notizia", [ok], 9_000)).toBe(94);
  });

  it("giochi da 5 domande valgono 20 a risposta", () => {
    for (const kind of ["piu-grande", "vero-falso", "clickbait", "prima-dopo"] as const) {
      expect(gameScore(kind, [ok, ok, ko, ok, ko])).toBe(60);
      expect(gameScore(kind, [ok, ok, ok, ok, ok])).toBe(100);
    }
  });

  it("Cosa significa e Collega i puntini: 25 a risposta", () => {
    expect(gameScore("cosa-significa", [ok, ko, ok, ok])).toBe(75);
    expect(gameScore("collega", [ok, ok, ok, ok])).toBe(100);
  });

  it("Chi l'ha detto: 30 a frase + 10 se tutte giuste", () => {
    expect(gameScore("chi-l-ha-detto", [ok, ok, ok])).toBe(100);
    expect(gameScore("chi-l-ha-detto", [ok, ok, ko])).toBe(60);
  });

  it("Indovina la cifra: fasce di errore", () => {
    expect(sliderPoints(100, 100)).toBe(25);
    expect(sliderPoints(105, 100)).toBe(25);
    expect(sliderPoints(110, 100)).toBe(20);
    expect(sliderPoints(80, 100)).toBe(15);
    expect(sliderPoints(65, 100)).toBe(10);
    expect(sliderPoints(150, 100)).toBe(5);
    expect(sliderPoints(151, 100)).toBe(0);
    expect(
      gameScore("cifra", [
        { correct: true, error: 0 },
        { correct: true, error: 0.08 },
        { correct: true, error: 0.3 },
        { correct: false, error: 0.9 },
      ]),
    ).toBe(55);
  });

  it("Chi è chi: 100, 80, 60, 40, 20 secondo l'indizio", () => {
    expect([0, 1, 2, 3, 4].map(cluePoints)).toEqual([100, 80, 60, 40, 20]);
    expect(gameScore("chi-e-chi", [{ correct: true, clue: 2 }])).toBe(60);
    expect(gameScore("chi-e-chi", [{ correct: false, clue: 4 }])).toBe(0);
  });

  it("Dove succede: esatto 25, entro 1.000 km 15, stesso continente 5", () => {
    expect(mapPoints(true, 0, true)).toBe(25);
    expect(mapPoints(false, 900, true)).toBe(15);
    expect(mapPoints(false, 3000, true)).toBe(5);
    expect(mapPoints(false, 9000, false)).toBe(0);
    expect(distanceKm({ lat: 41.9, lon: 12.5 }, { lat: 48.86, lon: 2.35 })).toBeGreaterThan(1050);
    expect(distanceKm({ lat: 41.9, lon: 12.5 }, { lat: 48.86, lon: 2.35 })).toBeLessThan(1150);
  });

  it("Metti in ordine: 25 per posizione giusta; Riepilogo: 40 a domanda", () => {
    expect(gameScore("metti-in-ordine", [{ correct: false, inPlace: 2 }])).toBe(50);
    expect(
      gameScore(
        "riepilogo",
        Array.from({ length: 10 }, (_, i) => (i < 7 ? ok : ko)),
      ),
    ).toBe(280);
  });

  it("nessun gioco supera il suo massimo", () => {
    const many = Array.from({ length: 12 }, () => ({
      correct: true,
      error: 0,
      km: 0,
      sameContinent: true,
      inPlace: 9,
      clue: 0,
    }));
    for (const kind of kinds)
      expect(gameScore(kind, many, 0)).toBeLessThanOrEqual(maxGameScore[kind]);
  });

  it("tempo minimo antibaro", () => {
    expect(minDurationMs("notizia", 1)).toBe(1500);
    expect(minDurationMs("vero-falso", 5)).toBe(4000);
    expect(minDurationMs("chi-e-chi", 1)).toBe(2000);
  });
});

describe("Bonus e classifica", () => {
  it("bonus costanza: solo il più alto", () => {
    expect([0, 2, 3, 4, 5, 6, 7].map(streakBonus)).toEqual([0, 0, 50, 50, 100, 100, 200]);
  });

  it("bonus inviti: 30 per amico, massimo 3", () => {
    expect(inviteBonus(2)).toBe(60);
    expect(inviteBonus(10)).toBe(90);
  });

  it("totale settimanale con giornate complete e costanza", () => {
    const full = { gamesPlayed: 4, gamesInDay: 4, points: 300 };
    const half = { gamesPlayed: 2, gamesInDay: 4, points: 120 };
    expect(weeklyTotal([full, half, full])).toBe(300 + 120 + 300 + 2 * 50 + 50);
    expect(weeklyTotal([full], 1)).toBe(300 + 50 + 30);
  });

  it("massimo teorico settimanale", () => {
    expect(weeklyMax).toBe(3450);
  });

  it("spareggi: punti, giorni, tempo, notizie giuste", () => {
    const base = { points: 500, days: 4, totalMs: 100_000, newsCorrect: 3 };
    expect(compareRanked(base, { ...base, points: 400 })).toBeLessThan(0);
    expect(compareRanked(base, { ...base, days: 5 })).toBeGreaterThan(0);
    expect(compareRanked(base, { ...base, totalMs: 90_000 })).toBeGreaterThan(0);
    expect(compareRanked(base, { ...base, newsCorrect: 2 })).toBeLessThan(0);
  });

  it("messaggio di posizione", () => {
    const row = (rank: number, points: number, is_me = false): LeaderboardRow => ({
      rank,
      name: `U${rank}`,
      points,
      days: 1,
      total_ms: 0,
      news_correct: 0,
      is_me,
      players: 5400,
      level: "principiante",
    });
    const rows = [
      ...Array.from({ length: 100 }, (_, i) => row(i + 1, 1000 - i)),
      row(128, 860, true),
    ];
    expect(positionMessage(rows)).toBe("Sei 128° su 5400: ti mancano 42 punti per i primi 100.");
    expect(positionMessage([row(1, 50, true)])).toBe("Sei 1° su 5400: sei in testa!");
    expect(positionMessage([])).toBe("Gioca oggi per entrare in classifica.");
  });

  it("condivisione in stile Wordle", () => {
    expect(shareSquares([100, 50, 10, undefined])).toBe("🟩🟨🟥⬜");
  });
});

describe("Calendario dei giochi", () => {
  it("rotazione settimanale del brief", () => {
    // 16-22 novembre 2026: da lunedì a domenica.
    const monday = "2026-11-16";
    expect(isoWeekday(monday)).toBe(1);
    expect(gamesForDay(monday)).toEqual(["notizia", "piu-grande", "chi-l-ha-detto", "prima-dopo"]);
    expect(gamesForDay(addDays(monday, 1))).toEqual([
      "notizia",
      "vero-falso",
      "cosa-significa",
      "dove-succede",
    ]);
    expect(gamesForDay(addDays(monday, 2))).toEqual([
      "notizia",
      "cifra",
      "chi-e-chi",
      "metti-in-ordine",
    ]);
    expect(gamesForDay(addDays(monday, 3))).toEqual([
      "notizia",
      "piu-grande",
      "clickbait",
      "dove-succede",
    ]);
    expect(gamesForDay(addDays(monday, 4))).toEqual([
      "notizia",
      "vero-falso",
      "chi-l-ha-detto",
      "prima-dopo",
    ]);
    expect(gamesForDay(addDays(monday, 5))).toEqual([
      "notizia",
      "cifra",
      "cosa-significa",
      "collega",
    ]);
    expect(gamesForDay(addDays(monday, 6))).toEqual(["notizia", "riepilogo"]);
    expect(weekStart("2026-11-22")).toBe(monday);
  });

  it("oggi è calcolato sull'ora di Roma", () => {
    expect(todayInRome(new Date("2026-11-21T23:30:00Z"))).toBe("2026-11-22");
  });

  it("ogni giorno dell'anno ha contenuti per tutti i suoi giochi", () => {
    for (let i = 0; i < 400; i++) {
      const day = addDays("2026-01-01", i);
      for (const kind of gamesForDay(day)) expect(contentFor(kind, day)?.kind).toBe(kind);
    }
  });
});

describe("Contenuti dei giochi", () => {
  const countries = new Set(worldMap.countries.map((c) => c.id));
  const themes = new Set(categories.map((c) => c.name));

  for (const kind of kinds) {
    it(`${gameInfo[kind].title}: almeno due set validi con fonte`, () => {
      const sets = gameCatalog[kind];
      expect(sets.length).toBeGreaterThanOrEqual(kind === "riepilogo" ? 1 : 2);
      for (const set of sets) {
        expect(set.kind).toBe(kind);
        expect(themes.has(set.topic)).toBe(true);
        expect(set.items.length).toBeGreaterThan(0);
        for (const item of set.items) {
          expect(item.explanation.length).toBeGreaterThan(10);
          expect(item.source.length).toBeGreaterThan(3);
          if ("options" in item) {
            expect(item.answer).toBeGreaterThanOrEqual(0);
            expect(item.answer).toBeLessThan(item.options.length);
            expect(new Set(item.options).size).toBe(item.options.length);
          }
          if ("min" in item) {
            expect(item.answer).toBeGreaterThanOrEqual(item.min);
            expect(item.answer).toBeLessThanOrEqual(item.max);
          }
          if ("countryId" in item) expect(countries.has(item.countryId)).toBe(true);
          if ("ordered" in item) expect(item.ordered).toHaveLength(4);
          if ("clues" in item) expect(item.clues).toHaveLength(5);
        }
      }
    });
  }

  it("numero di domande per gioco come da brief", () => {
    const sizes: Partial<Record<GameKind, number>> = {
      notizia: 1,
      "piu-grande": 5,
      cifra: 4,
      "vero-falso": 5,
      "chi-l-ha-detto": 3,
      "cosa-significa": 4,
      clickbait: 5,
      "prima-dopo": 5,
      "dove-succede": 4,
      collega: 4,
      riepilogo: 10,
    };
    for (const [kind, size] of Object.entries(sizes))
      for (const set of gameCatalog[kind as GameKind]) expect(set.items).toHaveLength(size);
  });
});
