import aiTech from "@/assets/categorie/ai-tech.png";
import politica from "@/assets/categorie/politica.png";
import economia from "@/assets/categorie/economia.png";
import trend from "@/assets/categorie/trend.png";
import cultura from "@/assets/categorie/cultura.png";
import ambiente from "@/assets/categorie/ambiente.png";
import esteri from "@/assets/categorie/esteri.png";
import lavoro from "@/assets/categorie/lavoro.png";
import salute from "@/assets/categorie/salute.png";
import tutti from "@/assets/categorie/tutti.png";
import { news } from "./news";

/**
 * Catalogo unico delle categorie: slug, nome visibile e icona pop-art.
 * Tutte le icone vengono dallo stesso set illustrato (src/assets/categorie),
 * scontornate e centrate su una tela trasparente 320×320 (Trend è disegnata nello stesso stile).
 */
export const categories = [
  { slug: "ai-tech", name: "AI & Tech", icon: aiTech },
  { slug: "politica", name: "Politica", icon: politica },
  { slug: "economia", name: "Economia", icon: economia },
  { slug: "cultura", name: "Cultura", icon: cultura },
  { slug: "ambiente", name: "Ambiente", icon: ambiente },
  { slug: "esteri", name: "Esteri", icon: esteri },
  { slug: "lavoro", name: "Lavoro", icon: lavoro },
  { slug: "salute", name: "Salute", icon: salute },
  { slug: "trend", name: "Trend", icon: trend },
];

export type Category = (typeof categories)[number];

/** Voce speciale che raccoglie tutte le notizie (`/categoria/tutte`). */
export const allCategory = { slug: "tutte", name: "Tutti", icon: tutti };

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getCategoryByName(name: string) {
  return categories.find((category) => category.name === name);
}

export function getCategoryNews(slug: string) {
  if (slug === allCategory.slug) return news;
  const category = getCategory(slug);
  return category ? news.filter((article) => article.topic === category.name) : [];
}
