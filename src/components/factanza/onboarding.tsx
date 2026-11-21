import { useRef, useState } from "react";
import { ArrowRight, BookOpen, CirclePlay, Headphones, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFactanza } from "./context";
import { Logo, SectionTitle } from "./shared";
import { SwipeDeck } from "./swipe-deck";
import { topics, formats } from "@/data/factanza";
import { toggleValue } from "@/lib/factanza-state";
import { queueEvent } from "@/lib/analytics";
import { AboutYouFields, type AboutYou } from "./about-you";
import { digitalConsentAge, isMinorForConsent } from "@/data/profile-options";

const formatIcons = [BookOpen, CirclePlay, Headphones];

/** Personalizzazione dopo la registrazione: interessi, formati, "Parlaci di te" e consenso. */
export function Onboarding({ redo = false, onDone }: { redo?: boolean; onDone?: () => void }) {
  const { user, update, track } = useFactanza();
  const [step, setStep] = useState(1);
  // Swipe e tempi dei passaggi si inviano alle statistiche solo dopo il consenso.
  const pending = useRef<{ name: string; props: Record<string, string | number | boolean> }[]>([]);
  const stepStart = useRef(Date.now());
  const [about, setAbout] = useState<AboutYou>({
    birthYear: user.birthYear,
    region: user.region,
    occupation: user.occupation,
    gender: user.gender,
    referral: user.referral,
  });
  const minor = isMinorForConsent(about.birthYear);

  const goTo = (next: number) => {
    pending.current.push({
      name: "onboarding_step",
      props: { step, seconds: Math.round((Date.now() - stepStart.current) / 1000) },
    });
    stepStart.current = Date.now();
    setStep(next);
  };
  const finish = (consent: boolean) => {
    update({
      onboarded: true,
      interests,
      formats: selectedFormats,
      ...about,
      analytics: consent,
    });
    if (consent) {
      // Consenso appena dato: inviamo anche swipe e tempi dei passaggi.
      goTo(step);
      const path = window.location.pathname;
      for (const event of pending.current) queueEvent({ ...event, path });
      queueEvent({ name: "onboarding_complete", path, props: { consent: true } });
    }
    onDone?.();
  };
  const [interests, setInterests] = useState<string[]>([]);
  const [answered, setAnswered] = useState(0);
  const [selectedFormats, setSelectedFormats] = useState(user.formats);

  const choose = (topic: string, liked: boolean) => {
    if (user.analytics) track("swipe", { topic, liked });
    else pending.current.push({ name: "swipe", props: { topic, liked } });
    const picked = liked ? [...interests, topic] : interests;
    setInterests(picked);
    const done = answered + 1;
    setAnswered(done);
    if (done < topics.length) return;
    // Ultima carta: lasciamo finire l'animazione prima di proseguire.
    setTimeout(() => {
      if (redo) {
        update({ interests: picked });
        onDone?.();
      } else {
        goTo(2);
      }
    }, 380);
  };

  return (
    <div className="phone">
      <div className="onboarding">
        <Logo />
        <div className="progress-line">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className={i <= step ? "done" : ""} />
          ))}
        </div>

        {step === 1 && (
          <>
            <SectionTitle first="Di cosa" second="TI VA DI PARLARE?" color="yellow" />
            <SwipeDeck topics={topics} onChoose={choose} />
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
                onClick={() => goTo(3)}
              >
                Continua <ArrowRight />
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <SectionTitle first="Parlaci" second="DI TE." color="lime" />
            <p className="body-copy mb-5">
              Ci aiuta a capire chi legge Factanza e a proporti notizie più vicine a te. Solo l’anno
              di nascita è obbligatorio.
            </p>
            <AboutYouFields
              idPrefix="onboarding"
              value={about}
              onChange={(patch) => setAbout((current) => ({ ...current, ...patch }))}
            />
            <div className="onboarding-footer">
              <Button
                variant="sticker"
                className="w-full"
                disabled={about.birthYear === null}
                onClick={() => goTo(4)}
              >
                Continua <ArrowRight />
              </Button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <ShieldCheck className="privacy-icon" />
            <SectionTitle first="La tua voce." second="I TUOI DATI." color="lilac" />
            <p className="body-copy">
              Le tue risposte ai sondaggi diventano statistiche anonime e aggregate. Non vendiamo
              mai i dati del singolo.
            </p>
            {minor ? (
              <p className="body-copy mt-4">
                Hai meno di {digitalConsentAge} anni: non raccogliamo statistiche su come usi l’app.
              </p>
            ) : (
              <p className="body-copy mt-4">
                Se vuoi, registriamo anche in forma anonima come usi l’app (tempo di lettura,
                tocchi, dispositivo) per migliorarla. Puoi cambiare idea quando vuoi dal profilo.
              </p>
            )}
            <p className="hand mt-6">(la fiducia viene prima di tutto)</p>
            <div className="onboarding-footer flex flex-col gap-4">
              {!minor && (
                <Button variant="sticker" className="w-full" onClick={() => finish(true)}>
                  Accetto anche le statistiche <ArrowRight />
                </Button>
              )}
              <Button
                variant={minor ? "sticker" : "facta"}
                className="w-full"
                onClick={() => finish(false)}
              >
                {minor ? "Entra" : "Solo il necessario"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
