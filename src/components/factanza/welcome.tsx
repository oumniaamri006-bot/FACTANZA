import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthScreen } from "./auth";
import { IconCollage, Logo } from "./shared";

/** Prima schermata per chi non ha ancora fatto l'accesso: splash e poi registrazione/login. */
export function Welcome() {
  const [step, setStep] = useState<"splash" | "auth">("splash");
  if (step === "auth") return <AuthScreen onBack={() => setStep("splash")} />;
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
        <IconCollage className="splash-art" label="Collage di icone dei temi Factanza" />
        <div className="splash-bottom">
          <p>NON SOLO NEWS.</p>
          <span className="sticker yellow">LA TUA VOCE.</span>
          <Button variant="sticker" onClick={() => setStep("auth")}>
            Inizia <ArrowRight />
          </Button>
          <p className="splash-challenge">
            Dentro: 4 minigiochi al giorno e la classifica settimanale.
          </p>
        </div>
      </div>
    </div>
  );
}
