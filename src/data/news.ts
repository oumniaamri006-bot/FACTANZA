import costoDellaVita from "@/assets/notizie/costo-della-vita.jpg";
import ricercaPrecariato from "@/assets/notizie/ricerca-precariato.jpg";
import midtermUsa from "@/assets/notizie/midterm-usa.jpg";
import guerraIbridaImg from "@/assets/notizie/guerra-ibrida.jpg";
import therapyCultureImg from "@/assets/notizie/therapy-culture.jpg";
import israeleAiImg from "@/assets/notizie/israele-ai.jpg";
import mangiareSanoImg from "@/assets/notizie/mangiare-sano.jpg";
import gadgetVitaAdultaImg from "@/assets/notizie/gadget-vita-adulta.jpg";
import cerviStradaImg from "@/assets/notizie/cervi-strada.jpg";
import evoluzioneUmanaImg from "@/assets/notizie/evoluzione-umana.jpg";
import barbieCorpiImg from "@/assets/notizie/barbie-corpi.jpg";
import asiloTrasferimentiImg from "@/assets/notizie/asilo-trasferimenti.jpg";
import caldoEstateImg from "@/assets/notizie/caldo-estate.jpg";
import confrontoImg from "@/assets/notizie/confronto.jpg";
import nonSiPuoDireImg from "@/assets/notizie/non-si-puo-dire.jpg";

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
  /** Sondaggio mostrato alla fine dell'articolo. */
  poll: { question: string; options: string[] };
  /** Testo completo, un paragrafo per elemento (facoltativo). */
  body?: string[];
  /** Immagine di copertina (facoltativa: senza, si usa l'icona della categoria). */
  image?: string;
  imageCredit?: string;
  /** Da dove viene la notizia (mostrato in fondo all'articolo). */
  source?: string;
};

