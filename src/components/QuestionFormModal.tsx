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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Upraviť otázku' : 'Nová otázka'}</h2>
            <p className="text-sm text-slate-500">Evidencia blokujúcich otázok a nejasností</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 shadow-sm">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: The Question */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Otázka <span className="text-red-500">*</span></label>
                <textarea required name="title" value={formData.title} onChange={handleChange} rows={3} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none font-medium" placeholder="Jasne formulovaná otázka..." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kontext a detaily</label>
                <textarea name="context" value={formData.context} onChange={handleChange} rows={4} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" placeholder="Prečo sa pýtame? Aké sú súvislosti?" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Priorita</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column: People & Links */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    Owner (BA)
                  </label>
                  <input name="owner" value={formData.owner} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    Kto má odpovedať?
                  </label>
                  <input name="respondent" value={formData.respondent} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Meno alebo rola..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Due Date (Kedy potrebujeme odpoveď?)
                </label>
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                  <Link2 className="w-4 h-4" />
                  Súvislosti
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Požiadavka</label>
                    <input name="relatedRequirementId" value={formData.relatedRequirementId} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" placeholder="REQ-001" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Jira Story</label>
                    <input name="relatedJiraKey" value={formData.relatedJiraKey} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" placeholder="LOG-123" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Súvisiace riziko</label>
                  <input name="relatedRiskId" value={formData.relatedRiskId} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" placeholder="RSK-001" />
                </div>
              </div>

              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
                <h3 className="text-xs font-bold text-blue-700 flex items-center gap-2 uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  Zdroj otázky
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <input name="sourceType" value={formData.sourceType} onChange={handleChange} className="w-full p-2 bg-white border border-blue-200 rounded-lg text-xs outline-none" placeholder="Typ (Sync, Mail...)" />
                  <input name="sourceUrl" value={formData.sourceUrl} onChange={handleChange} className="w-full p-2 bg-white border border-blue-200 rounded-lg text-xs outline-none" placeholder="Link..." />
                </div>
              </div>
            </div>

          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm">
            Zrušiť
          </button>
          <button onClick={handleSubmit} className="px-8 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2">
            <Save className="w-4 h-4" />
            Uložiť otázku
          </button>
        </div>
      </div>
    </div>
  );
}
