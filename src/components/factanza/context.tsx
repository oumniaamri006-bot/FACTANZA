import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import { initialUser, storageKey, type UserState } from "@/lib/factanza-state";
import { getSupabase, type ProfileRow } from "@/lib/supabase";
import { flushEvents, queueEvent, tapLabel, type TrackedEvent } from "@/lib/analytics";
import { topics } from "@/data/factanza";

type StateContext = {
  user: UserState;
  /** true quando sappiamo se c'è una sessione e, se c'è, i dati sono caricati. */
  ready: boolean;
  session: Session | null;
  update: (patch: Partial<UserState>) => void;
  vote: (id: string, choice: string) => void;
  notify: (text: string) => void;
  logout: () => Promise<void>;
  /** Registra un evento d'uso, solo se l'utente ha dato il consenso alle statistiche. */
  track: (name: string, props?: TrackedEvent["props"]) => void;
};

const Context = createContext<StateContext | null>(null);

/** Campi del profilo salvati nella tabella `profiles`. */
const profileColumns = {
  name: "name",
  interests: "interests",
  formats: "formats",
  onboarded: "onboarded",
  analytics: "analytics_consent",
  notifications: "notifications",
} as const satisfies Partial<Record<keyof UserState, keyof ProfileRow>>;

function fromRows(
  profile: ProfileRow | null,
  votes: { poll_id: string; choice: string }[],
  reminders: { item_id: string }[],
): UserState {
  return {
    ...initialUser,
    ...(profile && {
      name: profile.name,
      // Scarta temi che non esistono più (es. Sport e Moda, rimossi dal catalogo).
      interests: profile.interests.filter((topic) => topics.includes(topic)),
      formats: profile.formats,
      onboarded: profile.onboarded,
      analytics: profile.analytics_consent,
      notifications: profile.notifications,
    }),
    votes: Object.fromEntries(votes.map((row) => [row.poll_id, row.choice])),
    reminders: reminders.map((row) => row.item_id),
  };
}

export function FactanzaProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(initialUser);
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const userRef = useRef(user);
  userRef.current = user;
  const pendingProfile = useRef<Partial<ProfileRow>>({});
  const profileTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { pathname } = useLocation();

  const userId = session?.user.id ?? null;
  const ready = authChecked && (userId === null || loadedFor === userId);

  // Sessione: letta dal browser e aggiornata a ogni accesso o uscita.
  useEffect(() => {
    try {
      localStorage.removeItem(storageKey); // stato della vecchia demo solo-browser
    } catch {
      // nessun problema
    }
    const supabase = getSupabase();
    if (!supabase) {
      setAuthChecked(true);
      return;
    }
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthChecked(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  // Dati dell'utente: profilo, voti e promemoria.
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !userId) {
      setUser(initialUser);
      return;
    }
    let cancelled = false;
    void (async () => {
      const [profile, votes, reminders] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle<ProfileRow>(),
        supabase.from("votes").select("poll_id, choice"),
        supabase.from("reminders").select("item_id"),
      ]);
      if (cancelled) return;
      if (profile.error || votes.error || reminders.error) {
        setToast("Non riesco a caricare i tuoi dati: controlla la connessione.");
      }
      setUser(fromRows(profile.data ?? null, votes.data ?? [], reminders.data ?? []));
      setLoadedFor(userId);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const saveProfile = useCallback(async () => {
    profileTimer.current = null;
    const patch = pendingProfile.current;
    pendingProfile.current = {};
    const supabase = getSupabase();
    if (!supabase || !userId || Object.keys(patch).length === 0) return;
    const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
    if (error) setToast("Non riesco a salvare le modifiche: riprova.");
  }, [userId]);

  const update = useCallback(
    (patch: Partial<UserState>) => {
      const previous = userRef.current;
      setUser((current) => ({ ...current, ...patch }));
      const supabase = getSupabase();
      if (!supabase || !userId) return;

      // Profilo: il nome si salva dopo una breve pausa di scrittura, il resto subito.
      const changes: Partial<ProfileRow> = {};
      for (const [field, column] of Object.entries(profileColumns)) {
        const value = patch[field as keyof typeof profileColumns];
        if (value !== undefined) Object.assign(changes, { [column]: value });
      }
      if (Object.keys(changes).length) {
        Object.assign(pendingProfile.current, changes);
        if (profileTimer.current) clearTimeout(profileTimer.current);
        const onlyName = Object.keys(changes).every((key) => key === "name");
        if (onlyName) profileTimer.current = setTimeout(() => void saveProfile(), 600);
        else void saveProfile();
      }

      // Promemoria: si salvano solo le differenze.
      if (patch.reminders) {
        const added = patch.reminders.filter((id) => !previous.reminders.includes(id));
        const removed = previous.reminders.filter((id) => !patch.reminders?.includes(id));
        if (added.length)
          void supabase.from("reminders").insert(added.map((item_id) => ({ item_id })));
        if (removed.length) void supabase.from("reminders").delete().in("item_id", removed);
      }
    },
    [userId, saveProfile],
  );

  const track = useCallback(
    (name: string, props: TrackedEvent["props"] = {}) => {
      if (!userId || !userRef.current.analytics) return;
      queueEvent({ name, path: window.location.pathname, props });
    },
    [userId],
  );

  const vote = useCallback(
    (id: string, choice: string) => {
      setUser((current) => ({ ...current, votes: { ...current.votes, [id]: choice } }));
      const supabase = getSupabase();
      if (!supabase || !userId) return;
      void supabase
        .from("votes")
        .upsert({ poll_id: id, choice }, { onConflict: "user_id,poll_id" })
        .then(({ error }) => {
          if (error) setToast("Il tuo voto non è stato salvato: riprova.");
        });
      // Nelle statistiche registriamo che hai votato, mai cosa hai votato.
      track("poll_vote", { poll_id: id });
    },
    [userId, track],
  );

  const logout = useCallback(async () => {
    await flushEvents();
    await getSupabase()?.auth.signOut();
    setUser(initialUser);
  }, []);

  // Statistiche: pagine viste e tocchi (per la heatmap), solo con consenso.
  useEffect(() => {
    if (ready && userId) track("page_view");
  }, [pathname, ready, userId, track]);

  useEffect(() => {
    if (!userId || !user.analytics) return;
    const onTap = (event: PointerEvent) => {
      const phone = document.querySelector(".phone");
      if (!phone) return;
      const box = phone.getBoundingClientRect();
      const x = Math.round(((event.clientX - box.left) / box.width) * 100);
      const y = Math.round(event.clientY - box.top);
      const label = tapLabel(event.target);
      track("tap", { x: Math.min(100, Math.max(0, x)), y, ...(label && { label }) });
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") void flushEvents();
    };
    document.addEventListener("pointerdown", onTap, { passive: true });
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("pointerdown", onTap);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [userId, user.analytics, track]);

  return (
    <Context.Provider
      value={{ user, ready, session, update, vote, notify: setToast, logout, track }}
    >
      {children}
      {toast && (
        <div role="status" className="toast">
          {toast}
        </div>
      )}
    </Context.Provider>
  );
}

export function useFactanza() {
  const context = useContext(Context);
  if (!context) throw new Error("Factanza provider missing");
  return context;
}
