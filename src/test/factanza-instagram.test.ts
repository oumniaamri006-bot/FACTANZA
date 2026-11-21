import { describe, expect, it } from "vitest";
import { instagramEmbedUrl, instagramPosts, instagramProfileEmbedUrl } from "@/data/instagram";

describe("Instagram embeds", () => {
  it("builds the official embed URL for posts and reels", () => {
    expect(instagramEmbedUrl("https://www.instagram.com/p/ABC123_x/")).toBe(
      "https://www.instagram.com/p/ABC123_x/embed/captioned/",
    );
    expect(instagramEmbedUrl("https://instagram.com/factanza/reel/Xy-9?igsh=1")).toBe(
      "https://www.instagram.com/reel/Xy-9/embed/captioned/",
    );
  });
  it("rejects links that are not Instagram posts", () => {
    expect(instagramEmbedUrl("https://example.com/p/ABC")).toBeNull();
    expect(instagramEmbedUrl("https://www.instagram.com/factanza/")).toBeNull();
  });
  it("only lists valid post links", () => {
    for (const link of instagramPosts) expect(instagramEmbedUrl(link)).not.toBeNull();
  });
  it("embeds the factanza profile", () => {
    expect(instagramProfileEmbedUrl).toBe("https://www.instagram.com/factanza/embed/");
  });
});
