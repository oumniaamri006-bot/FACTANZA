import gsDelConteCover from "@/assets/media/gs-del-conte.jpg";
import gsViscardiCover from "@/assets/media/gs-viscardi.jpg";
import gsRosinaCover from "@/assets/media/gs-rosina.jpg";
import gsWilliePeyoteCover from "@/assets/media/gs-willie-peyote.jpg";
import gsBombardieriCover from "@/assets/media/gs-bombardieri.jpg";
import orianaEp1Cover from "@/assets/media/oriana-ep1.jpg";
import ytTortoraCover from "@/assets/media/yt-tortora.jpg";
import ytRossettoCover from "@/assets/media/yt-rossetto.jpg";
import ytMenoTasseCover from "@/assets/media/yt-meno-tasse.jpg";
import ytCalendaCover from "@/assets/media/yt-calenda.jpg";
import ytSpagnaCover from "@/assets/media/yt-spagna.jpg";
import ytDubaiCover from "@/assets/media/yt-dubai.jpg";
import ytCorpoFemminileCover from "@/assets/media/yt-corpo-femminile.jpg";
import ytReferendumCover from "@/assets/media/yt-referendum.jpg";
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
export type MediaItem = {
  id: string;
  type: "Podcast" | "YouTube";
  /** Programma o canale. */
  show: string;
  title: string;
  topic: string;
  duration: string;
  /** Data di uscita, se nota (es. "13 ago"). */
  date: string;
  description: string;
  image: string;
};

/** Podcast e video reali di Factanza Media (copertine dagli screenshot del team). */
export const media: MediaItem[] = [
  {
    id: "gs-del-conte",
    type: "Podcast",
    show: "Generazione Sospesa · Ep. 13",
    title:
      "“Italia ospizio per vecchi o paradiso per chi vive di rendita”: l’intervista al professor Del Conte",
    topic: "Lavoro",
    duration: "48 min",
    date: "13 ago",
    description:
      "Perché i giovani continuano ad andare all’estero? E cosa sta diventando l’Italia nel frattempo? Ne parliamo con Maurizio Del Conte, giurista e professore di Diritto del Lavoro all’Università Bocconi.",
    image: gsDelConteCover,
  },
  {
    id: "gs-viscardi",
    type: "Podcast",
    show: "Generazione Sospesa · Ep. 12",
    title:
      "Genitorialità, privilegio, maternità a due facce: con Sofia Viscardi parliamo di giovani e figli",
    topic: "Cultura",
    duration: "52 min",
    date: "6 ago",
    description:
      "«Oggi ragazzi più informati, più consapevoli, ma non hanno dei luoghi dove sbagliare senza essere visti.»",
    image: gsViscardiCover,
  },
  {
    id: "gs-rosina",
    type: "Podcast",
    show: "Generazione Sospesa · Ep. 11",
    title:
      "“Non è colpa dei giovani”: l’intervista al professor Rosina su denatalità, innovazione e futuro",
    topic: "Lavoro",
    duration: "44 min",
    date: "30 lug",
    description:
      "Perché il nostro Paese fa così fatica a inserire i giovani nel mondo del lavoro? Denatalità, innovazione e futuro con Alessandro Rosina.",
    image: gsRosinaCover,
  },
  {
    id: "gs-willie-peyote",
    type: "Podcast",
    show: "Generazione Sospesa · Ep. 10",
    title:
      "Denaro, lavoro e questione abitativa: con Willie Peyote parliamo dei giovani e della società di oggi",
    topic: "Economia",
    duration: "41 min",
    date: "23 lug",
    description:
      "«Da quando è tutto gratis, è tutto più costoso.» Con Willie Peyote, musicista, rapper e cantautore, parliamo delle differenze tra Gen Z e Millennials.",
    image: gsWilliePeyoteCover,
  },
  {
    id: "gs-bombardieri",
    type: "Podcast",
    show: "Generazione Sospesa · Ep. 8",
    title:
      "“Mandate a quel paese chi sfrutta”: con Bombardieri (UIL) parliamo di scioperi, contratti e diritti",
    topic: "Lavoro",
    duration: "43 min",
    date: "9 lug",
    description:
      "«Lo sciopero è un diritto individuale esercitato collettivamente. Non rinunciamoci.» Con Pierpaolo Bombardieri, segretario della Uil.",
    image: gsBombardieriCover,
  },
  {
    id: "oriana-ep1",
    type: "Podcast",
    show: "Oriana · Unposted",
    title: "Ep 1 – Sono tutta qui",
    topic: "Cultura",
    duration: "30 min",
    date: "15 set",
    description: "Il primo episodio di Oriana, il podcast di Factanza Media.",
    image: orianaEp1Cover,
  },
  {
    id: "yt-tortora",
    type: "YouTube",
    show: "Factanza Media",
    title: "L’errore giudiziario più famoso d’Italia: il caso Enzo Tortora",
    topic: "Cultura",
    duration: "47:43",
    date: "",
    description: "",
    image: ytTortoraCover,
  },
  {
    id: "yt-rossetto",
    type: "YouTube",
    show: "Factanza Media",
    title: "Non sono il mio rossetto: streghe e inquisizione social con Francesca Michielin",
    topic: "Cultura",
    duration: "42:14",
    date: "",
    description: "",
    image: ytRossettoCover,
  },
  {
    id: "yt-meno-tasse",
    type: "YouTube",
    show: "Generazione Sospesa",
    title: "Meno tasse per i giovani e meno garanzie ai tempi indeterminati",
    topic: "Lavoro",
    duration: "43:08",
    date: "",
    description: "",
    image: ytMenoTasseCover,
  },
  {
    id: "yt-calenda",
    type: "YouTube",
    show: "Generazione Sospesa",
    title: "“Se non vi pagano andate all’estero e poi tornate”: con Calenda",
    topic: "Politica",
    duration: "58:11",
    date: "",
    description: "",
    image: ytCalendaCover,
  },
  {
    id: "yt-spagna",
    type: "YouTube",
    show: "Factanza Media",
    title: "Il miracolo socialista della Spagna è solo un bluff?",
    topic: "Esteri",
    duration: "30:26",
    date: "",
    description: "",
    image: ytSpagnaCover,
  },
  {
    id: "yt-dubai",
    type: "YouTube",
    show: "Factanza Media",
    title: "Com’è davvero Dubai fuori dai social?",
    topic: "Esteri",
    duration: "28:02",
    date: "",
    description: "",
    image: ytDubaiCover,
  },
  {
    id: "yt-corpo-femminile",
    type: "YouTube",
    show: "Factanza Media",
    title: "Da Marilyn Monroe a Kim Kardashian: chi controlla l’ideale di corpo femminile",
    topic: "Moda",
    duration: "18:49",
    date: "",
    description: "",
    image: ytCorpoFemminileCover,
  },
  {
    id: "yt-referendum",
    type: "YouTube",
    show: "Factanza Media",
    title: "Il referendum sulla giustizia, spiegato dall’inizio",
    topic: "Politica",
    duration: "18:29",
    date: "",
    description: "",
    image: ytReferendumCover,
  },
];

/** Link esterno per ascoltare o guardare il contenuto originale. */
export function mediaLink(item: MediaItem) {
  const query = encodeURIComponent(item.title);
  return item.type === "YouTube"
    ? `https://www.youtube.com/@factanzamedia/search?query=${query}`
    : `https://open.spotify.com/search/${query}`;
}
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
