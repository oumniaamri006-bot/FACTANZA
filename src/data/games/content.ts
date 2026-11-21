/**
 * Contenuti di esempio dei minigiochi: almeno due set reali per gioco, ognuno con spiegazione
 * e fonte. La rotazione usa i set a turno (vedi `contentFor`). Regola: solo fatti verificati.
 */
import type { GameContent, GameKind } from "@/lib/games/types";
import { dayNumber } from "@/lib/games/schedule";
import { img } from "./images";

/** Alterna la posizione del titolo onesto nelle coppie di "Titolo o clickbait". */
let clickbaitSwap = false;
const istat = "ISTAT, popolazione residente al 1° gennaio 2025";

export const gameCatalog: Record<GameKind, GameContent[]> = {
  // ---------------------------------------------------------------- 1. Notizia del giorno
  notizia: [
    {
      kind: "notizia",
      topic: "Politica",
      items: [
        {
          prompt: "Quale di questi titoli è una notizia vera?",
          options: [
            "L’Italia chiude le frontiere a tutti i richiedenti asilo dal 2027",
            "Diversi Paesi europei riprendono i trasferimenti verso l’Italia di richiedenti asilo",
            "L’UE abolisce le regole comuni sull’asilo",
          ],
          answer: 1,
          explanation:
            "Vero: diversi Paesi europei hanno ripreso i trasferimenti di persone che sono entrate in Europa dall’Italia. L’Italia li aveva sospesi nel 2022.",
          source: "Post Instagram di @factanza, 21 agosto 2026",
          image: img("asilo"),
        },
      ],
    },
    {
      kind: "notizia",
      topic: "Trend",
      items: [
        {
          prompt: "Quale di questi titoli è una notizia vera?",
          options: [
            "Mattel smette di produrre Barbie dopo 67 anni",
            "Le Barbie vietate ai minori di 3 anni in tutta Europa",
            "Oggi le Barbie rappresentano corpi più realistici rispetto a 30 anni fa",
          ],
          answer: 2,
          explanation:
            "Vero: oggi Barbie e Ken hanno corpi più vari e realistici, anche se, secondo molti, c’è ancora strada da fare.",
          source: "Post Instagram di @factanza, 22 agosto 2026",
          image: img("barbie"),
        },
      ],
    },
    {
      kind: "notizia",
      topic: "Lavoro",
      items: [
        {
          prompt: "Quale di questi titoli è una notizia vera?",
          options: [
            "Finiti i fondi PNRR, ricercatori del CNR di Trieste rischiano il posto",
            "Il CNR assume 10.000 ricercatori a tempo indeterminato entro dicembre",
            "Chiude il Consiglio nazionale delle ricerche",
          ],
          answer: 0,
          explanation:
            "Vero: con la fine dei fondi PNRR diversi ricercatori del CNR di Trieste rischiano di restare senza lavoro.",
          source: "Articolo Factanza “Ricerca italiana in crisi”",
          image: img("ricerca"),
        },
      ],
    },
  ],

  // ---------------------------------------------------------------- 2. Cos'è più grande
  "piu-grande": [
    {
      kind: "piu-grande",
      topic: "Cultura",
      items: [
        {
          prompt: "Chi ha più abitanti?",
          options: ["Italia", "Spagna"],
          answer: 0,
          explanation: "Italia circa 59 milioni, Spagna circa 49 milioni.",
          source: "Eurostat, popolazione 2025",
        },
        {
          prompt: "Quale montagna è più alta?",
          options: ["Monte Bianco", "Cervino"],
          answer: 0,
          explanation: "Monte Bianco 4.806 m, Cervino 4.478 m.",
          source: "Istituto Geografico Militare",
          optionImages: [img("monte-bianco"), img("cervino")],
        },
        {
          prompt: "Quale fiume è più lungo?",
          options: ["Tevere", "Po"],
          answer: 1,
          explanation: "Il Po è lungo 652 km ed è il fiume più lungo d’Italia; il Tevere 405 km.",
          source: "ISPRA",
          optionImages: [undefined, img("fiume-po")],
        },
        {
          prompt: "Quale città ha più abitanti?",
          options: ["Napoli", "Milano"],
          answer: 1,
          explanation: "Milano circa 1,37 milioni di abitanti, Napoli circa 0,9 milioni.",
          source: istat,
        },
        {
          prompt: "Quale isola è più grande?",
          options: ["Sicilia", "Sardegna"],
          answer: 0,
          explanation: "Sicilia 25.711 km², Sardegna 24.090 km²: per poco vince la Sicilia.",
          source: "ISTAT, superfici territoriali",
        },
      ],
    },
    {
      kind: "piu-grande",
      topic: "Esteri",
      items: [
        {
          prompt: "Chi ha più abitanti?",
          options: ["Francia", "Germania"],
          answer: 1,
          explanation: "Germania circa 83 milioni, Francia circa 68 milioni.",
          source: "Eurostat, popolazione 2025",
        },
        {
          prompt: "Quale torre è più alta?",
          options: ["Torre Eiffel", "Big Ben (Elizabeth Tower)"],
          answer: 0,
          explanation: "La Torre Eiffel è alta circa 330 m, la torre del Big Ben 96 m.",
          source: "Société d’exploitation de la tour Eiffel; UK Parliament",
          optionImages: [img("torre-eiffel"), img("big-ben")],
        },
        {
          prompt: "Quale lago è più grande?",
          options: ["Lago Maggiore", "Lago di Garda"],
          answer: 1,
          explanation:
            "Il Garda (370 km²) è il lago più grande d’Italia; il Maggiore è di 212 km².",
          source: "ISPRA",
          optionImages: [undefined, img("lago-garda")],
        },
        {
          prompt: "Quale distanza in linea d’aria è più lunga?",
          options: ["Roma–Milano", "Roma–Napoli"],
          answer: 0,
          explanation: "Roma–Milano circa 480 km, Roma–Napoli circa 190 km.",
          source: "Calcolo sulla distanza geodetica tra i centri città",
        },
        {
          prompt: "Quanti sono più numerosi?",
          options: ["Deputati alla Camera", "Senatori elettivi"],
          answer: 0,
          explanation:
            "Dal 2022 i deputati sono 400 e i senatori elettivi 200, dopo il taglio dei parlamentari.",
          source: "Legge costituzionale 1/2020",
        },
      ],
    },
  ],

  // ---------------------------------------------------------------- 3. Indovina la cifra
  cifra: [
    {
      kind: "cifra",
      topic: "Cultura",
      items: [
        {
          prompt: "Quanto è alto il Monte Bianco?",
          min: 3000,
          max: 6000,
          step: 10,
          unit: "m",
          answer: 4806,
          explanation: "Circa 4.806 metri: è la vetta più alta delle Alpi.",
          source: "Istituto Geografico Militare",
          image: img("monte-bianco"),
        },
        {
          prompt: "Quanto è lungo il Po?",
          min: 200,
          max: 1200,
          step: 10,
          unit: "km",
          answer: 652,
          explanation: "652 km, dal Monviso al mare Adriatico.",
          source: "ISPRA",
          image: img("fiume-po"),
        },
        {
          prompt: "Quanti sono i deputati alla Camera?",
          min: 100,
          max: 1000,
          step: 10,
          unit: "",
          answer: 400,
          explanation: "400: prima del taglio del 2020 erano 630.",
          source: "Legge costituzionale 1/2020",
        },
        {
          prompt: "Quanti Paesi fanno parte dell’Unione europea?",
          min: 10,
          max: 40,
          step: 1,
          unit: "",
          answer: 27,
          explanation: "27, dopo l’uscita del Regno Unito nel 2020.",
          source: "Unione europea, european-union.europa.eu",
        },
      ],
    },
    {
      kind: "cifra",
      topic: "Esteri",
      items: [
        {
          prompt: "Quanto è alta la Torre Eiffel?",
          min: 100,
          max: 600,
          step: 5,
          unit: "m",
          answer: 330,
          explanation: "Circa 330 metri con le antenne in cima.",
          source: "Société d’exploitation de la tour Eiffel",
          image: img("torre-eiffel"),
        },
        {
          prompt: "Quanti abitanti ha l’Italia (in milioni)?",
          min: 30,
          max: 90,
          step: 1,
          unit: "mln",
          answer: 59,
          explanation: "Circa 58,9 milioni, e cala da diversi anni.",
          source: istat,
        },
        {
          prompt: "Quanto è grande la Sicilia (km²)?",
          min: 10000,
          max: 40000,
          step: 100,
          unit: "km²",
          answer: 25711,
          explanation: "25.711 km²: è l’isola più grande del Mediterraneo.",
          source: "ISTAT, superfici territoriali",
        },
        {
          prompt: "Quanto è alto il Cervino?",
          min: 3000,
          max: 6000,
          step: 10,
          unit: "m",
          answer: 4478,
          explanation: "4.478 metri, al confine tra Italia e Svizzera.",
          source: "Istituto Geografico Militare",
          image: img("cervino"),
        },
      ],
    },
  ],

  // ---------------------------------------------------------------- 4. Vero o falso
  "vero-falso": [
    {
      kind: "vero-falso",
      topic: "Politica",
      items: [
        vf(
          "In Austria si può votare a 16 anni alle elezioni nazionali.",
          true,
          "Vero: dal 2007, prima in Europa tra i grandi Paesi.",
          "Parlamento austriaco, riforma elettorale 2007",
        ),
        vf(
          "L’uomo discende dalle scimmie che vivono oggi.",
          false,
          "Falso: umani e altre grandi scimmie hanno antenati comuni.",
          "Post di @factanza sull’evoluzione umana",
        ),
        vf(
          "La Camera dei deputati ha 400 membri.",
          true,
          "Vero: dal 2022, dopo il taglio dei parlamentari.",
          "Legge costituzionale 1/2020",
        ),
        vf(
          "La Grande Muraglia cinese si vede a occhio nudo dalla Luna.",
          false,
          "Falso: è lunghissima ma troppo stretta per essere vista dalla Luna.",
          "NASA, Earth Observatory",
        ),
        vf("Il Po è il fiume più lungo d’Italia.", true, "Vero: 652 km.", "ISPRA"),
      ],
    },
    {
      kind: "vero-falso",
      topic: "Economia",
      items: [
        vf(
          "Tutti i Paesi dell’Unione europea usano l’euro.",
          false,
          "Falso: ad esempio Svezia e Polonia hanno ancora la loro moneta.",
          "Banca centrale europea",
        ),
        vf(
          "In Italia si diventa maggiorenni a 18 anni.",
          true,
          "Vero: lo stabilisce l’articolo 2 del Codice civile.",
          "Codice civile, art. 2",
        ),
        vf(
          "Il Monte Bianco è la vetta più alta delle Alpi.",
          true,
          "Vero: 4.806 metri circa.",
          "Istituto Geografico Militare",
        ),
        vf(
          "La sede principale dell’ONU è a Ginevra.",
          false,
          "Falso: è a New York; a Ginevra c’è una sede importante ma non quella principale.",
          "Nazioni Unite, un.org",
        ),
        vf(
          "Il Parlamento europeo si vota ogni 5 anni.",
          true,
          "Vero: le ultime elezioni sono state nel 2024.",
          "Parlamento europeo",
        ),
      ],
    },
  ],

  // ---------------------------------------------------------------- 5. Chi l'ha detto
  "chi-l-ha-detto": [
    {
      kind: "chi-l-ha-detto",
      topic: "Lavoro",
      items: quotes(
        ["Willie Peyote", "Pierpaolo Bombardieri", "Sofia Viscardi", "Alessandro Rosina"],
        [img("willie"), img("bombardieri"), img("viscardi"), img("rosina")],
        [
          [
            "«Da quando è tutto gratis, è tutto più costoso.»",
            0,
            "Il rapper Willie Peyote, parlando di soldi, lavoro e casa per i giovani.",
            "Generazione Sospesa, ep. 10 (Factanza Media)",
          ],
          [
            "«Lo sciopero è un diritto individuale esercitato collettivamente.»",
            1,
            "Pierpaolo Bombardieri, segretario della Uil, sui diritti di chi lavora.",
            "Generazione Sospesa, ep. 8 (Factanza Media)",
          ],
          [
            "«I ragazzi non hanno luoghi dove sbagliare senza essere visti.»",
            2,
            "La scrittrice Sofia Viscardi su giovani, social e genitorialità.",
            "Generazione Sospesa, ep. 12 (Factanza Media)",
          ],
        ],
      ),
    },
    {
      kind: "chi-l-ha-detto",
      topic: "Esteri",
      items: quotes(
        ["Martin Luther King", "John F. Kennedy", "Barack Obama", "Nelson Mandela"],
        [img("mlk"), img("jfk"), img("obama"), img("mandela")],
        [
          [
            "«I have a dream.»",
            0,
            "Martin Luther King, nel discorso per i diritti civili a Washington, 28 agosto 1963.",
            "Marcia su Washington, 1963",
          ],
          [
            "«Ich bin ein Berliner.»",
            1,
            "John F. Kennedy a Berlino Ovest, 26 giugno 1963, durante la Guerra fredda.",
            "Discorso di Berlino, 1963",
          ],
          [
            "«Yes we can.»",
            2,
            "Barack Obama, slogan della campagna presidenziale del 2008.",
            "Discorso del New Hampshire, 8 gennaio 2008",
          ],
        ],
      ),
    },
  ],

  // ---------------------------------------------------------------- 6. Chi è chi
  "chi-e-chi": [
    {
      kind: "chi-e-chi",
      topic: "Politica",
      items: [
        {
          clues: [
            "È nato a Palermo nel 1941.",
            "È stato giudice della Corte costituzionale.",
            "È stato eletto per la prima volta nel 2015.",
            "Nel 2022 è stato rieletto per un secondo mandato.",
            "È il Presidente della Repubblica italiana.",
          ],
          options: ["Mario Draghi", "Sergio Mattarella", "Romano Prodi", "Giorgio Napolitano"],
          answer: 1,
          explanation:
            "Sergio Mattarella è Presidente della Repubblica dal 2015, rieletto nel 2022.",
          source: "Presidenza della Repubblica, quirinale.it",
          image: img("mattarella"),
        },
      ],
    },
    {
      kind: "chi-e-chi",
      topic: "Esteri",
      items: [
        {
          clues: [
            "È nata a Bruxelles nel 1958.",
            "È medica di formazione.",
            "È stata ministra della Difesa in Germania.",
            "Dal 2019 guida un’istituzione europea.",
            "È la presidente della Commissione europea.",
          ],
          options: [
            "Christine Lagarde",
            "Roberta Metsola",
            "Ursula von der Leyen",
            "Angela Merkel",
          ],
          answer: 2,
          explanation:
            "Ursula von der Leyen guida la Commissione europea dal 2019, confermata nel 2024.",
          source: "Commissione europea, commission.europa.eu",
          image: img("vonderleyen"),
        },
      ],
    },
  ],

  // ---------------------------------------------------------------- 7. Cosa significa
  "cosa-significa": [
    {
      kind: "cosa-significa",
      topic: "Economia",
      items: [
        def(
          "Inflazione",
          [
            "Aumento generale e continuo dei prezzi",
            "Calo dei salari in un settore",
            "Aumento delle tasse sui consumi",
          ],
          0,
          "Con l’inflazione, con gli stessi soldi compri meno cose.",
          "Banca d’Italia, Economia per tutti",
        ),
        def(
          "Spread",
          [
            "Il debito pubblico diviso per il PIL",
            "La differenza di rendimento tra titoli di Stato italiani e tedeschi",
            "Il tasso fissato dalla BCE",
          ],
          1,
          "Più è alto, più lo Stato paga di interessi per indebitarsi.",
          "Banca d’Italia, Economia per tutti",
        ),
        def(
          "ESG",
          [
            "Una tassa europea sulle emissioni",
            "Un indice di Borsa italiano",
            "Criteri ambientali, sociali e di governance per valutare le aziende",
          ],
          2,
          "Environmental, Social, Governance: misurano quanto un’azienda è sostenibile.",
          "Consob",
        ),
        def(
          "Referendum",
          [
            "Un voto con cui i cittadini decidono direttamente",
            "Una legge approvata dal governo",
            "Un sondaggio d’opinione",
          ],
          0,
          "In Italia quello abrogativo serve a cancellare una legge (art. 75 della Costituzione).",
          "Costituzione italiana, art. 75",
        ),
      ],
    },
    {
      kind: "cosa-significa",
      topic: "Lavoro",
      items: [
        def(
          "PIL",
          [
            "Il valore di beni e servizi prodotti in un Paese in un anno",
            "La somma degli stipendi di un Paese",
            "Il patrimonio dello Stato",
          ],
          0,
          "Prodotto interno lordo: misura quanto produce un’economia.",
          "ISTAT, glossario",
        ),
        def(
          "Quorum",
          [
            "La maggioranza dei voti espressi",
            "Il numero minimo di votanti perché un voto sia valido",
            "Il numero di firme per una legge",
          ],
          1,
          "Nel referendum abrogativo serve che voti più della metà degli aventi diritto.",
          "Costituzione italiana, art. 75",
        ),
        def(
          "Smart working",
          [
            "Un contratto solo per freelance",
            "Lavorare con l’intelligenza artificiale",
            "Lavoro agile, anche fuori dall’ufficio, con orari flessibili",
          ],
          2,
          "In Italia si chiama “lavoro agile” ed è regolato da una legge del 2017.",
          "Legge 81/2017",
        ),
        def(
          "Greenwashing",
          [
            "Presentarsi come sostenibili senza esserlo davvero",
            "Pulire le città con prodotti ecologici",
            "Un incentivo per le auto elettriche",
          ],
          0,
          "È una forma di pubblicità ingannevole sull’ambiente.",
          "Treccani",
        ),
      ],
    },
  ],

  // ---------------------------------------------------------------- 8. Titolo o clickbait
  clickbait: [
    {
      kind: "clickbait",
      topic: "Economia",
      items: [
        cb(
          "Il costo della vita pesa sulle famiglie: i salari crescono meno dei prezzi",
          "NON CI CREDERAI: ecco quanto ti resta davvero a fine mese 😱",
          "Articolo Factanza “Il costo della vita”",
        ),
        cb(
          "Finiti i fondi PNRR, ricercatori del CNR di Trieste a rischio",
          "Scienziati in fuga: l’Italia sta per perdere TUTTO",
          "Articolo Factanza “Ricerca italiana in crisi”",
        ),
        cb(
          "In estate più animali selvatici avvistati vicino ai centri abitati",
          "Invasione di cervi nelle città: cosa sta succedendo davvero?!",
          "Post di @factanza sui cervi",
        ),
        cb(
          "Barbie e Ken oggi hanno corpi più realistici di 30 anni fa",
          "Barbie come non l’avete MAI vista: il cambiamento che ha sconvolto tutti",
          "Post di @factanza sulle Barbie",
        ),
        cb(
          "L’immagine delle scimmie che diventano uomini nasce da un libro del 1965",
          "Ti hanno mentito per tutta la vita sull’evoluzione",
          "Post di @factanza sull’evoluzione",
        ),
      ],
    },
    {
      kind: "clickbait",
      topic: "Esteri",
      items: [
        cb(
          "Elezioni di metà mandato negli USA: un test per la presidenza Trump",
          "Trump è finito? Il voto che può cambiare TUTTO",
          "Articolo Factanza sulle midterm",
        ),
        cb(
          "Mangiare sano richiede tempo, soldi ed educazione alimentare",
          "Il cibo che mangi ogni giorno ti sta distruggendo",
          "Post di @factanza con AIRC",
        ),
        cb(
          "Ondate di calore più frequenti: in città diventa difficile uscire",
          "Estate infernale: non uscirete più di casa",
          "Post di @factanza sul caldo",
        ),
        cb(
          "Ghosting e trauma dumping: il linguaggio della terapia entra nelle chat",
          "Le tue amicizie sono TOSSICHE? Scoprilo ora",
          "Post di @factanza sulla therapy culture",
        ),
        cb(
          "Allarmi bomba in Europa: che cos’è la guerra ibrida",
          "La guerra è già iniziata e nessuno te lo dice",
          "Post di @factanza sulla guerra ibrida",
        ),
      ],
    },
  ],

  // ---------------------------------------------------------------- 9. Prima o dopo
  "prima-dopo": [
    {
      kind: "prima-dopo",
      topic: "Cultura",
      items: [
        pd(
          "Caduta del muro di Berlino",
          "Arrivo delle banconote in euro",
          0,
          "Muro: 9 novembre 1989. Banconote in euro: 1° gennaio 2002.",
          "Bundesregierung; BCE",
          [img("muro-berlino"), undefined],
        ),
        pd(
          "Primo uomo sulla Luna",
          "Nascita del World Wide Web",
          0,
          "Allunaggio: 20 luglio 1969. Web: 1991 al CERN.",
          "NASA; CERN",
          [img("allunaggio"), undefined],
        ),
        pd(
          "Unità d’Italia",
          "Rivoluzione francese",
          1,
          "Rivoluzione francese: 1789. Unità d’Italia: 1861.",
          "Treccani",
        ),
        pd(
          "Nascita di Facebook",
          "Nascita di Google",
          1,
          "Google: 1998. Facebook: 2004.",
          "Google; Meta",
        ),
        pd(
          "Referendum che fa nascere la Repubblica italiana",
          "Trattati di Roma (nasce la CEE)",
          0,
          "Referendum: 2 giugno 1946. Trattati di Roma: 25 marzo 1957.",
          "Senato della Repubblica; Unione europea",
        ),
      ],
    },
    {
      kind: "prima-dopo",
      topic: "AI & Tech",
      items: [
        pd(
          "Primo iPhone",
          "Nascita di YouTube",
          1,
          "YouTube: 2005. Primo iPhone: 2007.",
          "Apple; YouTube",
        ),
        pd(
          "Referendum sulla Brexit",
          "Accordo di Parigi sul clima",
          1,
          "Accordo di Parigi: dicembre 2015. Brexit: giugno 2016.",
          "ONU, UNFCCC; Parlamento UK",
        ),
        pd(
          "Stampa di Gutenberg",
          "Viaggio di Colombo in America",
          0,
          "Bibbia di Gutenberg: circa 1455. Colombo: 1492.",
          "Treccani",
          [img("gutenberg"), undefined],
        ),
        pd(
          "Pandemia di Covid dichiarata dall’OMS",
          "Lancio di ChatGPT",
          0,
          "Pandemia: 11 marzo 2020. ChatGPT: novembre 2022.",
          "OMS; OpenAI",
        ),
        pd(
          "Primo uomo nello spazio",
          "Primo uomo sulla Luna",
          0,
          "Gagarin: 12 aprile 1961. Allunaggio: 1969.",
          "ESA; NASA",
          [img("gagarin"), img("allunaggio")],
        ),
      ],
    },
  ],

  // ---------------------------------------------------------------- 10. Dove succede
  "dove-succede": [
    {
      kind: "dove-succede",
      topic: "Esteri",
      items: [
        map(
          "Elezioni di metà mandato che mettono alla prova Trump",
          "840",
          "Le midterm si tengono negli Stati Uniti ogni quattro anni.",
          "Articolo Factanza sulle midterm",
        ),
        map(
          "Ricercatori del CNR a rischio dopo la fine dei fondi PNRR",
          "380",
          "Succede a Trieste, in Italia.",
          "Articolo Factanza sulla ricerca",
        ),
        map(
          "Si vota a 16 anni alle elezioni nazionali dal 2007",
          "040",
          "È l’Austria.",
          "Parlamento austriaco",
        ),
        map(
          "La città dei grattacieli raccontata “fuori dai social”",
          "784",
          "Dubai è negli Emirati Arabi Uniti.",
          "Video Factanza Media su Dubai",
        ),
      ],
    },
    {
      kind: "dove-succede",
      topic: "Politica",
      items: [
        map(
          "Referendum del 2016 per uscire dall’Unione europea",
          "826",
          "La Brexit: Regno Unito.",
          "Parlamento UK",
        ),
        map(
          "Firma dell’accordo globale sul clima del 2015",
          "250",
          "L’Accordo di Parigi, in Francia.",
          "ONU, UNFCCC",
        ),
        map(
          "Cade il muro che divideva una città in due (1989)",
          "276",
          "Berlino, Germania.",
          "Bundesregierung",
        ),
        map(
          "Mondiali di calcio giocati per la prima volta in inverno (2022)",
          "634",
          "In Qatar, a novembre e dicembre.",
          "FIFA",
        ),
      ],
    },
  ],

  // ---------------------------------------------------------------- 11. Metti in ordine
  "metti-in-ordine": [
    {
      kind: "metti-in-ordine",
      topic: "Esteri",
      items: [
        {
          prompt: "Dal Paese con più abitanti a quello con meno.",
          ordered: ["Germania", "Francia", "Italia", "Spagna"],
          values: ["83 mln", "68 mln", "59 mln", "49 mln"],
          explanation: "I quattro Paesi più popolosi dell’Unione europea.",
          source: "Eurostat, popolazione 2025",
        },
      ],
    },
    {
      kind: "metti-in-ordine",
      topic: "Politica",
      items: [
        {
          prompt: "Dal più vecchio al più recente.",
          ordered: [
            "Unità d’Italia",
            "Nasce la Repubblica",
            "Trattati di Roma",
            "Arriva l’euro in tasca",
          ],
          values: ["1861", "1946", "1957", "2002"],
          explanation: "Dalla nascita dello Stato italiano alla moneta unica.",
          source: "Treccani; Unione europea",
        },
      ],
    },
    {
      kind: "metti-in-ordine",
      topic: "Ambiente",
      items: [
        {
          prompt: "Dalla montagna più alta alla più bassa.",
          ordered: ["Monte Bianco", "Monte Rosa", "Cervino", "Gran Paradiso"],
          values: ["4.806 m", "4.634 m", "4.478 m", "4.061 m"],
          explanation: "Quattro giganti delle Alpi, tutti (almeno in parte) in Italia.",
          source: "Istituto Geografico Militare",
        },
      ],
    },
  ],

  // ---------------------------------------------------------------- 12. Collega i puntini
  collega: [
    {
      kind: "collega",
      topic: "Economia",
      items: links(
        [
          "Mutui a tasso variabile più leggeri",
          "Benzina più cara",
          "Più consumi di elettricità",
          "Con lo stesso stipendio compri meno",
        ],
        [
          [
            "La BCE taglia i tassi",
            0,
            "Se il costo del denaro scende, scendono anche le rate variabili.",
            "Banca centrale europea",
          ],
          [
            "Sale il prezzo del petrolio",
            1,
            "Il carburante si ricava dal petrolio: quando costa di più, il prezzo alla pompa sale.",
            "Ministero delle Imprese, prezzi carburanti",
          ],
          [
            "Arriva un’ondata di calore",
            2,
            "Con il caldo si accendono di più i condizionatori.",
            "Terna, consumi elettrici",
          ],
          [
            "L’inflazione è alta",
            3,
            "Se i prezzi salgono più degli stipendi, il potere d’acquisto cala.",
            "Banca d’Italia",
          ],
        ],
      ),
    },
    {
      kind: "collega",
      topic: "Lavoro",
      items: links(
        [
          "Lo Stato paga più interessi sul debito",
          "Prodotti importati più cari",
          "Meno lavoratori per pagare le pensioni",
          "Meno emissioni allo scarico in città",
        ],
        [
          [
            "Calano le nascite",
            2,
            "Meno giovani oggi vuol dire meno persone al lavoro domani.",
            "ISTAT, indicatori demografici",
          ],
          [
            "Lo spread sale",
            0,
            "Per vendere i suoi titoli lo Stato deve offrire interessi più alti.",
            "Banca d’Italia",
          ],
          [
            "Aumentano le auto elettriche",
            3,
            "Un’auto elettrica non ha emissioni allo scarico.",
            "Agenzia europea dell’ambiente",
          ],
          [
            "Il governo alza un dazio",
            1,
            "Il dazio è una tassa sulle merci che arrivano dall’estero.",
            "Agenzia delle Dogane",
          ],
        ],
      ),
    },
  ],

  // ---------------------------------------------------------------- 13. Quiz di riepilogo
  riepilogo: [
    {
      kind: "riepilogo",
      topic: "Cultura",
      items: [
        mc(
          "Quale Paese aveva sospeso nel 2022 i trasferimenti di richiedenti asilo dagli altri Paesi UE?",
          ["Spagna", "Italia", "Grecia"],
          1,
          "L’Italia; ora diversi Paesi li hanno ripresi.",
          "Post di @factanza",
        ),
        mc(
          "Cosa rischiano i ricercatori del CNR di Trieste?",
          ["Un trasferimento all’estero", "Di restare senza lavoro", "Un taglio dello stipendio"],
          1,
          "Con la fine dei fondi PNRR rischiano il posto.",
          "Articolo Factanza",
        ),
        mc(
          "Cosa mette alla prova la presidenza Trump?",
          ["Le elezioni di metà mandato", "Un referendum", "Le primarie"],
          0,
          "Le midterm rinnovano la Camera e un terzo del Senato.",
          "Articolo Factanza",
        ),
        mc(
          "Cosa intendiamo con “guerra ibrida”?",
          [
            "Una guerra con droni",
            "Attacchi che uniscono sabotaggi, cyber e disinformazione",
            "Una guerra tra due alleanze",
          ],
          1,
          "Colpisce senza un conflitto dichiarato.",
          "Post di @factanza",
        ),
        mc(
          "Da dove arriva l’immagine delle scimmie che diventano uomini?",
          ["Da un libro illustrato del 1965", "Da Darwin", "Da un museo inglese"],
          0,
          "Disegnata da Rudolph Zallinger per “Early Man”.",
          "Time-Life Books, 1965",
        ),
        mc(
          "Cosa sono i criteri ESG?",
          ["Regole doganali", "Criteri ambientali, sociali e di governance", "Una tassa europea"],
          1,
          "Servono a valutare la sostenibilità delle aziende.",
          "Consob",
        ),
        mc(
          "Quanti sono oggi i deputati?",
          ["630", "400", "315"],
          1,
          "400 dal 2022.",
          "Legge costituzionale 1/2020",
        ),
        mc(
          "Chi ha detto «Lo sciopero è un diritto individuale esercitato collettivamente»?",
          ["Pierpaolo Bombardieri", "Willie Peyote", "Sofia Viscardi"],
          0,
          "Il segretario della Uil a Generazione Sospesa.",
          "Factanza Media",
        ),
        mc(
          "Cosa misura lo spread?",
          [
            "L’inflazione",
            "La differenza di rendimento tra titoli italiani e tedeschi",
            "Il deficit",
          ],
          1,
          "Più è alto, più costa il debito.",
          "Banca d’Italia",
        ),
        mc(
          "Cosa chiede la campagna “Mangiare sano è una questione di sbatti”?",
          [
            "Più palestre",
            "Tempo, possibilità ed educazione alimentare per tutti",
            "Meno zuccheri a scuola",
          ],
          1,
          "Mangiare sano non è solo estetica: è salute.",
          "Post di @factanza con AIRC",
        ),
      ],
    },
  ],
};

