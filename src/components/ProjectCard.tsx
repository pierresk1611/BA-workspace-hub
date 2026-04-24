import { MoreVertical, Calendar, Users, TrendingUp, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Project } from '../types';
import { useProject } from '../context/ProjectContext';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
}

export function ProjectCard({ project, onClick, onEdit }: ProjectCardProps) {
  const { deleteProject } = useProject();
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Naozaj chcete zmazať projekt ${project.name}?`)) {
      deleteProject(project.id);
    }
    setShowMenu(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Analýza': 'bg-blue-100 text-blue-700',
      'Vývoj': 'bg-indigo-100 text-indigo-700',
      'Done': 'bg-green-100 text-green-700',
      'Pozastavené': 'bg-red-100 text-red-700',
      'Discovery': 'bg-purple-100 text-purple-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'Kritická': 'bg-red-50 text-red-600 border-red-100',
      'Vysoká': 'bg-orange-50 text-orange-600 border-orange-100',
      'Stredná': 'bg-blue-50 text-blue-600 border-blue-100',
      'Nízka': 'bg-slate-50 text-slate-600 border-slate-100'
    };
    return colors[priority] || 'bg-slate-50 text-slate-600 border-slate-100';
  };

  const isOverdue = project.mainDeadline && new Date(project.mainDeadline) < new Date();

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(project.priority)}`}>
                {project.priority}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{project.name}</h3>
            <p className="text-xs text-slate-500 font-medium">{project.type}</p>
          </div>
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} 
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1">
                <button onClick={(e) => { onEdit(e); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <Edit className="w-4 h-4" /> Upraviť
                </button>
                <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Zmazať
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">
          {project.shortDescription}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Progres
            </span>
            <span className="font-bold text-slate-700">{project.metrics.progress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500" 
              style={{ width: `${project.metrics.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-slate-400 font-bold mb-0.5 flex items-center gap-1">
              <Calendar className={`w-3 h-3 ${isOverdue ? 'text-red-500' : ''}`} /> Deadline
            </span>
            <span className={`text-xs font-bold ${isOverdue ? 'text-red-600' : 'text-slate-700'}`}>
              {project.mainDeadline || 'N/A'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-slate-400 font-bold mb-0.5 flex items-center gap-1">
              <Users className="w-3 h-3" /> BA
            </span>
            <span className={`text-xs font-bold ${!project.team.businessAnalyst ? 'text-orange-500 italic' : 'text-slate-700'}`}>
              {project.team.businessAnalyst || 'Chýba'}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-50 rounded-b-xl border-t border-slate-100 flex items-center justify-between">
        <div className="flex gap-3">
          <div className="flex items-center gap-1" title="Otvorené otázky">
            <AlertCircle className={`w-3.5 h-3.5 ${project.metrics.openQuestions > 0 ? 'text-amber-500' : 'text-slate-300'}`} />
            <span className="text-[10px] font-bold text-slate-500">{project.metrics.openQuestions}</span>
          </div>
          <div className="flex items-center gap-1" title="Riziká">
            <AlertCircle className={`w-3.5 h-3.5 ${project.metrics.highRisks > 0 ? 'text-red-500' : 'text-slate-300'}`} />
            <span className="text-[10px] font-bold text-slate-500">{project.metrics.highRisks}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Health</span>
          <div className={`w-2 h-2 rounded-full ${
            project.metrics.healthScore > 80 ? 'bg-green-500' : 
            project.metrics.healthScore > 50 ? 'bg-amber-500' : 'bg-red-500'
          }`}></div>
          <span className="text-xs font-bold text-slate-700">{project.metrics.healthScore}%</span>
        </div>
      </div>
    </div>
  );
}
