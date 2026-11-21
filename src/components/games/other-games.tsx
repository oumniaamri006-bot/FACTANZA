import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cluePoints, distanceKm, mapPoints, sliderPoints } from "@/lib/games/scoring";
import type { Answer, CluesItem, MapItem, OrderItem, SliderItem } from "@/lib/games/types";
import type { GameProps } from "./choice-game";
import { Explanation, GameImage, ItemDots } from "./parts";

function useFinishOnTimeUp(
  timeUp: boolean,
  answers: Answer[],
  onFinish: (answers: Answer[]) => void,
) {
  useEffect(() => {
    if (timeUp) onFinish(answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeUp]);
}

const fmt = (value: number) => value.toLocaleString("it-IT");

// ------------------------------------------------------------------ Indovina la cifra
export function SliderGame({ items, timeUp, onFinish }: GameProps<SliderItem>) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const item = items[index];
  const middle = item ? Math.round((item.min + item.max) / 2 / item.step) * item.step : 0;
  const [guess, setGuess] = useState(middle);
  const [locked, setLocked] = useState(false);
  useFinishOnTimeUp(timeUp, answers, onFinish);
  if (!item) return null;
  const pos = (value: number) => `${((value - item.min) / (item.max - item.min)) * 100}%`;
  const points = sliderPoints(guess, item.answer);
  const error = Math.abs(guess - item.answer) / item.answer;

  return (
    <>
      <ItemDots
        total={items.length}
        current={index}
        results={answers.map((a) => (a.error ?? 1) <= 0.2)}
      />
      <p className="game-question">{item.prompt}</p>
      {item.image && <GameImage image={item.image} className="question-image" />}
      <div className="price-display" aria-live="polite">
        <strong>
          {fmt(guess)} {item.unit}
        </strong>
      </div>
      <div className="price-track">
        <input
          id={`slider-${index}`}
          type="range"
          min={item.min}
          max={item.max}
          step={item.step}
          value={guess}
          disabled={locked}
          onChange={(event) => setGuess(Number(event.target.value))}
          aria-label="La tua risposta"
        />
        {locked && (
          <>
            <span className="price-answer" style={{ left: pos(item.answer) }}>
              {fmt(item.answer)} {item.unit}
            </span>
            <span
              className="price-gap"
              style={{
                left: pos(Math.min(guess, item.answer)),
                width: `calc(${pos(Math.max(guess, item.answer))} - ${pos(Math.min(guess, item.answer))})`,
              }}
            />
          </>
        )}
        <div className="price-scale">
          <span>{fmt(item.min)}</span>
          <span>{fmt(item.max)}</span>
        </div>
      </div>
      {!locked ? (
        <Button
          variant="sticker"
          className="w-full"
          onClick={() => {
            setLocked(true);
            setAnswers((current) => [...current, { correct: points > 0, error }]);
          }}
        >
          Conferma <Check />
        </Button>
      ) : (
        <Explanation
          ok={points >= 15}
          title={`Errore del ${Math.round(error * 100)}%`}
          points={points}
          text={item.explanation}
          source={item.source}
          nextLabel={index < items.length - 1 ? "Avanti" : "Vedi il punteggio"}
          onNext={() => {
            if (index < items.length - 1) {
              const nextItem = items[index + 1];
              setIndex(index + 1);
              setLocked(false);
              if (nextItem)
                setGuess(
                  Math.round((nextItem.min + nextItem.max) / 2 / nextItem.step) * nextItem.step,
                );
            } else onFinish(answers);
          }}
        />
      )}
    </>
  );
}

