import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Credit } from "@/lib/games/types";

/** Immagine con crediti; senza immagine mostra un'icona neutra (segnalata). */
export function GameImage({
  image,
  className = "",
}: {
  image?: Credit | undefined;
  className?: string;
}) {
  if (!image)
    return (
      <div className={`game-image placeholder ${className}`} aria-hidden>
        <ImageOff />
      </div>
    );
  return (
    <figure className={`game-image ${className}`}>
      <img src={image.src} alt="" loading="lazy" />
      <figcaption>
        {image.author} · {image.license}
      </figcaption>
    </figure>
  );
}

/** Spiegazione breve dopo ogni risposta: la parte informativa del gioco. */
export function Explanation({
  ok,
  title,
  text,
  source,
  points,
  extra,
  onNext,
  nextLabel = "Avanti",
}: {
  ok: boolean;
  title?: string | undefined;
  text: string;
  source: string;
  points?: number | undefined;
  extra?: ReactNode;
  onNext: () => void;
  nextLabel?: string;
}) {
  return (
    <motion.div
      className={`challenge-explain ${ok ? "ok" : "ko"}`}
      role="status"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <strong>
        {title ?? (ok ? "Giusto!" : "Sbagliato")}
        {points !== undefined && <span className="explain-points"> +{points}</span>}
      </strong>
      {extra}
      <p>{text}</p>
      <span className="challenge-source">Fonte: {source}</span>
      <Button variant="sticker" className="w-full mt-3" onClick={onNext}>
        {nextLabel} <ArrowRight />
      </Button>
    </motion.div>
  );
}

/** Pallini di avanzamento delle domande dentro un gioco. */
export function ItemDots({
  total,
  current,
  results,
}: {
  total: number;
  current: number;
  results: boolean[];
}) {
  if (total <= 1) return null;
  return (
    <div className="tf-dots" aria-label={`Domanda ${Math.min(current + 1, total)} di ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={
            i < results.length ? (results[i] ? "ok" : "ko") : i === current ? "current" : ""
          }
        />
      ))}
    </div>
  );
}

/** Barra del tempo per singola domanda (es. 10 s in "Cos'è più grande"). */
export function ItemTimer({ seconds, left }: { seconds: number; left: number }) {
  return (
    <div className="item-timer" aria-label={`${left} secondi`}>
      <span style={{ width: `${(left / seconds) * 100}%` }} className={left <= 3 ? "urgent" : ""} />
    </div>
  );
}
