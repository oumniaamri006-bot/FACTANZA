import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Check, X, Users, CirclePlay } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AppShell, SectionTitle, pageHead } from "@/components/factanza/shared";
import { Onboarding } from "@/components/factanza/onboarding";
import { useFactanza } from "@/components/factanza/context";
import { NewsCard } from "@/components/factanza/news-card";
import { NewsCalendar } from "@/components/factanza/news-calendar";
import { longDate, uniqueDaysDesc } from "@/lib/dates";
import { useState } from "react";
import { dailyResults } from "@/data/factanza";
import { news } from "@/data/news";
import { allCategory, categories } from "@/data/categories";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Per te — Non solo news",
      "Le notizie che ti interessano, la domanda del giorno e la tua voce nella community.",
    ),
  component: Index,
});

function Index() {
  const { user, ready, vote } = useFactanza();
  const [day, setDay] = useState<string | null>(null);
  if (!ready) return <div className="phone" />;
  if (!user.onboarded) return <Onboarding />;

  const choice = user.votes["daily"];
  // "Tutti" sempre per primo, poi solo i temi scelti (tutti, se non ne è stato scelto nessuno).
  const chosen = categories.filter((category) => user.interests.includes(category.name));
  const stories = [allCategory, ...(chosen.length ? chosen : categories)];
  // Notizie dei temi scelti (tutte, se non ne è stato scelto nessuno), dalla più recente.
  const forYou = news
    .filter((item) => !user.interests.length || user.interests.includes(item.topic))
    .sort((a, b) => b.date.localeCompare(a.date));
  const days = uniqueDaysDesc(forYou.map((item) => item.date));
  const counts = Object.fromEntries(
    days.map((d) => [d, forYou.filter((item) => item.date === d).length]),
  );
  const selectedDay = day && days.includes(day) ? day : null;
  const displayed = selectedDay ? forYou.filter((item) => item.date === selectedDay) : forYou;

  return (
    <AppShell>
      <div className="stories" aria-label="Categorie">
        {stories.map((category) => (
          <Link
            key={category.slug}
            to="/categoria/$category"
            params={{ category: category.slug }}
            className="story"
            aria-label={
              category.slug === allCategory.slug ? "Tutte le notizie" : `Notizie ${category.name}`
            }
          >
            <img src={category.icon} alt="" />
          </Link>
        ))}
        <Link to="/profilo" className="story story-add" aria-label="Aggiungi temi">
          <span className="story-add-circle">
            <Plus />
          </span>
          <span className="story-add-label">AGGIUNGI</span>
        </Link>
      </div>

      <div className="page-content">
        <p className="welcome-row">Il mondo non aspetta. Neanche tu.</p>

        <div className="daily">
          <span className="sticker yellow small today">Le notizie di OGGI</span>
          <div className="eyebrow">La domanda del giorno</div>
          <h2>
            Il voto ai <span className="highlight">16enni</span>
            <br />è una buona idea?
          </h2>
          {!choice ? (
            <div className="vote-actions">
              <Button variant="facta" onClick={() => vote("daily", "Sì")}>
                <Check /> Sì, assolutamente
              </Button>
              <Button variant="facta" onClick={() => vote("daily", "No")}>
                <X /> Direi di no
              </Button>
            </div>
          ) : (
            <div aria-label="Risultati del voto">
              {Object.entries(dailyResults).map(([answer, percent]) => (
                <div key={answer}>
                  <div className="result-row">
                    <span>
                      {answer} {answer === choice && "✓"}
                    </span>
                    <strong>{percent}%</strong>
                  </div>
                  <div className="vote-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      className={`vote-fill ${answer === "No" ? "no" : ""}`}
                    />
                  </div>
                </div>
              ))}
              <p className="hand">(hai votato con il {choice === "Sì" ? 62 : 38}%)</p>
            </div>
          )}
          <div className="daily-footer">
            <span>
              <Users size={12} className="inline mr-1" /> 3.842 hanno detto la loro
            </span>
            <span>21 NOV 2026</span>
          </div>
        </div>

        <SectionTitle first="Scelto" second="PER TE" />
        {days.length > 0 && (
          <NewsCalendar days={days} counts={counts} selected={selectedDay} onSelect={setDay} />
        )}
        {selectedDay && (
          <p className="calendar-label">
            Le notizie del <strong>{longDate(selectedDay)}</strong> · {displayed.length}{" "}
            {displayed.length === 1 ? "notizia" : "notizie"}
          </p>
        )}
        {displayed.length === 0 && (
          <p className="body-copy">
            Le prossime notizie su questo tema stanno arrivando. Nel frattempo, scopri tutti gli
            aggiornamenti.
          </p>
        )}
        {displayed.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}

        <div className="live-banner">
          <div className="flex-1">
            <span className="eyebrow text-lime">Accendi il confronto</span>
            <h3>L’AI ci ruberà il lavoro?</h3>
            <p>Oggi, 18:30 · Dillo in diretta.</p>
          </div>
          <Button variant="sticker" asChild>
            <Link to="/live">
              <CirclePlay /> Live
            </Link>
          </Button>
        </div>
        <p className="demo-label">Edizione hackathon · notizie e statistiche dimostrative</p>
      </div>
    </AppShell>
  );
}
