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
            <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">{initialData ? 'Upraviť požiadavku' : 'Nová požiadavka'}</h2>
            <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Definícia business a technických požiadaviek</p>
          </div>
          <button onClick={onClose} className="p-3 md:p-4 bg-white hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-sm text-slate-400">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <form id="requirement-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Názov požiadavky *</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-xs md:text-sm shadow-inner" />
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Popis</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none text-[11px] md:text-sm font-medium shadow-inner" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Typ</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-black appearance-none">
                    {reqTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-black appearance-none">
                    {reqStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <User className="w-3 h-3 text-slate-400" />
                    Owner
                  </label>
                  <input name="owner" value={formData.owner} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Priorita</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-black appearance-none">
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="p-5 md:p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 space-y-4 shadow-sm">
                <h3 className="text-[10px] font-black text-indigo-600 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <Link2 className="w-4 h-4" />
                  Zdroj informácií
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Pôvod</label>
                    <input name="source" value={formData.source} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Confluence, Meeting..." />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Zdrojový Link</label>
                    <input name="sourceUrl" value={formData.sourceUrl} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://..." />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Acceptance Criteria</label>
                  <button type="button" onClick={generateAC} className="text-[9px] font-black text-indigo-600 flex items-center gap-2 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 uppercase tracking-widest transition-all">
                    <Bot className="w-3.5 h-3.5" />
                    AI Generovať AC
                  </button>
                </div>
                <textarea name="acceptanceCriteria" value={formData.acceptanceCriteria} onChange={handleChange} rows={6} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none text-[11px] md:text-sm font-mono leading-relaxed shadow-inner" placeholder="1. ..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Jira Key</label>
                  <input name="relatedJiraKey" value={formData.relatedJiraKey} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold" placeholder="LOG-123" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Milestone</label>
                  <input name="relatedMilestone" value={formData.relatedMilestone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold" placeholder="M1 - MVP" />
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
          <button type="submit" form="requirement-form" className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            Uložiť požiadavku
          </button>
        </div>
      </div>
    </div>
  );
}
