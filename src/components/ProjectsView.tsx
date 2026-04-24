import { useState } from 'react';
import { Plus, Search, Filter, FolderKanban } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { ProjectCard } from './ProjectCard';
import { ProjectDetail } from './ProjectDetail';
import { ProjectFormModal } from './ProjectFormModal';
import type { Project } from '../types';

export function ProjectsView() {
  const { projects, setActiveProject } = useProject();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.team.businessAnalyst.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    const matchesPriority = priorityFilter ? p.priority === priorityFilter : true;
    return matchesSearch && matchesStatus && matchesPriority;
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
    setSelectedProjectId(projectId);
    setActiveProject(projectId); // Sync with global project selector
  };

  if (selectedProjectId) {
    const project = projects.find(p => p.id === selectedProjectId);
    if (project) {
      return (
        <ProjectDetail 
          project={project} 
          onBack={() => setSelectedProjectId(null)} 
          onEdit={() => handleOpenEdit(project)}
        />
      );
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-blue-600" />
            Správa projektov
          </h1>
          <p className="text-slate-500 text-sm mt-1">Prehľad všetkých projektov v BA Workspace</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Vytvoriť projekt
        </button>
      </div>

      {/* Toolbar / Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="md:col-span-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Hľadať projekt alebo BA..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Všetky statusy</option>
          <option value="Idea">Idea</option>
          <option value="Analýza">Analýza</option>
          <option value="Vývoj">Vývoj</option>
          <option value="UAT">UAT</option>
          <option value="Done">Done</option>
        </select>
        <select 
          value={priorityFilter} 
          onChange={e => setPriorityFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Všetky priority</option>
          <option value="Kritická">Kritická</option>
          <option value="Vysoká">Vysoká</option>
          <option value="Stredná">Stredná</option>
          <option value="Nízka">Nízka</option>
        </select>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
          <Filter className="w-4 h-4" />
          Rozšírené filtre
        </button>
      </div>

      {/* Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <FolderKanban className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">Žiadne projekty neboli nájdené</h3>
          <p className="text-slate-500 text-sm">Skúste zmeniť filtre alebo vytvorte nový projekt.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => handleSelectProject(project.id)}
              onEdit={(e) => {
                e.stopPropagation();
                handleOpenEdit(project);
              }}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <ProjectFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingProject}
      />
    </div>
  );
}
