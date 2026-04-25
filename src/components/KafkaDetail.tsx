import { useState } from 'react';
import { 
  X, ExternalLink, Bot, MessageSquare, AlertTriangle, 
  Calendar, FileText, Send, 
  ArrowRight, Copy, Network, Shield, Zap, GitBranch
} from 'lucide-react';
import type { DataFlow } from '../types';

interface KafkaDetailProps {
  flow: DataFlow;
  onClose: () => void;
}

export function KafkaDetail({ flow, onClose }: KafkaDetailProps) {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const simulateAI = (type: string) => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      if (type === 'summary') {
        setAiAnalysis({
          title: "AI Sumarizácia toku",
          content: `Dátový tok '${flow.name}' (${flow.type}) zabezpečuje prenos dát medzi '${flow.producer}' a '${flow.consumer}'. Hlavným payloadom sú dáta: ${flow.payloadSummary}. Kritickosť je nastavená na ${flow.criticality}.`,
          type: 'summary'
        });
      } else if (type === 'dependencies') {
        setAiAnalysis({
          title: "Extrahované závislosti (AI)",
          items: [
            `Upstream: ${flow.producer} (Zdroj dát)`,
            `Downstream: ${flow.consumer} (Konzumenti)`,
            `Dátový model: Závislosť na Avro schéme v Schema Registry`,
            `Infraštruktúra: Vyžaduje prístup k topicu '${flow.topicName}'`
          ],
          type: 'list'
        });
      } else if (type === 'risks') {
        setAiAnalysis({
          title: "Analýza rizík (AI)",
          items: [
            `Riziko 1: Výpadok producenta '${flow.producer}' zastaví spracovanie v reálnom čase.`,
            `Riziko 2: Nesúlad verzií schémy môže spôsobiť pád consumerov.`,
            `Riziko 3: Pomalá konzumácia (lag) môže spôsobiť stratu dát pri krátkom retention period.`
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
              flow.criticality === 'Kritická' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
            }`}>
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{flow.type}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  flow.criticality === 'Kritická' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                }`}>{flow.criticality}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{flow.name}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {flow.docUrl && (
              <a href={flow.docUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all border border-slate-200">
                <ExternalLink className="w-4 h-4" />
                Dokumentácia
              </a>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 shadow-sm">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Panel: Info */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar border-r border-slate-100 bg-slate-50/30">
            <div className="max-w-4xl mx-auto space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Data Owner</span>
                  <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    {flow.dataOwner}
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Topic / API</span>
                  <div className="text-sm font-mono font-bold text-slate-600 truncate bg-slate-50 px-2 py-1 rounded">
                    {flow.topicName}
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Validation Deadline</span>
                  <div className="text-sm font-bold text-red-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {flow.validationDeadline}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-tight">
                      <Network className="w-4 h-4 text-indigo-500" />
                      Dátový tok a závislosti
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Producent</span>
                        <p className="text-sm font-bold text-slate-700">{flow.producer}</p>
                      </div>
                      <div className="flex justify-center py-1">
                        <ArrowRight className="w-4 h-4 text-slate-300 rotate-90" />
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Consumer</span>
                        <p className="text-sm font-bold text-slate-700">{flow.consumer}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Payload Summary</h4>
                    <div className="p-3 bg-slate-900 text-blue-400 rounded-lg font-mono text-[11px] leading-relaxed">
                      {flow.payloadSummary}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-tight">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Manuálna dokumentácia
                    </h3>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative group max-h-[400px] overflow-y-auto custom-scrollbar">
                      <button className="absolute top-4 right-4 p-2 bg-slate-50 rounded-lg border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy className="w-4 h-4 text-slate-400" />
                      </button>
                      <pre className="whitespace-pre-wrap font-sans text-slate-600 leading-relaxed text-sm">
                        {flow.manualText}
                      </pre>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Požiadavka</span>
                      <p className="text-sm font-bold text-blue-600">{flow.linkedRequirements}</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Jira Ticket</span>
                      <p className="text-sm font-bold text-blue-600">{flow.linkedJira}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Panel: AI Analysis */}
          <div className="w-96 bg-slate-50 flex flex-col shrink-0 border-l border-slate-200">
            <div className="p-6 border-b border-slate-200 bg-white">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-600" />
                Data Flow Intelligence
              </h3>
              <p className="text-xs text-slate-500 mt-1">AI analýza dátového toku</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => simulateAI('summary')} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><MessageSquare className="w-4 h-4" /></div>
                  <span className="text-xs font-bold text-slate-700">AI Summary</span>
                </button>
                <button onClick={() => simulateAI('dependencies')} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-left">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><GitBranch className="w-4 h-4" /></div>
                  <span className="text-xs font-bold text-slate-700">Extrahovať závislosti</span>
                </button>
                <button onClick={() => simulateAI('risks')} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-rose-300 hover:shadow-md transition-all text-left">
                  <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><AlertTriangle className="w-4 h-4" /></div>
                  <span className="text-xs font-bold text-slate-700">Extrahovať riziká</span>
                </button>
                <button onClick={() => alert('Deadline vytvorený')} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-amber-300 hover:shadow-md transition-all text-left">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Calendar className="w-4 h-4" /></div>
                  <span className="text-xs font-bold text-slate-700">Vytvoriť deadline</span>
                </button>
              </div>

              {/* AI Output Area */}
              <div className="mt-6">
                {isAnalyzing ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-sm font-bold text-slate-700">AI analyzuje tok...</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in zoom-in duration-300">
                    <h4 className="text-sm font-bold text-blue-600 flex items-center gap-2 mb-4">
                      <Bot className="w-4 h-4" />
                      {aiAnalysis.title}
                    </h4>
                    
                    {aiAnalysis.type === 'summary' ? (
                      <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-blue-200 pl-3">
                        {aiAnalysis.content}
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {aiAnalysis.items.map((it: string, idx: number) => (
                          <li key={idx} className="flex gap-2 text-[11px] text-slate-600 leading-snug">
                            <ArrowRight className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                            {it}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className="bg-blue-600/5 p-6 rounded-2xl border border-blue-100 text-center">
                    <Bot className="w-8 h-8 text-blue-600 mx-auto mb-3 opacity-20" />
                    <p className="text-xs text-slate-500">Použite AI nástroje vyššie na analýzu dokumentácie tohto toku.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-200">
              <div className="relative">
                <input type="text" placeholder="Opýtaj sa na dátový model..." className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg"><Send className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
