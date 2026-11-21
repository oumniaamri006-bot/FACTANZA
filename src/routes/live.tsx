import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Check, CirclePlay, Send, MessageCircle } from "lucide-react";
import { AppShell, SectionTitle, TopicCover, pageHead } from "@/components/factanza/shared";
import { Button } from "@/components/ui/button";
import { events } from "@/data/factanza";
import { useFactanza } from "@/components/factanza/context";
import { toggleValue } from "@/lib/factanza-state";

export const Route = createFileRoute("/live")({
  head: () =>
    pageHead(
      "Live — Accendi il confronto",
      "Dibattiti, ospiti e sondaggi: partecipa alle dirette Factanza.",
    ),
  component: Live,
});

const sections = [
  { status: "live", title: "In diretta ora" },
  { status: "next", title: "Prossimi" },
  { status: "replay", title: "Replay" },
] as const;

function Live() {
  const { user, update, notify } = useFactanza();

  const toggleReminder = (id: string) => {
    const had = user.reminders.includes(id);
    update({ reminders: toggleValue(user.reminders, id) });
    notify(had ? "Promemoria rimosso." : "Promemoria salvato su questo dispositivo!");
  };

  return (
    <AppShell>
      <div className="page-content">
        <SectionTitle first="Non stare" second="A GUARDARE." color="magenta" />
        {sections.map(({ status, title }) => (
          <section key={status}>
            <h2 className="subsection-title mt-8">{title}</h2>
            {events
              .filter((event) => event.status === status)
              .map((event) => (
                <article className="event" key={event.id}>
                  {status === "live" && <span className="live-badge">IN DIRETTA</span>}
                  <TopicCover topic={event.topic} className="event-media" />
                  <h3>{event.title}</h3>
                  <p className="event-meta">
                    {event.date}
                    <br />
                    {event.guest}
                  </p>
                  <div className="link-row">
                    <Button variant={status === "live" ? "sticker" : "facta"} asChild>
                      <Link to="/evento" search={{ id: event.id }}>
                        <CirclePlay />
                        {status === "replay" ? "Guarda il replay" : "Entra nel dibattito"}
                      </Link>
                    </Button>
                    {status === "next" && (
                      <Button
                        variant="facta"
                        className={user.reminders.includes(event.id) ? "picked" : ""}
                        aria-label="Ricordamelo"
                        aria-pressed={user.reminders.includes(event.id)}
                        onClick={() => toggleReminder(event.id)}
                      >
                        {user.reminders.includes(event.id) ? <Check /> : <Bell />}
                      </Button>
                    )}
                  </div>
                </article>
              ))}
          </section>
        ))}
      </div>
      <div className="channels">
        <h3 className="font-semibold">Ricevi gli avvisi delle live</h3>
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
