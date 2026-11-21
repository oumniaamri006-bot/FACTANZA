// Pagina di errore statica restituita dal server quando il rendering SSR fallisce.
// Riprende i colori e lo stile pop-art di Factanza senza dipendere dal CSS dell'app.
export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <title>Questa pagina non si è caricata | Factanza</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #b9e3f7; color: #1b1f5e; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 24rem; width: 100%; background: #fff; border: 2px solid #000; border-radius: 8px; box-shadow: 5px 5px 0 #000; padding: 2rem 1.5rem; }
      .sticker { display: inline-block; background: #e6007e; color: #fff; font: 700 2.5rem/1.1 Impact, "Anton", sans-serif; padding: 4px 12px; transform: rotate(-2deg); box-shadow: 3px 3px 0 #000; }
      h1 { font-size: 1.5rem; margin: 1.25rem 0 0.5rem; }
      p { color: #555; margin: 0 0 1.5rem; }
      .actions { display: flex; flex-direction: column; gap: 0.75rem; }
      a, button { padding: 0.7rem 1rem; border: 2px solid #000; border-radius: 6px; box-shadow: 3px 3px 0 #000; font: 600 15px system-ui, sans-serif; cursor: pointer; text-decoration: none; text-align: center; color: #000; background: #fff; }
      .primary { background: #ffe14d; }
    </style>
  </head>
  <body>
    <div class="card">
      <span class="sticker">OPS!</span>
      <h1>Questa pagina non si è caricata.</h1>
      <p>Qualcosa è andato storto da parte nostra. Riprova o torna alla home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Riprova</button>
        <a href="/">Torna alle notizie</a>
      </div>
    </div>
  </body>
</html>`;
}
