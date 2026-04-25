import { useState, useMemo } from 'react';
import { 
  AlertTriangle, AlertCircle, 
  Zap, RefreshCcw,
  CheckCircle2, ArrowRight, ShieldAlert,
  Calendar, Flag, FileDown, Search
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { performQualityCheck } from '../lib/qualityUtils';
import type { QualityIssue } from '../lib/qualityUtils';
import { cn } from '../lib/utils';

export function QualityCheckView() {
  const { activeProject } = useProject();
  const [isScanning, setIsScanning] = useState(false);
  const [filter, setFilter] = useState<QualityIssue['category'] | 'All'>('All');

  const report = useMemo(() => {
    if (!activeProject) return null;
    return performQualityCheck(activeProject);
  }, [activeProject]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1500);
  };

  if (!activeProject || !report) return null;

  const filteredIssues = filter === 'All' ? report.issues : report.issues.filter(i => i.category === filter);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">BA Quality Check</h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl text-lg">
            Inteligentná kontrola analytických výstupov, dátových tokov a bezpečnosti SQL.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCcw className={cn("w-5 h-5", isScanning && "animate-spin")} />
            {isScanning ? 'Skenujem...' : 'Spustiť Quality Check'}
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
            <FileDown className="w-5 h-5" /> Export Report
          </button>
        </div>
      </div>

      {/* Score and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quality Score Circle */}
        <div className="lg:col-span-4">
           <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-200 flex flex-col items-center text-center relative overflow-hidden h-full justify-center">
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                 <div 
                   className={cn(
                     "h-full transition-all duration-1000 ease-out",
                     report.score > 80 ? "bg-emerald-500" : report.score > 50 ? "bg-amber-500" : "bg-rose-500"
                   )} 
                   style={{ width: `${report.score}%` }} 
                 />
              </div>
              
              <div className="relative mb-6">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={553}
                    strokeDashoffset={553 - (553 * report.score) / 100}
                    className={cn(
                      "transition-all duration-1000 ease-out",
                      report.score > 80 ? "text-emerald-500" : report.score > 50 ? "text-amber-500" : "text-rose-500"
                    )}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-5xl font-black text-slate-900">{report.score}%</span>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Quality Score</span>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900">
                {report.score > 80 ? 'Výborná Kvalita' : report.score > 50 ? 'Vyžaduje Pozornosť' : 'Kritický Stav'}
              </h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                {report.score > 80 
                  ? 'Váš projekt spĺňa väčšinu analytických štandardov. Pokračujte v skvelej práci.' 
                  : 'Našli sme niekoľko vážnych nedostatkov, ktoré môžu blokovať vývoj alebo QA.'}
              </p>
           </div>
        </div>

        {/* Categories Breakdown */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                 <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl">
                    <ShieldAlert className="w-6 h-6" />
                 </div>
                 <span className="px-3 py-1 bg-rose-100 text-rose-700 text-[10px] font-black rounded-lg">SECURITY RISK</span>
              </div>
              <div>
                 <p className="text-3xl font-black text-slate-900">{report.issues.filter(i => i.category === 'Security').length}</p>
                 <p className="text-xs font-bold text-slate-500 mt-1">Kritické bezpečnostné chyby v SQL alebo dokumentácii.</p>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                 <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
                    <AlertCircle className="w-6 h-6" />
                 </div>
                 <span className="px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-black rounded-lg">CRITICAL MISSING</span>
              </div>
              <div>
                 <p className="text-3xl font-black text-slate-900">{report.issues.filter(i => i.category === 'Critical').length}</p>
                 <p className="text-xs font-bold text-slate-500 mt-1">Chýbajúci owneri, AC alebo blokujúce otázky po deadline.</p>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                 <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                    <AlertTriangle className="w-6 h-6" />
                 </div>
                 <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-lg">PROCESS WARNING</span>
              </div>
              <div>
                 <p className="text-3xl font-black text-slate-900">{report.issues.filter(i => i.category === 'Warning').length}</p>
                 <p className="text-xs font-bold text-slate-500 mt-1">Chýbajúce termíny, linky na Jira alebo popisy SQL.</p>
              </div>
           </div>

           <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-center relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
                 <Zap className="w-32 h-32" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-2">AI Correction Assistant</h4>
              <p className="text-indigo-200 text-xs leading-relaxed mb-4">Môžem vám pomôcť automaticky doplniť chýbajúce popisy alebo vygenerovať AC z dokumentácie.</p>
              <button className="w-fit px-6 py-2 bg-white text-indigo-900 rounded-xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all">Launch AI Fix</button>
           </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                 <Search className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                 <h2 className="text-xl font-black text-slate-900">Zistené nedostatky</h2>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Celkovo {report.issues.length} nálezov</p>
              </div>
           </div>
           
           <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(['All', 'Security', 'Critical', 'Warning', 'Info'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap",
                    filter === cat ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                  )}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>

        <div className="divide-y divide-slate-50">
          {filteredIssues.length > 0 ? (
            filteredIssues.map(issue => (
              <div key={issue.id} className="p-8 hover:bg-slate-50 transition-all group flex flex-col md:flex-row gap-8">
                 <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                       <span className={cn(
                         "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                         issue.category === 'Security' ? "bg-rose-600 text-white border-rose-700" :
                         issue.category === 'Critical' ? "bg-orange-100 text-orange-700 border-orange-200" :
                         issue.category === 'Warning' ? "bg-amber-100 text-amber-700 border-amber-200" :
                         "bg-blue-100 text-blue-700 border-blue-200"
                       )}>
                         {issue.category}
                       </span>
                       <span className="text-slate-300">•</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{issue.entityType}: {issue.entityName}</span>
                    </div>
                    
                    <div>
                       <h4 className="text-lg font-black text-slate-900 mb-1">{issue.description}</h4>
                       <div className="flex items-start gap-2 text-sm text-indigo-600 font-bold">
                          <Zap className="w-4 h-4 mt-0.5" />
                          <span>Odporúčanie: {issue.recommendation}</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all">
                       <Flag className="w-3.5 h-3.5" /> Task
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all">
                       <Calendar className="w-3.5 h-3.5" /> Deadline
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                       Fix Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                 </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center">
               <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
               </div>
               <h3 className="text-xl font-black text-slate-900">Žiadne chyby v tejto kategórii</h3>
               <p className="text-slate-500 mt-2">Všetko vyzerá byť v poriadku podľa BA štandardov.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
