import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Flame, Gift, Share2, Trophy, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, SectionTitle, pageHead } from "@/components/factanza/shared";
import { useFactanza } from "@/components/factanza/context";
import { fetchWeekPlays, type GamePlay } from "@/lib/games/api";
import { addDays, gameInfo, gamesForDay, todayInRome, weekStart } from "@/lib/games/schedule";
import {
  dayCompleteBonus,
  inviteBonus,
  maxGameScore,
  streakBonus,
  weeklyTotal,
} from "@/lib/games/scoring";
import { shareSquares } from "@/lib/games/share";
import type { GameKind } from "@/lib/games/types";

export const Route = createFileRoute("/gioca/")({
  head: () =>
    pageHead(
      "Gioca oggi",
      "Una sessione al giorno sulle notizie: un gioco per categoria, circa 3 minuti. Classifica settimanale.",
    ),
  component: PlayToday,
});

const weekdays = ["L", "M", "M", "G", "V", "S", "D"];

function PlayToday() {
  const { session, track } = useFactanza();
  const today = todayInRome();
  const monday = weekStart(today);
  const games = gamesForDay(today);
  const [plays, setPlays] = useState<GamePlay[] | null>(null);
  const [copied, setCopied] = useState<"share" | "invite" | null>(null);

  useEffect(() => {
    if (session) void fetchWeekPlays(monday).then(setPlays);
  }, [session, monday]);

  const played = (day: string, game: GameKind) =>
    plays?.find((p) => p.day === day && p.game === game);
  const todayPlays = games.map((game) => played(today, game));
  const doneCount = todayPlays.filter(Boolean).length;
  const allDone = doneCount === games.length;
  const todayPoints = todayPlays.reduce((sum, play) => sum + (play?.score ?? 0), 0);
  const percents = todayPlays.map((p) => (p ? (p.score * 100) / maxGameScore[p.game] : undefined));
  const nextGame = games.find((game) => !played(today, game));

  const week = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(monday, i);
    const inDay = gamesForDay(day);
    const dayPlays = (plays ?? []).filter((p) => p.day === day);
    return {
      day,
      gamesPlayed: dayPlays.length,
      gamesInDay: inDay.length,
      points: dayPlays.reduce((sum, p) => sum + p.score, 0),
    };
  });
  const daysPlayed = week.filter((d) => d.gamesPlayed > 0).length;
  const total = weeklyTotal(week);
  const nextStreak = daysPlayed < 3 ? 3 : daysPlayed < 5 ? 5 : daysPlayed < 7 ? 7 : null;
  const inviteCode = session?.user.id.slice(0, 8) ?? "";

  const share = async (kind: "share" | "invite") => {
    const origin = window.location.origin;
    const text =
      kind === "share"
        ? `Factanza · Gioca oggi ${today.slice(8, 10)}/${today.slice(5, 7)}\n${shareSquares(percents)} ${todayPoints} punti\nSfidami: ${origin}/?invito=${inviteCode}`
        : `Gioco ogni giorno alle notizie su Factanza: 3 minuti, classifica settimanale. Entra anche tu: ${origin}/?invito=${inviteCode}`;
    track(kind === "share" ? "game_share" : "game_invite", { done: doneCount });
    try {
      if (navigator.share) {
        await navigator.share({ title: "Factanza", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(kind);
    } catch {
      // condivisione annullata
    }
  };

  return (
    <AppShell>
      <div className="page-content">
        <SectionTitle first="Gioca" second="OGGI" color="yellow" />
        <p className="body-copy">
          Una sessione unica:{" "}
          {games.length === 2
            ? "la notizia del giorno e il quiz della settimana"
            : "un gioco per ogni categoria"}
          , uno dopo l’altro. Circa 3 minuti, e ogni risposta ti spiega una notizia.
        </p>

        <div
          className="play-progress"
          aria-label={`${doneCount} giochi su ${games.length} completati`}
        >
          {games.map((game, i) => (
            <span
              key={game}
              className={todayPlays[i] ? "done" : game === nextGame ? "current" : ""}
            />
          ))}
        </div>
        <p className="play-progress-label">
          <strong>
            {doneCount}/{games.length}
          </strong>{" "}
          completati · {todayPoints} punti oggi
          {allDone
            ? ` · +${dayCompleteBonus} giornata completa`
            : ` · +${dayCompleteBonus} se li fai tutti`}
        </p>

        <ol className="play-list">
          {games.map((game, i) => {
            const play = todayPlays[i];
            const info = gameInfo[game];
            return (
              <li key={game}>
                <div
                  className={`play-card ${play ? "done" : ""} ${game === nextGame ? "next" : ""}`}
                >
                  <span className="play-number">{play ? <Check /> : i + 1}</span>
                  <span className="play-text">
                    <span className="play-family">{info.family}</span>
                    <strong>{info.title}</strong>
                    <span>{info.blurb}</span>
                  </span>
                  {play && <span className="play-score">{play.score}</span>}
                </div>
              </li>
            );
          })}
        </ol>

        {nextGame && plays && (
          <Button variant="sticker" className="w-full" asChild>
            <Link to="/gioca/sessione">
              {doneCount === 0 ? "Inizia la sessione" : "Riprendi la sessione"} <ArrowRight />
            </Link>
          </Button>
        )}

        {allDone && (
          <div className="play-reward">
            <span className="sticker yellow">SEMPRE SUL PEZZO</span>
            <p>
              Hai finito i giochi di oggi: <strong>{todayPoints + dayCompleteBonus} punti</strong>{" "}
              con il bonus. Torna domani per tenere viva la serie.
            </p>
            <p className="play-share-preview" aria-hidden>
              {shareSquares(percents)}
            </p>
            <Button variant="sticker" className="w-full" onClick={() => void share("share")}>
              <Share2 />{" "}
              {copied === "share" ? "Copiato! Incollalo a chi vuoi" : "Condividi il risultato"}
            </Button>
          </div>
        )}

        <h2 className="subsection-title mt-8">La tua settimana</h2>
        <div className="play-week">
          {week.map((d, i) => (
            <span
              key={d.day}
              className={`${d.gamesPlayed >= d.gamesInDay ? "full" : d.gamesPlayed ? "part" : ""} ${d.day === today ? "today" : ""}`}
            >
              <em>{weekdays[i]}</em>
              {d.gamesPlayed ? d.points : d.day > today ? "" : "–"}
            </span>
          ))}
        </div>
        <p className="play-streak">
          <Flame /> {daysPlayed} {daysPlayed === 1 ? "giorno" : "giorni"} di gioco · bonus costanza
          +{streakBonus(daysPlayed)}
          {nextStreak && ` (a ${nextStreak} giorni: +${streakBonus(nextStreak)})`}
        </p>
        <div className="play-total">
          <span>Totale settimana</span>
          <strong>{total} punti</strong>
        </div>
        <Button variant="facta" className="w-full mt-3" asChild>
          <Link to="/classifica">
            <Trophy /> Classifica settimanale
          </Link>
        </Button>

        <div className="play-invite">
          <UserPlus />
          <div>
            <strong>Invita i tuoi amici</strong>
            <p>
              +30 punti per ogni amico che si iscrive col tuo link e gioca questa settimana (massimo{" "}
              {inviteBonus(99)} punti). La classifica resta individuale.
            </p>
            <Button variant="facta" size="sm" onClick={() => void share("invite")}>
              {copied === "invite" ? "Link copiato!" : "Manda l’invito"}
            </Button>
          </div>
        </div>

        <div className="play-prize">
          <Gift />
          <p>
            <strong>Premi della settimana:</strong> badge per podio e top 10, e uno spazio per i
            premi dei brand partner.
          </p>
          <span className="demo-label">Premi in arrivo · demo</span>
        </div>
        <p className="hand text-center mt-4">(la settimana si azzera ogni lunedì)</p>
        <Link to="/community" className="play-community">
          Vuoi parlarne con gli altri? Vai alla community →
        </Link>
      </div>
    </AppShell>
  );
}
