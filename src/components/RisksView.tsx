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
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-xl shadow-rose-100">
              <Shield className="w-8 h-8" />
            </div>
            Risk & Dependency Register
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">
            Aktívny monitoring hrozieb, mitigačných plánov a technických závislostí pre {activeProject.name}.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {(['risks', 'dependencies', 'matrix'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
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
            className="px-8 py-4 bg-rose-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-rose-100 hover:bg-rose-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Pridať {activeTab === 'dependencies' ? 'Závislosť' : 'Riziko'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          
          {activeTab === 'risks' && (
            <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Active', val: risks.length, color: 'text-slate-900', bg: 'bg-white' },
                  { label: 'Critical / High', val: risks.filter(r => r.severity === 'Kritická' || r.severity === 'Vysoká').length, color: 'text-rose-600', bg: 'bg-rose-50' },
                  { label: 'Open Issues', val: risks.filter(r => r.status === 'Open').length, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Mitigated', val: risks.filter(r => r.status === 'Resolved').length, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                ].map((s, i) => (
                  <div key={i} className={cn("p-6 rounded-[2rem] border border-slate-200 shadow-sm", s.bg)}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                    <h3 className={cn("text-3xl font-black", s.color)}>{s.val}</h3>
                  </div>
                ))}
              </div>

              {risks.length > 0 ? (
                <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/30">
                    <div className="flex-1 relative">
                      <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Rýchle hľadanie v rizikách..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/30 border-b border-slate-100">
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Riziko</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Severity & Status</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner & Deadline</th>
                          <th className="px-8 py-4 text-right"></th>
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
                            <td className="px-8 py-6">
                              <div>
                                <span className="text-[10px] font-black text-slate-300 group-hover:text-rose-500 uppercase tracking-widest leading-none block mb-1">{r.id}</span>
                                <h4 className="text-lg font-black text-slate-900 leading-tight">{r.title}</h4>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight">{r.category}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex flex-col gap-2 items-start">
                                  <PriorityBadge priority={r.severity} />
                                  <StatusBadge status={r.status} />
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="space-y-1.5">
                                  <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                                    <User className="w-3.5 h-3.5 text-slate-400" /> {r.owner}
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] font-black text-rose-500">
                                    <Clock className="w-3.5 h-3.5" /> {r.mitigationDeadline}
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <ChevronRight className={cn("w-6 h-6 transition-all", activeRiskId === r.id ? "text-rose-600 translate-x-1" : "text-slate-300")} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <EmptyState 
                  icon={Shield}
                  title="Žiadne riziká"
                  description="Tento projekt je aktuálne bez evidovaných hrozieb. Odporúčame vykonať pravidelný risk workshop."
                  actionLabel="Pridať Riziko"
                  onAction={() => setIsRiskModalOpen(true)}
                />
              )}
            </div>
          )}

          {activeTab === 'dependencies' && (
            <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
               {dependencies.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {dependencies.map(d => (
                    <div key={d.id} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl card-hover group relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 opacity-20"></div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                            <Layers className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{d.id}</span>
                            <h4 className="text-xl font-black text-slate-900 mt-1 leading-tight">{d.title}</h4>
                          </div>
                        </div>
                        <StatusBadge status={d.status} />
                      </div>
                      
                      <div className="flex items-center gap-6 py-4 border-y border-slate-50 my-6 bg-slate-50/50 rounded-2xl px-6">
                        <div className="flex-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 text-center">Source</p>
                          <p className="text-xs font-black text-slate-900 text-center">{d.sourceSystem}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 animate-pulse" />
                        <div className="flex-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 text-center">Target</p>
                          <p className="text-xs font-black text-slate-900 text-center">{d.targetSystem}</p>
                        </div>
                      </div>

                      <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium italic">
                        {d.description}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-black text-slate-700">{d.deadline}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingDep(d); setIsDepModalOpen(true); }} className="p-2.5 bg-slate-50 hover:bg-indigo-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all border border-slate-100">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteDependency(activeProject.id, d.id)} className="p-2.5 bg-slate-50 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-all border border-slate-100">
                            <Trash2 className="w-4 h-4" />
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
                  description="Neboli definované žiadne medzisystémové alebo medzitímové väzby pre tento projekt."
                  actionLabel="Pridať Závislosť"
                  onAction={() => setIsDepModalOpen(true)}
                />
               )}
            </div>
          )}

          {activeTab === 'matrix' && (
            <div className="animate-in zoom-in duration-500">
               <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden relative">
                  <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">Risk Impact Heatmap</h3>
                      <p className="text-sm text-slate-500 font-medium mt-2">Vizuálna analýza hrozieb podľa priority a pravdepodobnosti.</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-xl border border-rose-100">
                          <span className="text-[10px] font-black text-rose-600 uppercase">Kritické Zóny</span>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-[40px_1fr] grid-rows-[1fr_40px] gap-8 max-w-3xl mx-auto aspect-square">
                    <div className="flex items-center justify-center [writing-mode:vertical-lr] rotate-180 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                      Dopad / Impact (1-5)
                    </div>
                    
                    <div className="grid grid-cols-5 grid-rows-5 border-4 border-slate-900 rounded-2xl overflow-hidden shadow-2xl">
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
                            <div key={`${rIdx}-${cIdx}`} className={cn(cellBg, "border border-white/20 flex flex-wrap gap-2 p-3 items-center justify-center relative group min-h-[100px] transition-all hover:scale-[1.02] hover:z-20 shadow-inner")}>
                              {cell.cellRisks.map(r => (
                                <div key={r.id} className="w-8 h-8 bg-white/95 rounded-2xl shadow-xl flex items-center justify-center text-[10px] font-black text-slate-900 border border-slate-100 cursor-help transform hover:scale-[2] hover:shadow-2xl transition-all z-10 group/item" title={r.title}>
                                  {r.id.split('-')[1]}
                                  <div className="hidden group-hover/item:block absolute bottom-full mb-2 w-48 p-2 bg-slate-900 text-white text-[9px] rounded-lg z-50 pointer-events-none">{r.title}</div>
                                </div>
                              ))}
                              {cell.cellRisks.length === 0 && (
                                <span className="text-xs font-black text-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity">{score}</span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div />
                    <div className="flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                      Pravdepodobnosť / Probability (1-5)
                    </div>
                  </div>

                  <div className="mt-16 flex flex-wrap justify-center gap-12 border-t border-slate-100 pt-12">
                    {[
                      { label: 'Minor', color: 'bg-emerald-200/40' },
                      { label: 'Moderate', color: 'bg-amber-300/60' },
                      { label: 'High', color: 'bg-orange-400/80' },
                      { label: 'Critical', color: 'bg-rose-500/90' }
                    ].map(l => (
                      <div key={l.label} className="flex items-center gap-3">
                        <div className={cn("w-5 h-5 rounded-lg shadow-sm border border-white/30", l.color)} />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{l.label}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* Risk Detail Sidebar */}
        {activeTab === 'risks' && (
          <div className="w-full lg:w-[500px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-10 overflow-hidden glass">
            {activeRisk ? (
              <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
                <div className="p-10 border-b border-slate-100 bg-slate-50/50 relative">
                   <div className="absolute top-10 right-10 flex gap-2">
                      <button 
                        onClick={() => { setEditingRisk(activeRisk); setIsRiskModalOpen(true); }}
                        className="p-3 bg-white hover:bg-indigo-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => { if (confirm('Zmazať riziko?')) deleteRisk(activeProject.id, activeRisk.id); }}
                        className="p-3 bg-white hover:bg-rose-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-rose-600 transition-all shadow-sm"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                   </div>
                   <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-4 py-1.5 rounded-full uppercase border border-rose-200 tracking-widest">{activeRisk.id}</span>
                   </div>
                   <h2 className="text-3xl font-black text-slate-900 leading-tight mb-6 pr-20">{activeRisk.title}</h2>
                   <div className="flex flex-wrap gap-3">
                     <PriorityBadge priority={activeRisk.severity} />
                     <StatusBadge status={activeRisk.status} />
                     <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase border border-slate-200 tracking-tighter">{activeRisk.category}</span>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       <FileText className="w-3 h-3" /> Risk Description
                    </h4>
                    <p className="text-base text-slate-600 leading-relaxed font-medium italic p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                      {activeRisk.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-900 rounded-[2rem] text-center shadow-xl shadow-slate-200">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Impact Score</p>
                      <p className="text-4xl font-black text-white">{activeRisk.impact}<span className="text-slate-600 text-xl font-bold">/5</span></p>
                    </div>
                    <div className="p-6 bg-slate-900 rounded-[2rem] text-center shadow-xl shadow-slate-200">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Probability Score</p>
                      <p className="text-4xl font-black text-white">{activeRisk.probability}<span className="text-slate-600 text-xl font-bold">/5</span></p>
                    </div>
                  </div>

                  <div className="p-8 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-100 group relative overflow-hidden">
                    <Shield className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                    <h4 className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 fill-emerald-300" /> Strategic Mitigation Plan
                    </h4>
                    <p className="text-base font-bold leading-relaxed relative z-10 italic">
                      {activeRisk.mitigationPlan || 'Mitigačný plán zatiaľ nie je definovaný pre toto riziko.'}
                    </p>
                  </div>

                  <div className="space-y-5 pt-8 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-xl text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Steward</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">{activeRisk.owner}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-50 rounded-xl text-rose-400">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mitigation Deadline</span>
                      </div>
                      <span className="text-sm font-black text-rose-600 uppercase">{activeRisk.mitigationDeadline}</span>
                    </div>
                  </div>

                  <div className="space-y-6 pt-8 border-t border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Traceability & Context</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between group cursor-pointer hover:bg-indigo-100/50 transition-all">
                        <div className="flex items-center gap-4">
                           <FileText className="w-5 h-5 text-indigo-600" />
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black text-indigo-400 uppercase">Requirement Link</span>
                              <span className="text-sm font-black text-indigo-900">{activeRisk.relatedRequirementId || 'None Linked'}</span>
                           </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between group cursor-pointer hover:bg-blue-100/50 transition-all">
                        <div className="flex items-center gap-4">
                           <Layers className="w-5 h-5 text-blue-600" />
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black text-blue-400 uppercase">Jira Integration</span>
                              <span className="text-sm font-black text-blue-900">{activeRisk.relatedJiraKey || 'No Direct Task'}</span>
                           </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 border-t border-slate-100 bg-slate-50/50">
                   <button className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 group">
                    <Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform" /> Export Technical Risk Summary
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-16 space-y-8 animate-in fade-in duration-500">
                <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-slate-100 group">
                  <Shield className="w-16 h-16 text-slate-100 group-hover:text-rose-200 transition-colors duration-500" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Vulnerability Detail</h3>
                  <p className="text-base text-slate-400 font-medium max-w-xs leading-relaxed italic">
                    Vyberte konkrétne riziko z registru alebo heatmapy pre detailnú analýzu mitigácie.
                  </p>
                </div>
              </div>
            )}
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
