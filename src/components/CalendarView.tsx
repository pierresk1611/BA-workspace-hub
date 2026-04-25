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
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-xl shadow-amber-100">
               <CalendarDays className="w-8 h-8" />
            </div>
            Timeline & Deadlines
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl text-lg">
            Sledovanie kľúčových míľnikov, termínov požiadaviek a biznisových deadlinov pre {activeProject.name}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setEditingDeadline(undefined); setIsFormOpen(true); }}
            className="px-8 py-4 bg-amber-500 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-100 hover:bg-amber-600 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Pridať Termín
          </button>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Overdue items', val: overdueItems.length, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
           { label: 'Next 7 Days', val: upcomingItems.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: 'Planned Tasks', val: deadlines.filter(d => d.status === 'Planned').length, icon: CalendarIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: 'Successfully Done', val: deadlines.filter(d => d.status === 'Done').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' }
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

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 flex-1 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Hľadať termín, požiadavku, ownera..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
             {(['All', 'Planned', 'In progress', 'Waiting', 'Overdue', 'Done'] as const).map(status => (
               <button
                 key={status}
                 onClick={() => setStatusFilter(status === 'All' ? '' : status)}
                 className={cn(
                   "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap",
                   (statusFilter || 'All') === status ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                 )}
               >
                 {status}
               </button>
             ))}
          </div>
        </div>
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
           <button 
            onClick={() => setView('calendar')}
            className={cn("p-2.5 rounded-xl transition-all", view === 'calendar' ? "bg-white text-amber-600 shadow-sm" : "text-slate-400")}
           >
             <Grid className="w-5 h-5" />
           </button>
           <button 
            onClick={() => setView('list')}
            className={cn("p-2.5 rounded-xl transition-all", view === 'list' ? "bg-white text-amber-600 shadow-sm" : "text-slate-400")}
           >
             <List className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Main Content */}
      {filteredDeadlines.length > 0 ? (
        view === 'list' ? (
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
             <table className="w-full border-collapse">
               <thead>
                 <tr className="bg-slate-50 border-b border-slate-100">
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Deadline & Priority</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Target Date</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Status</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Owner & Context</th>
                   <th className="px-8 py-5 text-right"></th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {filteredDeadlines.map(dl => (
                   <tr key={dl.id} className="hover:bg-amber-50/30 transition-all group">
                     <td className="px-8 py-6 min-w-[300px]">
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{dl.type}</span>
                             <PriorityBadge priority={dl.priority} />
                          </div>
                          <h4 className="text-base font-black text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">{dl.title}</h4>
                       </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-3 text-sm font-black text-slate-700">
                           <Clock className={cn("w-4 h-4", dl.status === 'Overdue' ? "text-rose-500" : "text-amber-500")} />
                           <span>{dl.date}</span>
                           {dl.time && <span className="text-slate-300 font-medium">@{dl.time}</span>}
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <StatusBadge status={dl.status} />
                     </td>
                     <td className="px-8 py-6">
                        <div className="space-y-1.5">
                           <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                              <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[8px] font-black">BA</div>
                              {dl.owner}
                           </div>
                           {dl.relatedItemId && (
                             <div className="flex items-center gap-2 text-[9px] font-black text-indigo-400 uppercase tracking-tighter">
                                <Link2 className="w-3 h-3" /> {dl.relatedItemType}: {dl.relatedItemId}
                             </div>
                           )}
                        </div>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                              onClick={() => { setEditingDeadline(dl); setIsFormOpen(true); }}
                              className="p-3 bg-white hover:bg-amber-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-amber-600 transition-all shadow-sm"
                           >
                              <Edit className="w-5 h-5" />
                           </button>
                           <button 
                              onClick={() => { if (confirm('Zmazať tento deadline?')) deleteDeadline(activeProject.id, dl.id); }}
                              className="p-3 bg-white hover:bg-rose-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-rose-600 transition-all shadow-sm"
                           >
                              <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl p-12 h-[600px] flex flex-col items-center justify-center text-center">
             <div className="p-8 bg-amber-50 rounded-full mb-6 border border-dashed border-amber-200 shadow-inner">
                <CalendarIcon className="w-16 h-16 text-amber-200" />
             </div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tight">Vizuálny Kalendár</h3>
             <p className="text-base text-slate-400 font-medium max-w-md mt-2 italic leading-relaxed">
                Mesačný interaktívny pohľad je aktuálne v príprave. Použite zoznamové zobrazenie (List View) pre plnú funkčnosť správy termínov.
             </p>
             <button onClick={() => setView('list')} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                Prepnúť na Zoznam
             </button>
          </div>
        )
      ) : (
        <EmptyState 
          icon={CalendarDays}
          title="Žiadne termíny"
          description="Timeline projektu je aktuálne bez definovaných deadlinov. Pridajte kľúčové míľniky pre lepšiu kontrolu progresu."
          actionLabel="Pridať prvý deadline"
          onAction={() => setIsFormOpen(true)}
        />
      )}

      {/* Strategy Card */}
      <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative shadow-2xl border-4 border-white/10">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <Clock className="w-64 h-64" />
         </div>
         <div className="relative z-10 space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-amber-500 rounded-2xl shadow-xl border border-amber-400/50">
                  <Clock className="w-6 h-6 text-white" />
               </div>
               <h2 className="text-3xl font-black tracking-tight leading-none">Strategic Deadline Management</h2>
            </div>
            <p className="text-slate-400 text-base font-medium leading-relaxed italic">
              "Čas je v biznis analýze najdrahšou komoditou. Jasne definované termíny zabraňujú scope creepu a udržujú stakeholderov v očakávanom rámci doručenia."
            </p>
            <div className="flex gap-4">
               <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                  Sync with Jira
               </button>
               <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                  Export PDF Timeline
               </button>
            </div>
         </div>
         <div className="relative z-10 flex flex-col gap-3 min-w-[250px]">
            <div className="p-6 bg-amber-500 rounded-[2rem] shadow-2xl text-center">
               <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-2">Next Milestone</p>
               <p className="text-2xl font-black text-white leading-none mb-1">Release 2.1</p>
               <p className="text-sm font-bold text-amber-100">Za 4 dni</p>
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
