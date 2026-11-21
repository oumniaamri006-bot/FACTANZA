import { describe, expect, it } from "vitest";
import { agenda, demoToday } from "@/data/agenda";
import { events, media } from "@/data/factanza";
import { getCategoryByName } from "@/data/categories";
import { nextDays } from "@/lib/dates";
import { parseOpinions, suggestedNews } from "@/lib/recommend";

describe("Events calendar", () => {
  it("builds consecutive days across months", () => {
    expect(nextDays("2026-11-29", 3)).toEqual(["2026-11-29", "2026-11-30", "2026-12-01"]);
  });
  it("links every appointment to a real topic, event or media", () => {
    for (const item of agenda) {
      expect(getCategoryByName(item.topic)).toBeTruthy();
      if (item.eventId) expect(events.some((event) => event.id === item.eventId)).toBe(true);
      if (item.mediaId) expect(media.some((entry) => entry.id === item.mediaId)).toBe(true);
    }
  });
  it("shows appointments within the first two weeks", () => {
    const days = nextDays(demoToday, 14);
    expect(agenda.every((item) => days.includes(item.date))).toBe(true);
  });
});

describe("Suggested news", () => {
  const items = [
    { topic: "Lavoro", opinions: "946" },
    { topic: "Esteri", opinions: "2.3k" },
    { topic: "Trend", opinions: "1.1k" },
  ];
  it("parses opinion counts", () => {
    expect(parseOpinions("2.3k")).toBe(2300);
    expect(parseOpinions("946")).toBe(946);
  });
  it("suggests other topics, most discussed first", () => {
    expect(suggestedNews(items, ["Esteri"]).map((item) => item.topic)).toEqual(["Trend", "Lavoro"]);
    expect(suggestedNews(items, []).map((item) => item.topic)).toEqual([
      "Esteri",
      "Trend",
      "Lavoro",
    ]);
  });
});
