import { describe, it, expect } from "vitest";
import { allCategory, categories, getCategoryByName, getCategoryNews } from "@/data/categories";
import { topics } from "@/data/factanza";
import { news } from "@/data/news";
describe("Category news navigation", () => {
  it("maps each of the nine categories to a unique page and uploaded icon", () => {
    expect(categories.map((category) => category.name)).toEqual([
      "AI & Tech",
      "Politica",
      "Economia",
      "Cultura",
      "Ambiente",
      "Esteri",
      "Lavoro",
      "Salute",
      "Trend",
    ]);
    expect(new Set(categories.map((category) => category.slug)).size).toBe(9);
    expect(new Set(categories.map((category) => category.icon)).size).toBe(9);
  });
  for (const category of categories) {
    it(`shows all and only ${category.name} news independently of interests`, () => {
      expect(getCategoryNews(category.slug).map((article) => article.id)).toEqual(
        news.filter((article) => article.topic === category.name).map((article) => article.id),
      );
    });
  }
  it("lists every article in Tutti", () => {
    expect(getCategoryNews("tutte")).toEqual(news);
  });
  it("returns no news for an unknown category", () => {
    expect(getCategoryNews("unknown")).toEqual([]);
  });
  it("keeps swipe topics and categories in sync, each with a pop-art icon", () => {
    for (const topic of topics) expect(getCategoryByName(topic)?.icon).toBeTruthy();
  });
  it("gives Tutti its own pop-art icon, distinct from the nine categories", () => {
    expect(allCategory.slug).toBe("tutte");
    expect(categories.map((category) => category.icon)).not.toContain(allCategory.icon);
  });
});
