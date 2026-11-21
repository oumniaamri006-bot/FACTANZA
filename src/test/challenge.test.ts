import { describe, expect, it } from "vitest";
import { challengeFor, challengeScore, challenges, shareText } from "@/data/challenges";

describe("FactaChallenge", () => {
  it("has three different trials every day, each with an explanation and a source", () => {
    for (const challenge of challenges) {
      expect(challenge.questions.map((q) => q.kind)).toEqual(["prezzo", "citazione", "verofalso"]);
      for (const q of challenge.questions) {
        expect(q.explanation.length).toBeGreaterThan(20);
        expect(q.source.length).toBeGreaterThan(5);
        if (q.kind !== "verofalso") expect(q.options[q.answer]).toBeTruthy();
      }
    }
  });
  it("falls back to the latest challenge", () => {
    expect(challengeFor("2030-01-01")?.date).toBe(challenges[0]?.date);
  });
  it("scores right answers and time left", () => {
    expect(challengeScore([true, true, false], 20)).toBe(240);
    expect(challengeScore([false, false, false], 50)).toBe(0);
  });
  it("builds a shareable result", () => {
    expect(shareText("2026-11-21", [true, false, true], 250, "https://x/sfida")).toContain(
      "🟩🟥🟩 2/3",
    );
  });
});
