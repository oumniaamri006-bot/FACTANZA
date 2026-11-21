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
import { currentStreak, nextMilestone, streakMessage } from "@/lib/games/streak";
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

  it("una domanda per gioco: giusta vale 100", () => {
    for (const kind of [
      "piu-grande",
      "vero-falso",
      "clickbait",
      "prima-dopo",
      "cosa-significa",
      "collega",
      "chi-l-ha-detto",
      "riepilogo",
    ] as const) {
      expect(gameScore(kind, [ok])).toBe(100);
      expect(gameScore(kind, [ko])).toBe(0);
      expect(gameScore(kind, [])).toBe(0);
    }
  });

  it("Indovina la cifra: fasce di errore", () => {
    expect(sliderPoints(100, 100)).toBe(100);
    expect(sliderPoints(105, 100)).toBe(100);
    expect(sliderPoints(110, 100)).toBe(80);
    expect(sliderPoints(80, 100)).toBe(60);
    expect(sliderPoints(65, 100)).toBe(40);
    expect(sliderPoints(150, 100)).toBe(20);
    expect(sliderPoints(151, 100)).toBe(0);
    expect(gameScore("cifra", [{ correct: true, error: 0.08 }])).toBe(80);
  });

  it("Chi è chi: 100, 80, 60, 40, 20 secondo l'indizio", () => {
    expect([0, 1, 2, 3, 4].map(cluePoints)).toEqual([100, 80, 60, 40, 20]);
    expect(gameScore("chi-e-chi", [{ correct: true, clue: 2 }])).toBe(60);
    expect(gameScore("chi-e-chi", [{ correct: false, clue: 4 }])).toBe(0);
  });

  it("Dove succede: esatto 100, entro 1.000 km 60, stesso continente 20", () => {
    expect(mapPoints(true, 0, true)).toBe(100);
    expect(mapPoints(false, 900, true)).toBe(60);
    expect(mapPoints(false, 3000, true)).toBe(20);
    expect(mapPoints(false, 9000, false)).toBe(0);
    expect(distanceKm({ lat: 41.9, lon: 12.5 }, { lat: 48.86, lon: 2.35 })).toBeGreaterThan(1050);
    expect(distanceKm({ lat: 41.9, lon: 12.5 }, { lat: 48.86, lon: 2.35 })).toBeLessThan(1150);
  });

  it("Metti in ordine: 25 per posizione giusta", () => {
    expect(gameScore("metti-in-ordine", [{ correct: false, inPlace: 2 }])).toBe(50);
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
    expect(minDurationMs("notizia", 1)).toBe(1000);
    expect(minDurationMs("metti-in-ordine", 4)).toBe(1600);
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
    expect(weeklyMax).toBe(3150);
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
    expect(positionMessage([row(1, 0, true)])).toBe(
      "Sei in classifica con altre 5399 persone: fai il quiz di oggi per salire.",
    );
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

  it("ogni gioco ha una sola domanda al giorno, e cambia ogni giorno", () => {
    for (const kind of kinds) {
      const day1 = contentFor(kind, "2026-11-23");
      const day2 = contentFor(kind, "2026-11-24");
      expect(day1?.items).toHaveLength(1);
      if (gameCatalog[kind].flatMap((set) => set.items as unknown[]).length > 1)
        expect(day1?.items[0]).not.toEqual(day2?.items[0]);
    }
  });
});

describe("Serie di giorni", () => {
  it("conta i giorni consecutivi fino a oggi", () => {
    expect(currentStreak(["2026-11-19", "2026-11-20", "2026-11-21"], "2026-11-21")).toEqual({
      count: 3,
      playedToday: true,
      atRisk: false,
    });
  });
  it("se oggi non hai giocato la serie è a rischio", () => {
    expect(currentStreak(["2026-11-19", "2026-11-20"], "2026-11-21")).toEqual({
      count: 2,
      playedToday: false,
      atRisk: true,
    });
  });
  it("un giorno saltato azzera la serie", () => {
    expect(currentStreak(["2026-11-18", "2026-11-19"], "2026-11-21").count).toBe(0);
    expect(currentStreak(["2026-11-15", "2026-11-21"], "2026-11-21").count).toBe(1);
  });
  it("traguardi e messaggi", () => {
    expect(nextMilestone(0)).toBe(3);
    expect(nextMilestone(5)).toBe(7);
    expect(nextMilestone(9)).toBeNull();
    expect(streakMessage({ count: 2, playedToday: false, atRisk: true })).toContain("mezzanotte");
    expect(streakMessage({ count: 4, playedToday: true, atRisk: false })).toBe(
      "Ancora 1 giorno per arrivare a 5!",
    );
  });
});
