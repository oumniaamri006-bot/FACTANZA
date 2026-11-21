import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { FactanzaProvider } from "@/components/factanza/context";
import { Logo } from "@/components/factanza/shared";
import { DesktopGate } from "@/components/factanza/desktop-gate";
import { Button } from "@/components/ui/button";
import { isStaleChunkError, reloadOnce } from "@/lib/stale-chunk";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="phone status-page">
      <Logo />
      <span className="sticker yellow status-code">404</span>
      <h1 className="page-title">Questa pagina non esiste.</h1>
      <p className="body-copy">Forse è stata spostata, o il link non è corretto.</p>
      <p className="hand">(succede anche alle notizie migliori)</p>
      <Button variant="sticker" className="w-full mt-8" asChild>
        <Link to="/">Torna alle notizie</Link>
      </Button>
    </div>
  );
}

function ErrorComponent({ error }: ErrorComponentProps) {
  useEffect(() => {
    console.error(error);
    if (isStaleChunkError(error)) reloadOnce();
  }, [error]);

  return (
    <div className="phone status-page">
      <Logo />
      <span className="sticker magenta status-code">OPS!</span>
      <h1 className="page-title">Questa pagina non si è caricata.</h1>
      <p className="body-copy">
        Qualcosa è andato storto da parte nostra. Riprova o torna alla home.
      </p>
      <div className="flex flex-col gap-4 mt-8">
        <Button variant="sticker" onClick={() => window.location.reload()}>
          Riprova
        </Button>
        <Button variant="facta" asChild>
          <a href="/">Torna alle notizie</a>
        </Button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Ogni route di contenuto imposta il proprio head() con pageHead(). Non aggiungere qui
    // og:image o twitter:image: tutte le pagine senza un'immagine propria la erediterebbero.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "Factanza" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "theme-color", content: "#1b1f5e" },
      { title: "Factanza — Non solo news" },
      {
        name: "description",
        content: "L'informazione diventa community. Scopri, vota e confrontati con Factanza.",
      },
      { name: "author", content: "Factanza" },
      { property: "og:title", content: "Factanza — Non solo news" },
      { property: "og:description", content: "La tua voce entra nelle notizie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@400;600&family=Inter+Tight:wght@400;500;600;700;800&family=Unbounded:wght@300;400&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <FactanzaProvider>
        <div className="app-root">
          <Outlet />
        </div>
      </FactanzaProvider>
      <DesktopGate />
    </QueryClientProvider>
  );
}
