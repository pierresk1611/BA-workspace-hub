import { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import type { Project, LinkedSystem, ConfluenceSource, JiraItem, DataFlow, SQLQuery, SQLResult, Deadline, Requirement, Decision, Question, Risk, Dependency, AsanaTask, Communication, Meeting, Stakeholder, AcceptanceCriteria, ProjectHandover, HandoverMode } from "../types";
import { useAuth } from "./AuthContext";
// Static demo data imports removed to enforce Clean Workspace Policy
// demoProjectsData is now loaded dynamically in loadDemoData()

interface ProjectContextType {
  projects: Project[];
  activeProjectId: string;
  activeProject: Project | undefined;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  setActiveProject: (id: string) => void;
  deleteProject: (id: string) => void;
  addSystem: (projectId: string, system: LinkedSystem) => void;
  updateSystem: (projectId: string, systemId: string, system: Partial<LinkedSystem>) => void;
  deleteSystem: (projectId: string, systemId: string) => void;
  addConfluenceSource: (projectId: string, source: ConfluenceSource) => void;
  updateConfluenceSource: (projectId: string, sourceId: string, source: Partial<ConfluenceSource>) => void;
  deleteConfluenceSource: (projectId: string, sourceId: string) => void;
  addJiraItem: (projectId: string, item: JiraItem) => void;
  updateJiraItem: (projectId: string, itemId: string, item: Partial<JiraItem>) => void;
  deleteJiraItem: (projectId: string, itemId: string) => void;
  addDataFlow: (projectId: string, flow: DataFlow) => void;
  updateDataFlow: (projectId: string, flowId: string, flow: Partial<DataFlow>) => void;
  deleteDataFlow: (projectId: string, flowId: string) => void;
  addSQLQuery: (projectId: string, query: SQLQuery) => void;
  updateSQLQuery: (projectId: string, queryId: string, query: Partial<SQLQuery>) => void;
  deleteSQLQuery: (projectId: string, queryId: string) => void;
  addSQLResult: (projectId: string, result: SQLResult) => void;
  updateSQLResult: (projectId: string, resultId: string, result: Partial<SQLResult>) => void;
  deleteSQLResult: (projectId: string, resultId: string) => void;
  addDeadline: (projectId: string, deadline: Deadline) => void;
  updateDeadline: (projectId: string, deadlineId: string, deadline: Partial<Deadline>) => void;
  deleteDeadline: (projectId: string, deadlineId: string) => void;
  addRequirement: (projectId: string, requirement: Requirement) => void;
  updateRequirement: (projectId: string, requirementId: string, requirement: Partial<Requirement>) => void;
  deleteRequirement: (projectId: string, requirementId: string) => void;
  addDecision: (projectId: string, decision: Decision) => void;
  updateDecision: (projectId: string, decisionId: string, decision: Partial<Decision>) => void;
  deleteDecision: (projectId: string, decisionId: string) => void;
  addQuestion: (projectId: string, question: Question) => void;
  updateQuestion: (projectId: string, questionId: string, question: Partial<Question>) => void;
  deleteQuestion: (projectId: string, questionId: string) => void;
  addRisk: (projectId: string, risk: Risk) => void;
  updateRisk: (projectId: string, riskId: string, risk: Partial<Risk>) => void;
  deleteRisk: (projectId: string, riskId: string) => void;
  addDependency: (projectId: string, dependency: Dependency) => void;
  updateDependency: (projectId: string, dependencyId: string, dependency: Partial<Dependency>) => void;
  deleteDependency: (projectId: string, dependencyId: string) => void;
  addAsanaTask: (projectId: string, task: AsanaTask) => void;
  updateAsanaTask: (projectId: string, taskId: string, task: Partial<AsanaTask>) => void;
  deleteAsanaTask: (projectId: string, taskId: string) => void;
  importAsanaTasks: (projectId: string, tasks: AsanaTask[]) => void;
  addCommunication: (projectId: string, comm: Communication) => void;
  updateCommunication: (projectId: string, commId: string, comm: Partial<Communication>) => void;
  deleteCommunication: (projectId: string, commId: string) => void;
  addMeeting: (projectId: string, meeting: Meeting) => void;
  updateMeeting: (projectId: string, meetingId: string, meeting: Partial<Meeting>) => void;
  deleteMeeting: (projectId: string, meetingId: string) => void;
  addStakeholder: (projectId: string, stakeholder: Stakeholder) => void;
  updateStakeholder: (projectId: string, stakeholderId: string, stakeholder: Partial<Stakeholder>) => void;
  deleteStakeholder: (projectId: string, stakeholderId: string) => void;
  addAcceptanceCriteria: (projectId: string, criteria: AcceptanceCriteria) => void;
  updateAcceptanceCriteria: (projectId: string, criteriaId: string, criteria: Partial<AcceptanceCriteria>) => void;
  deleteAcceptanceCriteria: (projectId: string, criteriaId: string) => void;
  closeProject: (id: string, reason: string, note: string) => void;
  reopenProject: (id: string) => void;
  loadDemoData: () => Promise<void>;
  clearAllData: () => void;
  readIds: Set<string>;
  setReadIds: (ids: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  handovers: ProjectHandover[];
  sendHandover: (handover: Omit<ProjectHandover, 'id' | 'createdAt' | 'status'>) => void;
  acceptHandover: (handoverId: string) => Promise<void>;
  declineHandover: (handoverId: string, reason?: string) => void;
  cancelHandover: (handoverId: string) => void;
}

const STORAGE_KEY = "baWorkspace.projects";
const HANDOVER_STORAGE_KEY = "baWorkspace.handovers";
const CLEAN_POLICY_VERSION = "3"; // Increment this to force-clean legacy demo data
const CLEAN_MODE_KEY = "baWorkspace.cleanMode";
const CLEAN_VERSION_KEY = "baWorkspace.cleanPolicyVersion";

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [allProjects, setAllProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const currentPolicyVersion = localStorage.getItem(CLEAN_VERSION_KEY);
      
      if (stored) {
        let parsed = JSON.parse(stored);
        
        // If policy version is missing or old, force a cleanup of legacy demo projects
        if (currentPolicyVersion !== CLEAN_POLICY_VERSION) {
          const demoIds = ["driver-app", "label-redesign", "dropshipment-matrix"];
          const demoNames = ["Driver App", "Delivery 2.0 Label Redesign", "Dropshipment Delivery Matrix"];
          
          const filtered = parsed.filter((p: any) => 
            !demoIds.includes(p.id) && !demoNames.includes(p.name)
          );
          
          // Force clear if we find any legacy markers
          if (filtered.length !== parsed.length) {
            parsed = filtered;
          }
          
          localStorage.setItem(CLEAN_VERSION_KEY, CLEAN_POLICY_VERSION);
          localStorage.setItem(CLEAN_MODE_KEY, "true");
        }
        return parsed;
      }
      
      // First run: set policy and mode
      localStorage.setItem(CLEAN_VERSION_KEY, CLEAN_POLICY_VERSION);
      localStorage.setItem(CLEAN_MODE_KEY, "true");
      return [];
    } catch (e) {
      return [];
    }
  });

  const [handovers, setHandovers] = useState<ProjectHandover[]>(() => {
    try {
      const stored = localStorage.getItem(HANDOVER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Data Isolation: Only show projects belonging to the current user
  const projects = useMemo(() => {
    if (!currentUser) return [];
    return allProjects.filter(p => p.ownerUserId === currentUser.id);
  }, [allProjects, currentUser]);

  const [activeProjectId, setActiveProjectId] = useState<string>('');

  // Scoped notifications read status
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`ba_hub_read_notifications_${currentUser.id}`);
      if (saved) {
        try {
          setReadIds(new Set(JSON.parse(saved)));
        } catch (e) {
          setReadIds(new Set());
        }
      } else {
        setReadIds(new Set());
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`ba_hub_read_notifications_${currentUser.id}`, JSON.stringify(Array.from(readIds)));
    }
  }, [readIds, currentUser]); // No project selected at startup

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProjects));
      localStorage.setItem(CLEAN_MODE_KEY, "true");
    } catch (e) {
      console.error("Failed to save projects to localStorage", e);
    }
  }, [allProjects]);

  useEffect(() => {
    try {
      localStorage.setItem(HANDOVER_STORAGE_KEY, JSON.stringify(handovers));
    } catch (e) {
      console.error("Failed to save handovers to localStorage", e);
    }
  }, [handovers]);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const addProject = (project: Project) => {
    if (!currentUser) return;
    const projectWithOwner = { 
      ...project, 
      ownerUserId: currentUser.id, 
      createdByUserId: currentUser.id 
    };
    setAllProjects(prev => [...prev, projectWithOwner]);
    setActiveProjectId(project.id);
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setAllProjects(prev => 
      prev.map(p => p.id === id ? { ...p, ...updatedFields } : p)
    );
  };

  const setActiveProject = (id: string) => {
    setActiveProjectId(id);
  };

  const addSystem = (projectId: string, system: LinkedSystem) => {
    if (!currentUser) return;
    const systemWithOwner = { ...system, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, systems: [...p.systems, systemWithOwner] };
      }
      return p;
    }));
  };

  const updateSystem = (projectId: string, systemId: string, updatedFields: Partial<LinkedSystem>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          systems: p.systems.map(sys => sys.id === systemId ? { ...sys, ...updatedFields } : sys)
        };
      }
      return p;
    }));
  };

  const deleteSystem = (projectId: string, systemId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, systems: p.systems.filter(sys => sys.id !== systemId) };
      }
      return p;
    }));
  };

  const addConfluenceSource = (projectId: string, source: ConfluenceSource) => {
    if (!currentUser) return;
    const sourceWithOwner = { ...source, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, confluenceSources: [...p.confluenceSources, sourceWithOwner] };
      }
      return p;
    }));
  };

  const updateConfluenceSource = (projectId: string, sourceId: string, updatedFields: Partial<ConfluenceSource>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          confluenceSources: p.confluenceSources.map(src => src.id === sourceId ? { ...src, ...updatedFields } : src)
        };
      }
      return p;
    }));
  };

  const deleteConfluenceSource = (projectId: string, sourceId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, confluenceSources: p.confluenceSources.filter(src => src.id !== sourceId) };
      }
      return p;
    }));
  };

  const addJiraItem = (projectId: string, item: JiraItem) => {
    if (!currentUser) return;
    const itemWithOwner = { ...item, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, jiraItems: [...p.jiraItems, itemWithOwner] };
      }
      return p;
    }));
  };

  const updateJiraItem = (projectId: string, itemId: string, updatedFields: Partial<JiraItem>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          jiraItems: p.jiraItems.map(item => item.id === itemId ? { ...item, ...updatedFields } : item)
        };
      }
      return p;
    }));
  };

  const deleteJiraItem = (projectId: string, itemId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, jiraItems: p.jiraItems.filter(item => item.id !== itemId) };
      }
      return p;
    }));
  };

  const addDataFlow = (projectId: string, flow: DataFlow) => {
    if (!currentUser) return;
    const flowWithOwner = { ...flow, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, dataFlows: [...p.dataFlows, flowWithOwner] };
      }
      return p;
    }));
  };

  const updateDataFlow = (projectId: string, flowId: string, updatedFields: Partial<DataFlow>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          dataFlows: p.dataFlows.map(flow => flow.id === flowId ? { ...flow, ...updatedFields } : flow)
        };
      }
      return p;
    }));
  };

  const deleteDataFlow = (projectId: string, flowId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, dataFlows: p.dataFlows.filter(flow => flow.id !== flowId) };
      }
      return p;
    }));
  };

  const addSQLQuery = (projectId: string, query: SQLQuery) => {
    if (!currentUser) return;
    const queryWithOwner = { ...query, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, sqlQueries: [...p.sqlQueries, queryWithOwner] };
      }
      return p;
    }));
  };

  const updateSQLQuery = (projectId: string, queryId: string, updatedFields: Partial<SQLQuery>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          sqlQueries: p.sqlQueries.map(q => q.id === queryId ? { ...q, ...updatedFields } : q)
        };
      }
      return p;
    }));
  };

  const deleteSQLQuery = (projectId: string, queryId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, sqlQueries: p.sqlQueries.filter(q => q.id !== queryId) };
      }
      return p;
    }));
  };

  const addSQLResult = (projectId: string, result: SQLResult) => {
    if (!currentUser) return;
    const resultWithOwner = { ...result, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, sqlResults: [...p.sqlResults, resultWithOwner] };
      }
      return p;
    }));
  };

  const updateSQLResult = (projectId: string, resultId: string, updatedFields: Partial<SQLResult>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          sqlResults: p.sqlResults.map(r => r.id === resultId ? { ...r, ...updatedFields } : r)
        };
      }
      return p;
    }));
  };

  const deleteSQLResult = (projectId: string, resultId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, sqlResults: p.sqlResults.filter(r => r.id !== resultId) };
      }
      return p;
    }));
  };

  const addDeadline = (projectId: string, deadline: Deadline) => {
    if (!currentUser) return;
    const deadlineWithOwner = { ...deadline, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, deadlines: [...p.deadlines, deadlineWithOwner] };
      }
      return p;
    }));
  };

  const updateDeadline = (projectId: string, deadlineId: string, updatedFields: Partial<Deadline>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          deadlines: p.deadlines.map(d => d.id === deadlineId ? { ...d, ...updatedFields } : d)
        };
      }
      return p;
    }));
  };

  const deleteDeadline = (projectId: string, deadlineId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, deadlines: p.deadlines.filter(d => d.id !== deadlineId) };
      }
      return p;
    }));
  };

  const addRequirement = (projectId: string, requirement: Requirement) => {
    if (!currentUser) return;
    const reqWithOwner = { ...requirement, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, requirements: [...p.requirements, reqWithOwner] };
      }
      return p;
    }));
  };

  const updateRequirement = (projectId: string, requirementId: string, updatedFields: Partial<Requirement>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          requirements: p.requirements.map(r => r.id === requirementId ? { ...r, ...updatedFields } : r)
        };
      }
      return p;
    }));
  };

  const deleteRequirement = (projectId: string, requirementId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, requirements: p.requirements.filter(r => r.id !== requirementId) };
      }
      return p;
    }));
  };

  const addDecision = (projectId: string, decision: Decision) => {
    if (!currentUser) return;
    const decWithOwner = { ...decision, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, decisions: [...p.decisions, decWithOwner] };
      }
      return p;
    }));
  };

  const updateDecision = (projectId: string, decisionId: string, updatedFields: Partial<Decision>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          decisions: p.decisions.map(d => d.id === decisionId ? { ...d, ...updatedFields } : d)
        };
      }
      return p;
    }));
  };

  const deleteDecision = (projectId: string, decisionId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, decisions: p.decisions.filter(d => d.id !== decisionId) };
      }
      return p;
    }));
  };

  const addQuestion = (projectId: string, question: Question) => {
    if (!currentUser) return;
    const qWithOwner = { ...question, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, questions: [...p.questions, qWithOwner] };
      }
      return p;
    }));
  };

  const updateQuestion = (projectId: string, questionId: string, updatedFields: Partial<Question>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          questions: p.questions.map(q => q.id === questionId ? { ...q, ...updatedFields } : q)
        };
      }
      return p;
    }));
  };

  const deleteQuestion = (projectId: string, questionId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, questions: p.questions.filter(q => q.id !== questionId) };
      }
      return p;
    }));
  };

  const addRisk = (projectId: string, risk: Risk) => {
    if (!currentUser) return;
    const riskWithOwner = { ...risk, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, risks: [...p.risks, riskWithOwner] };
      }
      return p;
    }));
  };

  const updateRisk = (projectId: string, riskId: string, updatedFields: Partial<Risk>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          risks: p.risks.map(r => r.id === riskId ? { ...r, ...updatedFields } : r)
        };
      }
      return p;
    }));
  };

  const deleteRisk = (projectId: string, riskId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, risks: p.risks.filter(r => r.id !== riskId) };
      }
      return p;
    }));
  };

  const addDependency = (projectId: string, dependency: Dependency) => {
    if (!currentUser) return;
    const depWithOwner = { ...dependency, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, dependencies: [...p.dependencies, depWithOwner] };
      }
      return p;
    }));
  };

  const updateDependency = (projectId: string, dependencyId: string, updatedFields: Partial<Dependency>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          dependencies: p.dependencies.map(d => d.id === dependencyId ? { ...d, ...updatedFields } : d)
        };
      }
      return p;
    }));
  };

  const deleteDependency = (projectId: string, dependencyId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, dependencies: p.dependencies.filter(d => d.id !== dependencyId) };
      }
      return p;
    }));
  };

  const addAsanaTask = (projectId: string, task: AsanaTask) => {
    if (!currentUser) return;
    const taskWithOwner = { ...task, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, asanaTasks: [...p.asanaTasks, taskWithOwner] };
      }
      return p;
    }));
  };

  const updateAsanaTask = (projectId: string, taskId: string, updatedFields: Partial<AsanaTask>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          asanaTasks: p.asanaTasks.map(t => t.id === taskId ? { ...t, ...updatedFields } : t)
        };
      }
      return p;
    }));
  };

  const deleteAsanaTask = (projectId: string, taskId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, asanaTasks: p.asanaTasks.filter(t => t.id !== taskId) };
      }
      return p;
    }));
  };

  const importAsanaTasks = (projectId: string, tasks: AsanaTask[]) => {
    if (!currentUser) return;
    const tasksWithOwner = tasks.map(t => ({ ...t, ownerUserId: currentUser.id, createdByUserId: currentUser.id }));
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const existingTasks = [...(p.asanaTasks || [])];
        const tasksToProcess = [...tasksWithOwner];
        
        // Match and update existing tasks, then add remaining new ones
        const updatedExisting = existingTasks.map(et => {
          const matchIndex = tasksToProcess.findIndex(nt => 
            (nt.asanaUrl && et.asanaUrl === nt.asanaUrl) || 
            (et.title === nt.title && et.dueDate === nt.dueDate)
          );
          
          if (matchIndex !== -1) {
            const match = tasksToProcess.splice(matchIndex, 1)[0];
            return { ...et, ...match };
          }
          return et;
        });

        return { ...p, asanaTasks: [...updatedExisting, ...tasksToProcess] };
      }
      return p;
    }));
  };

  const addCommunication = (projectId: string, comm: Communication) => {
    if (!currentUser) return;
    const commWithOwner = { ...comm, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, communications: [...p.communications, commWithOwner] };
      }
      return p;
    }));
  };

  const updateCommunication = (projectId: string, commId: string, updatedFields: Partial<Communication>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          communications: p.communications.map(c => c.id === commId ? { ...c, ...updatedFields } : c)
        };
      }
      return p;
    }));
  };

  const deleteCommunication = (projectId: string, commId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, communications: p.communications.filter(c => c.id !== commId) };
      }
      return p;
    }));
  };

  const addMeeting = (projectId: string, meeting: Meeting) => {
    if (!currentUser) return;
    const meetingWithOwner = { ...meeting, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, meetings: [...p.meetings, meetingWithOwner] };
      }
      return p;
    }));
  };

  const updateMeeting = (projectId: string, meetingId: string, updatedFields: Partial<Meeting>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          meetings: p.meetings.map(m => m.id === meetingId ? { ...m, ...updatedFields } : m)
        };
      }
      return p;
    }));
  };

  const deleteMeeting = (projectId: string, meetingId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, meetings: p.meetings.filter(m => m.id !== meetingId) };
      }
      return p;
    }));
  };

  const addStakeholder = (projectId: string, stakeholder: Stakeholder) => {
    if (!currentUser) return;
    const shWithOwner = { ...stakeholder, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, stakeholders: [...(p.stakeholders || []), shWithOwner] };
      }
      return p;
    }));
  };

  const updateStakeholder = (projectId: string, stakeholderId: string, updatedFields: Partial<Stakeholder>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          stakeholders: (p.stakeholders || []).map(s => s.id === stakeholderId ? { ...s, ...updatedFields } : s)
        };
      }
      return p;
    }));
  };

  const deleteStakeholder = (projectId: string, stakeholderId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, stakeholders: (p.stakeholders || []).filter(s => s.id !== stakeholderId) };
      }
      return p;
    }));
  };

  const addAcceptanceCriteria = (projectId: string, criteria: AcceptanceCriteria) => {
    if (!currentUser) return;
    const acWithOwner = { ...criteria, ownerUserId: currentUser.id, createdByUserId: currentUser.id };
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, acceptanceCriteria: [...(p.acceptanceCriteria || []), acWithOwner] };
      }
      return p;
    }));
  };

  const updateAcceptanceCriteria = (projectId: string, criteriaId: string, updatedFields: Partial<AcceptanceCriteria>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          acceptanceCriteria: (p.acceptanceCriteria || []).map(ac => ac.id === criteriaId ? { ...ac, ...updatedFields } : ac)
        };
      }
      return p;
    }));
  };

  const deleteAcceptanceCriteria = (projectId: string, criteriaId: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, acceptanceCriteria: (p.acceptanceCriteria || []).filter(ac => ac.id !== criteriaId) };
      }
      return p;
    }));
  };

  const deleteProject = (id: string) => {
    setAllProjects(prev => {
      const updated = prev.filter(p => p.id !== id);
      if (activeProjectId === id) {
        setActiveProjectId('');
      }
      return updated;
    });
  };

  const closeProject = (id: string, reason: string, note: string) => {
    if (!currentUser) return;
    setAllProjects(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Ukončené',
          isClosed: true,
          closedAt: new Date().toISOString(),
          closedBy: currentUser.username,
          closureReason: reason,
          closureNote: note,
          metrics: {
            ...p.metrics,
            progress: Math.max(p.metrics.progress, 100)
          }
        };
      }
      return p;
    }));
  };

  const reopenProject = (id: string) => {
    if (!currentUser) return;
    setAllProjects(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Analýza',
          isClosed: false,
          reopenedAt: new Date().toISOString(),
          reopenedBy: currentUser.username
        };
      }
      return p;
    }));
  };

  const sendHandover = (handoverData: Omit<ProjectHandover, 'id' | 'createdAt' | 'status'>) => {
    if (!currentUser) return;
    const newHandover: ProjectHandover = {
      ...handoverData,
      id: `ho-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setHandovers(prev => [...prev, newHandover]);
    
    // Update project visibility
    setAllProjects(prev => prev.map(p => 
      p.id === handoverData.projectId ? { ...p, visibility: 'handover_pending' } : p
    ));
  };

  const copyProjectSnapshot = (project: Project, toUserId: string, handoverId: string): Project => {
    const timestamp = new Date().toISOString();
    const newProjectId = `proj-${Date.now()}`;
    
    // Helper to update owner and id for entities
    const updateEntities = <T extends { id: string; ownerUserId: string; createdByUserId: string }>(entities: T[]): T[] => {
      return (entities || []).map(e => ({
        ...e,
        id: `${e.id}-copy-${Date.now()}`,
        ownerUserId: toUserId,
        createdByUserId: toUserId // In copy snapshot, receiver becomes creator of the copy
      }));
    };

    return {
      ...project,
      id: newProjectId,
      ownerUserId: toUserId,
      createdByUserId: toUserId,
      sourceProjectId: project.id,
      copiedFromHandoverId: handoverId,
      visibility: 'copied_snapshot',
      lastModified: timestamp,
      handoverCompletedAt: timestamp,
      // Deep copy all entities
      requirements: updateEntities(project.requirements),
      decisions: updateEntities(project.decisions),
      risks: updateEntities(project.risks),
      questions: updateEntities(project.questions),
      dependencies: updateEntities(project.dependencies),
      asanaTasks: updateEntities(project.asanaTasks),
      communications: updateEntities(project.communications),
      meetings: updateEntities(project.meetings),
      stakeholders: updateEntities(project.stakeholders),
      acceptanceCriteria: updateEntities(project.acceptanceCriteria),
      confluenceSources: updateEntities(project.confluenceSources),
      jiraItems: updateEntities(project.jiraItems),
      dataFlows: updateEntities(project.dataFlows),
      systems: updateEntities(project.systems),
      sqlQueries: updateEntities(project.sqlQueries),
      sqlResults: updateEntities(project.sqlResults),
      deadlines: updateEntities(project.deadlines),
    };
  };

  const acceptHandover = async (handoverId: string) => {
    const handover = handovers.find(h => h.id === handoverId);
    if (!handover || !currentUser) return;

    const timestamp = new Date().toISOString();

    if (handover.mode === 'transfer_ownership') {
      // Transfer logic
      setAllProjects(prev => prev.map(p => {
        if (p.id === handover.projectId) {
          const updatedHandover = { ...handover, status: 'accepted' as const, completedAt: timestamp, acceptedAt: timestamp };
          return {
            ...p,
            ownerUserId: handover.toUserId,
            previousOwnerUserId: handover.fromUserId,
            handoverCompletedAt: timestamp,
            visibility: 'transferred' as const,
            lastModified: timestamp,
            handoverHistory: [...(p.handoverHistory || []), updatedHandover],
            // Update all sub-entities owner
            requirements: (p.requirements || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
            decisions: (p.decisions || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
            risks: (p.risks || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
            questions: (p.questions || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
            dependencies: (p.dependencies || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
            asanaTasks: (p.asanaTasks || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
            communications: (p.communications || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
            meetings: (p.meetings || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
            stakeholders: (p.stakeholders || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
            acceptanceCriteria: (p.acceptanceCriteria || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
            confluenceSources: (p.confluenceSources || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
            jiraItems: (p.jiraItems || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
            dataFlows: (p.dataFlows || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
            systems: (p.systems || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
            sqlQueries: (p.sqlQueries || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
            sqlResults: (p.sqlResults || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
            deadlines: (p.deadlines || []).map(e => ({ ...e, ownerUserId: handover.toUserId })),
          };
        }
        return p;
      }));
    } else {
      // Copy snapshot logic
      const sourceProject = allProjects.find(p => p.id === handover.projectId);
      if (sourceProject) {
        const snapshot = copyProjectSnapshot(sourceProject, handover.toUserId, handover.id);
        const updatedHandover = { ...handover, status: 'accepted' as const, completedAt: timestamp, acceptedAt: timestamp };
        snapshot.handoverHistory = [...(snapshot.handoverHistory || []), updatedHandover];
        
        setAllProjects(prev => [...prev, snapshot]);
        
        // Update original project to restore visibility
        setAllProjects(prev => prev.map(p => 
          p.id === handover.projectId ? { ...p, visibility: 'private' } : p
        ));
      }
    }

    setHandovers(prev => prev.map(h => 
      h.id === handoverId ? { ...h, status: 'accepted', acceptedAt: timestamp, completedAt: timestamp } : h
    ));
  };

  const declineHandover = (handoverId: string, reason?: string) => {
    const timestamp = new Date().toISOString();
    setHandovers(prev => prev.map(h => 
      h.id === handoverId ? { ...h, status: 'declined', declinedAt: timestamp, declineReason: reason } : h
    ));
    
    // Restore project visibility
    const handover = handovers.find(h => h.id === handoverId);
    if (handover) {
      setAllProjects(prev => prev.map(p => 
        p.id === handover.projectId ? { ...p, visibility: 'private' } : p
      ));
    }
  };

  const cancelHandover = (handoverId: string) => {
    const timestamp = new Date().toISOString();
    setHandovers(prev => prev.map(h => 
      h.id === handoverId ? { ...h, status: 'cancelled', cancelledAt: timestamp } : h
    ));
    
    // Restore project visibility
    const handover = handovers.find(h => h.id === handoverId);
    if (handover) {
      setAllProjects(prev => prev.map(p => 
        p.id === handover.projectId ? { ...p, visibility: 'private' } : p
      ));
    }
  };

  const loadDemoData = async () => {
    try {
      if (!currentUser) return;
      // Dynamic import to keep runtime bundle clean
      const { demoProjectsData } = await import("../demo/demoSeedData");
      const existingIds = new Set(allProjects.map(p => p.id));
      const newDemoData = demoProjectsData
        .filter(p => !existingIds.has(p.id))
        .map(p => ({ 
          ...p, 
          ownerUserId: currentUser.id, 
          createdByUserId: currentUser.id 
        }));
      
      if (newDemoData.length > 0) {
        setAllProjects(prev => [...prev, ...newDemoData]);
      }
    } catch (error) {
      console.error("Failed to load demo data:", error);
    }
  };

  const clearAllData = () => {
    setAllProjects([]);
    setActiveProjectId('');
    // Clear all baWorkspace keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('baWorkspace.') || key.startsWith('ba_hub_')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.setItem(CLEAN_MODE_KEY, "true");
    localStorage.setItem(CLEAN_VERSION_KEY, CLEAN_POLICY_VERSION);
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProjectId,
      activeProject,
      addProject,
      updateProject,
      setActiveProject,
      deleteProject,
      addSystem,
      updateSystem,
      deleteSystem,
      addConfluenceSource,
      updateConfluenceSource,
      deleteConfluenceSource,
      addJiraItem,
      updateJiraItem,
      deleteJiraItem,
      addDataFlow,
      updateDataFlow,
      deleteDataFlow,
      addSQLQuery,
      updateSQLQuery,
      deleteSQLQuery,
      addSQLResult,
      updateSQLResult,
      deleteSQLResult,
      addDeadline,
      updateDeadline,
      deleteDeadline,
      addRequirement,
      updateRequirement,
      deleteRequirement,
      addDecision,
      updateDecision,
      deleteDecision,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      addRisk,
      updateRisk,
      deleteRisk,
      addDependency,
      updateDependency,
      deleteDependency,
      addAsanaTask,
      updateAsanaTask,
      deleteAsanaTask,
      importAsanaTasks,
      addCommunication,
      updateCommunication,
      deleteCommunication,
      addMeeting,
      updateMeeting,
      deleteMeeting,
      addStakeholder,
      updateStakeholder,
      deleteStakeholder,
      addAcceptanceCriteria,
      updateAcceptanceCriteria,
      deleteAcceptanceCriteria,
      closeProject,
      reopenProject,
      loadDemoData,
      clearAllData,
      readIds,
      setReadIds,
      handovers,
      sendHandover,
      acceptHandover,
      declineHandover,
      cancelHandover
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
