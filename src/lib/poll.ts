/** Hash semplice e stabile di una stringa (per risultati demo sempre uguali). */
function hash(text: string) {
  let h = 2166136261;
  for (const char of text) h = Math.imul(h ^ char.charCodeAt(0), 16777619);
  return h >>> 0;
}

/**
 * Percentuali simulate di un sondaggio demo: stabili per ogni sondaggio, includono il voto
 * dell'utente e sommano sempre a 100.
 */
export function pollResults(pollId: string, options: string[], choice?: string): number[] {
  const votes = options.map((option) => 40 + (hash(`${pollId}:${option}`) % 160));
  const picked = choice ? options.indexOf(choice) : -1;
  if (picked >= 0) votes[picked] = (votes[picked] ?? 0) + 1;
  const total = votes.reduce((sum, value) => sum + value, 0);
  const exact = votes.map((value) => (value / total) * 100);
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
