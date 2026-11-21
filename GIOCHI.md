# Minigiochi Factanza — regole e ipotesi

Sezione **Gioca oggi** (`/gioca`): 4 minigiochi al giorno, circa 3 minuti in tutto, ognuno di
45 secondi al massimo. Gioco individuale, **un solo tentativo per gioco al giorno**. Dopo ogni
risposta c'è una spiegazione di 1–2 righe con la fonte: è la parte informativa del gioco.

## Struttura della settimana

Ogni giorno: **La notizia del giorno** (fisso) + 3 giochi a rotazione (numeri · persone e
parole · tempo e luoghi).

| Giorno    | Numeri                                                        | Persone e parole    | Tempo e luoghi    |
| --------- | ------------------------------------------------------------- | ------------------- | ----------------- |
| Lunedì    | Cos'è più grande?                                             | Chi l'ha detto?     | Prima o dopo?     |
| Martedì   | Vero o falso?                                                 | Cosa significa?     | Dove succede?     |
| Mercoledì | Indovina la cifra                                             | Chi è chi?          | Metti in ordine   |
| Giovedì   | Cos'è più grande?                                             | Titolo o clickbait? | Dove succede?     |
| Venerdì   | Vero o falso?                                                 | Chi l'ha detto?     | Prima o dopo?     |
| Sabato    | Indovina la cifra                                             | Cosa significa?     | Collega i puntini |
| Domenica  | **Quiz della settimana** (10 domande) al posto dei tre giochi |                     |                   |

Il codice è in `src/lib/games/schedule.ts`; il giorno è quello di Roma.

## Punteggi (`src/lib/games/scoring.ts`)

| Gioco                 | Regola                                                                          | Max |
| --------------------- | ------------------------------------------------------------------------------- | --- |
| La notizia del giorno | 70 se giusta + fino a 30 di bonus velocità (lineare su 45 s)                    | 100 |
| Cos'è più grande?     | 5 coppie, 10 s l'una, 20 a risposta                                             | 100 |
| Indovina la cifra     | 4 cursori; errore ≤5% 25 · ≤10% 20 · ≤20% 15 · ≤35% 10 · ≤50% 5                 | 100 |
| Vero o falso?         | 5 affermazioni, 8 s l'una, 20 a risposta                                        | 100 |
| Chi l'ha detto?       | 3 frasi, 4 nomi, 30 a frase + 10 se tutte giuste                                | 100 |
| Chi è chi?            | indizi 100/80/60/40/20; risposta sbagliata = indizio successivo                 | 100 |
| Cosa significa?       | 4 parole × 3 definizioni, 25 a parola                                           | 100 |
| Titolo o clickbait?   | 5 coppie, 20 a risposta                                                         | 100 |
| Prima o dopo?         | 5 coppie, 20 a risposta                                                         | 100 |
| Dove succede?         | 4 tocchi sulla mappa: Paese esatto 25 · entro 1.000 km 15 · stesso continente 5 | 100 |
| Metti in ordine       | 4 elementi, 25 per posizione giusta                                             | 100 |
| Collega i puntini     | 4 cause → effetti, 25 a collegamento                                            | 100 |
| Quiz della settimana  | 10 domande × 40                                                                 | 400 |

Il tempo dà punti solo nella Notizia del giorno; altrove serve per gli spareggi.

**Bonus**: giornata completa +50 · costanza nella settimana 3 giorni +50, 5 giorni +100,
7 giorni +200 (vale solo il più alto) · inviti +30 per amico (massimo 3).

**Classifica settimanale** (lunedì–domenica): viste Generale, Livello (principiante, esperto) e
Tema. Spareggi: più giorni giocati, meno tempo totale, più Notizie del giorno indovinate.
L'utente vede sempre la sua posizione ("Sei 128° su 5400: ti mancano 42 punti per i primi 100").

## Ipotesi (dove il brief non era chiaro)

1. **Massimo settimanale 3.450, non 3.350.** Con le regole del brief: 6 giorni × (4 × 100 + 50)
   = 2.700; domenica 100 + 400 + 50 = 550; costanza 200 → 3.450. Il 3.350 del brief torna solo se
   la domenica non avesse il bonus giornata completa (o se il quiz valesse 300). Abbiamo tenuto le
   regole dei singoli giochi e documentato la differenza: se preferite 3.350 basta togliere il
   bonus giornata completa alla domenica (in `scoring.ts` e nella funzione SQL).
2. **Giornata completa la domenica** = Notizia + Quiz (2 giochi).
3. **Quiz della settimana: 120 secondi** invece di 45 (10 domande in 45 s sono troppo poche).
4. **Livello**: "esperto" chi ha giocato almeno 7 giorni nelle settimane precedenti, altrimenti
   "principiante". Si può cambiare in `weekly_leaderboard()`.
5. **Tema**: la vista per tema somma i punti delle partite di quel tema (ogni set di domande ha
   un tema Factanza). Non c'è "Sport" perché non è un tema Factanza.
6. **Bonus inviti**: 30 punti per ogni amico che si iscrive col link `?invito=codice` e gioca
   nella stessa settimana, massimo 3 (90 punti). La classifica resta individuale.
7. **Antibaro**: il punteggio si calcola nell'app; il database controlla un tentativo al giorno,
   il punteggio massimo e un tempo minimo plausibile (1,5 s per la Notizia, altrimenti 0,8 s a
   domanda, minimo 2 s). Gli account doppi non si possono escludere del tutto senza dati
   identificativi (che non raccogliamo): servirebbe la verifica del numero di telefono.
8. **Contenuti**: per ora ci sono almeno 2 set reali per gioco (1 per il quiz): ruotano ogni
   settimana (la Notizia ogni giorno), quindi si ripetono finché la redazione non ne aggiunge
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
