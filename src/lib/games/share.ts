/** Riga di quadratini in stile Wordle: verde ≥ 70 punti, giallo ≥ 40, rosso sotto, bianco se non giocato. */
export function shareSquares(scores: (number | undefined)[], max = 100) {
  return scores
    .map((score) => {
      if (score === undefined) return "⬜";
      const ratio = score / max;
      return ratio >= 0.7 ? "🟩" : ratio >= 0.4 ? "🟨" : "🟥";
    })
    .join("");
}
