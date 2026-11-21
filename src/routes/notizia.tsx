import { createFileRoute } from "@tanstack/react-router";
import { Share2 } from "lucide-react";
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
    pageHead("La notizia, spiegata bene", "Leggi la notizia e partecipa al sondaggio finale."),
  component: Article,
});

function Article() {
  const { id } = Route.useSearch();
  const article = news.find((item) => item.id === id) ?? news[0];
  const { user, vote, notify } = useFactanza();
  if (!article) return null;

  const voteId = `article-${article.id}`;
  // Testo completo se c'è, altrimenti i punti chiave della notizia.
  const paragraphs = article.body ?? article.slides;

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

        <section className="article-body" aria-label="Testo della notizia">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </section>

        <section className="article-poll" aria-labelledby="article-poll-title">
          <span className="sticker small yellow">ORA TOCCA A TE</span>
          <h2 id="article-poll-title">Questa notizia ti riguarda?</h2>
          {user.votes[voteId] ? (
            <>
              <p>
                Hai risposto: <strong>{user.votes[voteId]}</strong>
              </p>
              <p className="hand mt-4">(ogni voce conta, anche la tua)</p>
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
        </section>

        {article.source && <p className="demo-label mb-5">Fonte: {article.source}</p>}
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
