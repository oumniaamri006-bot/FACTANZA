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
import { useOpinionChange, usePollResults } from "@/lib/reading";

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
  const { user, vote, track } = useFactanza();
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

  const eventId = event?.id ?? "";
  const voteOptions = ["Sì", "No", "Non so"];
  const before = user.votes[`before-${eventId}`];
  const after = user.votes[`after-${eventId}`];
  const beforeResults = usePollResults(`before-${eventId}`, voteOptions, before);
  const afterResults = usePollResults(`after-${eventId}`, voteOptions, after);
  const change = useOpinionChange(eventId, phase === 3 ? after : undefined);
  const livePoll = usePollResults("live-poll", ["Sì", "Non ancora"], user.votes["live-poll"]);
  if (!event) return null;
  // Se il database non ha ancora risposto, contiamo almeno il tuo voto.
  const voters = Math.max(change?.voters ?? 0, before && after ? 1 : 0);
  const changed = change ? change.changed : before && after && before !== after ? 1 : 0;
  const changedPct = voters ? Math.round((100 * changed) / voters) : 0;
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
              onClick={() => {
                setPhase(phase === 0 ? 1 : 3);
                track("live_phase", {
                  event_id: event.id,
                  phase: phase === 0 ? "diretta" : "risultati",
                });
              }}
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
                  // Solo che è stato scritto un messaggio e quanto è lungo, mai il testo.
                  track("chat_message", { event_id: event.id, length: input.trim().length });
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
                  <p className="hand">
                    (il {livePoll.percents[1]}% dice: non ancora · {livePoll.total}{" "}
                    {livePoll.total === 1 ? "voto" : "voti"})
                  </p>
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
            <Button
              variant="sticker"
              className="w-full mt-6"
              onClick={() => {
                setPhase(2);
                track("live_phase", { event_id: event.id, phase: "dopo" });
              }}
            >
              Concludi il dibattito <ArrowRight />
            </Button>
          </>
        )}

        {phase === 3 && (
          <>
            <span className="sticker yellow my-5">
              IL {changedPct}% HA
              <br />
              CAMBIATO IDEA
            </span>
            <p className="hand mt-4">
              ({voters} {voters === 1 ? "persona ha" : "persone hanno"} votato prima e dopo)
            </p>
            <div className="mt-8">
              {voteOptions.map((option, index) => (
                <div key={option}>
                  <div className="result-row">
                    <span>{option}</span>
                    <strong>
                      prima {beforeResults.percents[index]}% · dopo {afterResults.percents[index]}%
                    </strong>
                  </div>
                  <div className="vote-bar">
                    <div
                      className="vote-fill"
                      style={{ width: `${beforeResults.percents[index]}%` }}
                    />
                  </div>
                  <div className="vote-bar">
                    <div
                      className="vote-fill no"
                      style={{ width: `${afterResults.percents[index]}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="demo-label">Verde: prima del dibattito · rosa: dopo.</p>
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
            <p className="demo-label">Risultati reali dei voti della community.</p>
          </>
        )}
      </div>
    </AppShell>
  );
}
