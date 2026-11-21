import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Timer, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, pageHead } from "@/components/factanza/shared";
import { useFactanza } from "@/components/factanza/context";
import { ChoiceGame } from "@/components/games/choice-game";
import { CluesGame, MapGame, OrderGame, SliderGame } from "@/components/games/other-games";
import { contentFor } from "@/data/games/content";
import { fetchWeekPlays, recordPlay, type GamePlay } from "@/lib/games/api";
import { gameInfo, gamesForDay, todayInRome, weekStart } from "@/lib/games/schedule";
import { gameScore, gameSeconds } from "@/lib/games/scoring";
import type { Answer, GameKind } from "@/lib/games/types";

const kinds = Object.keys(gameInfo) as GameKind[];

export const Route = createFileRoute("/gioca/$game")({
  beforeLoad: ({ params }) => {
    if (!kinds.includes(params.game as GameKind)) throw notFound();
  },
  head: ({ params }) =>
    pageHead(
      gameInfo[params.game as GameKind]?.title ?? "Gioca",
      "Un minigioco di 45 secondi sulle notizie: rispondi e scopri la spiegazione.",
    ),
  component: GamePage,
});

type Phase = "loading" | "intro" | "play" | "saving" | "end" | "done-before" | "not-today";

function GamePage() {
  const kind = Route.useParams().game as GameKind;
  // La chiave azzera lo stato quando si passa al gioco successivo.
  return <GameView key={kind} kind={kind} />;
}

function GameView({ kind }: { kind: GameKind }) {
  const { session, track } = useFactanza();
  const today = todayInRome();
  const content = contentFor(kind, today);
  const todays = gamesForDay(today);
  const seconds = gameSeconds(kind);
  const [phase, setPhase] = useState<Phase>("loading");
  const [left, setLeft] = useState(seconds);
  const [score, setScore] = useState(0);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [previous, setPrevious] = useState<GamePlay | undefined>();
  const startedAt = useRef(0);
  const finished = useRef(false);

  useEffect(() => {
    if (!session) return;
    if (!todays.includes(kind)) {
      setPhase("not-today");
      return;
    }
    void fetchWeekPlays(weekStart(today)).then((plays) => {
      const play = plays.find((p) => p.day === today && p.game === kind);
      setPrevious(play);
      setPhase(play ? "done-before" : "intro");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, kind, today]);

  // Timer del gioco: 45 secondi (120 per il quiz della domenica).
  useEffect(() => {
    if (phase !== "play") return;
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
  }, [phase]);

  if (!content) return null;
  const nextGame = todays[todays.indexOf(kind) + 1];

  const finish = (answers: Answer[], answerMs?: number) => {
    if (finished.current) return;
    finished.current = true;
    const durationMs = Date.now() - startedAt.current;
    const value = gameScore(kind, answers, answerMs ?? durationMs);
    const correct =
      kind === "metti-in-ordine"
        ? (answers[0]?.inPlace ?? 0)
        : answers.filter((answer) => answer.correct).length;
    const items =
      kind === "metti-in-ordine" && content.kind === "metti-in-ordine"
        ? (content.items[0]?.ordered.length ?? 4)
        : content.items.length;
    setScore(value);
    setPhase("saving");
    track("game_done", {
      game: kind,
      score: value,
      correct,
      items,
      seconds: Math.round(durationMs / 1000),
    });
    void recordPlay({
      game: kind,
      topic: content.topic,
      score: value,
      correct,
      items,
      durationMs,
    }).then(({ error }) => {
      setSaveError(error);
      setPhase("end");
    });
  };

  const props = { kind, timeUp: left === 0, onFinish: finish };
  const info = gameInfo[kind];

  return (
    <AppShell>
      <div className="page-content game-page">
        <div className="back-bar">
          <Button variant="facta" size="icon" asChild>
            <Link to="/gioca" aria-label="Torna a Gioca oggi">
              <ArrowLeft />
            </Link>
          </Button>
          <span>Gioca oggi</span>
          {phase === "play" && (
            <span
              className={`challenge-timer ml-auto ${left <= 10 ? "urgent" : ""}`}
              aria-live="off"
            >
              <Timer /> {left}s
            </span>
          )}
        </div>

        <span className="sticker small yellow">{info.family.toUpperCase()}</span>
        <h1 className="challenge-title">{info.title}</h1>

        {phase === "loading" && <p className="body-copy">Un attimo…</p>}

        {phase === "not-today" && (
          <>
            <p className="body-copy">
              Questo gioco non è in programma oggi: torna nel giorno giusto.
            </p>
            <Button variant="sticker" className="w-full mt-4" asChild>
              <Link to="/gioca">Vedi i giochi di oggi</Link>
            </Button>
          </>
        )}

        {phase === "done-before" && (
          <>
            <p className="body-copy">
              Hai già giocato oggi: <strong>{previous?.score ?? 0} punti</strong>. Un solo tentativo
              al giorno per gioco, così la classifica è giusta per tutti.
            </p>
            <Button variant="sticker" className="w-full mt-4" asChild>
              <Link to="/gioca">Torna a Gioca oggi</Link>
            </Button>
          </>
        )}

        {phase === "intro" && (
          <>
            <p className="body-copy">{info.blurb}</p>
            <ul className="game-rules">
              <li>
                <Timer /> {seconds} secondi in tutto
              </li>
              <li>Dopo ogni risposta: spiegazione breve e fonte</li>
              <li>Un solo tentativo oggi</li>
              {kind === "notizia" && <li>Più rispondi in fretta, più punti (fino a +30)</li>}
            </ul>
            <Button
              variant="sticker"
              className="w-full"
              onClick={() => {
                startedAt.current = Date.now();
                setPhase("play");
                track("game_start", { game: kind });
              }}
            >
              Inizia <ArrowRight />
            </Button>
          </>
        )}

        {phase === "play" && (
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
        )}

        {phase === "saving" && <p className="body-copy">Salvo il punteggio…</p>}

        {phase === "end" && (
          <>
            <div className="challenge-result">
              <Trophy className="mx-auto mb-2" />
              <motion.strong
                className="challenge-score"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
              >
                {score} punti
              </motion.strong>
              <p>
                {left === 0
                  ? "Tempo scaduto: contano le risposte date."
                  : `${left} secondi avanzati`}
              </p>
            </div>
            {saveError && <p className="game-error">{saveError}</p>}
            {nextGame ? (
              <Button variant="sticker" className="w-full" asChild>
                <Link to="/gioca/$game" params={{ game: nextGame }}>
                  Prossimo: {gameInfo[nextGame].title} <ArrowRight />
                </Link>
              </Button>
            ) : (
              <Button variant="sticker" className="w-full" asChild>
                <Link to="/gioca">Vedi il riepilogo di oggi</Link>
              </Button>
            )}
            <Button variant="facta" className="w-full mt-3" asChild>
              <Link to="/gioca">Torna a Gioca oggi</Link>
            </Button>
          </>
        )}
      </div>
    </AppShell>
  );
}
