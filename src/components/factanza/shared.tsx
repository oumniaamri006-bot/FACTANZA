import { Link, useLocation } from "@tanstack/react-router";
import { Home, Users, CalendarDays, CirclePlay, CreditCard, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { getCategoryByName } from "@/data/categories";
import logoAsset from "@/assets/factanza-logo.asset.json";

export type StickerColor = "lime" | "yellow" | "lilac" | "magenta";

export function Logo() {
  return (
    <div className="brand">
      <img className="logo" src={logoAsset.url} alt="Logo Factanza" />
      <span>
        factanza<span className="brand-dot">.</span>
      </span>
    </div>
  );
}

/** Titolo di sezione: testo leggero + sticker inclinato in Anton. */
export function SectionTitle({
  first,
  second,
  color = "lime",
}: {
  first: string;
  second: string;
  color?: StickerColor;
}) {
  return (
    <h2 className="section-title">
      {first}
      <span className={`sticker ${color}`}>{second}</span>
    </h2>
  );
}

/** Titolo principale delle pagine di dettaglio (notizia, evento, video). */
export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="page-title">{children}</h1>;
}

/** Icona pop-art di una categoria, cercata per nome del tema. */
export function CategoryIcon({ topic, className = "" }: { topic: string; className?: string }) {
  const category = getCategoryByName(topic);
  if (!category) return null;
  return <img className={`category-icon ${className}`} src={category.icon} alt="" aria-hidden />;
}

const tabs = [
  { path: "/", label: "Per te", icon: Home },
  { path: "/community", label: "Community", icon: Users },
  { path: "/live", label: "Live", icon: CalendarDays },
  { path: "/contenuti", label: "Contenuti", icon: CirclePlay },
  { path: "/factafidelity", label: "FactaFidelity", icon: CreditCard },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="phone">
      <header className="app-header">
        <Link to="/" aria-label="Factanza, home">
          <Logo />
        </Link>
        <Button asChild variant="ghost" className="avatar">
          <Link to="/profilo" aria-label="Area personale">
            F
          </Link>
        </Button>
      </header>
      <main>{children}</main>
      <nav className="bottom-nav" aria-label="Navigazione principale">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`nav-item ${pathname === tab.path ? "active" : ""}`}
            aria-current={pathname === tab.path ? "page" : undefined}
          >
            <tab.icon />
            {tab.path === "/live" && <i className="notification-dot" />}
            <span>{tab.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

const backLabels = {
  "/": "Torniamo alle notizie",
  "/live": "Torniamo alle live",
  "/contenuti": "Torniamo ai contenuti",
} as const;

export function Back({ to = "/" }: { to?: keyof typeof backLabels }) {
  return (
    <div className="back-bar">
      <Button variant="facta" size="icon" asChild>
        <Link to={to} aria-label="Torna indietro">
          <ArrowLeft />
        </Link>
      </Button>
      <span>{backLabels[to]}</span>
    </div>
  );
}

export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | Factanza` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | Factanza` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
