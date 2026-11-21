import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Flame } from "lucide-react";
import type { NewsItem } from "@/data/news";
import { useEffect, useRef } from "react";
import { TopicCover } from "./shared";
import { useFactanza } from "./context";
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

/**
 * Card di una notizia. Con `feed` e `position` registra quando la card è vista (almeno metà
 * visibile per 1 secondo) e quando viene aperta, per calcolare il tasso di click.
 */
export function NewsCard({
  item,
  feed,
  position,
}: {
  item: NewsItem;
  feed?: string;
  position?: number;
}) {
  const { track } = useFactanza();
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !feed || typeof IntersectionObserver === "undefined") return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          timer = setTimeout(() => {
            track("card_view", { article_id: item.id, feed, position: position ?? 0 });
            observer.disconnect();
          }, 1000);
        } else if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [item.id, feed, position, track]);
  return (
    <Link
      ref={ref}
      to="/notizia"
      search={{ id: item.id }}
      className="news-link"
      onClick={() =>
        track("article_open", {
          article_id: item.id,
          feed: feed ?? "altro",
          position: position ?? 0,
        })
      }
    >
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
