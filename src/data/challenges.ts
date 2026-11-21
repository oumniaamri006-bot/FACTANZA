/**
 * FactaChallenge: una sfida al giorno da 60 secondi con tre prove sul mondo reale.
 * Ogni risposta mostra una spiegazione breve con la fonte. I contenuti devono essere verificati:
 * se un dato non lo è ancora, `unverified: true` lo segnala chiaramente in app.
 */

export type ChallengeQuestion =
  | {
      kind: "prezzo";
      prompt: string;
      options: string[];
      answer: number;
      explanation: string;
      source: string;
      unverified?: boolean;
    }
  | {
      kind: "citazione";
      prompt: string;
      quote: string;
      options: string[];
      answer: number;
      explanation: string;
      source: string;
      unverified?: boolean;
    }
  | {
      kind: "verofalso";
      prompt: string;
      statement: string;
      answer: boolean;
      explanation: string;
      source: string;
      unverified?: boolean;
    };

export type Challenge = { date: string; questions: ChallengeQuestion[] };

export const challengeSeconds = 60;

export const kindLabel: Record<ChallengeQuestion["kind"], string> = {
  prezzo: "INDOVINA IL PREZZO",
  citazione: "CHI L’HA DETTO?",
  verofalso: "VERO O FALSO?",
};

export const challenges: Challenge[] = [
  {
    date: "2026-11-21",
    questions: [
      {
        kind: "prezzo",
        prompt: "Quanto costa in media al mese una stanza singola in affitto a Milano?",
        options: ["Meno di 400 €", "400–550 €", "550–750 €", "Più di 750 €"],
        answer: 2,
        explanation:
          "A Milano una stanza singola costa più che in qualsiasi altra città italiana: per molti studenti e giovani lavoratori l’affitto si mangia buona parte dello stipendio.",
        source:
          "Dato da verificare dalla redazione (es. osservatori affitti di Immobiliare.it o Idealista).",
        unverified: true,
      },
      {
        kind: "citazione",
        prompt: "Associa la frase al personaggio giusto.",
        quote: "«Da quando è tutto gratis, è tutto più costoso.»",
        options: ["Pierpaolo Bombardieri", "Willie Peyote", "Sofia Viscardi", "Alessandro Rosina"],
        answer: 1,
        explanation:
          "L’ha detto il rapper Willie Peyote a Generazione Sospesa, parlando di soldi, lavoro e casa per i giovani di oggi.",
        source: "Generazione Sospesa, ep. 10 (Factanza Media)",
      },
      {
        kind: "verofalso",
        prompt: "Notizia assurda ma vera… o falsa?",
        statement:
          "La famosa immagine delle scimmie che, una dopo l’altra, diventano uomini non nasce da una scoperta scientifica ma da un libro illustrato del 1965.",
        answer: true,
        explanation:
          "Vero: è “The Road to Homo Sapiens”, disegnata da Rudolph Zallinger per il libro “Early Man” (Time-Life, 1965). L’evoluzione però non è una fila indiana: è un albero con tanti rami.",
        source: "F. Clark Howell, “Early Man”, Time-Life Books, 1965",
      },
    ],
  },
];

/** Sfida del giorno (o l'ultima disponibile). */
export function challengeFor(day: string) {
  return (
    challenges.find((challenge) => challenge.date === day) ??
    [...challenges].sort((a, b) => b.date.localeCompare(a.date))[0]
  );
}

/** Punteggio: 100 per risposta giusta + 2 punti per ogni secondo avanzato (solo con risposte giuste). */
export function challengeScore(correct: boolean[], secondsLeft: number) {
  const right = correct.filter(Boolean).length;
  return right * 100 + (right > 0 ? Math.max(0, secondsLeft) * 2 : 0);
}

/** Testo da condividere: quadratini come nei giochi a parole, punteggio e link di sfida. */
export function shareText(day: string, correct: boolean[], score: number, url: string) {
  const [, month, date] = day.split("-");
  const squares = correct.map((ok) => (ok ? "🟩" : "🟥")).join("");
  return `FactaChallenge ${date}/${month}\n${squares} ${correct.filter(Boolean).length}/3 · ${score} punti\nSfidami sulle stesse domande: ${url}`;
}
