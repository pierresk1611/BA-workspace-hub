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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Upraviť systém' : 'Pridať prepojený systém'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form id="system-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Názov *</label>
                <input required name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Typ systému *</label>
                <select name="type" value={formData.type || 'Confluence'} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  {systemTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {formData.type === 'Iné' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vlastný typ systému *</label>
                  <input required name="customTypeName" value={formData.customTypeName || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              )}

              <div className={formData.type === 'Iné' ? "col-span-2" : "col-span-1"}>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL / Link *</label>
                <input required type="url" name="url" value={formData.url || ''} onChange={handleChange} placeholder="https://..." className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Krátky popis</label>
                <input name="shortDescription" value={formData.shortDescription || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center justify-between">
                  Manuálne vložený text zo systému
                  <span className="text-xs text-red-500 font-normal">Bezpečnostné pravidlo: Len ručné vkladanie</span>
                </label>
                <textarea 
                  required
                  name="manualText" 
                  value={formData.manualText || ''} 
                  onChange={handleChange} 
                  rows={6} 
                  placeholder="Skopírujte a vložte obsah z Jira ticketu, Confluence stránky alebo iného zdroja..."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Owner</label>
                <input name="owner" value={formData.owner || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <input name="status" value={formData.status || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priorita</label>
                <select name="priority" value={formData.priority || 'Stredná'} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Nízka">Nízka</option>
                  <option value="Stredná">Stredná</option>
                  <option value="Vysoká">Vysoká</option>
                  <option value="Kritická">Kritická</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deadline / Review Date</label>
                <input type="date" name="deadline" value={formData.deadline || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tagy</label>
                <input name="tags" value={formData.tags || ''} onChange={handleChange} placeholder="Napr: api, frontend, bug (oddelené čiarkou)" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">
            Zrušiť
          </button>
          <button type="submit" form="system-form" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            {initialData ? 'Uložiť zmeny' : 'Pridať systém'}
          </button>
        </div>
      </div>
    </div>
  );
}
