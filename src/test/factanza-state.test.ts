import { describe, expect, it } from "vitest";
import { parseUser, initialUser, toggleValue, hasChangedMind } from "@/lib/factanza-state";
import { dailyResults, partners, topics } from "@/data/factanza";
describe("Factanza demo rules", () => {
  it("shows onboarding only until the first acceptance", () => {
    expect(parseUser(null).onboarded).toBe(false);
    expect(parseUser(JSON.stringify({ ...initialUser, onboarded: true })).onboarded).toBe(true);
  });
  it("restores user choices, formats and votes from local storage", () => {
    const state = parseUser(
      JSON.stringify({
        ...initialUser,
        interests: ["AI & Tech"],
        formats: ["Leggo", "Ascolto"],
        votes: { daily: "Sì" },
      }),
    );
    expect(state.interests).toEqual(["AI & Tech"]);
    expect(state.formats).toEqual(["Leggo", "Ascolto"]);
    expect(state.votes["daily"]).toBe("Sì");
  });
  it("keeps the daily community yes vote at 62 percent", () => {
    expect(dailyResults["Sì"]).toBe(62);
    expect(dailyResults["Sì"] + dailyResults["No"]).toBe(100);
  });
  it("offers all ten requested swipe topics", () => {
    expect(topics).toEqual([
      "AI & Tech",
      "Politica",
      "Economia",
      "Sport",
      "Moda",
      "Cultura",
      "Ambiente",
      "Esteri",
      "Lavoro",
      "Salute",
    ]);
  });
  it("toggles a reminder without duplicates", () => {
    expect(toggleValue([], "ai")).toEqual(["ai"]);
    expect(toggleValue(["ai"], "ai")).toEqual([]);
  });
  it("compares votes before and after a debate", () => {
    expect(hasChangedMind("Sì", "No")).toBe(true);
    expect(hasChangedMind("Sì", "Sì")).toBe(false);
  });
  it("keeps library discounts independent of user answers", () => {
    expect(partners.find((item) => item.category === "Librerie")?.discount).toBe("-15%");
  });
  it("recovers from malformed local data", () => {
    expect(parseUser("{bad")).toEqual(initialUser);
  });
});
