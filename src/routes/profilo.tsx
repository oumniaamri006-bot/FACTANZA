import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, RotateCcw, Download, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AppShell, CategoryIcon, SectionTitle, pageHead } from "@/components/factanza/shared";
import { Onboarding } from "@/components/factanza/onboarding";
import { useFactanza } from "@/components/factanza/context";
import { topics, dailyQuestion } from "@/data/factanza";
import { news } from "@/data/news";
import { toggleValue } from "@/lib/factanza-state";
import { AboutYouFields } from "@/components/factanza/about-you";
import { usePollResults } from "@/lib/reading";
import { getSupabase } from "@/lib/supabase";
import { digitalConsentAge, isMinorForConsent } from "@/data/profile-options";

export const Route = createFileRoute("/profilo")({
  head: () =>
    pageHead(
      "Area personale — La tua voce",
      "Gestisci interessi, risposte e preferenze di privacy nella tua area Factanza.",
    ),
  component: Profile,
});

function questionName(id: string) {
  if (id === "daily") return dailyQuestion;
  if (id.startsWith("article-"))
    return (
      news.find((article) => `article-${article.id}` === id)?.poll.question ?? "Sondaggio articolo"
    );
  if (id.startsWith("before-")) return "Il tuo voto prima del live";
  if (id.startsWith("after-")) return "Il tuo voto dopo il live";
  return "Sondaggio durante il live";
}

function Profile() {
  const { user, update, logout, session, track, notify } = useFactanza();
  const minor = isMinorForConsent(user.birthYear);
  const [redo, setRedo] = useState(false);
  const navigate = useNavigate();
  const daily = usePollResults("daily", ["Sì", "No"], user.votes["daily"]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
    const blob = new Blob([JSON.stringify(user, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "factanza-i-miei-dati.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const votes = Object.entries(user.votes);

  return (
    <AppShell>
      <div className="page-content">
        <SectionTitle first="Questa è" second="LA TUA VOCE." />
        {session?.user.email && (
          <p className="account-email">
            Account: <strong>{session.user.email}</strong>
          </p>
        )}
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
          votes.map(([id, choice]) => (
            <div key={id} className="event">
              <h3 className="text-lg">{questionName(id)}</h3>
              <p className="body-copy">
                La tua risposta: <strong>{choice}</strong>
              </p>
              {id === "daily" ? (
                <p className="hand">
                  (come il {daily.percents[choice === "Sì" ? 0 : 1]}% della community ·{" "}
                  {daily.total} {daily.total === 1 ? "voto" : "voti"})
                </p>
              ) : (
                <p className="demo-label">Risposta salvata · confronto community dimostrativo</p>
              )}
            </div>
          ))
        ) : (
          <p className="body-copy">La tua prima risposta sarà l'inizio del confronto.</p>
        )}

        <SectionTitle first="Privacy" second="E DATI" color="lilac" />
        <p className="body-copy">
          Le tue risposte diventano statistiche anonime e aggregate. Non vendiamo mai i dati del
          singolo.
        </p>
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
        <div className="settings-row">
          <label htmlFor="notifications">Avvisi su live e community</label>
          <Switch
            id="notifications"
            checked={user.notifications}
            onCheckedChange={(notifications) => update({ notifications })}
          />
        </div>
        <p className="demo-label">
          I tuoi dati sono salvati nel tuo account e protetti: solo tu puoi vederli. Le statistiche
          si usano solo in forma aggregata.
        </p>
        <div className="flex flex-col gap-5 mt-7">
          <Button variant="facta" onClick={download}>
            <Download />
            Scarica i miei dati
          </Button>
          <Button
            variant="facta"
            onClick={() => {
              void logout();
              void navigate({ to: "/" });
            }}
          >
            <LogOut />
            Esci
          </Button>
        </div>

        <div className="danger-zone">
          {!confirmDelete ? (
            <Button variant="facta" className="w-full" onClick={() => setConfirmDelete(true)}>
              <Trash2 />
              Elimina il mio account
            </Button>
          ) : (
            <>
              <p className="body-copy">
                Eliminiamo account, profilo, voti, promemoria e statistiche. Non si può annullare.
              </p>
              <div className="flex gap-3 mt-3">
                <Button variant="facta" className="flex-1" onClick={() => setConfirmDelete(false)}>
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
          <Link to="/privacy" className="privacy-link">
            Informativa privacy
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
