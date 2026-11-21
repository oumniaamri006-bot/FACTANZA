import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authErrorMessage, getSupabase, supabaseConfigured } from "@/lib/supabase";
import { firstTouch } from "@/lib/attribution";
import { Logo, SectionTitle } from "./shared";

type Mode = "signup" | "login";

/** Registrazione e accesso con email e password (email confermata automaticamente). */
export function AuthScreen({ onBack }: { onBack?: () => void }) {
  const [mode, setMode] = useState<Mode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const supabase = getSupabase();
    if (!supabase) {
      setError("Accesso non disponibile in questo momento.");
      return;
    }
    setBusy(true);
    setError("");
    const result =
      mode === "signup"
        ? await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { data: { name: name.trim() || "Facta Lover", first_touch: firstTouch() } },
          })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (result.error) setError(authErrorMessage(result.error.message));
    // Con la sessione attiva, FactanzaProvider carica i dati e l'app prosegue da sola.
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
  };

  return (
    <div className="phone">
      <div className="onboarding">
        <div className="auth-top">
          {onBack && (
            <Button variant="facta" size="icon" aria-label="Torna indietro" onClick={onBack}>
              <ArrowLeft />
            </Button>
          )}
          <Logo />
        </div>

        <SectionTitle
          first={mode === "signup" ? "Entra nella" : "Di nuovo"}
          second={mode === "signup" ? "COMMUNITY." : "QUI."}
          color={mode === "signup" ? "yellow" : "lilac"}
        />

        <div className="tabs" role="tablist" aria-label="Accesso">
          <Button
            variant="ghost"
            role="tab"
            aria-selected={mode === "signup"}
            className={mode === "signup" ? "selected" : ""}
            onClick={() => switchMode("signup")}
          >
            <UserPlus />
            Registrati
          </Button>
          <Button
            variant="ghost"
            role="tab"
            aria-selected={mode === "login"}
            className={mode === "login" ? "selected" : ""}
            onClick={() => switchMode("login")}
          >
            <LogIn />
            Accedi
          </Button>
        </div>

        <form className="auth-form" onSubmit={submit} noValidate>
          {mode === "signup" && (
            <label className="auth-field">
              <span>Come ti chiami?</span>
              <input
                id="auth-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={30}
                autoComplete="nickname"
                placeholder="Facta Lover"
              />
            </label>
          )}
          <label className="auth-field">
            <span>Email</span>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              inputMode="email"
              required
              placeholder="nome@email.it"
            />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              minLength={6}
              required
              placeholder="Almeno 6 caratteri"
            />
          </label>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <Button
            variant="sticker"
            className="w-full"
            type="submit"
            disabled={busy || !supabaseConfigured || !email.trim() || password.length < 6}
          >
            {busy ? "Un attimo…" : mode === "signup" ? "Crea l’account" : "Accedi"}
            {!busy && <ArrowRight />}
          </Button>
        </form>

        <p className="hand text-center mt-6">
          {mode === "signup"
            ? "(nessuna email da confermare: entri subito)"
            : "(ti stavamo aspettando)"}
        </p>
        <p className="demo-label text-center">
          Le tue risposte ai sondaggi restano anonime e aggregate. Non vendiamo mai i dati del
          singolo.
        </p>
      </div>
    </div>
  );
}
