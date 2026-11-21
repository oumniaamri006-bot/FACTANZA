import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Award, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, Avatar, SectionTitle, pageHead } from "@/components/factanza/shared";
import { useFactanza } from "@/components/factanza/context";
import { fetchLeaderboard, positionMessage, type LeaderboardRow } from "@/lib/games/api";

export const Route = createFileRoute("/classifica")({
  head: () =>
    pageHead(
      "Classifica settimanale",
      "La classifica dei minigiochi Factanza, da lunedì a domenica.",
    ),
  component: Leaderboard,
});

function Leaderboard() {
  const { session, user } = useFactanza();
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);

  useEffect(() => {
    if (session) void fetchLeaderboard("generale").then(setRows);
  }, [session]);

  // Sul podio solo chi ha punti; chi non ha ancora giocato resta in elenco con 0.
  const podium = (rows ?? []).filter((row) => row.rank <= 3 && row.points > 0).slice(0, 3);
  const rest = (rows ?? []).filter((row) => !podium.includes(row));

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
                    {row.rank <= 10 && row.points > 0 && <span className="rank-badge">TOP 10</span>}
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
          ha indovinato più Notizie del giorno. Non vuoi comparire col tuo nome?{" "}
          <Link to="/profilo" search={{ tab: "impostazioni" }}>
            Cambialo nelle impostazioni
          </Link>
          .
        </p>
      </div>
    </AppShell>
  );
}