export const news: NewsItem[] = [
  {
    id: "guerra-ibrida",
    poll: {
      question: "Ti senti informato su cosa sia la guerra ibrida?",
      options: ["Sì, abbastanza", "Solo in parte", "Per niente"],
    },
    topic: "Esteri",
    title: "Guerra ibrida: perché stanno arrivando allarmi bomba in tutta Europa?",
    accent: "allarmi bomba",
    minutes: 2,
    opinions: "1.2k",
    image: guerraIbridaImg,
    imageCredit: "@factanza",
    source: "Post Instagram di @factanza, 7 novembre 2026",
    slides: [
      "In tutta Europa stanno arrivando allarmi bomba. C’è chi la chiama «guerra ibrida».",
      "Per guerra ibrida si intendono attacchi che non usano solo armi: sabotaggi, attacchi informatici, disinformazione.",
      "L’obiettivo è creare paura e disordine senza un conflitto dichiarato.",
      "Anche un falso allarme può bloccare scuole, stazioni e aeroporti e mettere sotto pressione i servizi di sicurezza.",
      "Capire cos’è la guerra ibrida aiuta a non farsi trascinare dal panico.",
    ],
  },
  {
    id: "therapy-culture",
    poll: {
      question: "Ti capita di usare parole come «ghosting» o «tossico» con gli amici?",
      options: ["Spesso", "A volte", "Mai"],
    },
    topic: "Salute",
    title:
      "Ghosting, trauma dumping, triggerato: la therapy culture ci sta rendendo amici peggiori?",
    accent: "amici peggiori?",
    minutes: 3,
    opinions: "32",
    image: therapyCultureImg,
    imageCredit: "@factanza",
    source: "Post Instagram di @factanza, 17 ottobre 2026 · testo di @ellaemme",
    slides: [
      "C’è una parola per quasi tutto: ghosting, trauma dumping, «sono stato triggerato».",
      "Sono termini presi in prestito da un contesto preciso: il rapporto tra paziente e psicoterapeuta.",
      "Portati nelle chat con gli amici, smettono di fare quello per cui erano nati.",
      "Invece di aiutarci a capire perché reagiamo così, ci danno un modo per non chiederlo più.",
      "Parlare di salute mentale senza tabù è un bene. Ma serve ancora mettersi in discussione con gli altri.",
    ],
    body: [
      "C’è una parola per quasi tutto, ormai. Per il ritardo a rispondere a un messaggio. Per lo sfogo arrivato nel momento sbagliato. Per l’opinione che non volevamo sentire. Le prendiamo in prestito da un contesto preciso, quello tra paziente e psicoterapeuta, e le portiamo in una chat con le amic*, dove però smettono di fare quello per cui erano nate: invece di aiutarci a capire perché reagiamo così, ci danno un modo per non chiederlo più, né a noi stesse né all’altra persona.",
      "Prova a pensare all’ultima volta che hai detto “mi ha ghostata”, “è tossico”, “mi ha fatto trauma dumping” in una chat, a qualcuno che ti ascoltava. E prova a ricordare se poi ne hai parlato anche con la persona in questione, o se ti sei fermata alla chat.",
      "Parlare di salute mentale, senza tabù, è un bene, ma a forza di utilizzare il linguaggio terapeutico nella vita di tutti i giorni forse stiamo perdendo la capacità di entrare davvero in relazione con gli altri, anche mettendoci in discussione.",
    ],
  },
  {
    id: "israele-ai",
    poll: {
      question: "L’uso dell’AI in guerra dovrebbe avere regole internazionali?",
      options: ["Sì, servono regole", "No", "Non so"],
    },
    topic: "Esteri",
    title:
      "Secondo un nuovo studio, Israele usa l’AI per automatizzare demolizioni ed espulsioni dei palestinesi",
    accent: "usa l’AI",
    minutes: 2,
    opinions: "18",
    image: israeleAiImg,
    imageCredit: "@factanza",
    source: "Post Instagram di @factanza, 19 settembre 2026",
    slides: [
      "Secondo un nuovo studio, Israele sta sfruttando l’intelligenza artificiale per automatizzare demolizioni ed espulsioni dei palestinesi.",
      "Lo studio riguarda la Striscia di Gaza e la Cisgiordania.",
      "L’uso dell’AI in contesti militari e di sicurezza è al centro di un dibattito internazionale sempre più acceso.",
      "La domanda centrale: chi risponde delle decisioni quando a suggerirle è un sistema automatico?",
      "Per capire la notizia conviene leggere lo studio e le risposte delle parti coinvolte.",
    ],
  },
  {
    id: "mangiare-sano",
    poll: {
      question: "Cosa ti impedisce di più di mangiare sano?",
      options: ["Il tempo", "I soldi", "Le informazioni", "Niente, ci riesco"],
    },
    topic: "Salute",
    title: "Mangiare sano è una questione di sbatti: tempo, possibilità e salute",
    accent: "una questione di sbatti",
    minutes: 3,
    opinions: "99",
    image: mangiareSanoImg,
    imageCredit: "@factanza",
    source:
      "Post Instagram di @factanza in collaborazione con @airc.it (contenuto sponsorizzato), 17 settembre 2026",
    slides: [
      "Un’alimentazione sana viene spesso vista come un’abitudine estetica. In realtà è fondamentale soprattutto per la salute.",
      "Abitudini alimentari squilibrate e sedentarietà aumentano il rischio di sovrappeso e obesità.",
      "Sono condizioni associate a diabete di tipo 2, ipertensione, problemi cardiovascolari e respiratori, ma anche tumori.",
      "Mangiare in modo equilibrato richiede tempo, impegno e soldi. E l’educazione alimentare non è accessibile a tutti.",
      "Vegetali freschi e di stagione, pasti equilibrati e movimento ogni giorno: piccoli accorgimenti con benefici concreti.",
    ],
    body: [
      "Spesso, la società tende a vedere un’alimentazione sana e uno stile di vita equilibrato come abitudini utili solamente all’estetica. In realtà, però, sono fondamentali soprattutto per la salute. Mangiare sano è tra le azioni più efficaci per prevenire l’insorgenza di malattie, compresi i tumori.",
      "Abitudini alimentari squilibrate e sedentarietà, ad esempio, aumentano il rischio di sovrappeso e l’obesità. Si tratta di condizioni associate a una maggiore incidenza di malattie come il diabete di tipo 2, l’ipertensione, problemi cardiovascolari e respiratori, ma anche tumori.",
      "Imparare a mangiare in modo equilibrato è qualcosa che si costruisce nel tempo e che, talvolta, richiede anche una corretta educazione alimentare (che, oggi, non è accessibile a chiunque).",
      "A grandi linee – e sempre considerando che le esigenze nutrizionali non sono uguali per tutti – oggi le evidenze scientifiche suggeriscono che una corretta alimentazione si basa su un giusto equilibrio e una buona alternanza di cibi, prediligendo quelli di origine vegetale, freschi e di stagione. Un pasto equilibrato dovrebbe includere alimenti fonte di carboidrati, proteine e grassi, insieme a frutta e verdura. Il tutto dovrebbe poi essere accompagnato dal movimento giornaliero, per limitare il più possibile la sedentarietà.",
      "Seguire uno stile di vita sano e un’alimentazione corretta e bilanciata con costanza, però, non è sempre facile: serve impegno, tempo e anche disponibilità economica. Tuttavia, con qualche consiglio e piccoli accorgimenti, è possibile e ha dei benefici concreti per la salute. Si può approfondire con il Manifesto della Prevenzione di AIRC (punti 2 e 3) o sul sito airc.it.",
    ],
  },
  {
    id: "gadget-vita-adulta",
    poll: {
      question: "Quale gadget ti servirebbe di più per la vita adulta?",
      options: ["Uno per la burocrazia", "Uno per le bollette", "Uno per le scadenze"],
    },
    topic: "AI & Tech",
    title: "10 gadget di cui avremmo assolutamente bisogno per affrontare la vita adulta",
    accent: "la vita adulta",
    minutes: 2,
    opinions: "11",
    image: gadgetVitaAdultaImg,
    imageCredit: "@factanza",
    source: "Post Instagram di @factanza, 29 agosto 2026",
    slides: [
      "Bollette, scadenze, burocrazia: la vita adulta arriva senza istruzioni.",
      "Factanza ha immaginato 10 gadget di cui avremmo assolutamente bisogno per affrontarla.",
      "Il problema? Non esistono. E chissà se li inventeranno mai.",
      "Alcuni di questi gadget ci farebbero davvero comodo.",
      "E tu, cosa inventeresti per affrontare più serenamente la vita da adulto?",
    ],
    body: [
      "Alcuni di questi gadget ci farebbero davvero comodo. E voi invece cosa inventereste per affrontare più serenamente la vita da adulti?",
    ],
  },
  {
    id: "cervi-strada",
    poll: {
      question: "Servono più passaggi sicuri per la fauna selvatica vicino alle strade?",
      options: ["Sì", "No", "Non so"],
    },
    topic: "Ambiente",
    title:
      "Non sono i cervi ad attraversare la nostra strada: è la strada che attraversa il loro bosco",
    accent: "il loro bosco",
    minutes: 2,
    opinions: "387",
    image: cerviStradaImg,
    imageCredit: "@factanza",
    source: "Post Instagram di @factanza, 27 agosto 2026",
    slides: [
      "Con l’estate aumentano gli avvistamenti di animali selvatici che scendono dalle aree montane verso i centri abitati.",
      "Spesso viene raccontata come un’invasione. Ma il punto di vista si può ribaltare.",
      "Non sono i cervi ad attraversare la nostra strada: è la nostra strada che attraversa il loro bosco.",
      "Strade e città occupano spazi che erano habitat naturali, e gli animali si trovano a doverli attraversare.",
      "Convivere con la fauna selvatica significa progettare il territorio pensando anche a chi lo abitava prima.",
    ],
  },
  {
    id: "evoluzione-umana",
    poll: {
      question: "Sapevi che l’uomo non discende dalle scimmie di oggi?",
      options: ["Sì", "No", "Avevo dei dubbi"],
    },
    topic: "Cultura",
    title: "L’immagine dell’evoluzione umana che hai in testa è sbagliata",
    accent: "è sbagliata",
    minutes: 2,
    opinions: "451",
    image: evoluzioneUmanaImg,
    imageCredit: "@factanza",
    source: "Post Instagram di @factanza, 24 agosto 2026",
    slides: [
      "La fila di scimmie che diventano gradualmente uomini è un’immagine famosissima. Ma è sbagliata.",
      "Non arriva da una scoperta scientifica: è un’illustrazione del 1965, disegnata per un libro.",
      "L’uomo non discende dalle scimmie di oggi: esseri umani e altre grandi scimmie hanno antenati comuni.",
      "L’evoluzione non è una linea retta verso un traguardo, ma un albero con tanti rami, molti dei quali estinti.",
      "Un disegno può restare nella memoria collettiva più a lungo della scienza che dovrebbe spiegare.",
    ],
  },
  {
    id: "barbie-corpi",
    poll: {
      question: "I giocattoli influenzano l’idea di corpo con cui si cresce?",
      options: ["Molto", "Poco", "Per niente"],
    },
    topic: "Moda",
    title: "Barbie e Ken oggi hanno corpi più realistici rispetto a 30 anni fa",
    accent: "più realistici",
    minutes: 2,
    opinions: "26",
    image: barbieCorpiImg,
    imageCredit: "@factanza",
    source: "Post Instagram di @factanza, 22 agosto 2026",
    slides: [
      "Oggi le Barbie rappresentano corpi femminili più realistici rispetto a trent’anni fa.",
      "Per decenni la bambola ha proposto un solo modello di corpo, molto lontano da quello delle persone reali.",
      "Il cambiamento riguarda anche Ken.",
      "Entrambi, però, hanno ancora della strada da fare.",
      "I giocattoli contribuiscono all’idea di corpo con cui si cresce: per questo la rappresentazione conta.",
    ],
  },
  {
    id: "asilo-trasferimenti",
    poll: {
      question: "I Paesi europei dovrebbero condividere di più l’accoglienza?",
      options: ["Sì", "No", "Non so"],
    },
    topic: "Politica",
    title: "Richiedenti asilo, diversi Paesi europei riprendono i trasferimenti verso l’Italia",
    accent: "riprendono i trasferimenti",
    minutes: 2,
    opinions: "67",
    image: asiloTrasferimentiImg,
    imageCredit: "@factanza",
    source: "Post Instagram di @factanza, 21 agosto 2026",
    slides: [
      "Diversi Paesi europei hanno deciso di riprendere i trasferimenti verso l’Italia di persone richiedenti asilo.",
      "Sono persone che si trovano sul loro territorio, ma che sono arrivate in Europa passando dall’Italia.",
      "L’Italia aveva sospeso questi trasferimenti nel 2022. Ora, secondo questi Paesi, la situazione è cambiata.",
      "Le regole europee indicano quale Stato deve esaminare una domanda d’asilo: spesso è il primo Paese di ingresso.",
      "Il tema riapre il confronto tra Italia ed Europa su come condividere la responsabilità dell’accoglienza.",
    ],
  },
  {
    id: "caldo-estate",
    poll: {
      question: "D’estate il caldo ti ha mai impedito di uscire di casa?",
      options: ["Spesso", "Qualche volta", "Mai"],
    },
    topic: "Ambiente",
    title: "Il cambiamento climatico è anche non poter uscire di casa in estate",
    accent: "non poter uscire di casa",
    minutes: 2,
    opinions: "860",
    image: caldoEstateImg,
    imageCredit: "@factanza",
    source: "Post Instagram di @factanza",
    slides: [
      "Il cambiamento climatico non è solo un aumento della temperatura.",
      "È anche non poter uscire di casa in estate, a causa del troppo caldo.",
      "Le ondate di calore stanno diventando più frequenti e intense, soprattutto nelle città.",
      "Asfalto e cemento trattengono il calore: chi vive in zone con poco verde lo sente di più.",
      "Adattare città e abitudini al caldo è ormai una questione di salute, non di comodità.",
    ],
  },
  {
    id: "confronto",
    poll: {
      question: "Ti confronti con chi ha idee diverse dalle tue?",
      options: ["Spesso", "Raramente", "Evito di farlo"],
    },
    topic: "Cultura",
    title: "Il confronto con chi ha idee diverse dovrebbe essere la normalità",
    accent: "la normalità",
    minutes: 2,
    opinions: "540",
    image: confrontoImg,
    imageCredit: "@factanza",
    source: "Post Instagram di @factanza",
    slides: [
      "Il confronto con chi ha idee diverse dalle nostre dovrebbe essere la normalità.",
      "Oggi, però, è diventato quasi insostenibile.",
      "Online e offline, le discussioni si trasformano spesso in scontri tra schieramenti.",
      "Ascoltare chi la pensa diversamente non vuol dire cambiare idea, ma capire meglio la propria.",
      "Come si ricostruisce lo spazio per un disaccordo civile?",
    ],
  },
  {
    id: "non-si-puo-dire",
    poll: {
      question: "Secondo te oggi si può dire tutto?",
      options: ["Sì, anche troppo", "Ci sono più limiti di prima", "Dipende da cosa"],
    },
    topic: "Politica",
    title: "A forza di dire «non si può più dire niente», stiamo dicendo di tutto",
    accent: "stiamo dicendo di tutto",
    minutes: 2,
    opinions: "1.9k",
    image: nonSiPuoDireImg,
    imageCredit: "@factanza",
    source: "Post Instagram di @factanza",
    slides: [
      "«Non si può più dire niente» è diventata una frase ricorrente nel dibattito pubblico.",
      "La ripetono spesso anche personaggi pubblici con enorme visibilità.",
      "Eppure, a forza di dirla, si finisce per dire di tutto.",
      "La libertà di parola non coincide con l’assenza di critiche a ciò che si dice.",
      "Il punto è capire dove finisce un’opinione e dove comincia l’offesa.",
    ],
  },
  {
    id: "costo-della-vita",
    poll: {
      question: "A casa tua lo stipendio basta per arrivare a fine mese?",
      options: ["Sì", "A fatica", "No"],
    },
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
    poll: {
      question: "Lasceresti l’Italia per un lavoro più stabile all’estero?",
      options: ["Sì", "No", "Ci sto pensando"],
    },
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
    id: "midterm-usa",
    poll: {
      question: "Le elezioni americane hanno effetti anche sulla tua vita?",
      options: ["Sì, molti", "Pochi", "Nessuno"],
    },
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
];
