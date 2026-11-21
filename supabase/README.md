# Database Factanza (Supabase)

Progetto Supabase: `oytcenutjkufcgqcpwua` (regione eu-west-2). Le migrazioni in `migrations/` sono
già applicate, in ordine di nome.

## Tabelle (schema `public`)

| Tabella     | Contenuto                                                                      | Chi può leggere                                       |
| ----------- | ------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `profiles`  | nome, interessi, formati, onboarding, consensi                                 | solo il proprietario                                  |
| `votes`     | risposte a domanda del giorno, sondaggi degli articoli, voto prima/dopo i live | solo il proprietario (aggregati con `poll_results()`) |
| `reminders` | promemoria del calendario eventi                                               | solo il proprietario                                  |
| `events`    | statistiche d'uso, **solo con consenso** (`analytics_consent`)                 | nessuno dall'app (solo inserimento)                   |

Il profilo si crea da solo alla registrazione (trigger `on_auth_user_created`). L'accesso è con
email e password, con **conferma automatica** dell'email (`mailer_autoconfirm`).

## Funzioni

| Funzione                   | A cosa serve                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `poll_results(poll_id)`    | conteggi anonimi delle risposte di un sondaggio (tutti i risultati in app sono reali) |
| `opinion_change(event_id)` | votanti prima/dopo un live e quanti hanno cambiato idea                               |
| `delete_my_account()`      | l'utente elimina account e, a cascata, tutti i suoi dati (GDPR art. 17)               |

Per **azzerare i sondaggi** prima di un lancio: `delete from public.votes;` (SQL Editor).

## Eventi registrati

Solo con consenso e solo da 14 anni in su (controllato anche dalla policy del database).

| Evento                                                                  | Dati                                                                                                                                |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `session_start`                                                         | tipo di dispositivo, sistema, browser (solo famiglie generiche), schermo, lingua, fuso orario, connessione, tema scuro, provenienza |
| `page_view`, `page_time`                                                | pagina; secondi di uso attivo e scroll massimo (%)                                                                                  |
| `tap`                                                                   | posizione del tocco (x in % della larghezza, y in px) ed etichetta dell'elemento: per la heatmap                                    |
| `card_view`, `article_open`                                             | notizia vista nel feed (metà visibile per 1 s) / aperta, con feed e posizione                                                       |
| `article_read`                                                          | articolo, tema, secondi di lettura attiva, scroll massimo (%), `read_id`                                                            |
| `poll_vote`                                                             | quale sondaggio (mai la risposta: quella sta solo in `votes`)                                                                       |
| `swipe`, `onboarding_step`, `onboarding_complete`                       | tema e sì/no; secondi per passaggio (inviati solo dopo il consenso)                                                                 |
| `feed_tab`, `category_open`, `calendar_day`, `reminder`                 | scheda, categoria, giorno, promemoria acceso/spento                                                                                 |
| `media_play`, `media_progress`, `video_open`                            | contenuto; percentuale ascoltata alla chiusura del player                                                                           |
| `live_phase`, `chat_message`                                            | fase del live; lunghezza del messaggio (mai il testo)                                                                               |
| `interests_change`, `share`, `offer_open`, `code_copy`, `profile_nudge` | tema o contenuto coinvolto                                                                                                          |
| `js_error`                                                              | messaggio d'errore (troncato)                                                                                                       |

Il tempo conta solo con la scheda visibile e attività negli ultimi 30 secondi.
**Non raccogliamo**: indirizzo IP, posizione GPS, impronta del dispositivo, testo scritto dagli
utenti, risposte ai sondaggi negli eventi.

## Statistiche (schema `analytics`)

Viste aggregate, non esposte all'API: si leggono dal pannello Supabase (Table Editor → schema
`analytics`, oppure SQL Editor).

| Vista                       | Domanda a cui risponde                                   |
| --------------------------- | -------------------------------------------------------- |
| `reading_minutes_daily`     | Quanti minuti si leggono al giorno? (metrica guida)      |
| `article_stats`             | Quali articoli si leggono, per quanto, fino a che punto? |
| `poll_summary`              | Come si dividono le risposte ai sondaggi?                |
| `opinion_change`            | Quanti cambiano idea dopo un live?                       |
| `heatmap_taps`, `top_taps`  | Dove toccano le persone?                                 |
| `daily_activity`            | Utenti attivi, sessioni e pagine viste al giorno         |
| `swipe_topics`, `interests` | Quali temi interessano?                                  |
| `event_counts`              | Riepilogo di tutti gli eventi                            |

Esempio: `select * from analytics.reading_minutes_daily;`

## Privacy

- Le risposte ai sondaggi possono rivelare opinioni politiche (art. 9 GDPR): si usano solo in
  forma aggregata e non entrano negli eventi.
- I visitatori senza account non accedono a nessuna tabella.
- Il consenso alle statistiche è opt-in (onboarding) e si cambia dal profilo. Sotto i 14 anni
  (età del consenso digitale in Italia) le statistiche d'uso sono disattivate.
