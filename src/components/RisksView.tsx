import { useState } from 'react';
import { 
  Plus, Edit, Trash2, ArrowRight, FileText,
  Shield, Clock, Search, Zap,
  ChevronRight, Calendar, User, Layers, Download
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { RiskFormModal } from './RiskFormModal';
import { DependencyFormModal } from './DependencyFormModal';
import { StatusBadge, PriorityBadge, EmptyState } from './Badge';
import type { Risk, RiskStatus, Dependency, DependencyStatus } from '../types';
import { cn } from '../lib/utils';

export function RisksView() {
  const { activeProject, deleteRisk, deleteDependency } = useProject();
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isDepModalOpen, setIsDepModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | undefined>(undefined);
  const [editingDep, setEditingDep] = useState<Dependency | undefined>(undefined);
  
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'risks' | 'dependencies' | 'matrix'>('risks');
  const [activeRiskId, setActiveRiskId] = useState<string | null>(null);

  if (!activeProject) return null;

  const risks = activeProject.risks || [];
  const dependencies = activeProject.dependencies || [];

  const filteredRisks = risks.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.id.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const matrixData = [5, 4, 3, 2, 1].map(impact => (
    [1, 2, 3, 4, 5].map(prob => {
      const cellRisks = risks.filter(r => r.impact === impact && r.probability === prob);
      return { impact, prob, cellRisks };
    })
  ));

  const activeRisk = risks.find(r => r.id === activeRiskId);

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm z-10">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-rose-600 rounded-xl md:rounded-2xl text-white shadow-xl shadow-rose-100">
              <Shield className="w-5 h-5 md:w-8 md:h-8" />
            </div>
            Risks & Deps
          </h1>
          <p className="text-slate-500 font-medium text-[10px] md:text-sm mt-1 md:mt-2 max-w-2xl hidden sm:block">
            Monitoring hrozieb, mitigácie a závislostí.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <nav className="flex bg-slate-100 p-1 rounded-xl md:rounded-2xl border border-slate-200 w-full sm:w-auto overflow-x-auto scrollbar-hide">
            {(['risks', 'dependencies', 'matrix'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 sm:flex-none px-4 md:px-6 py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === tab ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>
          <button 
            onClick={() => { 
              if (activeTab === 'dependencies') { setEditingDep(undefined); setIsDepModalOpen(true); }
              else { setEditingRisk(undefined); setIsRiskModalOpen(true); }
            }}
            className="w-full sm:w-auto px-4 md:px-8 py-3 md:py-4 bg-rose-600 text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-sm uppercase tracking-widest shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 md:w-5 h-4 md:h-5" />
            <span className="sm:inline">Pridať</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-6 md:space-y-8">
          
          {activeTab === 'risks' && (
            <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom duration-500">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { label: 'Active', val: risks.length, color: 'text-slate-900', bg: 'bg-white' },
                  { label: 'Critical', val: risks.filter(r => r.severity === 'Kritická' || r.severity === 'Vysoká').length, color: 'text-rose-600', bg: 'bg-rose-50' },
                  { label: 'Open', val: risks.filter(r => r.status === 'Open').length, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Mitigated', val: risks.filter(r => r.status === 'Resolved').length, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                ].map((s, i) => (
                  <div key={i} className={cn("p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-slate-200 shadow-sm", s.bg)}>
                    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                    <h3 className={cn("text-xl md:text-3xl font-black", s.color)}>{s.val}</h3>
                  </div>
                ))}
              </div>

              {risks.length > 0 ? (
                <div className="bg-white rounded-2xl md:rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
                  <div className="p-4 md:p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/30">
                    <div className="flex-1 relative">
                      <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Hľadať riziko..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-2 focus:ring-rose-500 transition-all shadow-sm"
                      />
                    </div>
                                    <div className="overflow-x-auto custom-scrollbar">
                    {/* Desktop Table View */}
                    <table className="hidden md:table w-full text-left border-collapse min-w-[600px] lg:min-w-0">
                      <thead>
                        <tr className="bg-slate-50/30 border-b border-slate-100">
                          <th className="px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Riziko</th>
                          <th className="px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Severity</th>
                          <th className="px-6 py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner</th>
                          <th className="px-6 py-4 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredRisks.map(r => (
                          <tr 
                            key={r.id} 
                            onClick={() => setActiveRiskId(r.id)}
                            className={cn(
                              "hover:bg-rose-50/30 transition-all cursor-pointer group",
                              activeRiskId === r.id && "bg-rose-50/50"
                            )}
                          >
                            <td className="px-6 py-5">
                              <div className="min-w-0 max-w-[200px] md:max-w-xs">
                                <span className="text-[8px] md:text-[10px] font-black text-slate-300 group-hover:text-rose-500 uppercase tracking-widest leading-none block mb-1">{r.id}</span>
                                <h4 className="text-sm md:text-lg font-black text-slate-900 leading-tight truncate">{r.title}</h4>
                                <p className="text-[8px] md:text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight truncate">{r.category}</p>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                               <div className="flex flex-col gap-1.5 items-start">
                                  <PriorityBadge priority={r.severity} />
                                  <StatusBadge status={r.status} />
                               </div>
                            </td>
                            <td className="px-6 py-5">
                               <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-[10px] md:text-xs font-black text-slate-600 truncate">
                                    <User className="w-3 md:w-3.5 h-3 md:h-3.5 text-slate-400" /> {r.owner}
                                  </div>
                                  <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-rose-500 uppercase">
                                    <Clock className="w-3 md:w-3.5 h-3 md:h-3.5" /> {r.mitigationDeadline}
                                  </div>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <ChevronRight className={cn("w-5 h-5 transition-all", activeRiskId === r.id ? "text-rose-600 translate-x-1" : "text-slate-300")} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Mobile Card List View */}
                    <div className="md:hidden divide-y divide-slate-100">
                      {filteredRisks.map(r => (
                        <div 
                          key={r.id} 
                          onClick={() => setActiveRiskId(r.id)}
                          className={cn(
                            "p-4 flex items-center justify-between gap-4 active:bg-rose-50 transition-colors",
                            activeRiskId === r.id ? "bg-rose-50/50" : ""
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[8px] font-black text-slate-300 uppercase">{r.id}</span>
                              <PriorityBadge priority={r.severity} />
                            </div>
                            <h4 className="text-xs font-black text-slate-900 truncate">{r.title}</h4>
                            <p className="text-[9px] text-slate-400 font-bold mt-0.5 truncate">{r.owner} • {r.status}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>  </div>
                </div>
              ) : (
                <EmptyState 
                  icon={Shield}
                  title="Žiadne riziká"
                  description="Tento projekt je aktuálne bez hrozieb."
                  actionLabel="Pridať Riziko"
                  onAction={() => setIsRiskModalOpen(true)}
                />
              )}
            </div>
          )}

          {activeTab === 'dependencies' && (
            <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom duration-500">
               {dependencies.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  {dependencies.map(d => (
                    <div key={d.id} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[3rem] border border-slate-200 shadow-xl card-hover relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1.5 md:w-2 h-full bg-blue-500 opacity-20"></div>
                      <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                          <div className="p-2.5 md:p-3 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl border border-blue-100 shrink-0">
                            <Layers className="w-5 h-5 md:w-6 md:h-6" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">{d.id}</span>
                            <h4 className="text-base md:text-xl font-black text-slate-900 mt-0.5 md:mt-1 leading-tight truncate">{d.title}</h4>
                          </div>
                        </div>
                        <StatusBadge status={d.status} />
                      </div>
                      
                      <div className="flex items-center gap-4 md:gap-6 py-3 md:py-4 border-y border-slate-50 my-4 md:my-6 bg-slate-50/50 rounded-xl md:rounded-2xl px-4 md:px-6">
                        <div className="flex-1">
                          <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Source</p>
                          <p className="text-[10px] md:text-xs font-black text-slate-900 text-center truncate">{d.sourceSystem}</p>
                        </div>
                        <ArrowRight className="w-4 md:w-5 h-4 md:h-5 text-slate-300 shrink-0" />
                        <div className="flex-1">
                          <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Target</p>
                          <p className="text-[10px] md:text-xs font-black text-slate-900 text-center truncate">{d.targetSystem}</p>
                        </div>
                      </div>

                      <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-4 md:mb-6 font-medium italic line-clamp-2 md:line-clamp-none">
                        "{d.description}"
                      </p>

                      <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 md:gap-3">
                          <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />
                          <span className="text-[10px] md:text-xs font-black text-slate-700 uppercase">{d.deadline}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingDep(d); setIsDepModalOpen(true); }} className="p-2 md:p-2.5 bg-slate-50 hover:bg-indigo-50 rounded-lg md:rounded-xl text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 shadow-sm">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                 </div>
               ) : (
                <EmptyState 
                  icon={Layers}
                  title="Žiadne závislosti"
                  description="Neboli definované žiadne väzby."
                  actionLabel="Pridať Závislosť"
                  onAction={() => setIsDepModalOpen(true)}
                />
               )}
            </div>
          )}

          {activeTab === 'matrix' && (
            <div className="animate-in zoom-in duration-500 overflow-x-auto pb-8">
               <div className="bg-white p-6 md:p-12 rounded-2xl md:rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden relative min-w-[600px]">
                  <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12">
                    <div>
                      <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">Risk Heatmap</h3>
                      <p className="text-[10px] md:text-sm text-slate-500 font-medium mt-1 md:mt-2">Analýza hrozieb podľa priority.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-[30px_1fr] grid-rows-[1fr_30px] md:grid-cols-[40px_1fr] md:grid-rows-[1fr_40px] gap-4 md:gap-8 max-w-2xl mx-auto aspect-square">
                    <div className="flex items-center justify-center [writing-mode:vertical-lr] rotate-180 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                      Dopad / Impact
                    </div>
                    
                    <div className="grid grid-cols-5 grid-rows-5 border-2 md:border-4 border-slate-900 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
                      {matrixData.map((row, rIdx) => 
                        row.map((cell, cIdx) => {
                          const impact = 5 - rIdx;
                          const prob = cIdx + 1;
                          const score = impact * prob;
                          
                          let cellBg = 'bg-slate-50';
                          if (score >= 20) cellBg = 'bg-rose-500/90';
                          else if (score >= 12) cellBg = 'bg-orange-400/80';
                          else if (score >= 6) cellBg = 'bg-amber-300/60';
                          else cellBg = 'bg-emerald-200/40';

                          return (
                            <div key={`${rIdx}-${cIdx}`} className={cn(cellBg, "border border-white/20 flex flex-wrap gap-1 md:gap-2 p-1 md:p-3 items-center justify-center relative group min-h-[60px] md:min-h-[100px] transition-all hover:scale-[1.02] hover:z-20")}>
                              {cell.cellRisks.map(r => (
                                <div key={r.id} className="w-5 h-5 md:w-8 md:h-8 bg-white/95 rounded-lg md:rounded-2xl shadow-xl flex items-center justify-center text-[7px] md:text-[10px] font-black text-slate-900 border border-slate-100 cursor-help transition-all">
                                  {r.id.split('-')[1]}
                                </div>
                              ))}
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div />
                    <div className="flex items-center justify-center text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                      Pravdepodobnosť
                    </div>
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* Detail Sidebar / Mobile Drawer Overlay */}
        {activeTab === 'risks' && activeRisk && (
           <div className={cn(
             "fixed inset-0 lg:relative lg:inset-auto z-50 lg:z-10 w-full lg:w-[500px] bg-white border-l border-slate-200 flex flex-col shadow-2xl overflow-hidden transition-transform duration-300 transform",
             activeRiskId ? "translate-x-0" : "translate-x-full lg:translate-x-0"
           )}>
             {/* Close button for mobile */}
             <button 
               onClick={() => setActiveRiskId(null)}
               className="lg:hidden absolute top-4 left-4 p-2 bg-slate-100 rounded-full z-20"
             >
                <ChevronRight className="w-5 h-5 rotate-180" />
             </button>

             <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
                <div className="p-6 md:p-10 border-b border-slate-100 bg-slate-50/50 relative">
                   <div className="absolute top-6 md:top-10 right-6 md:right-10 flex gap-2">
                      <button 
                        onClick={() => { setEditingRisk(activeRisk); setIsRiskModalOpen(true); }}
                        className="p-2.5 md:p-3 bg-white hover:bg-indigo-50 rounded-xl md:rounded-2xl border border-slate-200 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                      >
                        <Edit className="w-4 md:w-5 h-4 md:h-5" />
                      </button>
                   </div>
                   <div className="flex items-center gap-3 mb-4">
                      <span className="text-[9px] md:text-[10px] font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full uppercase border border-rose-200 tracking-widest">{activeRisk.id}</span>
                   </div>
                   <h2 className="text-xl md:text-3xl font-black text-slate-900 leading-tight mb-4 md:mb-6 pr-16">{activeRisk.title}</h2>
                   <div className="flex flex-wrap gap-2 md:gap-3">
                     <PriorityBadge priority={activeRisk.severity} />
                     <StatusBadge status={activeRisk.status} />
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar space-y-8 md:space-y-10">
                  <div className="space-y-3 md:space-y-4">
                    <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       <FileText className="w-3 h-3" /> Risk Description
                    </h4>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium italic p-5 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100">
                      "{activeRisk.description}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="p-4 md:p-6 bg-slate-900 rounded-2xl md:rounded-[2rem] text-center shadow-xl">
                      <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-2">Impact</p>
                      <p className="text-2xl md:text-4xl font-black text-white">{activeRisk.impact}<span className="text-slate-600 text-lg md:text-xl font-bold">/5</span></p>
                    </div>
                    <div className="p-4 md:p-6 bg-slate-900 rounded-2xl md:rounded-[2rem] text-center shadow-xl">
                      <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-2">Prob.</p>
                      <p className="text-2xl md:text-4xl font-black text-white">{activeRisk.probability}<span className="text-slate-600 text-lg md:text-xl font-bold">/5</span></p>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl md:rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                    <h4 className="text-[9px] md:text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 fill-emerald-300" /> Mitigation Plan
                    </h4>
                    <p className="text-sm md:text-base font-bold leading-relaxed italic">
                      "{activeRisk.mitigationPlan}"
                    </p>
                  </div>
                </div>

                <div className="p-6 md:p-10 border-t border-slate-100 bg-white mt-auto flex gap-3">
                   <button className="flex-1 py-4 bg-slate-900 hover:bg-black text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95">
                    <Download className="w-4 md:w-5 h-4 md:h-5" /> Export Summary
                  </button>
                   <button onClick={() => setActiveRiskId(null)} className="lg:hidden px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest">
                     Zatvoriť
                   </button>
                </div>
             </div>
           </div>
        )}

      </div>

      <RiskFormModal 
        isOpen={isRiskModalOpen} 
        onClose={() => setIsRiskModalOpen(false)} 
        initialData={editingRisk} 
      />
      
      <DependencyFormModal 
        isOpen={isDepModalOpen} 
        onClose={() => setIsDepModalOpen(false)} 
        initialData={editingDep} 
      />
    </div>
  );
}
