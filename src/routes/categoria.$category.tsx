import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell, Back, SectionTitle, pageHead } from "@/components/factanza/shared";
import { NewsCard } from "@/components/factanza/news-card";
import { allCategory, getCategory, getCategoryNews } from "@/data/categories";

export const Route = createFileRoute("/categoria/$category")({
  beforeLoad: ({ params }) => {
    if (params.category !== allCategory.slug && !getCategory(params.category)) throw notFound();
  },
  head: ({ params }) => {
    const name = getCategory(params.category)?.name ?? "Tutte le notizie";
    return pageHead(
      `${name} — Notizie`,
      `Tutte le notizie di ${name} su Factanza: scopri gli articoli e partecipa ai sondaggi.`,
    );
  },
  component: Category,
});

function Category() {
  const { category: slug } = Route.useParams();
  const category = getCategory(slug);
  const articles = getCategoryNews(slug);
  const icon = category?.icon ?? allCategory.icon;

  return (
    <AppShell>
      <div className="page-content">
        <Back />
        <div className="category-cover pop-bg">
          <img src={icon} alt={`Icona ${category?.name ?? "Tutti"}`} />
        </div>
        <SectionTitle
          first={category ? "Le notizie di" : "Tutte le"}
          second={category?.name.toUpperCase() ?? "NOTIZIE"}
          color="yellow"
        />
        <p className="body-copy mb-6">
          {articles.length} {articles.length === 1 ? "notizia" : "notizie"}
        </p>
        {articles.map((item, index) => (
          <NewsCard key={item.id} item={item} feed={`categoria:${slug}`} position={index + 1} />
        ))}
        {articles.length === 0 && (
          <p className="body-copy">Non ci sono ancora notizie in questa categoria.</p>
        )}
        <p className="demo-label">Edizione hackathon · notizie dimostrative</p>
      </div>
    </AppShell>
  );
}
