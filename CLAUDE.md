# CLAUDE.md — Factanza

Guida per Claude (e per chiunque sviluppi) su questo repository.

Il progetto è nato su Lovable ma ora è **indipendente**: niente pacchetti `@lovable.dev`, niente
asset ospitati su Lovable, niente telemetria dell'editor. Non reintrodurli.

## Il progetto

**Factanza — "Non solo news. La tua voce."** Web app mobile-first (demo da hackathon) che porta
i giovani a capire le notizie che influenzano la loro vita: feed personalizzato, domanda del
giorno, notizie spiegate in breve, dibattiti live con voto prima/dopo, podcast/video, carta
FactaFidelity e area personale.

- Stella polare: _i giovani capiscono le notizie che influenzano la loro vita_. Metrica: minuti
  totali passati a leggere le notizie ogni giorno.
- Lingua dell'interfaccia: **italiano**. Tutti i testi visibili, i `head()` e le etichette ARIA
  sono in italiano.
- È una demo: **nessun backend**. Contenuti finti in `src/data`, stato utente in `localStorage`.
  Ogni dato simulato è segnalato con una `.demo-label`.

## Stack e comandi

TanStack Start (React 19, SSR, routing a file) · TypeScript strict · Tailwind CSS v4 ·
componenti shadcn/Radix in `src/components/ui` · framer-motion · lucide-react · Vitest.
Il package manager è **bun** (`bun.lock`); funziona anche npm.

```sh
bun install
bun run dev          # vite dev su :3000 (se IPv6 non è disponibile: aggiungi --host 127.0.0.1)
bun run test         # vitest run
bun run lint         # eslint + prettier
npx tsc --noEmit     # typecheck
bun run build        # Nitro: preset auto-rilevato (Vercel/Netlify/Cloudflare) o server Node
node .output/server/index.mjs   # avvia la build in locale
bun run format       # prettier --write .
```

Prima di ogni commit esegui test, typecheck e lint: devono passare senza errori.

## Struttura

```
src/
  routes/                 una route TanStack per pagina (vedi src/routes/README.md)
    __root.tsx            shell HTML, font, meta globali, pagine 404/errore in stile Factanza
  server.ts, start.ts     entry SSR e middleware (errori, CSRF); lib/error-page.ts = errore SSR statico
    index.tsx             home: storie categorie, domanda del giorno, feed "I tuoi temi" / "Per te", banner live
    categoria.$category.tsx  notizie per categoria (`tutte` = tutte le notizie)
    notizia.tsx           notizia: immagine, testo (body o punti chiave) + sondaggio `poll` (?id=)
    live.tsx              Eventi: diretta in corso, calendario appuntamenti, replay
    evento.tsx            dibattito live con voto prima/dopo (?id=)
    contenuti.tsx, video.tsx  podcast/YouTube e player demo
    community.tsx, factafidelity.tsx, profilo.tsx
  components/factanza/    componenti dell'app
    shared.tsx            AppShell, Logo, SectionTitle, PageTitle, CategoryIcon, TopicCover,
                          IconCollage, Back, pageHead
    context.tsx           FactanzaProvider / useFactanza (stato utente, voti, toast)
    news-card.tsx, onboarding.tsx
  components/ui/          primitive shadcn (non modificarle per lo stile dell'app)
  data/                   contenuti demo: categories.ts, news.ts, factanza.ts
  lib/factanza-state.ts   tipo UserState, parsing sicuro del localStorage, toggleValue
  assets/categorie/       le 11 icone pop-art delle categorie (PNG trasparenti 320×320)
  assets/factanza-logo.png  logo (la "F" multicolore, uguale a public/favicon.png)
  styles.css              token Tailwind + TUTTO il sistema visivo Factanza
  test/                   test Vitest
```

`src/routeTree.gen.ts` è generato automaticamente: non modificarlo a mano.

## Regole di architettura

- Ogni notizia ha una `date` (AAAA-MM-GG, mostrata nelle card); il feed è ordinato dalla più recente.
- La home ha due schede: **"I tuoi temi"** (argomenti scelti) e **"Per te"** (suggerite: altri
  argomenti, dalle più discusse — `src/lib/recommend.ts`).
- Il **calendario** sta nella pagina **Eventi** (`/live`, tab in basso): dirette, uscite di podcast
  e video, eventi, da `src/data/agenda.ts` (`demoToday` = giorno "oggi" della demo), con
  `DayStrip` e le date di `src/lib/dates.ts`.
- Ogni notizia (`src/data/news.ts`) ha un `poll` (domanda + risposte); le percentuali sono
  simulate e stabili (`src/lib/poll.ts`). La barra categorie mostra solo i temi scelti
  dall'utente (tutti, se non ne ha scelto nessuno).
- Contenuti demo solo in `src/data`; scelte dell'utente solo nel contesto `useFactanza()`.
- `localStorage` si legge/scrive solo dopo l'idratazione o negli event handler (SSR-safe).
  La home mostra `<div className="phone" />` finché `ready` è `false`.
- Ogni pagina ha la sua route e il suo `head: () => pageHead(titolo, descrizione)`.
  Non aggiungere `og:image`/`twitter:image` nella root.
