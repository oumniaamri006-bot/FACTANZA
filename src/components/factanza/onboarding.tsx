import { useState } from "react";
import { motion, useReducedMotion, useMotionValue, useTransform } from "framer-motion";
import {
  ArrowRight,
  X,
  Heart,
  BookOpen,
  CirclePlay,
  Headphones,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFactanza } from "./context";
import { CategoryIcon, Logo, SectionTitle } from "./shared";
import { collage, topics, formats } from "@/data/factanza";
import { toggleValue } from "@/lib/factanza-state";

const formatIcons = [BookOpen, CirclePlay, Headphones];

export function Onboarding({ redo = false, onDone }: { redo?: boolean; onDone?: () => void }) {
  const { user, update } = useFactanza();
  const [step, setStep] = useState(redo ? 1 : 0);
  const [index, setIndex] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState(user.formats);
  const reduced = useReducedMotion();
  const dragX = useMotionValue(0);
  const rotate = useTransform(dragX, [-180, 0, 180], [-15, 0, 15]);
  const yesOpacity = useTransform(dragX, [0, 60], [0, 1]);
  const noOpacity = useTransform(dragX, [-60, 0], [1, 0]);
  const topic = topics[index];

  const choose = (liked: boolean) => {
    dragX.set(0);
    const picked = liked && topic ? [...interests, topic] : interests;
    setInterests(picked);
    if (index < topics.length - 1) {
      setIndex(index + 1);
      return;
    }
    if (redo) {
      update({ interests: picked });
      onDone?.();
    } else {
      setStep(2);
    }
  };

  if (step === 0) {
    return (
      <div className="phone">
        <div className="splash">
          <Logo />
          <div className="splash-copy">
            <h1>
              L'informazione
              <br />
              che crea
              <br />
              <span className="text-yellow">(in)dipendenza.</span>
            </h1>
            <span className="hand">(quella buona) ↗</span>
          </div>
          <img className="splash-art" src={collage} alt="Collage di giovani, microfono e notizie" />
          <div className="splash-bottom">
            <p>NON SOLO NEWS.</p>
            <span className="sticker yellow">LA TUA VOCE.</span>
            <Button variant="sticker" onClick={() => setStep(1)}>
              Inizia <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone">
      <div className="onboarding">
        <Logo />
        <div className="progress-line">
          {[1, 2, 3].map((i) => (
            <span key={i} className={i <= step ? "done" : ""} />
          ))}
        </div>

        {step === 1 && (
          <>
            <SectionTitle first="Di cosa" second="TI VA DI PARLARE?" color="yellow" />
            <div className="flex justify-between text-xs mb-5">
              <span>I tuoi interessi, il tuo feed.</span>
              <span>
                {index + 1} / {topics.length}
              </span>
            </div>
            <motion.div
              key={index}
              className="swipe-card pop-bg"
              style={{ x: dragX, rotate }}
              drag={reduced ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={(_, info) => {
                if (info.offset.x > 70) choose(true);
                if (info.offset.x < -70) choose(false);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              aria-label={`Tema: ${topic}`}
            >
              {topic && <CategoryIcon topic={topic} className="swipe-art" />}
              <motion.span className="swipe-stamp" style={{ opacity: yesOpacity }}>
                SÌ
              </motion.span>
              <motion.span className="swipe-stamp reject" style={{ opacity: noOpacity }}>
                NO
              </motion.span>
            </motion.div>
            <div className="swipe-actions">
              <Button variant="facta" aria-label="Non mi interessa" onClick={() => choose(false)}>
                <X className="text-magenta" />
              </Button>
              <Button variant="facta" aria-label="Mi interessa" onClick={() => choose(true)}>
                <Heart className="text-primary" />
              </Button>
            </div>
            <p className="hand text-center">(segui quello che ti accende)</p>
          </>
        )}

        {step === 2 && (
          <>
            <SectionTitle first="Le notizie" second="A MODO TUO" />
            <p className="body-copy">Come ti piace informarti?</p>
            <div className="format-options">
              {formats.map((format, i) => {
                const Icon = formatIcons[i] ?? BookOpen;
                const picked = selectedFormats.includes(format);
                return (
                  <Button
                    key={format}
                    variant="facta"
                    className={picked ? "picked" : ""}
                    aria-pressed={picked}
                    onClick={() => setSelectedFormats(toggleValue(selectedFormats, format))}
                  >
                    <Icon />
                    {format}
                    {picked && <Check className="ml-auto" />}
                  </Button>
                );
              })}
            </div>
            <div className="onboarding-footer">
              <Button
                variant="sticker"
                className="w-full"
                disabled={!selectedFormats.length}
                onClick={() => setStep(3)}
              >
                Continua <ArrowRight />
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <ShieldCheck className="privacy-icon" />
            <SectionTitle first="La tua voce." second="I TUOI DATI." color="lilac" />
            <p className="body-copy">
              Le tue risposte diventano statistiche anonime e aggregate. Non vendiamo mai i dati del
              singolo.
            </p>
            <p className="hand mt-6">(la fiducia viene prima di tutto)</p>
            <div className="onboarding-footer">
              <Button
                variant="sticker"
                className="w-full"
                onClick={() => {
                  update({ onboarded: true, interests, formats: selectedFormats });
                  onDone?.();
                }}
              >
                Accetto ed entro <ArrowRight />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
