import type { Project } from "../types";

export const initialMockProject: Project = {
  id: "proj_driver_app_1",
  name: "Driver App",
  shortDescription: "Zjednotená vodičská aplikácia pre AlzaBox, Posila flow a XL integráciu.",
  detailedDescription: "Projekt rieši frontendový pracovný cockpit pre vodičov. Zahŕňa jednotný login, 2FA, online/offline check, AlzaBox helper flow, Posila flow, XL integráciu, GPS ping, zákaznícke ETA a bezpečnostné fallback mechanizmy.",
  status: "Analýza",
  priority: "Vysoká",
  team: {
    businessAnalyst: "Peter",
    productOwner: "Katka",
    businessOwner: "Jozef",
    techLead: "Marek",
    qaOwner: "Lucia",
    stakeholders: "Logistika, Zákaznícka podpora"
  },
  startDate: "2026-01-15",
  targetDate: "2026-09-30",
  release: "Q3 2026",
  mainDeadline: "2026-05-10",
  tags: "Logistics, AlzaBox, Driver App, XL, Posila, Security, Mobile App",
  type: "Logistický projekt",
  notes: "Kľúčový projekt pre tento rok.",
  metrics: {
    progress: 37,
    healthScore: 72,
    nearestDeadline: "2026-06-15",
    overdueItems: 2,
    openJira: 14,
    openQuestions: 6,
    decisions: 12,
    highRisks: 6,
    sqlQueries: 8,
    sqlResults: 24,
  },
  charts: {
    progressOverTime: [
      { name: "Jan", progress: 10 },
      { name: "Feb", progress: 18 },
      { name: "Mar", progress: 28 },
      { name: "Apr", progress: 37 },
    ],
    tasksByStatus: [
      { name: "To Do", value: 45, color: "#94a3b8" },
      { name: "In Progress", value: 15, color: "#3b82f6" },
      { name: "Done", value: 20, color: "#22c55e" },
      { name: "Blocked", value: 5, color: "#ef4444" },
    ],
    requirementsByStatus: [
      { name: "Draft", value: 12, color: "#94a3b8" },
      { name: "Review", value: 8, color: "#eab308" },
      { name: "Approved", value: 25, color: "#22c55e" },
    ],
  },
  upcomingMeetings: [
    { id: 1, title: "Sync s Katkou (PO)", date: "Dnes, 14:00", type: "Sync" },
    { id: 2, title: "Tech Refinement", date: "Zajtra, 10:00", type: "Refinement" },
    { id: 3, title: "Stakeholder Update", date: "28. Apr, 15:00", type: "Review" },
  ],
  recentActivities: [
    { id: 1, user: "Peter", action: "pridal nový SQL dotaz pre logistiku", time: "Pred 2 hodinami" },
    { id: 2, user: "Katka", action: "schválila požiadavku REQ-45 (Posila flow)", time: "Včera" },
    { id: 3, user: "Marek", action: "označil riziko RSK-12 ako mitigované", time: "Včera" },
  ],
  requirements: [],
  decisions: [],
  risks: [],
  questions: [],
  confluenceSources: [
    {
      id: "conf_1",
      name: "Analýza Driver App",
      url: "https://confluence.internal/driver-app-analysis",
      shortDescription: "Hlavný analytický dokument pre novú appku",
      manualText: `Tento dokument obsahuje analytické požiadavky na novú mobilnú aplikáciu pre vodičov.

Hlavné moduly a flow:
1. Login a 2FA:
Vodič sa prihlasuje pomocou zamestnaneckého ID. Následne mu príde 2FA SMS kód. Ak zlyhá, môže požiadať o zavolanie.

2. Online/Offline check:
Appka neustále (každých 30 sekúnd) pinguje server a aktualizuje GPS lokáciu. Ak vypadne sieť, appka sa prepne do offline režimu a dáta sa ukladajú lokálne (CoreData/Room).

3. AlzaBox helper flow:
Pri doručovaní do AlzaBoxu sa musí vodič najprv prihlásiť do boxu naskenovaním QR kódu na displeji. Až potom sa otvoria dvere.

4. Posila flow:
Ak príde "posila" (iný vodič prevezme balíky), musí prebehnúť hand-over sken. Vodič A naskenuje "Odovzdať", Vodič B "Prijať".

5. XL app integration:
Veľké balíky (chladničky) vyžadujú integráciu do staršieho XL systému. Appka pošle webhook pri doručení.

6. GPS ping a Zákazníicke ETA:
Zákazník vidí na mape aktuálnu polohu auta. ETA sa prepočítava pomocou Google Maps Matrix API každú minútu.`,
      owner: "Peter (BA)",
      dateAdded: "2026-03-01",
      lastChecked: "Včera",
      reviewDeadline: "2026-05-15",
      status: "Aktuálne",
      tags: "analýza, driver app, backend",
      aiMockData: {
        shortSummary: "Dokumentácia pokrýva požiadavky na Driver App s dôrazom na 2FA prihlásenie, offline režim, prácu s AlzaBoxmi, odovzdávanie balíkov medzi vodičmi a integráciu ETA s GPS trackingom.",
        detailedSummary: "Tento rozsiahly dokument specifikuje 6 hlavných logických celkov novej vodičskej aplikácie. Prvým je zabezpečené prihlásenie cez 2FA. Druhým je kritický offline režim, ktorý zabezpečuje plynulú prácu aj bez signálu pomocou lokálneho ukladania dát. Nasleduje flow pre doručovanie do AlzaBoxov, ktorý vyžaduje skenovanie QR kódov. Ďalšou dôležitou časťou je Posila flow pre odovzdávanie balíkov. Súčasťou je aj nutnosť integrácie s XL systémom a funkcia živého trackingu (GPS ping) pre presné vypočítanie ETA pre zákazníka.",
        requirements: [
          "REQ-1: Aplikácia musí podporovať 2FA prihlásenie cez SMS.",
          "REQ-2: Aplikácia musí každých 30 sekúnd odoslať GPS ping.",
          "REQ-3: Systém musí podporovať plnohodnotný offline režim s lokálnou databázou.",
          "REQ-4: Otvorenie AlzaBoxu vyžaduje naskenovanie QR kódu boxu.",
          "REQ-5: Pri odovzdávaní balíkov posile je nutný obojstranný sken (hand-over)."
        ],
        decisions: [
          "DEC-1: Pre offline ukladanie sa použije CoreData (iOS) a Room (Android).",
          "DEC-2: Výpočet ETA pre zákazníkov zabezpečí Google Maps Matrix API."
        ],
        risks: [
          "RSK-1: Cena za volania na Google Maps Matrix API môže pri častom pingu rapídne stúpnuť.",
          "RSK-2: Prepínanie do offline režimu môže spôsobiť duplikáciu eventov (napr. 2x doručené) po obnovení siete."
        ],
        questions: [
          "QST-1: Čo sa stane, ak vodičovi pri 2FA nepríde SMS a nemá ani signál na zavolanie?",
          "QST-2: Ako sa bude autentifikovať XL webhook?"
        ],
        actionSteps: [
          "Peter: Zistiť cenník Google Maps API a navrhnúť limity pre pring.",
          "Marek: Pripraviť proof-of-concept pre offline sync logiku."
        ],
        jiraTasks: [
          "DRV-101: Implementácia 2FA login screenu",
          "DRV-102: Background job pre GPS ping (30s interval)",
          "DRV-103: DB schéma pre offline režim"
        ],
        docUpdates: [
          "Je potrebné doplniť API definíciu pre webhook do XL aplikácie (chýbajú headers).",
          "Chýba definícia chybových hlášok pri zlyhaní skenu na AlzaBoxe."
        ]
      }
    }
  ],
  jiraItems: [
    {
      id: "jira_1",
      key: "LOG-1001",
      title: "Login a 2FA pre Driver App",
      type: "Story",
      url: "https://jira.internal/browse/LOG-1001",
      manualText: "Implementácia prihlasovacej obrazovky. Vodič zadá ID, následne dostane 2FA SMS. Systém overí kód proti auth serveru.",
      status: "In Progress",
      priority: "Vysoká",
      assignee: "Marek",
      reporter: "Peter",
      deadline: "2026-05-10",
      lastChecked: "Dnes",
      tags: "security, auth"
    },
    {
      id: "jira_2",
      key: "LOG-1002",
      title: "Online/offline check po prihlásení",
      type: "Task",
      url: "https://jira.internal/browse/LOG-1002",
      manualText: "Mechanizmus na detekciu straty signálu. Pri strate prepnúť appku do offline módu a ukladať doručenia lokálne.",
      status: "To Do",
      priority: "Stredná",
      assignee: "Marek",
      reporter: "Peter",
      deadline: "2026-05-15",
      lastChecked: "Včera",
      tags: "offline, sync"
    },
    {
      id: "jira_3",
      key: "LOG-1003",
      title: "AlzaBox access helper",
      type: "Story",
      url: "https://jira.internal/browse/LOG-1003",
      manualText: "Modul pre komunikáciu s AlzaBoxom. Obsahuje logiku pre bluetooth pairing a fallback otváranie.",
      status: "In Review",
      priority: "Vysoká",
      assignee: "Marek",
      reporter: "Peter",
      deadline: "2026-05-05",
      lastChecked: "Dnes",
      tags: "alzabox, iot"
    },
    {
      id: "jira_4",
      key: "LOG-1004",
      title: "Dynamic QR pre prístup k boxu",
      type: "Story",
      url: "https://jira.internal/browse/LOG-1004",
      manualText: "Generovanie QR kódu na displeji telefónu, ktorý naskenuje čítačka AlzaBoxu pre overenie identity vodiča.",
      status: "In Progress",
      priority: "Vysoká",
      assignee: "Lucia",
      reporter: "Peter",
      deadline: "2026-05-20",
      lastChecked: "Včera",
      tags: "qr, alzabox"
    },
    {
      id: "jira_5",
      key: "LOG-1005",
      title: "Emergency master key fallback",
      type: "Bug",
      url: "https://jira.internal/browse/LOG-1005",
      manualText: "Oprava chyby pri generovaní master kľúča v prípade, že je box úplne offline a nefunguje ani QR skener.",
      status: "Blocked",
      priority: "Kritická",
      assignee: "Marek",
      reporter: "QA Lucia",
      deadline: "2026-04-30",
      lastChecked: "Dnes",
      tags: "bug, critical"
    },
    {
      id: "jira_6",
      key: "LOG-1006",
      title: "Posila flow",
      type: "Story",
      url: "https://jira.internal/browse/LOG-1006",
      manualText: "Proces odovzdania balíkov inému vodičovi v teréne. Vyžaduje párové skenovanie oboch vodičov.",
      status: "Backlog",
      priority: "Stredná",
      assignee: "Nenastavené",
      reporter: "Peter",
      deadline: "2026-06-01",
      lastChecked: "Pred týždňom",
      tags: "posila, logistics"
    },
    {
      id: "jira_7",
      key: "LOG-1007",
      title: "XL app integration cez jednotný login",
      type: "Task",
      url: "https://jira.internal/browse/LOG-1007",
      manualText: "Prepojenie s legacy XL systémom pre nadrozmerné zásielky. Login musí fungovať naprieč systémami.",
      status: "To Do",
      priority: "Stredná",
      assignee: "Nenastavené",
      reporter: "Katka",
      deadline: "2026-06-15",
      lastChecked: "Včera",
      tags: "xl, legacy"
    },
    {
      id: "jira_8",
      key: "LOG-1008",
      title: "GPS ping každých 15 sekúnd",
      type: "Story",
      url: "https://jira.internal/browse/LOG-1008",
      manualText: "Odosielanie GPS súradníc na backend pre sledovanie polohy vozidla v reálnom čase.",
      status: "In Progress",
      priority: "Nízka",
      assignee: "Marek",
      reporter: "Peter",
      deadline: "2026-05-30",
      lastChecked: "Dnes",
      tags: "gps, tracking"
    },
    {
      id: "jira_9",
      key: "LOG-1009",
      title: "Customer ETA view",
      type: "Story",
      url: "https://jira.internal/browse/LOG-1009",
      manualText: "Zobrazenie predpokladaného času doručenia zákazníkovi na základe aktuálnej polohy vodiča.",
      status: "To Do",
      priority: "Stredná",
      assignee: "Marek",
      reporter: "Peter",
      deadline: "2026-06-30",
      lastChecked: "Včera",
      tags: "eta, customer"
    }
  ],
  systems: [
    {
      id: "sys_1",
      type: "Confluence",
      name: "Confluence analýza Driver App",
      url: "https://confluence.internal/driver-app",
      shortDescription: "Hlavná analytická dokumentácia",
      manualText: "Cieľom projektu je nahradiť starú appku za novú, s podporou AlzaBoxov a Posila flow. Architektúra musí byť plne modulárna.\n- Modul 1: Login a autentifikácia\n- Modul 2: Zoznam balíkov\n- Modul 3: Skener a doručovanie",
      owner: "Peter (BA)",
      status: "Aktuálne",
      priority: "Vysoká",
      deadline: "2026-05-01",
      tags: "analýza, dokumentácia",
      lastUpdated: "Dnes, 10:15"
    },
    {
      id: "sys_2",
      type: "Jira",
      name: "Jira epic Driver App",
      url: "https://jira.internal/browse/DRV-1",
      shortDescription: "Hlavný epic pre vývoj",
      manualText: "Epic: DRV-1\nNázov: Zjednotená vodičská aplikácia\nStatus: In Progress\nZaradené do: Q3 2026\nPopis: Epic združuje všetky úlohy spojené s vývojom novej mobilnej appky pre doručovateľov.",
      owner: "Katka (PO)",
      status: "In Progress",
      priority: "Kritická",
      deadline: "2026-09-30",
      tags: "vývoj, epic",
      lastUpdated: "Včera"
    },
    {
      id: "sys_3",
      type: "Kafka",
      name: "Kafka topic alza.ab.Parcels",
      url: "https://kafka-ui.internal/alza.ab.Parcels",
      shortDescription: "Event stream pre balíky",
      manualText: "Topic: alza.ab.Parcels\nSchema: avro\n\nZáznamy o vytvorení balíka, presune, uložení do boxu a vyzdvihnutí. Z appky budeme konzumovať eventy typu 'ParcelStoredInBox'.",
      owner: "Marek (Tech Lead)",
      status: "Aktívne",
      priority: "Vysoká",
      deadline: "-",
      tags: "data, stream, backend",
      lastUpdated: "Pred týždňom"
    },
    {
      id: "sys_4",
      type: "Asana",
      name: "Asana projekt Driver App",
      url: "https://app.asana.com/0/123/list",
      shortDescription: "Tasky pre marketing a operations",
      manualText: "Projekt v Asane na sledovanie príprav pre rollout aplikácie na depách. Obsahuje úlohy na školenie vodičov, tvorbu manuálov a letákov.",
      owner: "Jozef (BO)",
      status: "On Track",
      priority: "Stredná",
      deadline: "2026-08-15",
      tags: "rollout, operations",
      lastUpdated: "Pred 3 dňami"
    },
    {
      id: "sys_5",
      type: "Teams",
      name: "Teams kanál Driver App",
      url: "https://teams.microsoft.com/l/channel/123/DriverApp",
      shortDescription: "Hlavný komunikačný kanál",
      manualText: "Pre rýchlu komunikáciu s tímom. Vývojári sem reportujú status a BA sem hádžu otázky z refinementov.",
      owner: "Peter (BA)",
      status: "Aktívne",
      priority: "Nízka",
      deadline: "-",
      tags: "komunikácia",
      lastUpdated: "Dnes"
    },
    {
      id: "sys_6",
      type: "Miro",
      name: "Miro board Frontend flow",
      url: "https://miro.com/app/board/123",
      shortDescription: "User journey mapy a wireframy",
      manualText: "Obsahuje detailný vývojový diagram (flow) od prihlásenia vodiča až po odovzdanie balíka zákazníkovi. Taktiež sú tu low-fidelity návrhy obrazoviek.",
      owner: "Peter (BA)",
      status: "Draft",
      priority: "Vysoká",
      deadline: "2026-04-30",
      tags: "ux, ui, flow",
      lastUpdated: "Dnes, 08:30"
    },
    {
      id: "sys_7",
      type: "API dokumentácia",
      name: "API dokumentácia AlzaBox access",
      url: "https://swagger.internal/alzabox-api",
      shortDescription: "Swagger s endpointami pre boxy",
      manualText: "REST API pre komunikáciu s AlzaBoxom.\nPOST /api/v1/box/{boxId}/open\nAuth: Bearer token\nResponse: 200 OK (Doors opened)",
      owner: "Marek (Tech Lead)",
      status: "Finálne",
      priority: "Vysoká",
      deadline: "-",
      tags: "api, backend",
      lastUpdated: "Pred 2 mesiacmi"
    },
    {
      id: "sys_8",
      type: "SQL / databázový zdroj",
      name: "SQL mock workspace",
      url: "https://dbeaver.internal/mock",
      shortDescription: "Query pre analýzu dát z predchádzajúcej appky",
      manualText: "SELECT count(*), error_reason \nFROM driver_app_logs \nWHERE created_at > '2025-01-01' \nGROUP BY error_reason \nORDER BY 1 DESC;\n\nVýsledok ukázal, že najčastejšia chyba je zlyhanie Bluetooth spojenia s tlačiarňou.",
      owner: "Peter (BA)",
      status: "Ad-hoc",
      priority: "Nízka",
      deadline: "-",
      tags: "sql, data, analýza",
      lastUpdated: "Včera"
    }
  ],
  tasks: [],
  lastModified: "2026-04-24T22:30:00Z"
};
