import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Project } from "../types";
import { initialMockProject } from "../data/mockProject";

interface ProjectContextType {
  projects: Project[];
  activeProjectId: string;
  activeProject: Project | undefined;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  setActiveProject: (id: string) => void;
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

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProjectId,
      activeProject,
      addProject,
      updateProject,
      setActiveProject
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
