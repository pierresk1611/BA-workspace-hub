import { useState, useMemo } from 'react';
import { 
  Search, Download, AlertCircle, ArrowRight,
  CheckCircle2, Link as LinkIcon, Unlink,
  AlertTriangle, Clock,
  ShieldCheck, Info, SearchX
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { cn } from '../lib/utils';
import { StatusBadge } from './Badge';

interface MatrixRow {
  goal: string;
  requirement: { id: string; title: string; status: any };
  source: string;
  decision: { id: string; title: string } | null;
  jira: string;
  risk: { id: string; title: string } | null;
  testScenario: string;
  owner: string;
  deadline: string;
  lastUpdated: string;
}

export function TraceabilityMatrix() {
  const { activeProject } = useProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMissing, setFilterMissing] = useState(false);

  const matrixData = useMemo(() => {
    if (!activeProject) return [];

    return activeProject.requirements.map(req => {
      const decision = activeProject.decisions.find(d => d.relatedRequirementId === req.id) || null;
      const risk = activeProject.risks.find(r => r.relatedRequirementId === req.id) || null;
      
      return {
        goal: "Zvýšiť efektivitu doručovania",
        requirement: { id: req.id, title: req.title, status: req.status },
        source: req.source,
        decision: decision ? { id: decision.id, title: decision.title } : null,
        jira: req.relatedJiraKey || '',
        risk: risk ? { id: risk.id, title: risk.title } : null,
        testScenario: 'Acceptance Criteria defined',
        owner: req.owner,
        deadline: req.deadline || '',
        lastUpdated: req.dateUpdated
      } as MatrixRow;
    });
  }, [activeProject]);

  const filteredData = matrixData.filter(row => {
    const matchesSearch = row.requirement.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          row.jira.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterMissing) {
      const isMissingLink = !row.jira || !row.decision || !row.deadline;
      return matchesSearch && isMissingLink;
    }
    
    return matchesSearch;
  });

  if (!activeProject) return null;

  const exportMatrix = () => {
    const headers = ["Business Goal", "Requirement", "Source", "Decision", "Jira", "Risk", "Owner", "Deadline"];
    const rows = filteredData.map(r => [
      r.goal, 
      `${r.requirement.id}: ${r.requirement.title}`, 
      r.source, 
      r.decision?.id || 'NONE', 
      r.jira || 'NONE', 
      r.risk?.id || 'NONE', 
      r.owner, 
      r.deadline || 'MISSING'
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Traceability_Matrix_${activeProject.name}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Traceability Matrix</h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl text-lg">
            End-to-end vizualizácia väzieb medzi biznisom a technickou implementáciou.
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
             <button 
                onClick={() => setFilterMissing(false)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  !filterMissing ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                )}
             >
               All Mapping
             </button>
             <button 
                onClick={() => setFilterMissing(true)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                  filterMissing ? "bg-rose-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                )}
             >
               <Unlink className="w-4 h-4" /> Broken Links
             </button>
           </div>
           <button 
            onClick={exportMatrix}
            className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
           >
             <Download className="w-5 h-5" /> Export Matrix
           </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Requirements with Jira', val: `${matrixData.filter(r => r.jira).length}/${matrixData.length}`, icon: LinkIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: 'Decision Traceability', val: `${matrixData.filter(r => r.decision).length}/${matrixData.length}`, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Orphan Requirements', val: matrixData.filter(r => !r.jira).length, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
           { label: 'Missing Deadlines', val: matrixData.filter(r => !r.deadline).length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' }
         ].map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
              <div className={cn("p-4 rounded-2xl", s.bg, s.color)}>
                 <s.icon className="w-8 h-8" />
              </div>
              <div>
                 <p className="text-3xl font-black text-slate-900 leading-none mb-2">{s.val}</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{s.label}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Hľadať v matici (ID, názov, Jira, owner)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 px-5 py-2.5 bg-indigo-50 rounded-2xl border border-indigo-100">
             <Info className="w-4 h-4 text-indigo-600" />
             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Enterprise Traceability Enabled</span>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Goal & Requirement</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Decision</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Jira Item</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Risk Assessment</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Owner & Deadline</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-8 min-w-[350px]">
                       <div className="space-y-3">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{row.goal}</span>
                          <div className="flex flex-col">
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{row.requirement.id}</span>
                                <StatusBadge status={row.requirement.status} />
                             </div>
                             <h4 className="text-sm font-black text-slate-900 leading-tight mt-1">{row.requirement.title}</h4>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-8">
                       {row.decision ? (
                         <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl w-fit border border-emerald-100">
                               <CheckCircle2 className="w-3.5 h-3.5" /> {row.decision.id}
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 truncate max-w-[150px]">{row.decision.title}</span>
                         </div>
                       ) : (
                         <div className="flex items-center gap-2 text-[9px] font-black text-rose-400 uppercase bg-rose-50 px-3 py-1.5 rounded-xl w-fit border border-rose-100 animate-pulse">
                            <Unlink className="w-3.5 h-3.5" /> No Decision
                         </div>
                       )}
                    </td>
                    <td className="px-8 py-8">
                       {row.jira ? (
                         <div className="flex items-center gap-2 text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl w-fit border border-indigo-100">
                            <LinkIcon className="w-3.5 h-3.5" /> {row.jira}
                         </div>
                       ) : (
                         <div className="flex items-center gap-2 text-[9px] font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl w-fit border border-rose-100 animate-pulse shadow-sm">
                            <AlertCircle className="w-3.5 h-3.5" /> Orphan RQ
                         </div>
                       )}
                    </td>
                    <td className="px-8 py-8">
                       {row.risk ? (
                         <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs font-black text-rose-600">
                               <AlertTriangle className="w-3.5 h-3.5" /> {row.risk.id}
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 truncate max-w-[150px]">{row.risk.title}</span>
                         </div>
                       ) : (
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">Unlinked</span>
                       )}
                    </td>
                    <td className="px-8 py-8">
                       <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                             <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] border border-slate-200">BA</div>
                             {row.owner}
                          </div>
                          <div className="flex items-center gap-2">
                             <Clock className={cn("w-3.5 h-3.5", !row.deadline ? "text-rose-500" : "text-slate-400")} />
                             <span className={cn("text-[10px] font-black uppercase tracking-tight", !row.deadline ? "text-rose-600 underline decoration-rose-200" : "text-slate-500")}>
                               {row.deadline || 'MISSING DEADLINE'}
                             </span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-8 text-right">
                       <button className="p-3 bg-slate-50 hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 transition-all text-slate-300 hover:text-indigo-600">
                          <ArrowRight className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                     <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-500">
                        <div className="p-8 bg-slate-50 rounded-full border border-dashed border-slate-200">
                          <SearchX className="w-16 h-16 text-slate-200" />
                        </div>
                        <div>
                          <p className="text-xl font-black text-slate-900 tracking-tight">No results found</p>
                          <p className="text-sm text-slate-400 font-medium italic mt-2">Upravte svoje filtre alebo skontrolujte mapovanie požiadaviek.</p>
                        </div>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
