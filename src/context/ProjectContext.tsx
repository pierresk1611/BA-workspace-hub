import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Project, LinkedSystem, ConfluenceSource, JiraItem, DataFlow, SQLQuery, SQLResult, Deadline, Requirement, Decision, Question, Risk, Dependency, AsanaTask, Communication, Meeting } from "../types";
import { allMockProjects } from "../data/mockProject";

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
  addCommunication: (projectId: string, comm: Communication) => void;
  updateCommunication: (projectId: string, commId: string, comm: Partial<Communication>) => void;
  deleteCommunication: (projectId: string, commId: string) => void;
  addMeeting: (projectId: string, meeting: Meeting) => void;
  updateMeeting: (projectId: string, meetingId: string, meeting: Partial<Meeting>) => void;
  deleteMeeting: (projectId: string, meetingId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(allMockProjects);
  const [activeProjectId, setActiveProjectId] = useState<string>(''); // No project selected at startup

  const activeProject = projects.find(p => p.id === activeProjectId);

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
    setActiveProjectId(project.id);
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects(prev => 
      prev.map(p => p.id === id ? { ...p, ...updatedFields } : p)
    );
  };

  const setActiveProject = (id: string) => {
    setActiveProjectId(id);
  };

  const addSystem = (projectId: string, system: LinkedSystem) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, systems: [...p.systems, system] };
      }
      return p;
    }));
  };

  const updateSystem = (projectId: string, systemId: string, updatedFields: Partial<LinkedSystem>) => {
    setProjects(prev => prev.map(p => {
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
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, systems: p.systems.filter(sys => sys.id !== systemId) };
      }
      return p;
    }));
  };

  const addConfluenceSource = (projectId: string, source: ConfluenceSource) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, confluenceSources: [...p.confluenceSources, source] };
      }
      return p;
    }));
  };

  const updateConfluenceSource = (projectId: string, sourceId: string, updatedFields: Partial<ConfluenceSource>) => {
    setProjects(prev => prev.map(p => {
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
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, confluenceSources: p.confluenceSources.filter(src => src.id !== sourceId) };
      }
      return p;
    }));
  };

  const addJiraItem = (projectId: string, item: JiraItem) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, jiraItems: [...p.jiraItems, item] };
      }
      return p;
    }));
  };

  const updateJiraItem = (projectId: string, itemId: string, updatedFields: Partial<JiraItem>) => {
    setProjects(prev => prev.map(p => {
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
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, jiraItems: p.jiraItems.filter(item => item.id !== itemId) };
      }
      return p;
    }));
  };

  const addDataFlow = (projectId: string, flow: DataFlow) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, dataFlows: [...p.dataFlows, flow] };
      }
      return p;
    }));
  };

  const updateDataFlow = (projectId: string, flowId: string, updatedFields: Partial<DataFlow>) => {
    setProjects(prev => prev.map(p => {
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
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, dataFlows: p.dataFlows.filter(flow => flow.id !== flowId) };
      }
      return p;
    }));
  };

  const addSQLQuery = (projectId: string, query: SQLQuery) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, sqlQueries: [...p.sqlQueries, query] };
      }
      return p;
    }));
  };

  const updateSQLQuery = (projectId: string, queryId: string, updatedFields: Partial<SQLQuery>) => {
    setProjects(prev => prev.map(p => {
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
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, sqlQueries: p.sqlQueries.filter(q => q.id !== queryId) };
      }
      return p;
    }));
  };

  const addSQLResult = (projectId: string, result: SQLResult) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, sqlResults: [...p.sqlResults, result] };
      }
      return p;
    }));
  };

  const updateSQLResult = (projectId: string, resultId: string, updatedFields: Partial<SQLResult>) => {
    setProjects(prev => prev.map(p => {
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
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, sqlResults: p.sqlResults.filter(r => r.id !== resultId) };
      }
      return p;
    }));
  };

  const addDeadline = (projectId: string, deadline: Deadline) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, deadlines: [...p.deadlines, deadline] };
      }
      return p;
    }));
  };

  const updateDeadline = (projectId: string, deadlineId: string, updatedFields: Partial<Deadline>) => {
    setProjects(prev => prev.map(p => {
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
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, deadlines: p.deadlines.filter(d => d.id !== deadlineId) };
      }
      return p;
    }));
  };

  const addRequirement = (projectId: string, requirement: Requirement) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, requirements: [...p.requirements, requirement] };
      }
      return p;
    }));
  };

  const updateRequirement = (projectId: string, requirementId: string, updatedFields: Partial<Requirement>) => {
    setProjects(prev => prev.map(p => {
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
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, requirements: p.requirements.filter(r => r.id !== requirementId) };
      }
      return p;
    }));
  };

  const addDecision = (projectId: string, decision: Decision) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, decisions: [...p.decisions, decision] };
      }
      return p;
    }));
  };

  const updateDecision = (projectId: string, decisionId: string, updatedFields: Partial<Decision>) => {
    setProjects(prev => prev.map(p => {
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
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, decisions: p.decisions.filter(d => d.id !== decisionId) };
      }
      return p;
    }));
  };

  const addQuestion = (projectId: string, question: Question) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, questions: [...p.questions, question] };
      }
      return p;
    }));
  };

  const updateQuestion = (projectId: string, questionId: string, updatedFields: Partial<Question>) => {
    setProjects(prev => prev.map(p => {
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
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, questions: p.questions.filter(q => q.id !== questionId) };
      }
      return p;
    }));
  };

  const addRisk = (projectId: string, risk: Risk) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, risks: [...p.risks, risk] };
      }
      return p;
    }));
  };

  const updateRisk = (projectId: string, riskId: string, updatedFields: Partial<Risk>) => {
    setProjects(prev => prev.map(p => {
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
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, risks: p.risks.filter(r => r.id !== riskId) };
      }
      return p;
    }));
  };

  const addDependency = (projectId: string, dependency: Dependency) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, dependencies: [...p.dependencies, dependency] };
      }
      return p;
    }));
  };

  const updateDependency = (projectId: string, dependencyId: string, updatedFields: Partial<Dependency>) => {
    setProjects(prev => prev.map(p => {
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
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, dependencies: p.dependencies.filter(d => d.id !== dependencyId) };
      }
      return p;
    }));
  };

  const addAsanaTask = (projectId: string, task: AsanaTask) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, asanaTasks: [...p.asanaTasks, task] };
      }
      return p;
    }));
  };

  const updateAsanaTask = (projectId: string, taskId: string, updatedFields: Partial<AsanaTask>) => {
    setProjects(prev => prev.map(p => {
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
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, asanaTasks: p.asanaTasks.filter(t => t.id !== taskId) };
      }
      return p;
    }));
  };

  const addCommunication = (projectId: string, comm: Communication) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, communications: [...p.communications, comm] };
      }
      return p;
    }));
  };

  const updateCommunication = (projectId: string, commId: string, updatedFields: Partial<Communication>) => {
    setProjects(prev => prev.map(p => {
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
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, communications: p.communications.filter(c => c.id !== commId) };
      }
      return p;
    }));
  };

  const addMeeting = (projectId: string, meeting: Meeting) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, meetings: [...p.meetings, meeting] };
      }
      return p;
    }));
  };

  const updateMeeting = (projectId: string, meetingId: string, updatedFields: Partial<Meeting>) => {
    setProjects(prev => prev.map(p => {
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
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, meetings: p.meetings.filter(m => m.id !== meetingId) };
      }
      return p;
    }));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id);
      if (activeProjectId === id && updated.length > 0) {
        setActiveProjectId(updated[0].id);
      } else if (updated.length === 0) {
        setActiveProjectId('');
      }
      return updated;
    });
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
      addCommunication,
      updateCommunication,
      deleteCommunication,
      addMeeting,
      updateMeeting,
      deleteMeeting
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
