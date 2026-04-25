import React, { useState, useEffect } from 'react';
import { X, Save, Link2, Calendar, User, Zap } from 'lucide-react';
import type { AsanaTask, AsanaTaskStatus, ProjectPriority } from '../types';
import { useProject } from '../context/ProjectContext';

interface AsanaTaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: AsanaTask;
}

const statusOptions: AsanaTaskStatus[] = ["Not started", "In progress", "Blocked", "Done", "Cancelled"];
const priorityOptions: ProjectPriority[] = ["Nízka", "Stredná", "Vysoká", "Kritická"];

export function AsanaTaskFormModal({ isOpen, onClose, initialData }: AsanaTaskFormModalProps) {
  const { activeProject, addAsanaTask, updateAsanaTask } = useProject();
  const [formData, setFormData] = useState<Partial<AsanaTask>>({
    title: '',
    description: '',
    owner: '',
    status: 'Not started',
    priority: 'Stredná',
    progress: 0,
    dueDate: '',
    milestone: '',
    sourceUrl: '',
    manualText: '',
    relatedRequirementId: '',
    relatedJiraKey: '',
    lastUpdated: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        description: '',
        owner: 'Peter (BA)',
        status: 'Not started',
        priority: 'Stredná',
        progress: 0,
        dueDate: '',
        milestone: '',
        sourceUrl: '',
        manualText: '',
        relatedRequirementId: '',
        relatedJiraKey: '',
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const val = name === 'progress' ? parseInt(value) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    if (initialData) {
      updateAsanaTask(activeProject.id, initialData.id, formData);
    } else {
      const newItem: AsanaTask = {
        ...(formData as AsanaTask),
        id: `AS-${Math.floor(100 + Math.random() * 900)}`,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      addAsanaTask(activeProject.id, newItem);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Upraviť Asana task' : 'Nový Asana task'}</h2>
            <p className="text-sm text-slate-500">Manuálna evidencia úloh z Asany</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 shadow-sm">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Názov tasku <span className="text-red-500">*</span></label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Popis</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Priorita</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                    {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex justify-between">
                  Progres (%)
                  <span className="text-indigo-600 font-bold">{formData.progress}%</span>
                </label>
                <input type="range" name="progress" min="0" max="100" value={formData.progress} onChange={handleChange} className="w-full accent-indigo-600" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Milestone</label>
                <input name="milestone" value={formData.milestone} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="M1: Core Setup" />
              </div>
            </div>

            <div className="space-y-6">
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
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Due Date
                  </label>
                  <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                  <Link2 className="w-4 h-4" />
                  Prepojenia & Zdroj
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <input name="relatedRequirementId" value={formData.relatedRequirementId} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" placeholder="REQ-001" />
                  <input name="relatedJiraKey" value={formData.relatedJiraKey} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" placeholder="LOG-123" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Asana Link</label>
                  <input name="sourceUrl" value={formData.sourceUrl} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" placeholder="https://app.asana.com/..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Manuálne vložený text (Popis z Asany)</label>
                <textarea name="manualText" value={formData.manualText} onChange={handleChange} rows={5} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none text-xs font-mono" placeholder="Vložte text z Asana tasku..." />
                <button type="button" className="mt-2 text-[10px] font-black text-indigo-600 uppercase flex items-center gap-1 hover:text-indigo-700">
                  <Zap className="w-3 h-3" /> AI Status Summary
                </button>
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
            Uložiť task
          </button>
        </div>
      </div>
    </div>
  );
}
