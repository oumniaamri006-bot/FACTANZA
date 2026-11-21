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
import { pollResults } from "@/lib/poll";

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
  const choice = user.votes[voteId];
  const results = pollResults(voteId, article.poll.options, choice);
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
          <span className="sticker small yellow">SONDAGGIO · ORA TOCCA A TE</span>
          <h2 id="article-poll-title">{article.poll.question}</h2>
          {choice ? (
            <div aria-label="Risultati del sondaggio">
              {article.poll.options.map((option, index) => (
                <div key={option}>
                  <div className="result-row">
                    <span>
                      {option} {option === choice && "✓"}
                    </span>
                    <strong>{results[index]}%</strong>
                  </div>
                  <div className="vote-bar">
                    <div
                      className={`vote-fill ${option === choice ? "" : "other"}`}
                      style={{ width: `${results[index]}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="hand mt-2">(ogni voce conta, anche la tua)</p>
              <p className="demo-label">Percentuali simulate per la demo.</p>
            </div>
          ) : (
            <div className="poll-options">
              {article.poll.options.map((option) => (
                <Button key={option} variant="facta" onClick={() => vote(voteId, option)}>
                  {option}
                </Button>
              ))}
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
