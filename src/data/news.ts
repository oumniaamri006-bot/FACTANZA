import aiAsset from "@/assets/factanza-ai.asset.json";
import { collage } from "./factanza";
export const aiImage = aiAsset.url;
export const news = [
  {
    id: "ai-lavoro",
    topic: "AI & Tech",
    title: "L’AI cambierà il lavoro. Ma siamo pronti?",
    accent: "siamo pronti?",
    minutes: 4,
    opinions: "2.3k",
    image: aiImage,
    slides: [
      "L’intelligenza artificiale è già entrata nelle nostre vite. E nel nostro lavoro.",
      "Non solo robot: l’AI scrive, analizza dati, crea immagini e aiuta a prendere decisioni.",
      "Alcune attività cambieranno. Altre spariranno. Ma nasceranno anche professioni che oggi non conosciamo.",
      "La vera sfida è la formazione. Chi avrà gli strumenti per imparare a usare queste tecnologie?",
      "Non è soltanto una questione di tecnologia. È una questione di scelte, diritti e opportunità.",
    ],
  },
  {
    id: "voto-giovani",
    topic: "Politica",
    title: "Votare a 16 anni? La nostra voce conta.",
    accent: "La nostra voce conta.",
    minutes: 3,
    opinions: "1.8k",
    image: collage,
    slides: [
      "Votare a 16 anni: un’idea che fa discutere.",
      "In alcuni Paesi europei i sedicenni possono già votare.",
      "Chi è a favore parla di partecipazione e responsabilità.",
      "Chi è contrario chiede più educazione civica e consapevolezza.",
      "La domanda riguarda tutti: quando si diventa pronti a decidere?",
    ],
  },
  {
    id: "clima",
    topic: "Ambiente",
    title: "Il pianeta non può aspettare. E noi?",
    accent: "E noi?",
    minutes: 5,
    opinions: "946",
    image: collage,
    slides: [
      "Il clima cambia e le nuove generazioni chiedono risposte.",
      "Trasporti, energia e consumi: le scelte quotidiane contano.",
      "Ma non bastano le azioni individuali. Servono decisioni collettive.",
      "Le comunità possono sperimentare nuove soluzioni.",
      "Un futuro più equo comincia dalle domande giuste.",
    ],
  },
  {
    id: "cultura",
    topic: "Cultura",
    title: "La cultura è di tutti. Non un lusso.",
    accent: "Non un lusso.",
    minutes: 3,
    opinions: "712",
    image: collage,
    slides: [
      "Un museo, un concerto, un libro: la cultura cambia il modo di vedere il mondo.",
      "I prezzi possono diventare una barriera.",
      "Biblioteche e spazi pubblici sono luoghi da difendere.",
      "Le agevolazioni possono avvicinare nuovi pubblici.",
      "Cosa vorresti vedere nella tua città?",
    ],
  },
];
