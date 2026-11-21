import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { itemSeconds, newsScore } from "@/lib/games/scoring";
import type { Answer, ChoiceItem, GameKind } from "@/lib/games/types";
import { Explanation, GameImage, ItemDots, ItemTimer } from "./parts";

export type GameProps<T> = {
  kind: GameKind;
  items: T[];
  timeUp: boolean;
  onFinish: (answers: Answer[], answerMs?: number) => void;
};

/**
 * Giochi a scelta: Notizia del giorno, Cos'è più grande, Vero o falso, Chi l'ha detto,
 * Cosa significa, Titolo o clickbait, Prima o dopo, Collega i puntini, Quiz della settimana.
 */
export function ChoiceGame({ kind, items, timeUp, onFinish }: GameProps<ChoiceItem>) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const perItem = itemSeconds[kind];
  const [left, setLeft] = useState(perItem ?? 0);
  const startedAt = useRef(Date.now());
  const answerMs = useRef<number | undefined>(undefined);
  const item = items[index];
  const revealed = picked !== null;
  const timedOut = picked === -1;

  // Tempo scaduto per tutto il gioco: si chiude con le risposte date.
  useEffect(() => {
    if (timeUp) onFinish(answers, answerMs.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeUp]);

  // Timer per singola domanda (10 s / 8 s): allo scadere la risposta vale come sbagliata.
  useEffect(() => {
    if (!perItem || revealed) return;
    setLeft(perItem);
    const timer = setInterval(() => {
      setLeft((value) => {
        if (value <= 1) {
          clearInterval(timer);
          choose(-1);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, revealed]);

  if (!item) return null;

  function choose(option: number) {
    if (picked !== null || !item) return;
    if (kind === "notizia") answerMs.current = Date.now() - startedAt.current;
    setPicked(option);
    setAnswers((current) => [...current, { correct: option === item.answer }]);
  }

  const next = () => {
    if (index < items.length - 1) {
      setIndex(index + 1);
      setPicked(null);
    } else onFinish(answers, answerMs.current);
  };

  const correct = picked === item.answer;
  const points = kind === "notizia" ? newsScore(correct, answerMs.current ?? 0) : correct ? 100 : 0;
  const versus = kind === "piu-grande" || kind === "prima-dopo";
  const faces = kind === "chi-l-ha-detto";

  return (
    <>
      {items.length > 1 && (
        <ItemDots total={items.length} current={index} results={answers.map((a) => a.correct)} />
      )}
      {perItem && !revealed && <ItemTimer seconds={perItem} left={left} />}

      {kind === "notizia" && <p className="game-question">{item.prompt}</p>}
      {kind === "chi-l-ha-detto" && (
        <blockquote className="challenge-quote">{item.prompt}</blockquote>
      )}
      {kind === "cosa-significa" && (
        <p className="game-word">
          Cosa significa <strong>{item.prompt}?</strong>
        </p>
      )}
      {kind === "collega" && (
        <div className="game-cause">
          <span className="sticker small yellow">CAUSA</span>
          <strong>{item.prompt}</strong>
          <span className="game-cause-arrow">↓ quale effetto?</span>
        </div>
      )}
      {(kind === "vero-falso" || kind === "riepilogo") && (
        <p className="challenge-statement">{item.prompt}</p>
      )}
      {(kind === "piu-grande" || kind === "prima-dopo" || kind === "clickbait") && (
        <p className="game-question">{item.prompt}</p>
      )}

      <div
        className={`game-options ${versus ? "versus" : ""} ${faces ? "faces" : ""} kind-${kind}`}
      >
        {item.options.map((option, i) => {
          const state = revealed
            ? i === item.answer
              ? "right"
              : i === picked
                ? "wrong"
                : "dim"
            : "";
          const image = item.optionImages?.[i];
          return (
            <Button
              key={option}
              variant="facta"
              className={`game-option ${state}`}
              aria-pressed={picked === i}
              disabled={revealed}
              onClick={() => choose(i)}
            >
              {(versus || faces) && item.optionImages && (
                <GameImage image={image} className="option-image" />
              )}
              {!versus && !faces && (
                <span className="option-letter" aria-hidden>
                  {String.fromCharCode(65 + i)}
                </span>
              )}
              <span className="game-option-label">
                {revealed && i === item.answer && <Check />}
                {revealed && i === picked && i !== item.answer && <X />}
                {option}
              </span>
            </Button>
          );
        })}
        {versus && <span className="versus-badge">VS</span>}
      </div>

      {revealed && (
        <Explanation
          ok={correct}
          title={timedOut ? "Tempo scaduto" : undefined}
          text={item.explanation}
          source={item.source}
          points={points}
          extra={
            kind === "notizia" && item.image ? (
              <GameImage image={item.image} className="explain-image" />
            ) : undefined
          }
          onNext={next}
          nextLabel={index < items.length - 1 ? "Avanti" : "Vedi il punteggio"}
        />
      )}
    </>
  );
}
