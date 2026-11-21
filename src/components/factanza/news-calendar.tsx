import { dayParts, longDate } from "@/lib/dates";

/** Striscia di giorni da scorrere: filtra le notizie per data di pubblicazione. */
export function NewsCalendar({
  days,
  counts,
  selected,
  onSelect,
}: {
  days: string[];
  counts: Record<string, number>;
  selected: string | null;
  onSelect: (day: string | null) => void;
}) {
  return (
    <div className="news-calendar" role="group" aria-label="Calendario delle notizie">
      <button
        type="button"
        className={`calendar-day all ${selected === null ? "selected" : ""}`}
        aria-pressed={selected === null}
        onClick={() => onSelect(null)}
      >
        <span className="calendar-all">TUTTI</span>
        <span className="calendar-month">i giorni</span>
      </button>
      {days.map((day) => {
        const { weekday, day: number, month } = dayParts(day);
        const count = counts[day] ?? 0;
        return (
          <button
            type="button"
            key={day}
            className={`calendar-day ${selected === day ? "selected" : ""}`}
            aria-pressed={selected === day}
            aria-label={`${longDate(day)}, ${count} ${count === 1 ? "notizia" : "notizie"}`}
            onClick={() => onSelect(day)}
          >
            <span className="calendar-weekday">{weekday}</span>
            <span className="calendar-number">{number}</span>
            <span className="calendar-month">{month}</span>
            {count > 1 && <span className="calendar-count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
