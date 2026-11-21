import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Pause, X, Headphones, CirclePlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AppShell,
  CategoryIcon,
  SectionTitle,
  TopicCover,
  pageHead,
} from "@/components/factanza/shared";
import { media } from "@/data/factanza";
import { useFactanza } from "@/components/factanza/context";

export const Route = createFileRoute("/contenuti")({
  head: () =>
    pageHead(
      "Contenuti — Podcast e YouTube",
      "Ascolta e guarda le storie che ti interessano, con i podcast e i video di Factanza.",
    ),
  component: Content,
});

const contentTabs = ["Podcast", "YouTube"] as const;
type ContentTab = (typeof contentTabs)[number];

function PlayAction({
  item,
  tab,
  variant,
  onPlay,
}: {
  item: (typeof media)[number];
  tab: ContentTab;
  variant: "facta" | "ghost";
  onPlay: (id: string) => void;
}) {
  if (tab === "Podcast") {
    return (
      <Button
        variant={variant}
        size="icon"
        aria-label={`Ascolta ${item.title}`}
        onClick={() => onPlay(item.id)}
      >
        <Play />
      </Button>
    );
  }
  return (
    <Button variant={variant} size="icon" asChild>
      <Link to="/video" search={{ id: item.id }} aria-label={`Guarda ${item.title}`}>
        <Play />
      </Link>
    </Button>
  );
}

function Content() {
  const { user } = useFactanza();
  const [tab, setTab] = useState<ContentTab>("Podcast");
  const [current, setCurrent] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const filtered = media.filter((item) => item.type === tab);
  const recommended = filtered.filter((item) => user.interests.includes(item.topic));
  const featured = recommended.length ? recommended : filtered;
  const active = media.find((item) => item.id === current);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () =>
        setProgress((old) => {
          if (old >= 100) {
            setPlaying(false);
            return 100;
          }
          return old + 1;
        }),
      1000,
    );
    return () => clearInterval(timer);
  }, [playing]);

  const start = (id: string) => {
    setCurrent(id);
    setPlaying(true);
    setProgress(0);
  };

  return (
    <AppShell>
      <div className="page-content">
        <SectionTitle first="Il mondo," second="IN PLAY." color="yellow" />
        <div className="tabs" role="tablist">
          {contentTabs.map((value) => (
            <Button
              key={value}
              variant="ghost"
              role="tab"
              aria-selected={tab === value}
              className={tab === value ? "selected" : ""}
              onClick={() => setTab(value)}
            >
              {value === "Podcast" ? <Headphones /> : <CirclePlay />}
              {value}
            </Button>
          ))}
        </div>

        <h2 className="subsection-title">Ti potrebbe interessare</h2>
        <div className="content-carousel">
          {featured.map((item) => (
            <article key={item.id} className="content-item">
              <div className="media-cover">
                <TopicCover topic={item.topic} />
                <h3>{item.title}</h3>
              </div>
              <div className="news-footer">
                <span>
                  {item.duration} · {item.topic}
                </span>
                <PlayAction item={item} tab={tab} variant="facta" onPlay={start} />
              </div>
            </article>
          ))}
        </div>

        <SectionTitle first="Nuovi" second="ARRIVI" color="lilac" />
        {filtered.map((item) => (
          <article key={item.id} className="arrival">
            <div className="arrival-thumb pop-bg">
              <CategoryIcon topic={item.topic} />
            </div>
            <div className="flex-1">
              <h3>{item.title}</h3>
              <p>
                {item.duration} · {item.topic}
              </p>
            </div>
            <PlayAction item={item} tab={tab} variant="ghost" onPlay={start} />
          </article>
        ))}
        <p className="demo-label">Player podcast dimostrativo, senza traccia audio.</p>
      </div>

      {active && (
        <div className="mini-player">
          <Button
            variant="ghost"
            size="icon"
            aria-label={playing ? "Pausa" : "Riprendi"}
            onClick={() => setPlaying(!playing)}
          >
            {playing ? <Pause /> : <Play />}
          </Button>
          <p>{active.title}</p>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            aria-label="Avanzamento podcast"
          />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Chiudi player"
            onClick={() => {
              setCurrent(null);
              setPlaying(false);
            }}
          >
            <X />
          </Button>
        </div>
      )}
    </AppShell>
  );
}
