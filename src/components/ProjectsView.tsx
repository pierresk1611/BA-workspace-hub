import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FolderKanban } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { ProjectCard } from './ProjectCard';
import { ProjectFormModal } from './ProjectFormModal';
import { HandoverModal } from './HandoverModal';
import { EmptyState } from './Badge';
import type { Project } from '../types';
import { cn } from '../lib/utils';

export function ProjectsView() {
  const { projects, setActiveProject, loadDemoData } = useProject();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [handoverProject, setHandoverProject] = useState<Project | null>(null);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.team.businessAnalyst.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = () => {
    setEditingProject(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleSelectProject = (projectId: string) => {
    setActiveProject(projectId);
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Project Portfolio</h1>
          <p className="text-slate-500 font-medium text-sm md:text-lg max-w-2xl leading-relaxed">
            Správa všetkých aktívnych projektov, iniciatív a ich aktuálneho progresu.
          </p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 md:px-8 py-4 rounded-xl md:rounded-[1.5rem] font-black text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all w-full md:w-auto"
        >
          <Plus className="w-5 h-5" /> Nový Projekt
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-center gap-4 bg-white p-4 rounded-2xl md:rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Hľadať projekt..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 custom-scrollbar scrollbar-hide">
           {(['All', 'Analýza', 'Solution Design', 'Discovery', 'Vývoj', 'Done', 'Ukončené'] as const).map(status => (
             <button
               key={status}
               onClick={() => setStatusFilter(status === 'All' ? '' : status)}
               className={cn(
                 "px-4 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap border",
                 (status === 'All' && !statusFilter) || statusFilter === status 
                  ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
               )}
             >
               {status}
             </button>
           ))}
        </div>
      </div>

      {/* Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState 
          icon={FolderKanban}
          title="Žiadne projekty"
          description="Neboli nájdené žiadne projekty zodpovedajúce vašim filtrom."
          actionLabel="Vytvoriť Projekt"
          onAction={handleOpenCreate}
          secondaryActionLabel="Načítať demo dáta"
          onSecondaryAction={() => {
            if (confirm('Naozaj chcete načítať demo dáta?')) {
              loadDemoData();
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => handleSelectProject(project.id)}
              onEdit={(e) => {
                e.stopPropagation();
                handleOpenEdit(project);
              }}
              onHandover={(e) => {
                e.stopPropagation();
                setHandoverProject(project);
              }}
            />
          ))}
        </div>
      )}

      <ProjectFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingProject}
      />

      <HandoverModal 
        isOpen={!!handoverProject}
        onClose={() => setHandoverProject(null)}
        project={handoverProject!}
      />
    </div>
  );
}
