/**
 * Post Instagram mostrati sul sito con l'incorporamento ufficiale di Instagram:
 * i contenuti restano su Instagram, con autore e link all'originale.
 * Per aggiungere un post: copia il link dal menu "..." → "Copia link" e incollalo qui.
 */
export const instagramProfile = "factanza";

export const instagramPosts: string[] = ["https://www.instagram.com/p/Df_wFfQgNt3/"];

export const instagramProfileUrl = `https://www.instagram.com/${instagramProfile}/`;

/** Indirizzo del profilo incorporato (ultimi post, aggiornato da Instagram). */
export const instagramProfileEmbedUrl = `${instagramProfileUrl}embed/`;

/** Converte il link di un post o reel nell'indirizzo da incorporare; `null` se non è valido. */
export function instagramEmbedUrl(permalink: string): string | null {
  const match = permalink
    .trim()
    .match(/^https?:\/\/(?:www\.)?instagram\.com\/(?:[\w.]+\/)?(p|reel|tv)\/([\w-]+)/);
  if (!match) return null;
  const [, kind, code] = match;
  return `https://www.instagram.com/${kind}/${code}/embed/captioned/`;
}
