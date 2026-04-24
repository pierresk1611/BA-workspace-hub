import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Project, LinkedSystem } from "../types";
import { initialMockProject } from "../data/mockProject";

interface ProjectContextType {
  projects: Project[];
  activeProjectId: string;
  activeProject: Project | undefined;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  setActiveProject: (id: string) => void;
  addSystem: (projectId: string, system: LinkedSystem) => void;
  updateSystem: (projectId: string, systemId: string, system: Partial<LinkedSystem>) => void;
  deleteSystem: (projectId: string, systemId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([initialMockProject]);
  const [activeProjectId, setActiveProjectId] = useState<string>(initialMockProject.id);

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

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProjectId,
      activeProject,
      addProject,
      updateProject,
      setActiveProject,
      addSystem,
      updateSystem,
      deleteSystem
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
