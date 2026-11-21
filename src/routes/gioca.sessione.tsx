import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, pageHead } from "@/components/factanza/shared";
import { useFactanza } from "@/components/factanza/context";
import { ChoiceGame } from "@/components/games/choice-game";
import { CluesGame, MapGame, OrderGame, SliderGame } from "@/components/games/other-games";
import { contentFor } from "@/data/games/content";
import { fetchWeekPlays, recordPlay } from "@/lib/games/api";
import { gameInfo, gamesForDay, todayInRome, weekStart } from "@/lib/games/schedule";
import { gameScore, gameSeconds } from "@/lib/games/scoring";
import type { Answer, GameKind } from "@/lib/games/types";

export const Route = createFileRoute("/gioca/sessione")({
  head: () =>
    pageHead(
      "La sessione di oggi",
      "Una sessione unica: un gioco per ogni categoria, uno dopo l’altro.",
    ),
  component: Session,
});

/**
 * La sessione del giorno: i giochi (uno per categoria) si giocano di fila, senza tornare
 * all'elenco. Se si esce a metà, si riprende dal primo gioco non ancora fatto.
 */
function Session() {
  const { session } = useFactanza();
  const today = todayInRome();
  const games = gamesForDay(today);
  const [queue, setQueue] = useState<GameKind[] | null>(null);
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<{ kind: GameKind; score: number; error: string | null }[]>(
    [],
  );

  useEffect(() => {
    if (!session) return;
    void fetchWeekPlays(weekStart(today)).then((plays) =>
      setQueue(games.filter((game) => !plays.some((p) => p.day === today && p.game === game))),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, today]);

  const kind = queue?.[round];
  const done = games.length - (queue?.length ?? 0) + results.length;
  const last = results.at(-1);
  const showResult = last && results.length === round + 1;

  return (
    <AppShell>
      <div className="page-content game-page">
        <div className="back-bar">
          <Button variant="facta" size="icon" asChild>
            <Link to="/gioca" aria-label="Esci dal quiz">
              <ArrowLeft />
            </Link>
          </Button>
          <span>Quiz di oggi</span>
        </div>

        <div
          className="play-progress"
          aria-label={`Gioco ${Math.min(done + 1, games.length)} di ${games.length}`}
        >
          {games.map((game, i) => (
            <span key={game} className={i < done ? "done" : i === done ? "current" : ""} />
          ))}
        </div>

        {queue === null && <p className="body-copy mt-4">Un attimo…</p>}

        {queue && queue.length === 0 && (
          <>
            <p className="body-copy mt-4">Hai già fatto la sessione di oggi. Torna domani!</p>
            <Button variant="sticker" className="w-full mt-4" asChild>
              <Link to="/gioca">Vedi il riepilogo</Link>
            </Button>
          </>
        )}

        {showResult ? (
          <div className="session-break">
            <span className="sticker small yellow">{gameInfo[last.kind].family.toUpperCase()}</span>
            <motion.strong
              className="challenge-score"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              +{last.score}
            </motion.strong>
            <p>{gameInfo[last.kind].title}</p>
            {last.error && <p className="game-error">{last.error}</p>}
            {queue && round < queue.length - 1 ? (
              <Button variant="sticker" className="w-full" onClick={() => setRound(round + 1)}>
                Prossima domanda <ArrowRight />
              </Button>
            ) : (
              <Button variant="sticker" className="w-full" asChild>
                <Link to="/gioca">
                  Fine! Vedi il risultato <ArrowRight />
                </Link>
              </Button>
            )}
          </div>
        ) : (
          kind && (
            <Round
              key={kind}
              kind={kind}
              onDone={(score, error) =>
                setResults((current) => [...current, { kind, score, error }])
              }
            />
          )
        )}
      </div>
    </AppShell>
  );
}

/** Un gioco della sessione: parte subito, con il suo timer, e salva il punteggio alla fine. */
function Round({
  kind,
  onDone,
}: {
  kind: GameKind;
  onDone: (score: number, error: string | null) => void;
}) {
  const { track } = useFactanza();
  const content = contentFor(kind, todayInRome());
  const [left, setLeft] = useState(gameSeconds(kind));
  const [saving, setSaving] = useState(false);
  const startedAt = useRef(Date.now());
  const finished = useRef(false);

  useEffect(() => {
    track("game_start", { game: kind });
    const timer = setInterval(() => {
      setLeft((value) => {
        if (value <= 1) {
          clearInterval(timer);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!content) return null;
  const info = gameInfo[kind];

  const finish = (answers: Answer[], answerMs?: number) => {
    if (finished.current) return;
    finished.current = true;
    const durationMs = Date.now() - startedAt.current;
    const score = gameScore(kind, answers, answerMs ?? durationMs);
    const correct =
      kind === "metti-in-ordine"
        ? (answers[0]?.inPlace ?? 0)
        : answers.filter((answer) => answer.correct).length;
    const items =
      content.kind === "metti-in-ordine"
        ? (content.items[0]?.ordered.length ?? 4)
        : content.items.length;
    setSaving(true);
    track("game_done", {
      game: kind,
      score,
      correct,
      items,
      seconds: Math.round(durationMs / 1000),
    });
    void recordPlay({ game: kind, topic: content.topic, score, correct, items, durationMs }).then(
      ({ error }) => onDone(score, error),
    );
  };

  if (saving) return <p className="body-copy mt-4">Salvo il punteggio…</p>;
  const props = { kind, timeUp: left === 0, onFinish: finish };

  return (
    <>
      <div className="session-head">
        <span className="sticker small yellow">{info.family.toUpperCase()}</span>
        <span className={`challenge-timer ${left <= 10 ? "urgent" : ""}`} aria-live="off">
          <Timer /> {left}s
        </span>
      </div>
      <h1 className="challenge-title">{info.title}</h1>
      <div className="game-stage">
        {content.kind === "cifra" ? (
          <SliderGame {...props} items={content.items} />
        ) : content.kind === "chi-e-chi" ? (
          <CluesGame {...props} items={content.items} />
        ) : content.kind === "metti-in-ordine" ? (
          <OrderGame {...props} items={content.items} />
        ) : content.kind === "dove-succede" ? (
          <MapGame {...props} items={content.items} />
        ) : (
          <ChoiceGame {...props} items={content.items} />
        )}
      </div>
    </>
  );
}
