import React, { useState, useEffect } from 'react';
import { X, Save, Link2, Calendar, User, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import type { Decision, DecisionStatus } from '../types';
import { useProject } from '../context/ProjectContext';

interface DecisionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Decision;
}

const statusOptions: DecisionStatus[] = ["Draft", "Navrhnuté", "Potvrdené", "Zmenené", "Zastarané", "Zrušené"];

export function DecisionFormModal({ isOpen, onClose, initialData }: DecisionFormModalProps) {
  const { activeProject, addDecision, updateDecision } = useProject();
  const [formData, setFormData] = useState<Partial<Decision>>({
    title: '',
    date: '',
    context: '',
    decisionText: '',
    impact: '',
    owner: '',
    approvedBy: '',
    status: 'Draft',
    sourceType: '',
    sourceUrl: '',
    manualSourceText: '',
    relatedRequirementId: '',
    relatedJiraKey: '',
    reviewDeadline: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        context: '',
        decisionText: '',
        impact: '',
        owner: 'Peter (BA)',
        approvedBy: '',
        status: 'Draft',
        sourceType: 'Meeting',
        sourceUrl: '',
        manualSourceText: '',
        relatedRequirementId: '',
        relatedJiraKey: '',
        reviewDeadline: '',
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
      updateDecision(activeProject.id, initialData.id, formData);
    } else {
      const newItem: Decision = {
        ...(formData as Decision),
        id: `DEC-${Math.floor(100 + Math.random() * 900)}`,
        lastCheckedDate: new Date().toISOString().split('T')[0]
      };
      addDecision(activeProject.id, newItem);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Upraviť rozhodnutie' : 'Nové rozhodnutie'}</h2>
            <p className="text-sm text-slate-500">Evidencia kľúčových projektových rozhodnutí</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 shadow-sm">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Context & Decision */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Názov rozhodnutia <span className="text-red-500">*</span></label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kontext (Prečo?) <span className="text-red-500">*</span></label>
                <textarea required name="context" value={formData.context} onChange={handleChange} rows={3} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" placeholder="Popíšte pozadie a potrebu rozhodnutia..." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Rozhodnutie (Čo?) <span className="text-red-500">*</span></label>
                <textarea required name="decisionText" value={formData.decisionText} onChange={handleChange} rows={3} className="w-full p-2.5 bg-indigo-50/30 border border-indigo-100 rounded-xl outline-none resize-none font-medium" placeholder="Jasne formulované rozhodnutie..." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Dopad (Impact) <span className="text-red-500">*</span></label>
                <textarea required name="impact" value={formData.impact} onChange={handleChange} rows={3} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" placeholder="Aké sú následky tohto rozhodnutia?" />
              </div>
            </div>

            {/* Right Column: Metadata & Sources */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Dátum rozhodnutia</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    Owner
                  </label>
                  <input name="owner" value={formData.owner} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Schválil
                  </label>
                  <input name="approvedBy" value={formData.approvedBy} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-4">
                <h3 className="text-xs font-bold text-amber-700 flex items-center gap-2 uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  Zdroj a Kontext
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Typ zdroja</label>
                    <input name="sourceType" value={formData.sourceType} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" placeholder="Meeting, Mail..." />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Zdrojový Link</label>
                    <input name="sourceUrl" value={formData.sourceUrl} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" placeholder="https://..." />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Manuálne vložený zdrojový text</label>
                  <textarea name="manualSourceText" value={formData.manualSourceText} onChange={handleChange} rows={2} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-slate-400" />
                    Požiadavka
                  </label>
                  <input name="relatedRequirementId" value={formData.relatedRequirementId} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="REQ-001" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-slate-400" />
                    Jira Key
                  </label>
                  <input name="relatedJiraKey" value={formData.relatedJiraKey} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="LOG-123" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Review Deadline
                </label>
                <input type="date" name="reviewDeadline" value={formData.reviewDeadline} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
            </div>

          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm">
            Zrušiť
          </button>
          <button onClick={handleSubmit} className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2">
            <Save className="w-4 h-4" />
            Uložiť rozhodnutie
          </button>
        </div>
      </div>
    </div>
  );
}
