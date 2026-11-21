import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, pageHead } from "@/components/factanza/shared";
import { useFactanza } from "@/components/factanza/context";
import { ChoiceGame } from "@/components/games/choice-game";
import { Confetti, CountUp, StreakFlame, TimerRing } from "@/components/games/look";
import { lookOf } from "@/components/games/tones";
import { CluesGame, MapGame, OrderGame, SliderGame } from "@/components/games/other-games";
import { contentFor } from "@/data/games/content";
import { fetchWeekPlays, recordPlay } from "@/lib/games/api";
import { addDays, gameInfo, gamesForDay, todayInRome } from "@/lib/games/schedule";
import { dayCompleteBonus, gameScore, gameSeconds, streakBonus } from "@/lib/games/scoring";
import { currentStreak, nextMilestone, type Streak } from "@/lib/games/streak";
import type { Answer, GameKind } from "@/lib/games/types";

export const Route = createFileRoute("/gioca/sessione")({
  head: () =>
    pageHead(
      "Il quiz di oggi",
      "Un gioco per ogni categoria, uno dopo l’altro: una domanda ciascuno.",
    ),
  component: Session,
});

type Result = { kind: GameKind; score: number; error: string | null };

/**
 * Il quiz del giorno: i giochi (uno per categoria) si scoprono uno alla volta con una carta che
 * si gira, si giocano di fila e alla fine si festeggia la serie di giorni.
 */
