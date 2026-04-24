import { useState } from 'react';
import { ArrowLeft, ExternalLink, Bot, Loader2, FileText, CheckSquare, AlertTriangle, HelpCircle, Download, Calendar } from 'lucide-react';
import type { ConfluenceSource, AISummaryData } from '../types';

interface ConfluenceDetailProps {
  source: ConfluenceSource;
  onBack: () => void;
  onEdit: () => void;
}

export function ConfluenceDetail({ source, onBack, onEdit }: ConfluenceDetailProps) {
  const [activeAIView, setActiveAIView] = useState<'none' | 'summary' | 'requirements' | 'decisions' | 'risks' | 'questions'>('none');
  const [loading, setLoading] = useState(false);

  // Mocking AI processing delay
  const handleAIAction = (view: typeof activeAIView) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setActiveAIView(view);
    }, 1500); // 1.5s delay to feel like real AI processing
  };

  const aiData: AISummaryData = source.aiMockData || {
    shortSummary: "Pre tento dokument ešte neboli vygenerované AI dáta.",
    requirements: [], decisions: [], risks: [], questions: []
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 px-6 flex items-center justify-between shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{source.name}</h1>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className={`px-2 py-0.5 rounded-full font-medium ${source.status === 'Aktuálne' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                {source.status}
              </span>
              <span>Owner: {source.owner}</span>
              <span>Review: {source.reviewDeadline || 'Nenastavené'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => alert('Tu sa zobrazí datepicker pre nové review')} className="flex items-center gap-2 px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium">
            <Calendar className="w-4 h-4" />
            Vytvoriť review deadline
          </button>
          <a href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 rounded-lg text-sm font-medium">
            <ExternalLink className="w-4 h-4" />
            Otvoriť Confluence link
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Manual Text Reader */}
        <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white relative">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Manuálny obsah (Zdrojový text)
            </h2>
            <button onClick={onEdit} className="text-xs text-blue-600 hover:underline">Upraviť text</button>
          </div>
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 leading-relaxed max-w-full">
              {source.manualText || "Žiadny text nebol vložený."}
            </pre>
          </div>
        </div>

        {/* Right Column: AI Panel */}
        <div className="w-1/2 flex flex-col bg-slate-50">
          <div className="p-4 border-b border-slate-200 bg-white shrink-0">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-purple-600" />
              AI Analýza & Extrakcia
            </h2>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleAIAction('summary')} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${activeAIView === 'summary' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                AI Summary
              </button>
              <button onClick={() => handleAIAction('requirements')} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${activeAIView === 'requirements' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                Extrahovať požiadavky
              </button>
              <button onClick={() => handleAIAction('decisions')} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${activeAIView === 'decisions' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                Rozhodnutia
              </button>
              <button onClick={() => handleAIAction('risks')} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${activeAIView === 'risks' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                Riziká
              </button>
              <button onClick={() => handleAIAction('questions')} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${activeAIView === 'questions' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                Otvorené otázky
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-purple-600" />
                <p>AI spracováva dokument...</p>
              </div>
            ) : activeAIView === 'none' ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                <Bot className="w-12 h-12 mb-4 opacity-20" />
                <p>Vyberte si akciu z menu vyššie pre analyzovanie textu.</p>
                <p className="text-xs mt-2 max-w-xs">AI prečíta vložený text a vyextrahuje kľúčové informácie bez komunikácie s externým API.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800">
                    {activeAIView === 'summary' && 'AI Zhrnutie Dokumentu'}
                    {activeAIView === 'requirements' && 'Vyextrahované Požiadavky'}
                    {activeAIView === 'decisions' && 'Zaznamenané Rozhodnutia'}
                    {activeAIView === 'risks' && 'Identifikované Riziká'}
                    {activeAIView === 'questions' && 'Nezodpovedané Otázky'}
                  </h3>
                  <button className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded">
                    <Download className="w-3.5 h-3.5" /> Exportovať
                  </button>
                </div>

                {activeAIView === 'summary' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                      <h4 className="text-xs font-bold uppercase text-purple-800 mb-2">Short Summary</h4>
                      <p className="text-sm text-purple-900">{aiData.shortSummary}</p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                      <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Detailed Summary</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">{aiData.detailedSummary}</p>
                    </div>
                    
                    {aiData.actionSteps && aiData.actionSteps.length > 0 && (
                      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Odporúčané Akčné kroky</h4>
                        <ul className="space-y-2">
                          {aiData.actionSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                              <CheckSquare className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiData.jiraTasks && aiData.jiraTasks.length > 0 && (
                      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Návrh Jira Taskov</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {aiData.jiraTasks.map((task, idx) => (
                            <li key={idx} className="text-sm text-slate-700">{task}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeAIView === 'requirements' && (
                  <div className="space-y-3">
                    {aiData.requirements?.length ? aiData.requirements.map((req, idx) => (
                      <div key={idx} className="p-3 bg-white border border-blue-200 border-l-4 border-l-blue-500 rounded-r-lg shadow-sm text-sm text-slate-700">
                        {req}
                      </div>
                    )) : <p className="text-sm text-slate-500">Žiadne požiadavky neboli nájdené.</p>}
                  </div>
                )}

                {activeAIView === 'decisions' && (
                  <div className="space-y-3">
                    {aiData.decisions?.length ? aiData.decisions.map((dec, idx) => (
                      <div key={idx} className="p-3 bg-white border border-green-200 border-l-4 border-l-green-500 rounded-r-lg shadow-sm text-sm text-slate-700">
                        {dec}
                      </div>
                    )) : <p className="text-sm text-slate-500">Žiadne rozhodnutia neboli nájdené.</p>}
                  </div>
                )}

                {activeAIView === 'risks' && (
                  <div className="space-y-3">
                    {aiData.risks?.length ? aiData.risks.map((risk, idx) => (
                      <div key={idx} className="p-3 bg-white border border-red-200 border-l-4 border-l-red-500 rounded-r-lg shadow-sm flex gap-3 text-sm text-slate-700 items-start">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                        {risk}
                      </div>
                    )) : <p className="text-sm text-slate-500">Žiadne riziká neboli identifikované.</p>}
                  </div>
                )}

                {activeAIView === 'questions' && (
                  <div className="space-y-3">
                    {aiData.questions?.length ? aiData.questions.map((q, idx) => (
                      <div key={idx} className="p-3 bg-white border border-amber-200 border-l-4 border-l-amber-500 rounded-r-lg shadow-sm flex gap-3 text-sm text-slate-700 items-start">
                        <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
                        {q}
                      </div>
                    )) : <p className="text-sm text-slate-500">Žiadne otvorené otázky.</p>}
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
