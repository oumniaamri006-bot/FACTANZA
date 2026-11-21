/** Errore tipico di una scheda aperta da prima di un nuovo deploy: i file JS vecchi non esistono più. */
export function isStaleChunkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk/i.test(
    message,
  );
}

const reloadKey = "factanza-reload-at";

/** Ricarica la pagina al massimo una volta ogni 10 secondi, per evitare cicli. */
export function reloadOnce() {
  try {
    const last = Number(sessionStorage.getItem(reloadKey) ?? 0);
    if (Date.now() - last < 10_000) return false;
    sessionStorage.setItem(reloadKey, String(Date.now()));
  } catch {
    // sessionStorage non disponibile: ricarica comunque
  }
  window.location.reload();
  return true;
}
