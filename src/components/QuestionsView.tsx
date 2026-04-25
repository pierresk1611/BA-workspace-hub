import { useState } from 'react';
import { 
  HelpCircle, Search, Filter, Plus, Edit, Trash2, 
  Clock, AlertTriangle, MessageSquare, Link2, ExternalLink,
  ChevronRight, Calendar, Info, Send,
  CheckCircle2, Download, ArrowRight, User
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { QuestionFormModal } from './QuestionFormModal';
import { StatusBadge, PriorityBadge, EmptyState } from './Badge';
import type { Question, QuestionStatus } from '../types';
import { cn } from '../lib/utils';

export function QuestionsView() {
  const { activeProject, deleteQuestion } = useProject();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  if (!activeProject) return null;

  const questions = activeProject.questions || [];

  const isOverdue = (date: string) => {
    if (!date) return false;
    return new Date(date) < new Date() && activeProject.questions.find(q => q.dueDate === date)?.status !== 'Answered';
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase()) || 
                          q.id.toLowerCase().includes(search.toLowerCase()) ||
                          q.respondent.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? q.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const priorityMap: Record<string, number> = { 'Kritická': 0, 'Vysoká': 1, 'Stredná': 2, 'Nízka': 3 };
    if (priorityMap[a.priority] !== priorityMap[b.priority]) {
      return priorityMap[a.priority] - priorityMap[b.priority];
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const activeQuestion = questions.find(q => q.id === activeQuestionId);

  const generateFollowUp = (q: Question) => {
    const message = `Ahoj ${q.respondent.split(' ')[0] || 'tím'},\n\nchcel by som ťa poprosiť o update k otázke: "${q.title}".\n\nTento bod je pre nás dôležitý kvôli ${q.context.substring(0, 50)}...\n\nTermín bol stanovený na ${q.dueDate}. Vopred vďaka za odpoveď!`;
    alert(`Vygenerovaná follow-up správa:\n\n${message}`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm z-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-xl shadow-amber-100">
               <HelpCircle className="w-8 h-8" />
            </div>
            Open Questions Registry
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">
            Centrálna evidencia nejasností a blokujúcich bodov analýzy pre {activeProject.name}.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setEditingQuestion(undefined); setIsFormOpen(true); }}
            className="px-8 py-4 bg-amber-500 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-100 hover:bg-amber-600 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Pridať Otázku
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Main List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Questions', val: questions.length, color: 'text-slate-900', bg: 'bg-white' },
              { label: 'Overdue / Blocked', val: questions.filter(q => isOverdue(q.dueDate) || q.status === 'Blocked').length, color: 'text-rose-600', bg: 'bg-rose-50' },
              { label: 'Waiting for answer', val: questions.filter(q => q.status === 'Waiting for answer').length, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Resolved', val: questions.filter(q => q.status === 'Answered').length, color: 'text-emerald-600', bg: 'bg-emerald-50' }
            ].map((s, i) => (
              <div key={i} className={cn("p-6 rounded-[2rem] border border-slate-200 shadow-sm", s.bg)}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <h3 className={cn("text-3xl font-black", s.color)}>{s.val}</h3>
              </div>
            ))}
          </div>

          {questions.length > 0 ? (
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/30">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Hľadať otázku, respondentov..." 
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {(['All', 'Open', 'Waiting for answer', 'Answered', 'Blocked'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status === 'All' ? '' : status)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap",
                          (statusFilter || 'All') === status ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/30 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Question & Respondent</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadline</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status & Priority</th>
                        <th className="px-8 py-5 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredQuestions.map(q => (
                        <tr 
                          key={q.id} 
                          onClick={() => setActiveQuestionId(q.id)}
                          className={cn(
                            "hover:bg-amber-50/30 transition-all cursor-pointer group",
                            activeQuestionId === q.id && "bg-amber-50/50",
                            isOverdue(q.dueDate) && "bg-rose-50/20"
                          )}
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-400 transition-all">
                                 {q.id.split('-')[1] || q.id.substring(0, 3)}
                               </div>
                               <div>
                                  <h4 className="text-sm font-black text-slate-900 leading-tight mb-1 group-hover:text-amber-600 transition-colors">{q.title}</h4>
                                  <div className="flex items-center gap-2">
                                     <User className="w-3 h-3 text-slate-400" />
                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{q.respondent}</span>
                                  </div>
                               </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className={cn(
                               "flex items-center gap-2 text-xs font-black",
                               isOverdue(q.dueDate) ? "text-rose-600" : "text-slate-600"
                             )}>
                                <Clock className="w-3.5 h-3.5" />
                                {q.dueDate}
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex flex-col gap-1.5 items-start">
                                <StatusBadge status={q.status} />
                                <PriorityBadge priority={q.priority} />
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <ChevronRight className={cn("w-6 h-6 transition-all", activeQuestionId === q.id ? "text-amber-600 translate-x-1" : "text-slate-300")} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          ) : (
            <EmptyState 
              icon={HelpCircle}
              title="Žiadne otázky"
              description="Tento projekt nemá aktuálne žiadne otvorené nejasnosti. Všetko je zatiaľ kryštálovo čisté."
              actionLabel="Položiť prvú otázku"
              onAction={() => setIsFormOpen(true)}
            />
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-[500px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-20 overflow-hidden glass">
          {activeQuestion ? (
            <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
               <div className="p-10 border-b border-slate-100 bg-slate-50/50 relative">
                   <div className="absolute top-10 right-10 flex gap-2">
                      <button 
                        onClick={() => { setEditingQuestion(activeQuestion); setIsFormOpen(true); }}
                        className="p-3 bg-white hover:bg-amber-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-amber-600 transition-all shadow-sm"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => { if (confirm('Zmazať otázku?')) deleteQuestion(activeProject.id, activeQuestion.id); }}
                        className="p-3 bg-white hover:bg-rose-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-rose-600 transition-all shadow-sm"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                   </div>
                   <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-4 py-1.5 rounded-full uppercase border border-amber-200 tracking-widest">{activeQuestion.id}</span>
                   </div>
                   <h2 className="text-3xl font-black text-slate-900 leading-tight mb-6 pr-20">{activeQuestion.title}</h2>
                   <div className="flex flex-wrap gap-3">
                     <StatusBadge status={activeQuestion.status} />
                     <PriorityBadge priority={activeQuestion.priority} />
                   </div>
               </div>

               <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       <Info className="w-3 h-3" /> Context & Detail
                    </h4>
                    <p className="text-base text-slate-600 leading-relaxed font-medium italic p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                      {activeQuestion.context || 'K tejto otázke nie je pridaný žiadny detailný kontext.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm text-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Owner (BA)</p>
                       <p className="text-sm font-black text-slate-900 truncate">{activeQuestion.owner}</p>
                    </div>
                    <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 shadow-sm text-center">
                       <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Respondent</p>
                       <p className="text-sm font-black text-indigo-900 truncate">{activeQuestion.respondent}</p>
                    </div>
                  </div>

                  <div className="p-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2.5rem] text-white shadow-2xl shadow-amber-100 relative overflow-hidden group">
                    <Clock className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                    <h4 className="text-[10px] font-black text-amber-100 uppercase tracking-[0.25em] mb-4">Target Resolution Date</h4>
                    <div className="flex items-end gap-3">
                       <p className="text-4xl font-black">{activeQuestion.dueDate || 'N/A'}</p>
                       {isOverdue(activeQuestion.dueDate) && (
                         <span className="mb-2 px-3 py-1 bg-rose-600 text-white text-[9px] font-black rounded-lg uppercase animate-pulse shadow-lg">OVERDUE</span>
                       )}
                    </div>
                  </div>

                  <div className="space-y-6 pt-4 border-t border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Traceability Map</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-indigo-50 transition-all">
                        <div className="flex items-center gap-4">
                           <Link2 className="w-5 h-5 text-indigo-500" />
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black text-slate-400 uppercase">Requirement Link</span>
                              <span className="text-sm font-black text-slate-900">{activeQuestion.relatedRequirementId || 'None Linked'}</span>
                           </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-rose-50 transition-all">
                        <div className="flex items-center gap-4">
                           <AlertTriangle className="w-5 h-5 text-rose-500" />
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black text-slate-400 uppercase">Risk Link</span>
                              <span className="text-sm font-black text-slate-900">{activeQuestion.relatedRiskId || 'No Risk Impact'}</span>
                           </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
               </div>

               <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                  <button onClick={() => generateFollowUp(activeQuestion)} className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 group">
                    <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Follow-up Message
                  </button>
                  <button className="p-5 bg-white hover:bg-emerald-50 text-emerald-600 rounded-[1.5rem] border border-slate-200 shadow-sm transition-all active:scale-95">
                    <CheckCircle2 className="w-6 h-6" />
                  </button>
               </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-16 space-y-8 animate-in fade-in duration-500">
              <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-slate-100 group">
                <HelpCircle className="w-16 h-16 text-slate-100 group-hover:text-amber-200 transition-colors duration-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Question Intelligence</h3>
                <p className="text-base text-slate-400 font-medium max-w-xs leading-relaxed italic">
                  Vyberte otázku pre zobrazenie kontextu, prepojení na požiadavky a histórie komunikácie.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      <QuestionFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={editingQuestion} 
      />
    </div>
  );
}
