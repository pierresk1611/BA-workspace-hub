import { useState } from 'react';
import { 
  Share2, Copy, Download, Save, 
  Zap, Eye, 
  Code2, Layout, Network, ListTree,
  Activity, Clock, ShieldCheck,
  ArrowRight, CheckCircle2, Trash2
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { cn } from '../lib/utils';

type DiagramType = 
  | 'Process Flow' | 'System Context' | 'Frontend Wireflow' 
  | 'Requirement Traceability' | 'Stakeholder Map' | 'Decision Tree' 
  | 'Risk Dependency Map' | 'Timeline' | 'User Journey' | 'Data Flow';

export function MermaidView() {
  const { activeProject } = useProject();
  const [selectedType, setSelectedType] = useState<DiagramType>('Process Flow');
  const [mermaidCode, setMermaidCode] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  if (!activeProject) return null;

  const generateDiagram = () => {
    let code = "graph TD\n";
    
    if (selectedType === 'Frontend Wireflow' || selectedType === 'Process Flow') {
      code = `graph TD
    %% Styles
    classDef ui fill:#4f46e5,stroke:#312e81,color:#fff,stroke-width:2px;
    classDef alza fill:#0ea5e9,stroke:#075985,color:#fff,stroke-width:2px;
    classDef posila fill:#8b5cf6,stroke:#5b21b6,color:#fff,stroke-width:2px;
    classDef xl fill:#ec4899,stroke:#9d174d,color:#fff,stroke-width:2px;
    classDef customer fill:#10b981,stroke:#065f46,color:#fff,stroke-width:2px;
    classDef security fill:#f43f5e,stroke:#9f1239,color:#fff,stroke-width:2px;

    Start((Start)) --> Login[Login Page]:::ui
    Login --> Auth{2FA Check}:::security
    Auth -- OK --> OnlineCheck{Online Check}:::ui
    Auth -- Fail --> Login
    
    OnlineCheck -- Online --> ModeSelect[Režim: AlzaBox / Posila / XL]:::ui
    OnlineCheck -- Offline --> Fallback[Offline Fallback Režim]:::security
    
    ModeSelect --> AlzaBox[AlzaBox Helper Flow]:::alza
    ModeSelect --> Posila[Posila Flow - Voľná Trasa]:::posila
    ModeSelect --> XL[XL Integration Flow]:::xl
    
    AlzaBox --> GpsPing[GPS Ping Service]:::security
    Posila --> GpsPing
    XL --> GpsPing
    
    GpsPing --> Eta[Customer ETA Update]:::customer
    Eta --> End((Koniec))`;
    } else if (selectedType === 'Timeline') {
      code = `timeline
    title Projektový Harmonogram: ${activeProject.name}
    section Discovery
        Audit systémov : Discovery Milestone
        Stakeholder Alignment : Requirement
    section Analysis
        Solution Design : In Progress
        API Mapping : Data Flow
    section Future
        Development : Upcoming
        UAT : Testing`;
    } else if (selectedType === 'Requirement Traceability') {
      code = `graph LR
    subgraph Requirements
        ${activeProject.requirements.slice(0, 3).map(r => `R_${r.id}[${r.id}: ${r.title}]`).join('\n        ')}
    end
    subgraph Jira
        ${activeProject.requirements.slice(0, 3).map(r => `J_${r.id}[Jira: ${r.relatedJiraKey || 'TBD'}]`).join('\n        ')}
    end
    ${activeProject.requirements.slice(0, 3).map(r => `R_${r.id} --> J_${r.id}`).join('\n    ')}`;
    }

    setMermaidCode(code);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(mermaidCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mermaid Diagram Generátor</h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl text-lg">
            Vytvárajte vizuálne diagramy priamo z projektových dát pomocou syntaxe Mermaid.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Local Generator</p>
              <p className="text-xs font-bold text-slate-700">Mock Rendering Only</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Configuration Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-200">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Nastavenia diagramu</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Typ diagramu</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'Process Flow', icon: Activity },
                    { id: 'System Context', icon: Network },
                    { id: 'Frontend Wireflow', icon: Layout },
                    { id: 'Requirement Traceability', icon: ListTree },
                    { id: 'Timeline', icon: Clock }
                  ].map((type) => (
                    <button 
                      key={type.id}
                      onClick={() => setSelectedType(type.id as DiagramType)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                        selectedType === type.id ? "bg-indigo-600 text-white shadow-lg" : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <type.icon className={cn("w-4 h-4", selectedType === type.id ? "text-white" : "text-slate-400")} />
                      {type.id}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Zdrojové dáta</label>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-600">
                     <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Všetky požiadavky
                   </div>
                   <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-600">
                     <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Projektové míľniky
                   </div>
                </div>
              </div>

              <button 
                onClick={generateDiagram}
                className="w-full py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" /> Generovať Diagram
              </button>
            </div>
          </div>

          {activeProject.diagrams && activeProject.diagrams.length > 0 && (
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-200">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Uložené diagramy</h3>
              <div className="space-y-3">
                {activeProject.diagrams.map(d => (
                  <div key={d.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                       <Share2 className="w-4 h-4 text-indigo-500" />
                       <div>
                         <p className="text-xs font-black text-slate-900">{d.title}</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase">{d.type}</p>
                       </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Editor & Preview Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Code Editor */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[350px]">
             <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Code2 className="w-5 h-5 text-indigo-600" />
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Mermaid Editor</span>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                    onClick={copyCode}
                    className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                   >
                     {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                   </button>
                   <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
                     <Download className="w-4 h-4" />
                   </button>
                   <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                     <Save className="w-4 h-4" /> Uložiť
                   </button>
                </div>
             </div>
             <textarea 
               value={mermaidCode}
               onChange={(e) => setMermaidCode(e.target.value)}
               placeholder="Generujte diagram alebo napíšte Mermaid kód..."
               className="flex-1 p-8 font-mono text-sm bg-slate-900 text-indigo-300 outline-none resize-none custom-scrollbar"
             />
          </div>

          {/* Visual Preview (Simulated) */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[400px]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
              <Eye className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Visual Preview (Simulated)</span>
            </div>
            <div className="flex-1 bg-slate-50 p-8 flex items-center justify-center relative overflow-hidden">
               {mermaidCode ? (
                 <div className="space-y-8 w-full max-w-2xl animate-in fade-in zoom-in duration-500">
                    <div className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-lg relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5">
                         <Zap className="w-24 h-24" />
                       </div>
                       <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">MOCK RENDERING ENGINE</h4>
                       <div className="flex flex-col items-center gap-6">
                          <div className="flex items-center gap-3">
                             <div className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Start</div>
                             <ArrowRight className="w-4 h-4 text-slate-300" />
                             <div className="px-4 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold border border-slate-200">Login Page</div>
                             <ArrowRight className="w-4 h-4 text-slate-300" />
                             <div className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold">2FA Check</div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-1 h-8 bg-slate-200 rounded-full"></div>
                          </div>
                          <div className="grid grid-cols-3 gap-8 w-full">
                             <div className="p-4 bg-sky-500 text-white rounded-2xl text-center text-[10px] font-black">ALZABOX FLOW</div>
                             <div className="p-4 bg-violet-500 text-white rounded-2xl text-center text-[10px] font-black">POSILA FLOW</div>
                             <div className="p-4 bg-pink-500 text-white rounded-2xl text-center text-[10px] font-black">XL INTEGRATION</div>
                          </div>
                       </div>
                    </div>
                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase italic">
                      Skutočné renderovanie Mermaid diagramu vyžaduje externú knižnicu. Toto je vizuálna simulácia logiky diagramu.
                    </p>
                 </div>
               ) : (
                 <div className="text-center">
                   <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-100">
                     <Eye className="w-10 h-10 text-slate-200" />
                   </div>
                   <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Náhľad nie je k dispozícii</p>
                 </div>
               )}
            </div>
          </div>

        </div>

      </div>
      
    </div>
  );
}
