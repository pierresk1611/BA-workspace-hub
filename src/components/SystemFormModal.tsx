import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import type { LinkedSystem, SystemType } from '../types';

interface SystemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: LinkedSystem;
}

const systemTypes: SystemType[] = [
  "Confluence", "Jira", "Kafka", "Asana", "Teams", "Email", 
  "Miro", "Figma", "Git repository", "API dokumentácia", 
  "Monitoring", "Interná aplikácia", "SQL / databázový zdroj", "Iné"
];

export function SystemFormModal({ isOpen, onClose, initialData }: SystemFormModalProps) {
  const { activeProjectId, addSystem, updateSystem } = useProject();

  const [formData, setFormData] = useState<Partial<LinkedSystem>>({
    type: 'Confluence',
    customTypeName: '',
    name: '',
    url: '',
    shortDescription: '',
    manualText: '',
    owner: '',
    status: 'Aktívne',
    priority: 'Stredná',
    deadline: '',
    tags: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        type: 'Confluence', customTypeName: '', name: '', url: '', 
        shortDescription: '', manualText: '', owner: '', status: 'Aktívne', 
        priority: 'Stredná', deadline: '', tags: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      updateSystem(activeProjectId, initialData.id, formData);
    } else {
      const newSystem: LinkedSystem = {
        ...(formData as any),
        id: `sys_${Date.now()}`,
        lastUpdated: 'Práve teraz'
      };
      addSystem(activeProjectId, newSystem);
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
            <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">
               {initialData ? 'Upraviť systém' : 'Pridať systém'}
            </h2>
            <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Prepojenie externých zdrojov dát</p>
          </div>
          <button onClick={onClose} className="p-3 md:p-4 bg-white hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-sm text-slate-400">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <form id="system-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
            <div className="space-y-6 md:space-y-8">
              <div className="md:col-span-2">
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Názov systému *</label>
                <input required name="name" value={formData.name || ''} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-xs md:text-sm shadow-inner" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Typ systému</label>
                  <select name="type" value={formData.type || 'Confluence'} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-black appearance-none">
                    {systemTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                   <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Priorita</label>
                   <select name="priority" value={formData.priority || 'Stredná'} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-black appearance-none">
                     <option value="Nízka">Nízka</option>
                     <option value="Stredná">Stredná</option>
                     <option value="Vysoká">Vysoká</option>
                     <option value="Kritická">Kritická</option>
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">URL / Link *</label>
                <input required type="url" name="url" value={formData.url || ''} onChange={handleChange} placeholder="https://..." className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none text-xs md:text-sm font-bold text-indigo-600 shadow-inner" />
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Krátky popis</label>
                <input name="shortDescription" value={formData.shortDescription || ''} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none text-xs md:text-sm font-medium shadow-inner" />
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span>Dáta zo systému</span>
                  <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">Len manuálne vkladanie</span>
                </label>
                <textarea 
                  required
                  name="manualText" 
                  value={formData.manualText || ''} 
                  onChange={handleChange} 
                  rows={8} 
                  placeholder="Vložte obsah z ticketu, Confluence alebo iného zdroja..."
                  className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none font-mono text-[10px] leading-relaxed shadow-inner resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Owner</label>
                  <input name="owner" value={formData.owner || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Review Date</label>
                  <input type="date" name="deadline" value={formData.deadline || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tagy</label>
                <input name="tags" value={formData.tags || ''} onChange={handleChange} placeholder="api, frontend, bug..." className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none text-xs md:text-sm font-medium shadow-inner" />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-10 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-end gap-3 md:gap-4 shrink-0">
          <button onClick={onClose} className="w-full sm:w-auto px-8 py-4 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all">
            Zrušiť
          </button>
          <button type="submit" form="system-form" className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            {initialData ? 'Uložiť zmeny' : 'Pridať systém'}
          </button>
        </div>
      </div>
    </div>
  );
}
