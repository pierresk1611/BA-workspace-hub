import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { JiraItem, JiraItemType, JiraStatus, ProjectPriority } from '../types';
import { useProject } from '../context/ProjectContext';

interface JiraFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: JiraItem;
}

const itemTypes: JiraItemType[] = ["Epic", "Story", "Task", "Bug", "Spike", "Sub-task"];
const statuses: JiraStatus[] = ["Backlog", "To Do", "In Progress", "Blocked", "In Review", "Done", "Cancelled"];
const priorities: ProjectPriority[] = ["Nízka", "Stredná", "Vysoká", "Kritická"];

export function JiraFormModal({ isOpen, onClose, initialData }: JiraFormModalProps) {
  const { activeProject, addJiraItem, updateJiraItem } = useProject();
  const [formData, setFormData] = useState<Partial<JiraItem>>({
    key: '',
    title: '',
    type: 'Story',
    url: '',
    manualText: '',
    status: 'To Do',
    priority: 'Stredná',
    assignee: '',
    reporter: '',
    linkedRequirement: '',
    linkedMilestone: '',
    deadline: '',
    lastChecked: new Date().toISOString().split('T')[0],
    tags: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        key: '',
        title: '',
        type: 'Story',
        url: '',
        manualText: '',
        status: 'To Do',
        priority: 'Stredná',
        assignee: '',
        reporter: '',
        linkedRequirement: '',
        linkedMilestone: '',
        deadline: '',
        lastChecked: new Date().toISOString().split('T')[0],
        tags: ''
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
      updateJiraItem(activeProject.id, initialData.id, formData);
    } else {
      const newItem: JiraItem = {
        ...(formData as JiraItem),
        id: `jira_${Date.now()}`
      };
      addJiraItem(activeProject.id, newItem);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Upraviť Jira položku' : 'Pridať novú Jira položku'}</h2>
            <p className="text-sm text-slate-500">Zadajte údaje o Jira tickete manuálne</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 shadow-sm">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Jira Key <span className="text-red-500">*</span></label>
                <input required name="key" value={formData.key} onChange={handleChange} placeholder="napr. PROJ-101" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Názov položky <span className="text-red-500">*</span></label>
                <input required name="title" value={formData.title} onChange={handleChange} placeholder="Krátky názov ticketu" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Typ</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    {itemTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Priorita</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Deadline <span className="text-red-500">*</span></label>
                  <input required type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Jira URL</label>
                <input name="url" value={formData.url} onChange={handleChange} placeholder="https://jira.internal/browse/..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Assignee</label>
                  <input name="assignee" value={formData.assignee} onChange={handleChange} placeholder="Meno riešiteľa" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Reporter</label>
                  <input name="reporter" value={formData.reporter} onChange={handleChange} placeholder="Meno zadávateľa" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Linked Requirement</label>
                  <input name="linkedRequirement" value={formData.linkedRequirement} onChange={handleChange} placeholder="napr. REQ-001" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Linked Milestone</label>
                  <input name="linkedMilestone" value={formData.linkedMilestone} onChange={handleChange} placeholder="napr. MVP" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tagy</label>
                <input name="tags" value={formData.tags} onChange={handleChange} placeholder="security, backend, bug fix..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Manuálne vložený Jira text <span className="text-red-500">*</span></label>
                <textarea required name="manualText" value={formData.manualText} onChange={handleChange} rows={5} placeholder="Skopírujte text z Jira ticketu..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-mono text-sm" />
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm">
            Zrušiť
          </button>
          <button onClick={handleSubmit} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md">
            {initialData ? 'Uložiť zmeny' : 'Pridať ticket'}
          </button>
        </div>
      </div>
    </div>
  );
}
