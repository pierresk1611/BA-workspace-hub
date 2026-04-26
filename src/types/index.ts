export type ProjectStatus = "Idea" | "Discovery" | "Analýza" | "Solution Design" | "Refinement" | "Vývoj" | "Testovanie" | "UAT" | "Rollout" | "Done" | "Pozastavené" | "Ukončené";
export type ProjectPriority = "Nízka" | "Stredná" | "Vysoká" | "Kritická";
export type ProjectType = "IT projekt" | "Logistický projekt" | "Procesná zmena" | "Reporting / BI" | "Data / SQL analýza" | "Interný nástroj" | "Iné";


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

export interface OwnedEntity {
  ownerUserId: string;
  createdByUserId: string;
  workspaceId?: string;
}

export interface ConfluenceSource extends OwnedEntity {
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

export interface LinkedSystem extends OwnedEntity {
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

export type JiraItemType = "Epic" | "Story" | "Task" | "Bug" | "Spike" | "Sub-task";
export type JiraStatus = "Backlog" | "To Do" | "In Progress" | "Blocked" | "In Review" | "Done" | "Cancelled";

export interface JiraItem extends OwnedEntity {
  id: string;
  key: string;
  title: string;
  type: JiraItemType;
  url: string;
  manualText: string;
  status: JiraStatus;
  priority: ProjectPriority;
  assignee: string;
  reporter: string;
  linkedRequirement?: string;
  linkedMilestone?: string;
  deadline: string;
  lastChecked: string;
  tags: string;
}

export type DataFlowType = "Kafka topic" | "API" | "DB view" | "Event stream" | "Manual export" | "Iné";

export interface DataFlow extends OwnedEntity {
  id: string;
  name: string;
  type: DataFlowType;
  topicName: string;
  docUrl: string;
  manualText: string;
  producer: string;
  consumer: string;
  payloadSummary: string;
  dataOwner: string;
  techOwner: string;
  businessOwner: string;
  frequency: string;
  criticality: "Nízka" | "Stredná" | "Vysoká" | "Kritická";
  validationDeadline: string;
  reviewDate: string;
  linkedRequirements: string;
  linkedJira: string;
  risks: string;
  notes: string;
}

export type SQLDialect = "PostgreSQL" | "MySQL" | "MS SQL" | "Oracle" | "Hive" | "Snowflake" | "Iné";
export type SQLStatus = "Draft" | "Validovaný" | "Zastaraný" | "Archivovaný";

export interface SQLQuery extends OwnedEntity {
  id: string;
  name: string;
  description: string;
  sqlText: string;
  dialect: SQLDialect;
  author: string;
  owner: string;
  status: SQLStatus;
  priority: ProjectPriority;
  relatedProject: string;
  relatedRequirement: string;
  relatedJira: string;
  relatedDataFlow: string;
  dateCreated: string;
  dateUpdated: string;
  reviewDeadline: string;
  tags: string;
  businessCriteria: {
    goal: string;
    tables: string;
    columns: string;
    filters: string;
    period: string;
    joins: string;
    groupBy: string;
    orderBy: string;
    limit: string;
    interpretation: string;
  };
}

export interface SQLResult extends OwnedEntity {
  id: string;
  name: string;
  queryId: string;
  dateRun: string;
  inputCriteria: string;
  resultTable: any[]; // Array of objects representing rows
  summary: string;
  baInterpretation: string;
  dataOwner: string;
  reviewDeadline: string;
  dataSource: string;
  isMock: boolean;
}

export type DeadlineType = 
  | "Project milestone" 
  | "Jira due date" 
  | "Asana task due date" 
  | "Requirement deadline" 
  | "Decision review" 
  | "Open question due date" 
  | "Risk mitigation deadline" 
  | "Meeting" 
  | "Confluence review" 
  | "Kafka validation" 
  | "SQL review" 
  | "SQL result validation" 
  | "Status report" 
  | "Release date";

export type DeadlineStatus = "Planned" | "In progress" | "Waiting" | "Done" | "Overdue" | "Cancelled";

export interface Deadline extends OwnedEntity {
  id: string;
  title: string;
  type: DeadlineType;
  date: string;
  time?: string;
  owner: string;
  priority: ProjectPriority;
  status: DeadlineStatus;
  relatedProjectId: string;
  relatedItemId?: string; // ID of the related requirement, jira item, etc.
  relatedItemType?: string; // "Requirement", "JiraItem", "SQLQuery", etc.
  notes: string;
}

export type RequirementType = 
  | "Business" 
  | "Functional" 
  | "Non-functional" 
  | "Data" 
  | "Security" 
  | "Process" 
  | "UX" 
  | "Reporting";

export type RequirementStatus = 
  | "Draft" 
  | "Na potvrdenie" 
  | "Potvrdené" 
  | "Ready for refinement" 
  | "In development" 
  | "In testing" 
  | "Done" 
  | "Obsolete";

export interface Requirement extends OwnedEntity {
  id: string;
  title: string;
  description: string;
  type: RequirementType;
  priority: ProjectPriority;
  status: RequirementStatus;
  owner: string;
  source: string;
  sourceUrl?: string;
  manualSourceText?: string;
  relatedJiraKey?: string;
  relatedMilestone?: string;
  deadline?: string;
  acceptanceCriteria: string;
  dateCreated: string;
  dateUpdated: string;
  reviewDate?: string;
  notes: string;
}

export type DecisionStatus = "Draft" | "Navrhnuté" | "Potvrdené" | "Zmenené" | "Zastarané" | "Zrušené";

export interface Decision extends OwnedEntity {
  id: string;
  title: string;
  date: string;
  context: string;
  decisionText: string;
  impact: string;
  owner: string;
  approvedBy: string;
  status: DecisionStatus;
  sourceType: string;
  sourceUrl?: string;
  manualSourceText?: string;
  relatedRequirementId?: string;
  relatedJiraKey?: string;
  reviewDeadline?: string;
  lastCheckedDate?: string;
  notes: string;
}

export type QuestionStatus = "Open" | "Waiting for answer" | "Answered" | "Blocked" | "Cancelled";

export interface Question extends OwnedEntity {
  id: string;
  title: string;
  context: string;
  owner: string;
  respondent: string;
  priority: ProjectPriority;
  status: QuestionStatus;
  dueDate: string;
  sourceType: string;
  sourceUrl?: string;
  manualSourceText?: string;
  relatedRequirementId?: string;
  relatedJiraKey?: string;
  relatedRiskId?: string;
  lastFollowUpDate?: string;
  notes: string;
}

export type RiskCategory = 
  | "Business" 
  | "Technical" 
  | "Data" 
  | "Security" 
  | "Process" 
  | "Operational" 
  | "Timeline" 
  | "Dependency";

export type RiskStatus = 
  | "Open" 
  | "Monitoring" 
  | "Mitigation in progress" 
  | "Resolved" 
  | "Accepted" 
  | "Closed";

export interface Risk extends OwnedEntity {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  impact: number; // 1-5
  probability: number; // 1-5
  severity: "Nízka" | "Stredná" | "Vysoká" | "Kritická";
  owner: string;
  mitigationPlan: string;
  mitigationDeadline: string;
  status: RiskStatus;
  sourceUrl?: string;
  manualSourceText?: string;
  relatedRequirementId?: string;
  relatedJiraKey?: string;
  relatedSystemId?: string;
  notes: string;
}

export type DependencyStatus = "Plánované" | "Prebieha" | "Blokované" | "Hotové" | "Oneskorené";

export interface Dependency extends OwnedEntity {
  id: string;
  title: string;
  sourceSystem: string;
  targetSystem: string;
  description: string;
  owner: string;
  status: DependencyStatus;
  deadline: string;
  relatedRequirementId?: string;
  relatedJiraKey?: string;
}

export type AsanaTaskStatus = "Not started" | "In progress" | "Blocked" | "Done" | "Cancelled";

export interface AsanaTask extends OwnedEntity {
  id: string;
  title: string;
  description: string;
  owner: string;
  status: AsanaTaskStatus;
  priority: ProjectPriority;
  progress: number;
  dueDate: string;
  milestone: string;
  sourceUrl?: string;
  asanaUrl?: string;
  manualText?: string;
  relatedRequirementId?: string;
  relatedJiraKey?: string;
  lastUpdated: string;
  sourceImportType?: "CSV" | "JSON" | "Plain Text" | "Mock" | "Manual";
  importedAt?: string;
  projectId?: string;
  warnings?: string[];
}

export type CommunicationType = "Email" | "Teams chat" | "Teams channel" | "Meeting chat" | "Stakeholder note" | "Iné";

export interface CommunicationAnalysis {
  shortSummary: string;
  detailedSummary: string;
  decisions: string[];
  requirements: string[];
  questions: string[];
  risks: string[];
  actionSteps: string[];
  suggestedJiraTasks: string[];
  suggestedDeadlines: { title: string; date: string }[];
  stakeholders: string[];
}

export interface Communication extends OwnedEntity {
  id: string;
  title: string;
  type: CommunicationType;
  date: string;
  participants: string;
  sourceUrl?: string;
  manualText: string;
  relatedProjectId: string;
  relatedMilestone?: string;
  followUpDeadline?: string;
  tags: string;
  analysis?: CommunicationAnalysis;
}

export type MeetingType = "Discovery" | "Analysis" | "Refinement" | "Decision meeting" | "Technical sync" | "Stakeholder sync" | "BA sync" | "UAT" | "Status meeting";

export interface MeetingActionItem {
  id: string;
  task: string;
  owner: string;
  deadline: string;
  status: "Open" | "Done";
}

export interface MeetingAISummary {
  executiveSummary: string;
  detailedNotes: string;
  decisions: string[];
  actionItems: MeetingActionItem[];
  questions: string[];
  risks: string[];
  requirements: string[];
  blockers: string[];
  suggestedConfluenceUpdate: string;
  suggestedJiraTasks: string[];
  suggestedFollowUpMeeting: string;
}

export interface Meeting extends OwnedEntity {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: string;
  type: MeetingType;
  recordingUrl?: string;
  transcript: string;
  agenda: string;
  relatedProjectId: string;
  relatedMilestone?: string;
  followUpDeadline?: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  notes: string;
  aiSummary?: MeetingAISummary;
}

export interface Milestone {
  id: string;
  title: string;
  status: "Completed" | "In Progress" | "Upcoming";
  progress: number;
  dueDate: string;
}

export type DecisionPower = "Decision maker" | "Contributor" | "Consulted" | "Informed" | "Blocker risk";

export interface Stakeholder extends OwnedEntity {
  id: string;
  name: string;
  role: string;
  team: string;
  email?: string;
  phone?: string;
  responsibilityArea: string;
  decisionPower: DecisionPower;
  contactNote: string;
  relatedRequirements?: string[];
  relatedDecisions?: string[];
  relatedQuestions?: string[];
  relatedRisks?: string[];
  followUpDeadline?: string;
  notes: string;
}

export type ACStatus = "Draft" | "Ready for review" | "Approved" | "In testing" | "Passed" | "Failed" | "Obsolete";

export interface AcceptanceCriteria extends OwnedEntity {
  id: string;
  requirementId: string;
  title: string;
  given: string;
  when: string;
  then: string;
  priority: ProjectPriority;
  status: ACStatus;
  qaOwner: string;
  jiraLink?: string;
  testDeadline?: string;
  notes: string;
}

export interface Diagram {
  id: string;
  title: string;
  type: string;
  code: string;
  dateCreated: string;
}

export interface Project extends OwnedEntity {
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
  type: ProjectType;
  notes: string;
  lastModified: string;
  metrics: ProjectMetrics;
  charts: any;
  upcomingMeetings: any[];
  recentActivities: any[];
  requirements: Requirement[];
  decisions: Decision[];
  risks: Risk[];
  questions: Question[];
  dependencies: Dependency[];
  asanaTasks: AsanaTask[];
  communications: Communication[];
  meetings: Meeting[];
  milestones: Milestone[];
  diagrams: Diagram[];
  stakeholders: Stakeholder[];
  acceptanceCriteria: AcceptanceCriteria[];
  confluenceSources: ConfluenceSource[];
  jiraItems: JiraItem[];
  dataFlows: DataFlow[];
  systems: LinkedSystem[];
  sqlQueries: SQLQuery[];
  sqlResults: SQLResult[];
  deadlines: Deadline[];
  tasks: any[];
  isClosed?: boolean;
  closedAt?: string;
  closedBy?: string;
  closureReason?: string;
  closureNote?: string;
  reopenedAt?: string;
  reopenedBy?: string;
  
