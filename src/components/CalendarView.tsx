import { useState } from 'react';
import { 
  Calendar as CalendarIcon, Plus, 
  Search, Filter, Clock, AlertTriangle, 
  Edit, Trash2, Link2, List, Grid,
  ChevronRight, CalendarDays, CheckCircle2,
  ArrowRight, Download
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { DeadlineFormModal } from './DeadlineFormModal';
import { StatusBadge, PriorityBadge, EmptyState } from './Badge';
import type { Deadline, DeadlineStatus } from '../types';
import { cn } from '../lib/utils';

export function CalendarView() {
  const { activeProject, deleteDeadline } = useProject();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | undefined>(undefined);
  const [view, setView] = useState<'calendar' | 'list'>('list');
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  if (!activeProject) return null;

  const deadlines = activeProject.deadlines || [];

  const filteredDeadlines = deadlines.filter(dl => {
    const matchesSearch = dl.title.toLowerCase().includes(search.toLowerCase()) || 
                          dl.owner.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? dl.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const overdueItems = deadlines.filter(dl => dl.status === 'Overdue');
  const upcomingItems = deadlines.filter(dl => {
    const diff = new Date(dl.date).getTime() - new Date().getTime();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000 && dl.status !== 'Done';
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm z-10">
        <div>
          <h1 className="text-xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-amber-500 rounded-xl md:rounded-2xl text-white shadow-xl shadow-amber-100">
               <CalendarDays className="w-5 h-5 md:w-8 md:h-8" />
            </div>
            Timeline & Deadlines
          </h1>
          <p className="text-slate-500 font-medium text-[10px] md:text-sm mt-1 md:mt-2 max-w-2xl hidden sm:block">
            Sledovanie kľúčových míľnikov a termínov pre {activeProject.name}.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => { setEditingDeadline(undefined); setIsFormOpen(true); }}
            className="flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 bg-amber-500 text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-sm uppercase tracking-widest shadow-xl shadow-amber-100 hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 md:w-5 h-4 md:h-5" /> Pridať Termín
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
           {[
             { label: 'Overdue', val: overdueItems.length, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
             { label: 'Next 7 Days', val: upcomingItems.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
             { label: 'Planned', val: deadlines.filter(d => d.status === 'Planned').length, icon: CalendarIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
             { label: 'Done', val: deadlines.filter(d => d.status === 'Done').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' }
           ].map((s, i) => (
             <div key={i} className={cn("p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-3 md:gap-6 bg-white")}>
                <div className={cn("p-2 md:p-4 rounded-xl md:rounded-2xl shrink-0", s.bg, s.color)}>
                   <s.icon className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                <div className="min-w-0">
                   <p className="text-xl md:text-3xl font-black text-slate-900 leading-none mb-1">{s.val}</p>
                   <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{s.label}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-3 md:p-4 rounded-2xl md:rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 w-full">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Hľadať termín..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-hide pb-1 sm:pb-0">
               {(['All', 'Planned', 'In progress', 'Waiting', 'Overdue', 'Done'] as const).map(status => (
                 <button
                   key={status}
                   onClick={() => setStatusFilter(status === 'All' ? '' : status)}
                   className={cn(
                     "px-3 md:px-4 py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap",
                     (statusFilter || 'All') === status ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                   )}
                 >
                   {status}
                 </button>
               ))}
            </div>
          </div>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl md:rounded-2xl border border-slate-200 self-end lg:self-auto">
             <button 
              onClick={() => setView('calendar')}
              className={cn("p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all", view === 'calendar' ? "bg-white text-amber-600 shadow-sm" : "text-slate-400")}
             >
               <Grid className="w-4 h-4 md:w-5 md:h-5" />
             </button>
             <button 
              onClick={() => setView('list')}
              className={cn("p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all", view === 'list' ? "bg-white text-amber-600 shadow-sm" : "text-slate-400")}
             >
               <List className="w-4 h-4 md:w-5 md:h-5" />
             </button>
          </div>
        </div>

        {/* Main Content */}
        {filteredDeadlines.length > 0 ? (
          view === 'list' ? (
            <div className="bg-white rounded-2xl md:rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
               <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Deadline</th>
                      <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Target Date</th>
                      <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Status</th>
                      <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Owner</th>
                      <th className="px-6 md:px-8 py-4 md:py-5 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredDeadlines.map(dl => (
                      <tr key={dl.id} className="hover:bg-amber-50/30 transition-all group">
                        <td className="px-6 md:px-8 py-5 md:py-6">
                          <div className="min-w-[200px]">
                             <div className="flex items-center gap-2 mb-1">
                                <span className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">{dl.type}</span>
                                <PriorityBadge priority={dl.priority} />
                             </div>
                             <h4 className="text-sm md:text-base font-black text-slate-900 leading-tight group-hover:text-amber-600 transition-colors truncate">{dl.title}</h4>
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                           <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-black text-slate-700 whitespace-nowrap">
                              <Clock className={cn("w-3.5 h-3.5 md:w-4 md:h-4", dl.status === 'Overdue' ? "text-rose-500" : "text-amber-500")} />
                              <span>{dl.date}</span>
                              {dl.time && <span className="text-slate-300 font-medium">@{dl.time}</span>}
                           </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                           <StatusBadge status={dl.status} />
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                           <div className="space-y-1 max-w-[150px]">
                              <div className="flex items-center gap-2 text-[10px] md:text-xs font-black text-slate-600 truncate">
                                 {dl.owner}
                              </div>
                              {dl.relatedItemId && (
                                <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-black text-indigo-400 uppercase tracking-tighter truncate">
                                   <Link2 className="w-3 h-3" /> {dl.relatedItemId}
                                </div>
                              )}
                           </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6 text-right">
                           <div className="flex items-center justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                 onClick={() => { setEditingDeadline(dl); setIsFormOpen(true); }}
                                 className="p-2 md:p-3 bg-white hover:bg-amber-50 rounded-xl border border-slate-200 text-slate-400 hover:text-amber-600 transition-all shadow-sm"
                              >
                                 <Edit className="w-4 md:w-5 h-4 md:h-5" />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl md:rounded-[3rem] border border-slate-200 shadow-xl p-8 md:p-12 min-h-[400px] md:h-[600px] flex flex-col items-center justify-center text-center">
               <div className="p-6 md:p-8 bg-amber-50 rounded-full mb-6 border border-dashed border-amber-200">
                  <CalendarIcon className="w-12 h-12 md:w-16 md:h-16 text-amber-200" />
               </div>
               <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Vizuálny Kalendár</h3>
               <p className="text-sm md:text-base text-slate-400 font-medium max-w-md mt-2 italic leading-relaxed">
                  Pohľad v príprave. Použite zoznam pre správu termínov.
               </p>
               <button onClick={() => setView('list')} className="mt-6 md:mt-8 px-6 md:px-8 py-3 bg-slate-900 text-white rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-xl transition-all">
                  Prepnúť na Zoznam
               </button>
            </div>
          )
        ) : (
          <EmptyState 
            icon={CalendarDays}
            title="Žiadne termíny"
            description="Timeline projektu je aktuálne bez definovaných deadlinov."
            actionLabel="Pridať prvý deadline"
            onAction={() => setIsFormOpen(true)}
          />
        )}

        {/* Strategy Card */}
        <div className="p-6 md:p-10 bg-slate-900 rounded-3xl md:rounded-[3.5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 overflow-hidden relative shadow-2xl border-4 border-white/10">
           <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block">
              <Clock className="w-64 h-64" />
           </div>
           <div className="relative z-10 space-y-4 md:space-y-6 max-w-2xl text-center lg:text-left">
              <div className="flex items-center gap-3 md:gap-4 justify-center lg:justify-start">
                 <div className="p-2 md:p-3 bg-amber-500 rounded-xl md:rounded-2xl shadow-xl border border-amber-400/50">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                 </div>
                 <h2 className="text-xl md:text-3xl font-black tracking-tight leading-none">Strategic Deadline Management</h2>
              </div>
              <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed italic">
                "Jasne definované termíny zabraňujú scope creepu a udržujú stakeholderov v očakávanom rámci doručenia."
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                 <button className="px-4 md:px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                    Sync with Jira
                 </button>
                 <button className="px-4 md:px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                    Export PDF
                 </button>
              </div>
           </div>
           <div className="relative z-10 flex flex-col gap-3 w-full sm:w-auto min-w-[200px]">
              <div className="p-6 bg-amber-500 rounded-2xl md:rounded-[2rem] shadow-2xl text-center">
                 <p className="text-[8px] md:text-[10px] font-black text-amber-900 uppercase tracking-widest mb-1 md:mb-2">Next Milestone</p>
                 <p className="text-xl md:text-2xl font-black text-white leading-none mb-1">Release 2.1</p>
                 <p className="text-xs font-bold text-amber-100">Za 4 dni</p>
              </div>
           </div>
        </div>
      </div>

      <DeadlineFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={editingDeadline} 
      />
    </div>
  );
}
