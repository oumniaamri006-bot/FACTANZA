import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  BookOpen,
  Clapperboard,
  TrainFront,
  Shirt,
  Utensils,
  Music,
  Copy,
  X,
  ArrowRight,
} from "lucide-react";
import { AppShell, SectionTitle, Logo, pageHead } from "@/components/factanza/shared";
import { Button } from "@/components/ui/button";
import { partners } from "@/data/factanza";
import { useFactanza } from "@/components/factanza/context";

export const Route = createFileRoute("/factafidelity")({
  head: () =>
    pageHead(
      "FactaFidelity — La tua carta",
      "La carta della community: scopri agevolazioni, partner e offerte dedicate.",
    ),
  component: Fidelity,
});

const partnerIcons = [BookOpen, Clapperboard, TrainFront, Shirt, Utensils, Music];
const memberCode = "FACTA-2026-0042";
type Partner = (typeof partners)[number];

function Fidelity() {
  const { user, notify, track } = useFactanza();
  const [flipped, setFlipped] = useState(false);
  const [partner, setPartner] = useState<Partner | null>(null);
  const reduced = useReducedMotion();

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      track("code_copy", { code });
      notify("Codice copiato! (È un codice demo)");
    } catch {
      notify("Copia manualmente il codice mostrato.");
    }
  };

  return (
    <AppShell>
      <div className="page-content">
        <SectionTitle first="Essere parte" second="HA I SUOI VANTAGGI." color="lilac" />
        <motion.div
          animate={{ rotateY: reduced ? 0 : flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            className={`fidelity-card ${flipped ? "flipped" : ""}`}
            onClick={() => setFlipped(!flipped)}
            aria-label="Gira la carta FactaFidelity"
          >
            <div className="card-inner">
              {flipped ? (
                <div className="flex flex-col items-center gap-4">
                  <span className="font-label text-2xl">IL TUO CODICE</span>
                  <QRCodeSVG value={memberCode} size={90} className="qr" />
                  <strong className="text-xl">{memberCode}</strong>
                  <span className="text-xs">Carta dimostrativa · non valida per acquisti</span>
                </div>
              ) : (
                <>
                  <Logo />
                  <div className="member">
                    <div>
                      <h3>{user.name}</h3>
                      <p>Membro dal 2026</p>
                    </div>
                    <QRCodeSVG value={memberCode} size={55} className="qr" />
                  </div>
                  <p className="font-label text-lg mt-4">FACTAFIDELITY ↗</p>
                </>
              )}
            </div>
          </Button>
        </motion.div>
        <p className="hand text-right mt-3">(la tua tessera, sempre con te)</p>

        <SectionTitle first="Agevolazioni" second="PER TE" color="yellow" />
        <div className="benefit-grid">
          {partners.map((item, i) => {
            const Icon = partnerIcons[i] ?? BookOpen;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className="benefit"
                onClick={() => {
                  setPartner(item);
                  track("offer_open", { partner: item.id });
                }}
              >
                <div className="flex justify-between w-full">
                  <Icon />
                  <span className="sticker small yellow">{item.discount}</span>
                </div>
                <div>
                  <strong>{item.name}</strong>
                  <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                </div>
              </Button>
            );
          })}
        </div>

        <SectionTitle first="Offerte" second="DEI BRAND" color="magenta" />
        <div className="offer">
          <span className="sticker small yellow">FINO AL 30 NOVEMBRE</span>
          <h3>UN LIBRO. MILLE MONDI.</h3>
          <p className="body-copy mb-5">Pagina27: una lettura nuova, a un prezzo più leggero.</p>
          <Button variant="facta" onClick={() => setPartner(partners[0] ?? null)}>
            Scopri l'offerta <ArrowRight />
          </Button>
        </div>
        <p className="hand text-center">
          (le agevolazioni non dipendono mai
          <br />
          da cosa rispondi)
        </p>
        <p className="demo-label">Partner, sconti e codici sono fittizi.</p>
      </div>

      {partner && (
        <div className="modal-overlay" onClick={() => setPartner(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Offerta ${partner.name}`}
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <span className="sticker yellow">{partner.discount}</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Chiudi offerta"
                onClick={() => setPartner(null)}
              >
                <X />
              </Button>
            </div>
            <h2>{partner.name}</h2>
            <p className="body-copy">{partner.detail}</p>
            <code>{partner.code}</code>
            <Button variant="sticker" className="w-full" onClick={() => copyCode(partner.code)}>
              <Copy />
              Copia codice
            </Button>
            <p className="demo-label">Offerta fittizia · non utilizzabile presso negozi reali.</p>
          </div>
        </div>
      )}
    </AppShell>
  );
}
