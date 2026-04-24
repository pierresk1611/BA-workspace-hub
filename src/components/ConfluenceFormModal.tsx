import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import type { ConfluenceSource, ConfluenceStatus } from '../types';

interface ConfluenceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ConfluenceSource;
}

const statuses: ConfluenceStatus[] = ["Draft", "Aktuálne", "Čaká na kontrolu", "Zastarané", "Nahradené"];

export function ConfluenceFormModal({ isOpen, onClose, initialData }: ConfluenceFormModalProps) {
  const { activeProjectId, addConfluenceSource, updateConfluenceSource } = useProject();

  const [formData, setFormData] = useState<Partial<ConfluenceSource>>({
    name: '',
    url: '',
    shortDescription: '',
    manualText: '',
    owner: '',
    status: 'Aktuálne',
    reviewDeadline: '',
    tags: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '', url: '', shortDescription: '', manualText: '', 
        owner: '', status: 'Aktuálne', reviewDeadline: '', tags: ''
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
    const today = new Date().toISOString().split('T')[0];
    
    if (initialData) {
      updateConfluenceSource(activeProjectId, initialData.id, {
        ...formData,
        lastChecked: today
      });
    } else {
      const newSource: ConfluenceSource = {
        ...(formData as any),
        id: `conf_${Date.now()}`,
        dateAdded: today,
        lastChecked: today
      };
      addConfluenceSource(activeProjectId, newSource);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Upraviť Confluence zdroj' : 'Pridať Confluence zdroj'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form id="conf-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Názov stránky *</label>
                <input required name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">URL (Confluence Link) *</label>
                <input required type="url" name="url" value={formData.url || ''} onChange={handleChange} placeholder="https://confluence..." className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Krátky popis</label>
                <input name="shortDescription" value={formData.shortDescription || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="col-span-2">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2 flex items-start gap-3">
                  <div className="text-amber-800 text-xs">
                    <strong>Bezpečnostné pravidlo:</strong> Aplikácia sa nesmie priamo napájať na Confluence API. 
                    Skopírujte obsah dokumentu a vložte ho sem ručne. Text sa uloží iba vo vašom lokálnom prehliadači.
                  </div>
                </div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Manuálne vložený text *</label>
                <textarea 
                  required
                  name="manualText" 
                  value={formData.manualText || ''} 
                  onChange={handleChange} 
                  rows={8} 
                  placeholder="Vložte text dokumentu..."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Owner</label>
                <input name="owner" value={formData.owner || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select name="status" value={formData.status || 'Aktuálne'} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Review Deadline</label>
                <input type="date" name="reviewDeadline" value={formData.reviewDeadline || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tagy</label>
                <input name="tags" value={formData.tags || ''} onChange={handleChange} placeholder="oddeliť čiarkou" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">
            Zrušiť
          </button>
          <button type="submit" form="conf-form" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            {initialData ? 'Uložiť zmeny' : 'Pridať zdroj'}
          </button>
        </div>
      </div>
    </div>
  );
}
