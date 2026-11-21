import { describe, expect, it } from "vitest";
import { pollResults } from "@/lib/poll";
import { news } from "@/data/news";

describe("Article polls", () => {
  it("returns stable percentages that sum to 100", () => {
    const options = ["Sì", "No", "Non so"];
    const first = pollResults("demo", options, "No");
    expect(first.reduce((a, b) => a + b, 0)).toBe(100);
    expect(pollResults("demo", options, "No")).toEqual(first);
  });
  it("gives every article a poll with at least two answers", () => {
    for (const item of news) {
      expect(item.poll.question.length).toBeGreaterThan(5);
      expect(item.poll.options.length).toBeGreaterThanOrEqual(2);
    }
  });
});
