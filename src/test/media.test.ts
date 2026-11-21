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
  it("link to YouTube or Spotify", () => {
    for (const item of media) {
      expect(mediaLink(item)).toMatch(
        item.type === "YouTube"
          ? /^https:\/\/www\.youtube\.com\//
          : /^https:\/\/open\.spotify\.com\//,
      );
    }
  });
});
