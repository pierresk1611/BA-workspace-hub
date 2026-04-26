import { 
  ArrowLeft, Edit, CheckCircle, TrendingUp, Shield, AlertTriangle, 
  Calendar, HelpCircle, Gavel, Network, Trash2, Archive, RotateCcw,
  User, Clock, Info, MoreHorizontal
} from 'lucide-react';
import { useState } from 'react';
import type { Project } from '../types';
import { useProject } from '../context/ProjectContext';
import { CloseProjectModal } from './CloseProjectModal';
import { DeleteProjectModal } from './DeleteProjectModal';
import { HandoverModal } from './HandoverModal';
import { cn } from '../lib/utils';
import { ArrowRightLeft } from 'lucide-react';
import { calculateProjectHealth } from '../lib/projectUtils';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onEdit: () => void;
}

export function ProjectDetail({ project, onBack, onEdit }: ProjectDetailProps) {
  const { closeProject, reopenProject, deleteProject } = useProject();
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const healthResult = calculateProjectHealth(project);

  const isClosed = project.isClosed || project.status === 'Ukončené';

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
      'Kritická': 'bg-red-100 text-red-700',
      'Vysoká': 'bg-orange-100 text-orange-700',
      'Stredná': 'bg-blue-100 text-blue-700',
      'Nízka': 'bg-slate-100 text-slate-700'
    };
    return colors[priority] || 'bg-slate-100 text-slate-700';
  };

  const quickActions = [
    { label: 'Pridat požiadavku', icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
    { label: 'Pridat rozhodnutie', icon: Gavel, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Pridat otázku', icon: HelpCircle, color: 'text-amber-600 bg-amber-50' },
    { label: 'Pridat riziko', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50' },
    { label: 'Pridat systém', icon: Network, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Pridat deadline', icon: Calendar, color: 'text-slate-600 bg-slate-50' },
  ];

  const handleCloseProject = (reason: string, note: string) => {
    closeProject(project.id, reason, note);
  };

  const handleReopenProject = () => {
    if (confirm('Naozaj chcete znovu otvoriť tento projekt?')) {
      reopenProject(project.id);
    }
  };

  const handleDeleteProject = () => {
    deleteProject(project.id);
    onBack(); // Redirect back to projects list
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${getPriorityColor(project.priority)}`}>
                {project.priority}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{project.type} • ID: {project.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isClosed ? (
            <button 
              onClick={handleReopenProject}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Znovu otvoriť projekt
            </button>
          ) : (
            <button 
              onClick={() => alert('Spúšťam BA Quality Check...')} 
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              BA Quality Check
            </button>
          )}
          
          <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition-colors">
            <Edit className="w-4 h-4" />
            Upraviť projekt
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {showActionMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowActionMenu(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-30 animate-in slide-in-from-top-2 duration-200">
                  {!isClosed && (
                    <button 
                      onClick={() => { setIsCloseModalOpen(true); setShowActionMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-amber-600 hover:bg-amber-50 transition-colors"
                    >
                      <Archive className="w-4 h-4" /> Ukončiť projekt
                    </button>
                  )}
                  {!isClosed && (
                    <button 
                      onClick={() => { setIsHandoverModalOpen(true); setShowActionMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <ArrowRightLeft className="w-4 h-4" /> Odovzdať projekt
                    </button>
                  )}
                  <button 
                    onClick={() => { setIsDeleteModalOpen(true); setShowActionMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Vymazať projekt
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* content scroll area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Closed Banner */}
          {isClosed && (
            <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden border-4 border-white/10 mb-6">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Archive className="w-40 h-40" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500 rounded-2xl shadow-xl">
                    <Archive className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight leading-none uppercase">Projekt je ukončený</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-amber-400" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Ukončil</span>
                        <span className="text-sm font-black text-white">{project.closedBy || 'peter'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Dátum ukončenia</span>
                        <span className="text-sm font-black text-white">{project.closedAt ? new Date(project.closedAt).toLocaleString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-4 h-4 text-amber-400 mt-1" />
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Dôvod ukončenia</span>
                        <p className="text-sm font-bold text-slate-200 mt-1 italic leading-relaxed">"{project.closureReason || 'Nezadaný'}"</p>
                      </div>
                    </div>
                    {project.closureNote && (
                      <div className="pl-7">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Poznámka</span>
                        <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{project.closureNote}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Celkový progres
                </span>
                <span className="text-blue-600 font-bold">{project.metrics.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${project.metrics.progress}%` }}></div>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cieľ: {project.release}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Health Score
                </span>
                <span className={`${healthResult.score > 80 ? 'text-green-600' : healthResult.score > 50 ? 'text-amber-600' : 'text-rose-600'} font-bold`}>
                  {healthResult.score}%
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 mb-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`flex-1 h-1.5 rounded-full ${i*20 <= healthResult.score ? (healthResult.score > 80 ? 'bg-green-500' : healthResult.score > 50 ? 'bg-amber-500' : 'bg-rose-500') : 'bg-slate-100'}`}></div>
                ))}
              </div>

              <div className="flex-1 mt-2 space-y-2">
                {healthResult.deductions.slice(0, 2).map((d, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 truncate mr-2" title={d.label}>{d.count}x {d.label}</span>
                    <span className="font-bold text-rose-600 shrink-0">{d.points}</span>
                  </div>
                ))}
                {healthResult.deductions.length > 2 && (
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    + {healthResult.deductions.length - 2} ďalšie
                  </div>
                )}
                {healthResult.deductions.length === 0 && (
                  <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Všetko v poriadku
                  </div>
                )}
              </div>
              
              <p className="text-[10px] text-slate-500 font-medium leading-tight mt-3 pt-3 border-t border-slate-100">
                {healthResult.summaryText}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Hlavný deadline
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900">{project.mainDeadline || 'N/A'}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                Zostáva: 12 dní
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" /> Overdue položky
                </span>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">{project.metrics.overdueItems}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vyžaduje okamžitú pozornosť</p>
            </div>
          </div>

          {/* Middle Section: Descriptions and Team */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Popis projektu</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Krátky popis</h4>
                    <p className="text-slate-700">{project.shortDescription}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Detailný popis</h4>
                    <p className="text-slate-700 leading-relaxed">{project.detailedDescription}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Rýchle akcie</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {quickActions.map((action, idx) => (
                    <button 
                      key={idx} 
                      disabled={isClosed}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-all text-left group/btn",
                        isClosed 
                          ? "bg-slate-50 border-slate-100 cursor-not-allowed opacity-60" 
                          : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn("p-2 rounded-lg transition-transform", !isClosed && "group-hover/btn:scale-110", action.color)}>
                        <action.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 leading-tight">{action.label}</span>
                    </button>
                  ))}
                </div>
                {isClosed && (
                  <p className="mt-4 text-[10px] font-black text-amber-600 uppercase tracking-widest text-center py-2 bg-amber-50 rounded-xl border border-amber-100">
                    Akcie sú v ukončenom projekte zakázané
                  </p>
                )}
              </div>
            </div>

            {/* Right: Team & Metadata */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Projektový tím</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500">Business Analyst</span>
                    <span className={`text-sm font-bold ${!project.team.businessAnalyst ? 'text-red-500 italic' : 'text-slate-700'}`}>
                      {project.team.businessAnalyst || 'Chýba'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500">Product Owner</span>
                    <span className="text-sm font-bold text-slate-700">{project.team.productOwner || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500">Tech Lead</span>
                    <span className="text-sm font-bold text-slate-700">{project.team.techLead || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500">QA Owner</span>
                    <span className="text-sm font-bold text-slate-700">{project.team.qaOwner || '-'}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Stakeholderi</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.team.stakeholders?.split(',').map(s => (
                      <span key={s} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Metadata</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Dátum začiatku</span>
                    <span className="font-bold text-slate-700">{project.startDate || '-'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Cieľový release</span>
                    <span className="font-bold text-slate-700">{project.release || '-'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Typ projektu</span>
                    <span className="font-bold text-slate-700">{project.type}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Posledná úprava</span>
                    <span className="font-bold text-slate-700">{new Date(project.lastModified).toLocaleDateString() || '-'}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Projektové tagy</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags?.split(',').map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase border border-blue-100">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <CloseProjectModal 
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        onConfirm={handleCloseProject}
        projectName={project.name}
      />

      <DeleteProjectModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProject}
        projectName={project.name}
      />

      <HandoverModal 
        isOpen={isHandoverModalOpen}
        onClose={() => setIsHandoverModalOpen(false)}
        project={project}
      />
    </div>
  );
}
