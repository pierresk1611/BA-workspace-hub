import { useState } from 'react';
import { 
  Database, Play, Trash2, Edit, Search, 
  Download, Copy, Terminal, Bot, 
  Zap, Info, CheckCircle, AlertTriangle, ArrowRight,
  Code2, Share2, MoreVertical, Plus, ChevronRight
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { SQLQueryForm } from './SQLQueryForm';
import { StatusBadge, EmptyState } from './Badge';
import type { SQLQuery, SQLResult } from '../types';
import { cn } from '../lib/utils';

export function SQLWorkspace() {
  const { activeProject, deleteSQLQuery, addSQLResult } = useProject();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuery, setEditingQuery] = useState<SQLQuery | undefined>(undefined);
  const [activeQuery, setActiveQuery] = useState<SQLQuery | undefined>(undefined);
  const [isRunning, setIsRunning] = useState(false);
  const [activeResult, setActiveResult] = useState<SQLResult | undefined>(undefined);
  
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'editor' | 'history' | 'results'>('editor');

  if (!activeProject) return null;

  const queries = activeProject.sqlQueries || [];
  const results = activeProject.sqlResults || [];

  const filteredQueries = queries.filter(q => 
    q.name.toLowerCase().includes(search.toLowerCase()) || 
    q.sqlText.toLowerCase().includes(search.toLowerCase())
  );

  const runMockQuery = () => {
    if (!activeQuery) return;
    setIsRunning(true);
    setActiveResult(undefined);

    setTimeout(() => {
      setIsRunning(false);
      const mockResult: SQLResult = {
        id: `res_${Date.now()}`,
        name: `Analýza: ${activeQuery.name}`,
        queryId: activeQuery.id,
        dateRun: new Date().toLocaleString(),
        inputCriteria: activeQuery.businessCriteria.goal,
        resultTable: [
          { status: 'Aktívny', count: 100, metric: '0.5' },
          { status: 'Neaktívny', count: 20, metric: '0.0' },
          { status: 'Error', count: 5, metric: '1.0' },
        ],
        summary: "Dotaz prebehol úspešne v lokálnom sandboxe.",
        baInterpretation: activeQuery.businessCriteria.interpretation || "Výsledky sú v súlade s očakávaním.",
        dataOwner: activeQuery.owner,
        reviewDeadline: activeQuery.reviewDeadline,
        dataSource: "Local Sandbox (production_replica)",
        isMock: true
      };
      setActiveResult(mockResult);
      addSQLResult(activeProject.id, mockResult);
      setView('results');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Top Navigation */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm z-10">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full md:w-auto">
          <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-indigo-600 rounded-xl md:rounded-2xl text-white shadow-xl shadow-indigo-100">
               <Database className="w-5 h-5 md:w-8 md:h-8" />
            </div>
            SQL Intelligence
          </h1>
          <nav className="flex items-center bg-slate-100 p-1 rounded-xl md:rounded-2xl shadow-inner overflow-x-auto scrollbar-hide w-full md:w-auto">
            {[
              { id: 'editor', label: 'Editor' },
              { id: 'history', label: 'Saved' },
              { id: 'results', label: 'Results' }
            ].map(nav => (
              <button 
                key={nav.id}
                onClick={() => setView(nav.id as any)}
                className={cn(
                  "flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  view === nav.id ? "bg-white text-indigo-600 shadow-lg" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {nav.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => { setEditingQuery(undefined); setIsFormOpen(true); }}
            className="flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 bg-indigo-600 text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 md:w-5 h-4 md:h-5" /> Nový
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden flex-col lg:flex-row">
        
        {/* Left: Editor or History */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {view === 'editor' ? (
            <div className="flex-1 flex flex-col p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto custom-scrollbar bg-slate-50">
              {activeQuery ? (
                <>
                  <div className="bg-white rounded-2xl md:rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col min-h-[400px] md:min-h-[500px]">
                    <div className="px-4 md:px-8 py-4 md:py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <Terminal className="w-4 h-4 md:w-5 md:h-5 text-indigo-500 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-xs md:text-sm font-black text-slate-900 block leading-none truncate">{activeQuery.name}</span>
                          <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeQuery.dialect}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingQuery(activeQuery); setIsFormOpen(true); }} className="p-2 md:p-3 bg-white hover:bg-slate-50 rounded-lg md:rounded-2xl border border-slate-200 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"><Edit className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="flex-1 bg-slate-900 p-6 md:p-10 font-mono text-[10px] md:text-sm leading-loose text-indigo-300 relative group overflow-x-auto">
                       <pre className="whitespace-pre-wrap">{activeQuery.sqlText}</pre>
                    </div>
                    <div className="p-4 md:p-8 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                        <button onClick={runMockQuery} disabled={isRunning} className="flex-1 sm:flex-none px-6 md:px-10 py-3 md:py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2">
                          {isRunning ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Play className="w-3 md:w-4 h-3 md:h-4 fill-current" />}
                          Execute
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-right sm:text-left self-end sm:self-auto">
                         <div className="flex flex-col items-end">
                            <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Sandbox</span>
                            <span className="text-[10px] md:text-xs font-black text-emerald-600 flex items-center gap-1.5">
                              <CheckCircle className="w-3 md:w-3.5 h-3 md:h-3.5" /> LIVE
                            </span>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pb-12">
                    <div className="bg-slate-900 p-6 md:p-8 rounded-2xl md:rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                      <Zap className="absolute -right-8 -bottom-8 w-32 h-32 md:w-48 md:h-48 text-indigo-500 opacity-5" />
                      <h4 className="text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-3">
                        <Bot className="w-5 h-5" /> AI Suggestion
                      </h4>
                      <div className="space-y-4 md:space-y-6 relative z-10">
                        <div className="p-4 md:p-6 bg-white/5 rounded-2xl md:rounded-3xl border border-white/10 italic">
                          <p className="text-[11px] md:text-sm text-slate-300 leading-relaxed font-medium">
                            "Analýza dotazu naznačuje potenciál pre optimalizáciu výkonu."
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[3rem] border border-slate-200 shadow-xl">
                      <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 md:mb-8">Traceability</h4>
                      <div className="grid grid-cols-2 gap-4 md:gap-6">
                        <div className="p-4 md:p-5 bg-slate-50 rounded-xl md:rounded-[2rem] border border-slate-100 text-center">
                          <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Requirement</span>
                          <span className="text-[10px] md:text-xs font-black text-indigo-600 block truncate">{activeQuery.relatedRequirement || 'None'}</span>
                        </div>
                        <div className="p-4 md:p-5 bg-slate-50 rounded-xl md:rounded-[2rem] border border-slate-100 text-center">
                          <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Jira Mapping</span>
                          <span className="text-[10px] md:text-xs font-black text-blue-600 block truncate">{activeQuery.relatedJira || 'TBD'}</span>
                        </div>
                        <div className="col-span-2 p-5 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2.5rem] border border-slate-100">
                          <p className="text-[10px] md:text-sm font-medium text-slate-600 leading-relaxed italic line-clamp-2">"{activeQuery.businessCriteria.goal}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <EmptyState 
                  icon={Code2}
                  title="Editor je prázdny"
                  description="Vyberte dotaz z histórie alebo vytvorte nový."
                  actionLabel="História"
                  onAction={() => setView('history')}
                />
              )}
            </div>
          ) : view === 'history' ? (
            <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar bg-slate-50">
              <div className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Saved Queries</h2>
                </div>
                <div className="relative w-full sm:w-72 md:w-96">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Hľadať..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none shadow-sm" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                {filteredQueries.map(q => (
                  <div key={q.id} className="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-all group overflow-hidden flex flex-col">
                    <div className="p-6 md:p-8 flex-1">
                      <div className="flex items-start justify-between mb-4 md:mb-6">
                        <StatusBadge status={q.status === 'Validovaný' ? 'Done' : 'In Progress'} />
                        <button className="md:opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-50 rounded-lg transition-all">
                          <MoreVertical className="w-4 md:w-5 h-4 md:h-5 text-slate-400" />
                        </button>
                      </div>
                      <h4 className="text-base md:text-lg font-black text-slate-900 mb-2 truncate">{q.name}</h4>
                      <p className="text-[11px] md:text-sm text-slate-500 font-medium leading-relaxed mb-4 md:mb-6 line-clamp-2 italic">"{q.description}"</p>
                      <div className="flex items-center gap-2 md:gap-3 pt-4 md:pt-6 border-t border-slate-50">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-indigo-50 flex items-center justify-center text-[8px] md:text-[10px] font-black text-indigo-600 border border-indigo-100">
                          {q.dialect.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{q.dialect}</span>
                      </div>
                    </div>
                    <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button 
                        onClick={() => { setActiveQuery(q); setView('editor'); }}
                        className="flex-1 py-2 md:py-3 bg-white border border-slate-200 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-sm"
                      >
                        Otvoriť
                      </button>
                      <button onClick={() => deleteSQLQuery(activeProject.id, q.id)} className="p-2 md:p-3 text-slate-300 hover:text-rose-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar bg-slate-50">
               <div className="mb-8 md:mb-10">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Results Archive</h2>
               </div>
              <div className="space-y-4 md:space-y-6">
                {results.map(res => (
                  <div key={res.id} onClick={() => setActiveResult(res)} className={cn(
                    "bg-white p-6 md:p-8 rounded-2xl md:rounded-[3rem] border transition-all cursor-pointer relative overflow-hidden",
                    activeResult?.id === res.id ? "border-indigo-600 shadow-2xl ring-4 ring-indigo-50" : "border-slate-200 shadow-xl hover:border-indigo-200"
                  )}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <div className={cn(
                          "p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg transition-colors shrink-0",
                          activeResult?.id === res.id ? "bg-indigo-600 text-white" : "bg-emerald-50 text-emerald-600"
                        )}>
                          <Zap className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-base md:text-lg font-black text-slate-900 truncate">{res.name}</h4>
                          <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 md:mt-1 truncate">{res.dateRun}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6">
                        <span className="hidden sm:inline px-3 md:px-4 py-1.5 bg-slate-100 text-slate-500 text-[8px] md:text-[9px] font-black rounded-full uppercase tracking-widest">Mock</span>
                        <ChevronRight className={cn("w-5 h-5 md:w-6 md:h-6 text-slate-300 transition-all", activeResult?.id === res.id ? "rotate-90 text-indigo-600" : "")} />
                      </div>
                    </div>
                    {activeResult?.id === res.id && (
                      <div className="mt-8 md:mt-10 pt-8 md:pt-10 border-t border-slate-100 space-y-8 md:space-y-10 animate-in slide-in-from-top duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                          <div className="lg:col-span-8 overflow-hidden">
                            <h5 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2">
                              <Terminal className="w-4 h-4" /> Dataset
                            </h5>
                            <div className="bg-slate-50 rounded-2xl md:rounded-[2.5rem] overflow-x-auto border border-slate-100 shadow-inner">
                              <table className="w-full text-left text-[11px] md:text-xs border-collapse min-w-[400px]">
                                <thead className="border-b border-slate-200">
                                  <tr>
                                    {Object.keys(res.resultTable[0] || {}).map(k => (
                                      <th key={k} className="px-4 md:px-6 py-3 md:py-4 font-black text-slate-400 uppercase text-[8px] md:text-[9px] tracking-widest">{k}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {res.resultTable.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white transition-colors group">
                                      {Object.values(row).map((v: any, i) => (
                                        <td key={i} className="px-4 md:px-6 py-3 md:py-4 text-slate-600 font-bold group-hover:text-indigo-600 transition-colors">{v.toString()}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="lg:col-span-4 space-y-6 md:space-y-8">
                            <div className="p-6 md:p-8 bg-indigo-600 rounded-2xl md:rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                               <h5 className="text-[9px] md:text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-3 md:mb-4">BA Analysis</h5>
                               <p className="text-[11px] md:text-sm font-medium leading-relaxed italic">"{res.baInterpretation}"</p>
                            </div>
                            <button className="w-full py-4 md:py-5 bg-slate-900 hover:bg-black text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3">
                              <Download className="w-4 md:w-5 h-4 md:h-5" /> Export Raw
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Context */}
        <div className="hidden xl:flex w-96 bg-white border-l border-slate-200 flex-col shrink-0 glass z-10">
          <div className="p-8 border-b border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
               <Bot className="w-6 h-6" />
            </div>
            <div>
               <h3 className="font-black text-slate-900 leading-none">Intelligence</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Sandbox help</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mock Schema</h4>
              <div className="space-y-3">
                {['users', 'orders', 'transactions'].map(t => (
                  <div key={t} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between group hover:bg-white transition-all">
                    <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">{t}</span>
                    <Info className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 shadow-inner relative overflow-hidden group">
               <div className="flex items-center gap-3 text-amber-900 mb-6 font-black text-xs uppercase tracking-widest">
                 <AlertTriangle className="w-5 h-5 text-amber-600" />
                 Quality
               </div>
               <ul className="space-y-4">
                 <li className="flex gap-3 text-[11px] text-amber-800 font-medium">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                   Schéma validná.
                 </li>
               </ul>
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100">
            <button className="w-full py-5 bg-white border border-slate-200 rounded-[1.5rem] text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-sm hover:shadow-lg transition-all active:scale-95 group">
              <Bot className="w-5 h-5" />
              SQL Co-Pilot
            </button>
          </div>
        </div>

      </div>

      <SQLQueryForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={editingQuery} 
      />
    </div>
  );
}
