import { describe, expect, it } from "vitest";
import {
  challengeFor,
  challengeScore,
  challenges,
  priceScore,
  shareText,
  type PriceRound,
} from "@/data/challenges";

describe("FactaChallenge", () => {
  it("has a price, a match and a swipe round every day, each with sources", () => {
    for (const challenge of challenges) {
      expect(challenge.rounds.map((round) => round.kind)).toEqual([
        "prezzo",
        "citazione",
        "verofalso",
      ]);
      for (const round of challenge.rounds) {
        if (round.kind === "verofalso")
          for (const card of round.cards) expect(card.source.length).toBeGreaterThan(5);
        else expect(round.source.length).toBeGreaterThan(5);
        if (round.kind === "citazione")
          expect(new Set(round.pairs.map((pair) => pair.person)).size).toBe(round.pairs.length);
      }
    }
  });
  it("scores the price slider by distance", () => {
    const round = challenges[0]?.rounds[0] as PriceRound;
    expect(priceScore(round, round.answer)).toBe(100);
    expect(priceScore(round, round.max)).toBeLessThan(50);
  });
  it("adds time left to the round scores", () => {
    expect(challengeScore([100, 67, 33], 20)).toBe(220);
    expect(challengeScore([0, 0, 0], 50)).toBe(0);
  });
  it("falls back to the latest challenge and builds a shareable result", () => {
    expect(challengeFor("2030-01-01")?.date).toBe(challenges[0]?.date);
    expect(shareText("2026-11-21", [100, 50, 0], 180, "https://x/sfida")).toContain(
      "🟩🟨🟥 180 punti",
    );
  });
});
