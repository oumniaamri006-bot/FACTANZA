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

## Eventi registrati

| Evento                                                                                            | Dati                                                                                             |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `page_view`                                                                                       | pagina                                                                                           |
| `tap`                                                                                             | posizione del tocco (x in % della larghezza, y in px) ed etichetta dell'elemento: per la heatmap |
| `article_read`                                                                                    | articolo, tema, secondi di lettura attiva, scroll massimo (%), `read_id`                         |
| `poll_vote`                                                                                       | quale sondaggio (mai la risposta: quella sta solo in `votes`)                                    |
| `swipe`                                                                                           | tema e sì/no nell'onboarding (inviati solo dopo il consenso)                                     |
| `onboarding_complete`, `feed_tab`, `media_play`, `video_open`, `share`, `offer_open`, `code_copy` | identificativo del contenuto                                                                     |

Il tempo di lettura conta solo con la scheda visibile e attività negli ultimi 30 secondi.

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
- Il consenso alle statistiche è opt-in (onboarding) e si cambia dal profilo.
