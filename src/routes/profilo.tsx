import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  BookOpen,
  Check,
  CirclePlay,
  Download,
  Headphones,
  KeyRound,
  LogOut,
  RotateCcw,
  Settings,
  Trash2,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AppShell,
  Avatar,
  CategoryIcon,
  SectionTitle,
  pageHead,
} from "@/components/factanza/shared";
import { Onboarding } from "@/components/factanza/onboarding";
import { useFactanza } from "@/components/factanza/context";
import { AboutYouFields } from "@/components/factanza/about-you";
import { topics, dailyQuestion, formats } from "@/data/factanza";
import { news } from "@/data/news";
import { digitalConsentAge, isMinorForConsent } from "@/data/profile-options";
import { toggleValue } from "@/lib/factanza-state";
import { usePollResults } from "@/lib/reading";
import { authErrorMessage, getSupabase } from "@/lib/supabase";

type Tab = "profilo" | "impostazioni";

export const Route = createFileRoute("/profilo")({
  validateSearch: (search: Record<string, unknown>): { tab?: Tab } =>
    search["tab"] === "impostazioni" ? { tab: "impostazioni" } : {},
  head: () =>
    pageHead(
      "Profilo e impostazioni",
      "Il tuo profilo Factanza: interessi, risposte, notifiche, privacy e account.",
    ),
  component: Profile,
});

const formatIcons = [BookOpen, CirclePlay, Headphones];

/** Domanda e risposte possibili di un voto salvato, per mostrare i risultati reali. */
function pollInfo(id: string) {
  if (id === "daily") return { question: dailyQuestion, options: ["Sì", "No"] };
  if (id.startsWith("article-")) {
    const article = news.find((item) => `article-${item.id}` === id);
    return {
      question: article?.poll.question ?? "Sondaggio di un articolo",
      options: article?.poll.options ?? [],
    };
  }
  if (id.startsWith("before-"))
    return { question: "Il tuo voto prima del live", options: ["Sì", "No", "Non so"] };
  if (id.startsWith("after-"))
    return { question: "Il tuo voto dopo il live", options: ["Sì", "No", "Non so"] };
  return { question: "Sondaggio durante il live", options: ["Sì", "Non ancora"] };
}

function VoteRow({ id, choice }: { id: string; choice: string }) {
  const { question, options } = pollInfo(id);
  const results = usePollResults(id, options, choice);
  const index = options.indexOf(choice);
  return (
    <div className="vote-row">
      <h3>{question}</h3>
      <p>
        La tua risposta: <strong>{choice}</strong>
      </p>
      {index >= 0 && (
        <p className="hand">
          {results.total <= 1
            ? "(sei tra i primi a rispondere)"
            : `(come il ${results.percents[index]}% della community · ${results.total} voti)`}
        </p>
      )}
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="settings-group" aria-label={title}>
      <h2>{title}</h2>
      <div className="settings-card">{children}</div>
    </section>
  );
}

function ChangePassword() {
  const { notify } = useFactanza();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirm) {
      setError("Le due password non coincidono.");
      return;
    }
    const supabase = getSupabase();
    if (!supabase) return;
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError(authErrorMessage(updateError.message));
      return;
    }
    setOpen(false);
    setPassword("");
    setConfirm("");
    setError("");
    notify("Password aggiornata.");
  };

  if (!open)
    return (
      <Button variant="facta" className="w-full" onClick={() => setOpen(true)}>
        <KeyRound />
        Cambia password
      </Button>
    );
  return (
    <form className="auth-form" onSubmit={submit}>
      <label className="auth-field">
        <span>Nuova password</span>
        <input
          id="new-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          minLength={6}
          placeholder="Almeno 6 caratteri"
        />
      </label>
      <label className="auth-field">
        <span>Ripeti la password</span>
        <input
          id="confirm-password"
          type="password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          autoComplete="new-password"
        />
      </label>
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <Button type="button" variant="facta" className="flex-1" onClick={() => setOpen(false)}>
          Annulla
        </Button>
        <Button
          type="submit"
          variant="sticker"
          className="flex-1"
          disabled={busy || password.length < 6}
        >
          {busy ? "Salvo…" : "Salva"}
        </Button>
      </div>
    </form>
  );
}

