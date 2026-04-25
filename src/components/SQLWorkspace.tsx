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
        name: `Mock Run: ${activeQuery.name}`,
        queryId: activeQuery.id,
        dateRun: new Date().toLocaleString(),
        inputCriteria: activeQuery.businessCriteria.goal,
        resultTable: [
          { status: 'Aktívny', count: 124, avg_response: '0.4s' },
          { status: 'Offline', count: 18, avg_response: 'N/A' },
          { status: 'Chyba', count: 3, avg_response: '5.2s' },
        ],
        summary: "Dotaz prebehol úspešne v mock sandboxe nad 145 záznamami.",
        baInterpretation: activeQuery.businessCriteria.interpretation || "Výsledky indikujú stabilnú prevádzku.",
        dataOwner: activeQuery.owner,
        reviewDeadline: activeQuery.reviewDeadline,
        dataSource: "Mock Sandbox (driver_sessions)",
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
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm z-10">
        <div className="flex items-center gap-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
               <Database className="w-8 h-8" />
            </div>
            SQL Intelligence
          </h1>
          <nav className="flex items-center bg-slate-100 p-1.5 rounded-2xl shadow-inner">
            {[
              { id: 'editor', label: 'Query Editor' },
              { id: 'history', label: 'Saved Queries' },
              { id: 'results', label: 'Result History' }
            ].map(nav => (
              <button 
                key={nav.id}
                onClick={() => setView(nav.id as any)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  view === nav.id ? "bg-white text-indigo-600 shadow-lg" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {nav.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setEditingQuery(undefined); setIsFormOpen(true); }}
            className="px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Nový Dotaz
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Editor or History */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {view === 'editor' ? (
            <div className="flex-1 flex flex-col p-8 space-y-8 overflow-y-auto custom-scrollbar bg-slate-50">
              {activeQuery ? (
                <>
                  <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col flex-1 min-h-[500px]">
                    <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Terminal className="w-5 h-5 text-indigo-500" />
                        <div>
                          <span className="text-sm font-black text-slate-900 block leading-none">{activeQuery.name}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeQuery.dialect} Engine</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"><Copy className="w-4 h-4" /></button>
                        <button onClick={() => { setEditingQuery(activeQuery); setIsFormOpen(true); }} className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"><Edit className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="flex-1 bg-slate-900 p-10 font-mono text-sm leading-loose text-indigo-300 relative group">
                       <pre className="whitespace-pre-wrap">{activeQuery.sqlText}</pre>
                       <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Code2 className="w-32 h-32" />
                       </div>
                    </div>
                    <div className="p-8 bg-white border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button onClick={runMockQuery} disabled={isRunning} className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all flex items-center gap-3 active:scale-95">
                          {isRunning ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                          Execute Mock Run
                        </button>
                        <button className="px-8 py-4 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-sm">
                          Plan Explain
                        </button>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Database Sandbox</span>
                           <span className="text-xs font-black text-emerald-600 flex items-center gap-2">
                             <CheckCircle className="w-3.5 h-3.5" /> LIVE CONNECTION
                           </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
                    <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                      <Zap className="absolute -right-8 -bottom-8 w-48 h-48 text-indigo-500 opacity-5 group-hover:scale-110 transition-transform duration-1000" />
                      <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <Bot className="w-5 h-5" /> AI Business Optimization
                      </h4>
                      <div className="space-y-6 relative z-10">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 italic">
                          <p className="text-sm text-slate-300 leading-relaxed font-medium">
                            "Tento dotaz identifikuje anomálie v prihlasovaní vodičov. AI navrhuje pridať JOIN na tabuľku <code>network_status</code>, aby sme vedeli vylúčiť technické výpadky konektivity v reálnom čase."
                          </p>
                        </div>
                        <button className="flex items-center gap-2 text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors">
                           Apply AI Suggestion <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Data Traceability</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 text-center">Requirement</span>
                          <span className="text-xs font-black text-indigo-600 block text-center truncate">{activeQuery.relatedRequirement || 'None'}</span>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 text-center">Jira Mapping</span>
                          <span className="text-xs font-black text-blue-600 block text-center truncate">{activeQuery.relatedJira || 'TBD'}</span>
                        </div>
                        <div className="col-span-2 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3">Business Goal</span>
                          <p className="text-sm font-medium text-slate-600 leading-relaxed italic line-clamp-3">"{activeQuery.businessCriteria.goal}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <EmptyState 
                  icon={Code2}
                  title="Editor je prázdny"
                  description="Vyberte existujúci SQL dotaz z histórie alebo vytvorte nový analytický dotaz pre váš biznis cieľ."
                  actionLabel="Prejsť na Uložené dotazy"
                  onAction={() => setView('history')}
                />
              )}
            </div>
          ) : view === 'history' ? (
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-slate-50">
              <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Saved Analytical Queries</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">Knižnica overených a revidovaných SQL dotazov.</p>
                </div>
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Hľadať v dotazoch..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredQueries.map(q => (
                  <div key={q.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col">
                    <div className="p-8 flex-1">
                      <div className="flex items-start justify-between mb-6">
                        <StatusBadge status={q.status === 'Validovaný' ? 'Done' : 'In Progress'} />
                        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-50 rounded-xl transition-all">
                          <MoreVertical className="w-5 h-5 text-slate-400" />
                        </button>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{q.name}</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 h-10 line-clamp-2 italic">"{q.description}"</p>
                      <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 border border-indigo-100">
                          {q.dialect.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{q.dialect} Dialect</span>
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <button 
                        onClick={() => { setActiveQuery(q); setView('editor'); }}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-sm"
                      >
                        Otvoriť Editor
                      </button>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditingQuery(q); setIsFormOpen(true); }} className="p-2 hover:bg-white rounded-xl text-slate-300 hover:text-indigo-600 transition-all"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteSQLQuery(activeProject.id, q.id)} className="p-2 hover:bg-white rounded-xl text-slate-300 hover:text-rose-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-slate-50">
               <div className="mb-10">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Historical Data Results</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">Archív spustení dotazov a ich biznis interpretácie.</p>
               </div>
              <div className="space-y-6">
                {results.map(res => (
                  <div key={res.id} onClick={() => setActiveResult(res)} className={cn(
                    "bg-white p-8 rounded-[3rem] border transition-all cursor-pointer relative overflow-hidden",
                    activeResult?.id === res.id ? "border-indigo-600 shadow-2xl ring-4 ring-indigo-50" : "border-slate-200 shadow-xl hover:border-indigo-200"
                  )}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-4 rounded-2xl shadow-lg transition-colors",
                          activeResult?.id === res.id ? "bg-indigo-600 text-white" : "bg-emerald-50 text-emerald-600"
                        )}>
                          <Zap className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-slate-900">{res.name}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{res.dateRun} • {res.dataSource}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-[9px] font-black rounded-full uppercase tracking-widest">Mock Snapshot</span>
                        <ChevronRight className={cn("w-6 h-6 text-slate-300 transition-all", activeResult?.id === res.id ? "rotate-90 text-indigo-600" : "")} />
                      </div>
                    </div>
                    {activeResult?.id === res.id && (
                      <div className="mt-10 pt-10 border-t border-slate-100 space-y-10 animate-in slide-in-from-top duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                          <div className="lg:col-span-8">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                              <Terminal className="w-4 h-4" /> Result Dataset
                            </h5>
                            <div className="bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner p-4">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead className="border-b border-slate-200">
                                  <tr>
                                    {Object.keys(res.resultTable[0] || {}).map(k => (
                                      <th key={k} className="px-6 py-4 font-black text-slate-400 uppercase text-[9px] tracking-widest">{k}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {res.resultTable.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white transition-colors group">
                                      {Object.values(row).map((v: any, i) => (
                                        <td key={i} className="px-6 py-4 text-slate-600 font-bold group-hover:text-indigo-600 transition-colors">{v.toString()}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="lg:col-span-4 space-y-8">
                            <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                               <Bot className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10 group-hover:scale-110 transition-transform" />
                               <h5 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4">BA Analytical Interpretation</h5>
                               <p className="text-sm font-medium leading-relaxed italic relative z-10">"{res.baInterpretation}"</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Data Owner</span>
                                <span className="text-xs font-black text-slate-700">{res.dataOwner}</span>
                              </div>
                              <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Review Date</span>
                                <span className="text-xs font-black text-rose-500">{res.reviewDeadline}</span>
                              </div>
                            </div>
                            <button className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 group">
                              <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" /> Export Raw Dataset
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
        <div className="w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 glass z-10">
          <div className="p-8 border-b border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
               <Bot className="w-6 h-6" />
            </div>
            <div>
               <h3 className="font-black text-slate-900 leading-none">Sandbox Intelligence</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Nápoveda a overenie dát</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mock Schema Registry</h4>
              <div className="space-y-3">
                {['driver_sessions', 'alzabox_access_logs', 'parcel_history', 'eta_predictions'].map(t => (
                  <div key={t} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between group cursor-help hover:bg-white transition-all">
                    <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">{t}</span>
                    <Info className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 shadow-inner relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                 <AlertTriangle className="w-24 h-24 text-amber-600" />
               </div>
               <div className="flex items-center gap-3 text-amber-900 mb-6 font-black text-xs uppercase tracking-widest relative z-10">
                 <AlertTriangle className="w-5 h-5 text-amber-600" />
                 Quality Guardianship
               </div>
               <ul className="space-y-4 relative z-10">
                 <li className="flex gap-3 text-[11px] text-amber-800 font-medium">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                   Schéma je validná pre Postgres 15.
                 </li>
                 <li className="flex gap-3 text-[11px] text-amber-800 font-medium">
                   <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                   Detekované riziko: NULL hodnoty v poli <code>is_logged_in</code> môžu skresliť štatistiky.
                 </li>
               </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quick Collaboration</h4>
              <div className="grid grid-cols-2 gap-4">
                <button className="py-4 bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-widest shadow-sm transition-all flex flex-col items-center gap-2">
                  <Share2 className="w-5 h-5 text-indigo-500" /> Share Link
                </button>
                <button className="py-4 bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-widest shadow-sm transition-all flex flex-col items-center gap-2">
                  <Download className="w-5 h-5 text-indigo-500" /> Download Dataset
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100">
            <button className="w-full py-5 bg-white border border-slate-200 hover:border-indigo-300 rounded-[1.5rem] text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-sm hover:shadow-lg transition-all active:scale-95 group">
              <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              SQL Co-Pilot Active
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
