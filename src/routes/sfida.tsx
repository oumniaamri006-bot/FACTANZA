import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Share2, Timer, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, pageHead } from "@/components/factanza/shared";
import { useFactanza } from "@/components/factanza/context";
import {
  challengeFor,
  challengeScore,
  challengeSeconds,
  kindLabel,
  shareText,
  type ChallengeQuestion,
} from "@/data/challenges";
import { demoToday } from "@/data/agenda";
import { longDate } from "@/lib/dates";

type Search = { da?: string; punti?: number };

export const Route = createFileRoute("/sfida")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    ...(typeof search["da"] === "string" && { da: search["da"].slice(0, 30) }),
    ...(typeof search["punti"] === "number" && { punti: Math.round(search["punti"]) }),
    ...(typeof search["punti"] === "string" &&
      !Number.isNaN(Number(search["punti"])) && { punti: Math.round(Number(search["punti"])) }),
  }),
  head: () =>
    pageHead(
      "FactaChallenge — La sfida del giorno",
      "60 secondi, tre prove sul mondo reale: indovina il prezzo, chi l’ha detto, vero o falso.",
    ),
  component: Challenge,
});

type Phase = "intro" | "play" | "end";

function isCorrect(question: ChallengeQuestion, answer: number | boolean) {
  return question.kind === "verofalso" ? answer === question.answer : answer === question.answer;
}

function Challenge() {
  const { da, punti } = Route.useSearch();
  const { session, user, track } = useFactanza();
  const challenge = challengeFor(demoToday);
  const questions = challenge?.questions ?? [];
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | boolean | null)[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(challengeSeconds);
  const [copied, setCopied] = useState(false);
  const startedAt = useRef(0);

  const question = questions[index];
  const current = answers[index];
  const revealed = current !== undefined && current !== null;
  const correct = questions.map((q, i) => {
    const answer = answers[i];
    return answer !== undefined && answer !== null && isCorrect(q, answer);
  });
  const score = challengeScore(correct, secondsLeft);

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
      right: correct.filter(Boolean).length,
      score,
      seconds: Math.round((Date.now() - startedAt.current) / 1000),
      ...(da && { from_friend: true }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (!challenge || !question) return null;

  const answer = (value: number | boolean) => {
    if (revealed) return;
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
    track("challenge_answer", {
      day: challenge.date,
      kind: question.kind,
      correct: isCorrect(question, value),
    });
  };
  const nextQuestion = () => {
    if (index < questions.length - 1) setIndex(index + 1);
    else setPhase("end");
  };

  const share = async () => {
    const name = session ? user.name : "";
    const params = new URLSearchParams({ punti: String(score), ...(name && { da: name }) });
    const url = `${window.location.origin}/sfida?${params.toString()}`;
    const text = shareText(challenge.date, correct, score, url);
    track("challenge_share", { day: challenge.date, score });
    try {
      if (navigator.share) {
        await navigator.share({ title: "FactaChallenge", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // condivisione annullata dall'utente
    }
  };

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
                <span className="sticker small yellow">1</span> Indovina il prezzo
              </li>
              <li>
                <span className="sticker small lilac">2</span> Chi l’ha detto?
              </li>
              <li>
                <span className="sticker small">3</span> Vero o falso?
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
              {questions.map((q, i) => (
                <span key={q.kind} className={i < index ? "done" : i === index ? "current" : ""} />
              ))}
            </div>
            <span className="sticker small yellow">{kindLabel[question.kind]}</span>
            <h2 className="challenge-prompt">{question.prompt}</h2>
            {question.kind === "citazione" && (
              <blockquote className="challenge-quote">{question.quote}</blockquote>
            )}
            {question.kind === "verofalso" && (
              <p className="challenge-statement">{question.statement}</p>
            )}

            <div className={`challenge-options ${question.kind === "verofalso" ? "two" : ""}`}>
              {(question.kind === "verofalso" ? ["Vero", "Falso"] : question.options).map(
                (label, i) => {
                  const value = question.kind === "verofalso" ? i === 0 : i;
                  const right =
                    question.kind === "verofalso"
                      ? value === question.answer
                      : i === question.answer;
                  const chosen = current === value;
                  return (
                    <Button
                      key={label}
                      variant="facta"
                      className={revealed ? (right ? "right" : chosen ? "wrong" : "dim") : ""}
                      aria-pressed={chosen}
                      disabled={revealed}
                      onClick={() => answer(value)}
                    >
                      {revealed && right && <Check />}
                      {revealed && chosen && !right && <X />}
                      {label}
                    </Button>
                  );
                },
              )}
            </div>

            {revealed && (
              <div className={`challenge-explain ${correct[index] ? "ok" : "ko"}`} role="status">
                <strong>{correct[index] ? "Giusto!" : "Non proprio."}</strong>
                <p>{question.explanation}</p>
                <span className="challenge-source">
                  {question.unverified ? "⚠ " : "Fonte: "}
                  {question.source}
                </span>
                <Button variant="sticker" className="w-full mt-3" onClick={nextQuestion}>
                  {index < questions.length - 1 ? "Prossima prova" : "Vedi il risultato"}
                  <ArrowRight />
                </Button>
              </div>
            )}
          </>
        )}

        {phase === "end" && (
          <>
            <span className="sticker yellow">IL TUO RISULTATO</span>
            <div className="challenge-result">
              <div
                className="challenge-squares"
                aria-label={`${correct.filter(Boolean).length} risposte giuste su 3`}
              >
                {correct.map((ok, i) => (
                  <span key={i} className={ok ? "ok" : "ko"}>
                    {ok ? <Check /> : <X />}
                  </span>
                ))}
              </div>
              <strong className="challenge-score">{score} punti</strong>
              <p>
                {correct.filter(Boolean).length}/3 giuste · {secondsLeft}s avanzati
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
        {questions.some((q) => q.unverified) && (
          <p className="demo-label">Alcuni dati sono in attesa di verifica della redazione.</p>
        )}
      </div>
    </div>
  );
}
