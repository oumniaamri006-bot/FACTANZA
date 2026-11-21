import { Calculator, Globe2, MessageSquareQuote, Newspaper, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Aspetto di ogni famiglia di giochi: colore (token) e icona. */
export const familyLook: Record<string, { tone: string; icon: LucideIcon }> = {
  "Ogni giorno": { tone: "navy", icon: Newspaper },
  Numeri: { tone: "yellow", icon: Calculator },
  "Persone e parole": { tone: "magenta", icon: MessageSquareQuote },
  "Tempo e luoghi": { tone: "lime", icon: Globe2 },
  Domenica: { tone: "lilac", icon: Trophy },
};

export const lookOf = (family: string) => familyLook[family] ?? { tone: "lilac", icon: Trophy };
