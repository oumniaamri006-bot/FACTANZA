import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Gift, Share2, Trophy, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, pageHead } from "@/components/factanza/shared";
import { useFactanza } from "@/components/factanza/context";
import { StreakFlame } from "@/components/games/look";
import { lookOf } from "@/components/games/tones";
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
import { currentStreak, streakMessage, streakMilestones } from "@/lib/games/streak";

export const Route = createFileRoute("/gioca/")({
  head: () =>
    pageHead(
      "Gioca oggi",
      "Il quiz quotidiano sulle notizie: 4 giochi, circa 3 minuti. Tieni viva la tua serie.",
    ),
  component: PlayToday,
});

const weekdays = ["L", "M", "M", "G", "V", "S", "D"];

function PlayToday() {
  const { session, track } = useFactanza();
  const today = todayInRome();
  const monday = weekStart(today);
  const games = gamesForDay(today);
  const [history, setHistory] = useState<GamePlay[] | null>(null);
  const [copied, setCopied] = useState<"share" | "invite" | null>(null);

  useEffect(() => {
    if (session) void fetchWeekPlays(addDays(today, -60)).then(setHistory);
  }, [session, today]);

  const plays = history?.filter((p) => p.day >= monday) ?? null;
  const streak = currentStreak(
    (history ?? []).map((p) => p.day),
    today,
  );
  const todayPlays = games.map((game) => plays?.find((p) => p.day === today && p.game === game));
  const doneCount = todayPlays.filter(Boolean).length;
  const allDone = doneCount === games.length;
  const todayPoints = todayPlays.reduce((sum, play) => sum + (play?.score ?? 0), 0);
  const percents = todayPlays.map((p) => (p ? (p.score * 100) / maxGameScore[p.game] : undefined));

  const week = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(monday, i);
    const dayPlays = (plays ?? []).filter((p) => p.day === day);
    return {
      day,
      gamesPlayed: dayPlays.length,
      gamesInDay: gamesForDay(day).length,
      points: dayPlays.reduce((sum, p) => sum + p.score, 0),
    };
  });
  const daysPlayed = week.filter((d) => d.gamesPlayed > 0).length;
  const total = weeklyTotal(week);
  const inviteCode = session?.user.id.slice(0, 8) ?? "";

  const share = async (kind: "share" | "invite") => {
    const origin = window.location.origin;
    const text =
      kind === "share"
        ? `Factanza · quiz del ${today.slice(8, 10)}/${today.slice(5, 7)}\n${shareSquares(percents)} ${todayPoints} punti · 🔥 ${streak.count} ${streak.count === 1 ? "giorno" : "giorni"} di fila\nSfidami: ${origin}/?invito=${inviteCode}`
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
        {/* La serie: il cuore della pagina. */}
        <section
          className={`streak-hero ${streak.playedToday ? "lit" : streak.atRisk ? "risk" : ""}`}
        >
          <div className="streak-hero-top">
            <StreakFlame count={streak.count} lit={streak.playedToday} />
            <div>
              <strong className="streak-hero-title">
                {streak.count === 1 ? "giorno di fila" : "giorni di fila"}
              </strong>
              <p>{history ? streakMessage(streak) : "Un attimo…"}</p>
            </div>
          </div>
          <div className="streak-week" aria-label="I tuoi giorni di gioco questa settimana">
            {week.map((d, i) => (
              <span
                key={d.day}
                className={`${d.gamesPlayed ? "on" : ""} ${d.day === today ? "today" : ""} ${d.day > today ? "future" : ""}`}
              >
                <Flame />
                <em>{weekdays[i]}</em>
              </span>
            ))}
          </div>
          <div className="streak-goals" aria-label="Bonus della serie">
            {streakMilestones.map((target) => (
              <span key={target} className={daysPlayed >= target ? "reached" : ""}>
                {target} giorni · +{streakBonus(target)}
              </span>
            ))}
          </div>
        </section>

        {plays && !allDone && (
          <>
            {/* Le carte coperte: i giochi si scoprono solo giocando. */}
            <div className="mystery-cards" aria-hidden>
              {games.map((game, i) => (
                <motion.span
                  key={game}
                  className={`mystery-card tone-${lookOf(gameInfo[game].family).tone} ${todayPlays[i] ? "played" : ""}`}
                  initial={{ y: 30, opacity: 0, rotate: 0 }}
                  animate={{ y: 0, opacity: 1, rotate: [-8, 4, -3, 7][i] ?? 0 }}
                  transition={{ delay: 0.1 * i, type: "spring" }}
                >
                  {todayPlays[i] ? todayPlays[i]?.score : "?"}
                </motion.span>
              ))}
            </div>
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Button variant="sticker" size="lg" className="w-full play-start" asChild>
                <Link to="/gioca/sessione">
                  {doneCount === 0 ? "GIOCA ORA" : `RIPRENDI · ${doneCount}/${games.length}`}{" "}
                  <ArrowRight />
                </Link>
              </Button>
            </motion.div>
            <p className="hand text-center mt-3">
              ({games.length} giochi a sorpresa · circa 3 minuti · +{dayCompleteBonus} se li finisci
              tutti)
            </p>
          </>
        )}

        {/* A quiz finito i giochi si svelano, con il punteggio di ognuno. */}
        {allDone && (
          <>
            <div className="play-reward">
              <span className="sticker yellow">SEMPRE SUL PEZZO</span>
              <p>
                Quiz di oggi fatto: <strong>{todayPoints + dayCompleteBonus} punti</strong> con il
                bonus. Torna domani per non spegnere la fiamma.
              </p>
              <p className="play-share-preview" aria-hidden>
                {shareSquares(percents)}
              </p>
              <Button variant="sticker" className="w-full" onClick={() => void share("share")}>
                <Share2 />{" "}
                {copied === "share" ? "Copiato! Incollalo a chi vuoi" : "Condividi il risultato"}
              </Button>
            </div>
            <ol className="play-list">
              {games.map((game, i) => {
                const info = gameInfo[game];
                const look = lookOf(info.family);
                return (
                  <li key={game}>
                    <div className={`play-card tone-${look.tone}`}>
                      <span className="play-number">
                        <look.icon />
                      </span>
                      <span className="play-text">
                        <span className="play-family">{info.family}</span>
                        <strong>{info.title}</strong>
                        <span>{info.blurb}</span>
                      </span>
                      <span className="play-score">{todayPlays[i]?.score ?? 0}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </>
        )}

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
        <p className="hand text-center mt-4">(la classifica si azzera ogni lunedì)</p>
        <Link to="/community" className="play-community">
          Vuoi parlarne con gli altri? Vai alla community →
        </Link>
      </div>
    </AppShell>
  );
}
