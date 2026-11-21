import { getSupabase } from "./supabase";

/** Evento d'uso registrato in `public.events` (solo con consenso, vedi FactanzaProvider). */
export type TrackedEvent = {
  name: string;
  path: string;
  props: Record<string, string | number | boolean>;
};

let queue: (TrackedEvent & { session_id: string })[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

/** Identificativo della visita (una scheda del browser), senza dati personali. */
export function sessionId() {
  try {
    const saved = sessionStorage.getItem("factanza-session");
    if (saved) return saved;
    const created = crypto.randomUUID();
    sessionStorage.setItem("factanza-session", created);
    return created;
  } catch {
    return "nosession-" + Math.random().toString(36).slice(2, 12);
  }
}

export function queueEvent(event: TrackedEvent) {
  queue.push({ ...event, session_id: sessionId() });
  if (queue.length >= 20) void flushEvents();
  else if (!timer) timer = setTimeout(() => void flushEvents(), 5000);
}

export async function flushEvents() {
  if (timer) clearTimeout(timer);
  timer = null;
  const batch = queue;
  queue = [];
  const supabase = getSupabase();
  if (!supabase || batch.length === 0) return;
  await supabase.from("events").insert(batch);
}

/** Etichetta leggibile dell'elemento toccato (mai il testo scritto dall'utente). */
export function tapLabel(target: EventTarget | null) {
  if (!(target instanceof Element)) return undefined;
  const element = target.closest("[aria-label], button, a, [role='tab']");
  if (!element) return undefined;
  const label = element.getAttribute("aria-label") ?? element.textContent ?? "";
  return label.replace(/\s+/g, " ").trim().slice(0, 60) || undefined;
}
