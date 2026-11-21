import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Bell, Check, CirclePlay, Send, MessageCircle } from "lucide-react";
import { AppShell, SectionTitle, TopicCover, pageHead } from "@/components/factanza/shared";
import { DayStrip } from "@/components/factanza/day-strip";
import { Button } from "@/components/ui/button";
import { events } from "@/data/factanza";
import { agenda, agendaKindLabel, demoToday, type AgendaItem } from "@/data/agenda";
import { useFactanza } from "@/components/factanza/context";
import { toggleValue } from "@/lib/factanza-state";
import { longDate, nextDays } from "@/lib/dates";

export const Route = createFileRoute("/live")({
  head: () =>
    pageHead(
      "Eventi — Il calendario di Factanza",
      "Dirette, uscite di podcast e video, eventi: il calendario degli appuntamenti Factanza.",
    ),
  component: Live,
});

const calendarDays = nextDays(demoToday, 14);

function AgendaAction({ item }: { item: AgendaItem }) {
  const { user, update, notify } = useFactanza();
  const released = item.date <= demoToday;
  const reminded = user.reminders.includes(item.id);

  if (released && item.eventId) {
    return (
      <Button variant="sticker" size="icon" asChild>
        <Link to="/evento" search={{ id: item.eventId }} aria-label={`Entra: ${item.title}`}>
          <CirclePlay />
        </Link>
      </Button>
    );
  }
  if (released && item.mediaId) {
    return (
      <Button variant="facta" size="icon" asChild>
        {item.kind === "video" ? (
          <Link to="/video" search={{ id: item.mediaId }} aria-label={`Guarda: ${item.title}`}>
            <ArrowRight />
          </Link>
        ) : (
          <Link to="/contenuti" aria-label={`Ascolta: ${item.title}`}>
            <ArrowRight />
          </Link>
        )}
      </Button>
    );
  }
  return (
    <Button
      variant="facta"
      size="icon"
      className={reminded ? "picked" : ""}
      aria-label={`Ricordamelo: ${item.title}`}
      aria-pressed={reminded}
      onClick={() => {
        update({ reminders: toggleValue(user.reminders, item.id) });
        notify(reminded ? "Promemoria rimosso." : "Promemoria salvato su questo dispositivo!");
      }}
    >
      {reminded ? <Check /> : <Bell />}
    </Button>
  );
}

function Live() {
  const { notify } = useFactanza();
  const [day, setDay] = useState(demoToday);
  const counts = Object.fromEntries(
    calendarDays.map((d) => [d, agenda.filter((item) => item.date === d).length]),
  );
  const ofDay = agenda
    .filter((item) => item.date === day)
    .sort((a, b) => a.time.localeCompare(b.time));
  const liveNow = events.filter((event) => event.status === "live");
  const replays = events.filter((event) => event.status === "replay");

  return (
    <AppShell>
      <div className="page-content">
        <SectionTitle first="Non stare" second="A GUARDARE." color="magenta" />

        {liveNow.map((event) => (
          <article className="event" key={event.id}>
            <span className="live-badge">IN DIRETTA</span>
            <TopicCover topic={event.topic} className="event-media" />
            <h3>{event.title}</h3>
            <p className="event-meta">
              {event.date}
              <br />
              {event.guest}
            </p>
            <Button variant="sticker" asChild>
              <Link to="/evento" search={{ id: event.id }}>
                <CirclePlay />
                Entra nel dibattito
              </Link>
            </Button>
          </article>
        ))}

        <SectionTitle first="Il" second="CALENDARIO" color="yellow" />
        <p className="body-copy mb-4">
          Dirette, nuovi podcast, video ed eventi, giorno per giorno.
        </p>
        <DayStrip
          days={calendarDays}
          counts={counts}
          selected={day}
          onSelect={setDay}
          today={demoToday}
          label="Calendario degli eventi"
        />
        <h2 className="subsection-title">{day === demoToday ? "Oggi" : longDate(day)}</h2>
        {ofDay.length === 0 ? (
          <p className="body-copy mb-6">Nessun appuntamento in questo giorno.</p>
        ) : (
          <ul className="agenda">
            {ofDay.map((item) => (
              <li key={item.id} className="agenda-item">
                <span className="agenda-time">{item.time}</span>
                <div className="agenda-body">
                  <span className={`agenda-kind ${item.kind}`}>{agendaKindLabel[item.kind]}</span>
                  <h3>{item.title}</h3>
                  <p>{item.topic}</p>
                </div>
                <AgendaAction item={item} />
              </li>
            ))}
          </ul>
        )}

        <h2 className="subsection-title mt-8">Replay</h2>
        {replays.map((event) => (
          <article className="event" key={event.id}>
            <TopicCover topic={event.topic} className="event-media" />
            <h3>{event.title}</h3>
            <p className="event-meta">
              {event.date}
              <br />
              {event.guest}
            </p>
            <Button variant="facta" asChild>
              <Link to="/evento" search={{ id: event.id }}>
                <CirclePlay />
                Guarda il replay
              </Link>
            </Button>
          </article>
        ))}
        <p className="demo-label">Calendario dimostrativo: date e appuntamenti sono di esempio.</p>
      </div>
      <div className="channels">
        <h3 className="font-semibold">Ricevi gli avvisi degli eventi</h3>
        <div className="link-row">
          <Button
            variant="facta"
            onClick={() => notify("Canale WhatsApp dimostrativo: nessun servizio collegato.")}
          >
            <MessageCircle />
            Canale WhatsApp
          </Button>
          <Button
            variant="facta"
            onClick={() => notify("Canale Telegram dimostrativo: nessun servizio collegato.")}
          >
            <Send />
            Canale Telegram
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
