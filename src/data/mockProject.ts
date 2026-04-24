import type { Project } from "../types";

export const initialMockProject: Project = {
  id: "proj_driver_app_1",
  name: "Driver App",
  shortDescription: "Zjednotená vodičská aplikácia pre AlzaBox, Posila flow a XL integráciu.",
  detailedDescription: "Kompletný redesign mobilnej aplikácie pre vodičov, vrátane novej architektúry pre integráciu kuriérskych firiem. Cieľom je zjednotiť systémy a znížiť chybovosť pri doručovaní do AlzaBoxov.",
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
  tags: "Mobilná Appka, Logistika, Integrácia",
  type: "Transformácia",
  notes: "Kľúčový projekt pre tento rok.",
  metrics: {
    progress: 37,
    healthScore: 72,
    nearestDeadline: "2026-05-10",
    overdueItems: 3,
    openJira: 14,
    openQuestions: 5,
    decisions: 12,
    highRisks: 2,
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
  systems: [],
  tasks: []
};
