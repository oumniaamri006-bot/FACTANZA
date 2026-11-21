import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import {
  AppShell,
  Back,
  CategoryIcon,
  PageTitle,
  TopicCover,
  pageHead,
} from "@/components/factanza/shared";
import { Button } from "@/components/ui/button";
import { news } from "@/data/news";
import { useFactanza } from "@/components/factanza/context";

export const Route = createFileRoute("/notizia")({
  validateSearch: (search: Record<string, unknown>): { id?: string } =>
    typeof search["id"] === "string" ? { id: search["id"] } : {},
  head: () =>
    pageHead(
      "La notizia, spiegata bene",
      "Scopri la notizia in cinque slide e partecipa al sondaggio finale.",
    ),
  component: Article,
});

const slideTitles = [
  "Il punto.",
  "Un passo indietro.",
  "Cosa cambia?",
  "La vera sfida.",
  "E quindi?",
];
const lastSlide = slideTitles.length; // l'ultima slide è il sondaggio

function Article() {
  const { id } = Route.useSearch();
  const article = news.find((item) => item.id === id) ?? news[0];
  const [slide, setSlide] = useState(0);
  const { user, vote, notify } = useFactanza();
  if (!article) return null;

  const voteId = `article-${article.id}`;
  const goTo = (next: number) => setSlide(Math.max(0, Math.min(lastSlide, next)));

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify("Link della notizia copiato!");
    } catch {
      notify("Copia il link dalla barra degli indirizzi.");
    }
  };

  return (
    <AppShell>
      <div className="page-content">
        <Back />
        <div className="article-topic">
          <CategoryIcon topic={article.topic} />
          <span className="topic-tag">{article.topic.toUpperCase()}</span>
        </div>
        <PageTitle>{article.title}</PageTitle>
        {article.image ? (
          <figure className="article-photo">
            <img src={article.image} alt="" />
            {article.imageCredit && <figcaption>Immagine: {article.imageCredit}</figcaption>}
          </figure>
        ) : (
          <TopicCover topic={article.topic} className="article-cover" />
        )}

        <div
          className="article-slide"
          onTouchStart={(event) => {
            event.currentTarget.dataset["touch"] = String(event.touches[0]?.clientX ?? 0);
          }}
          onTouchEnd={(event) => {
            const delta =
              (event.changedTouches[0]?.clientX ?? 0) -
              Number(event.currentTarget.dataset["touch"] ?? 0);
            if (Math.abs(delta) > 40) goTo(slide + (delta < 0 ? 1 : -1));
          }}
        >
          <span className="sticker small yellow">
            {slide < lastSlide ? "FACCIAMO CHIAREZZA" : "ORA TOCCA A TE"}
          </span>
          {slide < lastSlide ? (
            <>
              <h2>{slideTitles[slide]}</h2>
              <p>{article.slides[slide]}</p>
            </>
          ) : (
            <>
              <h2>Questa notizia ti riguarda?</h2>
              {user.votes[voteId] ? (
                <>
                  <p>
                    Hai risposto: <strong>{user.votes[voteId]}</strong>
                  </p>
                  <p className="hand mt-6">(ogni voce conta, anche la tua)</p>
                </>
              ) : (
                <div className="vote-actions">
                  <Button variant="facta" onClick={() => vote(voteId, "Sì")}>
                    Sì
                  </Button>
                  <Button variant="facta" onClick={() => vote(voteId, "No")}>
                    No
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="slide-controls">
          <Button
            variant="facta"
            size="icon"
            aria-label="Slide precedente"
            disabled={slide === 0}
            onClick={() => goTo(slide - 1)}
          >
            <ChevronLeft />
          </Button>
          <span>
            {slide + 1} / {lastSlide + 1}
          </span>
          <Button
            variant="facta"
            size="icon"
            aria-label="Slide successiva"
            disabled={slide === lastSlide}
            onClick={() => goTo(slide + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
        {article.body && (
          <section className="article-body" aria-labelledby="article-body-title">
            <h2 id="article-body-title" className="subsection-title">
              L’articolo completo
            </h2>
            {article.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </section>
        )}
        <Button variant="facta" className="w-full" onClick={share}>
          <Share2 />
          Condividi la notizia
        </Button>
        <p className="demo-label">
          Articolo dimostrativo · non costituisce una fonte giornalistica
        </p>
      </div>
    </AppShell>
  );
}
