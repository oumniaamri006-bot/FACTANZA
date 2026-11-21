import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { AppShell, Back, PageTitle, pageHead } from "@/components/factanza/shared";
import { Button } from "@/components/ui/button";
import { media, mediaLink } from "@/data/factanza";

export const Route = createFileRoute("/video")({
  validateSearch: (search: Record<string, unknown>): { id?: string } =>
    typeof search["id"] === "string" ? { id: search["id"] } : {},
  head: () =>
    pageHead(
      "Video — Factanza in play",
      "I video di Factanza Media: storie, interviste e approfondimenti per capire il mondo.",
    ),
  component: Video,
});

function Video() {
  const { id } = Route.useSearch();
  const item =
    media.find((video) => video.id === id) ?? media.find((video) => video.type === "YouTube");
  if (!item) return null;
  return (
    <AppShell>
      <div className="page-content">
        <Back to="/contenuti" />
        <span className="sticker small yellow">YOUTUBE</span>
        <PageTitle>{item.title}</PageTitle>
        {item.youtubeId ? (
          <iframe
            className="video-frame"
            src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <a
            className="video-thumb"
            href={mediaLink(item)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Guarda su YouTube: ${item.title}`}
          >
            <img src={item.image} alt="" />
          </a>
        )}
        <p className="body-copy mt-4">
          {item.show} · {item.duration} · {item.topic}
        </p>
        <Button variant="sticker" className="w-full mt-6" asChild>
          <a href={mediaLink(item)} target="_blank" rel="noopener noreferrer">
            Guarda su YouTube <ExternalLink />
          </a>
        </Button>
        <p className="demo-label">Video del canale YouTube di Factanza Media.</p>
      </div>
    </AppShell>
  );
}
