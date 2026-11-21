import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

/** La fiamma della serie, con il numero dei giorni. Si "accende" quando la serie è viva. */
export function StreakFlame({
  count,
  lit,
  size = "lg",
}: {
  count: number;
  lit: boolean;
  size?: "lg" | "sm";
}) {
  return (
    <div className={`streak-flame ${size} ${lit ? "lit" : "off"}`} aria-hidden>
      <motion.span
        className="streak-flame-icon"
        animate={lit ? { scale: [1, 1.08, 0.97, 1.05, 1], rotate: [0, -3, 2, -1, 0] } : {}}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Flame />
      </motion.span>
      <motion.strong
        key={count}
        initial={{ scale: 1.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 14 }}
      >
        {count}
      </motion.strong>
    </div>
  );
}

/** Pioggia di coriandoli pop-art (decorativa). */
export function Confetti({ pieces = 18 }: { pieces?: number }) {
  return (
    <div className="confetti" aria-hidden>
      {Array.from({ length: pieces }, (_, i) => (
        <motion.i
          key={i}
          style={{ left: `${(i * 53) % 100}%` }}
          initial={{ y: -30, opacity: 0, rotate: 0 }}
          animate={{ y: 360, opacity: [0, 1, 1, 0], rotate: (i % 2 ? 1 : -1) * 400 }}
          transition={{ duration: 1.8, delay: (i % 6) * 0.08, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

/** Timer ad anello: si svuota e diventa rosso negli ultimi 10 secondi. */
export function TimerRing({ left, total }: { left: number; total: number }) {
  const r = 20;
  const length = 2 * Math.PI * r;
  return (
    <div
      className={`timer-ring ${left <= 10 ? "urgent" : ""}`}
      role="timer"
      aria-label={`${left} secondi`}
    >
      <svg viewBox="0 0 48 48" aria-hidden>
        <circle cx="24" cy="24" r={r} className="track" />
        <circle
          cx="24"
          cy="24"
          r={r}
          className="fill"
          strokeDasharray={length}
          strokeDashoffset={length * (1 - left / total)}
        />
      </svg>
      <span>{left}</span>
    </div>
  );
}

/** Numero che sale da 0 al valore (per i punti). */
export function CountUp({ value, duration = 700 }: { value: number; duration?: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setShown(Math.round(value * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return <>{shown}</>;
}
