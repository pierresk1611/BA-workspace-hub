import { useState } from 'react';
import { 
  Plus, Search, Filter, 
  Edit, Trash2, Gavel, 
  ArrowRight, Download, History,
  FileText, Link as LinkIcon
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { DecisionFormModal } from './DecisionFormModal';
import { StatusBadge, PriorityBadge, EmptyState } from './Badge';
import type { Decision, DecisionStatus } from '../types';
import { cn } from '../lib/utils';

export function DecisionsView() {
  const { activeProject, deleteDecision } = useProject();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDecision, setEditingDecision] = useState<Decision | undefined>(undefined);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DecisionStatus | 'All'>('All');

  if (!activeProject) return null;

  const decisions = activeProject.decisions || [];

  const filteredDecisions = decisions.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) || 
                          d.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm z-10">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-slate-900 rounded-xl md:rounded-2xl text-white shadow-xl shadow-slate-100">
               <Gavel className="w-5 h-5 md:w-8 md:h-8" />
            </div>
            Decision Log
          </h1>
          <p className="text-slate-500 font-medium text-[10px] md:text-sm mt-1 hidden sm:block">
            Evidencia architektonických a biznisových rozhodnutí.
          </p>
        </div>
        <button 
          onClick={() => { setEditingDecision(undefined); setIsFormOpen(true); }}
          className="flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 md:w-5 h-4 md:h-5" /> <span>Nové Rozhodnutie</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-6 md:space-y-8">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-3 md:p-4 rounded-2xl md:rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Hľadať..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-2 focus:ring-slate-500 transition-all shadow-inner"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
             {(['All', 'Draft', 'Navrhnuté', 'Potvrdené', 'Zrušené'] as const).map(status => (
               <button
                 key={status}
                 onClick={() => setStatusFilter(status)}
                 className={cn(
                   "px-3 md:px-4 py-2 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-tight transition-all border whitespace-nowrap shrink-0",
                   statusFilter === status 
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
        {filteredDecisions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:gap-6">
             {filteredDecisions.map(d => (
               <div 
                 key={d.id} 
                 className="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-200 p-6 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-8 card-hover relative overflow-hidden group"
               >
                 <div className="absolute left-0 top-0 bottom-0 w-1.5 md:w-2 bg-slate-900 opacity-20"></div>
                 
                 <div className="flex-1 space-y-4">
                    <div className="flex items-start md:items-center gap-3 md:gap-4">
                       <div className="p-2 md:p-3 bg-slate-50 rounded-lg md:rounded-2xl border border-slate-100 shrink-0">
                          <Gavel className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
                       </div>
                       <div className="min-w-0">
                          <div className="flex items-center flex-wrap gap-2 md:gap-3">
                             <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.id}</span>
                             <StatusBadge status={d.status} />
                             <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-tighter hidden sm:inline">{d.date}</span>
                          </div>
                          <h3 className="text-base md:text-2xl font-black text-slate-900 mt-1 truncate">{d.title}</h3>
                       </div>
                    </div>
                    <div className="p-4 md:p-6 bg-slate-50 rounded-xl md:rounded-[2rem] border border-slate-100">
                      <p className="text-slate-600 text-[11px] md:text-sm font-medium leading-relaxed italic line-clamp-3 md:line-clamp-none">
                        "{d.context}"
                      </p>
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 lg:border-l border-slate-100 lg:pl-8 min-w-0 lg:min-w-[300px]">
                    <div className="flex-1 w-full space-y-4 md:space-y-6">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                             <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Owner</span>
                             <span className="text-[10px] md:text-xs font-black text-slate-900 truncate">{d.owner}</span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact</span>
                             <span className="text-[10px] md:text-xs font-black text-indigo-600 uppercase tracking-tighter">{d.impact}</span>
                          </div>
                       </div>
                       <div className="p-3 md:p-4 bg-emerald-50 rounded-lg md:rounded-2xl border border-emerald-100">
                          <h4 className="text-[8px] md:text-[9px] font-black text-emerald-600 uppercase mb-1">Approved By</h4>
                          <p className="text-[10px] md:text-xs font-bold text-emerald-800 line-clamp-1">{d.approvedBy}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                       <button onClick={() => { setEditingDecision(d); setIsFormOpen(true); }} className="flex-1 sm:flex-none p-2.5 md:p-3 bg-slate-50 hover:bg-slate-100 rounded-xl md:rounded-2xl text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 shadow-sm flex justify-center items-center">
                          <Edit className="w-4 md:w-5 h-4 md:h-5" />
                       </button>
                       <button onClick={() => { if (confirm('Zmazať rozhodnutie?')) deleteDecision(activeProject.id, d.id); }} className="flex-1 sm:flex-none p-2.5 md:p-3 bg-slate-50 hover:bg-rose-50 rounded-xl md:rounded-2xl text-slate-400 hover:text-rose-600 transition-all border border-slate-100 shadow-sm flex justify-center items-center">
                          <Trash2 className="w-4 md:w-5 h-4 md:h-5" />
                       </button>
                    </div>
                 </div>

                 {/* Traceability Footer */}
                 <div className="absolute bottom-2 md:bottom-4 right-4 md:right-8 flex items-center gap-4">
                    {d.relatedRequirementId && (
                      <div className="flex items-center gap-1 text-[8px] md:text-[9px] font-black text-slate-400 uppercase">
                        <LinkIcon className="w-2.5 h-2.5 md:w-3 md:h-3" /> {d.relatedRequirementId}
                      </div>
                    )}
                 </div>
               </div>
             ))}
          </div>
        ) : (
          <EmptyState 
            icon={Gavel}
            title="Žiadne rozhodnutia"
            description="Log rozhodnutí je prázdny."
            actionLabel="Vytvoriť Rozhodnutie"
            onAction={() => setIsFormOpen(true)}
          />
        )}
      </div>

      {/* Modals */}
      <DecisionFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={editingDecision} 
      />
    </div>
  );
}
