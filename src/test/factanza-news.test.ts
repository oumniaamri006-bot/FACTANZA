import { describe, expect, it } from "vitest";
import { news } from "@/data/news";
import { getCategoryByName } from "@/data/categories";

describe("Demo news", () => {
  it("uses unique ids", () => {
    expect(new Set(news.map((item) => item.id)).size).toBe(news.length);
  });
  for (const item of news) {
    it(`"${item.id}" follows the news format`, () => {
      expect(getCategoryByName(item.topic)).toBeTruthy();
      expect(item.title).toContain(item.accent);
      expect(item.slides).toHaveLength(5);
      for (const slide of item.slides) expect(slide.split(/\s+/).length).toBeLessThanOrEqual(25);
    });
  }
});
