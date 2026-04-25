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
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
               <Gavel className="w-8 h-8" />
            </div>
            Decision Log
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl text-lg">
            Centrálna evidencia kľúčových architektonických a biznisových rozhodnutí pre {activeProject.name}.
          </p>
        </div>
        <button 
          onClick={() => { setEditingDecision(undefined); setIsFormOpen(true); }}
          className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Nové Rozhodnutie
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Hľadať rozhodnutie (ID, názov)..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-slate-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
           {(['All', 'Draft', 'Navrhnuté', 'Potvrdené', 'Zrušené'] as const).map(status => (
             <button
               key={status}
               onClick={() => setStatusFilter(status)}
               className={cn(
                 "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all",
                 statusFilter === status ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
               )}
             >
               {status}
             </button>
           ))}
        </div>
      </div>

      {/* Grid */}
      {filteredDecisions.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
           {filteredDecisions.map(d => (
             <div 
               key={d.id} 
               className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex flex-col lg:flex-row gap-8 card-hover group relative overflow-hidden"
             >
               <div className="absolute left-0 top-0 bottom-0 w-2 bg-slate-900 opacity-20"></div>
               
               <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <Gavel className="w-6 h-6 text-slate-900" />
                     </div>
                     <div>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.id}</span>
                           <StatusBadge status={d.status} />
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{d.date}</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{d.title}</h3>
                     </div>
                  </div>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed italic p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    {d.context}
                  </p>
               </div>

               <div className="flex flex-col md:flex-row items-center gap-8 lg:border-l border-slate-100 lg:pl-8 min-w-[300px]">
                  <div className="flex-1 space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Decision Owner</span>
                           <span className="text-xs font-black text-slate-900">{d.owner}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Impact</span>
                           <span className="text-xs font-black text-indigo-600 uppercase tracking-tighter">{d.impact}</span>
                        </div>
                     </div>
                     <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <h4 className="text-[9px] font-black text-emerald-600 uppercase mb-2">Approved By</h4>
                        <p className="text-xs font-bold text-emerald-800 line-clamp-2">{d.approvedBy}</p>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                     <button onClick={() => { setEditingDecision(d); setIsFormOpen(true); }} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 shadow-sm">
                        <Edit className="w-5 h-5" />
                     </button>
                     <button onClick={() => deleteDecision(activeProject.id, d.id)} className="p-3 bg-slate-50 hover:bg-rose-50 rounded-2xl text-slate-400 hover:text-rose-600 transition-all border border-slate-100 shadow-sm">
                        <Trash2 className="w-5 h-5" />
                     </button>
                  </div>
               </div>

               {/* Traceability Footer */}
               <div className="absolute bottom-4 right-8 flex items-center gap-4">
                  {d.relatedRequirementId && (
                    <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase">
                      <LinkIcon className="w-3 h-3" /> REQ: {d.relatedRequirementId}
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
          description="V tomto projekte zatiaľ nie sú evidované žiadne rozhodnutia. Zdokumentujte kľúčové voľby pre zachovanie kontextu."
          actionLabel="Vytvoriť Rozhodnutie"
          onAction={() => setIsFormOpen(true)}
        />
      )}

      {/* Modals */}
      <DecisionFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={editingDecision} 
      />
    </div>
  );
}
