/** Tipi dei minigiochi informativi di Factanza. */

export type GameKind =
  | "notizia"
  | "piu-grande"
  | "cifra"
  | "vero-falso"
  | "chi-l-ha-detto"
  | "chi-e-chi"
  | "cosa-significa"
  | "clickbait"
  | "prima-dopo"
  | "dove-succede"
  | "metti-in-ordine"
  | "collega"
  | "riepilogo";

/** Immagine con crediti (Wikimedia Commons, asset Factanza o icona neutra). */
export type Credit = { src: string; author: string; license: string; source: string };

/** Spiegazione mostrata dopo ogni risposta: è la parte informativa del gioco. */
export type Explained = { explanation: string; source: string };

export type ChoiceItem = Explained & {
  prompt: string;
  options: string[];
  answer: number;
  /** Immagini per opzione (es. volti in "Chi l'ha detto") o per la domanda. */
  optionImages?: (Credit | undefined)[];
  image?: Credit | undefined;
};

export type SliderItem = Explained & {
  prompt: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  answer: number;
  image?: Credit | undefined;
};

export type CluesItem = Explained & {
  clues: string[];
  options: string[];
  answer: number;
  image?: Credit | undefined;
};

export type OrderItem = Explained & {
  prompt: string;
  /** Elementi già nell'ordine giusto: il gioco li mescola. */
  ordered: string[];
  /** Valore mostrato dopo la risposta accanto a ogni elemento (es. "84 mln"). */
  values?: string[];
};

export type MapItem = Explained & {
  prompt: string;
  /** Codice numerico ISO del Paese (come in world-map.json). */
  countryId: string;
};

export type GameContent =
  | { kind: "notizia"; topic: string; items: ChoiceItem[] }
  | {
      kind:
        | "piu-grande"
        | "vero-falso"
        | "chi-l-ha-detto"
        | "cosa-significa"
        | "clickbait"
        | "prima-dopo"
        | "collega"
        | "riepilogo";
      topic: string;
      items: ChoiceItem[];
    }
  | { kind: "cifra"; topic: string; items: SliderItem[] }
  | { kind: "chi-e-chi"; topic: string; items: CluesItem[] }
  | { kind: "metti-in-ordine"; topic: string; items: OrderItem[] }
  | { kind: "dove-succede"; topic: string; items: MapItem[] };

/** Risultato di una singola risposta, usato per i punteggi. */
export type Answer = {
  correct: boolean;
  /** Per lo slider: errore relativo (0 = esatto). */
  error?: number;
  /** Per "Chi è chi": indice dell'indizio a cui si è indovinato (0 = primo). */
  clue?: number;
  /** Per "Dove succede": distanza in km e stesso continente. */
  km?: number;
  sameContinent?: boolean;
  /** Per "Metti in ordine": elementi nella posizione giusta. */
  inPlace?: number;
};
