import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;

/** Client Supabase, solo nel browser (in SSR restituisce null). */
export function getSupabase() {
  if (typeof window === "undefined" || !url || !key) return null;
  client ??= createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: "factanza-auth" },
    // keepalive: le statistiche inviate mentre si chiude la pagina arrivano comunque.
    global: { fetch: (input, init) => fetch(input, { ...init, keepalive: true }) },
  });
  return client;
}

export type ProfileRow = {
  id: string;
  name: string;
  interests: string[];
  formats: string[];
  onboarded: boolean;
  analytics_consent: boolean;
  notifications: boolean;
  birth_year: number | null;
  region: string | null;
  occupation: string | null;
  gender: string | null;
  referral: string | null;
  last_seen_at: string | null;
};

/** Traduce gli errori di Supabase Auth in messaggi in italiano. */
export function authErrorMessage(message: string) {
  const text = message.toLowerCase();
  if (text.includes("invalid login credentials")) return "Email o password non corretti.";
  if (text.includes("already registered") || text.includes("already been registered"))
    return "Esiste già un account con questa email: accedi.";
  if (text.includes("password should be at least") || text.includes("weak password"))
    return "La password deve avere almeno 6 caratteri.";
  if (text.includes("valid email") || text.includes("invalid format"))
    return "Controlla l’indirizzo email.";
  if (text.includes("rate limit") || text.includes("too many"))
    return "Troppi tentativi: riprova tra qualche minuto.";
  if (text.includes("fetch") || text.includes("network"))
    return "Connessione assente: riprova tra poco.";
  return "Qualcosa non ha funzionato: riprova.";
}
