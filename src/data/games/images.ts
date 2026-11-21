/**
 * Immagini dei minigiochi con crediti.
 * - Asset Factanza (copertine di notizie e podcast già nell'app).
 * - Foto da Wikimedia Commons con licenza libera, salvate in src/assets/games/<chiave>.jpg,
 *   con autore e licenza in credits.json.
 * Se un'immagine non c'è, `img()` restituisce undefined e il gioco mostra un'icona neutra.
 */
import type { Credit } from "@/lib/games/types";
import credits from "./credits.json";
import asilo from "@/assets/notizie/asilo-trasferimenti.jpg";
import barbie from "@/assets/notizie/barbie-corpi.jpg";
import ricerca from "@/assets/notizie/ricerca-precariato.jpg";
import willie from "@/assets/media/gs-willie-peyote.jpg";
import bombardieri from "@/assets/media/gs-bombardieri.jpg";
import viscardi from "@/assets/media/gs-viscardi.jpg";
import rosina from "@/assets/media/gs-rosina.jpg";

const factanza = (src: string, source: string): Credit => ({
  src,
  author: "Factanza Media",
  license: "© Factanza",
  source,
});

const local: Record<string, Credit> = {
  asilo: factanza(asilo, "Instagram @factanza"),
  barbie: factanza(barbie, "Instagram @factanza"),
  ricerca: factanza(ricerca, "Instagram @factanza"),
  willie: factanza(willie, "Generazione Sospesa"),
  bombardieri: factanza(bombardieri, "Generazione Sospesa"),
  viscardi: factanza(viscardi, "Generazione Sospesa"),
  rosina: factanza(rosina, "Generazione Sospesa"),
};

const files = import.meta.glob<string>("../../assets/games/*.jpg", {
  eager: true,
  import: "default",
});

type CommonsCredit = { author: string; license: string; page: string };

export function img(key: string): Credit | undefined {
  if (local[key]) return local[key];
  const src = files[`../../assets/games/${key}.jpg`];
  const credit = (credits as Record<string, CommonsCredit>)[key];
  if (!src || !credit) return undefined;
  return { src, author: credit.author, license: credit.license, source: credit.page };
}
