import { useState } from 'react';
import { 
  X, ExternalLink, Bot, MessageSquare, AlertTriangle, 
  Calendar, CheckCircle, HelpCircle, FileText, Send, 
  ArrowRight, Info, Copy
} from 'lucide-react';
import type { JiraItem } from '../types';

interface JiraDetailProps {
  item: JiraItem;
  onClose: () => void;
}

export function JiraDetail({ item, onClose }: JiraDetailProps) {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const simulateAI = (type: string) => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      if (type === 'summary') {
        setAiAnalysis({
          title: "AI Sumarizácia",
          content: `Tento Jira ticket (${item.key}) sa zameriava na ${item.title}. Z manuálne vloženého textu vyplýva, že ide o ${item.priority} prioritu s termínom do ${item.deadline}. Hlavným cieľom je zabezpečiť správnu funkčnosť a implementáciu požiadaviek v rámci aktuálneho projektu.`,
          type: 'summary'
        });
      } else if (type === 'acceptance') {
        setAiAnalysis({
          title: "Akceptačné kritériá (AI)",
          items: [
            `AC-1: Funkcionalita '${item.title}' musí byť plne otestovaná v UAT prostredí.`,
            `AC-2: Všetky prepojené systémy musia správne prijímať dáta z ${item.key}.`,
            `AC-3: Dokumentácia v Confluence musí byť aktualizovaná o zmeny z tohto ticketu.`,
            `AC-4: Používateľ musí dostať jasnú spätnú väzbu o výsledku akcie.`
          ],
          type: 'list'
        });
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-end">
      <div className="bg-white w-full max-w-6xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              item.type === 'Bug' ? 'bg-rose-100 text-rose-600' : 
              item.type === 'Epic' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
            }`}>
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.key}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  item.status === 'Done' ? 'bg-green-100 text-green-700' : 
                  item.status === 'Blocked' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>{item.status}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {item.url && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-sm font-bold transition-all border border-blue-100">
                <ExternalLink className="w-4 h-4" />
                Otvoriť v Jira
              </a>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 shadow-sm">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Panel: Manual Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar border-r border-slate-100">
            <div className="max-w-3xl mx-auto space-y-8">
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Priorita</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <AlertTriangle className={`w-4 h-4 ${item.priority === 'Kritická' ? 'text-red-500' : 'text-amber-500'}`} />
                    {item.priority}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Due Date</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {item.deadline}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Assignee</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white">
                      {item.assignee.charAt(0)}
                    </div>
                    {item.assignee}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Reporter</span>
                  <div className="text-sm font-bold text-slate-700">{item.reporter}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-tight">
                  <Info className="w-4 h-4 text-blue-500" />
                  Manuálne vložený text z Jira
                </h3>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative group">
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-lg border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy className="w-4 h-4 text-slate-400" />
                  </button>
                  <pre className="whitespace-pre-wrap font-sans text-slate-600 leading-relaxed text-sm">
                    {item.manualText}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Prepojená požiadavka</h4>
                  <div className="p-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold border border-blue-100">
                    {item.linkedRequirement || 'Neprepojené'}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Míľnik</h4>
                  <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-100">
                    {item.linkedMilestone || 'N/A'}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Tagy</h4>
                <div className="flex flex-wrap gap-2">
                  {item.tags.split(',').map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-full shadow-sm">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Panel: AI Analysis */}
          <div className="w-96 bg-slate-50 flex flex-col shrink-0 border-l border-slate-200">
            <div className="p-6 border-b border-slate-200 bg-white">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-600" />
                AI Workspace Intelligence
              </h3>
              <p className="text-xs text-slate-500 mt-1">Automatizovaná analýza ticketu</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => simulateAI('summary')} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><MessageSquare className="w-4 h-4" /></div>
                  <span className="text-xs font-bold text-slate-700">AI Summary</span>
                </button>
                <button onClick={() => simulateAI('acceptance')} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all text-left">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><CheckCircle className="w-4 h-4" /></div>
                  <span className="text-xs font-bold text-slate-700">Vygenerovať AC</span>
                </button>
                <button onClick={() => alert('Otázka vytvorená')} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-amber-300 hover:shadow-md transition-all text-left">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><HelpCircle className="w-4 h-4" /></div>
                  <span className="text-xs font-bold text-slate-700">Vytvoriť otázku</span>
                </button>
                <button onClick={() => alert('Riziko vytvorené')} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-rose-300 hover:shadow-md transition-all text-left">
                  <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><AlertTriangle className="w-4 h-4" /></div>
                  <span className="text-xs font-bold text-slate-700">Vytvoriť riziko</span>
                </button>
              </div>

              {/* AI Output Area */}
              <div className="mt-6">
                {isAnalyzing ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-sm font-bold text-slate-700">AI analyzuje ticket...</p>
                    <p className="text-xs text-slate-400 mt-1">Spracovávam manuálny text</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-blue-600 flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        {aiAnalysis.title}
                      </h4>
                      <button className="text-slate-400 hover:text-slate-600"><Copy className="w-3 h-3" /></button>
                    </div>
                    
                    {aiAnalysis.type === 'summary' ? (
                      <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-blue-200 pl-3">
                        {aiAnalysis.content}
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {aiAnalysis.items.map((it: string, idx: number) => (
                          <li key={idx} className="flex gap-2 text-[11px] text-slate-600 leading-snug">
                            <ArrowRight className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                            {it}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button className="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase">Exportovať</button>
                      <button className="text-[10px] font-bold text-blue-600 hover:underline uppercase">Vytvoriť follow-up</button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-600/5 p-6 rounded-2xl border border-blue-100 text-center">
                    <Bot className="w-8 h-8 text-blue-600 mx-auto mb-3 opacity-20" />
                    <p className="text-xs text-slate-500">Vyberte AI akciu vyššie pre analýzu tohto Jira ticketu.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-200">
              <div className="relative">
                <input type="text" placeholder="Opýtaj sa AI na tento ticket..." className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg"><Send className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
