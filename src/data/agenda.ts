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
    id: "podcast-tessili",
    date: "2026-11-21",
    time: "07:30",
    kind: "podcast",
    title: "Perché gli operai tessili protestano in Bangladesh?",
    topic: "Esteri",
    mediaId: "tessili",
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
    id: "video-ai",
    date: "2026-11-22",
    time: "12:00",
    kind: "video",
    title: "L’intelligenza artificiale spiegata bene.",
    topic: "AI & Tech",
    mediaId: "video-ai",
  },
  {
    id: "podcast-ai",
    date: "2026-11-23",
    time: "07:30",
    kind: "podcast",
    title: "AI: il futuro è già qui. E noi?",
    topic: "AI & Tech",
    mediaId: "ai",
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
    id: "podcast-cultura",
    date: "2026-11-26",
    time: "07:30",
    kind: "podcast",
    title: "La cultura non è un lusso.",
    topic: "Cultura",
    mediaId: "cultura",
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
    id: "video-clima",
    date: "2026-11-28",
    time: "12:00",
    kind: "video",
    title: "Il clima cambia. E noi?",
    topic: "Ambiente",
    mediaId: "video-clima",
  },
];

export const agendaKindLabel: Record<AgendaKind, string> = {
  live: "LIVE",
  podcast: "PODCAST",
  video: "VIDEO",
  evento: "EVENTO",
};
