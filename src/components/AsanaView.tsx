import { useState } from 'react';
import { 
  CheckCircle2, Search, Filter, Plus, Edit, Trash2, FileText, ArrowRight,
  Clock, ChevronRight, Download, Zap, Upload, Database,
  ExternalLink, Send, Kanban, TrendingUp, AlertTriangle
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { AsanaTaskFormModal } from './AsanaTaskFormModal';
import { AsanaImportModal } from './AsanaImportModal';
import { StatusBadge, PriorityBadge, EmptyState } from './Badge';
import { PieChart as ReChartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { AsanaTask, AsanaTaskStatus } from '../types';
import { cn } from '../lib/utils';

const statusOptions: AsanaTaskStatus[] = ["Not started", "In progress", "Blocked", "Done", "Cancelled"];

export function AsanaView() {
  const { activeProject, deleteAsanaTask } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<AsanaTask | undefined>(undefined);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  if (!activeProject) return null;

  const tasks = activeProject.asanaTasks || [];

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.owner.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: AsanaTaskStatus) => {
    switch (status) {
      case 'Done': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'In progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Blocked': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Not started': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'Cancelled': return 'bg-slate-100 text-slate-400 border-slate-200 line-through';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  // Chart Data
  const statusCounts = tasks.reduce((acc: any, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status],
    color: status === 'Done' ? '#10b981' : status === 'In progress' ? '#3b82f6' : status === 'Blocked' ? '#ef4444' : '#94a3b8'
  }));

  const milestoneProgress = tasks.reduce((acc: any, task) => {
    if (!acc[task.milestone]) {
      acc[task.milestone] = { milestone: task.milestone, total: 0, count: 0 };
    }
    acc[task.milestone].total += task.progress;
    acc[task.milestone].count += 1;
    return acc;
  }, {});

  const milestoneData = Object.values(milestoneProgress).map((m: any) => ({
    name: m.milestone.split(':')[0],
    progress: Math.round(m.total / m.count)
  }));

  const overallProgress = tasks.length > 0 
    ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length)
    : 0;

  const activeTask = tasks.find(t => t.id === activeTaskId);

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 shadow-sm z-10">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-rose-500 rounded-xl md:rounded-2xl text-white shadow-xl shadow-rose-100">
               <Kanban className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            Asana Operational Tasks
          </h1>
          <p className="text-slate-500 font-medium text-xs md:text-sm mt-1 md:mt-2 max-w-2xl hidden sm:block">
            Sledovanie operatívnych úloh a progressu z Asany.
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 md:flex-none px-4 md:px-6 py-3 md:py-4 bg-white border border-slate-200 text-slate-600 rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Upload className="w-4 md:w-5 h-4 md:h-5" /> <span className="sm:inline">Import</span>
          </button>
          <button 
            onClick={() => { setEditingTask(undefined); setIsModalOpen(true); }}
            className="flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 bg-rose-500 text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-sm uppercase tracking-widest shadow-xl shadow-rose-100 hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 md:w-5 h-4 md:h-5" /> <span className="sm:inline">Nový Task</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-6 md:space-y-8">
          
          {/* Metrics Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
             <div className="p-4 md:p-6 bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-4 md:gap-6">
                <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100 md:hidden" />
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100 hidden md:block" />
                    
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * overallProgress) / 100} className="text-rose-500 transition-all duration-1000 md:hidden" />
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={176} strokeDashoffset={176 - (176 * overallProgress) / 100} className="text-rose-500 transition-all duration-1000 hidden md:block" />
                  </svg>
                  <span className="absolute text-[9px] md:text-xs font-black text-slate-900">{overallProgress}%</span>
                </div>
                <div>
                   <p className="text-lg md:text-2xl font-black text-slate-900 leading-none mb-1">Overall</p>
                   <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</p>
                </div>
             </div>

             {[
               { label: 'Blocked', val: tasks.filter(t => t.status === 'Blocked').length, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
               { label: 'In Progress', val: tasks.filter(t => t.status === 'In progress').length, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
               { label: 'Completed', val: tasks.filter(t => t.status === 'Done').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' }
             ].map((s, i) => (
               <div key={i} className={cn("p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-4 md:gap-6 bg-white", i === 2 && "hidden sm:flex")}>
                  <div className={cn("p-2 md:p-4 rounded-xl md:rounded-2xl shrink-0", s.bg, s.color)}>
                     <s.icon className="w-5 md:w-6 h-5 md:h-6" />
                  </div>
                  <div>
                     <p className="text-lg md:text-3xl font-black text-slate-900 leading-none mb-1">{s.val}</p>
                     <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                  </div>
               </div>
             ))}
          </div>

          <div className="bg-white rounded-2xl md:rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
             <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 relative w-full">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Hľadať task..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-rose-500 transition-all shadow-sm"
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
                  {(['All', 'In progress', 'Blocked', 'Done', 'Not started'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status === 'All' ? 'all' : status)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-tight transition-all border whitespace-nowrap",
                        (statusFilter === 'all' ? 'All' : statusFilter) === status 
                          ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
             </div>

             <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-12"></th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Task Details</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Owner</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deadline</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTasks.map(t => (
                      <tr 
                        key={t.id} 
                        onClick={() => setActiveTaskId(t.id)}
                        className={cn(
                          "hover:bg-rose-50/30 transition-all cursor-pointer group",
                          activeTaskId === t.id && "bg-rose-50/50"
                        )}
                      >
                        <td className="px-6 py-6 text-center">
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-400 transition-all">
                              {t.id.split('-')[1] || t.id.substring(0, 3)}
                            </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="min-w-0 max-w-[250px]">
                              <h4 className="text-sm font-black text-slate-900 leading-tight mb-1 group-hover:text-rose-600 transition-colors truncate">{t.title}</h4>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{t.milestone}</p>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-black text-slate-600 shrink-0">
                                 {t.owner.charAt(0)}
                              </div>
                              <span className="text-xs font-bold text-slate-700 truncate">{t.owner}</span>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex flex-col gap-2">
                              <StatusBadge status={t.status as any} />
                              <div className="flex items-center gap-3">
                                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden w-16">
                                  <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${t.progress}%` }} />
                                </div>
                                <span className="text-[8px] font-black text-slate-400">{t.progress}%</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-2 text-[10px] font-black text-slate-600">
                              <Clock className="w-3.5 h-3.5 text-rose-400" />
                              {t.dueDate}
                           </div>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <ChevronRight className={cn("w-5 h-5 transition-all", activeTaskId === t.id ? "text-rose-600 translate-x-1" : "text-slate-300")} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>

          {/* Analytics Charts - Hidden on mobile */}
          {tasks.length > 0 && (
            <div className="hidden xl:grid grid-cols-1 xl:grid-cols-2 gap-8 pb-12">
               {/* Charts content... */}
            </div>
          )}

        </div>

        {/* Detail Sidebar / Modal on Mobile */}
        {activeTask && (
           <div className={cn(
             "fixed inset-0 lg:relative lg:inset-auto z-50 lg:z-20 w-full lg:w-[450px] bg-white border-l border-slate-200 flex flex-col shadow-2xl overflow-hidden transition-transform duration-300 transform",
             activeTask ? "translate-x-0" : "translate-x-full lg:translate-x-0"
           )}>
             {/* Close button for mobile */}
             <button 
               onClick={() => setActiveTaskId(null)}
               className="lg:hidden absolute top-4 left-4 p-2 bg-slate-100 rounded-full z-30"
             >
                <ChevronRight className="w-5 h-5 rotate-180" />
             </button>

             <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
                <div className="p-6 md:p-10 border-b border-slate-100 bg-slate-50/50 relative">
                    <div className="absolute top-6 md:top-10 right-6 md:right-10 flex gap-2">
                       <button 
                         onClick={() => { setEditingTask(activeTask); setIsModalOpen(true); }}
                         className="p-2.5 md:p-3 bg-white hover:bg-rose-50 rounded-xl md:rounded-2xl border border-slate-200 text-slate-400 hover:text-rose-600 transition-all shadow-sm"
                       >
                         <Edit className="w-4 md:w-5 h-4 md:h-5" />
                       </button>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                       <span className="text-[9px] md:text-[10px] font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full uppercase border border-rose-200 tracking-widest">{activeTask.id}</span>
                    </div>
                    <h2 className="text-xl md:text-3xl font-black text-slate-900 leading-tight mb-4 md:mb-6 pr-16">{activeTask.title}</h2>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      <StatusBadge status={activeTask.status as any} />
                      <PriorityBadge priority={activeTask.priority as any} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar space-y-8 md:space-y-10">
                   <div className="space-y-3 md:space-y-4">
                     <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <FileText className="w-3 h-3" /> Task Description
                     </h4>
                     <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium italic p-5 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100">
                       "{activeTask.description || 'Bez popisu.'}"
                     </p>
                   </div>

                   <div className="p-5 md:p-6 bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                       <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">AI Insight</p>
                       <p className="text-xs md:text-sm font-bold text-slate-700 leading-relaxed">
                          Úloha je v stave **{activeTask.status}** (**{activeTask.progress}%**). {activeTask.status === 'Blocked' ? 'Detekované blokátory vyžadujú pozornosť.' : 'Progres je v poriadku.'}
                       </p>
                   </div>

                   <div className="space-y-4 pt-4 border-t border-slate-100">
                     <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Traceability Map</h4>
                     <div className="grid grid-cols-1 gap-3">
                       <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Kanban className="w-4 h-4 text-rose-500" />
                            <div className="flex flex-col min-w-0">
                               <span className="text-[8px] font-black text-slate-400 uppercase">Requirement</span>
                               <span className="text-xs font-black text-slate-900 truncate">{activeTask.relatedRequirementId || 'None'}</span>
                            </div>
                         </div>
                         <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                       </div>
                     </div>
                   </div>
                </div>

                <div className="p-6 md:p-10 border-t border-slate-100 bg-white flex gap-3 md:gap-4 mt-auto">
                   <a 
                     href={activeTask.sourceUrl} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="flex-1 py-4 md:py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2"
                   >
                     <ExternalLink className="w-5 h-5 md:w-6 md:h-6" /> Asana
                   </a>
                   <button onClick={() => setActiveTaskId(null)} className="md:hidden px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest">
                     Zatvoriť
                   </button>
                </div>
             </div>
           </div>
        )}

      </div>

      <AsanaTaskFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingTask} 
      />

      <AsanaImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
      
    </div>
  );
}