// ------------------------------------------------------------------ Chi è chi
export function CluesGame({ items, timeUp, onFinish }: GameProps<CluesItem>) {
  const item = items[0];
  const [clue, setClue] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  const [result, setResult] = useState<Answer | null>(null);
  useFinishOnTimeUp(timeUp, result ? [result] : [], onFinish);
  if (!item) return null;

  const guess = (option: number) => {
    if (result) return;
    if (option === item.answer) {
      setResult({ correct: true, clue });
      return;
    }
    setWrong((current) => [...current, option]);
    if (clue < item.clues.length - 1) setClue(clue + 1);
    else setResult({ correct: false, clue });
  };

  return (
    <>
      <p className="game-question">Chi è? Meno indizi usi, più punti prendi.</p>
      <ol className="clues">
        {item.clues.slice(0, clue + 1).map((text, i) => (
          <li key={text} className={i === clue && !result ? "new" : ""}>
            <span className="clue-points">{cluePoints(i)}</span>
            {text}
          </li>
        ))}
      </ol>
      {!result && (
        <Button
          variant="facta"
          className="w-full mb-3"
          disabled={clue >= item.clues.length - 1}
          onClick={() => setClue(clue + 1)}
        >
          Un altro indizio (vale {cluePoints(clue + 1)})
        </Button>
      )}
      <div className="game-options">
        {item.options.map((option, i) => {
          const state = result
            ? i === item.answer
              ? "right"
              : wrong.includes(i)
                ? "wrong"
                : "dim"
            : wrong.includes(i)
              ? "wrong"
              : "";
          return (
            <Button
              key={option}
              variant="facta"
              className={`game-option ${state}`}
              disabled={Boolean(result) || wrong.includes(i)}
              onClick={() => guess(i)}
            >
              {option}
            </Button>
          );
        })}
      </div>
      {result && (
        <Explanation
          ok={result.correct}
          title={result.correct ? `Indovinato all’indizio ${clue + 1}` : "Indizi finiti"}
          points={result.correct ? cluePoints(clue) : 0}
          text={item.explanation}
          source={item.source}
          extra={<GameImage image={item.image} className="explain-image" />}
          nextLabel="Vedi il punteggio"
          onNext={() => onFinish([result])}
        />
      )}
    </>
  );
}

// ------------------------------------------------------------------ Metti in ordine
function shuffled<T>(values: T[], seed: number) {
  const result = [...values];
  let state = seed + 7;
  for (let i = result.length - 1; i > 0; i--) {
    state = (state * 9301 + 49297) % 233280;
    const j = Math.floor((state / 233280) * (i + 1));
    [result[i], result[j]] = [result[j] as T, result[i] as T];
  }
  // Mai già in ordine.
  return result.every((value, i) => value === values[i])
    ? [...result.slice(1), result[0] as T]
    : result;
}

