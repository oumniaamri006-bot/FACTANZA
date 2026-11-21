import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Share2, Timer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, pageHead } from "@/components/factanza/shared";
import { useFactanza } from "@/components/factanza/context";
import { MatchGame, PriceGame, SwipeGame } from "@/components/factanza/challenge-rounds";
import {
  challengeFor,
  challengeScore,
  challengeSeconds,
  kindLabel,
  shareText,
} from "@/data/challenges";
import { demoToday } from "@/data/agenda";
import { longDate } from "@/lib/dates";

type Search = { da?: string; punti?: number };

export const Route = createFileRoute("/sfida")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const points = Number(search["punti"]);
    return {
      ...(typeof search["da"] === "string" && { da: search["da"].slice(0, 30) }),
      ...(search["punti"] !== undefined && !Number.isNaN(points) && { punti: Math.round(points) }),
    };
  },
  head: () =>
    pageHead(
      "FactaChallenge — La sfida del giorno",
      "60 secondi, tre prove sul mondo reale: indovina il prezzo, chi l’ha detto, vero o falso.",
    ),
  component: Challenge,
});

type Phase = "intro" | "play" | "end";

function Challenge() {
  const { da, punti } = Route.useSearch();
  const { session, user, track } = useFactanza();
  const challenge = challengeFor(demoToday);
  const rounds = challenge?.rounds ?? [];
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(challengeSeconds);
  const [copied, setCopied] = useState(false);
  const startedAt = useRef(0);

  const round = rounds[index];
  const allScores = rounds.map((_, i) => scores[i] ?? 0);
  const score = challengeScore(allScores, secondsLeft);
  const last = index === rounds.length - 1;

  // Timer unico da 60 secondi per tutta la sfida.
  useEffect(() => {
    if (phase !== "play") return;
    const timer = setInterval(() => {
      setSecondsLeft((left) => {
        if (left <= 1) {
          clearInterval(timer);
          setPhase("end");
          return 0;
        }
        return left - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "end" || !challenge) return;
    track("challenge_done", {
      day: challenge.date,
      round_scores: allScores.join("-"),
      score,
      seconds: Math.round((Date.now() - startedAt.current) / 1000),
      ...(da && { from_friend: true }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (!challenge || !round) return null;

  const finishRound = (value: number) => {
    const next = [...scores];
    next[index] = value;
    setScores(next);
    track("challenge_answer", { day: challenge.date, kind: round.kind, score: value });
    if (last) setPhase("end");
    else setIndex(index + 1);
  };

  const share = async () => {
    const name = session ? user.name : "";
    const params = new URLSearchParams({ punti: String(score), ...(name && { da: name }) });
    const url = `${window.location.origin}/sfida?${params.toString()}`;
    const text = shareText(challenge.date, allScores, score, url);
    track("challenge_share", { day: challenge.date, score });
    try {
      if (navigator.share) {
        await navigator.share({ title: "FactaChallenge", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // condivisione annullata
    }
  };

  const verdict =
    score >= 250 ? "Fact-checker natə." : score >= 150 ? "Sul pezzo!" : "Domani ti rifai.";

  return (
    <div className="phone challenge">
      <header className="app-header">
        <Link to="/" aria-label="Factanza, home">
          <Logo />
        </Link>
        {phase === "play" && (
          <span
            className={`challenge-timer ${secondsLeft <= 10 ? "urgent" : ""}`}
            aria-live="polite"
          >
            <Timer /> {secondsLeft}s
          </span>
        )}
      </header>

      <div className="page-content">
        {phase === "intro" && (
          <>
            <span className="sticker yellow">FACTACHALLENGE</span>
            <h1 className="challenge-title">
              60 secondi.
              <br />3 prove sul mondo reale.
            </h1>
            <p className="body-copy">
              La sfida di {longDate(challenge.date)}. Ogni risposta ti spiega qualcosa.
            </p>
            {da && punti !== undefined && (
              <div className="challenge-invite">
                <Zap />
                <span>
                  <strong>{da}</strong> ha fatto <strong>{punti} punti</strong>. Riesci a batterlə?
                </span>
              </div>
            )}
            <ol className="challenge-steps">
              <li>
                <span className="sticker small yellow">1</span> Indovina il prezzo col cursore
              </li>
              <li>
                <span className="sticker small lilac">2</span> Abbina le frasi ai volti
              </li>
              <li>
                <span className="sticker small">3</span> Swipe: vero o falso?
              </li>
            </ol>
            <Button
              variant="sticker"
              className="w-full"
              onClick={() => {
                startedAt.current = Date.now();
                setPhase("play");
                track("challenge_start", { day: challenge.date, ...(da && { from_friend: true }) });
              }}
            >
              Inizia la sfida <ArrowRight />
            </Button>
            <p className="hand text-center mt-4">(non serve l’account per giocare)</p>
          </>
        )}

        {phase === "play" && (
          <>
            <div className="challenge-progress">
              {rounds.map((r, i) => (
                <span key={r.kind} className={i < index ? "done" : i === index ? "current" : ""} />
              ))}
            </div>
            <span className="sticker small yellow">
              {index + 1}/3 · {kindLabel[round.kind]}
            </span>
            <h2 className="challenge-prompt">{round.prompt}</h2>
            {round.kind === "prezzo" && (
              <PriceGame key={index} round={round} onDone={finishRound} last={last} />
            )}
            {round.kind === "citazione" && (
              <MatchGame key={index} round={round} onDone={finishRound} last={last} />
            )}
            {round.kind === "verofalso" && (
              <SwipeGame key={index} round={round} onDone={finishRound} last={last} />
            )}
          </>
        )}

        {phase === "end" && (
          <>
            <span className="sticker yellow">IL TUO RISULTATO</span>
            <div className="challenge-result">
              <div className="challenge-confetti" aria-hidden>
                {Array.from({ length: 14 }, (_, i) => (
                  <motion.i
                    key={i}
                    style={{ left: `${(i * 37) % 100}%` }}
                    initial={{ y: -20, opacity: 0, rotate: 0 }}
                    animate={{ y: 220, opacity: [0, 1, 1, 0], rotate: 360 }}
                    transition={{ duration: 1.6, delay: (i % 5) * 0.12 }}
                  />
                ))}
              </div>
              <div className="challenge-squares" aria-label="Punti per prova">
                {allScores.map((value, i) => (
                  <motion.span
                    key={i}
                    className={value >= 70 ? "ok" : value >= 40 ? "mid" : "ko"}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15 * i, type: "spring" }}
                  >
                    {value}
                  </motion.span>
                ))}
              </div>
              <motion.strong
                className="challenge-score"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                {score} punti
              </motion.strong>
              <p>
                {verdict} · {secondsLeft}s avanzati
              </p>
              {da && punti !== undefined && (
                <p className="hand">
                  {score > punti
                    ? `(hai battuto ${da}!)`
                    : score === punti
                      ? `(pareggio con ${da})`
                      : `(${da} ti ha battutə: rivincita domani)`}
                </p>
              )}
            </div>
            <Button variant="sticker" className="w-full" onClick={() => void share()}>
              <Share2 /> {copied ? "Copiato! Incollalo a chi vuoi" : "Condividi e sfida un amico"}
            </Button>
            {session ? (
              <Button variant="facta" className="w-full mt-4" asChild>
                <Link to="/">
                  <ArrowLeft /> Torna alle notizie
                </Link>
              </Button>
            ) : (
              <div className="challenge-join">
                <p>
                  Ti è piaciuta? Ogni giorno una sfida nuova, notizie spiegate bene e la tua voce
                  nei sondaggi.
                </p>
                <Button variant="facta" className="w-full" asChild>
                  <Link to="/">Entra in Factanza</Link>
                </Button>
              </div>
            )}
            <p className="hand text-center mt-4">(domani una sfida nuova)</p>
          </>
        )}
        {rounds.some((r) => r.unverified) && (
          <p className="demo-label">Alcuni dati sono in attesa di verifica della redazione.</p>
        )}
      </div>
    </div>
  );
}
