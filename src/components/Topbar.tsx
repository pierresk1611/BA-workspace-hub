import React, { useState } from "react";
import { Search, Plus, Bell, ChevronDown } from "lucide-react";
import { useProject } from "../context/ProjectContext";
import { ProjectFormModal } from "./ProjectFormModal";

export function Topbar() {
  const { projects, activeProjectId, setActiveProject } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveProject(e.target.value);
  };

  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4 flex-1">
          
          <div className="relative group flex items-center bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-xs font-bold shrink-0">
              {activeProject?.name.substring(0, 2).toUpperCase() || 'PR'}
            </div>
            <select 
              value={activeProjectId} 
              onChange={handleProjectChange}
              className="appearance-none bg-transparent py-1.5 pl-3 pr-8 text-sm font-semibold text-slate-800 outline-none cursor-pointer relative z-10 w-full"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2 pointer-events-none" />
          </div>
          
          <div className="max-w-md w-full relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" />
            <input 
              type="text" 
              placeholder="Globálne vyhľadávanie (Projekty, tasky, dokumenty...)" 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Vytvoriť projekt
          </button>
        </div>
      </header>
      
      <ProjectFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
