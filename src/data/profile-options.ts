/** Opzioni del passaggio "Parlaci di te" (onboarding) e della sezione "Su di te" del profilo. */

export const demoYear = 2026;

/** Anni di nascita proposti: dai 10 ai 70 anni. */
export const birthYears = Array.from({ length: 61 }, (_, index) => demoYear - 10 - index);

/** In Italia sotto i 14 anni serve il consenso dei genitori: niente statistiche d'uso. */
export const digitalConsentAge = 14;

export function ageOf(birthYear: number | null) {
  return birthYear === null ? null : demoYear - birthYear;
}

export function isMinorForConsent(birthYear: number | null) {
  const age = ageOf(birthYear);
  return age !== null && age < digitalConsentAge;
}

export const regions = [
  "Abruzzo",
  "Basilicata",
  "Calabria",
  "Campania",
  "Emilia-Romagna",
  "Friuli-Venezia Giulia",
  "Lazio",
  "Liguria",
  "Lombardia",
  "Marche",
  "Molise",
  "Piemonte",
  "Puglia",
  "Sardegna",
  "Sicilia",
  "Toscana",
  "Trentino-Alto Adige",
  "Umbria",
  "Valle d’Aosta",
  "Veneto",
  "Fuori dall’Italia",
];

export const occupations = [
  "Studio alle superiori",
  "Studio all’università",
  "Lavoro",
  "Studio e lavoro",
  "Cerco lavoro",
  "Altro",
];

export const genders = ["Donna", "Uomo", "Non binario", "Preferisco non dirlo"];

export const referrals = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Podcast",
  "Passaparola",
  "Scuola o università",
  "Altro",
];
