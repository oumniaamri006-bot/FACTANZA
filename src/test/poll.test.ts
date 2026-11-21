import { describe, expect, it } from "vitest";
import { percentages } from "@/lib/poll";
import { news } from "@/data/news";

describe("Article polls", () => {
  it("turns real vote counts into percentages that sum to 100", () => {
    expect(percentages([2, 1]).reduce((a, b) => a + b, 0)).toBe(100);
    expect(percentages([1, 0, 0])).toEqual([100, 0, 0]);
  });
  it("gives every article a poll with at least two answers", () => {
    for (const item of news) {
      expect(item.poll.question.length).toBeGreaterThan(5);
      expect(item.poll.options.length).toBeGreaterThanOrEqual(2);
    }
  });
});
