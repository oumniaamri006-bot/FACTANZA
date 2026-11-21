import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, PageTitle, pageHead } from "@/components/factanza/shared";
import { digitalConsentAge } from "@/data/profile-options";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead(
      "Informativa privacy",
      "Quali dati raccoglie l’app Factanza, perché, per quanto tempo e come puoi gestirli.",
    ),
  component: Privacy,
});

/** Informativa privacy (art. 13 GDPR), leggibile anche senza account. */
function Privacy() {
  return (
    <div className="phone">
      <header className="app-header">
        <Link to="/" aria-label="Factanza, home">
          <Logo />
        </Link>
      </header>
      <div className="page-content privacy">
        <div className="back-bar">
          <Button variant="facta" size="icon" asChild>
            <Link to="/" aria-label="Torna indietro">
              <ArrowLeft />
            </Link>
          </Button>
          <span>Torna all’app</span>
        </div>
        <PageTitle>Informativa privacy</PageTitle>
        <p className="body-copy">
          Questa app è un prototipo realizzato dal team del progetto Factanza durante un hackathon.
          Qui trovi quali dati raccogliamo, perché e come puoi gestirli.
        </p>

        <h2>Dati dell’account</h2>
        <p>
          Email e password (conservata cifrata) per farti accedere. Nome che scegli, interessi,
          formati preferiti e i dati che indichi in “Parlaci di te”: anno di nascita, regione, cosa
          fai, genere e come ci hai conosciuto (solo l’anno di nascita è obbligatorio). Salviamo
          anche da quale sito o campagna sei arrivatə la prima volta e la data dell’ultimo accesso.
        </p>
        <p>
          <strong>Perché:</strong> per farti usare l’app e personalizzare le notizie.{" "}
          <strong>Base giuridica:</strong> il servizio che ci chiedi creando l’account.
        </p>

        <h2>Voti e sondaggi</h2>
        <p>
          Le tue risposte alla domanda del giorno, ai sondaggi degli articoli e ai voti dei live. Le
          vedi solo tu; agli altri mostriamo solo percentuali aggregate e anonime. Alcune domande
          possono riguardare opinioni politiche: non le usiamo mai per profilarti e non entrano
          nelle statistiche d’uso.
        </p>

        <h2>Statistiche d’uso (solo con il tuo consenso)</h2>
        <p>
          Se accetti, registriamo come usi l’app per migliorarla: pagine visitate, tempo di lettura
          e quanto scorri, tocchi sullo schermo (per le mappe di calore), notizie viste e aperte,
          contenuti avviati, tipo di dispositivo, sistema, browser, lingua e dimensioni dello
          schermo.
        </p>
        <p>
          <strong>Non raccogliamo</strong> indirizzo IP, posizione, impronta del dispositivo né il
          testo che scrivi. Sotto i {digitalConsentAge} anni le statistiche d’uso sono disattivate.{" "}
          <strong>Base giuridica:</strong> il tuo consenso, che puoi ritirare in ogni momento dal
          profilo.
        </p>

        <h2>Dove sono i dati e per quanto</h2>
        <p>
          I dati sono salvati su Supabase (server nel Regno Unito, Paese con decisione di
          adeguatezza UE) e l’app è ospitata su Vercel. Li conserviamo finché tieni l’account e
          comunque non oltre la fine della sperimentazione. Non vendiamo né cediamo i dati a terzi.
        </p>

        <h2>I tuoi diritti</h2>
        <ul>
          <li>
            <strong>Accesso e portabilità:</strong> “Scarica i miei dati” nel profilo.
          </li>
          <li>
            <strong>Rettifica:</strong> modifica nome e dati personali dal profilo.
          </li>
          <li>
            <strong>Cancellazione:</strong> “Elimina il mio account” nel profilo cancella tutto.
          </li>
          <li>
            <strong>Revoca del consenso:</strong> spegni le statistiche d’uso dal profilo.
          </li>
        </ul>
        <p>
          Per qualsiasi domanda puoi rivolgerti al team del progetto. Hai anche diritto di
          presentare reclamo al Garante per la protezione dei dati personali.
        </p>

        <h2>Minori</h2>
        <p>
          Per usare l’app devi avere almeno {digitalConsentAge} anni oppure il consenso di un
          genitore.
        </p>
        <p className="demo-label">Ultimo aggiornamento: 21 novembre 2026.</p>
      </div>
    </div>
  );
}
