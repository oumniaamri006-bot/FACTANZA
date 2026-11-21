import ytTortoraCover from "@/assets/media/yt-tortora.jpg";
import ytRossettoCover from "@/assets/media/yt-rossetto.jpg";
import ytMenoTasseCover from "@/assets/media/yt-meno-tasse.jpg";
import ytMottaCover from "@/assets/media/yt-motta.jpg";
import ytSpagnaCover from "@/assets/media/yt-spagna.jpg";
import ytFratoianniCover from "@/assets/media/yt-fratoianni.jpg";
import ytCalendaCover from "@/assets/media/yt-calenda.jpg";
import ytCorpoFemminileCover from "@/assets/media/yt-corpo-femminile.jpg";
import ytCarlBraveCover from "@/assets/media/yt-carl-brave.jpg";
import ytDubaiCover from "@/assets/media/yt-dubai.jpg";
import ytReferendumNoCover from "@/assets/media/yt-referendum-no.jpg";
import ytReferendumSiCover from "@/assets/media/yt-referendum-si.jpg";
import ytOscarCover from "@/assets/media/yt-oscar.jpg";
import ytComitatiCover from "@/assets/media/yt-comitati.jpg";
import ytMagistratiCover from "@/assets/media/yt-magistrati.jpg";
import ytReferendumCover from "@/assets/media/yt-referendum.jpg";
import ytRoyPaciCover from "@/assets/media/yt-roy-paci.jpg";
import ytSanremoFinaleCover from "@/assets/media/yt-sanremo-finale.jpg";
import ytFedezCover from "@/assets/media/yt-fedez.jpg";
import ytMicheleBraviCover from "@/assets/media/yt-michele-bravi.jpg";
import ytTonypitonyCover from "@/assets/media/yt-tonypitony.jpg";
import ytVocalCoachCover from "@/assets/media/yt-vocal-coach.jpg";
import ytErmalMetaCover from "@/assets/media/yt-ermal-meta.jpg";
import ytSanremoTerzaCover from "@/assets/media/yt-sanremo-terza.jpg";
import ytJaxCover from "@/assets/media/yt-jax.jpg";
import ytMelozziCover from "@/assets/media/yt-melozzi.jpg";
import ytSanremoSecondaCover from "@/assets/media/yt-sanremo-seconda.jpg";
import ytSanremoPrimaCover from "@/assets/media/yt-sanremo-prima.jpg";
import ytEpsteinCover from "@/assets/media/yt-epstein.jpg";
import ytRussiaCover from "@/assets/media/yt-russia.jpg";
import ytFingerPinchCover from "@/assets/media/yt-finger-pinch.jpg";
import ytTransvestigationCover from "@/assets/media/yt-transvestigation.jpg";
import ytStrangerThingsCover from "@/assets/media/yt-stranger-things.jpg";
import ytPizzagateCover from "@/assets/media/yt-pizzagate.jpg";
import ytRazzaBianca2Cover from "@/assets/media/yt-razza-bianca-2.jpg";
import ytRazzaBiancaCover from "@/assets/media/yt-razza-bianca.jpg";
import ytInsideGazaCover from "@/assets/media/yt-inside-gaza.jpg";
import ytIsraeleUsaCover from "@/assets/media/yt-israele-usa.jpg";
import ytIranIsraeleCover from "@/assets/media/yt-iran-israele.jpg";
import gsDelConteCover from "@/assets/media/gs-del-conte.jpg";
import gsViscardiCover from "@/assets/media/gs-viscardi.jpg";
import gsRosinaCover from "@/assets/media/gs-rosina.jpg";
import gsWilliePeyoteCover from "@/assets/media/gs-willie-peyote.jpg";
import gsBombardieriCover from "@/assets/media/gs-bombardieri.jpg";
import orianaEp1Cover from "@/assets/media/oriana-ep1.jpg";
export const topics = [
  "AI & Tech",
  "Politica",
  "Economia",
  "Cultura",
  "Ambiente",
  "Esteri",
  "Lavoro",
  "Salute",
  "Trend",
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
  /** Codice del video su YouTube (per il player e il link diretto). */
  youtubeId?: string;
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
    youtubeId: "I7FA6AtOpOg",
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
    youtubeId: "ecViiqXr1mY",
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
    youtubeId: "OjjULWZC4IA",
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
    youtubeId: "dmqZnXjj9-0",
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
    youtubeId: "G9hauIjCzEg",
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
    youtubeId: "ZG0APw4VNeo",
  },
  {
    id: "yt-rossetto",
    type: "YouTube",
    show: "Factanza Media",
    title: "Non sono il mio rossetto: streghe e inquisizione social con Francesca Michielin",
    topic: "Trend",
    duration: "42:14",
    date: "",
    description: "",
    image: ytRossettoCover,
    youtubeId: "2caGAmj_zrI",
  },
  {
    id: "yt-meno-tasse",
    type: "YouTube",
    show: "Factanza Media",
    title: "Meno tasse per i giovani e meno garanzie ai tempi indeterminati",
    topic: "Lavoro",
    duration: "43:08",
    date: "",
    description: "",
    image: ytMenoTasseCover,
    youtubeId: "DdqCoOavEPg",
  },
  {
    id: "yt-motta",
    type: "YouTube",
    show: "Factanza Media",
    title: "“Musica è politica, chi la fa si esponga”: con Motta parliamo di stage e affitti",
    topic: "Cultura",
    duration: "31:17",
    date: "",
    description: "",
    image: ytMottaCover,
    youtubeId: "-Equ7iSsK1Y",
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
    youtubeId: "mBfQfGowVm8",
  },
  {
    id: "yt-fratoianni",
    type: "YouTube",
    show: "Factanza Media",
    title: "“In Italia deve cambiare tutto”: con Fratoianni parliamo di precariato",
    topic: "Politica",
    duration: "51:43",
    date: "",
    description: "",
    image: ytFratoianniCover,
    youtubeId: "48eoWF6sHNY",
  },
  {
    id: "yt-calenda",
    type: "YouTube",
    show: "Factanza Media",
    title: "“Se non vi pagano andate all’estero e poi tornate”: con Calenda parliamo di giovani",
    topic: "Politica",
    duration: "58:11",
    date: "",
    description: "",
    image: ytCalendaCover,
    youtubeId: "ahaxHECrDXQ",
  },
  {
    id: "yt-corpo-femminile",
    type: "YouTube",
    show: "Factanza Media",
    title: "Da Marilyn Monroe a Kim Kardashian: chi controlla l’ideale di corpo femminile",
    topic: "Trend",
    duration: "18:49",
    date: "",
    description: "",
    image: ytCorpoFemminileCover,
    youtubeId: "nx8aDd5Ngi0",
  },
  {
    id: "yt-carl-brave",
    type: "YouTube",
    show: "Factanza Media",
    title:
      "Oltre il palco: Carl Brave ci parla di Roma, intelligenza artificiale e libertà di espressione",
    topic: "Cultura",
    duration: "33:38",
    date: "",
    description: "",
    image: ytCarlBraveCover,
    youtubeId: "hlomsBdv1zM",
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
    youtubeId: "kZqrXAiL-N0",
  },
  {
    id: "yt-referendum-no",
    type: "YouTube",
    show: "Factanza Media",
    title: "Perché votare “No”? Le ragioni di Cathy La Torre sul referendum sulla giustizia",
    topic: "Politica",
    duration: "20:16",
    date: "",
    description: "",
    image: ytReferendumNoCover,
    youtubeId: "lzGGTB-IMHs",
  },
  {
    id: "yt-referendum-si",
    type: "YouTube",
    show: "Factanza Media",
    title: "Perché votare “Sì”? Le ragioni dell’avvocata Silvia Carlino",
    topic: "Politica",
    duration: "13:16",
    date: "",
    description: "",
    image: ytReferendumSiCover,
    youtubeId: "5YIvZZYq1s8",
  },
  {
    id: "yt-oscar",
    type: "YouTube",
    show: "Factanza Media",
    title: "L’invenzione della celebrità. Gli Oscar sono ancora il cuore del cinema?",
    topic: "Cultura",
    duration: "14:13",
    date: "",
    description: "",
    image: ytOscarCover,
    youtubeId: "UTV9ko5k0vE",
  },
  {
    id: "yt-comitati",
    type: "YouTube",
    show: "Factanza Media",
    title: "Sì o No? I comitati del referendum sulla giustizia a confronto",
    topic: "Politica",
    duration: "22:02",
    date: "",
    description: "",
    image: ytComitatiCover,
    youtubeId: "u9q-y7gkxe4",
  },
  {
    id: "yt-magistrati",
    type: "YouTube",
    show: "Factanza Media",
    title: "Magistrati e avvocati: il dibattito sul referendum sulla giustizia",
    topic: "Politica",
    duration: "24:24",
    date: "",
    description: "",
    image: ytMagistratiCover,
    youtubeId: "XkcPBPGBOTI",
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
    youtubeId: "30IZAUyOGyA",
  },
  {
    id: "yt-roy-paci",
    type: "YouTube",
    show: "Factanza Media",
    title:
      "Cosa succede davvero all’Ariston: l’intervista a Roy Paci su Sanremo, musica e lotta alla mafia",
    topic: "Cultura",
    duration: "32:51",
    date: "",
    description: "",
    image: ytRoyPaciCover,
    youtubeId: "wBrSdD-qHuQ",
  },
  {
    id: "yt-sanremo-finale",
    type: "YouTube",
    show: "Factanza Media",
    title: "Commentiamo la finale, il podio e i testi delle canzoni di Sanremo 2026 (con Mizar)",
    topic: "Cultura",
    duration: "39:00",
    date: "",
    description: "",
    image: ytSanremoFinaleCover,
    youtubeId: "LcD5bsIrTQ0",
  },
  {
    id: "yt-fedez",
    type: "YouTube",
    show: "Factanza Media",
    title: "A Sanremo con Fedez: parliamo di “Male necessario” e di musica con Marco Masini",
    topic: "Cultura",
    duration: "12:00",
    date: "",
    description: "",
    image: ytFedezCover,
    youtubeId: "3U4HyocySB4",
  },
  {
    id: "yt-michele-bravi",
    type: "YouTube",
    show: "Factanza Media",
    title:
      "Prima o poi vinco il Festival? Michele Bravi ci parla di premi a Sanremo, scaramanzia e amore",
    topic: "Cultura",
    duration: "12:20",
    date: "",
    description: "",
    image: ytMicheleBraviCover,
    youtubeId: "C0q8tMtOw7w",
  },
  {
    id: "yt-tonypitony",
    type: "YouTube",
    show: "Factanza Media",
    title:
      "TonyPitony genio o no? Commentiamo la puntata dei duetti da Casa Factanza (con Kayros Music)",
    topic: "Cultura",
    duration: "42:13",
    date: "",
    description: "",
    image: ytTonypitonyCover,
    youtubeId: "JSQeImfc6UM",
  },
  {
    id: "yt-vocal-coach",
    type: "YouTube",
    show: "Factanza Media",
    title: "Prepararsi a Sanremo: che lavoro fa un vocal coach (con Pachy)",
    topic: "Cultura",
    duration: "20:02",
    date: "",
    description: "",
    image: ytVocalCoachCover,
    youtubeId: "0dLHmMrUD0Y",
  },
  {
    id: "yt-ermal-meta",
    type: "YouTube",
    show: "Factanza Media",
    title:
      "Oltre Stella stellina: Ermal Meta parla di Gaza, guerra e partecipazione giovanile a Sanremo 2026",
    topic: "Cultura",
    duration: "15:58",
    date: "",
    description: "",
    image: ytErmalMetaCover,
    youtubeId: "8f6VPqmXzEY",
  },
  {
    id: "yt-sanremo-terza",
    type: "YouTube",
    show: "Factanza Media",
    title:
      "Giornalisti vs cantanti: commentiamo la terza serata di Sanremo da Casa Factanza (con Random)",
    topic: "Cultura",
    duration: "34:34",
    date: "",
    description: "",
    image: ytSanremoTerzaCover,
    youtubeId: "YhYjAKBEMoE",
  },
  {
    id: "yt-jax",
    type: "YouTube",
    show: "Factanza Media",
    title: "J-Ax a Sanremo contro tutti: critica i media, la politica, i potenti, l’Eurovision",
    topic: "Cultura",
    duration: "12:39",
    date: "",
    description: "",
    image: ytJaxCover,
    youtubeId: "YX5UkfdrlFQ",
  },
  {
    id: "yt-melozzi",
    type: "YouTube",
    show: "Factanza Media",
    title: "Nella vita di un direttore d’orchestra di Sanremo (con Enrico Melozzi)",
    topic: "Cultura",
    duration: "35:34",
    date: "",
    description: "",
    image: ytMelozziCover,
    youtubeId: "gBbYE3ApqvY",
  },
  {
    id: "yt-sanremo-seconda",
    type: "YouTube",
    show: "Factanza Media",
    title: "Sanremo 2026 è un flop? Commentiamo la seconda serata da Casa Factanza (con Moreno)",
    topic: "Cultura",
    duration: "23:31",
    date: "",
    description: "",
    image: ytSanremoSecondaCover,
    youtubeId: "4P0XuPaMW4E",
  },
  {
    id: "yt-sanremo-prima",
    type: "YouTube",
    show: "Factanza Media",
    title: "Commentiamo la prima serata di Sanremo 2026 (con Bambole di pezza e Caffè Design)",
    topic: "Cultura",
    duration: "52:22",
    date: "",
    description: "",
    image: ytSanremoPrimaCover,
    youtubeId: "pxQQzPZV1R4",
  },
  {
    id: "yt-epstein",
    type: "YouTube",
    show: "Factanza Media",
    title: "Epstein Files. Tutta la storia spiegata dall’inizio",
    topic: "Esteri",
    duration: "33:30",
    date: "",
    description: "",
    image: ytEpsteinCover,
    youtubeId: "Zin-fzepPpI",
  },
  {
    id: "yt-russia",
    type: "YouTube",
    show: "Factanza Media",
    title: "Il complotto che ha cancellato la vera storia",
    topic: "Cultura",
    duration: "17:52",
    date: "",
    description: "",
    image: ytRussiaCover,
    youtubeId: "wzfcbwfV8TA",
  },
  {
    id: "yt-finger-pinch",
    type: "YouTube",
    show: "Factanza Media",
    title: "Perché questo gesto è offensivo? Finger Pinch e altri complotti",
    topic: "Trend",
    duration: "13:44",
    date: "",
    description: "",
    image: ytFingerPinchCover,
    youtubeId: "5R4swijVfv8",
  },
  {
    id: "yt-transvestigation",
    type: "YouTube",
    show: "Factanza Media",
    title: "I VIP sono persone trans segrete?! “Transvestigation” e altri complotti",
    topic: "Trend",
    duration: "15:01",
    date: "",
    description: "",
    image: ytTransvestigationCover,
    youtubeId: "wQEBTjRMI6w",
  },
  {
    id: "yt-stranger-things",
    type: "YouTube",
    show: "Factanza Media",
    title: "Il complotto dietro a Stranger Things – Montauk Project",
    topic: "Cultura",
    duration: "21:17",
    date: "",
    description: "",
    image: ytStrangerThingsCover,
    youtubeId: "mU5jg0nCTM8",
  },
  {
    id: "yt-pizzagate",
    type: "YouTube",
    show: "Factanza Media",
    title: "I satanisti controllano il mondo? QAnon, Pizzagate e altri complotti",
    topic: "Esteri",
    duration: "18:07",
    date: "",
    description: "",
    image: ytPizzagateCover,
    youtubeId: "6g0vTcUElh0",
  },
  {
    id: "yt-razza-bianca-2",
    type: "YouTube",
    show: "Factanza Media",
    title: "Il complotto che vuole eliminare la “razza bianca” – Ep. 2",
    topic: "Cultura",
    duration: "16:31",
    date: "",
    description: "",
    image: ytRazzaBianca2Cover,
    youtubeId: "YD2lBfidYUc",
  },
  {
    id: "yt-razza-bianca",
    type: "YouTube",
    show: "Factanza Media",
    title: "Il complotto che vuole eliminare la “razza bianca”",
    topic: "Cultura",
    duration: "12:59",
    date: "",
    description: "",
    image: ytRazzaBiancaCover,
    youtubeId: "s0ixgqWQmU8",
  },
  {
    id: "yt-inside-gaza",
    type: "YouTube",
    show: "Factanza Media",
    title: "Inside Gaza – quello che rimane della Striscia di Gaza",
    topic: "Esteri",
    duration: "31:10",
    date: "",
    description: "",
    image: ytInsideGazaCover,
    youtubeId: "c_rqDcY8CDM",
  },
  {
    id: "yt-israele-usa",
    type: "YouTube",
    show: "Factanza Media",
    title: "La vera storia del legame tra Israele e Stati Uniti: sono più che alleati?",
    topic: "Esteri",
    duration: "10:51",
    date: "",
    description: "",
    image: ytIsraeleUsaCover,
    youtubeId: "QxXZgw14EDY",
  },
  {
    id: "yt-iran-israele",
    type: "YouTube",
    show: "Factanza Media",
    title:
      "La storia della rivalità tra Iran e Israele, che molto prima della guerra erano alleati",
    topic: "Esteri",
    duration: "7:26",
    date: "",
    description: "",
    image: ytIranIsraeleCover,
    youtubeId: "WvdYXiriVxs",
  },
];

/** Link per guardare o ascoltare il contenuto originale. */
export function mediaLink(item: MediaItem) {
  if (item.youtubeId) return `https://www.youtube.com/watch?v=${item.youtubeId}`;
  return `https://open.spotify.com/search/${encodeURIComponent(item.title)}`;
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
