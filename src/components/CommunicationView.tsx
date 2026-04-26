import { useState } from 'react';
import { 
  MessageSquare, Zap, Save, FileText, 
  Trash2, Calendar, 
  ArrowRight, CheckCircle2, AlertTriangle, 
  HelpCircle, Clock, PlusCircle
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import type { Communication, CommunicationType, CommunicationAnalysis } from '../types';

export function CommunicationView() {
  const { activeProject, addCommunication, deleteCommunication } = useProject();
  const { currentUser } = useAuth();
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CommunicationType>('Teams chat');
  const [participants, setParticipants] = useState('');
  const [analysis, setAnalysis] = useState<CommunicationAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeCommId, setActiveCommId] = useState<string | null>(null);

  if (!activeProject) return null;

  const communications = activeProject.communications || [];

  const handleAnalyze = () => {
    if (!inputText) return;
    setIsAnalyzing(true);
    
    // Simulate AI Analysis
    setTimeout(() => {
      const mockAnalysis: CommunicationAnalysis = {
        shortSummary: "Potvrdenie architektúry a rozsahu integrácie v rámci projektu.",
        detailedSummary: "Z komunikácie vyplýva, že systém bude slúžiť primárne ako podporný nástroj pre používateľov, zatiaľ čo jadro logistiky zostáva v centrálnych komponentoch. Integrácia bude zastrešená jednotným prístupom.",
        decisions: [
          "Systém bude mať rolu podpornej aplikácie",
          "Základná logika procesov sa nemení",
          "Integrácia prebehne cez jednotné prihlásenie"
        ],
        requirements: [
          "Jednotný login pre nové moduly",
          "Samostatný proces pre vybrané flowy"
        ],
        questions: [
          "Presná frekvencia aktualizácie dát",
          "Spôsob autorizácie v offline režime"
        ],
        risks: [
          "Závislosť na legacy API komponentoch",
          "Možné konflikty v notifikáciách"
        ],
        actionSteps: [
          "Navrhnúť UI pre jednotný login",
          "Stretnutie s tímom k pravidlám trackingu"
        ],
        suggestedJiraTasks: [
          "PROJ-101: Unified Login Design",
          "PROJ-102: Rules specification"
        ],
        suggestedDeadlines: [
          { title: "Review flowov", date: "2026-04-30" }
        ],
        stakeholders: ["Katka (PO)", "Marek (Tech Lead)", "Peter (BA)"]
      };
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSave = () => {
    if (!title || !inputText || !analysis) return;

    const newComm: Communication = {
      ownerUserId: currentUser?.id || 'peter',
      createdByUserId: currentUser?.id || 'peter',
      id: `COM-${Math.floor(100 + Math.random() * 900)}`,
      title,
      type,
      date: new Date().toISOString().split('T')[0],
      participants,
      manualText: inputText,
      relatedProjectId: activeProject.id,
      tags: 'extracted',
      analysis
    };

    addCommunication(activeProject.id, newComm);
    // Reset form
    setTitle('');
    setInputText('');
    setParticipants('');
    setAnalysis(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-indigo-100 shadow-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
            Komunikácia
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium italic">Zachytenie a AI analýza stakeholder komunikácie</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        
        {/* Left: Input & Analysis Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          
          {/* New Input Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-indigo-500">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Nová komunikácia</h2>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Názov konverzácie</label>
                  <input 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="napr. Teams: Scope projektu"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Typ zdroja</label>
                  <select 
                    value={type}
                    onChange={e => setType(e.target.value as CommunicationType)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                  >
                    <option value="Teams chat">Teams chat</option>
                    <option value="Email">Email</option>
                    <option value="Stakeholder note">Stakeholder note</option>
                    <option value="Meeting chat">Meeting chat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Účastníci</label>
                <input 
                  value={participants}
                  onChange={e => setParticipants(e.target.value)}
                  placeholder="Peter, Katka, Marek..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Text komunikácie (Paste here)</label>
                <textarea 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  rows={8}
                  placeholder="Skopírujte text z Teams alebo Emailu..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  onClick={handleAnalyze}
                  disabled={!inputText || isAnalyzing}
                  className={`px-8 py-3 rounded-2xl text-sm font-bold shadow-lg transition-all flex items-center gap-2 ${isAnalyzing ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'}`}
                >
                  {isAnalyzing ? <Clock className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  Analyzovať text
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-indigo-400" />
                  <h3 className="text-xl font-bold">AI Analýza komunikácie</h3>
                </div>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Uložiť výsledok
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3">Krátke zhrnutie</h4>
                    <p className="text-lg font-bold text-white leading-snug">{analysis.shortSummary}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3">Detailné summary</h4>
                    <p className="text-sm text-slate-300 leading-relaxed italic">{analysis.detailedSummary}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" /> Rozhodnutia
                      </h4>
                      <ul className="space-y-2">
                        {analysis.decisions.map((d, i) => <li key={i} className="text-xs text-slate-300 flex items-start gap-2"><ArrowRight className="w-3 h-3 mt-0.5 shrink-0" /> {d}</li>)}
                      </ul>
                      <button className="mt-4 text-[10px] font-black text-emerald-400 uppercase hover:underline">Uložiť ako rozhodnutie</button>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <FileText className="w-3 h-3" /> Požiadavky
                      </h4>
                      <ul className="space-y-2">
                        {analysis.requirements.map((r, i) => <li key={i} className="text-xs text-slate-300 flex items-start gap-2"><ArrowRight className="w-3 h-3 mt-0.5 shrink-0" /> {r}</li>)}
                      </ul>
                      <button className="mt-4 text-[10px] font-black text-indigo-400 uppercase hover:underline">Uložiť ako požiadavku</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                   <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <HelpCircle className="w-3 h-3" /> Otázky
                      </h4>
                      <ul className="space-y-2">
                        {analysis.questions.map((q, i) => <li key={i} className="text-xs text-slate-300 flex items-start gap-2"><ArrowRight className="w-3 h-3 mt-0.5 shrink-0" /> {q}</li>)}
                      </ul>
                      <button className="mt-4 text-[10px] font-black text-amber-400 uppercase hover:underline">Uložiť ako otázku</button>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" /> Riziká
                      </h4>
                      <ul className="space-y-2">
                        {analysis.risks.map((r, i) => <li key={i} className="text-xs text-slate-300 flex items-start gap-2"><ArrowRight className="w-3 h-3 mt-0.5 shrink-0" /> {r}</li>)}
                      </ul>
                      <button className="mt-4 text-[10px] font-black text-rose-400 uppercase hover:underline">Uložiť ako riziko</button>
                    </div>
                  </div>

                  <div className="p-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Navrhnuté akcie</h4>
                    <div className="space-y-4">
                      {analysis.actionSteps.map((step, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                          <span className="text-xs text-slate-200">{step}</span>
                          <button className="p-1 hover:bg-white/10 rounded-lg text-indigo-400 transition-all">
                            <PlusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="mt-6 w-full py-3 bg-indigo-500 rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all">Vygenerovať follow-up správu</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: History Sidebar */}
        <div className="w-[350px] bg-white border-l border-slate-200 flex flex-col shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">História analýz</h3>
            <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-black">{communications.length}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
            {communications.map(c => (
              <div 
                key={c.id}
                onClick={() => { setActiveCommId(c.id); setAnalysis(c.analysis || null); }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group ${activeCommId === c.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded ${c.type === 'Email' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {c.type}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); if (confirm('Zmazať?')) deleteCommunication(activeProject.id, c.id); }}
                    className="p-1 text-slate-300 hover:text-rose-500 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{c.title}</h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                  <Calendar className="w-3 h-3" /> {c.date}
                </div>
              </div>
            ))}

            {communications.length === 0 && (
              <div className="text-center py-12 px-6">
                <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-xs text-slate-400 font-bold">Zatiaľ žiadne uložené analýzy.</p>
              </div>
            )}
          </div>
        </div>

      </div>
      
    </div>
  );
}
