import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Link2 } from 'lucide-react';
import type { Deadline, DeadlineType, DeadlineStatus, ProjectPriority } from '../types';
import { useProject } from '../context/ProjectContext';

interface DeadlineFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Deadline;
}

const deadlineTypes: DeadlineType[] = [
  "Project milestone", "Jira due date", "Asana task due date", 
  "Requirement deadline", "Decision review", "Open question due date", 
  "Risk mitigation deadline", "Meeting", "Confluence review", 
  "Kafka validation", "SQL review", "SQL result validation", 
  "Status report", "Release date"
];

const statuses: DeadlineStatus[] = ["Planned", "In progress", "Waiting", "Done", "Overdue", "Cancelled"];
const priorities: ProjectPriority[] = ["Nízka", "Stredná", "Vysoká", "Kritická"];

export function DeadlineFormModal({ isOpen, onClose, initialData }: DeadlineFormModalProps) {
  const { activeProject, addDeadline, updateDeadline } = useProject();
  const [formData, setFormData] = useState<Partial<Deadline>>({
    title: '',
    type: 'Project milestone',
    date: '',
    time: '',
    owner: '',
    priority: 'Stredná',
    status: 'Planned',
    notes: '',
    relatedItemType: '',
    relatedItemId: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        type: 'Project milestone',
        date: '',
        time: '',
        owner: 'Peter (BA)',
        priority: 'Stredná',
        status: 'Planned',
        notes: '',
        relatedItemType: '',
        relatedItemId: ''
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
      updateDeadline(activeProject.id, initialData.id, formData);
    } else {
      const newItem: Deadline = {
        ...(formData as Deadline),
        id: `dl_${Date.now()}`,
        relatedProjectId: activeProject.id
      };
      addDeadline(activeProject.id, newItem);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Upraviť deadline' : 'Vytvoriť nový deadline'}</h2>
            <p className="text-sm text-slate-500">Centrálna evidencia termínov a míľnikov</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 shadow-sm">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Názov termínu <span className="text-red-500">*</span></label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="napr. Release v1.0.0" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Typ</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                  {deadlineTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Dátum <span className="text-red-500">*</span>
                </label>
                <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Čas (nepovinné)</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  Owner
                </label>
                <input name="owner" value={formData.owner} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Meno zodpovednej osoby" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Priorita</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-4">
              <h4 className="text-xs font-bold text-indigo-700 flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Prepojenie na entitu
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Typ entity</label>
                  <select name="relatedItemType" value={formData.relatedItemType} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none">
                    <option value="">Žiadne</option>
                    <option value="Requirement">Požiadavka</option>
                    <option value="JiraItem">Jira položka</option>
                    <option value="SQLQuery">SQL dotaz</option>
                    <option value="DataFlow">Dátový tok</option>
                    <option value="ConfluenceSource">Dokument</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">ID / Názov položky</label>
                  <input name="relatedItemId" value={formData.relatedItemId} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" placeholder="napr. REQ-001" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Poznámky</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none text-sm" />
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm">
            Zrušiť
          </button>
          <button onClick={handleSubmit} className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md">
            {initialData ? 'Uložiť zmeny' : 'Vytvoriť deadline'}
          </button>
        </div>
      </div>
    </div>
  );
}
