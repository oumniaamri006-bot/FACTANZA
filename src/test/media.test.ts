import { describe, expect, it } from "vitest";
import { media, mediaLink } from "@/data/factanza";
import { getCategoryByName } from "@/data/categories";

describe("Podcast e video", () => {
  it("have a cover, a known topic and unique ids", () => {
    expect(new Set(media.map((item) => item.id)).size).toBe(media.length);
    for (const item of media) {
      expect(item.image).toBeTruthy();
      expect(getCategoryByName(item.topic)).toBeTruthy();
    }
  });
  it("link every video to its YouTube page", () => {
    const videos = media.filter((item) => item.type === "YouTube");
    expect(videos.length).toBeGreaterThan(30);
    for (const item of videos) {
      expect(item.youtubeId).toMatch(/^[\w-]{11}$/);
      expect(mediaLink(item)).toBe(`https://www.youtube.com/watch?v=${item.youtubeId}`);
    }
    expect(new Set(videos.map((item) => item.youtubeId)).size).toBe(videos.length);
  });
});
