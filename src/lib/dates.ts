const zone = "Europe/Rome";
const toDate = (iso: string) => new Date(`${iso}T12:00:00Z`);
const part = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("it-IT", { timeZone: zone, ...options }).format(toDate(iso));

/** Parti di una data (AAAA-MM-GG) per il calendario: "sab", "7", "nov". */
export function dayParts(iso: string) {
  return {
    weekday: part(iso, { weekday: "short" }).replace(".", ""),
    day: part(iso, { day: "numeric" }),
    month: part(iso, { month: "short" }).replace(".", ""),
  };
}

/** Data leggibile: "7 novembre 2026". */
export function longDate(iso: string) {
  return part(iso, { day: "numeric", month: "long", year: "numeric" });
}

/** Data breve per le card: "7 nov". */
export function shortDate(iso: string) {
  const { day, month } = dayParts(iso);
  return `${day} ${month}`;
}

/** `count` giorni consecutivi a partire da `start` (AAAA-MM-GG). */
export function nextDays(start: string, count: number) {
  const first = new Date(`${start}T12:00:00Z`);
  return Array.from({ length: count }, (_, index) => {
    const day = new Date(first);
    day.setUTCDate(first.getUTCDate() + index);
    return day.toISOString().slice(0, 10);
  });
}
