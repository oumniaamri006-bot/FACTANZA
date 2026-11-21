/** Hash semplice e stabile di una stringa (per risultati demo sempre uguali). */
function hash(text: string) {
  let h = 2166136261;
  for (const char of text) h = Math.imul(h ^ char.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** Converte conteggi in percentuali intere che sommano a 100 (metodo dei resti maggiori). */
export function percentages(counts: number[]): number[] {
  const total = counts.reduce((sum, value) => sum + value, 0);
  if (total === 0) return counts.map(() => 0);
  const exact = counts.map((value) => (value / total) * 100);
  const result = exact.map(Math.floor);
  let missing = 100 - result.reduce((sum, value) => sum + value, 0);
  const order = exact
    .map((value, index) => ({ index, rest: value - Math.floor(value) }))
    .sort((a, b) => b.rest - a.rest);
  for (const { index } of order) {
    if (missing <= 0) break;
    result[index] = (result[index] ?? 0) + 1;
    missing--;
  }
  return result;
}

/** Sotto questa soglia di voti reali si mostrano percentuali simulate (per anonimato e demo). */
export const realResultsThreshold = 10;

/**
 * Percentuali simulate di un sondaggio demo: stabili per ogni sondaggio, includono il voto
 * dell'utente e sommano sempre a 100.
 */
export function pollResults(pollId: string, options: string[], choice?: string): number[] {
  const votes = options.map((option) => 40 + (hash(`${pollId}:${option}`) % 160));
  const picked = choice ? options.indexOf(choice) : -1;
  if (picked >= 0) votes[picked] = (votes[picked] ?? 0) + 1;
  return percentages(votes);
}
