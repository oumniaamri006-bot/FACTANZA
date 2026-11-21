import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Flame } from "lucide-react";
import type { news } from "@/data/news";
import { CategoryIcon } from "./shared";

export function NewsCard({ item }: { item: (typeof news)[number] }) {
  const [before] = item.title.split(item.accent);
  return (
    <Link to="/notizia" search={{ id: item.id }} className="news-link">
      <article className="news-card">
        <div className="news-image">
          <img src={item.image} alt="" />
          <span className="topic-tag">{item.topic.toUpperCase()}</span>
          <CategoryIcon topic={item.topic} className="news-badge" />
          <h3 className="news-headline">
            <span>
              {before}
              <mark>{item.accent}</mark>
            </span>
          </h3>
        </div>
        <div className="news-footer">
          <span>{item.minutes} min di lettura</span>
          <span className="news-opinions">
            <Flame size={13} className="text-magenta" /> {item.opinions} opinioni{" "}
            <ArrowUpRight size={17} />
          </span>
        </div>
      </article>
    </Link>
  );
}
