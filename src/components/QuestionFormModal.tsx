import React, { useState, useEffect } from 'react';
import { X, Save, Link2, Calendar, User, FileText } from 'lucide-react';
import type { Question, QuestionStatus, ProjectPriority } from '../types';
import { useProject } from '../context/ProjectContext';

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Question;
}

const statusOptions: QuestionStatus[] = ["Open", "Waiting for answer", "Answered", "Blocked", "Cancelled"];
const priorities: ProjectPriority[] = ["Nízka", "Stredná", "Vysoká", "Kritická"];

export function QuestionFormModal({ isOpen, onClose, initialData }: QuestionFormModalProps) {
  const { activeProject, addQuestion, updateQuestion } = useProject();
  const [formData, setFormData] = useState<Partial<Question>>({
    title: '',
    context: '',
    owner: '',
    respondent: '',
    priority: 'Stredná',
    status: 'Open',
    dueDate: '',
    sourceType: '',
    sourceUrl: '',
    manualSourceText: '',
    relatedRequirementId: '',
    relatedJiraKey: '',
    relatedRiskId: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        context: '',
        owner: 'Peter (BA)',
        respondent: '',
        priority: 'Stredná',
        status: 'Open',
        dueDate: '',
        sourceType: 'Meeting',
        sourceUrl: '',
        manualSourceText: '',
        relatedRequirementId: '',
        relatedJiraKey: '',
        relatedRiskId: '',
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    if (initialData) {
      updateQuestion(activeProject.id, initialData.id, formData);
    } else {
      const newItem: Question = {
        ...(formData as Question),
        id: `QST-${Math.floor(100 + Math.random() * 900)}`,
        lastFollowUpDate: new Date().toISOString().split('T')[0]
      };
      addQuestion(activeProject.id, newItem);
    }
    onClose();
  };

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300",
      isOpen ? "visible" : "invisible pointer-events-none"
    )}>
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )} 
        onClick={onClose} 
      />

      {/* Drawer / Modal */}
      <div className={cn(
        "bg-white w-full h-full lg:h-auto lg:max-h-[95vh] lg:max-w-4xl lg:rounded-[2.5rem] shadow-2xl flex flex-col relative transition-transform duration-500 transform overflow-hidden border border-slate-200",
        isOpen ? "translate-y-0" : "translate-y-full lg:translate-y-4 lg:scale-95 lg:opacity-0"
      )}>
        {/* Header */}
        <div className="p-6 md:p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">{initialData ? 'Upraviť otázku' : 'Nová otázka'}</h2>
            <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Evidencia blokujúcich nejasností</p>
          </div>
          <button onClick={onClose} className="p-3 md:p-4 bg-white hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-sm text-slate-400">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <form id="question-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Otázka *</label>
                <textarea required name="title" value={formData.title} onChange={handleChange} rows={3} className="w-full p-5 bg-amber-50/30 border border-amber-100 rounded-[2rem] outline-none resize-none text-[11px] md:text-sm font-black shadow-inner leading-relaxed focus:ring-2 focus:ring-amber-500 transition-all" placeholder="Jasne formulovaná otázka..." />
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Kontext a detaily</label>
                <textarea name="context" value={formData.context} onChange={handleChange} rows={4} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none text-[11px] md:text-sm font-medium shadow-inner" placeholder="Aké sú súvislosti?" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Priorita</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-black appearance-none">
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-black appearance-none">
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <User className="w-3 h-3 text-slate-400" />
                    Owner (BA)
                  </label>
                  <input name="owner" value={formData.owner} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold shadow-inner" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <User className="w-3 h-3 text-blue-500" />
                    Kto má odpovedať?
                  </label>
                  <input name="respondent" value={formData.respondent} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold shadow-inner" placeholder="Meno..." />
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Due Date
                </label>
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold shadow-inner" />
              </div>

              <div className="p-5 md:p-6 bg-slate-50/50 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <Link2 className="w-4 h-4" />
                  Súvislosti
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input name="relatedRequirementId" value={formData.relatedRequirementId} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none" placeholder="REQ ID" />
                  <input name="relatedJiraKey" value={formData.relatedJiraKey} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none" placeholder="Jira Key" />
                </div>
                <input name="relatedRiskId" value={formData.relatedRiskId} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none" placeholder="Súvisiace riziko ID" />
              </div>

              <div className="p-5 md:p-6 bg-blue-50/30 rounded-3xl border border-blue-100 space-y-3 shadow-sm">
                <h3 className="text-[10px] font-black text-blue-700 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <FileText className="w-4 h-4" />
                  Zdroj otázky
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input name="sourceType" value={formData.sourceType} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-100 rounded-lg text-[11px] font-bold outline-none" placeholder="Typ zdroja" />
                  <input name="sourceUrl" value={formData.sourceUrl} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-blue-100 rounded-lg text-[11px] font-bold outline-none" placeholder="Link..." />
                </div>
              </div>
            </div>

          </div>
        </form>

        {/* Footer */}
        <div className="p-6 md:p-10 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-end gap-3 md:gap-4 shrink-0">
          <button onClick={onClose} className="w-full sm:w-auto px-8 py-4 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all">
            Zrušiť
          </button>
          <button type="submit" form="question-form" className="w-full sm:w-auto px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-amber-100 flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            Uložiť otázku
          </button>
        </div>
      </div>
    </div>
  );
}
