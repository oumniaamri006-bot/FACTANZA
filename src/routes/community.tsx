import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { AppShell, SectionTitle, pageHead } from "@/components/factanza/shared";
import { Button } from "@/components/ui/button";
import { collage } from "@/data/factanza";
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
        <img
          src={collage}
          alt="Due giovani pronti a dare voce alla community"
          className="collage empty-collage"
        />
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
