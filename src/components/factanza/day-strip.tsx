import { dayParts, longDate } from "@/lib/dates";

/** Calendario a striscia: giorni da scorrere, con il numero di appuntamenti di ogni giorno. */
export function DayStrip({
  days,
  counts,
  selected,
  onSelect,
  today,
  label,
}: {
  days: string[];
  counts: Record<string, number>;
  selected: string;
  onSelect: (day: string) => void;
  today?: string;
  label: string;
}) {
  return (
    <div className="news-calendar" role="group" aria-label={label}>
      {days.map((day) => {
        const { weekday, day: number, month } = dayParts(day);
        const count = counts[day] ?? 0;
        return (
          <button
            type="button"
            key={day}
            className={`calendar-day ${selected === day ? "selected" : ""} ${count ? "" : "empty"}`}
            aria-pressed={selected === day}
            aria-label={`${longDate(day)}, ${count ? `${count} appuntamenti` : "nessun appuntamento"}`}
            onClick={() => onSelect(day)}
          >
            <span className="calendar-weekday">{day === today ? "OGGI" : weekday}</span>
            <span className="calendar-number">{number}</span>
            <span className="calendar-month">{month}</span>
            {count > 0 && <span className="calendar-count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
