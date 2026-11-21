/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL del progetto Supabase (es. https://xxxx.supabase.co). */
  readonly VITE_SUPABASE_URL?: string;
  /** Chiave pubblica (publishable) di Supabase: sicura nel browser, i dati sono protetti da RLS. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}
