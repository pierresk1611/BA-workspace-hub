export type ProjectStatus = "Idea" | "Discovery" | "Analýza" | "Solution Design" | "Refinement" | "Vývoj" | "Testovanie" | "UAT" | "Rollout" | "Done" | "Pozastavené";
export type ProjectPriority = "Nízka" | "Stredná" | "Vysoká" | "Kritická";

export type ConfluenceStatus = "Draft" | "Aktuálne" | "Čaká na kontrolu" | "Zastarané" | "Nahradené";

export interface AISummaryData {
  shortSummary?: string;
  detailedSummary?: string;
  requirements?: string[];
  decisions?: string[];
  risks?: string[];
  questions?: string[];
  actionSteps?: string[];
  jiraTasks?: string[];
  docUpdates?: string[];
}

export interface ConfluenceSource {
  id: string;
  name: string;
  url: string;
  manualText: string;
  shortDescription: string;
  owner: string;
  dateAdded: string;
  lastChecked: string;
  reviewDeadline: string;
  status: ConfluenceStatus;
  tags: string;
  aiMockData?: AISummaryData;
}

export type SystemType = "Confluence" | "Jira" | "Kafka" | "Asana" | "Teams" | "Email" | "Miro" | "Figma" | "Git repository" | "API dokumentácia" | "Monitoring" | "Interná aplikácia" | "SQL / databázový zdroj" | "Iné";

export interface LinkedSystem {
  id: string;
  type: SystemType;
  customTypeName?: string;
  name: string;
  url: string;
  shortDescription: string;
  manualText: string;
  owner: string;
  status: string;
  priority: string;
  deadline: string;
  tags: string;
  lastUpdated: string;
}

export interface ProjectTeam {
  businessAnalyst: string;
  productOwner: string;
  businessOwner: string;
  techLead: string;
  qaOwner: string;
  stakeholders: string;
}

export interface ProjectMetrics {
  progress: number;
  healthScore: number;
  nearestDeadline: string;
  overdueItems: number;
  openJira: number;
  openQuestions: number;
  decisions: number;
  highRisks: number;
  sqlQueries: number;
  sqlResults: number;
}

export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  team: ProjectTeam;
  startDate: string;
  targetDate: string;
  release: string;
  mainDeadline: string;
  tags: string;
  type: string;
  notes: string;
  metrics: ProjectMetrics;
  charts: any;
  upcomingMeetings: any[];
  recentActivities: any[];
  requirements: any[];
  decisions: any[];
  risks: any[];
  questions: any[];
  confluenceSources: ConfluenceSource[];
  systems: LinkedSystem[];
  tasks: any[];
}
