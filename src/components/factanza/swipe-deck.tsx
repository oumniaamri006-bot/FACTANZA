import { useEffect, useState, type CSSProperties } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategoryByName, type Category } from "@/data/categories";
import { news } from "@/data/news";
import { media } from "@/data/factanza";

/** Quanti contenuti ci sono per un tema (notizie + video e podcast). */
function contentCount(topic: string) {
  const articles = news.filter((item) => item.topic === topic).length;
  const episodes = media.filter((item) => item.topic === topic).length;
  return { articles, episodes };
}

function CardFace({ category }: { category: Category }) {
  const { articles, episodes } = contentCount(category.name);
  const style = { "--card-color": `var(${category.color})` } as CSSProperties;
  return (
    <div className="swipe-face" style={style}>
      <div className="swipe-face-art">
        <img src={category.icon} alt="" draggable={false} />
      </div>
      <div className="swipe-face-info">
        <span className="swipe-face-name">{category.name}</span>
        <p>{category.tagline}</p>
        <span className="swipe-face-meta">
          {[
            articles && `${articles} ${articles === 1 ? "notizia" : "notizie"}`,
            episodes && `${episodes} video e podcast`,
          ]
            .filter(Boolean)
            .join(" · ") || "Nuovi contenuti in arrivo"}
        </span>
      </div>
    </div>
  );
}

const exitVariants = {
  enter: { scale: 0.94, y: 14, opacity: 0 },
  center: { scale: 1, y: 0, opacity: 1, transition: { duration: 0.25 } },
  exit: (direction: number) => ({
    x: direction * 460,
    rotate: direction * 24,
    opacity: 0,
    transition: { duration: 0.32 },
  }),
};

function TopCard({
  category,
  onChoose,
}: {
  category: Category;
  onChoose: (liked: boolean) => void;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-16, 0, 16]);
  const yes = useTransform(x, [20, 110], [0, 1]);
  const no = useTransform(x, [-110, -20], [1, 0]);
  return (
    <motion.div
      className="swipe-card top"
      style={{ x, rotate }}
      drag={reduced ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100 || info.velocity.x > 650) onChoose(true);
        else if (info.offset.x < -100 || info.velocity.x < -650) onChoose(false);
      }}
      variants={exitVariants}
      initial="enter"
      animate="center"
      exit="exit"
      aria-label={`Tema: ${category.name}. ${category.tagline}`}
    >
      <CardFace category={category} />
      <motion.span className="swipe-stamp" style={{ opacity: yes }}>
        SÌ!
      </motion.span>
      <motion.span className="swipe-stamp reject" style={{ opacity: no }}>
        NO
      </motion.span>
    </motion.div>
  );
}

/**
 * Mazzo di carte dei temi: trascina a destra (o premi →) se ti interessa, a sinistra (←) se no.
 * Mostra le due carte successive dietro e una barra di pallini con le scelte fatte.
 */
export function SwipeDeck({
  topics,
  onChoose,
}: {
  topics: string[];
  onChoose: (topic: string, liked: boolean) => void;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const cards = topics
    .map((topic) => getCategoryByName(topic))
    .filter((category): category is Category => category !== undefined);
  const current = cards[index];

  const choose = (liked: boolean) => {
    if (!current) return;
    setDirection(liked ? 1 : -1);
    setAnswers((previous) => [...previous, liked]);
    setIndex((previous) => previous + 1);
    onChoose(current.name, liked);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") choose(true);
      if (event.key === "ArrowLeft") choose(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="swipe">
      <div
        className="swipe-progress"
        aria-label={`Tema ${Math.min(index + 1, cards.length)} di ${cards.length}`}
      >
        {cards.map((category, position) => (
          <span
            key={category.slug}
            className={
              position < answers.length
                ? answers[position]
                  ? "yes"
                  : "no"
                : position === index
                  ? "current"
                  : ""
            }
          />
        ))}
      </div>

      <div className="swipe-deck">
        {cards
          .slice(index + 1, index + 3)
          .reverse()
          .map((category) => {
            const depth = cards.indexOf(category) - index;
            return (
              <div key={category.slug} className={`swipe-card back depth-${depth}`} aria-hidden>
                <CardFace category={category} />
              </div>
            );
          })}
        <AnimatePresence custom={direction} initial={false}>
          {current && <TopCard key={current.slug} category={current} onChoose={choose} />}
        </AnimatePresence>
      </div>

      <div className="swipe-actions">
        <div className="swipe-action">
          <Button variant="facta" aria-label="Non mi interessa" onClick={() => choose(false)}>
            <X />
          </Button>
          <span>No, grazie</span>
        </div>
        <div className="swipe-action">
          <Button
            variant="facta"
            className="like"
            aria-label="Mi interessa"
            onClick={() => choose(true)}
          >
            <Heart />
          </Button>
          <span>Mi interessa</span>
        </div>
      </div>
      <p className="swipe-hint">Trascina la carta: → mi interessa · ← no, grazie</p>
    </div>
  );
}
