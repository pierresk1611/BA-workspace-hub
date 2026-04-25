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
            <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">{initialData ? 'Upraviť Asana task' : 'Nový Asana task'}</h2>
            <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Manuálna evidencia úloh z Asany</p>
          </div>
          <button onClick={onClose} className="p-3 md:p-4 bg-white hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-sm text-slate-400">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <form id="asana-task-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Názov tasku *</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-xs md:text-sm shadow-inner" />
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Popis</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none text-[11px] md:text-sm font-medium shadow-inner" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-black appearance-none">
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Priorita</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-black appearance-none">
                    {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-indigo-50/30 rounded-[2.5rem] border border-indigo-100 space-y-6 shadow-sm">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progres</label>
                   <span className="text-sm font-black text-indigo-600">{formData.progress}%</span>
                </div>
                <input type="range" name="progress" min="0" max="100" value={formData.progress} onChange={handleChange} className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <User className="w-3 h-3 text-slate-400" />
                    Owner
                  </label>
                  <input name="owner" value={formData.owner} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Due Date
                  </label>
                  <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold" />
                </div>
              </div>

              <div className="p-5 md:p-6 bg-slate-50/50 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <Link2 className="w-4 h-4" />
                  Prepojenia
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input name="relatedRequirementId" value={formData.relatedRequirementId} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none" placeholder="REQ ID" />
                  <input name="relatedJiraKey" value={formData.relatedJiraKey} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none" placeholder="Jira Key" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Asana Link</label>
                <input name="sourceUrl" value={formData.sourceUrl} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none text-xs md:text-sm font-bold text-indigo-600 shadow-inner" placeholder="https://app.asana.com/..." />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-10 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-end gap-3 md:gap-4 shrink-0">
          <button onClick={onClose} className="w-full sm:w-auto px-8 py-4 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all">
            Zrušiť
          </button>
          <button type="submit" form="asana-task-form" className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            Uložiť task
          </button>
        </div>
      </div>
    </div>
  );
}
