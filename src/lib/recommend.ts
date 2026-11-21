/** "2.3k" → 2300, "946" → 946. */
export function parseOpinions(value: string) {
  const match = value.trim().match(/^([\d.,]+)\s*(k)?$/i);
  if (!match) return 0;
  const number = Number((match[1] ?? "0").replace(",", "."));
  return Math.round(match[2] ? number * 1000 : number);
}

/**
 * Notizie suggerite: quelle su temi che l'utente non ha scelto, dalle più discusse.
 * Se non ha scelto nessun tema, le più discusse in assoluto.
 */
export function suggestedNews<T extends { topic: string; opinions: string }>(
  items: T[],
  interests: string[],
) {
  const pool = interests.length ? items.filter((item) => !interests.includes(item.topic)) : items;
  return [...pool].sort((a, b) => parseOpinions(b.opinions) - parseOpinions(a.opinions));
}
