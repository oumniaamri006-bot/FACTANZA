import { describe, expect, it } from "vitest";
import { isStaleChunkError } from "@/lib/stale-chunk";

describe("Stale deploy detection", () => {
  it("recognises missing JS files after a new deploy", () => {
    expect(
      isStaleChunkError(
        new TypeError("Failed to fetch dynamically imported module: /assets/notizia-1.js"),
      ),
    ).toBe(true);
    expect(isStaleChunkError(new TypeError("Importing a module script failed."))).toBe(true);
  });
  it("ignores ordinary errors", () => {
    expect(isStaleChunkError(new Error("Cannot read properties of undefined"))).toBe(false);
  });
});
