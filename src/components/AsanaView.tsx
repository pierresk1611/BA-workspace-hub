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
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm z-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-rose-500 rounded-2xl text-white shadow-xl shadow-rose-100">
               <Kanban className="w-8 h-8" />
            </div>
            Asana Operational Tasks
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">
            Sledovanie operatívnych úloh a progressu z prepojených Asana projektov pre {activeProject.name}.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2 shadow-sm"
          >
            <Upload className="w-5 h-5" /> Import
          </button>
          <button 
            onClick={() => { setEditingTask(undefined); setIsModalOpen(true); }}
            className="px-8 py-4 bg-rose-500 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-rose-100 hover:bg-rose-600 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Nový Task
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          
          {/* Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="p-6 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={176} strokeDashoffset={176 - (176 * overallProgress) / 100} className="text-rose-500 transition-all duration-1000" />
                  </svg>
                  <span className="absolute text-xs font-black text-slate-900">{overallProgress}%</span>
                </div>
                <div>
                   <p className="text-2xl font-black text-slate-900 leading-none mb-1">Overall</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Progress</p>
                </div>
             </div>

             {[
               { label: 'Blocked Tasks', val: tasks.filter(t => t.status === 'Blocked').length, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
               { label: 'In Progress', val: tasks.filter(t => t.status === 'In progress').length, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
               { label: 'Completed', val: tasks.filter(t => t.status === 'Done').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' }
             ].map((s, i) => (
               <div key={i} className={cn("p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 bg-white")}>
                  <div className={cn("p-4 rounded-2xl", s.bg, s.color)}>
                     <s.icon className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-3xl font-black text-slate-900 leading-none mb-1">{s.val}</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                  </div>
               </div>
             ))}
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
             <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Hľadať task, vlastníka..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all shadow-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {(['All', 'In progress', 'Blocked', 'Done', 'Not started'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status === 'All' ? 'all' : status)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap",
                        (statusFilter === 'all' ? 'All' : statusFilter) === status ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
             </div>

             <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-12"></th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Task Details</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Owner</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status & Progress</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Import Info</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deadline</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
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
                           <div>
                              <h4 className="text-sm font-black text-slate-900 leading-tight mb-1 group-hover:text-rose-600 transition-colors">{t.title}</h4>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.milestone}</p>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-black text-slate-600">
                                 {t.owner.charAt(0)}
                              </div>
                              <span className="text-xs font-bold text-slate-700">{t.owner}</span>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex flex-col gap-2">
                              <StatusBadge status={t.status as any} />
                              <div className="flex items-center gap-3">
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-20">
                                  <div className="h-full bg-rose-500 rounded-full transition-all duration-1000" style={{ width: `${t.progress}%` }} />
                                </div>
                                <span className="text-[9px] font-black text-slate-400">{t.progress}%</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex flex-col gap-1">
                              {t.sourceImportType ? (
                                <>
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                    <Database className="w-3 h-3" /> {t.sourceImportType}
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                    {t.importedAt ? new Date(t.importedAt).toLocaleDateString() : '-'}
                                  </span>
                                  {t.warnings && t.warnings.length > 0 && (
                                    <span className="flex items-center gap-1 text-[8px] font-black text-amber-600 uppercase bg-amber-50 px-1 rounded border border-amber-100">
                                      <AlertTriangle className="w-2.5 h-2.5" /> {t.warnings.length} issues
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-[10px] font-black text-slate-300 uppercase italic">Manual Entry</span>
                              )}
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                              <Clock className="w-4 h-4 text-rose-400" />
                              {t.dueDate}
                           </div>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <ChevronRight className={cn("w-6 h-6 transition-all", activeTaskId === t.id ? "text-rose-600 translate-x-1" : "text-slate-300")} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-12">
             <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-10 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-rose-500" /> Milestone Distribution
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={milestoneData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} domain={[0, 100]} />
                      <Tooltip 
                        cursor={{ fill: '#fff1f2' }} 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }} 
                      />
                      <Bar dataKey="progress" fill="#f43f5e" radius={[12, 12, 0, 0]} barSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                <Kanban className="absolute -right-12 -bottom-12 w-64 h-64 text-rose-500 opacity-5 group-hover:scale-110 transition-transform duration-1000" />
                <h3 className="text-lg font-black text-white uppercase tracking-widest mb-10 flex items-center gap-3 relative z-10">
                  <Zap className="w-6 h-6 text-rose-400" /> Status Analytics
                </h3>
                <div className="flex items-center gap-12 relative z-10">
                   <div className="h-64 flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReChartsPieChart>
                          <Pie 
                            data={statusData} 
                            innerRadius={60} 
                            outerRadius={90} 
                            paddingAngle={8} 
                            dataKey="value"
                            stroke="none"
                          >
                            {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '20px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }}
                          />
                        </ReChartsPieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="flex-1 space-y-4">
                      {statusData.map(s => (
                        <div key={s.name} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-3">
                             <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></div>
                             <span className="text-xs font-black uppercase tracking-widest text-slate-400">{s.name}</span>
                          </div>
                          <span className="text-lg font-black">{s.value}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>

        </div>

        {/* Detail Sidebar */}
        <div className="w-full lg:w-[500px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-20 overflow-hidden glass">
          {activeTask ? (
            <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
               <div className="p-10 border-b border-slate-100 bg-slate-50/50 relative">
                   <div className="absolute top-10 right-10 flex gap-2">
                      <button 
                        onClick={() => { setEditingTask(activeTask); setIsModalOpen(true); }}
                        className="p-3 bg-white hover:bg-rose-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-rose-600 transition-all shadow-sm"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => { if (confirm('Zmazať task?')) deleteAsanaTask(activeProject.id, activeTask.id); }}
                        className="p-3 bg-white hover:bg-rose-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-rose-600 transition-all shadow-sm"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                   </div>
                   <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-4 py-1.5 rounded-full uppercase border border-rose-200 tracking-widest">{activeTask.id}</span>
                   </div>
                   <h2 className="text-3xl font-black text-slate-900 leading-tight mb-6 pr-20">{activeTask.title}</h2>
                   <div className="flex flex-wrap gap-3">
                     <StatusBadge status={activeTask.status as any} />
                     <PriorityBadge priority={activeTask.priority as any} />
                   </div>
               </div>

               <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       <FileText className="w-3 h-3" /> Task Description
                    </h4>
                    <p className="text-base text-slate-600 leading-relaxed font-medium italic p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                      "{activeTask.description || 'Žiadny popis nie je k dispozícii.'}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="p-6 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                         <Zap className="w-16 h-16 text-rose-600" />
                       </div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">AI Insight & Risk Assessment</p>
                       <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                          Úloha je v stave **{activeTask.status}** s progresom **{activeTask.progress}%**. {activeTask.status === 'Blocked' ? 'Detekované kritické blokátory v Asane vyžadujú okamžitú eskaláciu na Tech Leada.' : 'Aktuálny progress indikuje bezproblémové doručenie k deadlinu.'}
                       </p>
                    </div>
                  </div>

                  <div className="space-y-6 pt-4 border-t border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Traceability Map</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-rose-50 transition-all">
                        <div className="flex items-center gap-4">
                           <Kanban className="w-5 h-5 text-rose-500" />
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black text-slate-400 uppercase">Related Requirement</span>
                              <span className="text-sm font-black text-slate-900">{activeTask.relatedRequirementId || 'None Linked'}</span>
                           </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-blue-50 transition-all">
                        <div className="flex items-center gap-4">
                           <Zap className="w-5 h-5 text-blue-500" />
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black text-slate-400 uppercase">Linked Jira Item</span>
                              <span className="text-sm font-black text-slate-900">{activeTask.relatedJiraKey || 'No Jira Mapping'}</span>
                           </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
               </div>

               <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                  <a 
                    href={activeTask.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 group"
                  >
                    <ExternalLink className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Open in Asana
                  </a>
                  <button onClick={() => alert('Follow-up funkcia drafte správy v schránke.')} className="p-5 bg-white hover:bg-rose-50 text-rose-600 rounded-[1.5rem] border border-slate-200 shadow-sm transition-all active:scale-95">
                    <Send className="w-6 h-6" />
                  </button>
               </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-16 space-y-8 animate-in fade-in duration-500">
              <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-slate-100 group">
                <Kanban className="w-16 h-16 text-slate-100 group-hover:text-rose-200 transition-colors duration-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Task Operational View</h3>
                <p className="text-base text-slate-400 font-medium max-w-xs leading-relaxed italic">
                  Vyberte operatívny task z Asany pre zobrazenie progresu, AI analýzy a prepojení na biznis analýzu.
                </p>
              </div>
            </div>
          )}
        </div>

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