export function OrderGame({ items, timeUp, onFinish }: GameProps<OrderItem>) {
  const item = items[0];
  const [order, setOrder] = useState(() =>
    item ? shuffled(item.ordered, item.ordered.join("").length) : [],
  );
  const [done, setDone] = useState(false);
  const inPlace = item ? order.filter((value, i) => value === item.ordered[i]).length : 0;
  useFinishOnTimeUp(timeUp, done ? [{ correct: inPlace === order.length, inPlace }] : [], onFinish);
  if (!item) return null;

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    [next[from], next[to]] = [next[to] as string, next[from] as string];
    setOrder(next);
  };

  return (
    <>
      <p className="game-question">{item.prompt}</p>
      <ol className="order-list">
        {order.map((value, i) => {
          const right = done && value === item.ordered[i];
          const correctIndex = item.ordered.indexOf(value);
          return (
            <li key={value} className={done ? (right ? "right" : "wrong") : ""}>
              <span className="order-pos">{i + 1}</span>
              <span className="order-label">
                {value}
                {done && item.values?.[correctIndex] && <em>{item.values[correctIndex]}</em>}
              </span>
              {!done && (
                <span className="order-buttons">
                  <Button
                    variant="facta"
                    size="icon"
                    aria-label={`Sposta su ${value}`}
                    onClick={() => move(i, i - 1)}
                    disabled={i === 0}
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    variant="facta"
                    size="icon"
                    aria-label={`Sposta giù ${value}`}
                    onClick={() => move(i, i + 1)}
                    disabled={i === order.length - 1}
                  >
                    <ArrowDown />
                  </Button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {!done ? (
        <Button variant="sticker" className="w-full" onClick={() => setDone(true)}>
          Conferma l’ordine <Check />
        </Button>
      ) : (
        <Explanation
          ok={inPlace === order.length}
          title={`${inPlace} su ${order.length} al posto giusto`}
          points={inPlace * 25}
          text={`${item.explanation} Ordine giusto: ${item.ordered.join(" → ")}.`}
          source={item.source}
          nextLabel="Vedi il punteggio"
          onNext={() => onFinish([{ correct: inPlace === order.length, inPlace }])}
        />
      )}
    </>
  );
}

// ------------------------------------------------------------------ Dove succede
type MapData = {
  width: number;
  height: number;
  countries: { id: string; name: string; continent: string; lat: number; lon: number; d: string }[];
};

export function MapGame({ items, timeUp, onFinish }: GameProps<MapItem>) {
  const [map, setMap] = useState<MapData | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [view, setView] = useState({ x: 0, y: 0, w: 960, h: 500 });
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(
    null,
  );
  const svgRef = useRef<SVGSVGElement>(null);
  useFinishOnTimeUp(timeUp, answers, onFinish);

  useEffect(() => {
    void import("@/data/games/world-map.json").then((module) => setMap(module.default as MapData));
  }, []);

  const byId = useMemo(() => new Map(map?.countries.map((c) => [c.id, c]) ?? []), [map]);
  const item = items[index];
  if (!item) return null;
  const target = byId.get(item.countryId);
  const chosen = selected ? byId.get(selected) : undefined;
  const exact = selected === item.countryId;
  const km = chosen && target ? distanceKm(chosen, target) : Infinity;
  const sameContinent = Boolean(chosen && target && chosen.continent === target.continent);
  const points = mapPoints(exact, km, sameContinent);

  const zoom = (factor: number) =>
    setView((v) => {
      const w = Math.min(960, Math.max(120, v.w * factor));
      const h = (w * 500) / 960;
      return {
        x: Math.min(960 - w, Math.max(0, v.x + (v.w - w) / 2)),
        y: Math.min(500 - h, Math.max(0, v.y + (v.h - h) / 2)),
        w,
        h,
      };
    });

  const onPointerDown = (event: React.PointerEvent) => {
    drag.current = { x: event.clientX, y: event.clientY, vx: view.x, vy: view.y, moved: false };
  };
  const onPointerMove = (event: React.PointerEvent) => {
    const start = drag.current;
    const svg = svgRef.current;
    if (!start || !svg) return;
    const scale = view.w / svg.getBoundingClientRect().width;
    const dx = (event.clientX - start.x) * scale;
    const dy = (event.clientY - start.y) * scale;
    if (Math.abs(dx) + Math.abs(dy) > 4) start.moved = true;
    setView((v) => ({
      ...v,
      x: Math.min(960 - v.w, Math.max(0, start.vx - dx)),
      y: Math.min(500 - v.h, Math.max(0, start.vy - dy)),
    }));
  };

  return (
    <>
      <ItemDots total={items.length} current={index} results={answers.map((a) => a.correct)} />
      <p className="challenge-statement">{item.prompt}</p>
      <div className="world-map">
        {!map ? (
          <p className="body-copy">Carico la mappa…</p>
        ) : (
          <svg
            ref={svgRef}
            viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
            role="img"
            aria-label="Mappa del mondo: tocca un Paese"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => setTimeout(() => (drag.current = null), 0)}
            onPointerLeave={() => (drag.current = null)}
          >
            {map.countries.map((country) => {
              const state = locked
                ? country.id === item.countryId
                  ? "target"
                  : country.id === selected
                    ? "wrong"
                    : ""
                : country.id === selected
                  ? "selected"
                  : "";
              return (
                <path
                  key={country.id}
                  d={country.d}
                  className={state}
                  onClick={() => {
                    if (!locked && !drag.current?.moved) setSelected(country.id);
                  }}
                >
                  <title>{country.name}</title>
                </path>
              );
            })}
          </svg>
        )}
        <div className="map-zoom">
          <Button variant="facta" size="icon" aria-label="Avvicina" onClick={() => zoom(0.6)}>
            <Plus />
          </Button>
          <Button variant="facta" size="icon" aria-label="Allontana" onClick={() => zoom(1 / 0.6)}>
            <Minus />
          </Button>
        </div>
      </div>
      <p className="map-selected">
        {chosen ? `Hai scelto: ${chosen.name}` : "Tocca un Paese (puoi zoomare e trascinare)"}
      </p>
      {!locked ? (
        <Button
          variant="sticker"
          className="w-full"
          disabled={!selected}
          onClick={() => {
            setLocked(true);
            setAnswers((current) => [...current, { correct: exact, km, sameContinent }]);
          }}
        >
          Conferma <Check />
        </Button>
      ) : (
        <Explanation
          ok={exact}
          title={
            exact
              ? "Paese esatto!"
              : km <= 1000
                ? `Vicino: ${fmt(km)} km`
                : sameContinent
                  ? "Stesso continente"
                  : `Lontano: era ${target?.name}`
          }
          points={points}
          text={item.explanation}
          source={item.source}
          nextLabel={index < items.length - 1 ? "Avanti" : "Vedi il punteggio"}
          onNext={() => {
            if (index < items.length - 1) {
              setIndex(index + 1);
              setSelected(null);
              setLocked(false);
              setView({ x: 0, y: 0, w: 960, h: 500 });
            } else onFinish(answers);
          }}
        />
      )}
    </>
  );
}
