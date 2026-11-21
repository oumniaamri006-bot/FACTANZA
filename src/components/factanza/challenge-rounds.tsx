import { useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Check, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { priceScore, type MatchRound, type PriceRound, type SwipeRound } from "@/data/challenges";

type RoundProps<T> = { round: T; onDone: (score: number) => void };

function Explain({
  ok,
  title,
  text,
  source,
  unverified,
  onNext,
  last,
}: {
  ok: boolean;
  title: string;
  text: string;
  source: string;
  unverified?: boolean | undefined;
  onNext: () => void;
  last: boolean;
}) {
  return (
    <motion.div
      className={`challenge-explain ${ok ? "ok" : "ko"}`}
      role="status"
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <strong>{title}</strong>
      <p>{text}</p>
      <span className="challenge-source">
        {unverified ? "⚠ " : "Fonte: "}
        {source}
      </span>
      <Button variant="sticker" className="w-full mt-3" onClick={onNext}>
        {last ? "Vedi il risultato" : "Prossima prova"}
        <ArrowRight />
      </Button>
    </motion.div>
  );
}

/** Indovina il prezzo: cursore libero, punti in base a quanto ti avvicini. */
export function PriceGame({ round, onDone, last }: RoundProps<PriceRound> & { last: boolean }) {
  const middle = Math.round((round.min + round.max) / 2 / round.step) * round.step;
  const [guess, setGuess] = useState(middle);
  const [locked, setLocked] = useState(false);
  const score = priceScore(round, guess);
  const pos = (value: number) => `${((value - round.min) / (round.max - round.min)) * 100}%`;
  const diff = Math.abs(guess - round.answer);
  return (
    <>
      <div className="price-display" aria-live="polite">
        <strong>
          {guess.toLocaleString("it-IT")} {round.unit}
        </strong>
        <span>al mese</span>
      </div>
      <div className="price-track">
        <input
          id="price-guess"
          type="range"
          min={round.min}
          max={round.max}
          step={round.step}
          value={guess}
          disabled={locked}
          onChange={(event) => setGuess(Number(event.target.value))}
          aria-label="Il tuo prezzo"
        />
        {locked && (
          <>
            <motion.span
              className="price-answer"
              style={{ left: pos(round.answer) }}
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
            >
              {round.answer} {round.unit}
            </motion.span>
            <span
              className="price-gap"
              style={{
                left: pos(Math.min(guess, round.answer)),
                width: `calc(${pos(Math.max(guess, round.answer))} - ${pos(Math.min(guess, round.answer))})`,
              }}
            />
          </>
        )}
        <div className="price-scale">
          <span>
            {round.min} {round.unit}
          </span>
          <span>
            {round.max} {round.unit}
          </span>
        </div>
      </div>
      {!locked ? (
        <Button variant="sticker" className="w-full" onClick={() => setLocked(true)}>
          È questo il prezzo! <Check />
        </Button>
      ) : (
        <Explain
          ok={score >= 70}
          title={
            diff === 0
              ? "Esatto, al centesimo! +100"
              : `Ci sei andatə a ${diff} ${round.unit}: +${score}`
          }
          text={round.explanation}
          source={round.source}
          unverified={round.unverified}
          onNext={() => onDone(score)}
          last={last}
        />
      )}
    </>
  );
}

/** Chi l'ha detto: abbina ogni frase al volto giusto. */
export function MatchGame({ round, onDone, last }: RoundProps<MatchRound> & { last: boolean }) {
  // Volti in ordine diverso dalle frasi, stabile per la sfida.
  const faces = useMemo(
    () => [...round.pairs].sort((a, b) => a.person.localeCompare(b.person)),
    [round.pairs],
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, string>>({});
  const done = Object.keys(matches).length === round.pairs.length;
  const right = round.pairs.filter((pair, i) => matches[i] === pair.person).length;
  const score = Math.round((100 * right) / round.pairs.length);
  const used = new Set(Object.values(matches));

  return (
    <>
      <div className="match-quotes">
        {round.pairs.map((pair, i) => {
          const matched = matches[i];
          const state = done ? (matched === pair.person ? "right" : "wrong") : "";
          return (
            <button
              type="button"
              key={pair.quote}
              className={`match-quote ${selected === i ? "selected" : ""} ${matched ? "matched" : ""} ${state}`}
              aria-pressed={selected === i}
              disabled={done || Boolean(matched)}
              onClick={() => setSelected(i)}
            >
              <span>{pair.quote}</span>
              {matched && <em>→ {matched}</em>}
              {done && matched !== pair.person && <em className="fix">Era {pair.person}</em>}
            </button>
          );
        })}
      </div>
      <p className="match-hint">
        {done
          ? `${right} abbinamenti giusti su ${round.pairs.length}`
          : selected === null
            ? "Scegli una frase…"
            : "…ora tocca chi l’ha detta"}
      </p>
      <div className="match-faces">
        {faces.map((face) => (
          <button
            type="button"
            key={face.person}
            className={`match-face ${used.has(face.person) ? "used" : ""}`}
            disabled={done || selected === null || used.has(face.person)}
            onClick={() => {
              if (selected === null) return;
              setMatches((current) => ({ ...current, [selected]: face.person }));
              setSelected(null);
            }}
          >
            <img src={face.image} alt="" />
            <span>{face.person}</span>
          </button>
        ))}
      </div>
      {done && (
        <Explain
          ok={score >= 70}
          title={right === round.pairs.length ? "Tutte giuste! +100" : `+${score}`}
          text={round.explanation}
          source={round.source}
          unverified={round.unverified}
          onNext={() => onDone(score)}
          last={last}
        />
      )}
    </>
  );
}

function SwipeCard({
  statement,
  onAnswer,
}: {
  statement: string;
  onAnswer: (value: boolean) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-14, 0, 14]);
  const yes = useTransform(x, [20, 100], [0, 1]);
  const no = useTransform(x, [-100, -20], [1, 0]);
  return (
    <motion.div
      className="tf-card"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (info.offset.x > 90) onAnswer(true);
        else if (info.offset.x < -90) onAnswer(false);
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <p>{statement}</p>
      <motion.span className="tf-stamp yes" style={{ opacity: yes }}>
        VERO
      </motion.span>
      <motion.span className="tf-stamp no" style={{ opacity: no }}>
        FALSO
      </motion.span>
    </motion.div>
  );
}

/** Vero o falso: carte da swipe a raffica, ognuna si gira per spiegare. */
export function SwipeGame({ round, onDone, last }: RoundProps<SwipeRound> & { last: boolean }) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [reveal, setReveal] = useState<boolean | null>(null);
  const card = round.cards[index];
  const done = results.length === round.cards.length && reveal === null;
  const right = results.filter(Boolean).length;
  const score = Math.round((100 * right) / round.cards.length);

  const answer = (value: boolean) => {
    if (!card || reveal !== null) return;
    const ok = value === card.answer;
    setResults((current) => [...current, ok]);
    setReveal(ok);
  };

  return (
    <>
      <div className="tf-dots">
        {round.cards.map((item, i) => (
          <span
            key={item.statement}
            className={
              i < results.length ? (results[i] ? "ok" : "ko") : i === index ? "current" : ""
            }
          />
        ))}
      </div>
      {!done && card && (
        <div className="tf-stage">
          <AnimatePresence mode="wait">
            {reveal === null ? (
              <SwipeCard key={card.statement} statement={card.statement} onAnswer={answer} />
            ) : (
              <motion.div
                key={`${card.statement}-back`}
                className={`tf-card back ${reveal ? "ok" : "ko"}`}
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.25 }}
              >
                <strong>{reveal ? "Giusto!" : "Sbagliato!"}</strong>
                <p>{card.explanation}</p>
                <span className="challenge-source">Fonte: {card.source}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      {!done &&
        (reveal === null ? (
          <div className="tf-buttons">
            <Button variant="facta" className="tf-no" onClick={() => answer(false)}>
              <ThumbsDown /> Falso
            </Button>
            <Button variant="facta" className="tf-yes" onClick={() => answer(true)}>
              <ThumbsUp /> Vero
            </Button>
          </div>
        ) : (
          <Button
            variant="sticker"
            className="w-full"
            onClick={() => {
              setReveal(null);
              setIndex(index + 1);
            }}
          >
            {index < round.cards.length - 1 ? "Prossima carta" : "Fatto"} <ArrowRight />
          </Button>
        ))}
      {done && (
        <motion.div
          className={`challenge-explain ${score >= 70 ? "ok" : "ko"}`}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <strong>
            {right}/{round.cards.length} giuste: +{score}
          </strong>
          <div className="tf-summary">
            {round.cards.map((item, i) => (
              <span key={item.statement}>
                {results[i] ? <Check /> : <X />} {item.answer ? "Vero" : "Falso"}: {item.statement}
              </span>
            ))}
          </div>
          <Button variant="sticker" className="w-full mt-3" onClick={() => onDone(score)}>
            {last ? "Vedi il risultato" : "Prossima prova"} <ArrowRight />
          </Button>
        </motion.div>
      )}
    </>
  );
}
