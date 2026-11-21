/**
 * FactaChallenge: una sfida al giorno da 60 secondi con tre prove sul mondo reale.
 * Ogni prova vale da 0 a 100 punti e mostra spiegazioni brevi con la fonte.
 * I contenuti devono essere verificati: `unverified: true` lo segnala chiaramente in app.
 */
import willie from "@/assets/media/gs-willie-peyote.jpg";
import bombardieri from "@/assets/media/gs-bombardieri.jpg";
import viscardi from "@/assets/media/gs-viscardi.jpg";

export type PriceRound = {
  kind: "prezzo";
  prompt: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  answer: number;
  explanation: string;
  source: string;
  unverified?: boolean;
};

export type MatchRound = {
  kind: "citazione";
  prompt: string;
  pairs: { quote: string; person: string; image: string }[];
  explanation: string;
  source: string;
  unverified?: boolean;
};

export type SwipeRound = {
  kind: "verofalso";
  prompt: string;
  cards: { statement: string; answer: boolean; explanation: string; source: string }[];
  unverified?: boolean;
};

export type ChallengeRound = PriceRound | MatchRound | SwipeRound;
export type Challenge = { date: string; rounds: ChallengeRound[] };

export const challengeSeconds = 60;

export const kindLabel: Record<ChallengeRound["kind"], string> = {
  prezzo: "INDOVINA IL PREZZO",
  citazione: "CHI L’HA DETTO?",
  verofalso: "VERO O FALSO?",
};

export const challenges: Challenge[] = [
  {
    date: "2026-11-21",
    rounds: [
      {
        kind: "prezzo",
        prompt: "Quanto costa in media al mese una stanza singola in affitto a Milano?",
        min: 200,
        max: 1200,
        step: 10,
        unit: "€",
        answer: 650,
        explanation:
          "A Milano una stanza singola costa più che in qualsiasi altra città italiana: per molti studenti e giovani lavoratori l’affitto si mangia buona parte dello stipendio.",
        source:
          "Dato da verificare dalla redazione (es. osservatori affitti di Immobiliare.it o Idealista).",
        unverified: true,
      },
      {
        kind: "citazione",
        prompt: "Tocca una frase, poi il volto di chi l’ha detta.",
        pairs: [
          {
            quote: "«Da quando è tutto gratis, è tutto più costoso.»",
            person: "Willie Peyote",
            image: willie,
          },
          {
            quote: "«Lo sciopero è un diritto individuale esercitato collettivamente.»",
            person: "Pierpaolo Bombardieri",
            image: bombardieri,
          },
          {
            quote: "«I ragazzi non hanno luoghi dove sbagliare senza essere visti.»",
            person: "Sofia Viscardi",
            image: viscardi,
          },
        ],
        explanation:
          "Tre ospiti di Generazione Sospesa: il rapper Willie Peyote su soldi e casa, il segretario della Uil Pierpaolo Bombardieri sui diritti di chi lavora, la scrittrice Sofia Viscardi su giovani e social.",
        source: "Generazione Sospesa, ep. 8, 10 e 12 (Factanza Media)",
      },
      {
        kind: "verofalso",
        prompt: "Swipe a destra se è vero, a sinistra se è falso.",
        cards: [
          {
            statement:
              "La famosa immagine delle scimmie che diventano uomini nasce da un libro illustrato del 1965.",
            answer: true,
            explanation:
              "Vero: è “The Road to Homo Sapiens” di Rudolph Zallinger, per il libro “Early Man”.",
            source: "F. Clark Howell, “Early Man”, Time-Life Books, 1965",
          },
          {
            statement: "L’uomo discende dalle scimmie che vivono oggi.",
            answer: false,
            explanation:
              "Falso: esseri umani e altre grandi scimmie hanno antenati comuni. L’evoluzione è un albero, non una fila.",
            source: "Post di @factanza sull’evoluzione umana",
          },
          {
            statement: "In alcuni Paesi europei i sedicenni possono già votare.",
            answer: true,
            explanation:
              "Vero: in Austria, per esempio, si vota a 16 anni alle elezioni nazionali dal 2007.",
            source: "Parlamento austriaco, riforma elettorale 2007",
          },
        ],
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

/** Punti del cursore: 100 se esatto, 0 se l'errore è pari o oltre metà della scala. */
export function priceScore(round: PriceRound, guess: number) {
  const tolerance = (round.max - round.min) / 2;
  return Math.max(0, Math.round(100 * (1 - Math.abs(guess - round.answer) / tolerance)));
}

/** Totale: somma delle prove (0–100 ciascuna) + 1 punto per ogni secondo avanzato. */
export function challengeScore(roundScores: number[], secondsLeft: number) {
  const base = roundScores.reduce((sum, value) => sum + value, 0);
  return base + (base > 0 ? Math.max(0, secondsLeft) : 0);
}

export function scoreSquare(score: number) {
  return score >= 70 ? "🟩" : score >= 40 ? "🟨" : "🟥";
}

/** Testo da condividere: quadratini per prova, punteggio e link di sfida. */
export function shareText(day: string, roundScores: number[], score: number, url: string) {
  const [, month, date] = day.split("-");
  const squares = roundScores.map(scoreSquare).join("");
  return `FactaChallenge ${date}/${month}\n${squares} ${score} punti\nSfidami sulle stesse domande: ${url}`;
}
