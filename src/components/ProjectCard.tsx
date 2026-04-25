import { MoreVertical, Calendar, Users, TrendingUp, AlertCircle, Edit, Trash2, ArrowRight, Archive, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { Project } from '../types';
import { useProject } from '../context/ProjectContext';
import { StatusBadge, PriorityBadge } from './Badge';
import { cn } from '../lib/utils';
import { calculateProjectHealth } from '../lib/projectUtils';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
}

export function ProjectCard({ project, onClick, onEdit }: ProjectCardProps) {
  const { deleteProject, closeProject, reopenProject } = useProject();
  const [showMenu, setShowMenu] = useState(false);

  const isClosed = project.isClosed || project.status === 'Ukončené';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Naozaj chcete zmazať projekt ${project.name}?`)) {
      deleteProject(project.id);
    }
    setShowMenu(false);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Naozaj chcete ukončiť projekt ${project.name}?`)) {
      closeProject(project.id, 'Manuálne ukončené z portfólia', '');
    }
    setShowMenu(false);
  };

  const handleReopen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Naozaj chcete znovu otvoriť projekt ${project.name}?`)) {
      reopenProject(project.id);
    }
    setShowMenu(false);
  };

  const isOverdue = project.mainDeadline && new Date(project.mainDeadline) < new Date() && !isClosed;
  const hasIssue = (!project.team.businessAnalyst || !project.mainDeadline) && !isClosed;
  const healthScore = calculateProjectHealth(project).score;

  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white rounded-[2.5rem] border border-slate-200 shadow-sm card-hover overflow-hidden flex flex-col relative transition-all duration-500",
        isOverdue && !isClosed && "border-rose-300 ring-4 ring-rose-500/5",
        isClosed && "grayscale-[0.5] opacity-80"
      )}
    >
      {/* Top Banner (Optional for priority) */}
      <div className={cn(
        "h-2 w-full",
        isClosed ? "bg-slate-400" :
        project.priority === 'Kritická' ? "bg-rose-500" : 
        project.priority === 'Vysoká' ? "bg-orange-500" : "bg-slate-100"
      )}></div>

      <div className="p-8 flex-1 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <StatusBadge status={isOverdue ? 'Overdue' : project.status} />
              <PriorityBadge priority={project.priority} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
              {project.name}
            </h3>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{project.type}</span>
               <span className="text-slate-200 text-xs">|</span>
               <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{project.release || 'v1.0.0'}</span>
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} 
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-all"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 py-2 animate-in zoom-in-95 duration-200">
                <button onClick={(e) => { onEdit(e); setShowMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                  <Edit className="w-4 h-4 text-indigo-500" /> Upraviť Projekt
                </button>
                {isClosed ? (
                  <button onClick={handleReopen} className="w-full text-left px-4 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-3">
                    <RotateCcw className="w-4 h-4" /> Znovu otvoriť
                  </button>
                ) : (
                  <button onClick={handleClose} className="w-full text-left px-4 py-2.5 text-sm font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-3">
                    <Archive className="w-4 h-4" /> Ukončiť projekt
                  </button>
                )}
                <button onClick={handleDelete} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-rose-50 flex items-center gap-3">
                  <Trash2 className="w-4 h-4" /> Vymazať projekt
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-500 font-medium line-clamp-2 h-10 leading-relaxed italic">
          {project.shortDescription}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" /> Celkový Progres
            </span>
            <span className="text-sm font-black text-slate-900">{project.metrics.progress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner p-0.5">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-blue-600 h-full rounded-full transition-all duration-1000 shadow-sm" 
              style={{ width: `${project.metrics.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Calendar className={cn("w-3.5 h-3.5", isOverdue ? "text-rose-500 animate-pulse" : "")} /> Deadline
            </span>
            <span className={cn("text-xs font-black", isOverdue ? "text-rose-600" : "text-slate-900")}>
              {project.mainDeadline || 'NENASTAVENÝ'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> BA Lead
            </span>
            <span className={cn("text-xs font-black", !project.team.businessAnalyst ? "text-rose-600" : "text-slate-900")}>
              {project.team.businessAnalyst || 'CHÝBA OWNER'}
            </span>
          </div>
        </div>
      </div>

      <div className="px-8 py-5 bg-slate-50 rounded-b-[2.5rem] border-t border-slate-100 flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5" title="Otvorené otázky">
            <AlertCircle className={cn("w-4 h-4", (project.metrics.openQuestions > 0 && !isClosed) ? "text-amber-500" : "text-slate-300")} />
            <span className="text-xs font-black text-slate-600">{project.metrics.openQuestions}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Kritické riziká">
            <AlertCircle className={cn("w-4 h-4", (project.metrics.highRisks > 0 && !isClosed) ? "text-rose-500" : "text-slate-300")} />
            <span className="text-xs font-black text-slate-600">{project.metrics.highRisks}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Health</span>
             <span className={cn(
               "text-xs font-black",
               healthScore > 80 ? "text-emerald-600" : 
               healthScore > 50 ? "text-amber-600" : "text-rose-600"
             )}>{healthScore}%</span>
          </div>
          <div className={cn(
            "w-3 h-3 rounded-full shadow-sm",
            healthScore > 80 ? "bg-emerald-500" : 
            healthScore > 50 ? "bg-amber-500" : "bg-rose-500 animate-pulse"
          )}></div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      {hasIssue && (
        <div className="absolute top-4 left-4 flex items-center gap-2">
           <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
        </div>
      )}
    </div>
  );
}
