import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { AppShell, IconCollage, SectionTitle, pageHead } from "@/components/factanza/shared";
import { Button } from "@/components/ui/button";
import { useFactanza } from "@/components/factanza/context";

export const Route = createFileRoute("/community")({
  head: () =>
    pageHead(
      "Community",
      "La community Factanza sta arrivando: un nuovo spazio per discutere e confrontarsi.",
    ),
  component: Community,
});

function Community() {
  const { update, notify, user } = useFactanza();
  return (
    <AppShell>
      <div className="page-content">
        <SectionTitle first="La community" second="STA ARRIVANDO" />
        <IconCollage className="empty-collage" label="I temi di cui parlerà la community" />
        <Link to="/sfida" className="challenge-card mt-6">
          <span className="sticker small yellow">FACTACHALLENGE</span>
          <strong>Sfida i tuoi amici sulle notizie di oggi.</strong>
          <span>60 secondi, 3 prove, un risultato da condividere.</span>
          <span className="challenge-card-cta">Gioca ora →</span>
        </Link>
        <p className="hand text-primary text-right mt-4">(e ci sarai anche tu) ↗</p>
        <p className="body-copy mt-5 mb-6">
          Presto potrai discutere e confrontarti con chi ha i tuoi stessi interessi.
        </p>
        <Button
          variant="sticker"
          className="w-full"
          onClick={() => {
            update({ notifications: true });
            notify("Ci sei! Ti avviseremo qui quando sarà pronta.");
          }}
        >
          <Bell />
          {user.notifications ? "Sei nella lista!" : "Avvisami"}
        </Button>
      </div>
    </AppShell>
  );
}
