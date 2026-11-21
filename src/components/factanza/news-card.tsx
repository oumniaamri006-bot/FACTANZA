import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Flame } from "lucide-react";
import type { NewsItem } from "@/data/news";
import { TopicCover } from "./shared";
import { shortDate } from "@/lib/dates";

/** Titolo con la parte `accent` evidenziata, ovunque si trovi nel titolo. */
export function AccentTitle({ item }: { item: NewsItem }) {
  const index = item.title.indexOf(item.accent);
  if (index < 0) return <>{item.title}</>;
  return (
    <>
      {item.title.slice(0, index)}
      <mark>{item.accent}</mark>
      {item.title.slice(index + item.accent.length)}
    </>
  );
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link to="/notizia" search={{ id: item.id }} className="news-link">
      <article className={`news-card ${item.image ? "has-photo" : ""}`}>
        <div className="news-image">
          {item.image ? (
            <img className="news-photo" src={item.image} alt="" loading="lazy" />
          ) : (
            <TopicCover topic={item.topic} />
          )}
          <span className="topic-tag">{item.topic.toUpperCase()}</span>
          {!item.image && (
            <h3 className="news-headline">
              <span>
                <AccentTitle item={item} />
              </span>
            </h3>
          )}
        </div>
        {item.image && (
          <h3 className="news-title">
            <AccentTitle item={item} />
          </h3>
        )}
        <div className="news-footer">
          <span>
            {shortDate(item.date)} · {item.minutes} min di lettura
          </span>
          <span className="news-opinions">
            <Flame size={13} className="text-magenta" /> {item.opinions} opinioni{" "}
            <ArrowUpRight size={17} />
          </span>
        </div>
      </article>
    </Link>
  );
}
