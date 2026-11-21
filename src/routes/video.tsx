import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Back, PageTitle, pageHead } from "@/components/factanza/shared";
import { media } from "@/data/factanza";

export const Route = createFileRoute("/video")({
  validateSearch: (search: Record<string, unknown>): { id?: string } =>
    typeof search["id"] === "string" ? { id: search["id"] } : {},
  head: () =>
    pageHead(
      "Video — Factanza in play",
      "Il video della community Factanza, con uno spazio per capire meglio il mondo.",
    ),
  component: Video,
});

function Video() {
  const { id } = Route.useSearch();
  const item =
    media.find((video) => video.id === id) ?? media.find((video) => video.type === "YouTube");
  return (
    <AppShell>
      <div className="page-content">
        <Back to="/contenuti" />
        <span className="sticker small yellow">YOUTUBE</span>
        <PageTitle>{item?.title}</PageTitle>
        <iframe
          className="video-frame"
          src="https://www.youtube-nocookie.com/embed/jNQXAC9IVRw"
          title="Video dimostrativo YouTube"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <p className="demo-label">
          Video di esempio pubblico, non un contenuto originale Factanza.
        </p>
        {item && (
          <p className="body-copy mt-6">
            {item.topic} · {item.duration}
          </p>
        )}
      </div>
    </AppShell>
  );
}
