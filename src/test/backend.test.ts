import { describe, expect, it } from "vitest";
import { percentages } from "@/lib/poll";
import { authErrorMessage } from "@/lib/supabase";
import { tapLabel } from "@/lib/analytics";

describe("Sondaggi reali", () => {
  it("convert vote counts to percentages that sum to 100", () => {
    expect(percentages([1, 1, 1])).toEqual([34, 33, 33]);
    expect(percentages([0, 0])).toEqual([0, 0]);
    expect(percentages([3, 7]).reduce((a, b) => a + b, 0)).toBe(100);
  });
});

describe("Accesso", () => {
  it("explains auth errors in Italian", () => {
    expect(authErrorMessage("Invalid login credentials")).toBe("Email o password non corretti.");
    expect(authErrorMessage("User already registered")).toMatch(/Esiste già un account/);
    expect(authErrorMessage("Password should be at least 6 characters")).toMatch(/6 caratteri/);
    expect(authErrorMessage("boom")).toBe("Qualcosa non ha funzionato: riprova.");
  });
});

describe("Heatmap", () => {
  it("labels tapped elements without reading typed text", () => {
    document.body.innerHTML =
      '<button aria-label="Chiudi"><span id="a">x</span></button><input id="b" value="segreto" />';
    expect(tapLabel(document.getElementById("a"))).toBe("Chiudi");
    expect(tapLabel(document.getElementById("b"))).toBeUndefined();
  });
});