function Profile() {
  const { tab = "profilo" } = Route.useSearch();
  const { user, update, logout, session, track, notify } = useFactanza();
  const minor = isMinorForConsent(user.birthYear);
  const [redo, setRedo] = useState(false);
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const setTab = (next: Tab) =>
    void navigate({
      to: "/profilo",
      search: next === "impostazioni" ? { tab: next } : {},
      replace: true,
    });

  const deleteAccount = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    setDeleting(true);
    const { error } = await supabase.rpc("delete_my_account");
    setDeleting(false);
    if (error) {
      notify("Non è stato possibile eliminare l’account: riprova.");
      return;
    }
    await logout({ accountDeleted: true });
    void navigate({ to: "/" });
  };

  if (redo) return <Onboarding redo onDone={() => setRedo(false)} />;

  const download = () => {
    const data = { email: session?.user.email, ...user };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "factanza-i-miei-dati.json";
    link.click();
    URL.revokeObjectURL(url);
  };
  const votes = Object.entries(user.votes);

  return (
    <AppShell>
      <div className="page-content">
        <div className="profile-card">
          <Avatar name={user.name} size="lg" />
          <div className="min-w-0">
            <h1>{user.name || "Facta Lover"}</h1>
            {session?.user.email && <p className="profile-email">{session.user.email}</p>}
            <p className="profile-stats">
              {user.interests.length} temi · {votes.length}{" "}
              {votes.length === 1 ? "risposta" : "risposte"} · {user.reminders.length} promemoria
            </p>
          </div>
        </div>

        <div className="tabs" role="tablist" aria-label="Profilo">
          <Button
            variant="ghost"
            role="tab"
            aria-selected={tab === "profilo"}
            className={tab === "profilo" ? "selected" : ""}
            onClick={() => setTab("profilo")}
          >
            <UserRound />
            Il mio profilo
          </Button>
          <Button
            variant="ghost"
            role="tab"
            aria-selected={tab === "impostazioni"}
            className={tab === "impostazioni" ? "selected" : ""}
            onClick={() => setTab("impostazioni")}
          >
            <Settings />
            Impostazioni
          </Button>
        </div>

        {tab === "profilo" ? (
          <>
            <label htmlFor="name" className="eyebrow">
              Il tuo nome
            </label>
            <input
              id="name"
              className="profile-name"
              value={user.name}
              onChange={(e) => update({ name: e.target.value })}
              maxLength={30}
            />

            <SectionTitle first="Su" second="DI TE" color="lime" />
            <AboutYouFields
              idPrefix="profile"
              value={{
                birthYear: user.birthYear,
                region: user.region,
                occupation: user.occupation,
                gender: user.gender,
                referral: user.referral,
              }}
              onChange={(patch) => {
                // Sotto i 14 anni le statistiche d'uso si spengono.
                const minorNow =
                  patch.birthYear !== undefined && isMinorForConsent(patch.birthYear ?? null);
                update(minorNow ? { ...patch, analytics: false } : patch);
              }}
            />

            <SectionTitle first="I tuoi" second="INTERESSI" color="lilac" />
            <div className="interest-grid">
              {topics.map((topic) => {
                const picked = user.interests.includes(topic);
                return (
                  <button
                    type="button"
                    key={topic}
                    className={`interest-icon ${picked ? "picked" : ""}`}
                    aria-pressed={picked}
                    aria-label={topic}
                    onClick={() => {
                      update({ interests: toggleValue(user.interests, topic) });
                      track("interests_change", { topic, on: !picked });
                    }}
                  >
                    <CategoryIcon topic={topic} />
                    {picked && (
                      <span className="interest-check" aria-hidden>
                        <Check />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <Button variant="facta" className="w-full" onClick={() => setRedo(true)}>
              <RotateCcw />
              Rifai lo swipe
            </Button>

            <SectionTitle first="Tu vs" second="LA COMMUNITY" color="yellow" />
            {votes.length ? (
              votes.map(([id, choice]) => <VoteRow key={id} id={id} choice={choice} />)
            ) : (
              <p className="body-copy">La tua prima risposta sarà l’inizio del confronto.</p>
            )}
          </>
        ) : (
          <>
            <SettingsGroup title="Come ti informi">
              <div className="format-chips">
                {formats.map((format, index) => {
                  const Icon = formatIcons[index] ?? BookOpen;
                  const picked = user.formats.includes(format);
                  return (
                    <Button
                      key={format}
                      variant="facta"
                      className={picked ? "picked" : ""}
                      aria-pressed={picked}
                      onClick={() => update({ formats: toggleValue(user.formats, format) })}
                    >
                      <Icon />
                      {format}
                    </Button>
                  );
                })}
              </div>
            </SettingsGroup>

            <SettingsGroup title="Notifiche">
              <div className="settings-row">
                <label htmlFor="notifications">Avvisi su live, eventi e community</label>
                <Switch
                  id="notifications"
                  checked={user.notifications}
                  onCheckedChange={(notifications) => update({ notifications })}
                />
              </div>
            </SettingsGroup>

            <SettingsGroup title="Privacy">
              <div className="settings-row">
                <label htmlFor="analytics">
                  Statistiche d’uso anonime (tempo di lettura, tocchi, dispositivo)
                  {minor && (
                    <span className="block text-xs mt-1">
                      Non disponibili sotto i {digitalConsentAge} anni.
                    </span>
                  )}
                </label>
                <Switch
                  id="analytics"
                  checked={user.analytics && !minor}
                  disabled={minor}
                  onCheckedChange={(analytics) => update({ analytics })}
                />
              </div>
              <p className="settings-note">
                Le risposte ai sondaggi si usano solo in forma anonima e aggregata. Non vendiamo mai
                i dati del singolo. <Link to="/privacy">Leggi l’informativa privacy</Link>
              </p>
            </SettingsGroup>

            <SettingsGroup title="Account">
              {session?.user.email && (
                <p className="settings-note">
                  Accedi con <strong>{session.user.email}</strong>
                </p>
              )}
              <ChangePassword />
              <Button variant="facta" className="w-full" onClick={download}>
                <Download />
                Scarica i miei dati
              </Button>
              <Button
                variant="facta"
                className="w-full"
                onClick={() => {
                  void logout();
                  void navigate({ to: "/" });
                }}
              >
                <LogOut />
                Esci
              </Button>
            </SettingsGroup>

            <div className="danger-zone">
              {!confirmDelete ? (
                <Button variant="facta" className="w-full" onClick={() => setConfirmDelete(true)}>
                  <Trash2 />
                  Elimina il mio account
                </Button>
              ) : (
                <>
                  <p className="body-copy">
                    Eliminiamo account, profilo, voti, promemoria e statistiche. Non si può
                    annullare.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="facta"
                      className="flex-1"
                      onClick={() => setConfirmDelete(false)}
                    >
                      Annulla
                    </Button>
                    <Button
                      variant="facta"
                      className="flex-1 danger"
                      disabled={deleting}
                      onClick={() => void deleteAccount()}
                    >
                      {deleting ? "Elimino…" : "Elimina per sempre"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
