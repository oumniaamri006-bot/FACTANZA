import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Play, ArrowRight, Send } from "lucide-react";
import {
  AppShell,
  Back,
  IconCollage,
  PageTitle,
  SectionTitle,
  pageHead,
} from "@/components/factanza/shared";
import { Button } from "@/components/ui/button";
import { events, chatMessages } from "@/data/factanza";
import { useFactanza } from "@/components/factanza/context";

export const Route = createFileRoute("/evento")({
  validateSearch: (search: Record<string, unknown>): { id?: string } =>
    typeof search["id"] === "string" ? { id: search["id"] } : {},
  head: () =>
    pageHead(
      "Il dibattito live",
      "Vota prima e dopo il confronto. Scopri come cambia la prospettiva della community.",
    ),
  component: Event,
});

const phaseLabels = ["PRIMA DEL LIVE", "SIAMO IN DIRETTA", "DOPO IL CONFRONTO", "IL RISULTATO"];

function Event() {
  const { id } = Route.useSearch();
  const event = events.find((item) => item.id === id) ?? events[0];
  const { user, vote } = useFactanza();
  const [phase, setPhase] = useState(0);
  const [chat, setChat] = useState(chatMessages.slice(0, 2));
  const [input, setInput] = useState("");
  const [poll, setPoll] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== 1) return;
    let index = 2;
    const interval = setInterval(() => {
      const message = chatMessages[index % chatMessages.length];
      if (message) setChat((old) => [...old, message]);
      index++;
      setPoll(true);
    }, 4500);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [chat]);

  if (!event) return null;
  const before = user.votes[`before-${event.id}`];
  const after = user.votes[`after-${event.id}`];
  const current = phase === 0 ? before : after;

  return (
    <AppShell>
      <div className="page-content">
        <Back to="/live" />
        <span className="sticker yellow small">{phaseLabels[phase]}</span>
        <PageTitle>{event.title}</PageTitle>
        <p className="event-meta">
          {event.guest} · {event.date}
        </p>

        {(phase === 0 || phase === 2) && (
          <>
            <SectionTitle
              first={phase === 0 ? "Prima di iniziare," : "Dopo aver ascoltato,"}
              second="TU CHE NE PENSI?"
              color="lilac"
            />
            <div className="flex flex-wrap gap-3">
              {["Sì", "No", "Non so"].map((choice) => (
                <Button
                  key={choice}
                  variant="facta"
                  className={current === choice ? "picked" : ""}
                  aria-pressed={current === choice}
                  onClick={() => vote(`${phase === 0 ? "before" : "after"}-${event.id}`, choice)}
                >
                  {choice}
                </Button>
              ))}
            </div>
            <Button
              variant="sticker"
              className="w-full mt-8"
              disabled={!current}
              onClick={() => setPhase(phase === 0 ? 1 : 3)}
            >
              {phase === 0 ? "Entra nella diretta" : "Scopri i risultati"}
              <ArrowRight />
            </Button>
          </>
        )}

        {phase === 1 && (
          <>
            <div className="video-screen">
              <IconCollage className="video-backdrop" />
              <Play size={46} />
              <span className="live-badge">LIVE DEMO</span>
            </div>
            <div ref={chatRef} className="chat">
              {chat.map((message, i) => (
                <p key={i}>
                  <strong>{message.name}</strong> {message.text}
                </p>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim()) {
                  setChat((old) => [...old, { name: user.name, text: input.trim() }]);
                  setInput("");
                }
              }}
            >
              <input
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="La tua voce, qui…"
                aria-label="Messaggio nella chat"
              />
              <Button variant="facta" size="icon" aria-label="Invia messaggio">
                <Send />
              </Button>
            </form>
            {poll && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Sondaggio live: la scuola prepara all’AI?</h3>
                {user.votes["live-poll"] ? (
                  <p className="hand">(il 71% dice: non ancora)</p>
                ) : (
                  <div className="vote-actions">
                    {["Sì", "Non ancora"].map((choice) => (
                      <Button
                        key={choice}
                        variant="facta"
                        onClick={() => vote("live-poll", choice)}
                      >
                        {choice}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <Button variant="sticker" className="w-full mt-6" onClick={() => setPhase(2)}>
              Concludi il dibattito <ArrowRight />
            </Button>
          </>
        )}

        {phase === 3 && (
          <>
            <span className="sticker yellow my-5">
              IL 27% HA
              <br />
              CAMBIATO IDEA
            </span>
            <p className="hand mt-4">(ascoltare fa la differenza)</p>
            <div className="mt-8">
              <div className="result-row">
                <span>Prima · Sì</span>
                <strong>64%</strong>
              </div>
              <div className="vote-bar">
                <div className="vote-fill" style={{ width: "64%" }} />
              </div>
              <div className="result-row">
                <span>Dopo · Sì</span>
                <strong>37%</strong>
              </div>
              <div className="vote-bar">
                <div className="vote-fill no" style={{ width: "37%" }} />
              </div>
            </div>
            <p className="body-copy mt-6">
              Il tuo voto:{" "}
              <strong>
                {before} → {after}
              </strong>
              <br />
              {before !== after
                ? "Anche tu hai cambiato prospettiva."
                : "Hai confermato la tua idea, ascoltando altre voci."}
            </p>
            <p className="demo-label">Percentuali simulate per il dibattito demo.</p>
          </>
        )}
      </div>
    </AppShell>
  );
}
