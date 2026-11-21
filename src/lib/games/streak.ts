/**
 * Serie di giorni di gioco consecutivi (come Duolingo): conta i giorni di fila fino a oggi.
 * Se oggi non hai ancora giocato la serie vale ancora (fino a ieri) ma è "a rischio".
 */
import { addDays } from "./schedule";

export type Streak = { count: number; playedToday: boolean; atRisk: boolean };

export function currentStreak(days: Iterable<string>, today: string): Streak {
  const played = new Set(days);
  const playedToday = played.has(today);
  let day = playedToday ? today : addDays(today, -1);
  let count = 0;
  while (played.has(day)) {
    count++;
    day = addDays(day, -1);
  }
  return { count, playedToday, atRisk: !playedToday && count > 0 };
}

/** Prossimo traguardo della serie e bonus settimanale collegato. */
export const streakMilestones = [3, 5, 7] as const;

export function nextMilestone(count: number) {
  return streakMilestones.find((target) => target > count) ?? null;
}

/** Messaggio motivazionale sotto la fiamma. */
export function streakMessage(streak: Streak) {
  if (streak.count === 0) return "Gioca oggi e accendi la tua serie!";
  if (streak.atRisk)
    return `La tua serie di ${streak.count} giorni si spegne a mezzanotte: gioca ora!`;
  const next = nextMilestone(streak.count);
  if (next)
    return `Ancora ${next - streak.count} ${next - streak.count === 1 ? "giorno" : "giorni"} per arrivare a ${next}!`;
  return "Serie leggendaria: non fermarti!";
}
