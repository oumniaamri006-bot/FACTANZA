import collageAsset from "@/assets/factanza-collage.asset.json";

export const collage = collageAsset.url;
export const topics = [
  "AI & Tech",
  "Politica",
  "Economia",
  "Sport",
  "Moda",
  "Cultura",
  "Ambiente",
  "Esteri",
  "Lavoro",
  "Salute",
];
export const formats = ["Leggo", "Guardo", "Ascolto"];
export const dailyQuestion = "Il voto ai 16enni è una buona idea?";
export const dailyResults = { Sì: 62, No: 38 };
export const events = [
  {
    id: "ai",
    title: "L’AI ruberà più lavori di quanti ne crea?",
    topic: "AI & Tech",
    guest: "Giulia Riva · Ricercatrice AI",
    date: "Oggi · 18:30",
    status: "live",
  },
  {
    id: "voto",
    title: "A 16 anni siamo pronti a votare?",
    topic: "Politica",
    guest: "Luca Bianchi · Giornalista",
    date: "24 novembre · 19:00",
    status: "next",
  },
  {
    id: "clima",
    title: "Il futuro del pianeta è ancora nelle nostre mani?",
    topic: "Ambiente",
    guest: "Sara Moretti · Attivista",
    date: "19 novembre · 42 min",
    status: "replay",
  },
];
export const chatMessages = [
  { name: "sofia", text: "Secondo me dipende da come la usiamo 👀" },
  { name: "matteo", text: "A scuola non ne parliamo abbastanza." },
  { name: "giulia", text: "Nuovi lavori, ma servono nuove competenze!" },
  { name: "ale", text: "Il punto è: chi avrà accesso alla formazione?" },
];
export const media = [
  {
    id: "tessili",
    title: "Perché gli operai tessili protestano in Bangladesh?",
    topic: "Esteri",
    duration: "18 min",
    type: "Podcast",
  },
  {
    id: "ai",
    title: "AI: il futuro è già qui. E noi?",
    topic: "AI & Tech",
    duration: "24 min",
    type: "Podcast",
  },
  {
    id: "cultura",
    title: "La cultura non è un lusso.",
    topic: "Cultura",
    duration: "16 min",
    type: "Podcast",
  },
  {
    id: "video-ai",
    title: "L’intelligenza artificiale spiegata bene.",
    topic: "AI & Tech",
    duration: "12 min",
    type: "YouTube",
  },
  {
    id: "video-clima",
    title: "Il clima cambia. E noi?",
    topic: "Ambiente",
    duration: "9 min",
    type: "YouTube",
  },
];
export const partners = [
  {
    id: "libri",
    name: "Pagina27",
    category: "Librerie",
    discount: "-15%",
    code: "FACTALIBRI15",
    detail: "Su tutti i libri, esclusi i testi scolastici.",
  },
  {
    id: "cinema",
    name: "Cinema Orbit",
    category: "Cinema",
    discount: "-20%",
    code: "FACTACINEMA20",
    detail: "Sul biglietto intero, dal lunedì al giovedì.",
  },
  {
    id: "trasporti",
    name: "Move",
    category: "Trasporti",
    discount: "-10%",
    code: "FACTAMOVE10",
    detail: "Sul prossimo viaggio in treno.",
  },
  {
    id: "moda",
    name: "Rewear",
    category: "Abbigliamento",
    discount: "-15%",
    code: "FACTAREWEAR15",
    detail: "Sul tuo primo acquisto second hand.",
  },
  {
    id: "food",
    name: "Green Bite",
    category: "Food",
    discount: "-20%",
    code: "FACTABITE20",
    detail: "Sul menu pranzo, dal lunedì al venerdì.",
  },
  {
    id: "musica",
    name: "Offbeat",
    category: "Musica",
    discount: "-10%",
    code: "FACTAMUSIC10",
    detail: "Sui concerti aderenti alla promozione.",
  },
];