// --------------------------------------------------------------------- helper di scrittura
function vf(statement: string, answer: boolean, explanation: string, source: string) {
  return {
    prompt: statement,
    options: ["Vero", "Falso"],
    answer: answer ? 0 : 1,
    explanation,
    source,
  };
}
function quotes(
  names: string[],
  images: ReturnType<typeof img>[],
  rows: [string, number, string, string][],
) {
  return rows.map(([quote, answer, explanation, source]) => ({
    prompt: quote,
    options: names,
    optionImages: images,
    answer,
    explanation,
    source,
  }));
}
function def(word: string, options: string[], answer: number, explanation: string, source: string) {
  return { prompt: word, options, answer, explanation, source };
}
/** Titolo o clickbait: l'ordine delle due opzioni alterna per non avere sempre la prima giusta. */
function cb(honest: string, bait: string, source: string) {
  clickbaitSwap = !clickbaitSwap;
  return {
    prompt: "Quale titolo racconta la notizia in modo onesto?",
    options: clickbaitSwap ? [honest, bait] : [bait, honest],
    answer: clickbaitSwap ? 0 : 1,
    explanation:
      "Il titolo onesto dice cosa è successo; il clickbait promette emozioni senza informare.",
    source,
  };
}
function pd(
  a: string,
  b: string,
  first: 0 | 1,
  explanation: string,
  source: string,
  optionImages?: ReturnType<typeof img>[],
) {
  return {
    prompt: "Quale è successo prima?",
    options: [a, b],
    answer: first,
    explanation,
    source,
    ...(optionImages && { optionImages }),
  };
}
function map(prompt: string, countryId: string, explanation: string, source: string) {
  return { prompt, countryId, explanation, source };
}
function links(effects: string[], rows: [string, number, string, string][]) {
  return rows.map(([cause, answer, explanation, source]) => ({
    prompt: cause,
    options: effects,
    answer,
    explanation,
    source,
  }));
}
function mc(
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
  source: string,
) {
  return { prompt, options, answer, explanation, source };
}

/**
 * Contenuto del gioco per una data: **una sola domanda** per gioco. Le domande di tutti i set
 * ruotano un giorno dopo l'altro, così si ripetono il più tardi possibile.
 */
export function contentFor(kind: GameKind, day: string, version = 0): GameContent | undefined {
  const pool = gameCatalog[kind].flatMap((set) => set.items.map((_, index) => ({ set, index })));
  if (!pool.length) return undefined;
  // Ogni versione del quiz (reset dell'MVP) pesca la domanda successiva.
  const n = dayNumber(day) + version;
  const pick = pool[((n % pool.length) + pool.length) % pool.length];
  if (!pick) return undefined;
  return { ...pick.set, items: [pick.set.items[pick.index]] } as GameContent;
}
