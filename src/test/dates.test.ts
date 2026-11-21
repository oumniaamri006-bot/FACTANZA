import { describe, expect, it } from "vitest";
import { dayParts, longDate, shortDate } from "@/lib/dates";
import { news } from "@/data/news";

describe("News calendar dates", () => {
  it("formats dates in Italian", () => {
    expect(dayParts("2026-11-07")).toEqual({ weekday: "sab", day: "7", month: "nov" });
    expect(longDate("2026-11-07")).toBe("7 novembre 2026");
    expect(shortDate("2026-09-19")).toBe("19 set");
  });
  it("gives every news item a valid date", () => {
    for (const item of news) {
      expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(new Date(item.date).getTime())).toBe(false);
    }
  });
});
