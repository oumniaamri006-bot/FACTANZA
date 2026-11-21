import costoDellaVita from "@/assets/notizie/costo-della-vita.jpg";
import ricercaPrecariato from "@/assets/notizie/ricerca-precariato.jpg";
import midtermUsa from "@/assets/notizie/midterm-usa.jpg";

export type NewsItem = {
  id: string;
  /** Nome di una categoria di src/data/categories.ts */
  topic: string;
  title: string;
  /** Parte del titolo evidenziata in giallo (deve comparire nel titolo). */
  accent: string;
  minutes: number;
  opinions: string;
  /** 5 slide: Il punto, Un passo indietro, Cosa cambia?, La vera sfida, E quindi? */
  slides: string[];
  /** Testo completo, un paragrafo per elemento (facoltativo). */
  body?: string[];
  /** Immagine di copertina (facoltativa: senza, si usa l'icona della categoria). */
  image?: string;
  imageCredit?: string;
};

export const news: NewsItem[] = [
  {
    id: "costo-della-vita",
    topic: "Economia",
    title:
      "Il costo della vita mette in ginocchio le famiglie: lavorare non basta più per vivere dignitosamente",
    accent: "lavorare non basta più",
    minutes: 2,
    opinions: "4.1k",
    image: costoDellaVita,
    imageCredit: "@factanza",
    slides: [
      "In Italia il costo della vita mette in difficoltà anche le famiglie con un reddito regolare.",
      "Studio, impegno e sacrifici dovevano garantire una vita stabile. Questa promessa sembra appartenere sempre più al passato.",
      "Spesa, affitti, bollette e spese sanitarie assorbono una quota sempre maggiore degli stipendi. Resta meno spazio per risparmiare.",
      "I profitti delle aziende crescono, mentre in molti settori i salari crescono troppo lentamente. E il malcontento aumenta.",
      "Sempre più lavoratori chiedono interventi sul potere d’acquisto. In gioco c’è la possibilità di costruire un futuro senza incertezza.",
    ],
    body: [
      "La promessa secondo cui studio, impegno e sacrifici avrebbero garantito una vita economicamente stabile sembra appartenere sempre più al passato. In Italia, il crescente costo della vita sta mettendo in difficoltà anche le famiglie con un reddito regolare. Spesa alimentare, affitti, bollette e spese sanitarie assorbono una quota sempre maggiore degli stipendi, lasciando sempre meno spazio al risparmio e alle attività personali.",
      "A preoccupare è soprattutto la distanza tra l’aumento dei profitti aziendali e la crescita dei salari, che in molti settori continua a procedere a un ritmo insufficiente. Una condizione che alimenta il malcontento sociale e spinge sempre più lavoratori a chiedere interventi concreti sul potere d’acquisto. Nelle ultime settimane, il tema è tornato al centro del dibattito pubblico e delle mobilitazioni in diverse città europee. La questione non riguarda soltanto il reddito, ma anche la possibilità di costruire un futuro senza vivere costantemente nell’incertezza economica.",
    ],
  },
  {
    id: "ricerca-precariato",
    topic: "Lavoro",
    title:
      "Ricerca italiana in crisi: migliaia di professionisti rischiano il futuro tra precariato e pochi finanziamenti",
    accent: "rischiano il futuro",
    minutes: 2,
    opinions: "2.7k",
    image: ricercaPrecariato,
    imageCredit: "@factanza",
    slides: [
      "L’Italia forma ricercatori altamente qualificati, ma non riesce a offrire loro un lavoro stabile.",
      "Dottorati e anni di esperienza portano spesso solo a contratti a tempo determinato e finanziamenti temporanei.",
      "A Trieste, con la fine dei fondi PNRR, diversi ricercatori del CNR rischiano di restare senza continuità lavorativa.",
      "Servono più investimenti e percorsi di stabilizzazione. Intanto molti giovani ricercatori guardano all’estero.",
      "Il rischio è perdere competenze proprio nei settori che guideranno l’innovazione dei prossimi anni.",
    ],
    body: [
      "Il sistema della ricerca italiana continua a fare i conti con una delle sue principali contraddizioni: formare professionisti altamente qualificati senza riuscire a garantire loro prospettive lavorative stabili. Ricercatori con dottorati, anni di esperienza e competenze specialistiche sono spesso costretti a lavorare con contratti a tempo determinato, finanziamenti temporanei e prospettive occupazionali incerte.",
      "A Trieste, il caso di un gruppo di ricercatori del Consiglio nazionale delle ricerche riporta l’attenzione sul problema. La conclusione dei finanziamenti legati al PNRR rischia infatti di lasciare senza continuità lavorativa diversi professionisti impegnati in progetti strategici, dalla ricerca sulle nuove tecnologie allo sviluppo di soluzioni energetiche e mediche. Una situazione che riflette una difficoltà più ampia, legata agli investimenti insufficienti e alla mancanza di percorsi di stabilizzazione. Nel frattempo, cresce il numero di giovani ricercatori che guardano all’estero, dove spesso trovano maggiori opportunità professionali. Il rischio per l’Italia è perdere competenze fondamentali proprio nei settori destinati a guidare l’innovazione dei prossimi anni.",
    ],
  },
  {
    id: "longevita",
    topic: "Salute",
    title:
      "Vivere più a lungo non deve essere un privilegio: la sfida della longevità accessibile a tutti",
    accent: "non deve essere un privilegio",
    minutes: 2,
    opinions: "1.5k",
    slides: [
      "Vivere più a lungo e in buona salute è uno dei temi centrali della medicina e delle politiche sociali.",
      "Check-up avanzati, analisi personalizzate, monitoraggio della salute: gli strumenti di prevenzione sono aumentati.",
      "Ma molti hanno costi elevati e rischiano di restare accessibili soprattutto a chi può permetterseli.",
      "La sfida è far invecchiare tutti con autonomia e benessere, ripensando sanità, welfare e assistenza sul territorio.",
      "La prevenzione deve diventare una priorità pubblica: vivere più a lungo non può essere un lusso per pochi.",
    ],
    body: [
      "La possibilità di vivere più a lungo e in buona salute sta diventando uno dei temi centrali della medicina e delle politiche sociali. Negli ultimi anni sono aumentati gli strumenti dedicati alla prevenzione, dai check-up avanzati alle analisi personalizzate, fino ai programmi di monitoraggio della salute. Tuttavia, molte di queste opportunità hanno costi elevati e rischiano di rimanere accessibili soprattutto alle fasce più abbienti della popolazione.",
      "La vera sfida non consiste soltanto nell’allungare la durata della vita, ma nel garantire a tutti la possibilità di invecchiare mantenendo autonomia, benessere fisico e qualità della vita. L’invecchiamento progressivo della popolazione richiederà infatti un ripensamento dei servizi sanitari, del welfare e dell’assistenza territoriale. Anche la prevenzione dovrà diventare una priorità pubblica, evitando che il reddito determini la possibilità di ricevere cure adeguate. Il dibattito sulla longevità si sposta così dalla dimensione individuale a quella collettiva: vivere più a lungo dovrebbe essere un’opportunità condivisa e non un lusso riservato a pochi.",
    ],
  },
  {
    id: "midterm-usa",
    topic: "Esteri",
    title: "Stati Uniti, le elezioni di metà mandato diventano un test decisivo per Donald Trump",
    accent: "un test decisivo",
    minutes: 2,
    opinions: "3.3k",
    image: midtermUsa,
    imageCredit: "@factanza",
    slides: [
      "Le elezioni di metà mandato sono un passaggio decisivo per gli equilibri di Washington e per Donald Trump.",
      "Le midterms si tengono ogni quattro anni, a metà del mandato: si rinnova tutta la Camera e circa un terzo del Senato.",
      "Se i democratici conquistano una delle due Camere, per Trump diventa più difficile far approvare le sue iniziative.",
      "Una maggioranza democratica potrebbe anche aprire nuove commissioni d’inchiesta sull’amministrazione.",
      "Il voto misura il consenso verso il presidente ed è seguito con attenzione anche dalle cancellerie internazionali.",
    ],
    body: [
      "Le elezioni di metà mandato negli Stati Uniti si preparano a rappresentare un passaggio fondamentale per gli equilibri politici di Washington e per il futuro dell’amministrazione guidata da Donald Trump. Le cosiddette midterms si svolgono ogni quattro anni a metà del mandato presidenziale e permettono agli elettori di rinnovare tutti i seggi della Camera dei Rappresentanti e circa un terzo di quelli del Senato.",
      "Il risultato potrebbe modificare gli equilibri all’interno del Congresso, attualmente determinanti per l’attuazione dell’agenda presidenziale. Un’eventuale conquista della maggioranza da parte dei democratici in una delle due Camere renderebbe più complicato per Trump portare avanti le proprie iniziative legislative e potrebbe aprire la strada a nuove commissioni d’inchiesta sull’operato dell’amministrazione. Le midterms rappresentano inoltre un importante indicatore del consenso popolare nei confronti del presidente. Una sconfitta repubblicana potrebbe indebolire politicamente Trump nella seconda parte del mandato, mentre una vittoria rafforzerebbe la sua posizione in vista delle successive sfide elettorali. Per questo motivo, il voto viene osservato con grande attenzione anche dalle cancellerie internazionali.",
    ],
  },
  {
    id: "ai-lavoro",
    topic: "AI & Tech",
    title: "L’AI cambierà il lavoro. Ma siamo pronti?",
    accent: "siamo pronti?",
    minutes: 4,
    opinions: "2.3k",
    slides: [
      "L’intelligenza artificiale è già entrata nelle nostre vite. E nel nostro lavoro.",
      "Non solo robot: l’AI scrive, analizza dati, crea immagini e aiuta a prendere decisioni.",
      "Alcune attività cambieranno. Altre spariranno. Ma nasceranno anche professioni che oggi non conosciamo.",
      "La vera sfida è la formazione. Chi avrà gli strumenti per imparare a usare queste tecnologie?",
      "Non è soltanto una questione di tecnologia. È una questione di scelte, diritti e opportunità.",
    ],
  },
  {
    id: "voto-giovani",
    topic: "Politica",
    title: "Votare a 16 anni? La nostra voce conta.",
    accent: "La nostra voce conta.",
    minutes: 3,
    opinions: "1.8k",
    slides: [
      "Votare a 16 anni: un’idea che fa discutere.",
      "In alcuni Paesi europei i sedicenni possono già votare.",
      "Chi è a favore parla di partecipazione e responsabilità.",
      "Chi è contrario chiede più educazione civica e consapevolezza.",
      "La domanda riguarda tutti: quando si diventa pronti a decidere?",
    ],
  },
  {
    id: "clima",
    topic: "Ambiente",
    title: "Il pianeta non può aspettare. E noi?",
    accent: "E noi?",
    minutes: 5,
    opinions: "946",
    slides: [
      "Il clima cambia e le nuove generazioni chiedono risposte.",
      "Trasporti, energia e consumi: le scelte quotidiane contano.",
      "Ma non bastano le azioni individuali. Servono decisioni collettive.",
      "Le comunità possono sperimentare nuove soluzioni.",
      "Un futuro più equo comincia dalle domande giuste.",
    ],
  },
  {
    id: "cultura",
    topic: "Cultura",
    title: "La cultura è di tutti. Non un lusso.",
    accent: "Non un lusso.",
    minutes: 3,
    opinions: "712",
    slides: [
      "Un museo, un concerto, un libro: la cultura cambia il modo di vedere il mondo.",
      "I prezzi possono diventare una barriera.",
      "Biblioteche e spazi pubblici sono luoghi da difendere.",
      "Le agevolazioni possono avvicinare nuovi pubblici.",
      "Cosa vorresti vedere nella tua città?",
    ],
  },
];