- Le categorie stanno in **un solo catalogo**: `src/data/categories.ts` (`slug`, `name`, `icon`).
  `topics` in `src/data/factanza.ts` deve restare allineato ai nomi delle categorie (c'è un test).
  La voce "Tutti" è `allCategory` (slug `tutte`) e ha una sua icona.
- Il nome di una categoria (`'AI & Tech'`, `'Politica'`, …) è la chiave usata da notizie, eventi e
  media nel campo `topic`; usa `getCategoryByName()` / `<CategoryIcon topic=…/>` per l'icona.
- Tutti gli asset sono file locali in `src/assets` importati con `import url from "…png"`:
  niente URL esterni per le immagini.

## Sistema visivo (da rispettare per mantenere la grafica omogenea)

Stile **pop-art / fumetto editoriale**, coerente con le icone di categoria in
`src/assets/categorie/`: contorni neri spessi, ombre piatte sfalsate, colori saturi, sticker
inclinati, retino a puntini.

**Token** (in `src/styles.css`, mai colori hardcoded):

| Ruolo                                                         | Token                                                        |
| ------------------------------------------------------------- | ------------------------------------------------------------ |
| Blocchi forti (domanda del giorno, splash, carta, tab attiva) | `--brand-navy`                                               |
| Sticker / accenti / stato "scelto"                            | `--lime`, `--yellow`, `--magenta`, `--lilac`                 |
| Offerte                                                       | `--brand-orange`                                             |
| Card e superfici                                              | `--paper` su sfondo `--background`                           |
| Link, focus, icone lineari                                    | `--primary`                                                  |
| Contorno                                                      | `--line` (2px nero) · separatori leggeri `--hairline`        |
| Ombre piatte                                                  | `--shadow-sm` (2px) · `--shadow` (3px) · `--shadow-lg` (5px) |
| Raggio card                                                   | `--radius-card` (8px) · bottoni 6px                          |
| Retino pop-art                                                | `.pop-bg` (lilac + `--halftone`)                             |

**Tipografia**: Unbounded 300 per i titoli di sezione (`.section-title`, `.subsection-title`,
splash) · Anton per sticker, tag ed etichette (`font-label`) · Caveat per le note a mano
(`.hand`, sempre tra parentesi: "(così)") · Inter Tight per il testo.

**Componenti da riusare, invece di creare stili nuovi:**

- `<SectionTitle first="Testo" second="STICKER" color="lime|yellow|lilac|magenta" />`
- `<PageTitle>` per il titolo delle pagine di dettaglio.
- `<Button variant="facta">` per azioni secondarie, `variant="sticker"` (giallo) per la CTA
  principale della schermata. Stato selezionato: classe `picked` + `aria-pressed`.
  Non usare le varianti shadcn `default/outline/secondary` nelle pagine Factanza.
- `<CategoryIcon topic="Cultura" className="swipe-art" />` per mostrare una
  categoria. Non usare icone lucide per le categorie: usa sempre le illustrazioni pop-art.
- `<TopicCover topic="…" />` come copertina di notizie, live e contenuti (icona su retino):
  non ci sono foto. `<IconCollage label="…" />` per le illustrazioni grandi (splash, community,
  sfondo del player live).
- `.sticker` (+ `.small`), `.topic-tag`, `.live-badge`, `.hand`, `.body-copy`, `.demo-label`.
- Card: bordo `--line`, `--radius-card`, ombra `--shadow` (vedi `.news-card`, `.benefit`).

**Icone di categoria**: le 11 illustrazioni (10 categorie + "Tutti") sono già scontornate,
centrate su tela trasparente 320×320 e ridotte a palette 256 colori (~25 KB l'una). Per una nuova
categoria crea un'illustrazione nello stesso stile (esplosione colorata, contorno nero,
cartiglio giallo con il nome in maiuscolo), esportala con lo stesso formato e aggiungila al
catalogo in `categories.ts`.

**CSS**: il blocco Factanza in `styles.css` è volutamente **fuori da `@layer`**, così vince sulle
utility delle varianti shadcn applicate agli stessi elementi (es. `ghost`, `size="icon"`).
Conseguenza: una utility Tailwind non può sovrascrivere una proprietà già impostata da una classe
Factanza; in quel caso aggiungi una classe/modificatore nel CSS. È organizzato per sezioni
(Layout, Brand, Tipografia, Sticker, Bottoni, Icone, Nav, …): aggiungi le regole nella sezione
giusta, una proprietà per riga.

**Layout**: mobile-first in una colonna `.phone` di max 430px; padding laterale `--gutter`
(22px); la bottom nav è fissa. Rispetta `prefers-reduced-motion` (già gestito globalmente).

## Accessibilità

- Testi alternativi in italiano; le icone decorative accanto a un testo usano `alt=""`.
- Bottoni solo-icona con `aria-label`; toggle con `aria-pressed`; tab con `role="tab"`.
- Focus visibile: outline `--primary` di 3px su bottoni e storie.

## Test

`src/test/` copre: matching delle route, catalogo categorie (10 categorie + Tutti, icone uniche,
allineamento con `topics`), regole dello stato utente. Aggiungi un test quando cambi dati,
catalogo o logica in `lib/`.
