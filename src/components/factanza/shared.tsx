import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Home,
  Gamepad2,
  CalendarDays,
  CirclePlay,
  CreditCard,
  ArrowLeft,
  Settings,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useFactanza } from "./context";
import { categories, getCategoryByName } from "@/data/categories";
import logoUrl from "@/assets/factanza-logo.png";

export type StickerColor = "lime" | "yellow" | "lilac" | "magenta";

export function Logo() {
  return (
    <div className="brand">
      <img className="logo" src={logoUrl} alt="Logo Factanza" />
      <span>
        factanza<span className="brand-dot">.</span>
      </span>
    </div>
  );
}

/** Cerchio con l'iniziale del nome: in alto a destra (piccolo) e nel profilo (grande). */
export function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "lg" }) {
  const initial = (name.trim()[0] ?? "F").toUpperCase();
  return (
    <span className={`avatar-badge ${size}`} aria-hidden>
      {initial}
    </span>
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

/** Copertina illustrata di un contenuto: l'icona pop-art del tema su retino. */
export function TopicCover({ topic, className = "" }: { topic: string; className?: string }) {
  return (
    <div className={`topic-cover pop-bg ${className}`}>
      <CategoryIcon topic={topic} />
    </div>
  );
}

const collageSlugs = ["politica", "ai-tech", "trend", "cultura", "ambiente"];

/** Composizione di icone pop-art inclinate: sostituisce il collage fotografico. */
export function IconCollage({ className = "", label }: { className?: string; label?: string }) {
  const icons = collageSlugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category) => category !== undefined);
  return (
    <div
      className={`icon-collage pop-bg ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {icons.map((category) => (
        <img key={category.slug} src={category.icon} alt="" />
      ))}
    </div>
  );
}

const tabs = [
  { path: "/", label: "Per te", icon: Home },
  { path: "/gioca", label: "Gioca", icon: Gamepad2 },
  { path: "/live", label: "Eventi", icon: CalendarDays },
  { path: "/contenuti", label: "Contenuti", icon: CirclePlay },
  { path: "/factafidelity", label: "FactaFidelity", icon: CreditCard },
] as const;

/** La tab Gioca resta attiva anche nei singoli giochi e nella classifica. */
const isActive = (pathname: string, path: string) =>
  pathname === path ||
  (path !== "/" && pathname.startsWith(`${path}/`)) ||
  (path === "/gioca" && pathname === "/classifica");

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { ready, session, user } = useFactanza();
  const navigate = useNavigate();
  // Senza accesso (uscita, account eliminato, sessione scaduta) si torna alla home, una volta.
  useEffect(() => {
    if (ready && !session) void navigate({ to: "/", replace: true });
  }, [ready, session, navigate]);
  if (!ready || !session) return <div className="phone" />;
  return (
    <div className="phone">
      <header className="app-header">
        <Link to="/" aria-label="Factanza, home">
          <Logo />
        </Link>
        <Link
          to="/profilo"
          className={`profile-button ${pathname === "/profilo" ? "active" : ""}`}
          aria-label="Profilo e impostazioni"
        >
          <Avatar name={user.name} />
          <span className="profile-button-gear" aria-hidden>
            <Settings />
          </span>
        </Link>
      </header>
      <main>{children}</main>
      <nav className="bottom-nav" aria-label="Navigazione principale">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`nav-item ${isActive(pathname, tab.path) ? "active" : ""}`}
            aria-current={isActive(pathname, tab.path) ? "page" : undefined}
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
