import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Award, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, Avatar, SectionTitle, pageHead } from "@/components/factanza/shared";
import { useFactanza } from "@/components/factanza/context";
import { categories } from "@/data/categories";
import { fetchLeaderboard, positionMessage, type LeaderboardRow } from "@/lib/games/api";

type Scope = "generale" | "livello" | "tema";

export const Route = createFileRoute("/classifica")({
  head: () =>
    pageHead(
      "Classifica settimanale",
      "La classifica dei minigiochi Factanza, da lunedì a domenica.",
    ),
  component: Leaderboard,
});

const levels = [
  { value: "principiante", label: "Principiante" },
  { value: "esperto", label: "Esperto" },
];

function Leaderboard() {
  const { session, user } = useFactanza();
  const [scope, setScope] = useState<Scope>("generale");
  const [level, setLevel] = useState("principiante");
  const [theme, setTheme] = useState<string>(categories[0]?.name ?? "Politica");
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);

  const value = scope === "livello" ? level : scope === "tema" ? theme : undefined;
  useEffect(() => {
    if (!session) return;
    setRows(null);
    void fetchLeaderboard(scope, value).then((data) => {
      setRows(data);
      // Alla prima apertura del livello si mostra quello dell'utente.
      const me = data.find((row) => row.is_me);
      if (scope === "generale" && me && me.level !== level) setLevel(me.level);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, scope, value]);

  const podium = (rows ?? []).filter((row) => row.rank <= 3);
  const rest = (rows ?? []).filter((row) => row.rank > 3);

  return (
    <AppShell>
      <div className="page-content">
        <div className="back-bar">
          <Button variant="facta" size="icon" asChild>
            <Link to="/gioca" aria-label="Torna a Gioca oggi">
              <ArrowLeft />
            </Link>
          </Button>
          <span>Gioca oggi</span>
        </div>
        <SectionTitle first="La classifica" second="DELLA SETTIMANA" color="magenta" />

        <div className="tabs" role="tablist" aria-label="Viste della classifica">
          {(["generale", "livello", "tema"] as const).map((s) => (
            <Button
              key={s}
              variant="ghost"
              role="tab"
              aria-selected={scope === s}
              className={scope === s ? "selected" : ""}
              onClick={() => setScope(s)}
            >
              {s === "generale" ? "Generale" : s === "livello" ? "Livello" : "Tema"}
            </Button>
          ))}
        </div>

        {scope !== "generale" && (
          <div
            className="rank-filters"
            role="group"
            aria-label={scope === "livello" ? "Livello" : "Tema"}
          >
            {(scope === "livello"
              ? levels
              : categories.map((c) => ({ value: c.name, label: c.name }))
            ).map((option) => {
              const active = option.value === value;
              return (
                <Button
                  key={option.value}
                  variant="facta"
                  size="sm"
                  className={active ? "picked" : ""}
                  aria-pressed={active}
                  onClick={() =>
                    scope === "livello" ? setLevel(option.value) : setTheme(option.value)
                  }
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
        )}

        {rows === null ? (
          <p className="body-copy mt-4">Carico la classifica…</p>
        ) : (
          <>
            <p className="rank-position" aria-live="polite">
              {positionMessage(rows)}
            </p>
            {rows.length === 0 && (
              <p className="body-copy">Ancora nessuno in classifica: inizia tu!</p>
            )}

            {podium.length > 0 && (
              <ol className="rank-podium">
                {podium.map((row) => (
                  <li
                    key={`${row.rank}-${row.name}`}
                    className={`place-${row.rank} ${row.is_me ? "me" : ""}`}
                  >
                    <Medal />
                    <Avatar name={row.is_me ? user.name : row.name} />
                    <strong>{row.is_me ? "Tu" : row.name}</strong>
                    <span>{row.points} pt</span>
                    <em className="sticker small yellow">{row.rank}°</em>
                  </li>
                ))}
              </ol>
            )}

            <ol className="rank-list">
              {rest.map((row) => (
                <li key={`${row.rank}-${row.name}`} className={row.is_me ? "me" : ""}>
                  <span className="rank-number">{row.rank}</span>
                  <span className="rank-name">
                    {row.is_me ? "Tu" : row.name}
                    {row.rank <= 10 && <span className="rank-badge">TOP 10</span>}
                  </span>
                  <span className="rank-days">{row.days} gg</span>
                  <strong>{row.points}</strong>
                </li>
              ))}
            </ol>
          </>
        )}

        <div className="play-prize">
          <Award />
          <p>
            <strong>A fine settimana</strong> badge per podio e top 10. Qui compariranno i premi dei
            brand partner.
          </p>
          <span className="demo-label">Premi in arrivo · demo</span>
        </div>
        <p className="rank-note">
          A parità di punti vince chi ha giocato più giorni, poi chi ci ha messo meno tempo, poi chi
          ha indovinato più Notizie del giorno. Livello esperto: almeno 7 giorni di gioco nelle
          settimane precedenti. Non vuoi comparire col tuo nome?{" "}
          <Link to="/profilo" search={{ tab: "impostazioni" }}>
            Cambialo nelle impostazioni
          </Link>
          .
        </p>
      </div>
    </AppShell>
  );
}
