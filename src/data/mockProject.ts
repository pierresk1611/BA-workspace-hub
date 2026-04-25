import type { Project } from "../types";

export const initialMockProject: Project = {
  id: "driver-app",
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
  lastModified: "2026-04-25T11:00:00Z",
  metrics: {
    progress: 37,
    healthScore: 72,
    nearestDeadline: "2026-04-28",
    overdueItems: 3,
    openJira: 14,
    openQuestions: 6,
    decisions: 5,
    highRisks: 4,
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
  requirements: [
    {
      id: "REQ-001",
      title: "Jednotný login pre vodiča",
      description: "Možnosť prihlásiť sa jedným kontom do všetkých logistických modulov (AlzaBox, XL, Posila).",
      type: "Business",
      priority: "Kritická",
      status: "Potvrdené",
      owner: "Peter (BA)",
      source: "Stakeholder workshop",
      dateCreated: "2026-01-20",
      dateUpdated: "2026-03-15",
      deadline: "2026-05-01",
      acceptanceCriteria: "1. Vodič zadá firemný email a heslo.\n2. Systém overí práva pre moduly.\n3. Vodič vidí dashboard s povolenými modulmi.",
      notes: "Kľúčový predpoklad pre ostatné moduly."
    }
  ],
  decisions: [],
  risks: [
    {
      id: "RSK-001",
      title: "GPS presnosť nemusí byť dostatočná pre geofencing",
      description: "V mestskom prostredí s vysokou zástavbou môže GPS signál kolísať, čo ovplyvní automatické otváranie boxov.",
      category: "Technical",
      impact: 4,
      probability: 3,
      severity: "Vysoká",
      owner: "Marek (Tech Lead)",
      mitigationPlan: "Implementácia hybridného geofencingu (GPS + Bluetooth/Wi-Fi scanning) a manuálneho fallbacku.",
      mitigationDeadline: "2026-05-15",
      status: "Mitigation in progress",
      relatedRequirementId: "REQ-003",
      notes: "Kritické pre plynulosť doručovania."
    }
  ],
  questions: [
    {
      id: "Q-001",
      title: "Má Posila skenovať jednotlivé balíky alebo iba tote?",
      context: "Pri nakladaní Posily v depe je nejasné, či stačí hromadný scan prepravky (tote) alebo každého balíka zvlášť.",
      owner: "Peter (BA)",
      respondent: "Prevádzka (Depo)",
      priority: "Vysoká",
      status: "Waiting for answer",
      dueDate: "2026-04-28",
      sourceType: "Meeting",
      notes: "Závisí od toho aj dizajn obrazovky v appke."
    }
  ],
  dependencies: [
    {
      id: "DEP-001",
      title: "Auth Server v3 API",
      sourceSystem: "Identity Management",
      targetSystem: "Driver App Backend",
      description: "Potrebujeme nové endpointy pre 2FA a session management.",
      owner: "Identity Team",
      status: "Prebieha",
      deadline: "2026-05-01",
      relatedRequirementId: "REQ-002"
    }
  ],
  asanaTasks: [
    {
      id: "AS-001",
      title: "Pripraviť frontend flow pre login",
      description: "Návrh a implementácia základných obrazoviek pre jednotný login vodiča.",
      owner: "Peter (BA)",
      status: "In progress",
      priority: "Vysoká",
      progress: 65,
      dueDate: "2026-05-05",
      milestone: "M1: Core Setup",
      sourceUrl: "https://asana.com/123/task/1",
      relatedRequirementId: "REQ-001",
      lastUpdated: "2026-04-24"
    },
    {
      id: "AS-002",
      title: "Overiť Posila flow s prevádzkou",
      description: "Stretnutie s logistikou pre potvrdenie špecifík doručovania cez externých kuriérov.",
      owner: "Katka (PO)",
      status: "Not started",
      priority: "Vysoká",
      progress: 0,
      dueDate: "2026-05-10",
      milestone: "M2: Posila Integration",
      sourceUrl: "https://asana.com/123/task/2",
      relatedRequirementId: "REQ-007",
      lastUpdated: "2026-04-20"
    },
    {
      id: "AS-003",
      title: "Potvrdiť XL integration scope",
      description: "Finálne rozhodnutie o rozsahu integrácie legacy XL aplikácie.",
      owner: "Marek (Tech Lead)",
      status: "Blocked",
      priority: "Kritická",
      progress: 20,
      dueDate: "2026-04-30",
      milestone: "M3: XL Legacy",
      sourceUrl: "https://asana.com/123/task/3",
      relatedRequirementId: "REQ-008",
      lastUpdated: "2026-04-25"
    },
    {
      id: "AS-004",
      title: "Doplniť GPS ping pravidlá",
      description: "Definícia frekvencie a presnosti GPS trackingu pre potreby fleet managementu.",
      owner: "Peter (BA)",
      status: "Done",
      priority: "Stredná",
      progress: 100,
      dueDate: "2026-04-22",
      milestone: "M1: Core Setup",
      sourceUrl: "https://asana.com/123/task/4",
      relatedRequirementId: "REQ-009",
      lastUpdated: "2026-04-22"
    },
    {
      id: "AS-005",
      title: "Pripraviť acceptance criteria",
      description: "Dokončenie AC pre všetky kľúčové user stories v backlogu.",
      owner: "Peter (BA)",
      status: "In progress",
      priority: "Vysoká",
      progress: 45,
      dueDate: "2026-05-12",
      milestone: "M1: Core Setup",
      sourceUrl: "https://asana.com/123/task/5",
      lastUpdated: "2026-04-24"
    },
    {
      id: "AS-006",
      title: "Pripraviť Miro diagram",
      description: "Vizuálne zmapovanie celého flowu vodiča v novej aplikácii.",
      owner: "Peter (BA)",
      status: "In progress",
      priority: "Stredná",
      progress: 80,
      dueDate: "2026-04-28",
      milestone: "M1: Core Setup",
      sourceUrl: "https://asana.com/123/task/6",
      lastUpdated: "2026-04-25"
    },
    {
      id: "AS-007",
      title: "Potvrdiť notification ownership",
      description: "Dohoda medzi Track & Trace a Driver App tímom o tom, kto posiela push notifikácie.",
      owner: "Katka (PO)",
      status: "Not started",
      priority: "Vysoká",
      progress: 10,
      dueDate: "2026-05-15",
      milestone: "M4: Notifications",
      sourceUrl: "https://asana.com/123/task/7",
      relatedRequirementId: "REQ-011",
      lastUpdated: "2026-04-24"
    }
  ],
  communications: [
    {
      id: "COM-001",
      title: "Teams: Scope Driver App vs AlzaBox Helper",
      type: "Teams chat",
      date: "2026-04-20",
      participants: "Katka (PO), Marek (Tech Lead), Peter (BA)",
      manualText: "Katka: Driver App bude helper, operatíva balíkov ostáva v AlzaBoxe. Posila má samostatný flow a XL je v scope cez jednotný login. Marek: Súhlasím, musíme doriešiť GPS ping pravidlá.",
      relatedProjectId: "proj_driver_app_1",
      relatedMilestone: "M1: Core Setup",
      tags: "scope, architecture",
      analysis: {
        shortSummary: "Potvrdenie architektúry Driver App ako helper aplikácie.",
        detailedSummary: "Aplikácia Driver App bude slúžiť ako podporný nástroj pre vodičov. Samotná logika doručovania a ovládanie AlzaBoxov zostáva v pôvodnom systéme. Integrácia XL a Posila flowu bude riešená cez jednotné prihlásenie.",
        decisions: [
          "Driver App je helper aplikácia",
          "Operatíva balíkov ostáva v AlzaBoxe",
          "XL je v scope cez jednotný login"
        ],
        requirements: [
          "Jednotný login pre XL",
          "Samostatný flow pre Posilu"
        ],
        questions: [
          "GPS ping pravidlá (ako často a presne?)"
        ],
        risks: [
          "Závislosť na stabilite AlzaBox Core systému"
        ],
        actionSteps: [
          "Definovať GPS ping pravidlá",
          "Navrhnúť login flow pre XL"
        ],
        suggestedJiraTasks: [
          "DRIVER-101: Implement unitary login",
          "DRIVER-102: GPS ping rules definition"
        ],
        suggestedDeadlines: [
          { title: "Definícia GPS pravidiel", date: "2026-04-30" }
        ],
        stakeholders: ["Katka (PO)", "Marek (Tech Lead)"]
      }
    }
  ],
  meetings: [
    {
      id: "MTG-001",
      title: "Driver App Scope Alignment Meeting",
      date: "2026-04-22",
      startTime: "10:00",
      endTime: "11:30",
      participants: "Katka (PO), Marek (Tech Lead), Peter (BA), Lucia (QA)",
      type: "Analysis",
      recordingUrl: "https://teams.microsoft.com/recording/123",
      transcript: "Peter: Začnime AB helper flowom. Katka: Áno, to je priorita. Marek: Čo sa týka XL integrácie, musíme použiť jednotný login. Lucia: Budeme potrebovať offline fallback pre GPS ping?",
      agenda: "Scope definícia pre M1 a M2, technické obmedzenia XL integrácie, GPS pravidlá.",
      relatedProjectId: "proj_driver_app_1",
      relatedMilestone: "M1: Core Setup",
      followUpDeadline: "2026-04-30",
      status: "Completed",
      notes: "Veľmi konštruktívny meeting, scope je jasný.",
      aiSummary: {
        executiveSummary: "Meeting potvrdil rozdelenie zodpovedností medzi Driver App a AlzaBox Core. XL integrácia bude prioritou Q3.",
        detailedNotes: "Diskutovalo sa o 7 kľúčových témach. AB helper flow zostáva v jadre AlzaBoxu, Driver App bude len zobrazovať inštrukcie. GPS ping bude posielaný každých 30 sekúnd.",
        decisions: [
          "XL integrácia cez jednotný login",
          "GPS ping frekvencia: 30s",
          "Notification ownership: Driver App tím"
        ],
        actionItems: [
          { id: "AI-001", task: "Definovať offline fallback pravidlá", owner: "Marek", deadline: "2026-04-28", status: "Open" },
          { id: "AI-002", task: "Pripraviť Miro diagram pre Posila flow", owner: "Peter", deadline: "2026-04-30", status: "Open" }
        ],
        questions: [
          "Kto bude spravovať SSL certifikáty pre nové domény?",
          "Aký je presný zákaznícky message pre ETA?"
        ],
        risks: [
          "Staršie verzie Androidu nemusia podporovať 2FA knižnicu",
          "Závislosť na GPS presnosti v husto zastavaných oblastiach"
        ],
        requirements: [
          "Offline režim pre zobrazenie poslednej trasy",
          "Možnosť manuálneho zadania kódu balíka"
        ],
        blockers: [
          "Čaká sa na finálne vyjadrenie Security tímu k 2FA"
        ],
        suggestedConfluenceUpdate: "Aktualizovať stránku 'Driver App Architecture'",
        suggestedJiraTasks: [
          "DRIVER-201: Offline storage implementation",
          "DRIVER-202: GPS ping service"
        ],
        suggestedFollowUpMeeting: "Technical deep-dive on 2FA (2026-05-02)"
      }
    }
  ],
  milestones: [
    { id: "M1", title: "Discovery", status: "Completed", progress: 100, dueDate: "2026-03-15" },
    { id: "M2", title: "Analysis", status: "Completed", progress: 100, dueDate: "2026-04-10" },
    { id: "M3", title: "Solution Design", status: "In Progress", progress: 45, dueDate: "2026-05-05" },
    { id: "M4", title: "Refinement", status: "Upcoming", progress: 0, dueDate: "2026-05-20" },
    { id: "M5", title: "Development", status: "Upcoming", progress: 0, dueDate: "2026-07-15" },
    { id: "M6", title: "Testing", status: "Upcoming", progress: 0, dueDate: "2026-08-10" },
    { id: "M7", title: "UAT", status: "Upcoming", progress: 0, dueDate: "2026-08-30" },
    { id: "M8", title: "Rollout", status: "Upcoming", progress: 0, dueDate: "2026-09-15" }
  ],
  diagrams: [],
  stakeholders: [
    { id: "S1", name: "Peter", role: "Business Analyst", team: "BA Team", responsibilityArea: "Requirements & Logic", decisionPower: "Contributor", contactNote: "Teams", notes: "Core analyst" },
    { id: "S2", name: "Katka", role: "Product Owner", team: "Product", responsibilityArea: "Vision & Priority", decisionPower: "Decision maker", contactNote: "Email", notes: "Primary stakeholder" },
    { id: "S3", name: "Marek", role: "Tech Lead", team: "Development", responsibilityArea: "Architecture", decisionPower: "Decision maker", contactNote: "Teams", notes: "Technical authority" },
    { id: "S4", name: "Martin", role: "Operations", team: "Logistics", responsibilityArea: "Operational Flow", decisionPower: "Consulted", contactNote: "Meeting only", notes: "Ops feedback" },
    { id: "S5", name: "Václav", role: "Delivery Expert", team: "Last Mile", responsibilityArea: "Courier Experience", decisionPower: "Consulted", contactNote: "Teams", notes: "Subject matter expert" },
    { id: "S6", name: "Mára", role: "AlzaBox Tech Expert", team: "Infrastructure", responsibilityArea: "Box Hardware", decisionPower: "Consulted", contactNote: "Teams", notes: "Hardware constraints" },
    { id: "S7", name: "QA Owner", role: "QA Lead", team: "Quality", responsibilityArea: "Testing & UAT", decisionPower: "Contributor", contactNote: "Teams", notes: "Quality gate" },
    { id: "S8", name: "Security Owner", role: "Security Architect", team: "Security", responsibilityArea: "Access & Auth", decisionPower: "Decision maker", contactNote: "Email", notes: "Security sign-off" }
  ],
  acceptanceCriteria: [
    { id: "AC1", requirementId: "REQ-001", title: "Login + 2FA", given: "Používateľ je na login obrazovke a zadal správne heslo", when: "Zadá 6-miestny kód z Google Authenticatora", then: "Systém ho prihlási a presmeruje na online check", priority: "Vysoká", status: "Approved", qaOwner: "QA Owner", testDeadline: "2026-05-10", notes: "Kľúčový bezpečnostný krok" },
    { id: "AC2", requirementId: "REQ-002", title: "Online/offline check", given: "Aplikácia je spustená", when: "Dôjde k výpadku signálu na viac ako 30 sekúnd", then: "Aplikácia prepne do offline režimu s lokálnou cache", priority: "Stredná", status: "In testing", qaOwner: "QA Owner", testDeadline: "2026-05-15", notes: "Overiť synchronizáciu po návrate online" },
    { id: "AC3", requirementId: "REQ-001", title: "Dynamic QR access", given: "Kuriér je pri AlzaBoxe a má aktívnu doručovaciu reláciu", when: "Klikne na 'Otvoriť box'", then: "Systém vygeneruje jednorazový QR kód s platnosťou 60s", priority: "Vysoká", status: "Draft", qaOwner: "Security Owner", testDeadline: "2026-06-01", notes: "Vyžaduje integráciu s Box API" },
    { id: "AC4", requirementId: "REQ-003", title: "Posila mode", given: "Používateľ je v režime Posila", when: "Skenuje balík, ktorý nie je priradený k jeho trase", then: "Systém zobrazí varovanie a neumožní balík naložiť", priority: "Vysoká", status: "Ready for review", qaOwner: "QA Owner", testDeadline: "2026-05-20", notes: "Validácia voči Kafka streamu" }
  ],
  confluenceSources: [],
  jiraItems: [],
  dataFlows: [],
  systems: [
    { 
      id: "sys_1", 
      name: "Identity Management", 
      type: "Interná aplikácia", 
      status: "Aktuálne", 
      owner: "Auth Team",
      url: "https://auth.internal",
      shortDescription: "Identity Management System",
      manualText: "Auth server...",
      priority: "Vysoká",
      deadline: "2026-09-30",
      tags: "auth, security",
      lastUpdated: "2026-04-24"
    }
  ],
  sqlQueries: [],
  sqlResults: [],
  deadlines: [],
  tasks: []
};

export const mockLabelRedesign: Project = {
  id: "label-redesign",
  name: "Delivery 2.0 Label Redesign",
  shortDescription: "Redesign doručovacích štítkov pre novú generáciu balíkových automatov a kuriérov.",
  detailedDescription: "Projekt sa zameriava na unifikáciu dizajnu štítkov pre všetky distribučné kanály. Zahŕňa technickú štandardizáciu formátov, integráciu so systémom tlačiarní a schválenie zo strany Brand tímu.",
  status: "Solution Design",
  priority: "Vysoká",
  team: {
    businessAnalyst: "Peter",
    productOwner: "Jana",
    businessOwner: "Michal",
    techLead: "Lukáš",
    qaOwner: "Petra",
    stakeholders: "Brand, Operations, IT"
  },
  startDate: "2026-02-01",
  targetDate: "2026-05-30",
  release: "Q2 2026",
  mainDeadline: "2026-05-30",
  tags: "Labels, Delivery, Print, Redesign",
  type: "Procesná zmena",
  notes: "Nutné schválenie od Brand tímu.",
  lastModified: "2026-04-20T09:00:00Z",
  metrics: {
    progress: 58,
    healthScore: 81,
    nearestDeadline: "2026-05-10",
    overdueItems: 1,
    openJira: 7,
    openQuestions: 3,
    decisions: 4,
    highRisks: 2,
    sqlQueries: 2,
    sqlResults: 5,
  },
  charts: {
    progressOverTime: [
      { name: "Feb", progress: 15 },
      { name: "Mar", progress: 35 },
      { name: "Apr", progress: 58 },
    ],
    tasksByStatus: [
      { name: "To Do", value: 12, color: "#94a3b8" },
      { name: "In Progress", value: 8, color: "#3b82f6" },
      { name: "Done", value: 18, color: "#22c55e" },
      { name: "Blocked", value: 2, color: "#ef4444" },
    ],
    requirementsByStatus: [
      { name: "Draft", value: 4, color: "#94a3b8" },
      { name: "Review", value: 5, color: "#eab308" },
      { name: "Approved", value: 15, color: "#22c55e" },
    ],
  },
  upcomingMeetings: [
    { id: 1, title: "Brand Review Session", date: "30. Apr, 10:00", type: "Review" },
    { id: 2, title: "Print Tech Sync", date: "5. Máj, 14:00", type: "Sync" },
  ],
  recentActivities: [
    { id: 1, user: "Jana", action: "schválila nový formát štítku pre XL balíky", time: "Pred 1 dňom" },
    { id: 2, user: "Petra", action: "otvorila QA scenár pre termálnu tlačiareň", time: "Pred 2 dňami" },
  ],
  requirements: [
    { id: "LR-001", title: "Unifikovaný formát štítku", description: "Jeden štítok pre všetky doručovacie kanály.", type: "Business", priority: "Vysoká", status: "Potvrdené", owner: "Peter (BA)", source: "Workshop", dateCreated: "2026-02-10", dateUpdated: "2026-04-01", deadline: "2026-05-01", acceptanceCriteria: "Štítok obsahuje QR kód, čiarový kód a adresu.", relatedJiraKey: "LBL-001", relatedMilestone: "Štítok v2.0", notes: "" },
  ],
  decisions: [
    { id: "LD-001", title: "Termálna tlač ako štandard", date: "2026-03-15", context: "Nižšie náklady na tonery.", decisionText: "Termálna tlač je štandard od 2026-Q2.", impact: "Nutná výmena starých tlačiarní.", status: "Potvrdené", owner: "Lukáš", approvedBy: "Michal", sourceType: "Tech Review", relatedRequirementId: "LR-001", notes: "" },
  ],
  questions: [],
  risks: [
    { id: "LR-001", title: "Zlyhanie dodávky tlačiarní", description: "Dodávateľ má sklz.", category: "Operational", impact: 3, probability: 3, severity: "Stredná", owner: "Peter", mitigationPlan: "Záložný dodávateľ.", mitigationDeadline: "2026-05-01", status: "Open", notes: "" },
  ],
  milestones: [
    { id: "lm1", title: "Brand Approval", status: "In Progress", dueDate: "2026-04-30", progress: 70 },
    { id: "lm2", title: "Print Integration", status: "Upcoming", dueDate: "2026-05-20", progress: 10 },
  ],
  dependencies: [],
  diagrams: [],
  asanaTasks: [],
  communications: [],
  meetings: [],
  stakeholders: [],
  acceptanceCriteria: [],
  confluenceSources: [],
  jiraItems: [],
  dataFlows: [],
  systems: [],
  sqlQueries: [],
  sqlResults: [],
  deadlines: [],
  tasks: []
};

export const mockDropshipment: Project = {
  id: "dropshipment-matrix",
  name: "Dropshipment Delivery Matrix",
  shortDescription: "Mapovanie a optimalizácia doručovacích matíc pre dropshipmentové objednávky.",
  detailedDescription: "Analýza aktuálnych doručovacích pravidiel pre dropshipment partnerov. Cieľom je zjednotiť routing, SLA pravidlá a prepoistiť doručenie cez záložné trasy.",
  status: "Discovery",
  priority: "Stredná",
  team: {
    businessAnalyst: "Peter",
    productOwner: "Radek",
    businessOwner: "Jozef",
    techLead: "Ondrej",
    qaOwner: "Martin",
    stakeholders: "Dropshipment Partners, Finance"
  },
  startDate: "2026-03-01",
  targetDate: "2026-06-30",
  release: "Q3 2026",
  mainDeadline: "2026-06-30",
  tags: "Dropshipment, Routing, SLA, Matrix",
  type: "Data / SQL analýza",
  notes: "Závisí od výsledkov Driver App analytics.",
  lastModified: "2026-04-18T14:00:00Z",
  metrics: {
    progress: 24,
    healthScore: 69,
    nearestDeadline: "2026-05-15",
    overdueItems: 4,
    openJira: 4,
    openQuestions: 8,
    decisions: 2,
    highRisks: 3,
    sqlQueries: 5,
    sqlResults: 8,
  },
  charts: {
    progressOverTime: [
      { name: "Mar", progress: 8 },
      { name: "Apr", progress: 24 },
    ],
    tasksByStatus: [
      { name: "To Do", value: 30, color: "#94a3b8" },
      { name: "In Progress", value: 5, color: "#3b82f6" },
      { name: "Done", value: 5, color: "#22c55e" },
      { name: "Blocked", value: 4, color: "#ef4444" },
    ],
    requirementsByStatus: [
      { name: "Draft", value: 15, color: "#94a3b8" },
      { name: "Review", value: 3, color: "#eab308" },
      { name: "Approved", value: 4, color: "#22c55e" },
    ],
  },
  upcomingMeetings: [
    { id: 1, title: "Partner Discovery Session", date: "28. Apr, 11:00", type: "Discovery" },
  ],
  recentActivities: [
    { id: 1, user: "Peter", action: "začal mapovanie SLA pravidiel", time: "Pred 3 dňami" },
    { id: 2, user: "Radek", action: "pridal partnerov do scope dokumentu", time: "Pred 4 dňami" },
  ],
  requirements: [
    { id: "DS-001", title: "Routing matrix definícia", description: "Definícia routingových pravidiel pre každého dropshipment partnera.", type: "Business", priority: "Vysoká", status: "Draft", owner: "Peter (BA)", source: "Discovery Workshop", dateCreated: "2026-03-10", dateUpdated: "2026-04-15", deadline: "2026-05-15", acceptanceCriteria: "Matrix pokrýva všetkých 12 partnerov.", relatedJiraKey: "DS-100", relatedMilestone: "Discovery", notes: "" },
  ],
  decisions: [
    { id: "DD-001", title: "SLA tier model", date: "2026-04-01", context: "Diferenciácia podľa hodnoty objednávky.", decisionText: "Zavedenie 3-tierového SLA modelu (Standard, Express, Premium).", impact: "Nutná aktualizácia zmlúv.", status: "Navrhnuté", owner: "Peter", approvedBy: "TBD", sourceType: "Internal", notes: "Čaká na právnu kontrolu." },
  ],
  questions: [
    { id: "DQ-001", title: "Aký je maximálny počet zastávok na trasu?", context: "Nie je jasné, či je limit 15 alebo 20 zastávok.", priority: "Vysoká", status: "Open", owner: "Peter", respondent: "Operations", relatedRequirementId: "DS-001", sourceType: "Internal", dueDate: "2026-05-01", notes: "Eskalovať na Operations." },
  ],
  risks: [
    { id: "DR-001", title: "Zmena partnerských zmlúv", description: "Zmena SLA môže vyžadovať renegociáciu zmlúv.", category: "Business", impact: 4, probability: 3, severity: "Vysoká", owner: "Jozef", mitigationPlan: "Zapojenie Legal tímu.", mitigationDeadline: "2026-05-15", status: "Open", notes: "" },
  ],
  milestones: [
    { id: "dm1", title: "Partner Discovery", status: "In Progress", dueDate: "2026-04-30", progress: 40 },
    { id: "dm2", title: "SLA Definition", status: "Upcoming", dueDate: "2026-05-30", progress: 0 },
  ],
  dependencies: [],
  diagrams: [],
  asanaTasks: [],
  communications: [],
  meetings: [],
  stakeholders: [],
  acceptanceCriteria: [],
  confluenceSources: [],
  jiraItems: [],
  dataFlows: [],
  systems: [],
  sqlQueries: [],
  sqlResults: [],
  deadlines: [],
  tasks: []
};

export const allMockProjects = [initialMockProject, mockLabelRedesign, mockDropshipment];
