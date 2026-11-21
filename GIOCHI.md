# Minigiochi Factanza — regole e ipotesi

Sezione **Gioca oggi** (`/gioca`): una sessione al giorno di 4 minigiochi giocati di fila, circa 3 minuti in tutto, ognuno di
45 secondi al massimo. Gioco individuale, **un solo tentativo per gioco al giorno**. Dopo ogni
risposta c'è una spiegazione di 1–2 righe con la fonte: è la parte informativa del gioco.

## Struttura della settimana

Ogni giorno: **La notizia del giorno** (fisso) + 3 giochi a rotazione (numeri · persone e
parole · tempo e luoghi).

| Giorno    | Numeri                                           | Persone e parole    | Tempo e luoghi    |
| --------- | ------------------------------------------------ | ------------------- | ----------------- |
| Lunedì    | Cos'è più grande?                                | Chi l'ha detto?     | Prima o dopo?     |
| Martedì   | Vero o falso?                                    | Cosa significa?     | Dove succede?     |
| Mercoledì | Indovina la cifra                                | Chi è chi?          | Metti in ordine   |
| Giovedì   | Cos'è più grande?                                | Titolo o clickbait? | Dove succede?     |
| Venerdì   | Vero o falso?                                    | Chi l'ha detto?     | Prima o dopo?     |
| Sabato    | Indovina la cifra                                | Cosa significa?     | Collega i puntini |
| Domenica  | **Quiz della settimana** al posto dei tre giochi |                     |                   |

Il codice è in `src/lib/games/schedule.ts`; il giorno è quello di Roma.

## Punteggi (`src/lib/games/scoring.ts`)

**Ogni gioco ha una sola domanda** (decisione del team, 21/11/2026): le domande dei set in
`content.ts` ruotano un giorno dopo l'altro.

| Gioco                 | Regola (una domanda)                                                                       | Max |
| --------------------- | ------------------------------------------------------------------------------------------ | --- |
| La notizia del giorno | 70 se giusta + fino a 30 di bonus velocità (lineare su 45 s)                               | 100 |
| Indovina la cifra     | errore ≤5% 100 · ≤10% 80 · ≤20% 60 · ≤35% 40 · ≤50% 20                                     | 100 |
| Chi è chi?            | indizi 100/80/60/40/20; risposta sbagliata = indizio successivo                            | 100 |
| Dove succede?         | Paese esatto 100 · entro 1.000 km 60 · stesso continente 20                                | 100 |
| Metti in ordine       | 4 elementi, 25 per posizione giusta                                                        | 100 |
| Tutti gli altri       | risposta giusta 100, sbagliata o tempo scaduto 0 (Cos'è più grande 10 s, Vero o falso 8 s) | 100 |

Il tempo dà punti solo nella Notizia del giorno; altrove serve per gli spareggi.

**Bonus**: giornata completa +50 · costanza nella settimana 3 giorni +50, 5 giorni +100,
7 giorni +200 (vale solo il più alto) · inviti +30 per amico (massimo 3).

**Classifica settimanale** (lunedì–domenica): una sola classifica generale (niente livelli né
temi, su richiesta del team). Spareggi: più giorni giocati, meno tempo totale, più Notizie del giorno indovinate.
L'utente vede sempre la sua posizione ("Sei 128° su 5400: ti mancano 42 punti per i primi 100").

## Ipotesi (dove il brief non era chiaro)

1. **Massimo settimanale 3.150**: 6 giorni × (4 × 100 + 50) + domenica (2 × 100 + 50) + 200 di
   costanza.
2. **Giornata completa la domenica** = Notizia + Quiz (2 giochi, una domanda ciascuno).
3. **Quiz svelato giocando**: "Gioca oggi" mostra solo "Inizia il quiz"; i giochi del giorno e i
   loro punteggi compaiono solo a quiz finito.
4. **Una sola sessione**: i giochi non si scelgono uno per uno. `/gioca/sessione` li fa giocare
   di fila, uno per categoria (Ogni giorno, Numeri, Persone e parole, Tempo e luoghi); la
   domenica Notizia + Quiz. Se si esce a metà si riprende dal gioco successivo.
5. **Livelli e temi tolti** dalla classifica (la funzione SQL li supporta ancora, non usati).
6. **Bonus inviti**: 30 punti per ogni amico che si iscrive col link `?invito=codice` e gioca
   nella stessa settimana, massimo 3 (90 punti). La classifica resta individuale.
7. **Antibaro**: il punteggio si calcola nell'app; il database controlla un tentativo al giorno,
   il punteggio massimo e un tempo minimo plausibile (1 s, 0,4 s a elemento in Metti in
   ordine). Gli account doppi non si possono escludere del tutto senza dati
   identificativi (che non raccogliamo): servirebbe la verifica del numero di telefono.
8. **Contenuti**: tutte le domande dei set di ogni gioco ruotano una al giorno, quindi si ripetono finché la redazione non ne aggiunge
   altri in `src/data/games/content.ts`. Le cifre da indovinare evitano gli anni (troppo facili
   col cursore).
9. **Premi**: badge per podio e top 10 e uno spazio per i premi dei brand partner, segnalato come
   demo. Ricompensa simbolica per chi completa la giornata: lo sticker "Sempre sul pezzo".
10. **Nome in classifica**: chi non vuole comparire lo disattiva in Impostazioni → Giochi e
    classifica e appare come "Utente anonimo".

## Immagini

Solo asset Factanza (copertine delle notizie e degli episodi) o foto con licenza libera da
Wikimedia Commons, salvate in `src/assets/games/` con autore e licenza in
`src/data/games/credits.json` e mostrate sotto la foto. Niente minori; per le persone solo foto
ufficiali o pubbliche. Se una foto non c'è il gioco mostra un'icona neutra.

## Aggiungere contenuti

Aggiungi un set in `gameCatalog` (`src/data/games/content.ts`) con tema, domande, spiegazione e
fonte. Il test `src/test/games.test.ts` controlla numero di domande, risposte valide, fonti e
Paesi della mappa.
