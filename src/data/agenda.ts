/** Giorno "di oggi" della demo (la domanda del giorno è datata 21 novembre 2026). */
export const demoToday = "2026-11-21";

export type AgendaKind = "live" | "podcast" | "video" | "evento";

export type AgendaItem = {
  id: string;
  /** AAAA-MM-GG */
  date: string;
  time: string;
  kind: AgendaKind;
  title: string;
  topic: string;
  /** Evento live collegato (pagina /evento) o contenuto (podcast/video). */
  eventId?: string;
  mediaId?: string;
};

/** Calendario degli appuntamenti Factanza: dirette, uscite di podcast e video, eventi. */
export const agenda: AgendaItem[] = [
  {
    id: "podcast-gs",
    date: "2026-11-21",
    time: "07:30",
    kind: "podcast",
    title: "Generazione Sospesa: nuova puntata",
    topic: "Lavoro",
  },
  {
    id: "live-ai",
    date: "2026-11-21",
    time: "18:30",
    kind: "live",
    title: "L’AI ruberà più lavori di quanti ne crea?",
    topic: "AI & Tech",
    eventId: "ai",
  },
  {
    id: "video-nuovo-1",
    date: "2026-11-22",
    time: "12:00",
    kind: "video",
    title: "Nuovo video su Factanza Media",
    topic: "Cultura",
  },
  {
    id: "live-voto",
    date: "2026-11-24",
    time: "19:00",
    kind: "live",
    title: "A 16 anni siamo pronti a votare?",
    topic: "Politica",
    eventId: "voto",
  },
  {
    id: "podcast-oriana",
    date: "2026-11-25",
    time: "07:30",
    kind: "podcast",
    title: "Oriana · Unposted: nuovo episodio",
    topic: "Cultura",
  },
  {
    id: "evento-academy",
    date: "2026-11-27",
    time: "18:00",
    kind: "evento",
    title: "Laboratorio: come si verifica una notizia",
    topic: "Cultura",
  },
  {
    id: "video-nuovo-2",
    date: "2026-11-28",
    time: "12:00",
    kind: "video",
    title: "Nuovo video su Factanza Media",
    topic: "Politica",
  },
];

export const agendaKindLabel: Record<AgendaKind, string> = {
  live: "LIVE",
  podcast: "PODCAST",
  video: "VIDEO",
  evento: "EVENTO",
};
