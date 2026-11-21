import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Check, X, Users, CirclePlay, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AppShell, SectionTitle, pageHead } from "@/components/factanza/shared";
import { Onboarding } from "@/components/factanza/onboarding";
import { Welcome } from "@/components/factanza/welcome";
import { useFactanza } from "@/components/factanza/context";
import { NewsCard } from "@/components/factanza/news-card";
import { suggestedNews } from "@/lib/recommend";
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
  const { user, ready, vote, session, track } = useFactanza();
  const [feed, setFeed] = useState<"temi" | "perte">("temi");
  if (!ready) return <div className="phone" />;
  if (!session) return <Welcome />;
  if (!user.onboarded) return <Onboarding />;

  const choice = user.votes["daily"];
  // "Tutti" sempre per primo, poi solo i temi scelti (tutti, se non ne è stato scelto nessuno).
  const chosen = categories.filter((category) => user.interests.includes(category.name));
  const stories = [allCategory, ...(chosen.length ? chosen : categories)];
  const byDate = [...news].sort((a, b) => b.date.localeCompare(a.date));
  // "I tuoi temi": notizie degli argomenti scelti (tutte, se non ne è stato scelto nessuno).
  const mine = byDate.filter(
    (item) => !user.interests.length || user.interests.includes(item.topic),
  );
  // "Per te": suggerimenti su altri argomenti, dalle notizie più discusse.
  const suggested = suggestedNews(byDate, user.interests);
  const displayed = feed === "temi" ? mine : suggested;

  return (
    <AppShell>
      <div className="stories" aria-label="Categorie">
        {stories.map((category) => (
          <Link
            key={category.slug}
            to="/categoria/$category"
            params={{ category: category.slug }}
            className="story"
            onClick={() => track("category_open", { slug: category.slug })}
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

        {user.birthYear === null && (
          <div className="profile-nudge">
            <div className="flex-1">
              <strong>Parlaci di te</strong>
              <p>Anno di nascita, città, cosa fai: bastano 20 secondi.</p>
            </div>
            <Button variant="sticker" size="sm" asChild>
              <Link to="/profilo" onClick={() => track("profile_nudge", {})}>
                Completa
              </Link>
            </Button>
          </div>
        )}

        <SectionTitle first="Le tue" second="NOTIZIE" />
        <div className="tabs" role="tablist" aria-label="Notizie">
          <Button
            variant="ghost"
            role="tab"
            aria-selected={feed === "temi"}
            className={feed === "temi" ? "selected" : ""}
            onClick={() => {
              setFeed("temi");
              track("feed_tab", { tab: "temi" });
            }}
          >
            <Heart />I tuoi temi
          </Button>
          <Button
            variant="ghost"
            role="tab"
            aria-selected={feed === "perte"}
            className={feed === "perte" ? "selected" : ""}
            onClick={() => {
              setFeed("perte");
              track("feed_tab", { tab: "perte" });
            }}
          >
            <Sparkles />
            Per te
          </Button>
        </div>
        <p className="feed-hint">
          {feed === "temi" ? (
            user.interests.length ? (
              <>Le notizie degli argomenti che hai scelto.</>
            ) : (
              <>
                Non hai ancora scelto argomenti: le vedi tutte.{" "}
                <Link to="/profilo">Scegli i tuoi temi</Link>
              </>
            )
          ) : (
            <>Suggerite per te: le più discusse dalla community su altri argomenti.</>
          )}
        </p>
        {displayed.length === 0 && (
          <p className="body-copy">
            {feed === "temi"
              ? "Le prossime notizie sui tuoi temi stanno arrivando. Intanto guarda la scheda «Per te»."
              : "Hai scelto tutti gli argomenti: le notizie sono già nella scheda «I tuoi temi»."}
          </p>
        )}
        {displayed.map((item, index) => (
          <NewsCard key={item.id} item={item} feed={feed} position={index + 1} />
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
