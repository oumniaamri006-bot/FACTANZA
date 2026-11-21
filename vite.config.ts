import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";

// Configurazione standard TanStack Start + Nitro, senza dipendenze da Lovable.
// Nitro rileva il provider di hosting in fase di build (Vercel, Netlify, Cloudflare…);
// in locale produce un server Node avviabile con `node .output/server/index.mjs`.
export default defineConfig(({ command }) => ({
  server: { port: 3000 },
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    // Il server entry punta a src/server.ts (pagina di errore SSR personalizzata).
    tanstackStart({ server: { entry: "server" } }),
    command === "build" && nitro(),
    viteReact(),
  ],
}));