  // Handover fields
  previousOwnerUserId?: string;
  handoverCompletedAt?: string;
  sourceProjectId?: string;
  copiedFromHandoverId?: string;
  visibility: "private" | "handover_pending" | "transferred" | "copied_snapshot";
  handoverHistory?: ProjectHandover[];
}

export type HandoverStatus = "draft" | "pending" | "accepted" | "declined" | "cancelled" | "expired";
export type HandoverMode = "transfer_ownership" | "copy_snapshot";

export interface ProjectHandover {
  id: string;
  projectId: string;
  projectName: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  toUsername: string;
  status: HandoverStatus;
  mode: HandoverMode;
  message?: string;
  checklist: {
    documentationReady: boolean;
    openQuestionsReviewed: boolean;
    risksReviewed: boolean;
    deadlinesReviewed: boolean;
    accessNotesAdded: boolean;
  };
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
  declinedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
  declineReason?: string;
}

export type UserStatus = "active" | "pending_invite" | "pending_profile" | "disabled";

export interface User {
  id: string;
  username: string;
  passwordHash?: string; // For prototype only, never in plaintext
  displayName?: string;
  email?: string;
  role?: string;
  team?: string;
  functionTitle?: string;
  avatarInitials?: string;
  status: UserStatus;
  isAdmin: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  lastLoginAt?: string;
  profileCompletedAt?: string;
}

export type InviteStatus = "active" | "used" | "expired" | "revoked";

export interface Invite {
  id: string;
  userId: string;
  username: string;
  email?: string;
  tokenHash: string;
  status: InviteStatus;
  createdAt: string;
  createdBy: string;
  expiresAt: string;
  usedAt?: string;
  revokedAt?: string;
}

export interface WorkspaceSettings {
  workspaceName: string;
  workspaceDescription: string;
  dataMode: string;
  demoDataEnabled: boolean;
  version: string;
}
