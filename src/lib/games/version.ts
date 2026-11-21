/**
 * Versione del quiz di oggi (solo per l'MVP): il tasto Reset passa alla versione successiva,
 * con altri minigiochi e altre domande. Salvata nel browser, per giorno.
 */
import { quizVersions } from "./schedule";

const key = "factanza-quiz-version";

export function getQuizVersion(day: string): number {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? "null") as {
      day: string;
      v: number;
    } | null;
    return saved?.day === day ? saved.v : 0;
  } catch {
    return 0;
  }
}

/** Versione dopo un reset: 0 → 1 → 2 → 3 → 1 … (le 3 versioni nuove ruotano). */
export const nextQuizVersion = (version: number) => (version % (quizVersions - 1)) + 1;

export function bumpQuizVersion(day: string): number {
  const next = nextQuizVersion(getQuizVersion(day));
  try {
    localStorage.setItem(key, JSON.stringify({ day, v: next }));
  } catch {
    // storage non disponibile: resta la versione originale
  }
  return next;
}
