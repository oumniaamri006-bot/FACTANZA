import { describe, expect, it } from "vitest";
import { ageOf, birthYears, isMinorForConsent } from "@/data/profile-options";
import { deviceType, parseUserAgent } from "@/lib/attribution";
import { parseUser, initialUser } from "@/lib/factanza-state";

const iphone =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const instagram = `${iphone} Instagram 300.0.0`;
const windowsChrome =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

describe("Dati dichiarati", () => {
  it("blocks usage statistics under 14", () => {
    expect(ageOf(2010)).toBe(16);
    expect(isMinorForConsent(2013)).toBe(true);
    expect(isMinorForConsent(2012)).toBe(false);
    expect(isMinorForConsent(null)).toBe(false);
  });
  it("offers birth years from 10 to 70 years old", () => {
    expect(birthYears[0]).toBe(2016);
    expect(birthYears.at(-1)).toBe(1956);
  });
  it("keeps the new profile fields when parsing old data", () => {
    expect(parseUser(JSON.stringify({ name: "Ada" })).birthYear).toBeNull();
    expect(parseUser(null)).toEqual(initialUser);
  });
});

describe("Contesto della visita", () => {
  it("reduces the user agent to generic families", () => {
    expect(parseUserAgent(iphone)).toEqual({ os: "iOS", browser: "Safari" });
    expect(parseUserAgent(instagram).browser).toBe("Instagram");
    expect(parseUserAgent(windowsChrome)).toEqual({ os: "Windows", browser: "Chrome" });
  });
  it("classifies the device", () => {
    expect(deviceType(390, iphone)).toBe("mobile");
    expect(deviceType(1440, windowsChrome)).toBe("desktop");
  });
});
