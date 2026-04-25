import React, { useState, useEffect } from 'react';
import { X, Save, Bot, Link2, Calendar, User } from 'lucide-react';
import type { Requirement, RequirementType, RequirementStatus, ProjectPriority } from '../types';
import { useProject } from '../context/ProjectContext';

interface RequirementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Requirement;
}

const reqTypes: RequirementType[] = [
  "Business", "Functional", "Non-functional", "Data", "Security", "Process", "UX", "Reporting"
];

const reqStatuses: RequirementStatus[] = [
  "Draft", "Na potvrdenie", "Potvrdené", "Ready for refinement", "In development", "In testing", "Done", "Obsolete"
];

const priorities: ProjectPriority[] = ["Nízka", "Stredná", "Vysoká", "Kritická"];

export function RequirementFormModal({ isOpen, onClose, initialData }: RequirementFormModalProps) {
  const { activeProject, addRequirement, updateRequirement } = useProject();
  const [formData, setFormData] = useState<Partial<Requirement>>({
    title: '',
    description: '',
    type: 'Business',
    priority: 'Stredná',
    status: 'Draft',
    owner: '',
    source: '',
    sourceUrl: '',
    manualSourceText: '',
    relatedJiraKey: '',
    relatedMilestone: '',
    deadline: '',
    acceptanceCriteria: '',
    notes: '',
    reviewDate: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'Business',
        priority: 'Stredná',
        status: 'Draft',
        owner: 'Peter (BA)',
        source: '',
        sourceUrl: '',
        manualSourceText: '',
        relatedJiraKey: '',
        relatedMilestone: '',
        deadline: '',
        acceptanceCriteria: '',
        notes: '',
        reviewDate: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateAC = () => {
    const ac = `1. Požadovaná funkcia '${formData.title}' musí byť dostupná pre koncového používateľa.\n2. Vstupné dáta sú validované voči schéme.\n3. Systém spracuje požiadavku do 2 sekúnd.\n4. O úspešnom spracovaní je vytvorený audit log.`;
    setFormData(prev => ({ ...prev, acceptanceCriteria: ac }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    const now = new Date().toISOString().split('T')[0];

    if (initialData) {
      updateRequirement(activeProject.id, initialData.id, {
        ...formData,
        dateUpdated: now
      });
    } else {
      const newItem: Requirement = {
        ...(formData as Requirement),
        id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
        dateCreated: now,
        dateUpdated: now
      };
      addRequirement(activeProject.id, newItem);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Upraviť požiadavku' : 'Nová požiadavka'}</h2>
            <p className="text-sm text-slate-500">Definícia business a technických požiadaviek</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 shadow-sm">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left: Basic Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Názov požiadavky <span className="text-red-500">*</span></label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Popis</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Typ</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                    {reqTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                    {reqStatuses.map(s => <option key={s} value={s}>{s}</option>)}
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
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Priorita</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Deadline
                  </label>
                  <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Review Date</label>
                  <input type="date" name="reviewDate" value={formData.reviewDate} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
              </div>
            </div>

            {/* Right: Source & AC */}
            <div className="space-y-6">
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                <h3 className="text-xs font-bold text-blue-700 flex items-center gap-2 uppercase tracking-wider">
                  <Link2 className="w-4 h-4" />
                  Zdroj požiadavky
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Pôvod (Source)</label>
                    <input name="source" value={formData.source} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" placeholder="Confluence, Meeting..." />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Zdrojový Link</label>
                    <input name="sourceUrl" value={formData.sourceUrl} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" placeholder="https://..." />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Manuálne vložený zdrojový text</label>
                  <textarea name="manualSourceText" value={formData.manualSourceText} onChange={handleChange} rows={3} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-700">Acceptance Criteria</label>
                  <button type="button" onClick={generateAC} className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline uppercase tracking-wider">
                    <Bot className="w-3 h-3" />
                    AI Vygenerovať AC
                  </button>
                </div>
                <textarea name="acceptanceCriteria" value={formData.acceptanceCriteria} onChange={handleChange} rows={6} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-mono leading-relaxed" placeholder="1. ..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Jira Key</label>
                  <input name="relatedJiraKey" value={formData.relatedJiraKey} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="LOG-123" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Milestone</label>
                  <input name="relatedMilestone" value={formData.relatedMilestone} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="M1 - MVP" />
                </div>
              </div>
            </div>

          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm">
            Zrušiť
          </button>
          <button onClick={handleSubmit} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2">
            <Save className="w-4 h-4" />
            Uložiť požiadavku
          </button>
        </div>
      </div>
    </div>
  );
}
