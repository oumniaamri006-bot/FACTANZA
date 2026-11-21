# Factanza

**Non solo news. La tua voce.** Web app mobile-first che aiuta i giovani a capire le notizie che
influenzano la loro vita: feed personalizzato, domanda del giorno, notizie spiegate in 5 slide,
dibattiti live con voto prima/dopo, podcast e video, carta FactaFidelity.

Gli account e i dati degli utenti sono su [Supabase](https://supabase.com) (vedi
[`supabase/README.md`](./supabase/README.md)); notizie, video ed eventi sono in `src/data`.

## Sviluppo

Serve [Bun](https://bun.sh) (oppure Node.js 22+ con npm).

```sh
bun install
# crea .env.local con VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (chiave pubblica)
bun run dev      # http://localhost:3000
bun run test
bun run lint
bun run build    # output in .output/
node .output/server/index.mjs   # avvia la build di produzione
```

## Deploy

La build usa [Nitro](https://nitro.build): su Vercel, Netlify o Cloudflare il preset viene
rilevato automaticamente; altrove produce un server Node (`.output/server/index.mjs`).

## Stack

TanStack Start · React 19 · TypeScript · Tailwind CSS v4 · shadcn/Radix · framer-motion · Vitest

Regole di architettura e sistema visivo: vedi [`CLAUDE.md`](./CLAUDE.md).