function Session() {
  const { session } = useFactanza();
  const today = todayInRome();
  const games = gamesForDay(today);
  const [queue, setQueue] = useState<GameKind[] | null>(null);
  const [streakBefore, setStreakBefore] = useState<Streak | null>(null);
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [donePoints, setDonePoints] = useState(0);

  useEffect(() => {
    if (!session) return;
    void fetchWeekPlays(addDays(today, -60)).then((plays) => {
      const todays = plays.filter((p) => p.day === today);
      setQueue(games.filter((game) => !todays.some((p) => p.game === game)));
      setDonePoints(todays.reduce((sum, p) => sum + p.score, 0));
      setStreakBefore(
        currentStreak(
          plays.map((p) => p.day),
          today,
        ),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, today]);

  const kind = queue?.[round];
  const done = games.length - (queue?.length ?? 0) + results.length;
  const last = results.at(-1);
  const showBreak = last && results.length === round + 1;
  const finished = queue !== null && queue.length > 0 && done === games.length && showBreak;

  return (
    <AppShell>
      <div className="page-content game-page">
        <div className="quiz-top">
          <Button variant="facta" size="icon" asChild>
            <Link to="/gioca" aria-label="Esci dal quiz">
              <X />
            </Link>
          </Button>
          <div
            className="quiz-steps"
            aria-label={`Gioco ${Math.min(done + 1, games.length)} di ${games.length}`}
          >
            {games.map((game, i) => (
              <span
                key={game}
                className={`tone-${lookOf(gameInfo[game].family).tone} ${i < done ? "done" : i === done ? "current" : ""}`}
              />
            ))}
          </div>
          {streakBefore && (
            <StreakFlame count={streakBefore.count} lit={streakBefore.playedToday} size="sm" />
          )}
        </div>

        {queue === null && <p className="body-copy mt-4">Un attimo…</p>}

        {queue && queue.length === 0 && (
          <div className="quiz-break tone-navy">
            <Trophy className="quiz-break-icon" />
            <p>Hai già fatto il quiz di oggi. Torna domani per allungare la serie!</p>
            <Button variant="sticker" className="w-full" asChild>
              <Link to="/gioca">Vedi i risultati</Link>
            </Button>
          </div>
        )}

        {finished && streakBefore ? (
          <Finale
            points={donePoints + results.reduce((sum, r) => sum + r.score, 0)}
            streak={streakBefore.playedToday ? streakBefore.count : streakBefore.count + 1}
            grew={!streakBefore.playedToday}
            errors={results.filter((r) => r.error).map((r) => r.error as string)}
          />
        ) : showBreak ? (
          <Break result={last} onNext={() => setRound(round + 1)} />
        ) : (
          kind && (
            <Round
              key={kind}
              kind={kind}
              index={done}
              total={games.length}
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

/** Tra un gioco e l'altro: i punti appena presi, nel colore del gioco. */
function Break({ result, onNext }: { result: Result; onNext: () => void }) {
  const info = gameInfo[result.kind];
  const look = lookOf(info.family);
  return (
    <motion.div
      className={`quiz-break tone-${look.tone}`}
      initial={{ scale: 0.85, opacity: 0, rotate: -2 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      {result.score >= 60 && <Confetti />}
      <look.icon className="quiz-break-icon" />
      <span className="quiz-break-label">{info.title}</span>
      <strong className="quiz-break-points">
        +<CountUp value={result.score} />
      </strong>
      <span className="hand">
        {result.score >= 100 ? "(perfetto!)" : result.score >= 60 ? "(bravə!)" : "(alla prossima!)"}
      </span>
      {result.error && <p className="game-error">{result.error}</p>}
      <Button variant="sticker" size="lg" className="w-full quiz-cta" onClick={onNext}>
        Prossimo gioco <ArrowRight />
      </Button>
    </motion.div>
  );
}

/** Fine del quiz: punti del giorno e la fiamma della serie che cresce. */
function Finale({
  points,
  streak,
  grew,
  errors,
}: {
  points: number;
  streak: number;
  grew: boolean;
  errors: string[];
}) {
  const [shown, setShown] = useState(grew ? streak - 1 : streak);
  useEffect(() => {
    if (!grew) return;
    const timer = setTimeout(() => setShown(streak), 900);
    return () => clearTimeout(timer);
  }, [grew, streak]);
  const next = nextMilestone(streak);
  const previous = [0, 3, 5, 7].filter((m) => m <= streak).at(-1) ?? 0;
  return (
    <div className="quiz-finale">
      <Confetti pieces={28} />
      <span className="sticker yellow">QUIZ COMPLETATO</span>
      <strong className="quiz-finale-points">
        <CountUp value={points + dayCompleteBonus} duration={1100} />
        <small> punti oggi</small>
      </strong>
      <span className="hand">(compresi +{dayCompleteBonus} di giornata completa)</span>

      <div className="quiz-finale-streak">
        <StreakFlame count={shown} lit />
        <div>
          <strong>
            {streak} {streak === 1 ? "giorno" : "giorni"} di fila!
          </strong>
          <p>
            {grew ? "La tua serie è cresciuta. " : ""}
            {next
              ? `A ${next} giorni: +${streakBonus(next)} punti in classifica.`
              : "Bonus massimo della settimana: +200!"}
          </p>
          {next && (
            <div className="streak-bar" aria-hidden>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: `${((streak - previous) / (next - previous)) * 100}%` }}
                transition={{ delay: 1, duration: 0.6 }}
              />
            </div>
          )}
        </div>
      </div>
      {errors.map((error) => (
        <p key={error} className="game-error">
          {error}
        </p>
      ))}
      <Button variant="sticker" size="lg" className="w-full quiz-cta" asChild>
        <Link to="/gioca">
          Vedi i risultati <ArrowRight />
        </Link>
      </Button>
      <Button variant="facta" className="w-full mt-3" asChild>
        <Link to="/classifica">
          <Trophy /> Classifica
        </Link>
      </Button>
    </div>
  );
}

/** Un gioco: prima la carta che si gira (svela il gioco), poi la domanda con il timer. */
function Round({
  kind,
  index,
  total,
  onDone,
}: {
  kind: GameKind;
  index: number;
  total: number;
  onDone: (score: number, error: string | null) => void;
}) {
  const { track } = useFactanza();
  const content = contentFor(kind, todayInRome());
  const seconds = gameSeconds(kind);
  const [started, setStarted] = useState(false);
  const [left, setLeft] = useState(seconds);
  const [saving, setSaving] = useState(false);
  const startedAt = useRef(0);
  const finished = useRef(false);
  const info = gameInfo[kind];
  const look = lookOf(info.family);

  useEffect(() => {
    if (!started) return;
    startedAt.current = Date.now();
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
  }, [started]);

  if (!content) return null;

  if (!started)
    return (
      <motion.button
        type="button"
        className={`quiz-reveal tone-${look.tone}`}
        initial={{ rotateY: 180, scale: 0.8, opacity: 0 }}
        animate={{ rotateY: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 16 }}
        onClick={() => setStarted(true)}
      >
        <span className="quiz-reveal-count">
          Gioco {index + 1} di {total}
        </span>
        <span className="quiz-reveal-icon">
          <look.icon />
        </span>
        <span className="sticker small">{info.family.toUpperCase()}</span>
        <strong>{info.title}</strong>
        <span className="quiz-reveal-blurb">{info.blurb}</span>
        <span className="quiz-reveal-go">
          Tocca per iniziare <ArrowRight />
        </span>
      </motion.button>
    );

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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className={`quiz-head tone-${look.tone}`}>
        <span className="quiz-head-icon">
          <look.icon />
        </span>
        <div className="quiz-head-text">
          <span className="quiz-head-family">{info.family}</span>
          <h1>{info.title}</h1>
        </div>
        <TimerRing left={left} total={seconds} />
      </div>
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
    </motion.div>
  );
}
