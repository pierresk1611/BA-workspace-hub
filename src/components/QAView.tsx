import { useState } from 'react';
import { 
  Search,
  CheckCircle2, Clock, AlertTriangle, 
  FileText, Kanban, Download, Zap,
  User, CircleDot, MoreVertical,
  PieChart as PieIcon, ChevronRight
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { cn } from '../lib/utils';
import { StatusBadge, PriorityBadge, EmptyState } from './Badge';
import type { ACStatus } from '../types';

export function QAView() {
  const { activeProject } = useProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ACStatus | 'All'>('All');

  if (!activeProject) return null;

  const acList = activeProject.acceptanceCriteria || [];

  const filteredAC = acList.filter(ac => {
    const matchesSearch = ac.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ac.requirementId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || ac.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-xl shadow-emerald-100">
               <CheckCircle2 className="w-8 h-8" />
            </div>
            Acceptance & QA Strategy
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl text-lg">
            Definícia akceptačných kritérií (Gherkin) a tracking testovacieho progresu pre {activeProject.name}.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
            <Zap className="w-5 h-5" /> Generate AC
          </button>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Total Scenarios', val: acList.length, icon: FileText, color: 'text-slate-900', bg: 'bg-white' },
           { label: 'Passed / Ready', val: acList.filter(ac => ac.status === 'Passed' || ac.status === 'Approved').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'In Testing', val: acList.filter(ac => ac.status === 'In testing').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: 'Failed Scenarios', val: acList.filter(ac => ac.status === 'Failed').length, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' }
         ].map((s, i) => (
           <div key={i} className={cn("p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6", s.bg)}>
              <div className={cn("p-4 rounded-2xl bg-white shadow-sm border border-slate-100", s.color)}>
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
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Hľadať v AC (ID, Názov, Requirement)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-[60%]">
           {(['All', 'Draft', 'Ready for review', 'Approved', 'In testing', 'Passed', 'Failed'] as const).map(status => (
             <button
               key={status}
               onClick={() => setFilterStatus(status)}
               className={cn(
                 "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap",
                 filterStatus === status ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
               )}
             >
               {status}
             </button>
           ))}
        </div>
      </div>

      {/* AC Grid */}
      {filteredAC.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filteredAC.map(ac => (
            <div key={ac.id} className="bg-white rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl card-hover overflow-hidden flex flex-col relative group">
              <div className="p-10 pb-6">
                 <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-inner group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all">
                          <FileText className="w-6 h-6 text-emerald-600" />
                       </div>
                       <div>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{ac.id}</span>
                             <StatusBadge status={ac.status} />
                             <PriorityBadge priority={ac.priority || 'Stredná'} />
                          </div>
                          <h3 className="text-xl font-black text-slate-900 mt-1 leading-tight">{ac.title}</h3>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Linked To:</span>
                             <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 uppercase">{ac.requirementId}</span>
                          </div>
                       </div>
                    </div>
                    <button className="p-3 hover:bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-600 transition-all border border-transparent hover:border-slate-100">
                       <MoreVertical className="w-5 h-5" />
                    </button>
                 </div>

                 {/* Gherkin Block */}
                 <div className="space-y-4 mb-8 bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden group/gherkin">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/gherkin:opacity-10 transition-opacity">
                       <Zap className="w-20 h-20 text-white" />
                    </div>
                    <div className="flex items-start gap-4">
                       <span className="text-[9px] font-black text-indigo-400 uppercase w-14 pt-1 tracking-[0.2em]">Given</span>
                       <p className="text-sm font-bold text-slate-300 flex-1 leading-relaxed italic">{ac.given}</p>
                    </div>
                    <div className="flex items-start gap-4">
                       <span className="text-[9px] font-black text-indigo-400 uppercase w-14 pt-1 tracking-[0.2em]">When</span>
                       <p className="text-sm font-bold text-slate-300 flex-1 leading-relaxed italic">{ac.when}</p>
                    </div>
                    <div className="flex items-start gap-4">
                       <span className="text-[9px] font-black text-indigo-400 uppercase w-14 pt-1 tracking-[0.2em]">Then</span>
                       <p className="text-sm font-bold text-slate-100 flex-1 leading-relaxed italic border-l-2 border-emerald-500 pl-4">{ac.then}</p>
                    </div>
                 </div>
              </div>

              <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm text-[9px] font-black text-slate-400">QA</div>
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Owner</span>
                          <span className="text-xs font-black text-slate-900">{ac.qaOwner}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <Clock className="w-4 h-4 text-rose-500" />
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Target Date</span>
                          <span className="text-xs font-black text-rose-600">{ac.testDeadline}</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    {ac.jiraLink && (
                       <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-all">
                          Jira: {ac.jiraLink}
                       </button>
                    )}
                    <button className="p-3 bg-white hover:bg-emerald-50 rounded-2xl border border-slate-200 text-slate-300 hover:text-emerald-600 transition-all shadow-sm">
                       <ChevronRight className="w-5 h-5" />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={CheckCircle2}
          title="Žiadne akceptačné kritériá"
          description="V tomto projekte zatiaľ nie sú definované akceptačné kritériá. Použite AI generátor na vytvorenie AC z požiadaviek."
          actionLabel="Vytvoriť AC Scenár"
          onAction={() => {}}
        />
      )}

      {/* QA Intelligence Card */}
      <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative shadow-2xl border-4 border-white/10">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <PieIcon className="w-64 h-64" />
         </div>
         <div className="relative z-10 space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-emerald-600 rounded-2xl shadow-xl border border-emerald-400/50">
                  <PieIcon className="w-6 h-6 text-emerald-100" />
               </div>
               <h2 className="text-3xl font-black tracking-tight leading-none">Test Readiness Dashboard</h2>
            </div>
            <p className="text-slate-400 text-base font-medium leading-relaxed italic">
              "Kvalita nie je o chybách, ale o splnených sľuboch biznisu. Gherkin štruktúra (Given/When/Then) zabezpečuje, že technický tím presne chápe akceptačné hranice."
            </p>
            <div className="flex flex-wrap gap-8">
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">{Math.round((acList.filter(ac => ac.status === 'Passed').length / (acList.length || 1)) * 100)}%</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Test Pass Rate</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">{acList.length}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Scenarios</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">{acList.filter(ac => ac.status === 'Draft').length}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Draft Backlog</span>
               </div>
            </div>
         </div>
         <div className="relative z-10 flex flex-col gap-3 min-w-[250px]">
            <button className="w-full py-4 bg-emerald-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-600 active:scale-95 transition-all">Download QA Report</button>
            <button className="w-full py-4 bg-slate-800 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] border border-slate-700 hover:bg-slate-700 active:scale-95 transition-all">Bulk Approve Drafts</button>
         </div>
      </div>

    </div>
  );
}
