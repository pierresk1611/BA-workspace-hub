export type ProjectStatus = "Idea" | "Discovery" | "Analýza" | "Solution Design" | "Refinement" | "Vývoj" | "Testovanie" | "UAT" | "Rollout" | "Done" | "Pozastavené";
export type ProjectPriority = "Nízka" | "Stredná" | "Vysoká" | "Kritická";

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
  systems: any[];
  tasks: any[];
}
