import { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Zap, Save, 
  AlertTriangle, Gavel, 
  Share2, Download, List,
  ChevronRight, ArrowRight,
  ShieldCheck, LayoutDashboard, TerminalSquare,
  Sparkles, History, Kanban, Settings, Trash2
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

type AgentMode = 
  | 'Project Summary' | 'Requirements' | 'Decision' | 'Open Questions' 
  | 'Risk' | 'Deadline' | 'Jira Draft' | 'Confluence Draft' 
  | 'Meeting Notes' | 'SQL' | 'Traceability' | 'BA Quality' | 'Export';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: AgentMode;
  analysis?: AgentResponse;
}

interface AgentResponse {
  shortAnswer: string;
  details: string;
  nextSteps: string[];
  sources: { type: string; title: string; id?: string }[];
  suggestedEntities: { type: string; title: string; content?: string }[];
  actions: string[];
}

export function AIAgentView() {
  const { activeProject } = useProject();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Ahoj! Ja som BA Project Intelligence Agent. Pracujem výhradne s dátami, ktoré si vložil do tohto projektu. Ako ti môžem dnes pomôcť?',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [activeMode, setActiveMode] = useState<AgentMode>('Project Summary');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!activeProject) return null;

  const suggestedActions = [
    "Zhrň aktuálny stav projektu",
    "Nájdi hlavné riziká",
    "Nájdi otvorené otázky",
    "Vygeneruj Jira-ready tasky",
    "Vygeneruj acceptance criteria",
    "Vygeneruj SQL dotaz",
    "Sprav BA Quality Check",
    "Priprav status report"
  ];

  const handleAction = (action: string) => {
    setInputText(action);
    handleSend(action);
  };

  const handleSend = (text: string = inputText) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      mode: activeMode
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate Agent Logic
    setTimeout(() => {
      const response = simulateResponse(text, activeMode, activeProject);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.shortAnswer,
        analysis: response
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const simulateResponse = (query: string, mode: AgentMode, project: any): AgentResponse => {
    const q = query.toLowerCase();
    
    // Default generic response structure
    let res: AgentResponse = {
      shortAnswer: "Na základe dostupných lokálnych dát v projekte som pripravil analýzu.",
      details: "Analyzoval som všetky manuálne vložené požiadavky, riziká a rozhodnutia.",
      nextSteps: ["Doplniť chýbajúcich ownerov", "Aktualizovať statusy v Jira registri"],
      sources: [{ type: "Projekt", title: project.name }],
      suggestedEntities: [],
      actions: ["Exportovať do Markdown", "Vytvoriť follow-up otázku"]
    };

    if (q.includes('stav') || q.includes('summary') || mode === 'Project Summary') {
      res.shortAnswer = `Projekt ${project.name} je aktuálne v stave ${project.status} s celkovým progresom ${project.metrics.progress}%.`;
      res.details = `Máme evidovaných ${project.requirements.length} požiadaviek a ${project.risks.length} rizík. Najbližší deadline je ${project.metrics.nearestDeadline}.`;
      res.nextSteps = ["Vyriešiť blokujúce riziká", "Uzavrieť otvorené otázky do konca týždňa"];
      res.suggestedEntities = [{ type: "Status report", title: `Report k dátumu ${new Date().toLocaleDateString()}` }];
    } else if (q.includes('rizik') || mode === 'Risk') {
      res.shortAnswer = `Identifikoval som ${project.risks.length} rizík, z ktorých ${project.risks.filter((r:any) => r.severity === 'Vysoká' || r.severity === 'Kritická').length} sú vysoko kritické.`;
      res.details = `Najväčším rizikom je '${project.risks[0]?.title || 'technická závislosť'}'.`;
      res.sources = project.risks.map((r:any) => ({ type: "Risk", title: r.title, id: r.id }));
      res.suggestedEntities = [{ type: "Riziko", title: "Nové odvodené riziko", content: "Možný dopad na časový plán kvôli meškaniu mitigácie." }];
    } else if (q.includes('jira') || mode === 'Jira Draft') {
      res.shortAnswer = "Pripravil som drafty Jira taskov na základe tvojich požiadaviek.";
      res.details = "Tasky zahŕňajú technické špecifikácie a navrhované AC.";
      res.suggestedEntities = [
        { type: "Jira task", title: "IMPLEMENT-01: Login Flow", content: "Story: Ako vodič sa chcem prihlásiť..." },
        { type: "Jira task", title: "LOG-02: GPS tracking service", content: "Task: Implementácia background servisu..." }
      ];
    } else if (q.includes('sql') || mode === 'SQL') {
      res.shortAnswer = "Navrhnutý SQL dotaz pre analýzu logistických dát.";
      res.details = "Dotaz spája tabuľku doručení s tabuľkou chýb GPS signálu.";
      res.suggestedEntities = [{ type: "SQL query", title: "GPS Accuracy Analysis", content: "SELECT d.id, g.error_margin FROM deliveries d JOIN gps_logs g ON d.id = g.delivery_id WHERE g.accuracy > 50;" }];
    } else if (q.includes('quality') || mode === 'BA Quality') {
      res.shortAnswer = "BA Quality Check dokončený. Skóre: 85/100.";
      res.details = "3 požiadavky nemajú AC, 2 riziká nemajú mitigation deadline.";
      res.nextSteps = ["Doplniť AC k REQ-001", "Pridať deadline k RSK-002"];
    }

    return res;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-indigo-100 shadow-xl animate-pulse-slow">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">BA Project Intelligence Agent</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active & Working on Local Data</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button className="px-3 py-1.5 bg-white text-indigo-600 text-[10px] font-black uppercase rounded-lg shadow-sm">Current Chat</button>
            <button className="px-3 py-1.5 text-slate-500 text-[10px] font-black uppercase rounded-lg hover:text-slate-700">History</button>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar: Modes & Tools */}
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col p-6 space-y-6 overflow-y-auto custom-scrollbar shadow-inner">
           <div>
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Agent Modes</h3>
             <div className="space-y-1">
               {[
                 { mode: 'Project Summary', icon: LayoutDashboard },
                 { mode: 'Requirements', icon: List },
                 { mode: 'Decision', icon: Gavel },
                 { mode: 'Risk', icon: AlertTriangle },
                 { mode: 'Jira Draft', icon: Kanban },
                 { mode: 'SQL', icon: TerminalSquare },
                 { mode: 'BA Quality', icon: ShieldCheck }
               ].map((m: any) => (
                 <button 
                   key={m.mode}
                   onClick={() => setActiveMode(m.mode)}
                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeMode === m.mode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 translate-x-1' : 'text-slate-600 hover:bg-slate-50'}`}
                 >
                   <m.icon className={`w-4 h-4 ${activeMode === m.mode ? 'text-white' : 'text-slate-400'}`} />
                   {m.mode}
                 </button>
               ))}
             </div>
           </div>

           <div className="pt-6 border-t border-slate-100">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Suggested Actions</h3>
             <div className="flex flex-wrap gap-2">
               {suggestedActions.map(action => (
                 <button 
                    key={action}
                    onClick={() => handleAction(action)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-white hover:border-indigo-300 transition-all hover:shadow-sm"
                 >
                   {action}
                 </button>
               ))}
             </div>
           </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50 relative">
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${m.role === 'user' ? 'bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none shadow-xl' : 'w-full space-y-6'}`}>
                  {m.role === 'user' ? (
                    <p className="text-sm font-medium">{m.content}</p>
                  ) : (
                    <div className="space-y-6">
                      {/* AI Header */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Bot className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Project Agent Analysis</span>
                      </div>

                      {/* Main Card */}
                      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 space-y-8">
                          {/* Short Answer */}
                          <div>
                            <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Sparkles className="w-3 h-3" /> Krátka odpoveď
                            </h4>
                            <p className="text-xl font-black text-slate-900 leading-tight">{m.analysis?.shortAnswer || m.content}</p>
                          </div>

                          {m.analysis && (
                            <>
                              {/* Details */}
                              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Detailné zistenia</h4>
                                <p className="text-sm text-slate-600 leading-relaxed italic">{m.analysis.details}</p>
                              </div>

                              {/* Next Steps & Sources */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                  <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                    <ArrowRight className="w-3 h-3" /> Odporúčané kroky
                                  </h4>
                                  <div className="space-y-2">
                                    {m.analysis.nextSteps.map((step, i) => (
                                      <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 group cursor-pointer hover:bg-emerald-100 transition-all">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                        <span className="text-xs font-bold text-emerald-800">{step}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <History className="w-3 h-3" /> Súvisiace zdroje
                                  </h4>
                                  <div className="space-y-2">
                                    {m.analysis.sources.map((s, i) => (
                                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group cursor-pointer hover:border-indigo-300 transition-all">
                                        <div className="flex items-center gap-3">
                                          <div className="w-2 h-2 bg-slate-300 rounded-full group-hover:bg-indigo-500"></div>
                                          <span className="text-xs font-bold text-slate-700">{s.title}</span>
                                        </div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase">{s.type}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Suggested Entities */}
                              {m.analysis.suggestedEntities.length > 0 && (
                                <div className="pt-6 border-t border-slate-100">
                                   <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">Navrhnuté entity na uloženie</h4>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {m.analysis.suggestedEntities.map((e, i) => (
                                       <div key={i} className="p-4 bg-indigo-50 rounded-3xl border border-indigo-100 relative group overflow-hidden">
                                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                            <Zap className="w-12 h-12 text-indigo-600" />
                                          </div>
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tight">{e.type}</span>
                                            <button className="p-1 hover:bg-white rounded-lg transition-all text-indigo-400">
                                              <Save className="w-4 h-4" />
                                            </button>
                                          </div>
                                          <h5 className="text-sm font-black text-slate-900 mb-1">{e.title}</h5>
                                          {e.content && <p className="text-[10px] text-slate-500 font-mono line-clamp-2">{e.content}</p>}
                                       </div>
                                     ))}
                                   </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Footer Actions */}
                        {m.analysis && (
                          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                             <div className="flex gap-2">
                               {m.analysis.actions.map(action => (
                                 <button key={action} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-indigo-600 transition-all flex items-center gap-1.5">
                                   {action.includes('Export') ? <Download className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                   {action}
                                 </button>
                               ))}
                             </div>
                             <div className="flex gap-2">
                               <button className="p-2 text-slate-400 hover:text-slate-600"><Share2 className="w-4 h-4" /></button>
                               <button className="p-2 text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200">
                  <Bot className="w-4 h-4 text-indigo-600 animate-bounce" />
                  <span className="text-xs font-bold text-slate-400">Agent analyzuje lokálne dáta...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-8 bg-white border-t border-slate-200 shadow-2xl z-20">
            <div className="max-w-4xl mx-auto flex items-end gap-4 relative">
              <div className="flex-1 relative group">
                <div className="absolute -top-10 left-0 flex gap-2">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[9px] font-black uppercase rounded border border-indigo-200">Mode: {activeMode}</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded border border-slate-200">Context: {activeProject.name}</span>
                </div>
                <textarea 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder="Zadajte otázku k projektu..."
                  className="w-full p-4 pr-16 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none shadow-inner"
                  rows={2}
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!inputText.trim() || isTyping}
                  className={`absolute right-3 bottom-3 p-3 rounded-full shadow-lg transition-all active:scale-95 ${!inputText.trim() || isTyping ? 'bg-slate-100 text-slate-300' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'}`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-tighter">
              AI Project Agent pracuje výhradne s manuálne vloženými textami a lokálnymi mock dátami projektu.
            </p>
          </div>

        </div>

      </div>
      
    </div>
  );
}
